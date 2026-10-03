import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDoc,
  writeBatch
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export interface Student {
  id: string;
  name: string;
  class: string;
  avatar: string;
  status: string;
  guruWali: string;
  createdAt?: string;
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  password?: string;
  class: string;
  createdAt?: string;
}

export interface Story {
  id: string;
  studentId: string;
  studentName: string;
  studentClass?: string;
  guruWali?: string;
  timestamp: string;
  emotion?: string;
  emoji?: string;
  fact: string;
  feeling: string;
  character: string;
  finding: string;
  future: string;
  audioBase64?: string;
  guruNote?: string;
  counselorNote?: string;
  escalated?: boolean;
  status?: string;
  aiRecommendation?: string;
  score?: number;
  attendance?: string;
}

// Function to generate the full registered student roster across Grade 7, 8, 9 (15 classes x 31 students)
export function generateRegisteredStudents(): Student[] {
  const firstNames = [
    'Prama', 'Budi', 'Siti', 'Andi', 'Putu', 'Made', 'Kadek', 'Nyoman', 'Ketut', 'Ahmad',
    'Dewa', 'Nia', 'Gede', 'Luh', 'Wayan', 'Cantika', 'Deni', 'Eka', 'Farhan', 'Gilang',
    'Hani', 'Indah', 'Joko', 'Kiki', 'Lintang', 'Muhammad', 'Nabila', 'Oktavia', 'Pratiwi', 'Rian',
    'Salsa', 'Taufik', 'Utama', 'Vania', 'Wahyu', 'Yulia', 'Zikri', 'Agus', 'Bintang', 'Citra'
  ];

  const lastNames = [
    'Setiawan', 'Pratama', 'Widya', 'Lestari', 'Suardana', 'Wibawa', 'Rahma', 'Prasetyo',
    'Kencana', 'Laksmi', 'Permana', 'Saputra', 'Sari', 'Utami', 'Firmansyah', 'Suryani',
    'Hidayat', 'Anggraini', 'Wijaya', 'Febrian', 'Mahardika', 'Kusuma', 'Santoso', 'Yuda'
  ];

  const classes = [
    { name: 'Kelas VII A', guru: 'I Nyoman Gede Juwastra, S.Sn' },
    { name: 'Kelas VII B', guru: 'Ibu Rahma, S.Pd' },
    { name: 'Kelas VII C', guru: 'Ibu Rahma, S.Pd' },
    { name: 'Kelas VII D', guru: 'Ibu Rahma, S.Pd' },
    { name: 'Kelas VII E', guru: 'Ibu Rahma, S.Pd' },

    { name: 'Kelas VIII A', guru: 'I Wayan Sumayasa, S.Pd' },
    { name: 'Kelas VIII B', guru: 'I Wayan Sumayasa, S.Pd' },
    { name: 'Kelas VIII C', guru: 'I Wayan Sumayasa, S.Pd' },
    { name: 'Kelas VIII D', guru: 'I Wayan Sumayasa, S.Pd' },
    { name: 'Kelas VIII E', guru: 'I Wayan Sumayasa, S.Pd' },

    { name: 'Kelas IX A', guru: 'Bapak Deni Saputra, S.Pd' },
    { name: 'Kelas IX B', guru: 'Bapak Deni Saputra, S.Pd' },
    { name: 'Kelas IX C', guru: 'Bapak Deni Saputra, S.Pd' },
    { name: 'Kelas IX D', guru: 'Bapak Deni Saputra, S.Pd' },
    { name: 'Kelas IX E', guru: 'Bapak Deni Saputra, S.Pd' },
  ];

  const list: Student[] = [];
  let count = 0;
  for (const cls of classes) {
    for (let i = 1; i <= 31; i++) {
      const fn = firstNames[(count + i * 3) % firstNames.length];
      const ln = lastNames[(count + i * 7) % lastNames.length];
      const isGirl = ['Siti', 'Nia', 'Luh', 'Cantika', 'Hani', 'Indah', 'Kiki', 'Nabila', 'Oktavia', 'Pratiwi', 'Salsa', 'Vania', 'Yulia', 'Citra'].includes(fn);
      const avatar = isGirl ? '👧' : '👦';
      const studentId = `st-${cls.name.replace(/\s+/g, '-').toLowerCase()}-${i}`;
      
      list.push({
        id: studentId,
        name: `${fn} ${ln}`,
        class: cls.name,
        avatar: avatar,
        status: 'Aktif',
        guruWali: cls.guru,
        createdAt: '2026-01-01T00:00:00.000Z'
      });
      count++;
    }
  }
  return list;
}

export const DEFAULT_STUDENTS: Student[] = generateRegisteredStudents();

export const DEFAULT_TEACHERS: Teacher[] = [
  { id: 't-1', name: 'I Nyoman Gede Juwastra, S.Sn', email: 'nyoman@cerdas.id', password: 'password123', class: 'Kelas VII A', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 't-2', name: 'Ibu Rahma, S.Pd', email: 'rahma@cerdas.id', password: 'password123', class: 'Kelas VII B, Kelas VII C, Kelas VII D, Kelas VII E', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 't-3', name: 'I Wayan Sumayasa, S.Pd', email: 'isumayasa91@guru.smp.belajar.id', password: 'password123', class: 'Kelas VIII A, Kelas VIII B, Kelas VIII C, Kelas VIII D, Kelas VIII E', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 't-4', name: 'Bapak Deni Saputra, S.Pd', email: 'deni@cerdas.id', password: 'password123', class: 'Kelas IX A, Kelas IX B, Kelas IX C, Kelas IX D, Kelas IX E', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 't-bk', name: 'Ni Made Medi Astuti, S.Pd., M.Pd', email: 'mediastuti@cerdas.id', password: 'password123', class: 'Guru BK (Kelas VII - IX)', createdAt: '2026-01-01T00:00:00.000Z' },
  { id: 't-5', name: 'Ibu Sri Wahyuni, S.Pd', email: 'sri@cerdas.id', password: 'password123', class: 'Umum', createdAt: '2026-01-01T00:00:00.000Z' },
];

export const DEFAULT_STORIES: Story[] = [
  {
    id: 'story-1',
    studentId: 'st-kelas-viii-a-1',
    studentName: 'Prama Setiawan',
    studentClass: 'Kelas VIII A',
    emotion: 'Senang',
    emoji: '😊',
    fact: 'Hari ini kami belajar IPA tentang ekosistem dan membuat proyek kelompok bersama teman-teman sekelas.',
    feeling: 'Saya merasa sangat bersemangat dan gembira karena kelompok kami sangat kompak dan saling membantu.',
    character: 'Kerja Sama & Gotong Royong',
    finding: 'Saya belajar bahwa kerja sama tim membuat tugas yang sulit menjadi jauh lebih mudah dan menyenangkan.',
    future: 'Besok saya ingin lebih aktif lagi bertanya kepada Pak Wayan dan membantu teman yang belum paham materi.',
    timestamp: '2026-03-01T08:30:00.000Z',
    status: 'Selesai Direfleksi',
    guruWali: 'I Wayan Sumayasa, S.Pd',
    guruNote: 'Bagus sekali Prama! Pertahankan semangat kolaborasi dan keaktifanmu di kelas.',
    score: 95,
    attendance: 'Hadir',
    escalated: false
  },
  {
    id: 'story-2',
    studentId: 'st-kelas-vii-a-1',
    studentName: 'Budi Pratama',
    studentClass: 'Kelas VII A',
    emotion: 'Cemas',
    emoji: '😰',
    fact: 'Tadi siang ada ulangan harian matematika mendadak tentang pecahan aljabar.',
    feeling: 'Awalnya saya merasa panik dan takut nilainya kurang bagus karena belum sempat belajar mendalam.',
    character: 'Mandiri & Disiplin Belajar',
    finding: 'Saya menyadari pentingnya mengulang pelajaran setiap malam agar selalu siap kapan saja ada kuis.',
    future: 'Saya akan membuat jadwal belajar rutin 30 menit setiap malam sebelum istirahat tidur.',
    timestamp: '2026-03-01T09:15:00.000Z',
    status: 'Selesai Direfleksi',
    guruWali: 'I Nyoman Gede Juwastra, S.Sn',
    guruNote: 'Tetap tenang Budi, bapak yakin dengan latihan rutin kamu pasti bisa memahami aljabar dengan sangat baik.',
    score: 88,
    attendance: 'Hadir',
    escalated: false
  },
  {
    id: 'story-3',
    studentId: 'st-kelas-vii-b-1',
    studentName: 'Siti Rahma',
    studentClass: 'Kelas VII B',
    emotion: 'Sedih',
    emoji: '😢',
    fact: 'Waktu istirahat tadi ada teman yang tidak sengaja merusak gambar prakarya seni yang sudah saya siapkan.',
    feeling: 'Saya merasa sangat sedih dan kecewa karena sudah mengerjakannya berhari-hari di rumah.',
    character: 'Empati & Pemaaf',
    finding: 'Teman saya sudah meminta maaf dengan tulus dan bersedia membantu merapikan kembali bersama-sama.',
    future: 'Saya akan memaafkannya dan bersama-sama menyelesaikan perbaikan tugas prakarya tersebut.',
    timestamp: '2026-03-01T10:00:00.000Z',
    status: 'Butuh Bantuan',
    guruWali: 'Ibu Rahma, S.Pd',
    escalated: true,
    counselorNote: 'Konseling suportif telah diberikan bersama Ibu Rahma. Hubungan antar siswa kembali harmonis dan tugas selesai.',
    guruNote: 'Sikap pemaaf Siti sangat terpuji. Ibu bantu sediakan perlengkapan pengganti ya.',
    score: 90,
    attendance: 'Hadir'
  },
  {
    id: 'story-4',
    studentId: 'st-kelas-viii-a-2',
    studentName: 'Andi Prasetyo',
    studentClass: 'Kelas VIII A',
    emotion: 'Bangga',
    emoji: '🌟',
    fact: 'Tadi pagi saya maju ke depan kelas untuk mempresentasikan hasil karya puisi Bahasa Indonesia.',
    feeling: 'Sangat bangga dan lega karena mendapat tepuk tangan apresiasi dari teman sekelas dan Pak Wayan.',
    character: 'Percaya Diri & Kreatif',
    finding: 'Keberanian berbicara di depan umum ternyata bisa dilatih jika kita mempersiapkannya dengan matang.',
    future: 'Saya ingin mencoba ikut lomba baca puisi antar kelas pada peringatan Bulan Bahasa mendatang.',
    timestamp: '2026-03-02T07:45:00.000Z',
    status: 'Selesai Direfleksi',
    guruWali: 'I Wayan Sumayasa, S.Pd',
    guruNote: 'Penampilan yang luar biasa Andi! Diksi puisimu sangat menyentuh. Bapak dukung penuh untuk ikut lomba.',
    score: 98,
    attendance: 'Hadir',
    escalated: false
  },
  {
    id: 'story-5',
    studentId: 'st-kelas-ix-a-1',
    studentName: 'Dewa Ayu Lestari',
    studentClass: 'Kelas IX A',
    emotion: 'Semangat',
    emoji: '🔥',
    fact: 'Mengikuti bimbingan belajar persiapan asesmen akhir bersama Pak Deni dan teman kelompok.',
    feeling: 'Merasa tertantang dan semakin percaya diri menghadapi ujian kelulusan.',
    character: 'Pantang Menyerah & Berpikir Kritis',
    finding: 'Latihan soal secara konsisten membuat rumus yang rumit jadi lebih mudah dipahami.',
    future: 'Akan membentuk kelompok belajar sore bersama teman-teman di perpustakaan sekolah.',
    timestamp: '2026-03-02T08:10:00.000Z',
    status: 'Selesai Direfleksi',
    guruWali: 'Bapak Deni Saputra, S.Pd',
    guruNote: 'Semangat terus Dewa Ayu! Konsistensi belajar adalah kunci kesuksesan.',
    score: 96,
    attendance: 'Hadir',
    escalated: false
  }
];

// Seed full student roster, teacher accounts, and stories to Cloud Firestore
export async function restoreAllStudentsData(): Promise<number> {
  try {
    localStorage.removeItem('cerdas_deleted_student_ids');
    localStorage.removeItem('cerdas_deleted_teacher_ids');
    
    // Seed students in chunks
    const chunkSize = 300;
    for (let i = 0; i < DEFAULT_STUDENTS.length; i += chunkSize) {
      const chunk = DEFAULT_STUDENTS.slice(i, i + chunkSize);
      const batch = writeBatch(db);
      for (const student of chunk) {
        batch.set(doc(db, 'students', student.id), student, { merge: true });
      }
      await batch.commit();
    }

    // Ensure teachers are written
    const teacherBatch = writeBatch(db);
    for (const t of DEFAULT_TEACHERS) {
      teacherBatch.set(doc(db, 'teachers', t.id), t, { merge: true });
    }
    await teacherBatch.commit();

    // Ensure stories are written
    const storyBatch = writeBatch(db);
    for (const st of DEFAULT_STORIES) {
      storyBatch.set(doc(db, 'stories', st.id), st, { merge: true });
    }
    await storyBatch.commit();

    return DEFAULT_STUDENTS.length;
  } catch (err) {
    console.error('Error restoring students:', err);
    throw err;
  }
}

// Seed initial data
export async function seedInitialFirestoreData(): Promise<void> {
  try {
    // 1. Ensure teachers are registered in Firestore
    const snapTeachers = await getDocs(collection(db, 'teachers'));
    if (snapTeachers.empty || snapTeachers.docs.length === 0) {
      console.log('Seeding initial teacher accounts to Firestore...');
      const batch = writeBatch(db);
      for (const t of DEFAULT_TEACHERS) {
        batch.set(doc(db, 'teachers', t.id), t, { merge: true });
      }
      await batch.commit();
    }

    // 2. Ensure students are seeded if empty
    const snapStudents = await getDocs(collection(db, 'students'));
    if (snapStudents.empty || snapStudents.docs.length === 0) {
      console.log('Seeding student roster to Firestore...');
      await restoreAllStudentsData();
    }

    // 3. Ensure stories are seeded if empty
    const snapStories = await getDocs(collection(db, 'stories'));
    if (snapStories.empty || snapStories.docs.length === 0) {
      console.log('Seeding initial stories to Firestore...');
      const storyBatch = writeBatch(db);
      for (const st of DEFAULT_STORIES) {
        storyBatch.set(doc(db, 'stories', st.id), st, { merge: true });
      }
      await storyBatch.commit();
    }
  } catch (err) {
    console.warn('Note on initial seeding:', err);
  }
}

// Restore all default teachers & clear local deletion filters
export async function restoreAllTeachersRoster(): Promise<number> {
  try {
    localStorage.removeItem('cerdas_deleted_teacher_ids');
    const teacherBatch = writeBatch(db);
    for (const teacher of DEFAULT_TEACHERS) {
      saveCustomTeacherLocally(teacher);
      teacherBatch.set(doc(db, 'teachers', teacher.id), teacher, { merge: true });
    }
    await teacherBatch.commit();
    return DEFAULT_TEACHERS.length;
  } catch (err) {
    console.error('Failed to restore teachers:', err);
    throw err;
  }
}

// Explicitly save and sync all teachers list to Cloud Firestore
export async function syncAllTeachersToFirestore(teachersList: Teacher[]): Promise<number> {
  try {
    localStorage.removeItem('cerdas_deleted_teacher_ids');
    const batch = writeBatch(db);
    for (const teacher of teachersList) {
      saveCustomTeacherLocally(teacher);
      batch.set(doc(db, 'teachers', teacher.id), teacher, { merge: true });
    }
    await batch.commit();
    return teachersList.length;
  } catch (err) {
    console.error('Failed to sync teachers to Cloud Firestore:', err);
    throw err;
  }
}

// Bulk delete demo students
export async function bulkDeleteDemoStudents(): Promise<void> {
  return;
}

// Local deletion and custom persistence for students
export function getDeletedStudentIds(): string[] {
  try {
    const saved = localStorage.getItem('cerdas_deleted_student_ids');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function markStudentDeletedLocally(id: string) {
  try {
    const current = getDeletedStudentIds();
    if (!current.includes(id)) {
      localStorage.setItem('cerdas_deleted_student_ids', JSON.stringify([...current, id]));
    }
    removeCustomStudentLocally(id);
  } catch (e) {
    console.warn(e);
  }
}

export function unmarkStudentDeletedLocally(id: string) {
  try {
    const current = getDeletedStudentIds();
    localStorage.setItem('cerdas_deleted_student_ids', JSON.stringify(current.filter(i => i !== id)));
  } catch (e) {
    console.warn(e);
  }
}

export function getCustomStudents(): Student[] {
  try {
    const saved = localStorage.getItem('cerdas_custom_students');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCustomStudentLocally(student: Student) {
  try {
    const list = getCustomStudents().filter(s => s.id !== student.id);
    localStorage.setItem('cerdas_custom_students', JSON.stringify([student, ...list]));
    unmarkStudentDeletedLocally(student.id);
  } catch (e) {
    console.warn(e);
  }
}

export function removeCustomStudentLocally(studentId: string) {
  try {
    const list = getCustomStudents().filter(s => s.id !== studentId);
    localStorage.setItem('cerdas_custom_students', JSON.stringify(list));
  } catch (e) {
    console.warn(e);
  }
}

// Subscribe to Students collection in real-time
export function subscribeStudents(callback: (students: Student[]) => void) {
  return onSnapshot(
    collection(db, 'students'),
    (snapshot) => {
      const deletedIds = new Set(getDeletedStudentIds());
      const customStudents = getCustomStudents().filter(s => !deletedIds.has(s.id));
      const firestoreStudents = snapshot.docs
        .map(d => ({ ...d.data(), id: d.id } as Student))
        .filter(s => !!s.id && !!s.name && !deletedIds.has(s.id));

      const mergedMap = new Map<string, Student>();
      // 1. Defaults (always available so all 15 classes are accessible)
      for (const s of DEFAULT_STUDENTS) {
        if (!deletedIds.has(s.id)) mergedMap.set(s.id, s);
      }
      // 2. Custom local registered students
      for (const s of customStudents) {
        if (!deletedIds.has(s.id)) mergedMap.set(s.id, s);
      }
      // 3. Firestore cloud registered students
      for (const s of firestoreStudents) {
        if (!deletedIds.has(s.id)) mergedMap.set(s.id, s);
      }

      callback(Array.from(mergedMap.values()));
    },
    (error) => {
      const deletedIds = new Set(getDeletedStudentIds());
      const customStudents = getCustomStudents().filter(s => !deletedIds.has(s.id));
      const defaults = DEFAULT_STUDENTS.filter(s => !deletedIds.has(s.id));
      const mergedMap = new Map<string, Student>();
      for (const s of defaults) mergedMap.set(s.id, s);
      for (const s of customStudents) mergedMap.set(s.id, s);
      callback(Array.from(mergedMap.values()));
      handleFirestoreError(error, OperationType.LIST, 'students');
    }
  );
}

// Local deletion and custom persistence for teachers
export function getDeletedTeacherIds(): string[] {
  try {
    const saved = localStorage.getItem('cerdas_deleted_teacher_ids');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function markTeacherDeletedLocally(id: string) {
  try {
    const current = getDeletedTeacherIds();
    if (!current.includes(id)) {
      localStorage.setItem('cerdas_deleted_teacher_ids', JSON.stringify([...current, id]));
    }
    removeCustomTeacherLocally(id);
  } catch (e) {
    console.warn(e);
  }
}

export function unmarkTeacherDeletedLocally(id: string) {
  try {
    const current = getDeletedTeacherIds();
    localStorage.setItem('cerdas_deleted_teacher_ids', JSON.stringify(current.filter(i => i !== id)));
  } catch (e) {
    console.warn(e);
  }
}

export function getCustomTeachers(): Teacher[] {
  try {
    const saved = localStorage.getItem('cerdas_custom_teachers');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveCustomTeacherLocally(teacher: Teacher) {
  try {
    const list = getCustomTeachers().filter(t => t.id !== teacher.id);
    localStorage.setItem('cerdas_custom_teachers', JSON.stringify([teacher, ...list]));
    unmarkTeacherDeletedLocally(teacher.id);
  } catch (e) {
    console.warn(e);
  }
}

export function removeCustomTeacherLocally(teacherId: string) {
  try {
    const list = getCustomTeachers().filter(t => t.id !== teacherId);
    localStorage.setItem('cerdas_custom_teachers', JSON.stringify(list));
  } catch (e) {
    console.warn(e);
  }
}

// Subscribe to Teachers collection in real-time
export function subscribeTeachers(callback: (teachers: Teacher[]) => void) {
  return onSnapshot(
    collection(db, 'teachers'),
    (snapshot) => {
      const deletedIds = new Set(getDeletedTeacherIds());
      const customTeachers = getCustomTeachers().filter(t => !deletedIds.has(t.id));
      const firestoreTeachers = snapshot.docs
        .map(d => ({ ...d.data(), id: d.id } as Teacher))
        .filter(t => !deletedIds.has(t.id));

      const mergedMap = new Map<string, Teacher>();
      // 1. Defaults
      for (const t of DEFAULT_TEACHERS) {
        if (!deletedIds.has(t.id)) mergedMap.set(t.id, t);
      }
      // 2. Custom local teachers
      for (const t of customTeachers) {
        if (!deletedIds.has(t.id)) mergedMap.set(t.id, t);
      }
      // 3. Cloud Firestore teachers
      for (const t of firestoreTeachers) {
        if (!deletedIds.has(t.id)) mergedMap.set(t.id, t);
      }

      callback(Array.from(mergedMap.values()));
    },
    (error) => {
      const deletedIds = new Set(getDeletedTeacherIds());
      const customTeachers = getCustomTeachers().filter(t => !deletedIds.has(t.id));
      const defaults = DEFAULT_TEACHERS.filter(t => !deletedIds.has(t.id));
      const mergedMap = new Map<string, Teacher>();
      for (const t of defaults) mergedMap.set(t.id, t);
      for (const t of customTeachers) mergedMap.set(t.id, t);
      callback(Array.from(mergedMap.values()));
      handleFirestoreError(error, OperationType.LIST, 'teachers');
    }
  );
}

// Subscribe to Stories collection in real-time
export function subscribeStories(callback: (stories: Story[]) => void) {
  return onSnapshot(
    collection(db, 'stories'),
    (snapshot) => {
      const firestoreStories = snapshot.docs
        .map(d => ({ ...d.data(), id: d.id } as Story))
        .filter(s => !!s.id);

      const storyMap = new Map<string, Story>();
      // 1. Default stories
      for (const st of DEFAULT_STORIES) {
        storyMap.set(st.id, st);
      }
      // 2. Firestore cloud stories (replaces or adds)
      for (const st of firestoreStories) {
        storyMap.set(st.id, st);
      }

      const list = Array.from(storyMap.values());
      // Sort newest first
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(list);
    },
    (error) => {
      const list = [...DEFAULT_STORIES];
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(list);
      handleFirestoreError(error, OperationType.LIST, 'stories');
    }
  );
}

// Save or Create Story
export async function saveStoryToFirestore(storyData: Omit<Story, 'id'> & { id?: string }): Promise<Story> {
  const storyId = storyData.id || `story-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const finalStory: Story = {
    ...storyData,
    id: storyId,
    timestamp: storyData.timestamp || new Date().toISOString(),
    status: storyData.status || 'Menunggu Diperiksa',
    escalated: storyData.escalated ?? false,
    guruNote: storyData.guruNote || '',
    counselorNote: storyData.counselorNote || '',
    aiRecommendation: storyData.aiRecommendation || ''
  };

  try {
    await setDoc(doc(db, 'stories', storyId), finalStory);
    return finalStory;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `stories/${storyId}`);
    throw error;
  }
}

// Update Student
export async function updateStudentInFirestore(studentId: string, updates: Partial<Student>) {
  try {
    const ref = doc(db, 'students', studentId);
    await setDoc(ref, updates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `students/${studentId}`);
    throw error;
  }
}


// Sync all students guruWali based on class-teacher assignment from teachers collection
// export async function syncAllStudentsGuruWali(): Promise<void> {
//   try {
//     const studentsSnap = await getDocs(collection(db, 'students'));
//     const teachersSnap = await getDocs(collection(db, 'teachers'));
//     const teachers = teachersSnap.docs.map(d => d.data() as Teacher);
//
//     const batch = writeBatch(db);
//     let updatesCount = 0;
//
//     for (const studentDoc of studentsSnap.docs) {
//       const student = { ...studentDoc.data(), id: studentDoc.id } as Student;
//       // Skip system auto-generated mock roster students
//       if (student.id.startsWith('st-roster-') || ['budi', 'siti', 'andi', 'prama'].includes(student.id)) continue;
//
//       // Find teacher assigned to this class
//       const teacher = teachers.find(t => t.class && t.class.includes(student.class) && !t.class.includes('BK'));
//       if (teacher && teacher.name !== student.guruWali) {
//         batch.update(doc(db, 'students', student.id), { guruWali: teacher.name });
//         updatesCount++;
//       }
//     }
//
//     if (updatesCount > 0) {
//       await batch.commit();
//     }
//   } catch (error) {
//     console.error('Error syncing guruWali:', error);
//     throw error;
//   }
// }

// Add Student
export async function addStudentToFirestore(studentData: { name: string; class: string; avatar: string; guruWali?: string }): Promise<Student> {
  const id = `student-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const expectedGuru = studentData.class === 'Kelas VII A' ? 'I Nyoman Gede Juwastra, S.Sn' :
                       studentData.class.startsWith('Kelas VII') ? 'Ibu Rahma, S.Pd' :
                       studentData.class.startsWith('Kelas VIII') ? 'I Wayan Sumayasa, S.Pd' :
                       studentData.class.startsWith('Kelas IX') ? 'Bapak Deni Saputra, S.Pd' : 'I Wayan Sumayasa, S.Pd';
  const newStudent: Student = {
    id,
    name: studentData.name,
    class: studentData.class,
    avatar: studentData.avatar || '👦',
    status: 'Aktif',
    guruWali: studentData.guruWali || expectedGuru,
    createdAt: new Date().toISOString()
  };

  saveCustomStudentLocally(newStudent);

  try {
    await setDoc(doc(db, 'students', id), newStudent);
    return newStudent;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `students/${id}`);
    return newStudent;
  }
}

// Delete Student and associated stories
export async function deleteStudentFromFirestore(studentId: string, associatedStories: Story[]) {
  markStudentDeletedLocally(studentId);
  try {
    await deleteDoc(doc(db, 'students', studentId));
    for (const st of associatedStories) {
      if (st.studentId === studentId) {
        await deleteDoc(doc(db, 'stories', st.id));
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `students/${studentId}`);
  }
}

// Register Teacher
export async function registerTeacherToFirestore(data: { name: string; email: string; password?: string; class: string }): Promise<Teacher> {
  const id = `t-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newTeacher: Teacher = {
    id,
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    class: data.class,
    createdAt: new Date().toISOString()
  };

  saveCustomTeacherLocally(newTeacher);

  try {
    await setDoc(doc(db, 'teachers', id), newTeacher);
    return newTeacher;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `teachers/${id}`);
    return newTeacher;
  }
}

// Delete Teacher
export async function deleteTeacherFromFirestore(teacherId: string) {
  markTeacherDeletedLocally(teacherId);
  try {
    await deleteDoc(doc(db, 'teachers', teacherId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `teachers/${teacherId}`);
  }
}

// Delete Story
export async function deleteStoryFromFirestore(storyId: string) {
  try {
    await deleteDoc(doc(db, 'stories', storyId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `stories/${storyId}`);
    throw error;
  }
}

// Update Teacher
export async function updateTeacherInFirestore(teacherId: string, updates: Partial<Teacher>) {
  try {
    const ref = doc(db, 'teachers', teacherId);
    await setDoc(ref, updates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `teachers/${teacherId}`);
    throw error;
  }
}

// Update Guru Note on Story
export async function updateGuruNoteInFirestore(storyId: string, guruNote: string, score?: number, attendance?: string) {
  try {
    const ref = doc(db, 'stories', storyId);
    const updates: any = {
      guruNote,
      status: 'Selesai Direfleksi'
    };
    if (score !== undefined) {
      updates.score = score;
    }
    if (attendance) {
      updates.attendance = attendance;
    }
    await setDoc(ref, updates, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    throw error;
  }
}

// Escalate Story to Guru BK
export async function escalateStoryInFirestore(storyId: string) {
  try {
    const ref = doc(db, 'stories', storyId);
    await setDoc(ref, {
      escalated: true,
      status: 'Butuh Bantuan'
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    throw error;
  }
}

// Remove Story from Guru BK Referral (Unescalate)
export async function unescalateStoryInFirestore(storyId: string) {
  try {
    const ref = doc(db, 'stories', storyId);
    await setDoc(ref, {
      escalated: false,
      status: 'Selesai Direfleksi'
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    throw error;
  }
}

// Update Counselor Note (Guru BK)
export async function updateCounselorNoteInFirestore(storyId: string, counselorNote: string) {
  try {
    const ref = doc(db, 'stories', storyId);
    await setDoc(ref, {
      counselorNote,
      escalated: true,
      status: 'Butuh Bantuan'
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    throw error;
  }
}

// Resolve Story
export async function resolveStoryInFirestore(storyId: string) {
  try {
    const ref = doc(db, 'stories', storyId);
    await setDoc(ref, {
      status: 'Teratasi'
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    throw error;
  }
}

// Bulk import students from Excel / Array
export async function bulkImportStudentsToFirestore(students: Array<{ name: string; class: string; guruWali?: string; avatar?: string }>): Promise<number> {
  const chunkSize = 300;
  let count = 0;
  
  for (let i = 0; i < students.length; i += chunkSize) {
    const chunk = students.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    
    for (const st of chunk) {
      const id = `student-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${count}`;
      const expectedGuru = st.guruWali || (
        st.class === 'Kelas VII A' ? 'I Nyoman Gede Juwastra, S.Sn' :
        st.class.startsWith('Kelas VII') ? 'Ibu Rahma, S.Pd' :
        st.class.startsWith('Kelas VIII') ? 'I Wayan Sumayasa, S.Pd' :
        st.class.startsWith('Kelas IX') ? 'Bapak Deni Saputra, S.Pd' : 'I Wayan Sumayasa, S.Pd'
      );
      
      const newStudent: Student = {
        id,
        name: st.name.trim(),
        class: st.class.trim(),
        avatar: st.avatar || (st.name.toLowerCase().includes('siti') || st.name.toLowerCase().includes('ayu') || st.name.toLowerCase().includes('luh') || st.name.toLowerCase().includes('dewi') ? '👧' : '👦'),
        status: 'Aktif',
        guruWali: expectedGuru,
        createdAt: new Date().toISOString()
      };
      
      saveCustomStudentLocally(newStudent);
      batch.set(doc(db, 'students', id), newStudent);
      count++;
    }
    await batch.commit();
  }
  
  return count;
}

// Bulk import teachers from Excel / Array
export async function bulkImportTeachersToFirestore(teachers: Array<{ name: string; email: string; password?: string; class: string }>): Promise<number> {
  const chunkSize = 300;
  let count = 0;
  
  for (let i = 0; i < teachers.length; i += chunkSize) {
    const chunk = teachers.slice(i, i + chunkSize);
    const batch = writeBatch(db);
    
    for (const t of chunk) {
      const id = `teacher-${Date.now()}-${Math.random().toString(36).substring(2, 7)}-${count}`;
      const newTeacher: Teacher = {
        id,
        name: t.name.trim(),
        email: t.email.trim().toLowerCase(),
        password: t.password || 'password123',
        class: t.class.trim(),
        createdAt: new Date().toISOString()
      };
      
      saveCustomTeacherLocally(newTeacher);
      batch.set(doc(db, 'teachers', id), newTeacher);
      count++;
    }
    await batch.commit();
  }
  
  return count;
}
