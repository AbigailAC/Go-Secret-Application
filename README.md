---

# Secrets Manager

A simple RESTful API built with Go and the Gin framework to manage and store secrets. Users can view, add, and retrieve secrets with associated passwords.

## Features

- **List All Secrets**: Display a list of all secrets with their names and IDs on the frontend.
- **Add a Secret**: A button prompts users to input a new secret, its name, and an associated password.
- **Reveal a Secret**: Click a button to provide the password for a specific secret and view its contents.
- **Backend Password Verification**: Provide a password to retrieve the associated secret details. If incorrect, an error message will be shown.

## Getting Started

### Prerequisites

- [Go](https://golang.org/dl/) (version 1.21 or later)
- [Gin framework](https://github.com/gin-gonic/gin)
- A modern web browser
- 
### Installation

1. Clone the repository:

```bash
git clone [your-repo-link]
```

2. Navigate to the project directory:

```bash
cd [your-directory-name]
```

3. Install necessary Go packages:

```bash
go get -u
```
4. To start the frontend, you might need to host it using a static server or integrate it into your development environment based on your project setup. The easiest way would be to use a simple HTTP server or through extensions available on code editors (like Live Server for VS Code).

### Running the Application

To start the server, simply run:

```bash
go run main.go
```

The API will be running on `http://localhost:8080`.

Note: this is simply a barebones test version. Future versions will operate differently.

## Current Endpoints

- **GET** `/secrets`: Retrieve a list of all secrets.
- **POST** `/secrets`: Add a new secret. Requires a JSON body with `SecretId`, `SecretName`, `Secret`, and `SecretPW`.
- **GET** `/secrets/:secretId:` Extract a secret's name by id without password verification (will be removed in final version)
- POST `/secrets/:secretId:` Fetch a specific secret by its ID after verifying the provided password.

## Frontend 

- A table of secret IDs and Names with a "reveal secret" button.
- An "add secret" button to input and add a new secret.

##  TO DO LIST: 
- Eventually move to React-based frontend
- Integrate with database instead of using in-memory slices
- Implement AES instead of storing passwords directly
- Add user accounts and authentication

