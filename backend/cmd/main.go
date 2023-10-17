package secret_application

import (
	"backend/database"
	"backend/handlers"
	"backend/middleware"

	"github.com/gin-gonic/gin"
)

func main() {
	router := gin.Default()
	router.Use(middleware.SetupCORS())

	handlers.InitializeRoutes(router) // This will set up all our routes

	// Setup database
	database.InitializeDatabase()
	defer database.CloseDatabase()

	router.Run(":8080")
}
