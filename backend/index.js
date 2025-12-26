import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import { getDb } from "./db.js";

const app = express();
const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET || "harborstay-demo-secret";

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.get("/api/rooms", async (req, res) => {
  const db = await getDb();
  const rooms = await db.all("SELECT * FROM rooms ORDER BY id ASC");
  res.json(rooms.map(formatRoom));
});

app.get("/api/rooms/:id", async (req, res) => {
  const db = await getDb();
  const room = await db.get("SELECT * FROM rooms WHERE id = ?", [req.params.id]);
  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }
  res.json(formatRoom(room));
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    res.status(400).json({ message: "Email and password required" });
    return;
  }

  const db = await getDb();
  const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);
  if (!user || user.password !== password) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
  }

  const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: "6h",
  });

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
});

app.get("/api/me", async (req, res) => {
  const payload = getAuthPayload(req);
  if (!payload) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const db = await getDb();
  const user = await db.get("SELECT id, name, email FROM users WHERE id = ?", [
    payload.userId,
  ]);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return;
  }
  res.json(user);
});

app.get("/api/bookings/me", async (req, res) => {
  const payload = getAuthPayload(req);
  if (!payload) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  const db = await getDb();
  const rows = await db.all(
    `SELECT bookings.*, rooms.name as room_name
     FROM bookings
     JOIN rooms ON rooms.id = bookings.room_id
     WHERE bookings.user_id = ?
     ORDER BY bookings.created_at DESC`,
    [payload.userId]
  );
  res.json(
    rows.map((row) => ({
      id: row.id,
      roomId: row.room_id,
      roomName: row.room_name,
      checkIn: row.check_in,
      checkOut: row.check_out,
      guests: row.guests,
      createdAt: row.created_at,
    }))
  );
});

app.post("/api/bookings", async (req, res) => {
  const { roomId, checkIn, checkOut, guests, name, email } = req.body || {};
  if (!roomId || !checkIn || !checkOut || !guests || !name || !email) {
    res.status(400).json({ message: "Missing required booking fields" });
    return;
  }

  const db = await getDb();
  const room = await db.get("SELECT id FROM rooms WHERE id = ?", [roomId]);
  if (!room) {
    res.status(404).json({ message: "Room not found" });
    return;
  }

  let userId = null;
  const authHeader = req.headers.authorization || "";
  if (authHeader.startsWith("Bearer ")) {
    try {
      const payload = jwt.verify(authHeader.replace("Bearer ", ""), JWT_SECRET);
      userId = payload.userId;
    } catch (error) {
      userId = null;
    }
  }

  const createdAt = new Date().toISOString();
  const result = await db.run(
    `INSERT INTO bookings
     (room_id, guest_name, guest_email, check_in, check_out, guests, user_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [roomId, name, email, checkIn, checkOut, guests, userId, createdAt]
  );

  res.status(201).json({
    id: result.lastID,
    roomId,
    checkIn,
    checkOut,
    guests,
    name,
    email,
  });
});

function getAuthPayload(req) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return null;
  }
  try {
    return jwt.verify(authHeader.replace("Bearer ", ""), JWT_SECRET);
  } catch (error) {
    return null;
  }
}

function formatRoom(room) {
  return {
    id: room.id,
    name: room.name,
    size: room.size,
    bed: room.bed,
    perks: room.perks,
    price: room.price,
    total: room.total,
    rating: room.rating,
    reviews: room.reviews,
    tag: room.tag,
    description: room.description,
    highlights: JSON.parse(room.highlights),
    image: room.image,
    gallery: JSON.parse(room.gallery),
  };
}

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
