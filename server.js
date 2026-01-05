require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./utils/db');
const session = require("express-session");
const passport = require("passport");
require("./passport");

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
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT"
                }
            }
        },
        security: [
            {
                bearerAuth: []
            }
        ]
    },
    apis: ["./routes/*.js"]
};
const specs = swaggerJsdoc(options);

const app = express();
const cookieParser = require("cookie-parser");
app.use(cookieParser());

app.use(express.json());
app.use(cors({
    origin: `${process.env.CLIENT_URL}`,
    credentials: true,
}));
app.use(session({
    secret: process.env.SESSION_SECRET || "aurocore-secret",
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || '';

if (!MONGO_URI) {
    console.error('Missing MONGO_URI in .env');
    process.exit(1);
}

connectDB(MONGO_URI);


app.use('/api/auth', require('./routes/auth'));

app.use('/api/journals', require('./routes/journal'));
app.use('/api/plans', require('./routes/plan'));
app.use('/api/user', require('./routes/user'));
app.use('/api/habits', require('./routes/habits'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/tracker', require('./routes/tracker'));
app.use('/api/memories', require('./routes/memory'));
app.use('/api/milestones', require('./routes/milestones'));
app.use('/api/notes', require('./routes/notes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: Date.now()}));
const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

server.on('error', (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to a different value.`);
        process.exit(1);
    }
    throw err;
});
