import fs from "fs/promises";

const PLAYERS = [
  {
  username: "tjafk",
  uuid: "f9138b88-d653-4c8f-b3e0-41852c9b4708"
  },
  {
  username: "ItzJstMac",
  uuid: "cad9f89b-1413-4f24-acfe-4d6301a47bd9"
  },
  {
  username: "greenownscedar",
  uuid: "c878e4c0-08bf-440e-b911-2023dbdb8410"
  },
  {
  username: "_RiverDrift",
  uuid: "8111ce3a-c2bf-4917-9240-29acfc55ca6b"
  },
  {
  username: "Pluuto_fs",
  uuid: "91d2617b-8ae3-49a4-a878-1fe613b80ed1"
  },
  {
  username: "elidaghost",
  uuid: "4a0309d2-7453-4dd3-8378-d9ce152bcb06"
  },
  {
  username: "_Alonne",
  uuid: "09b3a30b-c135-45e6-a012-0c334ca8642a"
  },
  {
  username: "timeweilder",
  uuid: "63b7f08e-a9b3-4d2c-96ba-c8ddedf2a496"
  },
  {
  username: "bigboyrayy",
  uuid: "6022e0a8-f0a0-4903-9882-a0d0effec6e3"
  },
  {
  username: "CarbideMc",
  uuid: "ce1a8b9d-c803-47df-9f85-dfc6ef7bc3ce"
  },
];

async function fetchPlayer(player) {
  try {
    const response = await fetch(
      `https://pvphq.com/api/v1/players/by-name/${encodeURIComponent(player.username)}`
    );

    if (!response.ok) {
      throw new Error(`${player.username} returned ${response.status}`);
    }

    const data = await response.json();

    const ranks = {};

    if (Array.isArray(data.ranked)) {
      data.ranked.forEach(rank => {
        ranks[rank.gametypeName || rank.gametype] = rank.tier;
      });
    }

    return {
      username: data.name || player.username,
      uuid: player.uuid,
      points: data.overall?.points || 0,
      ranks
    };

  } catch (error) {
    console.error(`Failed to fetch ${player.username}:`, error);

    return {
      username: data.name || username,
      uuid: player.uuid,
      points: data.overall?.points || 0,
      ranks: {}
    };
  }
}

async function updateLeaderboard() {
  const players = await Promise.all(
    PLAYERS.map(fetchPlayer)
  );

  players.sort((a, b) => b.points - a.points);

  const stats = {
    lastUpdated: new Date().toUTCString(),
    players
  };

  await fs.writeFile(
    "stats.json",
    JSON.stringify(stats, null, 2)
  );

  console.log("stats.json updated!");
}

updateLeaderboard();

document
  .getElementById("refresh-btn")
  .addEventListener("click", async () => {

    const button =
      document.getElementById("refresh-btn");

    button.textContent =
      "⏳ Refreshing...";

    await loadLeaderboard();

    button.textContent =
      "✅ Refreshed";

    setTimeout(() => {
      button.textContent =
        "🔄 Refresh Stats";
    }, 2000);

  });
