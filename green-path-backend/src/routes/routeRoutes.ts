import express, { Router } from "express";
import { getRoutes } from "../controllers/routeController";
import { supabase } from "../config/supabaseClient";

const router: Router = express.Router();

// =====================================
// GET /api/routes?source=A&destination=B
// (Route Finder – untouched)
// =====================================
router.get("/", getRoutes);

// =====================================
// GET /api/routes/history
// (Eco Intelligence – NEW)
// =====================================
router.get("/history", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("routes")
      .select("*");

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    return res.json({
      success: true,
      data: data || [],
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch route history",
    });
  }
});

export default router;
