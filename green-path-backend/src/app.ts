import express from "express";
import cors from "cors";
import { supabase } from "./config/supabaseClient";
import routeRoutes from "./routes/routeRoutes";

const app = express();

// =======================
// Middlewares
// =======================
app.use(cors());
app.use(express.json());

// =======================
// Root Test Route
// =======================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Green Pulse Backend Running 🚀",
  });
});

// =======================
// Main Routes API
// =======================
app.use("/api/routes", routeRoutes);

// =======================
// Supabase Connection Test
// =======================
app.get("/test-db", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("test_table")
      .select("*");

    if (error) {
      return res.status(400).json({
        success: false,
        error: error.message,
      });
    }

    return res.json({
      success: true,
      message: "Supabase Connected ✅",
      data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal Server Error",
    });
  }
});

export default app;
