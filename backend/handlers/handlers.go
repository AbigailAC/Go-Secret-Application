package handlers

import (
	"backend/database"
	"database/sql"
	"log"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// InitializeRoutes initializes all routes for the application
func InitializeRoutes(router *gin.Engine) {
	router.GET("/secrets", getSecrets)
	router.GET("/secrets/:secretId", getSecretByID)
	router.POST("/secrets", postSecrets)
	router.POST("/secrets/:secretId", verifySecret)
}

type secret struct {
	SecretId   int    `json:"secretId"`
	SecretName string `json:"secretName"`
	Secret     string `json:"secret"`
	SecretPW   string `json:"secretPW"`
}

func getSecrets(c *gin.Context) {
	rows, err := database.GetAllSecrets()
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed retrieving secrets"})
		return
	}
	c.IndentedJSON(http.StatusOK, rows)
}

func postSecrets(c *gin.Context) {
	var newSecret secret
	if err := c.BindJSON(&newSecret); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed binding JSON", "details": err.Error()})
		return
	}

	result, err := database.InsertSecret(newSecret.SecretName, newSecret.Secret, newSecret.SecretPW)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed inserting new secret"})
		return
	}

	id, err := result.LastInsertId() // Extract the int value from the sql.Result object
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed getting new secret ID"})
		return
	}

	newSecret.SecretId = int(id)
	c.IndentedJSON(http.StatusCreated, newSecret)
}

func getSecretByID(c *gin.Context) {
	secretIdStr := c.Param("secretId")
	ID, err := strconv.Atoi(secretIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid secret ID"})
		return
	}

	row := database.GetSecretByID(ID)
	var s secret
	err = row.Scan(&s.SecretId, &s.SecretName, &s.Secret, &s.SecretPW)

	if err == sql.ErrNoRows {
		c.JSON(http.StatusNotFound, gin.H{"error": "Secret not found"})
		return
	} else if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed retrieving secret"})
		return
	}

	c.IndentedJSON(http.StatusOK, s)
}

func verifySecret(c *gin.Context) {
	secretIdStr := c.Param("secretId")
	ID, err := strconv.Atoi(secretIdStr)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid secret ID"})
		return
	}

	var requestBody struct {
		SecretPassword string `json:"secretPassword"`
	}

	if err := c.BindJSON(&requestBody); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Failed binding JSON"})
		return
	}

	isValid, err := database.VerifySecretPassword(ID, requestBody.SecretPassword)
	if err != nil {
		if err == sql.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "Secret not found"})
			return
		} else {
			log.Println(err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed verifying password"})
			return
		}
	}

	if isValid {
		c.JSON(http.StatusOK, gin.H{"message": "Password verified"})
	} else {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Incorrect password"})
	}
}
