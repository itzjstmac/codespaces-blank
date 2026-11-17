import express from "express";
import fs from "fs/promises";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static("."));

app.get("/api/refresh", async (req, res) => {
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

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});