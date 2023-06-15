use diesel::prelude::*;
use diesel::SqliteConnection;

use crate::models::CreateTheme;
use crate::models::Theme;
use crate::models::UpdateTheme;
use crate::prelude::Result;

use super::BaseBmc;

pub struct ThemeBmc {}

impl ThemeBmc {
    pub fn create(conn: &mut SqliteConnection, data: &CreateTheme) -> Result<i32> {
        use crate::db::schema::themes;

        diesel::insert_into(themes::table)
            .values(data)
            .execute(conn)?;
        BaseBmc::get_last_insert_id(conn)
    }
    pub fn update(conn: &mut SqliteConnection, id: i32, data: &UpdateTheme) -> Result<i32> {
        use crate::db::schema::themes::dsl;

        diesel::update(dsl::themes.find(id))
            .set(data)
            .execute(conn)?;
        Ok(id)
    }
    pub fn delete(conn: &mut SqliteConnection, id: i32) -> Result<i32> {
        use crate::db::schema::themes::dsl;

        diesel::delete(dsl::themes.find(id)).execute(conn)?;
        Ok(id)
    }
    pub fn get(conn: &mut SqliteConnection, id: i32) -> Result<Theme> {
        use crate::db::schema::themes::dsl;

        let theme = dsl::themes.find(id).first(conn)?;
        Ok(theme)
    }
    pub fn get_list(conn: &mut SqliteConnection) -> Result<Vec<Theme>> {
        use crate::db::schema::themes::dsl;

        let themes = dsl::themes.load(conn)?;
        Ok(themes)
    }
    pub fn create_default_themes(conn: &mut SqliteConnection) -> Result<()> {
        let query = r#"
            INSERT INTO themes (label, favorite, window_hex, base_hex, primary_hex, text_hex) VALUES 
            ('forest', 0, '#002a37', '#65c3b1', '#0feda2', '#EBEBEB'),
            ('abyss', 0, '#222831', '#77CED2', '#00ADB5', '#EEEEEE'),
            ('space', 0, '#120A2B', '#78A2B3', '#01A8B5', '#FAEDF0'),
            ('dracula', 0, '#282a36', '#d1bdf1', '#bd93f9', '#f8f8f2'),
            ('blaze', 0, '#112B3C', '#f79385', '#F66B0E', '#EFEFEF'),
            ('snow', 0, '#E4EDED', '#6F96F8', '#4685FF', '#1F1F21');
        "#;
        diesel::sql_query(query).execute(conn)?;
        Ok(())
    }
}

#[cfg(test)]
mod theme_bmc_tests {
    use diesel::result::Error::NotFound;

    use crate::{db::Db, prelude::Error};

    use super::*;

    #[test]
    fn create_theme_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create theme.
        let data = CreateTheme {
            label: "void".to_string(),
            window_hex: "#000000".to_string(),
            base_hex: "#000000".to_string(),
            text_hex: "#000000".to_string(),
            primary_hex: "#000000".to_string(),
        };
        let id = ThemeBmc::create(&mut conn, &data).unwrap();

        assert_eq!(id, 1);
    }

    #[test]
    fn update_theme_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create theme.
        let data = CreateTheme {
            label: "void".to_string(),
            window_hex: "#000000".to_string(),
            base_hex: "#000000".to_string(),
            text_hex: "#000000".to_string(),
            primary_hex: "#000000".to_string(),
        };
        let id = ThemeBmc::create(&mut conn, &data).unwrap();
        // Update theme.
        let data = UpdateTheme {
            label: Some("light".to_string()),
            favorite: None,
            window_hex: Some("#FFFFFF".to_string()),
            base_hex: Some("#FFFFFF".to_string()),
            text_hex: Some("#FFFFFF".to_string()),
            primary_hex: Some("#FFFFFF".to_string()),
        };
        let id = ThemeBmc::update(&mut conn, id, &data).unwrap();
        // Query theme and test it's values.
        let theme = ThemeBmc::get(&mut conn, id).unwrap();

        assert_eq!(theme.id, 1);
        assert_eq!(theme.label, "light".to_string());
        assert_eq!(theme.favorite, false);
        assert_eq!(theme.window_hex, "#FFFFFF".to_string());
        assert_eq!(theme.base_hex, "#FFFFFF".to_string());
        assert_eq!(theme.text_hex, "#FFFFFF".to_string());
        assert_eq!(theme.primary_hex, "#FFFFFF".to_string());
    }

    #[test]
    fn delete_theme_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create theme.
        let data = CreateTheme {
            label: "void".to_string(),
            window_hex: "#000000".to_string(),
            base_hex: "#000000".to_string(),
            text_hex: "#000000".to_string(),
            primary_hex: "#000000".to_string(),
        };
        let id = ThemeBmc::create(&mut conn, &data).unwrap();
        // Delete theme.
        let id = ThemeBmc::delete(&mut conn, id).unwrap();
        // Query non existent row.
        let result = ThemeBmc::get(&mut conn, id);

        assert!(matches!(result, Err(Error::DieselError(NotFound))));
    }

    #[test]
    fn get_theme_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create theme.
        let data = CreateTheme {
            label: "void".to_string(),
            window_hex: "#000000".to_string(),
            base_hex: "#000000".to_string(),
            text_hex: "#000000".to_string(),
            primary_hex: "#000000".to_string(),
        };
        let id = ThemeBmc::create(&mut conn, &data).unwrap();
        // Query theme.
        let theme = ThemeBmc::get(&mut conn, id).unwrap();

        assert_eq!(theme.id, 1);
        assert_eq!(theme.label, "void".to_string());
        assert_eq!(theme.favorite, false);
        assert_eq!(theme.window_hex, "#000000".to_string());
        assert_eq!(theme.base_hex, "#000000".to_string());
        assert_eq!(theme.text_hex, "#000000".to_string());
        assert_eq!(theme.primary_hex, "#000000".to_string());
    }

    #[test]
    fn get_list_of_themes_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        // Create 10 themes.
        for _ in 0..10 {
            let data = CreateTheme {
                label: "void".to_string(),
                window_hex: "#000000".to_string(),
                base_hex: "#000000".to_string(),
                text_hex: "#000000".to_string(),
                primary_hex: "#000000".to_string(),
            };
            ThemeBmc::create(&mut conn, &data).unwrap();
        }
        let themes = ThemeBmc::get_list(&mut conn).unwrap();

        assert_eq!(themes.len(), 10);
    }

    #[test]
    fn create_default_themes_test() {
        let mut conn = Db::establish_test_connection().unwrap();
        ThemeBmc::create_default_themes(&mut conn).unwrap();

        let themes = ThemeBmc::get_list(&mut conn).unwrap();

        assert_eq!(themes.len(), 6);
    }
}
