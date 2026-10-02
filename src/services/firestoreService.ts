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
  score?: number;
  attendance?: string;
}

const DEFAULT_STUDENTS: Student[] = [];

const DEFAULT_TEACHERS: Teacher[] = [
  { id: 't-1', name: 'I Nyoman Gede Juwastra, S.Sn', email: 'nyoman@cerdas.id', password: 'password123', class: 'Kelas VII A', createdAt: new Date().toISOString() },
  { id: 't-2', name: 'Ibu Rahma, S.Pd', email: 'rahma@cerdas.id', password: 'password123', class: 'Kelas VII B', createdAt: new Date().toISOString() },
  { id: 't-3', name: 'Bapak I Sumayasa, M.Pd', email: 'isumayasa91@guru.smp.belajar.id', password: 'password123', class: 'Kelas VIII A', createdAt: new Date().toISOString() },
  { id: 't-4', name: 'Bapak Deni Saputra, S.Pd', email: 'deni@cerdas.id', password: 'password123', class: 'Kelas IX A', createdAt: new Date().toISOString() },
  { id: 't-bk', name: 'Ni Made Medi Astuti, S.Pd., M.Pd', email: 'mediastuti@cerdas.id', password: 'password123', class: 'Guru BK (Kelas VII - IX)', createdAt: new Date().toISOString() },
  { id: 't-5', name: 'Ibu Sri Wahyuni, S.Pd', email: 'sri@cerdas.id', password: 'password123', class: 'Umum', createdAt: new Date().toISOString() },
];

const DEFAULT_STORIES: Story[] = [];

// Cleanup mock/auto-generated students and stories (only on-demand)
export async function cleanupMockStudentsAndStories() {
  try {
    const studentsSnap = await getDocs(collection(db, 'students')).catch(() => null);
    const storiesSnap = await getDocs(collection(db, 'stories')).catch(() => null);

    if (studentsSnap) {
      for (const docSnap of studentsSnap.docs) {
        const id = docSnap.id;
        if (['budi', 'siti', 'andi', 'prama'].includes(id) || id.startsWith('st-roster-')) {
          await deleteDoc(doc(db, 'students', id)).catch(() => {});
        }
      }
    }
    if (storiesSnap) {
      for (const storyDoc of storiesSnap.docs) {
        const id = storyDoc.id;
        if (id.startsWith('story-mock-')) {
          await deleteDoc(doc(db, 'stories', id)).catch(() => {});
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up mock students:', error);
  }
}

// Seed initial data if collections are empty
export async function seedInitialFirestoreData() {
  try {
    // Purge any stale system-generated mock data
    await cleanupMockStudentsAndStories();

    const teachersSnap = await getDocs(collection(db, 'teachers')).catch(() => null);
    if (teachersSnap && teachersSnap.empty) {
      for (const t of DEFAULT_TEACHERS) {
        await setDoc(doc(db, 'teachers', t.id), t, { merge: true }).catch(() => {});
      }
    }
  } catch (error) {
    console.warn('Initial seeding skipped:', error);
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
    { name: 'Kelas VII A', guru: 'I Nyoman Gede Juwastra, S.Sn' },
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
    const batch = writeBatch(db);
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

        batch.set(doc(db, 'students', studentId), newStudent);
        count++;
      }
    }
    await batch.commit();
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
      const list = snapshot.docs
        .map(d => ({ ...d.data(), id: d.id } as Student))
        .filter(s => {
          if (!s.id) return false;
          // Filter out system auto-generated mock roster students
          if (s.id.startsWith('st-roster-') || ['budi', 'siti', 'andi', 'prama'].includes(s.id)) return false;
          return true;
        });
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
      const list = snapshot.docs
        .map(d => ({ ...d.data(), id: d.id } as Story))
        .filter(s => {
          if (!s.id) return false;
          if (s.id.startsWith('story-mock-')) return false;
          if (s.studentId && (s.studentId.startsWith('st-roster-') || ['budi', 'siti', 'andi', 'prama'].includes(s.studentId))) return false;
          return true;
        });
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
                       studentData.class.startsWith('Kelas VIII') ? 'Bapak I Sumayasa, M.Pd' :
                       studentData.class.startsWith('Kelas IX') ? 'Bapak Deni Saputra, S.Pd' : 'Bapak I Sumayasa, M.Pd';
  const newStudent: Student = {
    id,
    name: studentData.name,
    class: studentData.class,
    avatar: studentData.avatar || '👦',
    status: 'Aktif',
    guruWali: studentData.guruWali || expectedGuru,
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
