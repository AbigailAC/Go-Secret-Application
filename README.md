---

# Secrets Manager

A simple RESTful API built with Go and the Gin framework to manage and store secrets. Users can view, add, and retrieve secrets with associated passwords.

## Features

- **List All Secrets**: Retrieve a list of all secrets with their names and IDs.
- **Add a Secret**: Submit a new secret, its name, and associated password.
- **Retrieve a Secret by ID**: Provide a secret ID to retrieve the associated secret details.

## Getting Started

### Prerequisites

- Go (version 1.21 or later)
- Gin framework

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
- **GET** `/secrets/:secretId`: Retrieve a specific secret by its ID.

## Frontend (Coming Soon)

The upcoming frontend will feature:

- A table of secret IDs and Names with a "reveal secret" button.
- An "add secret" button to input and add a new secret.
- Eventually move to React-based frontend. 

