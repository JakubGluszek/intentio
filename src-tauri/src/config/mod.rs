use std::{
    fs,
    path::{Path, PathBuf},
};

use serde::{Deserialize, Serialize};

mod settings;
mod timer;

use serde_json::Value;
pub use settings::*;
pub use timer::*;

use crate::prelude::Result;

/// Config trait for JSON based configs which should be stored and read from the hard drive.
pub trait Config: Default + Serialize + for<'de> Deserialize<'de> {
    fn file_path(base_dir: &PathBuf) -> PathBuf;
}

/// Deals with the app's JSON based config files.
pub struct ConfigManager {}

impl ConfigManager {
    /// Reads specified config from file.
    pub fn get<T: Config>() -> Result<T> {
        let path = T::file_path(&Self::config_path());
        let value = Self::read_json(&path)?;
        let config = serde_json::from_value(value)?;
        Ok(config)
    }

    /// Updates specified config and saves it to disk.
    pub fn update<T: Config, D: Serialize + Deserialize<'static>>(data: D) -> Result<T> {
        let mut config = Self::get::<T>()?;
        let config_value: Value = serde_json::to_value(&config)?;
        let data_value: Value = serde_json::to_value(&data)?;

        if let (Value::Object(mut config_map), Value::Object(data_map)) = (config_value, data_value)
        {
            for (key, value) in data_map {
                if let Some(existing_value) = config_map.get_mut(&key) {
                    *existing_value = value;
                }
            }

            config = serde_json::from_value(Value::Object(config_map))?;
        }

        let path = T::file_path(&Self::config_path());
        Self::write_json(&path, &config)?;

        return Ok(config);
    }

    /// Writes specified config to disk.
    pub fn save<D: Config>(data: &D) -> Result<()> {
        let path = D::file_path(&Self::config_path());
        Self::write_json(&path, data)?;
        Ok(())
    }

    /// Writes value to disk.
    pub fn write_json<D: Serialize>(path: &PathBuf, data: &D) -> Result<()> {
        let content = serde_json::to_string_pretty(data)?;
        fs::write(&path, content)?;
        Ok(())
    }

    /// Reads value from disk.
    pub fn read_json(path: &PathBuf) -> Result<Value> {
        let contents = fs::read_to_string(path)?;
        let value: Value = serde_json::from_str(&contents)?;
        Ok(value)
    }

    /// A setup type function to validate that the config file is up to date with it's corresponding struct.
    pub fn validate<C: Config>() -> Result<()> {
        let path = C::file_path(&Self::config_path());
        // try to read config file, parse contents into serde_json::Value
        let file_value = match Self::read_json(&path) {
            Ok(value) => value,
            Err(_) => {
                Self::restore_default::<C>()?;
                return Ok(());
            }
        };
        // get default struct value, turn into serde_json::Value
        let default_value = serde_json::to_value(C::default())?;
        // iterate over default value keys, update it's values with the config values
        if let (Value::Object(mut default_map), Value::Object(file_map)) =
            (default_value, file_value)
        {
            for (key, value) in file_map {
                if let Some(existing_value) = default_map.get_mut(&key) {
                    *existing_value = value;
                }
            }

            let final_value = Value::Object(default_map);
            Self::write_json(&path, &final_value)?;
        }

        Ok(())
    }

    pub fn restore_default<C: Config>() -> Result<()> {
        let path = C::file_path(&Self::config_path());
        Self::write_json(&path, &C::default())?;
        Ok(())
    }

    /// Creates the config directory.
    pub fn create_root_dir() -> Result<()> {
        fs::create_dir(&Self::config_path())?;
        Ok(())
    }

    /// Determines whether config directory exists.
    pub fn verify_root_dir() -> bool {
        Path::new(&Self::config_path()).is_dir()
    }

    /// Provides a path to the app's config directory.
    pub fn config_path() -> PathBuf {
        tauri::api::path::config_dir().unwrap().join("intentio/")
    }
}
