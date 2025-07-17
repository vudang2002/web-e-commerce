import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "E-Commerce API",
      version: "1.0.0",
      description: "API documentation for the E-Commerce application",
      contact: {
        name: "Developer Team",
        email: "dev@example.com"
      },
      license: {
        name: "MIT License",
        url: "https://opensource.org/licenses/MIT"
      }
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Development server",
      },
      {
        url: "https://api.example.com",
        description: "Production server",
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        ErrorResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: false
            },
            error: {
              type: "string",
              example: "Error message"
            }
          }
        },
        SuccessResponse: {
          type: "object",
          properties: {
            success: {
              type: "boolean",
              example: true
            },
            data: {
              type: "object"
            }
          }
        }
      }
    },
    tags: [
      {
        name: "Authentication",
        description: "API endpoints for user authentication"
      },
      {
        name: "Users",
        description: "API endpoints for managing users"
      },
      {
        name: "Products",
        description: "API endpoints for managing products"
      },
      {
        name: "Categories",
        description: "API endpoints for managing categories"
      },
      {
        name: "Brands",
        description: "API endpoints for managing brands"
      },
      {
        name: "Reviews",
        description: "API endpoints for managing reviews"
      },
      {
        name: "Cart",
        description: "API endpoints for managing shopping cart"
      },
      {
        name: "Orders",
        description: "API endpoints for managing orders"
      },
      {
        name: "Vouchers",
        description: "API endpoints for managing vouchers"
      },
      {
        name: "Search",
        description: "API endpoints for search functionality"
      },
      {
        name: "Upload",
        description: "API endpoints for file uploads"
      },
      {
        name: "Chatbot",
        description: "API endpoints for chatbot integration"
      },
      {
        name: "Health",
        description: "API endpoints for system health monitoring"
      }
    ]
  },
  apis: ["./src/routes/*.js", "./src/swagger-models.js"], // Đường dẫn tới các file định nghĩa API
};

const swaggerSpec = swaggerJsDoc(options);

export default (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "E-Commerce API Documentation",
    customfavIcon: "/favicon.ico"
  }));
};
