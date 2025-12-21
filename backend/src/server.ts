import express from 'express';
import dotenv from 'dotenv';
import authRoutes from "@/routes/auth.routes";

dotenv.config();

const app = express();
const PORT = process.env["PORT"] || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);

app.get('/', (req, res) => {
    res.send("Todo-Lite Backend is running");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});