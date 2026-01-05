const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Auro API",
            version: "1.0.0",
            description: "API documentation for the Auro project"
        },
        servers: [
            {
                url: "https://new-rest.vercel.app/api",
                description: "Development server"
            }
        ]
    },
    apis: ["./routes/*.js"]
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs};
