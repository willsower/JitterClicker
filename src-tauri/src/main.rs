// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{
    sync::{Arc, Mutex},
    thread,
    time::Duration,
};

use enigo::{
    Button as EnigoButton,
    Coordinate,
    Direction,
    Enigo,
    Mouse,
    Settings,
};
use rand::Rng;
use serde::Deserialize;
use tauri::State;

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "kebab-case")]
enum Mode {
    UntilStopped,
    Repeat,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "kebab-case")]
enum Button {
    Left,
    Right,
    Middle,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "kebab-case")]
enum ClickType {
    Single,
    Double,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "kebab-case")]
enum LocationMode {
    Cursor,
    Fixed,
}

#[derive(Debug, Deserialize, Clone)]
#[serde(rename_all = "kebab-case")]
enum ClickPattern {
    Constant,
    Jitter,
}

#[derive(Debug, Deserialize, Clone)]
struct StartConfig {
    pattern: ClickPattern,
    clicks_per_second: u64,
    jitter_min_ms: u64,
    jitter_max_ms: u64,
    mode: Mode,
    repeat_count: u64,
    button: Button,
    click_type: ClickType,
    location_mode: LocationMode,
    fixed_x: i32,
    fixed_y: i32,
    start_delay_sec: u64,
}

struct AppState {
    running: bool,
    handle: Option<thread::JoinHandle<()>>,
}

type SharedState = Arc<Mutex<AppState>>;

#[tauri::command]
fn start_clicking(state: State<SharedState>, config: StartConfig) -> Result<(), String> {
    let mut st = state.lock().unwrap();
    if st.running {
        return Err("Already running".into());
    }

    st.running = true;
    let shared_state = state.inner().clone();

    let handle = thread::spawn(move || {
        if config.start_delay_sec > 0 {
            thread::sleep(Duration::from_secs(config.start_delay_sec));
        }

        let mut enigo = match Enigo::new(&Settings::default()) {
            Ok(e) => e,
            Err(e) => {
                eprintln!("Failed to init Enigo: {:?}", e);
                let mut s = shared_state.lock().unwrap();
                s.running = false;
                return;
            }
        };

        let mouse_button: EnigoButton = match config.button {
            Button::Left => EnigoButton::Left,
            Button::Right => EnigoButton::Right,
            Button::Middle => EnigoButton::Middle,
        };

        let cps = config.clicks_per_second.max(1);
        let interval_ms = (1000 / cps).max(10);

        let mut jitter_min_ms = config.jitter_min_ms.max(1);
        let mut jitter_max_ms = config.jitter_max_ms.max(1);
        if jitter_min_ms > jitter_max_ms {
            std::mem::swap(&mut jitter_min_ms, &mut jitter_max_ms);
        }

        let mut rng = rand::thread_rng();

        let click_once = |enigo: &mut Enigo| {
            match config.location_mode {
                LocationMode::Cursor => {
                    match config.click_type {
                        ClickType::Single => {
                            let _ = enigo.button(mouse_button, Direction::Click);
                        }
                        ClickType::Double => {
                            let _ = enigo.button(mouse_button, Direction::Click);
                            let _ = enigo.button(mouse_button, Direction::Click);
                        }
                    }
                }
                LocationMode::Fixed => {
                    let _ = enigo.move_mouse(
                        config.fixed_x,
                        config.fixed_y,
                        Coordinate::Abs,
                    );
                    match config.click_type {
                        ClickType::Single => {
                            let _ = enigo.button(mouse_button, Direction::Click);
                        }
                        ClickType::Double => {
                            let _ = enigo.button(mouse_button, Direction::Click);
                            let _ = enigo.button(mouse_button, Direction::Click);
                        }
                    }
                }
            }
        };

        match config.pattern {
            ClickPattern::Constant => {
                match config.mode {
                    Mode::UntilStopped => {
                        while {
                            let s = shared_state.lock().unwrap();
                            s.running
                        } {
                            click_once(&mut enigo);
                            thread::sleep(Duration::from_millis(interval_ms));
                        }
                    }
                    Mode::Repeat => {
                        for _ in 0..config.repeat_count {
                            {
                                let s = shared_state.lock().unwrap();
                                if !s.running {
                                    break;
                                }
                            }
                            click_once(&mut enigo);
                            thread::sleep(Duration::from_millis(interval_ms));
                        }
                        let mut s = shared_state.lock().unwrap();
                        s.running = false;
                    }
                }
            }
            ClickPattern::Jitter => {
                match config.mode {
                    Mode::UntilStopped => {
                        while {
                            let s = shared_state.lock().unwrap();
                            s.running
                        } {
                            let delay = rng.gen_range(jitter_min_ms..=jitter_max_ms);
                            thread::sleep(Duration::from_millis(delay));
                            click_once(&mut enigo);
                        }
                    }
                    Mode::Repeat => {
                        for _ in 0..config.repeat_count {
                            {
                                let s = shared_state.lock().unwrap();
                                if !s.running {
                                    break;
                                }
                            }
                            let delay = rng.gen_range(jitter_min_ms..=jitter_max_ms);
                            thread::sleep(Duration::from_millis(delay));
                            click_once(&mut enigo);
                        }
                        let mut s = shared_state.lock().unwrap();
                        s.running = false;
                    }
                }
            }
        }
    });

    st.handle = Some(handle);
    Ok(())
}

#[tauri::command]
fn stop_clicking(state: State<SharedState>) -> Result<(), String> {
    let mut st = state.lock().unwrap();
    if !st.running {
        return Ok(());
    }

    st.running = false;
    st.handle = None;

    Ok(())
}

fn main() {
    tauri::Builder::default()
        .manage(Arc::new(Mutex::new(AppState {
            running: false,
            handle: None,
        })))
        .invoke_handler(tauri::generate_handler![start_clicking, stop_clicking])
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
