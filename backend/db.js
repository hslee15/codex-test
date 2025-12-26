import sqlite3 from "sqlite3";
import { open } from "sqlite";

const DB_PATH = new URL("./data.sqlite", import.meta.url).pathname;

export async function getDb() {
  const db = await open({
    filename: DB_PATH,
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS rooms (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      size TEXT NOT NULL,
      bed TEXT NOT NULL,
      perks TEXT NOT NULL,
      price TEXT NOT NULL,
      total TEXT NOT NULL,
      rating TEXT NOT NULL,
      reviews TEXT NOT NULL,
      tag TEXT NOT NULL,
      description TEXT NOT NULL,
      highlights TEXT NOT NULL,
      image TEXT NOT NULL,
      gallery TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS bookings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      room_id INTEGER NOT NULL,
      guest_name TEXT NOT NULL,
      guest_email TEXT NOT NULL,
      check_in TEXT NOT NULL,
      check_out TEXT NOT NULL,
      guests INTEGER NOT NULL,
      user_id INTEGER,
      created_at TEXT NOT NULL,
      FOREIGN KEY(room_id) REFERENCES rooms(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  await seed(db);
  return db;
}

async function seed(db) {
  const roomCount = await db.get("SELECT COUNT(*) as count FROM rooms");
  if (roomCount.count === 0) {
    const rooms = [
      {
        name: "Harbor Queen",
        size: "28m²",
        bed: "킹 침대",
        perks: "발코니 · 오션뷰",
        price: "₩148,000",
        total: "₩296,000",
        rating: "8.9",
        reviews: "후기 214개",
        tag: "무료 취소",
        description: "햇살이 잘 드는 발코니와 바다 전망을 갖춘 아늑한 객실입니다.",
        highlights: ["오션뷰", "킹 침대", "발코니", "무료 취소"],
        image:
          "https://images.unsplash.com/photo-1501117716987-c8e1ecb210d1?auto=format&fit=crop&w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        name: "City Double",
        size: "32m²",
        bed: "더블 2개",
        perks: "워크데스크 · 시티뷰",
        price: "₩168,000",
        total: "₩336,000",
        rating: "8.6",
        reviews: "후기 182개",
        tag: "현장 결제",
        description: "넉넉한 공간과 업무용 데스크가 있는 도심 전망 객실입니다.",
        highlights: ["시티뷰", "더블 2개", "워크데스크", "현장 결제"],
        image:
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80"
        ]
      },
      {
        name: "Loft Suite",
        size: "45m²",
        bed: "스위트",
        perks: "거실 · 미니키친",
        price: "₩228,000",
        total: "₩456,000",
        rating: "9.2",
        reviews: "후기 96개",
        tag: "레이트 체크아웃",
        description: "거실과 미니키친이 포함된 넓은 프리미엄 스위트입니다.",
        highlights: ["오션뷰", "거실", "미니키친", "레이트 체크아웃"],
        image:
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80",
        gallery: [
          "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=1200&q=80",
          "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80"
        ]
      }
    ];

    for (const room of rooms) {
      await db.run(
        `INSERT INTO rooms
        (name, size, bed, perks, price, total, rating, reviews, tag, description, highlights, image, gallery)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)` ,
        [
          room.name,
          room.size,
          room.bed,
          room.perks,
          room.price,
          room.total,
          room.rating,
          room.reviews,
          room.tag,
          room.description,
          JSON.stringify(room.highlights),
          room.image,
          JSON.stringify(room.gallery)
        ]
      );
    }
  }

  const userCount = await db.get("SELECT COUNT(*) as count FROM users");
  if (userCount.count === 0) {
    await db.run(
      "INSERT INTO users (email, password, name) VALUES (?, ?, ?)",
      ["demo@harborstay.co", "demo1234", "Demo User"]
    );
  }
}
