import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "@/routes/auth.routes";
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env["PORT"] || 3000;

const allowedOrigins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173"
];

// Middleware
app.use(express.json());

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Routes
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    res.send("Todo-Lite Backend is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});