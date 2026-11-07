// Jalankan tiap pagi (Task Scheduler Windows / cron): npm run ideas
import fs from "node:fs";
import Anthropic from "@anthropic-ai/sdk";

const courses = JSON.parse(fs.readFileSync("data/courses.json", "utf8"));
const today = new Date().toISOString().slice(0, 10);

const prompt = `Kamu asisten kurikulum untuk pemilik platform kursus. Hari ini ${today}.
Katalog course: ${JSON.stringify(courses.map(({ name, level, description }) => ({ name, level, description })))}

Buat 3 ide konten belajar untuk hari ini (1 per course). Untuk tiap ide berikan:
1. Judul materi
2. Tujuan belajar (1 kalimat)
3. Outline 4-6 poin
4. 2 contoh soal/latihan
5. Format yang disarankan (video pendek/carousel/latihan) dan estimasi durasi
6. Kata kunci referensi untuk dicari (jangan mengarang URL)
Format Markdown.`;

let text;
if (process.env.GEMINI_API_KEY) {
  const r = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.GEMINI_API_KEY}` },
    body: JSON.stringify({ model: process.env.GEMINI_MODEL || "gemini-3.8-flash",
      messages: [{ role: "user", content: prompt }] }),
  });
  const data = await r.json();
  if (!r.ok) throw new Error("Gemini error: " + JSON.stringify(data));
  text = data.choices[0].message.content;
} else {
  const resp = await new Anthropic().messages.create({
    model: "claude-sonnet-5-5", max_tokens: 2500, messages: [{ role: "user", content: prompt }],
  });
  text = resp.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}
fs.mkdirSync("ideas", { recursive: true });
fs.writeFileSync(`ideas/${today}.md`, `# Ide Konten ${today}\n\n${text}\n`);
console.log(`Tersimpan: ideas/${today}.md`);
