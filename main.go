package main

import (
	"net/http"
	"strconv"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	// Set the router as the default one shipped with Gin and apply the CORS middleware to the router.
	router := gin.Default()
	router.Use(SetupCORS())

	router.GET("/secrets", getSecrets)
	router.GET("/secrets/:secretId", getSecretByID)
	router.POST("/secrets", postSecrets)
	router.POST("/secrets/:secretId", verifySecret)

	router.Run(":8080")
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

func getSecrets(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, secrets)
}

func postSecrets(c *gin.Context) {
	var newSecret secret

	if err := c.BindJSON(&newSecret); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed binding JSON", "details": err.Error()})
		return
	}

	// Automatically assign an ID to the new secret
	newSecret.SecretId = len(secrets) + 1
	secrets = append(secrets, newSecret)
	c.IndentedJSON(http.StatusCreated, newSecret)
}

func getSecretByID(c *gin.Context) {
	secretIdStr := c.Param("secretId")
	ID, err := strconv.Atoi(secretIdStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid secret ID"})
		return
	}

	for _, a := range secrets {
		if a.SecretId == ID {
			c.IndentedJSON(http.StatusOK, a)
			return
		}
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Secret not found"})
}

func verifySecret(c *gin.Context) {
	// Extract the secretId from the URL
	secretIdStr := c.Param("secretId")
	ID, err := strconv.Atoi(secretIdStr)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid secret ID"})
		return
	}

	// Define a struct to parse the JSON request body into
	var requestBody struct {
		SecretPassword string `json:"secretPassword"`
	}

	// Parse the incoming JSON request body into the defined struct
	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed binding JSON"})
		return
	}

	// Iterate over the secrets to find the one with the matching ID
	for _, a := range secrets {
		if a.SecretId == ID {
			// If the provided password matches the secret's password, return the secret
			if a.SecretPW == requestBody.SecretPassword {
				c.JSON(http.StatusOK, gin.H{"Secret": a.Secret})
				return
			} else {
				// If passwords don't match, send an Unauthorized response
				c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
				return
			}
		}
	}

	// If no matching secret is found, send a Not Found response
	c.JSON(http.StatusNotFound, gin.H{"error": "Secret not found"})
}

// SetupCORS configures and returns a CORS middleware.
func SetupCORS() gin.HandlerFunc {
	return cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	})
}
