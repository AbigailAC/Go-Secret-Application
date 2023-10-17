package database

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func InitializeDatabase() {
	var err error
	db, err = sql.Open("sqlite3", "./secrets.db")
	if err != nil {
		log.Fatal(err)
	}

	// Create table
	_, err = db.Exec(`CREATE TABLE IF NOT EXISTS secrets (id INTEGER PRIMARY KEY, name TEXT, secret TEXT, secretPW TEXT)`)
	if err != nil {
		log.Fatal("Failed to create table:", err)
	}
}

func CloseDatabase() {
	db.Close()
}

func GetAllSecrets() (*sql.Rows, error) {
	return db.Query("SELECT id, name, secret, secretPW FROM secrets")
}

func InsertSecret(name, secret, secretPW string) (sql.Result, error) {
	return db.Exec(`INSERT INTO secrets (name, secret, secretPW) VALUES (?, ?, ?)`, name, secret, secretPW)
}

func GetSecretByID(ID int) *sql.Row {
	return db.QueryRow("SELECT id, name, secret, secretPW FROM secrets WHERE id=?", ID)
}

func VerifySecretPassword(secretID int, inputPassword string) (bool, error) {
	var storedPassword string
	err := db.QueryRow("SELECT secretPW FROM secrets WHERE id=?", secretID).Scan(&storedPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("No secret found with ID: %d\n", secretID)
			return false, err
		} else {
			log.Printf("Failed to query the database: %v\n", err)
			return false, err
		}
	}

	isValid := inputPassword == storedPassword
	return isValid, nil
}
