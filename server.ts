import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));

// Database directory & path setup
const DB_DIR = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'data');
const DB_PATH = path.join(DB_DIR, 'db.json');

let activeDbPath = DB_PATH;

try {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
  }
  // Test write permission in DB_DIR
  const testFile = path.join(DB_DIR, '.test-write');
  fs.writeFileSync(testFile, 'test');
  fs.unlinkSync(testFile);
} catch (err) {
  console.warn(`[DB PATH FALLBACK] Directory ${DB_DIR} is read-only or permission denied. Falling back to /tmp/db.json`);
  activeDbPath = '/tmp/db.json';
}

// Initial Mock Data Seeding
const DEFAULT_STUDENTS = [
  { id: 'budi', name: 'Budi Setiawan', class: 'Kelas VII A', avatar: '👦', status: 'Aktif', guruWali: 'Ibu Rahma, S.Pd' },
  { id: 'siti', name: 'Siti Rahma', class: 'Kelas VII A', avatar: '👧', status: 'Aktif', guruWali: 'Ibu Rahma, S.Pd' },
  { id: 'andi', name: 'Andi Prasetyo', class: 'Kelas VIII B', avatar: '🧑', status: 'Aktif', guruWali: 'Bapak I Sumayasa, M.Pd' },
];

const DEFAULT_TEACHERS = [
  { id: 't-1', name: 'Ibu Rahma, S.Pd', email: 'rahma@cerdas.id', password: 'password123', class: 'Kelas VII' },
  { id: 't-2', name: 'Bapak I Sumayasa, M.Pd', email: 'isumayasa91@guru.smp.belajar.id', password: 'password123', class: 'Kelas VIII' },
  { id: 't-3', name: 'Bapak Deni Saputra, S.Pd', email: 'deni@cerdas.id', password: 'password123', class: 'Kelas IX' },
  { id: 't-4', name: 'Ibu Sri Wahyuni, S.Pd', email: 'sri@cerdas.id', password: 'password123', class: 'Umum' },
];

const DEFAULT_STORIES = [
  {
    id: 'story-mock-1',
    studentId: 'budi',
    studentName: 'Budi Setiawan',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString(), // 2 days ago
    fact: 'Tadi siang aku bertengkar dengan Andi di kelas karena kami berebut lego helikopter. Aku kesal sekali dan merebutnya dari tangan Andi.',
    feeling: 'Marah',
    character: 'Koko', // Red Flame
    finding: 'Lego di kelas itu milik bersama, bukan milikku sendiri. Seharusnya aku mengantre atau memainkannya bersama Andi.',
    future: 'Besok pagi aku mau menemui Andi di kelas dan minta maaf. Aku juga mau mengajaknya merakit lego helikopter itu bersama-sama.',
    audioBase64: '',
    status: 'Teratasi', // Resolved
    escalated: false,
    teacherResponse: 'Hebat sekali Budi! Ibu bangga Budi bisa menyadari kesalahan dan punya rencana luar biasa untuk minta maaf ke Andi besok. Terus pertahankan sikap berani bertanggung jawab ini ya sayang!',
    counselorNote: '',
    analysis: {
      fakta_summary: 'Bertengkar dan berebut mainan lego helikopter dengan Andi.',
      emosi_dominant: 'Marah',
      finding_insight: 'Menyadari bahwa mainan sekolah adalah milik bersama dan harus berbagi.',
      future_action: 'Meminta maaf ke Andi dan mengajaknya bermain bersama.',
      tingkat_risiko: 'Rendah',
      alasan_risiko: 'Anak mampu merefleksikan emosinya sendiri dan memiliki solusi damai yang konstruktif.',
      rekomendasi_guru: 'Berikan apresiasi tinggi atas kedewasaannya meminta maaf dan ajak anak menceritakan bagaimana perasaan Andi saat diajak berbagi.',
      rekomendasi_bk: 'Tidak memerlukan intervensi khusus. Cukup pantau interaksi sosial antara Budi dan Andi di kelas.',
      rekomendasi_orangtua: 'Apresiasi sikap bertanggung jawab anak di rumah dan latih giliran berbagi menggunakan barang-barang di rumah.'
    }
  },
  {
    id: 'story-mock-2',
    studentId: 'siti',
    studentName: 'Siti Rahma',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    fact: 'Besok akan ada ulangan matematika materi pecahan desimal. Aku merasa sangat bingung karena saat diterangkan tadi aku tidak paham sama sekali. Aku takut mendapat nilai jelek dan dimarahi ibu.',
    feeling: 'Takut',
    character: 'Pipi', // Purple Ghost
    finding: 'Aku sadar kalau aku tidak mengerti, aku tidak boleh diam saja atau menyembunyikannya. Aku harus aktif bertanya agar bisa paham.',
    future: 'Sore ini aku mau belajar lagi dan membaca buku paket. Kalau masih bingung, aku mau minta tolong Ibu atau mengirim pesan ke Ibu Guru untuk dibantu jelaskan bagian yang sulit.',
    audioBase64: '',
    status: 'Teratasi',
    escalated: false,
    teacherResponse: 'Siti sayang, jangan takut ya. Tidak mengerti pecahan itu wajar kok, kita bisa belajar lagi bersama-sama. Besok pagi sebelum masuk kelas, datang ke meja Ibu ya, nanti Ibu jelaskan bagian yang masih membuat Siti bingung. Semangat anak pintar!',
    counselorNote: '',
    analysis: {
      fakta_summary: 'Takut menghadapi ujian matematika besok karena belum memahami materi pecahan desimal dan khawatir dimarahi ibu.',
      emosi_dominant: 'Takut',
      finding_insight: 'Menyadari tidak boleh menyembunyikan ketidakpahaman dan harus aktif bertanya.',
      future_action: 'Belajar mandiri sore ini dan bersiap meminta bantuan ibu atau guru.',
      tingkat_risiko: 'Rendah',
      alasan_risiko: 'Anak menunjukkan kecemasan akademis yang umum, namun memiliki strategi koping yang sehat (belajar dan berani bertanya).',
      rekomendasi_guru: 'Sediakan sesi penjelasan singkat (remedial teaching) sebelum ujian dan yakinkan anak bahwa proses belajar lebih penting daripada sekadar nilai.',
      rekomendasi_bk: 'Pantau tingkat kecemasan anak secara berkala jika ada indikasi performa akademis menurun drastis.',
      rekomendasi_orangtua: 'Berikan ruang aman bagi anak untuk gagal, hindari memarahi anak karena nilai matematika, dan bantu ciptakan suasana belajar yang tenang di rumah.'
    }
  },
  {
    id: 'story-mock-3',
    studentId: 'andi',
    studentName: 'Andi Prasetyo',
    timestamp: new Date().toISOString(), // Today
    fact: 'Kucing kesayanganku yang bernama Meong ditabrak motor kemarin sore di depan rumah. Dia terluka parah dan akhirnya mati semalam. Sekarang kamarku sepi sekali tanpa Meong. Aku menangis terus sejak tadi malam dan tidak mau makan karena sangat merindukan Meong.',
    feeling: 'Sedih',
    character: 'Sasa', // Blue Raindrop
    finding: 'Aku sangat menyayangi Meong, dan kehilangan dia membuat hatiku sangat hancur. Aku sadar semua makhluk hidup pasti akan pergi suatu hari nanti.',
    future: 'Aku mau menguburkan mainan kesayangan Meong di dekat kuburannya sore ini. Tapi aku masih belum tahu cara menghilangkan rasa sepi ini. Rasanya aku ingin tidur terus saja.',
    audioBase64: '',
    status: 'Butuh Bantuan', // Needs help
    escalated: true, // Auto-escalated or teacher-escalated
    teacherResponse: '',
    counselorNote: 'Kasus telah diidentifikasi oleh guru wali kelas sebagai duka mendalam (grief) akibat kehilangan hewan peliharaan kesayangan. Anak menolak makan dan menunjukkan tanda penarikan diri sosial (ingin tidur terus). Perlu konseling duka cita pribadi dan kerja sama dengan orang tua agar memantau asupan makanan anak.',
    analysis: {
      fakta_summary: 'Kucing kesayangannya (Meong) mati tertabrak motor, menyebabkan anak mengalami kesedihan mendalam, menangis terus menerus, menolak makan, dan ingin menarik diri (tidur terus).',
      emosi_dominant: 'Sedih',
      finding_insight: 'Mengalami duka cita atas kehilangan makhluk yang sangat disayanginya.',
      future_action: 'Mengubur mainan kucing namun merasa buntu dan ingin menarik diri dari aktivitas.',
      tingkat_risiko: 'Tinggi',
      alasan_risiko: 'Anak menunjukkan gejala duka mendalam (grief) yang berdampak pada fungsi fisiologis (menolak makan) dan psikososial (menarik diri/ingin tidur terus), yang bisa mengarah pada depresi anak jika tidak didampingi.',
      rekomendasi_guru: 'Berikan empati mendalam di kelas. Jangan memaksakan partisipasi aktif akademis hari ini. Berikan afirmasi bahwa perasaan sedihnya sangat valid.',
      rekomendasi_bk: 'Lakukan sesi konseling duka (grief counseling). Ajak anak menggambar kenangan manis bersama Meong atau membuat surat perpisahan untuk Meong sebagai bentuk katarsis emosi.',
      rekomendasi_orangtua: 'Dampingi anak di rumah dengan sabar. Jangan meremehkan duka anak dengan berkata \"cuma kucing\". Pastikan kebutuhan nutrisi anak tetap terpenuhi dengan menyuapi makanan favoritnya perlahan.'
    }
  }
];

// Helper to read database
function readDB() {
  try {
    if (!fs.existsSync(activeDbPath)) {
      const initialData = { students: DEFAULT_STUDENTS, stories: DEFAULT_STORIES, teachers: DEFAULT_TEACHERS };
      fs.writeFileSync(activeDbPath, JSON.stringify(initialData, null, 2), 'utf-8');
      return initialData;
    }
    const data = fs.readFileSync(activeDbPath, 'utf-8');
    const db = JSON.parse(data);
    if (!db.teachers) {
      db.teachers = DEFAULT_TEACHERS;
      fs.writeFileSync(activeDbPath, JSON.stringify(db, null, 2), 'utf-8');
    }
    return db;
  } catch (error) {
    console.error("Error reading database:", error);
    return { students: DEFAULT_STUDENTS, stories: DEFAULT_STORIES, teachers: DEFAULT_TEACHERS };
  }
}

// Helper to write database
function writeDB(data: any) {
  try {
    fs.writeFileSync(activeDbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error("Error writing database:", error);
  }
}

// Initialize Gemini API
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
let aiClient: GoogleGenAI | null = null;

if (GEMINI_API_KEY && GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Successfully initialized Gemini API Client.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.log("No GEMINI_API_KEY provided or it has a placeholder value. Falling back to rule-based fallback analysis.");
}

// --- API Endpoints ---

// Get all teachers
app.get('/api/teachers', (req, res) => {
  const db = readDB();
  res.json(db.teachers || DEFAULT_TEACHERS);
});

// Teacher Register
app.post('/api/teachers/register', (req, res) => {
  const { name, email, password, className } = req.body;
  if (!name || !email || !password || !className) {
    return res.status(400).json({ error: 'Semua kolom wajib diisi' });
  }
  const db = readDB();
  const exists = db.teachers.some((t: any) => t.email.toLowerCase() === email.toLowerCase());
  if (exists) {
    return res.status(400).json({ error: 'Email sudah terdaftar' });
  }
  const newTeacher = {
    id: 'teacher_' + Date.now(),
    name,
    email: email.toLowerCase(),
    password,
    class: className
  };
  db.teachers.push(newTeacher);
  writeDB(db);
  res.json({ success: true, teacher: { id: newTeacher.id, name: newTeacher.name, email: newTeacher.email, class: newTeacher.class } });
});

// Teacher Login
app.post('/api/teachers/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email dan password wajib diisi' });
  }
  const db = readDB();
  const teacher = db.teachers.find((t: any) => t.email.toLowerCase() === email.toLowerCase() && t.password === password);
  if (!teacher) {
    return res.status(400).json({ error: 'Email atau password salah' });
  }
  res.json({ success: true, teacher: { id: teacher.id, name: teacher.name, email: teacher.email, class: teacher.class } });
});

// 1. Get all students
app.get('/api/students', (req, res) => {
  const db = readDB();
  res.json(db.students);
});

// 2. Add a student
app.post('/api/students', (req, res) => {
  const { name, className, avatar, guruWali } = req.body;
  if (!name || !className) {
    return res.status(400).json({ error: 'Nama dan Kelas wajib diisi' });
  }
  const db = readDB();
  const newStudent = {
    id: 'student_' + Date.now(),
    name,
    class: className,
    avatar: avatar || '👦',
    status: 'Aktif',
    guruWali: guruWali || 'Ibu Rahma, S.Pd'
  };
  db.students.push(newStudent);
  writeDB(db);
  res.json(newStudent);
});

// Delete a student and their associated story records
app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const db = readDB();
  const studentIndex = db.students.findIndex((s: any) => s.id === id);
  if (studentIndex === -1) {
    return res.status(404).json({ error: 'Siswa tidak ditemukan' });
  }
  db.students.splice(studentIndex, 1);
  db.stories = db.stories.filter((s: any) => s.studentId !== id);
  writeDB(db);
  res.json({ success: true });
});

// 3. Get all stories
app.get('/api/stories', (req, res) => {
  const db = readDB();
  // Sort by timestamp descending (newest first)
  const sortedStories = [...db.stories].sort((a: any, b: any) => {
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });
  res.json(sortedStories);
});

// 4. Submit a new story (with optional AI emotional analysis)
app.post('/api/stories', async (req, res) => {
  const { studentId, studentName, fact, feeling, character, finding, future, audioBase64 } = req.body;

  if (!studentId || !studentName || !fact || !feeling || !finding || !future) {
    return res.status(400).json({ error: 'Harap lengkapi seluruh alur 4F (Fact, Feeling, Finding, Future).' });
  }

  const db = readDB();
  const storyId = 'story_' + Date.now();

  let analysisResult = null;

  // Let's attempt Gemini analysis
  if (aiClient) {
    try {
      const prompt = `
Anda adalah seorang Psikolog Anak dan Konselor Pendidikan berpengalaman yang bekerja untuk sistem "CERDAS" (Cerita Digital Anak Sempatik).
Tugas Anda adalah menganalisis cerita refleksi anak sekolah dasar dengan alur 4F (Fact, Feeling, Finding, Future) berikut ini:

Nama Anak: ${studentName}
Fakta (Fact - Peristiwa): "${fact}"
Perasaan (Feeling - Emosi): "${feeling}" (Karakter Animasi: ${character})
Temuan (Finding - Pembelajaran): "${finding}"
Masa Depan (Future - Tindak Lanjut): "${future}"

Lakukan analisis emosi mendalam:
1. Simpulkan peristiwa utama yang dialami anak secara singkat padat (fakta_summary).
2. Deteksi keselarasan emosi yang dilaporkan dan berikan label emosi dominan (emosi_dominant).
3. Simpulkan inti pembelajaran yang didapat anak (finding_insight).
4. Simpulkan rencana tindakan esok hari (future_action).
5. Klasifikasikan Tingkat Risiko Kesehatan Mental / Kebutuhan Dukungan Emosional anak ("Rendah", "Sedang", "Tinggi") berdasarkan beratnya peristiwa dan kondisi koping anak (tingkat_risiko).
   - "Rendah": Masalah sehari-hari biasa, koping mandiri anak sangat baik.
   - "Sedang": Mengalami stres sedang, kesedihan/kekesalan yang mengganggu aktivitas harian, butuh bimbingan guru kelas agar tidak berlarut-larut.
   - "Tinggi": Ada duka cita mendalam, perundungan (bullying), kekerasan di rumah, trauma, penolakan makan/sekolah, atau tanda penarikan diri sosial yang parah. Otomatis butuh rujukan profesional (BK & Orang Tua).
6. Tuliskan alasan klasifikasi risiko tersebut (alasan_risiko).
7. Buat draf tanggapan emosional yang sangat lembut, suportif, ramah anak, apresiatif, dan memvalidasi perasaan anak yang bisa digunakan oleh Guru Wali Kelas (rekomendasi_guru) dalam Bahasa Indonesia yang penuh kasih sayang.
8. Buat rekomendasi taktis bagi Guru BK / Konselor Sekolah jika diperlukan (rekomendasi_bk) untuk penanganan psikologis lebih lanjut.
9. Buat rekomendasi aktivitas dan komunikasi bagi Orang Tua di rumah (rekomendasi_orangtua) untuk menjaga kesehatan mental anak.

Kembalikan respon wajib dalam format JSON murni dengan schema yang ditentukan.
`;

      const response = await aiClient.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              fakta_summary: { type: Type.STRING, description: "Ringkasan peristiwa utama yang dialami anak" },
              emosi_dominant: { type: Type.STRING, description: "Emosi dominan yang terdeteksi (Gembira, Sedih, Marah, Takut, Bangga)" },
              finding_insight: { type: Type.STRING, description: "Ringkasan pembelajaran dari anak" },
              future_action: { type: Type.STRING, description: "Ringkasan rencana tindak lanjut anak" },
              tingkat_risiko: { type: Type.STRING, description: "Tingkat risiko kesehatan mental: Rendah, Sedang, atau Tinggi" },
              alasan_risiko: { type: Type.STRING, description: "Mengapa tingkat risiko tersebut dipilih" },
              rekomendasi_guru: { type: Type.STRING, description: "Draf jawaban suportif guru wali kelas yang sangat hangat dan ramah anak" },
              rekomendasi_bk: { type: Type.STRING, description: "Saran tindakan intervensi untuk Guru BK / Konselor Sekolah" },
              rekomendasi_orangtua: { type: Type.STRING, description: "Saran panduan aktivitas / diskusi bagi orang tua di rumah" }
            },
            required: [
              "fakta_summary", "emosi_dominant", "finding_insight", "future_action", 
              "tingkat_risiko", "alasan_risiko", "rekomendasi_guru", "rekomendasi_bk", "rekomendasi_orangtua"
            ]
          }
        }
      });

      const text = response.text?.trim() || "";
      if (text) {
        analysisResult = JSON.parse(text);
      }
    } catch (err) {
      console.error("Gemini API error, using fallback analysis:", err);
    }
  }

  // Fallback Analysis (if Gemini is unavailable or failed)
  if (!analysisResult) {
    // Basic rules to determine risk based on keywords
    const textToScan = (fact + " " + finding + " " + future).toLowerCase();
    let risk = 'Rendah';
    let reason = 'Anak bercerita dengan ekspresi koping mandiri yang baik.';
    let recGuru = `Halo ${studentName} sayang! Terima kasih ya sudah mau menceritakan isi hatimu hari ini. Ibu senang sekali mendengarnya. Kamu anak yang hebat dan berani menceritakan perasaanmu! Tetap semangat ya!`;
    let recBK = 'Pantau perkembangan emosional berkala di kelas oleh Wali Kelas. Tidak perlu intervensi khusus.';
    let recOrangtua = 'Berikan ruang diskusi yang santai dan dengarkan cerita anak saat santap malam di rumah.';

    if (textToScan.includes('mati') || textToScan.includes('meninggal') || textToScan.includes('pukul') || textToScan.includes('hajar') || textToScan.includes('bully') || textToScan.includes('tangis') || textToScan.includes('nangis terus') || textToScan.includes('takut sekali') || textToScan.includes('benci')) {
      risk = 'Tinggi';
      reason = 'Terdeteksi kata kunci duka cita mendalam, konflik fisik, atau tekanan emosional ekstrem pada anak.';
      recGuru = `Sayang, Ibu mendengar ceritamu dan Ibu ada di sini untukmu. Sangat wajar jika kamu merasa sedih atau takut saat ini. Jangan disimpan sendiri ya, Ibu dan bapak guru akan selalu menemani dan membantumu. Peluk hangat dari Ibu!`;
      recBK = 'Segera jadwalkan konseling individu privat dengan ramah anak. Lakukan eksplorasi trauma atau duka cita dan hubungi orang tua untuk menyelaraskan pengawasan di rumah.';
      recOrangtua = 'Buka ruang komunikasi empati di rumah. Validasi perasaan sedih anak, peluk erat, dan hindari menyalahkan atau mendominasi percakapan. Pastikan asupan gizi anak terpenuhi.';
    } else if (textToScan.includes('marah') || textToScan.includes('kesal') || textToScan.includes('bingung') || textToScan.includes('takut') || textToScan.includes('malu') || textToScan.includes('gagal')) {
      risk = 'Sedang';
      reason = 'Terdapat tanda-tanda ketidaknyamanan emosional yang membutuhkan bimbingan guru wali agar tidak berkembang menjadi kecemasan tinggi.';
      recGuru = `Terima kasih sudah berbagi ya sayang. Tidak apa-apa merasa ${feeling.toLowerCase()} hari ini. Ibu sangat mengerti perasaanmu. Mari besok kita ngobrol santai ya, kita cari cara seru bersama-sama agar kamu merasa lebih nyaman!`;
      recBK = 'Bantu guru kelas menyusun strategi dukungan emosional kecil. Pantau anak selama 2-3 hari ke depan untuk melihat apakah emosi mereda.';
      recOrangtua = 'Latih anak mengenali emosinya di rumah. Lakukan latihan pernapasan bersama atau menggambar bersama untuk menyalurkan perasaan kesal/takut.';
    }

    analysisResult = {
      fakta_summary: fact.substring(0, 80) + '...',
      emosi_dominant: feeling,
      finding_insight: finding.substring(0, 80) + '...',
      future_action: future.substring(0, 80) + '...',
      tingkat_risiko: risk,
      alasan_risiko: reason,
      rekomendasi_guru: recGuru,
      rekomendasi_bk: recBK,
      rekomendasi_orangtua: recOrangtua
    };
  }

  const newStory = {
    id: storyId,
    studentId,
    studentName,
    timestamp: new Date().toISOString(),
    fact,
    feeling,
    character,
    finding,
    future,
    audioBase64: audioBase64 || '',
    status: analysisResult.tingkat_risiko === 'Tinggi' ? 'Butuh Bantuan' : 'Menunggu Tanggapan',
    escalated: analysisResult.tingkat_risiko === 'Tinggi',
    teacherResponse: '',
    counselorNote: '',
    analysis: analysisResult
  };

  db.stories.push(newStory);
  writeDB(db);

  res.json(newStory);
});

// 5. Guru Wali responds to a student story
app.post('/api/stories/:id/respond', (req, res) => {
  const { id } = req.params;
  const { teacherResponse } = req.body;

  if (!teacherResponse) {
    return res.status(400).json({ error: 'Tanggapan guru tidak boleh kosong.' });
  }

  const db = readDB();
  const storyIndex = db.stories.findIndex((s: any) => s.id === id);

  if (storyIndex === -1) {
    return res.status(404).json({ error: 'Cerita tidak ditemukan.' });
  }

  db.stories[storyIndex].teacherResponse = teacherResponse;
  // If previously waiting for response, resolve it (if risk not high)
  if (db.stories[storyIndex].status === 'Menunggu Tanggapan') {
    db.stories[storyIndex].status = 'Teratasi';
  }

  writeDB(db);
  res.json(db.stories[storyIndex]);
});

// 6. Guru Wali escalates to BK manually
app.post('/api/stories/:id/escalate', (req, res) => {
  const { id } = req.params;
  const { counselorNote } = req.body;

  const db = readDB();
  const storyIndex = db.stories.findIndex((s: any) => s.id === id);

  if (storyIndex === -1) {
    return res.status(404).json({ error: 'Cerita tidak ditemukan.' });
  }

  db.stories[storyIndex].escalated = true;
  db.stories[storyIndex].status = 'Butuh Bantuan';
  if (counselorNote) {
    db.stories[storyIndex].counselorNote = counselorNote;
  } else if (!db.stories[storyIndex].counselorNote) {
    db.stories[storyIndex].counselorNote = 'Dirujuk oleh Guru Wali Kelas untuk mendapat konseling pribadi lebih lanjut.';
  }

  writeDB(db);
  res.json(db.stories[storyIndex]);
});

// 7. Guru BK updates counselor consultation note
app.post('/api/stories/:id/bk-note', (req, res) => {
  const { id } = req.params;
  const { counselorNote } = req.body;

  if (!counselorNote) {
    return res.status(400).json({ error: 'Catatan BK tidak boleh kosong.' });
  }

  const db = readDB();
  const storyIndex = db.stories.findIndex((s: any) => s.id === id);

  if (storyIndex === -1) {
    return res.status(404).json({ error: 'Cerita tidak ditemukan.' });
  }

  db.stories[storyIndex].counselorNote = counselorNote;
  db.stories[storyIndex].escalated = true;
  if (db.stories[storyIndex].status !== 'Teratasi') {
    db.stories[storyIndex].status = 'Butuh Bantuan'; // Mark active assistance
  }

  writeDB(db);
  res.json(db.stories[storyIndex]);
});

// 8. Resolve/tutup masalah
app.post('/api/stories/:id/resolve', (req, res) => {
  const { id } = req.params;

  const db = readDB();
  const storyIndex = db.stories.findIndex((s: any) => s.id === id);

  if (storyIndex === -1) {
    return res.status(404).json({ error: 'Cerita tidak ditemukan.' });
  }

  db.stories[storyIndex].status = 'Teratasi';
  writeDB(db);
  res.json(db.stories[storyIndex]);
});

// Serve frontend assets
const distPath = path.join(__dirname, 'dist');
if (process.env.VERCEL) {
  // On Vercel Serverless Function, static assets are served directly by Vercel CDN
} else if (process.env.NODE_ENV === 'production' || fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) return res.status(404).json({ error: 'API not found' });
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Mount Vite on Express in development
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
}

const PORT = process.env.PORT || 3000;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

export default app;
