package main

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.GET("/secrets", getSecrets)
	router.GET("/secrets", getSecrets)
	router.GET("/secrets/:secretId", getSecretByID)
	router.POST("/secrets", postSecrets)
	router.Run("localhost:8080")
}

type secret struct {
	SecretId   int    `json:"secretId"`
	SecretName string `json:"secretName"`
	Secret     string `json:"secret"`
	SecretPW   string `json:"secretPW"`
}

var secrets = []secret{
	{SecretId: 1, SecretName: "Secret one", Secret: "Hi", SecretPW: "123"},
	{SecretId: 2, SecretName: "Secret two", Secret: "Hii", SecretPW: "1234"},
	{SecretId: 3, SecretName: "Secret three", Secret: "Hiii", SecretPW: "12345a"},
}

// getSecrets responds with a list of all secrets as JSON
func getSecrets(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, secrets)
}

// postSecrets adds a secret from JSON received in the request body
func postSecrets(c *gin.Context) {
	var newSecret secret

	// Call BindJSON to bind the received JSON to newSecret
	if err := c.BindJSON(&newSecret); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed binding JSON", "details": err.Error()})
		return
	}

	// Add the new secret to the slice.
	secrets = append(secrets, newSecret)
	c.IndentedJSON(http.StatusCreated, newSecret)
}

func getSecretByName(c *gin.Context) {
	// Get secret name from the URL
	name := c.Param("secretName")

	// Loop over the list of secrets, look for
	for _, a := range secrets {
		if a.SecretName == name {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
}

// getSecretsByID locates the secret whose ID matches the id parameter sent by the client
// then returns that secret as a response.
func getSecretByID(c *gin.Context) {
	// Get id from the URL
	secretIdStr := c.Param("secretId")
	ID, err := strconv.Atoi(secretIdStr)

	// Verify that the id is valid
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid secret ID"})
		return
	}

	// Loop over the list of secrets, look for
	// an secret with a matching id.
	for _, a := range secrets {
		if a.SecretId == ID {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}
	// If no secret with the id is found, return
	c.JSON(http.StatusNotFound, gin.H{"error": "Secret not found"})
}
