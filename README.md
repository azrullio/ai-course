# Course AI — Prototipe

1. `npm install`
2. Salin `.env.example` → `.env`, isi `ANTHROPIC_API_KEY` (dari console.anthropic.com).
3. `npm start` → buka http://localhost:3000
4. Ide konten harian: `npm run ideas` → hasil di `ideas/YYYY-MM-DD.md`

## Pembayaran
- `MIDTRANS_SERVER_KEY` kosong → mode MOCK (halaman bayar simulasi).
- Isi dengan Server Key **sandbox** Midtrans → link Snap asli. Set Notification URL di dashboard Midtrans ke `<BASE_URL>/webhook/midtrans` (untuk lokal pakai ngrok).
- AI tidak pernah menentukan harga atau status bayar. Harga diambil dari `data/courses.json`, status "paid" hanya dari webhook yang tanda tangannya terverifikasi.

## Ubah data
- Course: `data/courses.json`
- FAQ/kebijakan: `data/faq.md`

## Sebelum produksi
Ganti penyimpanan order in-memory dengan database, tambahkan login & halaman materi, pakai Server Key production, dan tambahkan rate limit pada `/api/chat`.
