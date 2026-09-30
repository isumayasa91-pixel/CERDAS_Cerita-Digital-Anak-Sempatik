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
  getDoc
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
  guruWali?: string;
  timestamp: string;
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
}

const DEFAULT_STUDENTS: Student[] = [
  { id: 'budi', name: 'Budi Setiawan', class: 'Kelas VII A', avatar: '👦', status: 'Aktif', guruWali: 'Ibu Rahma, S.Pd', createdAt: new Date().toISOString() },
  { id: 'siti', name: 'Siti Rahma', class: 'Kelas VII A', avatar: '👧', status: 'Aktif', guruWali: 'Ibu Rahma, S.Pd', createdAt: new Date().toISOString() },
  { id: 'andi', name: 'Andi Prasetyo', class: 'Kelas VIII B', avatar: '🧑', status: 'Aktif', guruWali: 'Bapak I Sumayasa, M.Pd', createdAt: new Date().toISOString() },
];

const DEFAULT_TEACHERS: Teacher[] = [
  { id: 't-1', name: 'Ibu Rahma, S.Pd', email: 'rahma@cerdas.id', password: 'password123', class: 'Kelas VII A', createdAt: new Date().toISOString() },
  { id: 't-2', name: 'Bapak I Sumayasa, M.Pd', email: 'isumayasa91@guru.smp.belajar.id', password: 'password123', class: 'Kelas VIII A', createdAt: new Date().toISOString() },
  { id: 't-3', name: 'Bapak Deni Saputra, S.Pd', email: 'deni@cerdas.id', password: 'password123', class: 'Kelas IX A', createdAt: new Date().toISOString() },
  { id: 't-4', name: 'Ibu Sri Wahyuni, S.Pd', email: 'sri@cerdas.id', password: 'password123', class: 'Umum', createdAt: new Date().toISOString() },
];

const DEFAULT_STORIES: Story[] = [
  {
    id: 'story-mock-1',
    studentId: 'budi',
    studentName: 'Budi Setiawan',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 * 2).toISOString(),
    fact: 'Tadi siang aku bertengkar dengan Andi di kelas karena kami berebut lego helikopter. Aku kesal sekali dan merebutnya dari tangan Andi.',
    feeling: 'Marah',
    character: 'Koko',
    finding: 'Lego di kelas itu milik bersama, bukan milikku sendiri. Seharusnya aku mengantre atau memainkannya bersama Andi.',
    future: 'Besok pagi aku mau menemui Andi di kelas dan minta maaf. Aku juga mau mengajaknya merakit lego helikopter itu bersama-sama.',
    audioBase64: '',
    guruNote: 'Hebat Budi sudah menyadari kesalahannya dan berani berniat meminta maaf langsung ke Andi. Pertahankan sikap ksatria ini ya!',
    counselorNote: '',
    escalated: false,
    status: 'Selesai Direfleksi',
    aiRecommendation: 'Apresiasi keberanian Budi mengakui kesalahan. Ajak Budi berlatih teknik pernapasan saat emosi marah mulai muncul sebelum bertindak.'
  },
  {
    id: 'story-mock-2',
    studentId: 'siti',
    studentName: 'Siti Rahma',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000 * 1).toISOString(),
    fact: 'Aku merasa sedih karena tugas kelompok Matematika kemarin belum selesai dan teman-temanku belum mengirimkan bagian mereka.',
    feeling: 'Sedih',
    character: 'Mimi',
    finding: 'Komunikasi di awal kelompok sangat penting. Jika ada kendala, aku sebaiknya bertanya langsung ke guru atau berdiskusi lebih awal.',
    future: 'Aku akan mengingatkan teman-teman di grup WhatsApp dengan ramah dan mengajak belajar bersama nanti sore di perpustakaan.',
    audioBase64: '',
    guruNote: '',
    counselorNote: '',
    escalated: false,
    status: 'Menunggu Diperiksa',
    aiRecommendation: 'Berikan penguatan pada inisiatif kepemimpinan Siti. Dorong Siti untuk membagi tugas secara adil dengan tenggat waktu yang jelas.'
  },
  {
    id: 'story-mock-3',
    studentId: 'andi',
    studentName: 'Andi Prasetyo',
    timestamp: new Date().toISOString(),
    fact: 'Kemarin ada siswa kelas lain yang mengejek penampilanku saat upacara bendera di lapangan. Aku merasa sangat malu dan takut ke sekolah hari ini.',
    feeling: 'Takut',
    character: 'Giga',
    finding: 'Ejekan orang lain tidak mencerminkan nilai diriku. Aku berhak merasa aman di sekolah dan tidak boleh memendamnya sendirian.',
    future: 'Aku memberanikan diri menulis ini di CERDAS agar Guru Wali dan Guru BK dapat membantuku merasa lebih aman.',
    audioBase64: '',
    guruNote: 'Terima kasih sudah bercerita secara jujur Andi. Bapak akan segera berkoordinasi dengan Guru BK untuk mendampingi kamu.',
    counselorNote: 'Andi telah dijadwalkan sesi konseling suportif di ruang BK hari Rabu pukul 09.00. Pendampingan berkelanjutan telah dimulai.',
    escalated: true,
    status: 'Butuh Bantuan',
    aiRecommendation: 'Perlu intervensi suportif segera dari Guru BK untuk memberikan ruang aman dan mengidentifikasi potensi perundungan (bullying).'
  }
];

// Seed initial data if collections are empty
export async function seedInitialFirestoreData() {
  try {
    const studentsSnap = await getDocs(collection(db, 'students'));
    if (studentsSnap.empty) {
      console.log('Seeding initial students to Firestore...');
      for (const st of DEFAULT_STUDENTS) {
        await setDoc(doc(db, 'students', st.id), st);
      }
    }

    const teachersSnap = await getDocs(collection(db, 'teachers'));
    if (teachersSnap.empty) {
      console.log('Seeding initial teachers to Firestore...');
      for (const t of DEFAULT_TEACHERS) {
        await setDoc(doc(db, 'teachers', t.id), t);
      }
    }

    const storiesSnap = await getDocs(collection(db, 'stories'));
    if (storiesSnap.empty) {
      console.log('Seeding initial stories to Firestore...');
      for (const s of DEFAULT_STORIES) {
        await setDoc(doc(db, 'stories', s.id), s);
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seed');
  }
}

// Function to bulk generate 465 students across Grade 7, 8, 9 (15 classes x 31 students)
export async function seedFullRoster465StudentsToFirestore(): Promise<number> {
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
    { name: 'Kelas VII A', guru: 'Ibu Rahma, S.Pd' },
    { name: 'Kelas VII B', guru: 'Ibu Rahma, S.Pd' },
    { name: 'Kelas VII C', guru: 'Ibu Rahma, S.Pd' },
    { name: 'Kelas VII D', guru: 'Ibu Rahma, S.Pd' },
    { name: 'Kelas VII E', guru: 'Ibu Rahma, S.Pd' },

    { name: 'Kelas VIII A', guru: 'Bapak I Sumayasa, M.Pd' },
    { name: 'Kelas VIII B', guru: 'Bapak I Sumayasa, M.Pd' },
    { name: 'Kelas VIII C', guru: 'Bapak I Sumayasa, M.Pd' },
    { name: 'Kelas VIII D', guru: 'Bapak I Sumayasa, M.Pd' },
    { name: 'Kelas VIII E', guru: 'Bapak I Sumayasa, M.Pd' },

    { name: 'Kelas IX A', guru: 'Bapak Deni Saputra, S.Pd' },
    { name: 'Kelas IX B', guru: 'Bapak Deni Saputra, S.Pd' },
    { name: 'Kelas IX C', guru: 'Bapak Deni Saputra, S.Pd' },
    { name: 'Kelas IX D', guru: 'Bapak Deni Saputra, S.Pd' },
    { name: 'Kelas IX E', guru: 'Bapak Deni Saputra, S.Pd' },
  ];

  let count = 0;
  try {
    for (const cls of classes) {
      // 31 students per class x 15 classes = 465 students
      for (let i = 1; i <= 31; i++) {
        const fn = firstNames[(count + i * 3) % firstNames.length];
        const ln = lastNames[(count + i * 7) % lastNames.length];
        const isGirl = ['Siti', 'Nia', 'Luh', 'Cantika', 'Hani', 'Indah', 'Kiki', 'Nabila', 'Oktavia', 'Pratiwi', 'Salsa', 'Vania', 'Yulia', 'Citra'].includes(fn);
        const avatar = isGirl ? '👧' : '👦';
        const studentId = `st-roster-${cls.name.replace(/\s+/g, '-').toLowerCase()}-${i}`;
        
        const newStudent: Student = {
          id: studentId,
          name: `${fn} ${ln}`,
          class: cls.name,
          avatar: avatar,
          status: 'Aktif',
          guruWali: cls.guru,
          createdAt: new Date().toISOString()
        };

        await setDoc(doc(db, 'students', studentId), newStudent);
        count++;
      }
    }
    return count;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, 'bulk-students');
    throw error;
  }
}

// Subscribe to Students collection in real-time
export function subscribeStudents(callback: (students: Student[]) => void) {
  return onSnapshot(
    collection(db, 'students'),
    (snapshot) => {
      const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Student));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'students');
    }
  );
}

// Subscribe to Teachers collection in real-time
export function subscribeTeachers(callback: (teachers: Teacher[]) => void) {
  return onSnapshot(
    collection(db, 'teachers'),
    (snapshot) => {
      const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Teacher));
      callback(list);
    },
    (error) => {
      handleFirestoreError(error, OperationType.LIST, 'teachers');
    }
  );
}

// Subscribe to Stories collection in real-time
export function subscribeStories(callback: (stories: Story[]) => void) {
  return onSnapshot(
    collection(db, 'stories'),
    (snapshot) => {
      const list = snapshot.docs.map(d => ({ ...d.data(), id: d.id } as Story));
      // Sort newest first
      list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(list);
    },
    (error) => {
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
    await updateDoc(ref, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `students/${studentId}`);
    throw error;
  }
}

// Add Student
export async function addStudentToFirestore(studentData: { name: string; class: string; avatar: string; guruWali: string }): Promise<Student> {
  const id = `student-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
  const newStudent: Student = {
    id,
    name: studentData.name,
    class: studentData.class,
    avatar: studentData.avatar || '👦',
    status: 'Aktif',
    guruWali: studentData.guruWali,
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, 'students', id), newStudent);
    return newStudent;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `students/${id}`);
    throw error;
  }
}

// Delete Student and associated stories
export async function deleteStudentFromFirestore(studentId: string, associatedStories: Story[]) {
  try {
    await deleteDoc(doc(db, 'students', studentId));
    for (const st of associatedStories) {
      if (st.studentId === studentId) {
        await deleteDoc(doc(db, 'stories', st.id));
      }
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `students/${studentId}`);
    throw error;
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

  try {
    await setDoc(doc(db, 'teachers', id), newTeacher);
    return newTeacher;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `teachers/${id}`);
    throw error;
  }
}

// Delete Teacher
export async function deleteTeacherFromFirestore(teacherId: string) {
  try {
    await deleteDoc(doc(db, 'teachers', teacherId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `teachers/${teacherId}`);
    throw error;
  }
}

// Update Teacher
export async function updateTeacherInFirestore(teacherId: string, updates: Partial<Teacher>) {
  try {
    const ref = doc(db, 'teachers', teacherId);
    await updateDoc(ref, updates);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `teachers/${teacherId}`);
    throw error;
  }
}

// Update Guru Note on Story
export async function updateGuruNoteInFirestore(storyId: string, guruNote: string) {
  try {
    const ref = doc(db, 'stories', storyId);
    await updateDoc(ref, {
      guruNote,
      status: 'Selesai Direfleksi'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    throw error;
  }
}

// Escalate Story to Guru BK
export async function escalateStoryInFirestore(storyId: string) {
  try {
    const ref = doc(db, 'stories', storyId);
    await updateDoc(ref, {
      escalated: true,
      status: 'Butuh Bantuan'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    throw error;
  }
}

// Update Counselor Note (Guru BK)
export async function updateCounselorNoteInFirestore(storyId: string, counselorNote: string) {
  try {
    const ref = doc(db, 'stories', storyId);
    await updateDoc(ref, {
      counselorNote,
      escalated: true,
      status: 'Butuh Bantuan'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    throw error;
  }
}

// Resolve Story
export async function resolveStoryInFirestore(storyId: string) {
  try {
    const ref = doc(db, 'stories', storyId);
    await updateDoc(ref, {
      status: 'Teratasi'
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `stories/${storyId}`);
    throw error;
  }
}
