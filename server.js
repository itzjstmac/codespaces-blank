import express from "express";
import fs from "fs/promises";
import { updateLeaderboard } from "./update.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("."));

app.get("/api/stats", async (req, res) => {
  try {
    const stats = JSON.parse(
      await fs.readFile("stats.json", "utf8")
    );

    res.json(stats);
  } catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});

// Update immediately on startup
await updateLeaderboard();

// Update every 5 minutes
setInterval(async () => {
  try {
    console.log("Updating PVPHQ data...");
    await updateLeaderboard();
    console.log("PVPHQ data updated.");
  } catch (err) {
    console.error(err);
  }
}, 5 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

