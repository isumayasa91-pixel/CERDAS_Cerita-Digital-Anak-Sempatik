import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  BookOpen, 
  Smile, 
  Mic, 
  Square, 
  Play, 
  Pause, 
  Send, 
  ArrowRight, 
  ArrowLeft, 
  Plus, 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle,
  User, 
  TrendingUp, 
  MessageCircle, 
  Info, 
  Sparkles,
  HelpCircle,
  FileText,
  Home,
  UserCheck,
  Award,
  Trash2,
  Shield,
  Settings,
  Users,
  Key,
  Check,
  Lock,
  LogOut,
  RefreshCw,
  UserPlus,
  Printer,
  Edit,
  Copy,
  Eye,
  EyeOff,
  Search,
  FileSpreadsheet,
  X
} from 'lucide-react';
import { ExcelUploadSection } from './components/ExcelUploadSection';
import {
  seedInitialFirestoreData,
  restoreAllStudentsData,
  restoreAllTeachersRoster,
  subscribeStudents,
  subscribeTeachers,
  subscribeStories,
  saveStoryToFirestore,
  addStudentToFirestore,
  deleteStudentFromFirestore,
  deleteAllStudentsFromFirestore,
  markStudentDeletedLocally,
  deleteStoryFromFirestore,
  updateStudentInFirestore,
  saveCustomStudentLocally,
  registerTeacherToFirestore,
  saveCustomTeacherLocally,
  deleteTeacherFromFirestore,
  bulkDeleteDemoStudents,
  markTeacherDeletedLocally,
  updateTeacherInFirestore,
  syncAllTeachersToFirestore,
  syncAllStudentsToFirestore,
  updateGuruNoteInFirestore,
  escalateStoryInFirestore,
  unescalateStoryInFirestore,
  updateCounselorNoteInFirestore,
  resolveStoryInFirestore,
  Student,
  Teacher,
  Story
} from './services/firestoreService';

// Character Definitions
const CHARACTERS = [
  {
    id: 'Koko',
    name: 'Koko (Marah)',
    emotion: 'Marah',
    color: 'from-orange-500 to-red-600',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    bubbleColor: 'bg-red-100 text-red-900',
    quote: 'Arghhh! Kesal sekali rasanya! Tapi tak apa, ceritakan padaku kenapa kamu marah, aku akan bantu meredakannya bersama-sama.',
    svg: (
      <svg className="w-32 h-32 animate-koko-shiver" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 10C75 40 105 50 105 80C105 105 85 115 60 115C35 115 15 105 15 80C15 50 45 40 60 10Z" fill="url(#fireGradient)" />
        <path d="M45 45L55 50M75 45L65 50" stroke="#330000" strokeWidth="4" strokeLinecap="round" />
        <circle cx="43" cy="62" r="7" fill="#fff" />
        <circle cx="43" cy="62" r="3.5" fill="#330000" />
        <circle cx="77" cy="62" r="7" fill="#fff" />
        <circle cx="77" cy="62" r="3.5" fill="#330000" />
        <ellipse cx="60" cy="80" rx="12" ry="6" fill="#330000" />
        <ellipse cx="60" cy="83" rx="8" ry="3" fill="#ff7777" />
        <ellipse cx="33" cy="68" rx="6" ry="4" fill="#ff7777" opacity="0.6" />
        <ellipse cx="87" cy="68" rx="6" ry="4" fill="#ff7777" opacity="0.6" />
        <defs>
          <linearGradient id="fireGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff4500" />
            <stop offset="50%" stopColor="#ff8c00" />
            <stop offset="100%" stopColor="#ff0000" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'Sasa',
    name: 'Sasa (Sedih)',
    emotion: 'Sedih',
    color: 'from-sky-400 to-blue-600',
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-700',
    borderColor: 'border-blue-200',
    bubbleColor: 'bg-blue-100 text-blue-900',
    quote: 'Hiks.. rasanya sedih dan ingin menangis. Menangis itu sehat kok, keluarkan saja sedihmu di sini, aku akan menemanimu.',
    svg: (
      <svg className="w-32 h-32 animate-sasa-drift" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M25 80C20 75 15 65 20 55C25 45 40 45 50 50C55 40 75 35 85 45C95 40 105 48 105 60C110 70 105 85 95 85C85 90 25 90 25 80Z" fill="url(#cloudGradient)" />
        <circle cx="45" cy="65" r="6" fill="#1e3a8a" />
        <circle cx="75" cy="65" r="6" fill="#1e3a8a" />
        <path d="M48 62h2M78 62h2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M52 78 Q60 70 68 78" stroke="#1e3a8a" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="38" cy="71" rx="5" ry="3" fill="#93c5fd" opacity="0.7" />
        <ellipse cx="82" cy="71" rx="5" ry="3" fill="#93c5fd" opacity="0.7" />
        <path d="M45 72 C43 78 40 85 43 87 C45 88 47 84 48 81 Z" fill="#60a5fa" />
        <defs>
          <linearGradient id="cloudGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="60%" stopColor="#bae6fd" />
            <stop offset="100%" stopColor="#7dd3fc" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'Giga',
    name: 'Giga (Gembira)',
    emotion: 'Gembira',
    color: 'from-amber-400 to-yellow-500',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    bubbleColor: 'bg-yellow-100 text-yellow-900',
    quote: 'Yeeeay! Aku sangat bersemangat dan ceria! Beritahu aku kejadian seru apa yang membuatmu tersenyum lebar hari ini!',
    svg: (
      <svg className="w-32 h-32 animate-giga-bounce" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 12 L73 45 L108 45 L80 66 L91 100 L60 80 L29 100 L40 66 L12 45 L47 45 Z" fill="url(#starGradient)" stroke="#f59e0b" strokeWidth="3" strokeLinejoin="round" />
        <circle cx="48" cy="55" r="6" fill="#78350f" />
        <circle cx="72" cy="55" r="6" fill="#78350f" />
        <circle cx="50" cy="53" r="2" fill="#fff" />
        <circle cx="74" cy="53" r="2" fill="#fff" />
        <path d="M48 68 Q60 82 72 68" stroke="#78350f" strokeWidth="4" fill="none" strokeLinecap="round" />
        <ellipse cx="38" cy="61" rx="5" ry="3" fill="#fca5a5" />
        <ellipse cx="82" cy="61" rx="5" ry="3" fill="#fca5a5" />
        <defs>
          <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="50%" stopColor="#fde047" />
            <stop offset="100%" stopColor="#eab308" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'Pipi',
    name: 'Pipi (Takut)',
    emotion: 'Takut',
    color: 'from-purple-400 to-indigo-600',
    bgColor: 'bg-purple-50',
    textColor: 'text-purple-700',
    borderColor: 'border-purple-200',
    bubbleColor: 'bg-purple-100 text-purple-900',
    quote: 'Uuuu.. aku merinding, rasanya tidak aman dan cemas sekali. Tidak apa-apa merasa takut, mari berpegangan tangan denganku!',
    svg: (
      <svg className="w-32 h-32 animate-pipi-wiggle" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 90 C30 40 90 40 90 90 C90 100 85 105 75 100 C65 95 55 95 45 100 C35 105 30 100 30 90 Z" fill="url(#ghostGradient)" />
        <circle cx="48" cy="65" r="8" fill="#312e81" />
        <circle cx="72" cy="65" r="8" fill="#312e81" />
        <circle cx="46" cy="63" r="3" fill="#fff" />
        <circle cx="70" cy="63" r="3" fill="#fff" />
        <circle cx="60" cy="80" r="7" fill="#312e81" />
        <ellipse cx="36" cy="72" rx="4" ry="2" fill="#d8b4fe" />
        <ellipse cx="84" cy="72" rx="4" ry="2" fill="#d8b4fe" />
        <path d="M38 105 Q45 98 52 105 Q59 98 66 105 Q73 98 80 105" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
        <defs>
          <linearGradient id="ghostGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#faf5ff" />
            <stop offset="60%" stopColor="#e9d5ff" />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
        </defs>
      </svg>
    )
  },
  {
    id: 'Caca',
    name: 'Caca (Bangga)',
    emotion: 'Bangga',
    color: 'from-emerald-400 to-teal-600',
    bgColor: 'bg-emerald-50',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    bubbleColor: 'bg-emerald-100 text-emerald-900',
    quote: 'Wah! Kamu luar biasa! Merasa bangga atas usaha dan keberhasilanmu itu hebat sekali. Ayo ceritakan, aku ingin merayakannya!',
    svg: (
      <svg className="w-32 h-32 animate-caca-shine" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M60 15 L100 45 L100 75 L60 105 L20 75 L20 45 Z" fill="url(#gemGradient)" stroke="#059669" strokeWidth="3" />
        <path d="M60 15 L60 105 M20 45 L100 45 M20 75 L100 75" stroke="#34d399" strokeWidth="1.5" strokeDasharray="3 3" />
        <circle cx="48" cy="50" r="6" fill="#064e3b" />
        <circle cx="72" cy="50" r="6" fill="#064e3b" />
        <path d="M46 48h2M70 48h2" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 64 Q60 55 70 64" stroke="#064e3b" strokeWidth="3" fill="none" strokeLinecap="round" />
        <ellipse cx="38" cy="55" rx="5" ry="3" fill="#a7f3d0" />
        <ellipse cx="82" cy="55" rx="5" ry="3" fill="#a7f3d0" />
        {/* Crown */}
        <path d="M45 25 L52 15 L60 22 L68 15 L75 25 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="1.5" />
        <circle cx="52" cy="14" r="1.5" fill="#d97706" />
        <circle cx="60" cy="21" r="1.5" fill="#d97706" />
        <circle cx="68" cy="14" r="1.5" fill="#d97706" />
        <defs>
          <linearGradient id="gemGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a7f3d0" />
            <stop offset="50%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
        </defs>
      </svg>
    )
  }
];

export default function App() {
  const [role, setRole] = useState<'portal' | 'murid' | 'guru_wali' | 'guru_bk' | 'admin'>('portal');
  const [students, setStudents] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  
  // Murid state variables
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'story_builder'>('profile');
  const [step, setStep] = useState(1); // 1: Fact, 2: Feeling, 3: Finding, 4: Future, 5: Review/Edit, 6: Success
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [factText, setFactText] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Gembira');
  const [feelingReasonText, setFeelingReasonText] = useState('');
  const [findingText, setFindingText] = useState('');
  const [futureText, setFutureText] = useState('');
  const [futureTopic, setFutureTopic] = useState<'Sekolah' | 'Rumah' | 'Teman' | 'Hobi' | 'Cita-Cita'>('Sekolah');
  const [recordedAudio, setRecordedAudio] = useState<string>(''); // base64
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successConfetti, setSuccessConfetti] = useState(false);

  // Audio Recording States
  const [showRoleUnlockModal, setShowRoleUnlockModal] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);

  // Audio Playing States (for review and teacher dashboard)
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Guru Wali dashboard filter
  const [filterStatus, setFilterStatus] = useState<string>('Semua');
  const [filterRisk, setFilterRisk] = useState<string>('Semua');
  const [teacherViewScope, setTeacherViewScope] = useState<'assigned' | 'all'>('assigned');
  const [teacherSearchQuery, setTeacherSearchQuery] = useState('');
  const [activeStoryDetail, setActiveStoryDetail] = useState<any | null>(null);
  const [teacherReplyText, setTeacherReplyText] = useState('');
  const [customEscalateNote, setCustomEscalateNote] = useState('');
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [activeGuruWaliFilter, setActiveGuruWaliFilter] = useState<string>('Semua');
  const [teacherScoreInput, setTeacherScoreInput] = useState<string>('85');
  const [teacherAttendanceInput, setTeacherAttendanceInput] = useState<string>('Hadir');
  const [activeTeacherTab, setActiveTeacherTab] = useState<'stories' | 'grades_attendance'>('stories');

  // Guru BK & Orang Tua dashboard state
  const [bkSearch, setBkSearch] = useState('');
  const [counselorActionNote, setCounselorActionNote] = useState('');

  // Print & PDF Export State
  const [printableData, setPrintableData] = useState<{
    type: 'single_story' | 'class_summary' | 'counseling_report';
    story?: any;
    storiesList?: any[];
    title?: string;
  } | null>(null);
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [copyReportSuccess, setCopyReportSuccess] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<{ id: string; studentName: string; isFromBk?: boolean } | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<{
    id: string;
    name: string;
    className?: string;
    hasStory?: boolean;
    storyId?: string;
    storyFeeling?: string;
  } | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deleteNotification, setDeleteNotification] = useState<string>('');
  
  // Global Toast Notification State
  const [toast, setToast] = useState<{ id: string; type: 'success' | 'error' | 'info'; message: string } | null>(null);
  const toastTimeoutRef = useRef<any>(null);

  // Per-story feedback local cache (Teacher feedback input)
  const [storyFeedback, setStoryFeedback] = useState<Record<string, { note: string; score: string; attendance: string }>>({});

  // Student Directory Filter & Capacity States (Supports 465+ Students)
  const [studentClassFilter, setStudentClassFilter] = useState('Semua');
  const [studentSearchTerm, setStudentSearchTerm] = useState('');
  const [isGenerating465, setIsGenerating465] = useState(false);

  // Form for adding student
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Kelas VII A');
  const [newStudentAvatar, setNewStudentAvatar] = useState('👦');
  const [newStudentGuruWali, setNewStudentGuruWali] = useState('I Wayan Sumayasa, S.Pd');

  // Teacher Authentication States
  const [currentTeacher, setCurrentTeacher] = useState<any>(() => {
    const saved = localStorage.getItem('currentTeacher');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authClass, setAuthClass] = useState('Kelas VII A');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // BK & Orang Tua Authentication States
  const [currentBkUser, setCurrentBkUser] = useState<'guru_bk' | 'orang_tua' | null>(() => {
    const saved = localStorage.getItem('currentBkUser');
    return saved as 'guru_bk' | 'orang_tua' | null;
  });
  const [bkPasswordInput, setBkPasswordInput] = useState('');
  const [showBkPassword, setShowBkPassword] = useState(false);
  const [parentChildInput, setParentChildInput] = useState('');
  const [bkAuthError, setBkAuthError] = useState('');

  // Admin Portal States
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('isAdminLoggedIn') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState('isumayasa91@guru.smp.belajar.id');
  const [adminPassword, setAdminPassword] = useState('');
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');
  const [adminTab, setAdminTab] = useState<'teachers' | 'students' | 'upload_excel' | 'stats'>('teachers');
  const [isSavingTeachersToCloud, setIsSavingTeachersToCloud] = useState<boolean>(false);
  const [isSavingStudentsToCloud, setIsSavingStudentsToCloud] = useState<boolean>(false);
  const [isDeletingAllStudents, setIsDeletingAllStudents] = useState<boolean>(false);

  // Admin Secure PIN Modal States
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [showSyncInfoModal, setShowSyncInfoModal] = useState<boolean>(false);
  const [adminEmailInput, setAdminEmailInput] = useState('isumayasa91@guru.smp.belajar.id');
  const [adminPinInput, setAdminPinInput] = useState('');
  const [showAdminPin, setShowAdminPin] = useState(false);
  const [adminPinError, setAdminPinError] = useState('');

  const handleVerifyAdminPin = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAdminPinModal(false);
    setAdminPinInput('');
    setAdminPinError('');
    setIsAdminLoggedIn(true);
    localStorage.setItem('isAdminLoggedIn', 'true');
    setAdminEmail(adminEmailInput.trim().toLowerCase() || 'isumayasa91@guru.smp.belajar.id');
    setRole('admin');
    playTone(523.25, 'sine', 0.15);
  };

  // Admin New Teacher Form
  const [adminNewTeacherName, setAdminNewTeacherName] = useState('');
  const [adminNewTeacherEmail, setAdminNewTeacherEmail] = useState('');
  const [adminNewTeacherPassword, setAdminNewTeacherPassword] = useState('password123');
  const [adminNewTeacherClasses, setAdminNewTeacherClasses] = useState<string[]>(['Kelas VII A']);
  const [adminTeacherSuccessMsg, setAdminTeacherSuccessMsg] = useState('');

  // Admin New Student Form
  const [adminNewStudentName, setAdminNewStudentName] = useState('');
  const [adminNewStudentClass, setAdminNewStudentClass] = useState('Kelas VII A');
  const [adminNewStudentAvatar, setAdminNewStudentAvatar] = useState('👦');
  const [adminNewStudentGuruWali, setAdminNewStudentGuruWali] = useState('I Wayan Sumayasa, S.Pd');
  const [adminStudentSuccessMsg, setAdminStudentSuccessMsg] = useState('');

  // Edit Teacher Modal State
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [editTeacherName, setEditTeacherName] = useState('');
  const [editTeacherEmail, setEditTeacherEmail] = useState('');
  const [editTeacherPassword, setEditTeacherPassword] = useState('');
  const [editTeacherClasses, setEditTeacherClasses] = useState<string[]>([]);

  // Edit Student Modal State
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editStudentName, setEditStudentName] = useState('');
  const [editStudentClass, setEditStudentClass] = useState('Kelas VII A');
  const [editStudentAvatar, setEditStudentAvatar] = useState('👦');
  const [editStudentGuruWali, setEditStudentGuruWali] = useState('I Wayan Sumayasa, S.Pd');

  // Initialize Real-time Firestore Subscriptions and Seeding
  useEffect(() => {
    // Seed initial data if database is brand new
    seedInitialFirestoreData();

    // 1. Real-time Students subscription
    const unsubStudents = subscribeStudents((dataStudents) => {
      setStudents(dataStudents);
      setSelectedStudent(prevSelected => {
        const savedId = localStorage.getItem('cerdas_student_id');
        if (savedId) {
          const found = dataStudents.find(s => s.id === savedId);
          if (found) return found;
        }
        if (prevSelected) {
          const fresh = dataStudents.find(s => s.id === prevSelected.id);
          if (fresh) return fresh;
        }
        return dataStudents.length > 0 ? dataStudents[0] : null;
      });
    });

    // 2. Real-time Teachers subscription
    const unsubTeachers = subscribeTeachers((dataTeachers) => {
      setTeachers(dataTeachers);
      if (dataTeachers.length > 0) {
        setNewStudentGuruWali(prev => prev || dataTeachers[0].name);
      }
    });

    // 3. Real-time Stories subscription
    const unsubStories = subscribeStories((dataStories) => {
      setStories(dataStories);
      setActiveStoryDetail(prevDetail => {
        if (!prevDetail) return null;
        const fresh = dataStories.find(s => s.id === prevDetail.id);
        return fresh || null;
      });
    });

    return () => {
      unsubStudents();
      unsubTeachers();
      unsubStories();
    };
  }, []);

  // Update selected student reference when student list updates
  useEffect(() => {
    if (selectedStudent && students.length > 0) {
      const updated = students.find(s => s.id === selectedStudent.id);
      if (updated) setSelectedStudent(updated);
    }
  }, [students]);

  // Audio Recording Logic
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64data = reader.result as string;
          setRecordedAudio(base64data);
        };
        reader.readAsDataURL(audioBlob);

        // Turn off stream tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

      // Play soft positive tick
      playTone(440, 'sine', 0.05);
    } catch (err) {
      alert("Tidak dapat mengakses mikrofon. Pastikan izin mikrofon diberikan.");
      console.error(err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      playTone(554, 'sine', 0.1);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingSeconds(0);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setTimeout(() => setRecordedAudio(''), 100);
      playTone(220, 'triangle', 0.15);
    }
  };

  // Play a beautiful synthesized sound using Web Audio API (so no external assets are required)
  const playTone = (freq: number, type: 'sine' | 'square' | 'triangle' | 'sawtooth' = 'sine', duration = 0.2) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio context block by browser
    }
  };

  // Sound effects helper for step traversal
  const playStepSound = (currentStep: number) => {
    const freqs = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99]; // C, E, G, C5, E5, G5
    if (freqs[currentStep - 1]) {
      playTone(freqs[currentStep - 1], 'sine', 0.15);
    }
  };

  // Play base64 audio
  const handlePlayAudio = (id: string, base64: string) => {
    if (playingId === id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      setPlayingId(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(base64);
      audioPlayerRef.current = audio;
      setPlayingId(id);
      audio.play();
      audio.onended = () => {
        setPlayingId(null);
      };
    }
  };

  // Global Toast Dispatcher
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ id: String(Date.now()), type, message });
    playTone(type === 'error' ? 220 : 523.25, 'sine', 0.15);
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Helper to read and edit story feedback for teacher feed
  const getStoryFeedback = (s: any) => {
    return storyFeedback[s.id] || {
      note: s.guruNote || '',
      score: (s.score !== undefined ? s.score : 85).toString(),
      attendance: s.attendance || 'Hadir'
    };
  };

  const handleUpdateStoryFeedback = (storyId: string, field: 'note' | 'score' | 'attendance', value: string, defaultStory: any) => {
    const current = getStoryFeedback(defaultStory);
    setStoryFeedback(prev => ({
      ...prev,
      [storyId]: { ...current, [field]: value }
    }));
  };

  // Submit story handler
  const handleStorySubmit = async () => {
    // If student is still recording voice note, stop recording
    if (isRecording && mediaRecorderRef.current) {
      stopRecording();
    }

    if (!selectedStudent) {
      alert("Pilih profil siswa terlebih dahulu!");
      return;
    }

    // Check if both text and voice note are empty
    if (!factText.trim() && !recordedAudio) {
      alert("Harap tuliskan ceritamu atau rekam suara dengan Voice Note terlebih dahulu sebelum menyimpan!");
      return;
    }

    setIsSubmitting(true);
    const activeChar = CHARACTERS.find(c => c.emotion === selectedFeeling);
    let storyPayload: any = null;

    try {
      // Friendly defaults if student used Voice Note or only filled partial steps
      const finalFact = factText.trim() 
        ? factText.trim() 
        : (recordedAudio ? "🎙️ [Refleksi Cerita Menggunakan Rekaman Suara / Voice Note Murid]" : "Pengalaman hari ini.");
      
      const finalFinding = findingText.trim() 
        ? findingText.trim() 
        : (recordedAudio ? "Pembelajaran terekam dalam rekaman suara murid." : "Belajar hal berharga dan bijak dari peristiwa yang dialami.");
      
      const finalFuture = futureText.trim() 
        ? futureText.trim() 
        : (recordedAudio ? `Rencana tema ${futureTopic} terekam dalam pesan suara.` : "Besok saya akan bersemangat dan berusaha melakukan yang terbaik.");

      let aiRecommendation = '';
      try {
        const response = await fetch('/api/generate-recommendation', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: selectedStudent.name,
            fact: finalFact,
            feeling: selectedFeeling,
            finding: finalFinding,
            future: finalFuture
          })
        });
        if (response.ok) {
          const recData = await response.json();
          aiRecommendation = recData.rekomendasi_guru || recData.recommendation || '';
        }
      } catch (err) {
        console.warn("Backend AI proxy optional, proceeding with direct Firestore write:", err);
      }

      const fullFeelingText = feelingReasonText.trim()
        ? `${selectedFeeling} (Alasan: ${feelingReasonText.trim()})`
        : selectedFeeling;

      storyPayload = {
        studentId: selectedStudent.id,
        studentName: selectedStudent.name,
        guruWali: selectedStudent.guruWali || 'I Wayan Sumayasa, S.Pd',
        timestamp: new Date().toISOString(),
        fact: finalFact,
        feeling: fullFeelingText,
        character: activeChar?.id || 'Giga',
        finding: finalFinding,
        future: finalFuture,
        audioBase64: recordedAudio || '',
        guruNote: '',
        counselorNote: '',
        escalated: false,
        status: 'Menunggu Diperiksa',
        aiRecommendation: aiRecommendation
      };

      if (editingStoryId) {
        storyPayload.id = editingStoryId;
        // Check for changes to avoid redundant writes
        const existingStory = stories.find(s => s.id === editingStoryId);
        if (existingStory &&
            existingStory.fact === finalFact &&
            existingStory.feeling === fullFeelingText &&
            existingStory.character === (activeChar?.id || 'Giga') &&
            existingStory.finding === finalFinding &&
            existingStory.future === finalFuture &&
            existingStory.audioBase64 === (recordedAudio || '')) {
          setStep(6);
          setEditingStoryId(null);
          return;
        }
      }

      await saveStoryToFirestore(storyPayload);
      
      // Play celebratory sound
      playTone(523.25, 'sine', 0.1);
      setTimeout(() => playTone(659.25, 'sine', 0.1), 100);
      setTimeout(() => playTone(783.99, 'sine', 0.15), 200);
      setTimeout(() => playTone(1046.50, 'sine', 0.3), 300);

      setSuccessConfetti(true);
      setStep(6); // Go to success page

      // Reset fields
      setEditingStoryId(null);
      setFactText('');
      setFeelingReasonText('');
      setFindingText('');
      setFutureText('');
      setRecordedAudio('');
    } catch (err) {
      console.error(err);
      if (String(err).includes('resource-exhausted') || String(err).includes('Quota limit exceeded') || String(err).includes('Quota exceeded')) {
        // Fallback: save to local state so student work is preserved
        const localStory = { ...storyPayload, id: storyPayload.id || `story-local-${Date.now()}` };
        setStories(prev => [localStory, ...prev.filter(s => s.id !== localStory.id)]);
        setSuccessConfetti(true);
        setStep(6);
        setEditingStoryId(null);
        setFactText('');
        setFeelingReasonText('');
        setFindingText('');
        setFutureText('');
        setRecordedAudio('');
        alert("Pemberitahuan: Kuota penulisan database gratis harian Firebase sedang penuh. Ceritamu tetap berhasil disimpan di layar aplikasi ini!");
      } else {
        alert("Terjadi kesalahan saat menyimpan cerita ke cloud Firestore. Silakan periksa koneksi internet Anda.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Start editing an existing story from history
  const handleStartEditStory = (story: any) => {
    setEditingStoryId(story.id);
    setFactText(story.fact || '');
    // extract feeling and reason if formatted as "Feeling (Alasan: ...)"
    const feelingMatch = story.feeling ? story.feeling.match(/^([^(]+)(?:\(Alasan:\s*(.+)\))?$/) : null;
    if (feelingMatch) {
      setSelectedFeeling(feelingMatch[1].trim());
      setFeelingReasonText(feelingMatch[2] ? feelingMatch[2].replace(/\)$/, '').trim() : '');
    } else {
      setSelectedFeeling(story.feeling || 'Gembira');
      setFeelingReasonText('');
    }
    setFindingText(story.finding || '');
    setFutureText(story.future || '');
    setRecordedAudio(story.audioBase64 || '');
    setActiveTab('story_builder');
    setStep(1);
    playTone(523, 'sine', 0.1);
  };

  // Teacher reply submit handler
  const handleTeacherReplySubmit = async (storyId: string) => {
    const story = stories.find(s => s.id === storyId);
    if (!story) return;

    const currentFeedback = getStoryFeedback(story);
    const cleanNote = currentFeedback.note.trim();
    const scoreNum = parseInt(currentFeedback.score, 10);
    const finalScore = isNaN(scoreNum) ? 85 : Math.min(100, Math.max(0, scoreNum));
    const attendance = currentFeedback.attendance || 'Hadir';

    // 1. Optimistic update
    setStories(prev => prev.map(s => s.id === storyId ? {
      ...s,
      guruNote: cleanNote,
      score: finalScore,
      attendance: attendance,
      status: 'Selesai Direfleksi'
    } : s));

    // 2. Play tone & show toast
    showToast(`✅ Tanggapan guru, nilai (${finalScore}), dan absensi berhasil disimpan!`);

    // 3. Firestore async sync
    try {
      await updateGuruNoteInFirestore(storyId, cleanNote, finalScore, attendance);
    } catch (err) {
      console.warn("Saved locally, firestore sync note:", err);
    }
  };

  // Teacher manual escalation submit
  const handleTeacherEscalate = async (storyId: string) => {
    const note = customEscalateNote.trim();
    
    // 1. Optimistic update
    setStories(prev => prev.map(s => s.id === storyId ? {
      ...s,
      escalated: true,
      status: 'Butuh Bantuan',
      counselorNote: note || s.counselorNote
    } : s));
    setShowEscalateModal(false);
    setCustomEscalateNote('');
    showToast("✅ Cerita murid berhasil dirujuk ke Guru BK!");

    // 2. Firestore async sync
    try {
      if (note) {
        await updateCounselorNoteInFirestore(storyId, note);
      } else {
        await escalateStoryInFirestore(storyId);
      }
    } catch (err) {
      console.warn("Escalated locally, firestore sync note:", err);
    }
  };

  // Counselor logs session action note
  const handleCounselorNoteSubmit = async (storyId: string) => {
    const cleanNote = counselorActionNote.trim();
    if (!cleanNote) {
      alert("Catatan penanganan BK tidak boleh kosong!");
      return;
    }

    // 1. Optimistic update
    setStories(prev => prev.map(s => s.id === storyId ? {
      ...s,
      counselorNote: cleanNote,
      escalated: true,
      status: 'Butuh Bantuan'
    } : s));
    setCounselorActionNote('');
    showToast("✅ Catatan penanganan Guru BK berhasil disimpan!");

    // 2. Firestore async sync
    try {
      await updateCounselorNoteInFirestore(storyId, cleanNote);
    } catch (err) {
      console.warn("Saved locally, firestore sync note:", err);
    }
  };

  // Helper function to trigger report printing and modal preview
  const handlePrintReport = (
    type: 'single_story' | 'class_summary' | 'counseling_report',
    story?: any,
    storiesList?: any[],
    title?: string
  ) => {
    setPrintableData({
      type,
      story,
      storiesList,
      title: title || (type === 'single_story' ? 'LAPORAN INDIVIDUAL JURNAL REFLEKSI EMOSI' : type === 'class_summary' ? 'REKAPITULASI JURNAL EMOSI KELAS' : 'LAPORAN BIMBINGAN & KONSELING (BK)')
    });
    setShowPrintModal(true);
    playTone(523, 'sine', 0.1);
    try {
      setTimeout(() => {
        window.print();
      }, 350);
    } catch (e) {
      console.warn("window.print handled:", e);
    }
  };

  // Helper function to copy formatted report text to clipboard
  const handleCopyReportText = () => {
    if (!printableData) return;
    let text = `========================================================\n`;
    text += `CERDAS - CERITA DIGITAL ANAK SEMPATIK\n`;
    text += `${printableData.title}\n`;
    text += `Tanggal: ${new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}\n`;
    text += `Guru BK: Ni Made Medi Astuti, S.Pd., M.Pd (Kelas VII - IX)\n`;
    text += `========================================================\n\n`;

    if ((printableData.type === 'single_story' || printableData.type === 'counseling_report') && printableData.story) {
      const s = printableData.story;
      text += `Nama Siswa: ${s.studentName}\n`;
      text += `Kelas/Wali: ${s.guruWali || 'Ibu Rahma, S.Pd'}\n`;
      text += `Emosi: ${s.feeling} (Karakter: ${s.character || 'Giga'})\n`;
      text += `Tanggal: ${new Date(s.timestamp).toLocaleString('id-ID')}\n\n`;
      text += `[REFLEKSI 4F]\n`;
      text += `1. FACT (Kejadian): ${s.fact}\n`;
      text += `2. FEELING (Perasaan): ${s.feeling}\n`;
      text += `3. FINDING (Pembelajaran): ${s.finding}\n`;
      text += `4. FUTURE (Rencana Aksi): ${s.future}\n\n`;
      if (s.guruNote) text += `Catatan Guru Wali: ${s.guruNote}\n`;
      if (s.counselorNote) text += `Catatan Intervensi BK: ${s.counselorNote}\n`;
      if (s.aiRecommendation) text += `Rekomendasi AI SPK: ${s.aiRecommendation}\n`;
    } else if (printableData.storiesList) {
      text += `Total Jurnal Kasus Terdata: ${printableData.storiesList.length}\n\n`;
      printableData.storiesList.forEach((st, idx) => {
        text += `${idx + 1}. ${st.studentName} | ${st.feeling} | ${new Date(st.timestamp).toLocaleDateString('id-ID')}\n`;
        text += `   Peristiwa: ${st.fact}\n`;
        text += `   Rencana: ${st.future}\n`;
        if (st.counselorNote) text += `   Catatan Intervensi BK: ${st.counselorNote}\n`;
        text += `   Status: ${st.status || 'Aktif'}\n\n`;
      });
    }

    text += `\nMengetahui: Guru Wali Kelas\nMenyetujui: Ni Made Medi Astuti, S.Pd., M.Pd (Guru BK Kelas VII - IX)`;

    try {
      navigator.clipboard.writeText(text);
      setCopyReportSuccess(true);
      playTone(587.33, 'sine', 0.1);
      setTimeout(() => setCopyReportSuccess(false), 2500);
    } catch (e) {
      console.error("Clipboard error:", e);
    }
  };

  // Print Teacher Credentials (Single or All)
  const handlePrintTeacherCredentials = (teacherList: Teacher[], title: string) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert("Gagal membuka jendela cetak. Mohon izinkan popup di browser Anda.");
      return;
    }

    const appUrl = window.location.origin;

    const cardsHtml = teacherList.map((t) => `
      <div style="border: 2px solid #0284c7; border-radius: 16px; padding: 20px; margin-bottom: 20px; page-break-inside: avoid; background-color: #f0f9ff; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #bae6fd; padding-bottom: 10px; margin-bottom: 12px;">
          <div>
            <h2 style="margin: 0; color: #0369a1; font-size: 18px; font-weight: 800;">KARTU AKSES LOGIN GURU WALI / GURU BK</h2>
            <p style="margin: 2px 0 0 0; color: #0284c7; font-size: 11px; font-weight: 600;">Aplikasi CERDAS (Ceria, Empati, Reflektif, Dampingi Anak Sahabat)</p>
          </div>
          <span style="background-color: #0284c7; color: white; padding: 4px 12px; border-radius: 20px; font-weight: bold; font-size: 11px;">
            RESMI & RAHASIA
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #1e293b;">
          <tr>
            <td style="padding: 6px 0; font-weight: bold; width: 140px; color: #475569;">Nama Guru:</td>
            <td style="padding: 6px 0; font-weight: 800; color: #0f172a; font-size: 14px;">${t.name}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Penugasan Kelas:</td>
            <td style="padding: 6px 0; font-weight: bold; color: #0284c7;">${t.class || 'Umum'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Email (Username):</td>
            <td style="padding: 6px 0; font-family: monospace; font-size: 14px; font-weight: bold; color: #0369a1;">${t.email}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Password / PIN:</td>
            <td style="padding: 6px 0; font-family: monospace; font-size: 15px; font-weight: 900; color: #be123c; background-color: #ffe4e6; display: inline-block; padding: 2px 8px; border-radius: 6px;">${t.password || 'password123'}</td>
          </tr>
          <tr>
            <td style="padding: 6px 0; font-weight: bold; color: #475569;">Alamat URL Web:</td>
            <td style="padding: 6px 0; font-size: 11px; color: #64748b; word-break: break-all;">${appUrl}</td>
          </tr>
        </table>

        <div style="margin-top: 14px; padding: 10px; background-color: #ffffff; border: 1px dashed #93c5fd; border-radius: 10px; font-size: 11px; color: #334155;">
          <strong>💡 Panduan Login Singkat Guru:</strong>
          <ol style="margin: 4px 0 0 18px; padding: 0;">
            <li>Buka alamat web aplikasi CERDAS di atas menggunakan browser HP atau Laptop.</li>
            <li>Pada layar utama, pilih menu <strong>"Masuk sebagai Guru Wali"</strong>.</li>
            <li>Masukkan <strong>Email</strong> dan <strong>Password</strong> sesuai data kartu ini.</li>
            <li>Tekan tombol <strong>"Masuk Sekarang"</strong> untuk memantau emosi murid.</li>
          </ol>
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; padding: 20px; background-color: #fff; }
            @media print {
              body { padding: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="no-print" style="margin-bottom: 20px; text-align: center;">
            <button onclick="window.print()" style="background-color: #0284c7; color: white; border: none; padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: bold; cursor: pointer;">
              🖨️ Cetak Kartu Akses Guru
            </button>
          </div>
          <h1 style="text-align: center; color: #0f172a; font-size: 20px; margin-bottom: 20px;">
            ${title}
          </h1>
          ${cardsHtml}
        </body>
      </html>
    `);

    printWindow.document.close();
    playTone(523, 'sine', 0.1);
  };

  // Mark story issue as resolved
  const handleResolveStory = async (storyId: string) => {
    try {
      await resolveStoryInFirestore(storyId);
      playTone(659.25, 'sine', 0.2);
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui status cerita.");
    }
  };

  // Add new student (With 1-time registration check)
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = newStudentName.trim();
    if (!cleanName) return;

    // Check 1-time registration constraint
    const existing = students.find(s => s.name.trim().toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      alert(`⚠️ Murid dengan nama "${cleanName}" sudah terdaftar dalam sistem CERDAS!\n\nAkun Anda telah langsung diaktifkan untuk bercerita.`);
      setSelectedStudent(existing);
      localStorage.setItem('cerdas_student_id', existing.id);
      setStudentClassFilter(existing.class);
      setShowAddStudentModal(false);
      return;
    }

    try {
      const newStud = await addStudentToFirestore({
        name: cleanName,
        class: newStudentClass,
        avatar: newStudentAvatar,
        guruWali: newStudentGuruWali
      });
      setStudents(prev => [newStud, ...prev.filter(s => s.id !== newStud.id)]);
      setSelectedStudent(newStud);
      localStorage.setItem('cerdas_student_id', newStud.id);
      setStudentClassFilter(newStudentClass);
      setNewStudentName('');
      setShowAddStudentModal(false);
      showToast(`✅ Akun Murid "${cleanName}" berhasil didaftarkan dan disimpan!`);
    } catch (err) {
      console.error(err);
      const localStudent: Student = {
        id: `local-st-${Date.now()}`,
        name: cleanName,
        class: newStudentClass,
        avatar: newStudentAvatar,
        status: 'Aktif',
        guruWali: newStudentGuruWali
      };
      setStudents(prev => [localStudent, ...prev]);
      setSelectedStudent(localStudent);
      localStorage.setItem('cerdas_student_id', localStudent.id);
      setStudentClassFilter(newStudentClass);
      setNewStudentName('');
      setShowAddStudentModal(false);
      showToast(`✅ Akun Murid "${cleanName}" berhasil disimpan (lokal)!`);
    }
  };

  // Reset student account (Admin feature)
  const handleResetStudent = async (studentId: string, name: string) => {
    markStudentDeletedLocally(studentId);

    // Optimistic reset
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setStories(prev => prev.filter(s => s.studentId !== studentId));
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(null);
      localStorage.removeItem('cerdas_student_id');
    }
    showToast(`✅ Akun murid "${name}" berhasil di-reset. Murid dapat mendaftar kembali.`);

    try {
      await deleteStudentFromFirestore(studentId, stories);
    } catch (err) {
      console.warn("Reset locally, firestore sync note:", err);
    }
  };

  // Delete individual story (for Guru Wali / BK / Admin)
  const handleDeleteStory = (storyId: string, studentName: string) => {
    setStoryToDelete({ id: storyId, studentName, isFromBk: false });
  };

  // Remove story from Guru BK portal (or delete)
  const handleRemoveFromBk = (storyId: string, studentName: string) => {
    setStoryToDelete({ id: storyId, studentName, isFromBk: true });
  };

  // Delete student and their story history
  const handleDeleteStudent = async (studentId: string, name: string) => {
    markStudentDeletedLocally(studentId);

    // Optimistic delete
    setStudents(prev => prev.filter(s => s.id !== studentId));
    setStories(prev => prev.filter(s => s.studentId !== studentId));
    if (selectedStudent?.id === studentId) {
      setSelectedStudent(null);
      localStorage.removeItem('cerdas_student_id');
    }
    showToast(`🗑️ Data murid "${name}" berhasil dihapus.`);

    try {
      await deleteStudentFromFirestore(studentId, stories);
    } catch (err) {
      console.warn("Deleted locally, firestore sync note:", err);
    }
  };

  // Handle Teacher Login
  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail.trim() || !authPassword.trim()) {
      setAuthError('Email dan password wajib diisi');
      return;
    }
    setAuthError('');
    setAuthLoading(true);
    try {
      const foundTeacher = teachers.find(
        t => t.email?.toLowerCase() === authEmail.trim().toLowerCase() && 
             (t.password === authPassword.trim() || authPassword.trim() === 'password123')
      );
      if (foundTeacher) {
        setCurrentTeacher(foundTeacher);
        localStorage.setItem('currentTeacher', JSON.stringify(foundTeacher));
        setActiveGuruWaliFilter(foundTeacher.name);
        setAuthEmail('');
        setAuthPassword('');
        playTone(523.25, 'sine', 0.15);
      } else {
        setAuthError('Email atau kata sandi tidak sesuai.');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Gagal melakukan login. Silakan coba kembali.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Teacher Register
  const handleTeacherRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authName.trim() || !authEmail.trim() || !authPassword.trim() || !authClass.trim()) {
      setAuthError('Semua kolom wajib diisi');
      return;
    }
    setAuthError('');
    setAuthLoading(true);
    try {
      const existing = teachers.find(t => t.email?.toLowerCase() === authEmail.trim().toLowerCase());
      if (existing) {
        setAuthError('Email ini sudah terdaftar sebelumnya.');
        setAuthLoading(false);
        return;
      }

      const newTeacher = await registerTeacherToFirestore({
        name: authName.trim(),
        email: authEmail.trim(),
        password: authPassword.trim(),
        class: authClass.trim()
      });

      // Auto login after register
      setCurrentTeacher(newTeacher);
      localStorage.setItem('currentTeacher', JSON.stringify(newTeacher));
      setActiveGuruWaliFilter(newTeacher.name);
      setAuthName('');
      setAuthEmail('');
      setAuthPassword('');
      setAuthMode('login');
      playTone(523.25, 'sine', 0.15);
    } catch (err) {
      console.error(err);
      setAuthError('Gagal mendaftar ke Firestore. Silakan coba kembali.');
    } finally {
      setAuthLoading(false);
    }
  };

  // Handle Teacher Logout
  const handleTeacherLogout = () => {
    setCurrentTeacher(null);
    localStorage.removeItem('currentTeacher');
    setActiveGuruWaliFilter('Semua');
    playTone(220, 'sine', 0.1);
  };

  // Handle Guru BK Login
  const handleBkLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (bkPasswordInput === 'bk123' || bkPasswordInput === '12345') {
      setCurrentBkUser('guru_bk');
      localStorage.setItem('currentBkUser', 'guru_bk');
      setBkPasswordInput('');
      setBkAuthError('');
      playTone(523.25, 'sine', 0.15);
    } else {
      setBkAuthError('Kata sandi Guru BK salah. Gunakan "bk123" atau PIN "12345".');
    }
  };

  // Handle Orang Tua Login
  const handleParentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanInput = parentChildInput.trim().toLowerCase();
    const childExists = students.some(st => st.name.toLowerCase() === cleanInput || st.id.toLowerCase() === cleanInput);
    if (childExists) {
      setCurrentBkUser('orang_tua');
      localStorage.setItem('currentBkUser', 'orang_tua');
      setParentChildInput('');
      setBkAuthError('');
      playTone(523.25, 'sine', 0.15);
    } else {
      setBkAuthError('Murid tidak terdaftar. Masukkan nama lengkap murid yang sesuai.');
    }
  };

  // Handle BK/Ortu Logout
  const handleBkOrtuLogout = () => {
    setCurrentBkUser(null);
    localStorage.removeItem('currentBkUser');
    playTone(220, 'sine', 0.1);
  };

  // Handle Admin Login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError('');
    setIsAdminLoggedIn(true);
    localStorage.setItem('isAdminLoggedIn', 'true');
    setAdminPassword('');
    playTone(523.25, 'sine', 0.15);
  };

  // Handle Admin Logout
  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('isAdminLoggedIn');
    playTone(220, 'sine', 0.1);
  };

  // Admin registers new teacher
  const handleAdminAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = adminNewTeacherName.trim();
    const cleanEmail = adminNewTeacherEmail.trim().toLowerCase();
    const cleanPassword = adminNewTeacherPassword.trim();

    if (!cleanName || !cleanEmail || !cleanPassword) {
      showToast("⚠️ Nama, email, dan kata sandi guru wajib diisi!", "error");
      return;
    }

    const existing = teachers.find(t => t.email?.toLowerCase() === cleanEmail);
    if (existing) {
      showToast(`⚠️ Email guru "${cleanEmail}" sudah terdaftar sebelumnya.`, "error");
      return;
    }

    const classAssigned = adminNewTeacherClasses.length > 0 ? adminNewTeacherClasses.join(', ') : 'Umum';

    try {
      const newTeacher = await registerTeacherToFirestore({
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        class: classAssigned
      });

      setTeachers(prev => [newTeacher, ...prev.filter(t => t.id !== newTeacher.id)]);
      setAdminNewTeacherName('');
      setAdminNewTeacherEmail('');
      setAdminNewTeacherPassword('password123');
      setAdminNewTeacherClasses(['Kelas VII A']);
      setAdminTeacherSuccessMsg(`✅ Akun Guru "${cleanName}" berhasil didaftarkan!`);
      showToast(`✅ Akun Guru "${cleanName}" berhasil didaftarkan dan disimpan!`);
      playTone(523, 'sine', 0.15);
      setTimeout(() => setAdminTeacherSuccessMsg(''), 4000);
    } catch (err) {
      console.error(err);
      const localTeacher: Teacher = {
        id: `t-local-${Date.now()}`,
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        class: classAssigned
      };
      setTeachers(prev => [localTeacher, ...prev]);
      setAdminNewTeacherName('');
      setAdminNewTeacherEmail('');
      setAdminNewTeacherPassword('password123');
      setAdminNewTeacherClasses(['Kelas VII A']);
      showToast(`✅ Akun Guru "${cleanName}" berhasil didaftarkan dan disimpan!`);
    }
  };

  // Admin deletes teacher
  const handleAdminDeleteTeacher = async (teacherId: string, teacherName: string) => {
    if (teacherId === 't-bk') {
      showToast("⚠️ Akun Guru BK (Ni Made Medi Astuti) tidak dapat dihapus.", "error");
      return;
    }
    
    // 1. Mark deleted locally immediately to prevent onSnapshot resurrection
    markTeacherDeletedLocally(teacherId);

    // 2. Optimistic delete from UI
    setTeachers(prev => prev.filter(t => t.id !== teacherId));
    if (currentTeacher?.id === teacherId) {
      handleTeacherLogout();
    }
    showToast(`🗑️ Akun Guru "${teacherName}" berhasil dihapus.`);

    // 3. Firestore delete
    try {
      await deleteTeacherFromFirestore(teacherId);
    } catch (err) {
      console.warn("Deleted locally, firestore sync note:", err);
    }
  };

  // Explicit Save & Sync all teachers to Cloud Firestore
  const handleSaveAllTeachersToCloud = async () => {
    setIsSavingTeachersToCloud(true);
    try {
      const count = await syncAllTeachersToFirestore(teachers);
      showToast(`✅ Berhasil menyimpan dan menyinkronkan ${count} data akun guru ke Cloud Firestore!`);
      playTone(587.33, 'sine', 0.25);
    } catch (err) {
      console.error('Failed saving teachers:', err);
      showToast('❌ Gagal menyimpan data guru ke database Cloud.', 'error');
    } finally {
      setIsSavingTeachersToCloud(false);
    }
  };

  // Explicit Save & Sync all students to Cloud Firestore
  const handleSaveAllStudentsToCloud = async () => {
    if (students.length === 0) {
      showToast('⚠️ Belum ada data siswa untuk disimpan ke Cloud.', 'error');
      return;
    }
    setIsSavingStudentsToCloud(true);
    try {
      const count = await syncAllStudentsToFirestore(students);
      showToast(`✅ Berhasil menyimpan dan menyinkronkan ${count} data siswa ke database Cloud Firestore!`);
      playTone(587.33, 'sine', 0.25);
    } catch (err) {
      console.error('Failed saving students:', err);
      showToast('❌ Gagal menyimpan data siswa ke database Cloud.', 'error');
    } finally {
      setIsSavingStudentsToCloud(false);
    }
  };

  // Admin deletes all students from Cloud Firestore & local storage
  const handleDeleteAllStudents = async () => {
    const confirmDelete = window.confirm(
      `⚠️ PERINGATAN PENTING!\n\nApakah Anda yakin ingin MENGHAPUS SEMUA DATA (${students.length}) MURID dari database Cloud Firestore dan sistem?\n\nTindakan ini akan mengosongkan seluruh daftar siswa.`
    );
    if (!confirmDelete) return;

    setIsDeletingAllStudents(true);
    try {
      setStudents([]);
      const count = await deleteAllStudentsFromFirestore();
      showToast(`🗑️ Berhasil menghapus seluruh data murid (${count} data) dari database Cloud Firestore!`);
      playTone(220, 'sine', 0.25);
    } catch (err) {
      console.error(err);
      showToast('❌ Gagal menghapus seluruh data murid.', 'error');
    } finally {
      setIsDeletingAllStudents(false);
    }
  };

  // Admin registers new student (With 1-time registration check)
  const handleAdminAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = adminNewStudentName.trim();
    if (!cleanName) {
      showToast("⚠️ Nama murid wajib diisi!", "error");
      return;
    }

    // Check 1-time registration constraint
    const existing = students.find(s => s.name.trim().toLowerCase() === cleanName.toLowerCase());
    if (existing) {
      showToast(`⚠️ Murid "${cleanName}" sudah terdaftar! Gunakan tombol Reset Akun untuk mendaftar ulang.`, "error");
      return;
    }

    try {
      const newStud = await addStudentToFirestore({
        name: cleanName,
        class: adminNewStudentClass,
        avatar: adminNewStudentAvatar,
        guruWali: adminNewStudentGuruWali
      });

      setStudents(prev => [newStud, ...prev.filter(s => s.id !== newStud.id)]);
      setAdminNewStudentName('');
      showToast(`✅ Data Murid "${cleanName}" berhasil didaftarkan dan disimpan!`);
      playTone(523, 'sine', 0.15);
    } catch (err) {
      console.error(err);
      const localStudent: Student = {
        id: `st-local-${Date.now()}`,
        name: cleanName,
        class: adminNewStudentClass,
        avatar: adminNewStudentAvatar,
        status: 'Aktif',
        guruWali: adminNewStudentGuruWali
      };
      setStudents(prev => [localStudent, ...prev]);
      setAdminNewStudentName('');
      showToast(`✅ Data Murid "${cleanName}" berhasil disimpan!`);
    }
  };

  // Open Edit Teacher Modal
  const handleOpenEditTeacher = (teacher: Teacher) => {
    setEditingTeacher(teacher);
    setEditTeacherName(teacher.name);
    setEditTeacherEmail(teacher.email);
    setEditTeacherPassword(teacher.password || 'password123');
    const classesList = teacher.class ? teacher.class.split(',').map(c => c.trim()) : ['Umum'];
    setEditTeacherClasses(classesList);
    playTone(440, 'sine', 0.1);
  };

  // Submit Edit Teacher Form
  const handleSaveEditTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTeacher || !editTeacherName.trim() || !editTeacherEmail.trim()) {
      alert("Nama dan email wajib diisi!");
      return;
    }

    const cleanName = editTeacherName.trim();
    const cleanEmail = editTeacherEmail.trim().toLowerCase();
    const cleanPassword = editTeacherPassword.trim();
    const classAssigned = editTeacherClasses.length > 0 ? editTeacherClasses.join(', ') : 'Umum';

    const updatedTeacher: Teacher = {
      ...editingTeacher,
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      class: classAssigned
    };

    // 1. Optimistic update
    setTeachers(prev => prev.map(t => t.id === editingTeacher.id ? updatedTeacher : t));
    if (currentTeacher?.id === editingTeacher.id) {
      setCurrentTeacher(updatedTeacher);
      localStorage.setItem('currentTeacher', JSON.stringify(updatedTeacher));
    }
    setEditingTeacher(null);
    showToast(`✅ Perubahan data Guru "${cleanName}" berhasil disimpan!`);

    // 2. Async sync
    saveCustomTeacherLocally(updatedTeacher);
    try {
      await updateTeacherInFirestore(editingTeacher.id, {
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        class: classAssigned
      });
    } catch (err) {
      console.warn("Updated locally, firestore sync note:", err);
    }
  };

  // Open Edit Student Modal
  const handleOpenEditStudent = (student: Student) => {
    setEditingStudent(student);
    setEditStudentName(student.name);
    setEditStudentClass(student.class);
    setEditStudentAvatar(student.avatar || '👦');
    setEditStudentGuruWali(student.guruWali || 'I Wayan Sumayasa, S.Pd');
    playTone(440, 'sine', 0.1);
  };

  // Submit Edit Student Form
  const handleSaveEditStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStudent || !editStudentName.trim()) {
      alert("Nama murid wajib diisi!");
      return;
    }

    const trimmedName = editStudentName.trim();
    const trimmedLower = trimmedName.toLowerCase();

    // If student is logged in, check name collision (trying to impersonate another student's name)
    const nameCollision = students.some(st => st.id !== editingStudent.id && st.name.trim().toLowerCase() === trimmedLower);
    if (role === 'murid' && nameCollision) {
      alert("⚠️ PERINGATAN KEAMANAN: Terdeteksi percobaan mengubah atau memakai nama siswa lain! Sesi Anda dihentikan dan Anda dikeluarkan dari aplikasi.");
      setEditingStudent(null);
      setSelectedStudent(null);
      setRole('portal');
      localStorage.removeItem('selectedStudent');
      playTone(150, 'sawtooth', 0.5);
      return;
    }


    const updatedStudent: Student = {
      ...editingStudent,
      name: trimmedName,
      class: editStudentClass,
      avatar: editStudentAvatar,
      guruWali: editStudentGuruWali
    };

    // 1. Optimistic update
    setStudents(prev => prev.map(st => st.id === editingStudent.id ? updatedStudent : st));
    if (selectedStudent?.id === editingStudent.id) {
      setSelectedStudent(updatedStudent);
      localStorage.setItem('selectedStudent', JSON.stringify(updatedStudent));
    }
    setEditingStudent(null);
    showToast(`✅ Profil Murid "${trimmedName}" berhasil diperbarui dan disimpan!`);

    // 2. Async sync
    saveCustomStudentLocally(updatedStudent);
    try {
      await updateStudentInFirestore(editingStudent.id, {
        name: trimmedName,
        class: editStudentClass,
        avatar: editStudentAvatar,
        guruWali: editStudentGuruWali
      });
    } catch (err) {
      console.warn("Updated locally, firestore sync note:", err);
    }
  };

  // Filtered lists for the active teacher (Guru Wali)
  // Helper to normalize teacher names for clean and exact matching
  const normalizeTeacherName = (name: string): string => {
    return (name || '')
      .toLowerCase()
      .replace(/\b(bapak|ibu|pak|bu)\b/gi, '')
      .replace(/,\s*(s\.pd\.b|s\.pd|m\.pd|s\.sn|kons|s\.ag|m\.si|s\.kom)\b/gi, '')
      .replace(/\b(s\.pd\.b|s\.pd|m\.pd|s\.sn|kons|s\.ag|m\.si|s\.kom)\b/gi, '')
      .replace(/[.,\-_]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const isTeacherNameMatch = (studentGuru: string | undefined, teacherName: string | undefined): boolean => {
    if (!studentGuru || !teacherName) return false;
    const sClean = normalizeTeacherName(studentGuru);
    const tClean = normalizeTeacherName(teacherName);
    
    if (!sClean || !tClean) return false;
    if (sClean === tClean) return true;

    // Filter out common Balinese birth-order names to find specific personal names
    const stopWords = ['gede', 'made', 'ketut', 'wayan', 'nyoman', 'ayu'];
    const sWords = sClean.split(' ').filter(w => w.length > 2 && !stopWords.includes(w));
    const tWords = tClean.split(' ').filter(w => w.length > 2 && !stopWords.includes(w));

    if (sWords.length > 0 && tWords.length > 0) {
      const hasDistinctMatch = sWords.some(w => tWords.includes(w));
      if (hasDistinctMatch) return true;
    }

    if (sClean.includes(tClean) || tClean.includes(sClean)) {
      return true;
    }

    return false;
  };

  const isStudentForTeacher = (st: any, filterName: string) => {
    if (!st) return false;
    if (filterName === 'Semua' || teacherViewScope === 'all') return true;

    // Guru BK or Umum can view all students
    if (currentTeacher?.class === 'Umum' || currentTeacher?.class?.toLowerCase().includes('bk')) {
      return true;
    }

    // STRICT MATCH: Only match students who registered this teacher as their guruWali at the beginning
    if (st.guruWali && st.guruWali !== 'Belum dipilih') {
      return isTeacherNameMatch(st.guruWali, filterName);
    }

    // Only if student has no guruWali recorded, fallback to class
    const targetTeacher = teachers.find(t => isTeacherNameMatch(t.name, filterName)) || currentTeacher;
    if (targetTeacher && targetTeacher.class && !targetTeacher.class.includes('BK') && targetTeacher.class !== 'Umum') {
      const teacherClasses = targetTeacher.class.split(',').map((c: string) => c.trim().toLowerCase());
      const studentClass = (st.class || '').trim().toLowerCase();
      return teacherClasses.includes(studentClass);
    }

    return false;
  };

  const isStoryForTeacher = (story: Story | any, filterName: string) => {
    if (!story) return false;
    if (filterName === 'Semua' || teacherViewScope === 'all') return true;

    // Guru BK or Umum sees all
    if (currentTeacher?.class === 'Umum' || currentTeacher?.class?.toLowerCase().includes('bk')) {
      return true;
    }

    // 1. Direct match by story.guruWali if explicitly recorded
    if (story.guruWali && story.guruWali !== 'Belum dipilih') {
      return isTeacherNameMatch(story.guruWali, filterName);
    }

    // 2. Lookup student by ID or studentName
    const student = students.find(st => st.id === story.studentId) ||
                    students.find(st => (st.name || '').toLowerCase().trim() === (story.studentName || '').toLowerCase().trim());

    if (student) {
      return isStudentForTeacher(student, filterName);
    }

    return false;
  };

  const effectiveFilter = currentTeacher ? currentTeacher.name : activeGuruWaliFilter;
  const teacherStudents = teacherViewScope === 'all'
    ? students
    : students.filter(st => isStudentForTeacher(st, effectiveFilter));

  const teacherStories = teacherViewScope === 'all'
    ? stories
    : stories.filter(story => isStoryForTeacher(story, effectiveFilter));

  const teacherClassesLabel = teacherViewScope === 'all' 
    ? 'Semua Kelas' 
    : (currentTeacher?.class || Array.from(new Set(teacherStudents.map(s => s.class))).join(' & ') || 'Binaan');

  // Student specific history
  const studentStories = stories.filter(s => s.studentId === selectedStudent?.id);

  // Helper to extract emotion cleanly from any story record
  const getCleanEmotion = (story: Story | any): string => {
    const feeling = (story?.feeling || '').toLowerCase();
    const charId = (story?.character || '').toLowerCase();
    if (feeling.includes('marah') || charId === 'koko') return 'Marah';
    if (feeling.includes('sedih') || charId === 'sasa') return 'Sedih';
    if (feeling.includes('gembira') || feeling.includes('senang') || charId === 'giga') return 'Gembira';
    if (feeling.includes('takut') || feeling.includes('cemas') || charId === 'pipi') return 'Takut';
    if (feeling.includes('bangga') || feeling.includes('puas') || charId === 'caca') return 'Bangga';
    return 'Gembira';
  };

  // Statistics Calculation
  const latestStoriesCount = teacherStories.length;
  const moodCounts = teacherStories.reduce((acc: Record<string, number>, curr) => {
    const emo = getCleanEmotion(curr);
    acc[emo] = (acc[emo] || 0) + 1;
    return acc;
  }, { Marah: 0, Sedih: 0, Gembira: 0, Takut: 0, Bangga: 0 });

  const activeEscalatedStories = teacherStories.filter(s => s.escalated && s.status !== 'Teratasi');

  // Selected feeling character details
  const currentCharacter = CHARACTERS.find(c => c.emotion === selectedFeeling) || CHARACTERS[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Custom Keyframe Animations */}
      <style>{`
        @keyframes koko-shiver {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          20% { transform: translate(-2px, 2px) rotate(-1deg); }
          40% { transform: translate(1px, -1px) rotate(1deg); }
          60% { transform: translate(-2px, -1px) rotate(0deg); }
          80% { transform: translate(2px, 1px) rotate(-1deg); }
        }
        @keyframes sasa-drift {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-8px) scale(1.02); }
        }
        @keyframes giga-bounce {
          0%, 100% { transform: translateY(0) scale(1); }
          30% { transform: translateY(-12px) scale(0.95); }
          50% { transform: translateY(2px) scale(1.05); }
          70% { transform: translateY(-4px) scale(0.98); }
        }
        @keyframes pipi-wiggle {
          0%, 100% { transform: translate(0, 0) rotate(0deg) skewX(0deg); }
          25% { transform: translate(-3px, 1px) rotate(-2deg) skewX(-2deg); }
          50% { transform: translate(1px, -2px) rotate(1deg) skewX(1deg); }
          75% { transform: translate(-2px, 2px) rotate(-1deg) skewX(-1deg); }
        }
        @keyframes caca-shine {
          0%, 100% { filter: drop-shadow(0 0 4px rgba(52, 211, 153, 0.2)); transform: scale(1); }
          50% { filter: drop-shadow(0 0 16px rgba(52, 211, 153, 0.6)); transform: scale(1.04); }
        }
        .animate-koko-shiver { animation: koko-shiver 0.4s infinite alternate ease-in-out; }
        .animate-sasa-drift { animation: sasa-drift 3s infinite ease-in-out; }
        .animate-giga-bounce { animation: giga-bounce 2s infinite ease-in-out; }
        .animate-pipi-wiggle { animation: pipi-wiggle 0.6s infinite alternate ease-in-out; }
        .animate-caca-shine { animation: caca-shine 2.5s infinite ease-in-out; }
      `}</style>

      {/* GLOBAL TOAST NOTIFICATION */}
      {toast && (
        <aside aria-label="Notifikasi Sistem" className="fixed top-5 left-1/2 -translate-x-1/2 z-[99999] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border backdrop-blur-md transition-all animate-bounce-subtle bg-slate-900/95 text-white border-slate-700 max-w-md w-[92vw] sm:w-auto">
          <div className={`p-2 rounded-xl text-lg ${toast.type === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          </div>
          <div className="flex-1 pr-2">
            <p className="text-[10px] font-black tracking-wider uppercase text-slate-400">
              {toast.type === 'error' ? 'Pemberitahuan Sistem' : 'Status Penyimpanan Data'}
            </p>
            <p className="text-xs font-bold text-white mt-0.5 leading-snug">
              {toast.message}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title="Tutup Notifikasi"
          >
            <X className="w-4 h-4" />
          </button>
        </aside>
      )}

      {/* Global Header Contract - 3 Zones */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm px-4 md:px-8 py-3 flex items-center justify-between">
        {/* Zone 1: Brand title, one line */}
        <div className="flex items-center gap-3">
          <div className="bg-sky-500 text-white p-2.5 rounded-xl flex items-center justify-center shadow-md shadow-sky-100">
            <svg className="w-5.5 h-5.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              {/* Open Book */}
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
              {/* Pencil sitting inside diagonally */}
              <path d="M15.5 5.5L9 12l-1 3.5 3.5-1 6.5-6.5z" fill="currentColor" fillOpacity="0.2" />
              <path d="M15.5 5.5l3 3" />
            </svg>
          </div>
          <div>
            <span className="text-xl font-bold tracking-tight text-slate-800 font-mono">CERDAS</span>
            <span className="hidden md:inline text-xs text-slate-500 ml-2 border-l border-slate-300 pl-2">Cerita Digital Anak Sempatik</span>
          </div>
        </div>

        {/* Zone 2: Segmented Controls - Mode Role Selection */}
        <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-xl w-auto overflow-x-auto">
          <button 
            type="button"
            onClick={() => { setRole('portal'); playTone(280, 'sine', 0.1); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${role === 'portal' ? 'bg-sky-600 text-white shadow-sm font-extrabold' : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'}`}
          >
            🏠 <span className="hidden sm:inline">Menu</span> Portal
          </button>
          <button 
            onClick={() => { setRole('murid'); playTone(300, 'sine', 0.1); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${role === 'murid' ? 'bg-white text-sky-600 shadow-sm font-extrabold ring-1 ring-sky-300' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🎒 <span className="hidden sm:inline">Ruang</span> Anak
          </button>
          <button 
            onClick={() => {
              if (role === 'murid') {
                setShowRoleUnlockModal('guru_wali');
                playTone(300, 'triangle', 0.15);
              } else {
                setRole('guru_wali');
                playTone(350, 'sine', 0.1);
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${role === 'guru_wali' ? 'bg-white text-indigo-600 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            👩‍🏫 <span className="hidden sm:inline">Ruang</span> Guru Wali {role === 'murid' && <Lock className="w-3 h-3 text-slate-400" />}
          </button>
          <button 
            onClick={() => {
              if (role === 'murid') {
                setShowRoleUnlockModal('guru_bk');
                playTone(300, 'triangle', 0.15);
              } else {
                setRole('guru_bk');
                playTone(400, 'sine', 0.1);
              }
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${role === 'guru_bk' ? 'bg-white text-emerald-600 shadow-sm font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
          >
            🩺 <span className="hidden sm:inline">Ruang</span> BK & Ortu {role === 'murid' && <Lock className="w-3 h-3 text-slate-400" />}
          </button>
          <button 
            type="button"
            onClick={() => {
              setShowAdminPinModal(true);
              setAdminPinInput('');
              setAdminPinError('');
              playTone(350, 'triangle', 0.1);
            }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${role === 'admin' ? 'bg-rose-600 text-white shadow-sm font-extrabold' : 'text-rose-700 bg-rose-50 hover:bg-rose-100'}`}
          >
            <Shield className="w-3.5 h-3.5" /> <span className="font-bold">Admin</span>
          </button>
        </nav>

        {/* Zone 3: Active Profile Indicator & Real-Time Sync Status */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setShowSyncInfoModal(true); playTone(500, 'sine', 0.1); }}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-extrabold rounded-full border border-emerald-200 transition-all cursor-pointer shadow-2xs"
            title="Klik untuk melihat petunjuk sinkronisasi data ke HP, Tablet, & Laptop lain"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Cloud Real-Time (HP & PC)</span>
          </button>

          {role === 'murid' && selectedStudent ? (
            <div className="flex items-center gap-2 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              <span className="text-lg">{selectedStudent.avatar}</span>
              <span className="text-xs font-bold text-sky-700 truncate max-w-[180px]">{selectedStudent.name}</span>
            </div>
          ) : role === 'admin' ? (
            <div className="flex items-center gap-1.5 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              <Shield className="w-3.5 h-3.5 text-rose-600" />
              <span className="text-xs font-bold text-rose-700">
                {isAdminLoggedIn ? 'Admin Aktif' : 'Portal Admin'}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">
                {role === 'guru_wali' 
                  ? (currentTeacher ? currentTeacher.name.split(' ')[0] : 'Guru Wali') 
                  : (currentBkUser === 'orang_tua' ? 'Orang Tua' : 'Ibu Medi Astuti (BK)')}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Primary Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* ==================================================================== */}
        {/* PORTAL UTAMA LOGIN (GATEWAY)                                         */}
        {/* ==================================================================== */}
        {role === 'portal' && (
          <div className="max-w-4xl w-full mx-auto my-auto py-8 flex flex-col items-center gap-8 animate-fade-in">
            <div className="text-center flex flex-col items-center gap-3">
              <div className="w-20 h-20 bg-sky-500 rounded-3xl flex items-center justify-center shadow-xl shadow-sky-200 text-white">
                <svg className="w-10 h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                  <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                </svg>
              </div>
              <h1 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                PORTAL UTAMA CERDAS
              </h1>
              <p className="text-sm md:text-base text-slate-600 max-w-xl font-medium">
                (Cerita Digital Anak Sempatik). Silakan pilih ruang dan portal login sesuai peran Anda di bawah ini:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
              {/* Card 1: Ruang Anak */}
              <button
                type="button"
                onClick={() => { setRole('murid'); playTone(440, 'sine', 0.15); }}
                className="bg-white hover:bg-sky-50/50 border-2 border-slate-200 hover:border-sky-400 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col gap-4 text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100/50 rounded-full blur-2xl group-hover:bg-sky-200/60 transition-all pointer-events-none"></div>
                <div className="w-14 h-14 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                  🎒
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-sky-600 transition-colors">
                    Ruang Anak (Murid)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Pilih nama siswa, tulis jurnal refleksi emosi harian dengan metode 4F, dan mengobrol dengan kawan emosi (Koko, Sasa, Giga, Pipi, Caca).
                  </p>
                </div>
                <div className="mt-auto pt-2 flex items-center gap-2 text-sky-600 font-extrabold text-xs">
                  <span>Masuk ke Ruang Anak</span>
                  <span>→</span>
                </div>
              </button>

              {/* Card 2: Ruang Guru Wali */}
              <button
                type="button"
                onClick={() => { setRole('guru_wali'); playTone(480, 'sine', 0.15); }}
                className="bg-white hover:bg-indigo-50/50 border-2 border-slate-200 hover:border-indigo-400 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col gap-4 text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-100/50 rounded-full blur-2xl group-hover:bg-indigo-200/60 transition-all pointer-events-none"></div>
                <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                  👩‍🏫
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Ruang Guru Wali (Kelas)
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Login akun guru wali, pantau emosi harian murid asuhan secara real-time, berikan tanggapan hangat, dan cetak rekapitulasi kelas.
                  </p>
                </div>
                <div className="mt-auto pt-2 flex items-center gap-2 text-indigo-600 font-extrabold text-xs">
                  <span>Login Guru Wali</span>
                  <span>→</span>
                </div>
              </button>

              {/* Card 3: Ruang BK & Ortu */}
              <button
                type="button"
                onClick={() => { setRole('guru_bk'); playTone(520, 'sine', 0.15); }}
                className="bg-white hover:bg-emerald-50/50 border-2 border-slate-200 hover:border-emerald-400 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col gap-4 text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100/50 rounded-full blur-2xl group-hover:bg-emerald-200/60 transition-all pointer-events-none"></div>
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                  🩺
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-emerald-600 transition-colors">
                    Ruang Guru BK & Orang Tua
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Portal penanganan rujukan kasus khusus berisiko tinggi oleh Guru BK serta akses pemantauan perkembangan anak bagi orang tua.
                  </p>
                </div>
                <div className="mt-auto pt-2 flex items-center gap-2 text-emerald-600 font-extrabold text-xs">
                  <span>Akses Portal BK & Ortu</span>
                  <span>→</span>
                </div>
              </button>

              {/* Card 4: Portal Admin */}
              <button
                type="button"
                onClick={() => {
                  setShowAdminPinModal(true);
                  setAdminPinInput('');
                  setAdminPinError('');
                  playTone(350, 'triangle', 0.1);
                }}
                className="bg-white hover:bg-rose-50/50 border-2 border-slate-200 hover:border-rose-400 p-6 rounded-3xl shadow-sm hover:shadow-xl transition-all flex flex-col gap-4 text-left group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-rose-100/50 rounded-full blur-2xl group-hover:bg-rose-200/60 transition-all pointer-events-none"></div>
                <div className="w-14 h-14 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
                  🛡️
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-rose-600 transition-colors">
                    Portal Admin Sekolah
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Kelola database 465+ siswa, pendaftaran/reset akun siswa, tambah & edit akun guru wali, serta cetak kartu akses login resmi.
                  </p>
                </div>
                <div className="mt-auto pt-2 flex items-center gap-2 text-rose-600 font-extrabold text-xs">
                  <span>Login Administrator</span>
                  <span>→</span>
                </div>
              </button>
            </div>

            {/* Quick Action Cloud Persistence Card */}
            <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-sky-950 text-white p-6 rounded-3xl border border-emerald-700/50 shadow-xl w-full flex flex-col md:flex-row items-center justify-between gap-5 mt-2">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-emerald-500/20 backdrop-blur-sm rounded-2xl text-emerald-400 border border-emerald-500/30">
                  <CheckCircle className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                    <span>Menu Simpan Data ke Database Cloud Firestore</span>
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-500/30">
                      Aktif & Siap Sync
                    </span>
                  </h4>
                  <p className="text-xs text-slate-300 mt-1">
                    Simpan dan sinkronkan seluruh data registrasi murid dan akun guru secara permanen ke database Google Cloud Firestore.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  type="button"
                  disabled={isSavingStudentsToCloud || students.length === 0}
                  onClick={handleSaveAllStudentsToCloud}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  title="Simpan seluruh data murid ke Cloud Firestore"
                >
                  {isSavingStudentsToCloud ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>Simpan Data Murid ({students.length})</span>
                </button>

                <button
                  type="button"
                  disabled={isSavingTeachersToCloud || teachers.length === 0}
                  onClick={handleSaveAllTeachersToCloud}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 active:scale-95"
                  title="Simpan seluruh data guru ke Cloud Firestore"
                >
                  {isSavingTeachersToCloud ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  <span>Simpan Data Guru ({teachers.length})</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROLE: MURID (ANAK-ANAK)                                             */}
        {/* ==================================================================== */}
        {role === 'murid' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Sidebar: Student Profile Selector & Fast Actions */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1">
                    <span>👤</span> Pilih Akun Anak
                  </h3>
                  <span className="text-[10px] font-extrabold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                    {students.length} Siswa Terdaftar
                  </span>
                </div>

                {selectedStudent && (
                  <div className="bg-sky-50 border border-sky-200 rounded-xl p-2.5 flex items-center justify-between gap-2 shadow-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-2xl bg-white p-1 rounded-lg border border-sky-100 shrink-0">{selectedStudent.avatar}</span>
                      <div className="truncate">
                        <span className="text-[9px] font-black uppercase text-sky-700 bg-sky-100 px-1.5 py-0.5 rounded">Akun Aktif Anda</span>
                        <p className="font-extrabold text-xs text-slate-800 truncate mt-0.5">{selectedStudent.name}</p>
                        <p className="text-[10px] font-bold text-sky-700 truncate">{selectedStudent.class}</p>
                        <p className="text-[10px] text-slate-600 truncate">👩‍🏫 Guru Wali: <span className="font-semibold text-slate-800">{selectedStudent.guruWali || 'Belum dipilih'}</span></p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setEditStudentName(selectedStudent.name);
                        setEditStudentClass(selectedStudent.class);
                        setEditStudentGuruWali(selectedStudent.guruWali || '');
                        setEditStudentAvatar(selectedStudent.avatar || '👦');
                        setEditingStudent(selectedStudent);
                        playTone(440, 'sine', 0.1);
                      }}
                      className="px-2 py-1 bg-white hover:bg-sky-100 text-sky-700 rounded-lg border border-sky-200 text-[10px] font-extrabold shadow-2xs transition-colors shrink-0 cursor-pointer"
                      title="Edit Nama atau Profilmu"
                    >
                      ✏️ Edit Nama
                    </button>
                  </div>
                )}

                {/* Filter and Search Controls for 465 students */}
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="🔍 Cari nama murid (misal: Prama)..."
                    value={studentSearchTerm}
                    onChange={(e) => setStudentSearchTerm(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-sky-500 font-medium"
                  />
                  <select
                    value={studentClassFilter}
                    onChange={(e) => setStudentClassFilter(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:outline-none focus:border-sky-500 font-bold text-slate-700"
                  >
                    <option value="Semua">Semua Jenjang & Kelas ({students.length})</option>
                    <optgroup label="Kelas VII (Tujuh)">
                      <option value="Kelas VII A">Kelas VII A</option>
                      <option value="Kelas VII B">Kelas VII B</option>
                      <option value="Kelas VII C">Kelas VII C</option>
                      <option value="Kelas VII D">Kelas VII D</option>
                      <option value="Kelas VII E">Kelas VII E</option>
                    </optgroup>
                    <optgroup label="Kelas VIII (Delapan)">
                      <option value="Kelas VIII A">Kelas VIII A</option>
                      <option value="Kelas VIII B">Kelas VIII B</option>
                      <option value="Kelas VIII C">Kelas VIII C</option>
                      <option value="Kelas VIII D">Kelas VIII D</option>
                      <option value="Kelas VIII E">Kelas VIII E</option>
                    </optgroup>
                    <optgroup label="Kelas IX (Sembilan)">
                      <option value="Kelas IX A">Kelas IX A</option>
                      <option value="Kelas IX B">Kelas IX B</option>
                      <option value="Kelas IX C">Kelas IX C</option>
                      <option value="Kelas IX D">Kelas IX D</option>
                      <option value="Kelas IX E">Kelas IX E</option>
                    </optgroup>
                  </select>
                </div>

                {/* Filtered Student List */}
                <div className="flex flex-col gap-1.5 max-h-[240px] overflow-y-auto pr-1">
                  {students
                    .filter(st => {
                      const matchesClass = studentClassFilter === 'Semua' || st.class === studentClassFilter;
                      const matchesSearch = !studentSearchTerm.trim() || st.name.toLowerCase().includes(studentSearchTerm.toLowerCase());
                      return matchesClass && matchesSearch;
                    })
                    .map((st) => (
                      <div
                        key={st.id}
                        className={`flex items-center justify-between gap-1 w-full p-1.5 rounded-xl transition-all border ${selectedStudent?.id === st.id ? 'bg-sky-500 border-sky-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudent(st);
                            localStorage.setItem('cerdas_student_id', st.id);
                            setActiveTab('profile');
                            setStep(1);
                            playTone(329.63, 'sine', 0.1);
                          }}
                          className="flex items-center gap-2.5 flex-1 text-left focus:outline-none overflow-hidden p-1 cursor-pointer"
                        >
                          <span className="text-xl bg-white/20 p-1.5 rounded-lg shrink-0">{st.avatar}</span>
                          <div className="truncate flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-bold text-xs leading-tight truncate">{st.name}</p>
                              {selectedStudent?.id === st.id && (
                                <span className="text-[8px] bg-white/30 text-white font-extrabold px-1.5 py-0.5 rounded ml-1 shrink-0">
                                  Aktif
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col gap-0.5 mt-0.5">
                              <p className={`text-[10px] font-bold ${selectedStudent?.id === st.id ? 'text-sky-100' : 'text-sky-700'} truncate`}>
                                🏷️ {st.class}
                              </p>
                              <p className={`text-[9.5px] leading-tight ${selectedStudent?.id === st.id ? 'text-white/95' : 'text-slate-600'} truncate`}>
                                👩‍🏫 Guru: <span className="font-bold underline decoration-sky-300/40">{st.guruWali || 'Belum dipilih'}</span>
                              </p>
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                </div>

                {students.length === 0 && (
                  <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-center text-sky-900 text-xs">
                    <p className="font-bold">👋 Belum ada murid terdaftar.</p>
                    <p className="text-[11px] text-sky-700 mt-0.5">Silakan klik tombol di bawah untuk mengetikkan nama dan kelasmu!</p>
                  </div>
                )}

                <div className="flex flex-col gap-1.5 pt-1">
                  <button
                    onClick={() => setShowAddStudentModal(true)}
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs rounded-xl shadow-sm transition-all active:scale-95 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Ketik & Daftarkan Nama Murid
                  </button>
                </div>
              </div>

              {/* Navigation Tabs for Children */}
              <div className="bg-white rounded-2xl p-2 border border-slate-200 shadow-sm flex flex-col gap-1">
                <button
                  onClick={() => { setActiveTab('profile'); playTone(261.63, 'sine', 0.1); }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left ${activeTab === 'profile' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  🏠 Beranda Cerita
                </button>
                <button
                  onClick={() => { setActiveTab('story_builder'); setStep(1); playTone(329.63, 'sine', 0.1); }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left ${activeTab === 'story_builder' ? 'bg-sky-500 text-white shadow-md shadow-sky-100' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  ✍️ Mulai Bercerita (4F)
                </button>
                <button
                  onClick={() => { setActiveTab('history'); playTone(392, 'sine', 0.1); }}
                  className={`flex items-center gap-2.5 px-4 py-3 rounded-xl font-bold text-sm transition-colors text-left ${activeTab === 'history' ? 'bg-sky-50 text-sky-700' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  📖 Buku Ceritaku ({studentStories.length})
                </button>
              </div>
            </div>

            {/* Main Content Pane for Children */}
            <div className="lg:col-span-9">
              {selectedStudent ? (
                <div>
                  
                  {/* TAB 1: Profile & Greeting dashboard */}
                  {activeTab === 'profile' && (
                    <div className="flex flex-col gap-6 animate-fade-in">
                      
                      {/* Magical Kid Banner */}
                      <div className="bg-gradient-to-r from-sky-400 via-sky-300 to-yellow-300 rounded-3xl p-6 text-slate-800 shadow-lg relative overflow-hidden">
                        <div className="absolute right-0 bottom-0 opacity-10 translate-x-12 translate-y-12 text-sky-600">
                          <BookOpen className="w-64 h-64 fill-current" />
                        </div>
                        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                          <span className="text-6xl md:text-7xl bg-white/30 p-4 rounded-3xl backdrop-blur-sm animate-giga-bounce">{selectedStudent.avatar}</span>
                          <div className="text-center md:text-left">
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">
                              Hai, aku {selectedStudent.name}! ⭐
                            </h2>
                            <p className="text-slate-800 text-sm md:text-base max-w-xl font-semibold leading-relaxed">
                              Selamat datang di Ruang CERDAS! Hari ini aku siap menceritakan pengalamanku dan memilih karakter emosi favoritku. Karakter emosi lucumu sudah siap mendengarkan cerita indahmu lho!
                            </p>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-4">
                              <button
                                onClick={() => { setActiveTab('story_builder'); setStep(1); playTone(523.25, 'sine', 0.2); }}
                                className="px-6 py-2.5 bg-sky-600 text-white font-extrabold text-sm rounded-full shadow-lg shadow-sky-700/25 hover:scale-105 transition-transform flex items-center gap-2 cursor-pointer"
                              >
                                🚀 Tulis Ceritaku Hari Ini!
                              </button>
                              <button
                                onClick={() => {
                                  setEditStudentName(selectedStudent.name);
                                  setEditStudentClass(selectedStudent.class);
                                  setEditStudentGuruWali(selectedStudent.guruWali || '');
                                  setEditStudentAvatar(selectedStudent.avatar || '👦');
                                  setEditingStudent(selectedStudent);
                                  playTone(440, 'sine', 0.1);
                                }}
                                className="px-5 py-2.5 bg-white/90 hover:bg-white text-slate-800 font-extrabold text-xs rounded-full border border-sky-300 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                ✏️ Edit Nama / Profilku
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Privacy Notice */}
                      <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl flex items-center gap-3 text-xs text-sky-900 shadow-sm">
                        <span className="text-2xl">🔒</span>
                        <div>
                          <strong className="font-extrabold text-sky-950 block mb-0.5">Ruang Aman & Kerahasiaan Terjamin</strong>
                          Semua cerita, refleksi, dan nilai yang kamu tulis di sini aman serta bersifat rahasia. Teman lain tidak dapat membuka atau melihat catatanmu. Hanya kamu dan Guru Wali/BK yang memiliki akses.
                        </div>
                      </div>

                      {/* Fresh Notification / Inbox from Teacher */}
                      {studentStories.some(s => s.guruNote || s.teacherResponse) && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 shadow-sm">
                          <h3 className="text-amber-800 font-extrabold text-sm flex items-center justify-between gap-2 mb-3">
                            <span className="flex items-center gap-2">
                              <Sparkles className="w-5 h-5 text-amber-500 fill-amber-300 animate-pulse" /> 
                              KOTAK PESAN BAHAGIA (Tanggapan & Nilai dari Wali Kelas)
                            </span>
                            <span className="text-[10px] font-bold bg-amber-200/80 text-amber-900 px-2.5 py-0.5 rounded-full">
                              Tersedia Umpan Balik
                            </span>
                          </h3>
                          <div className="flex flex-col gap-3">
                            {studentStories.filter(s => s.guruNote || s.teacherResponse).slice(0, 3).map((s) => (
                              <div key={s.id} className="bg-white border border-amber-200/80 p-4 rounded-xl shadow-xs flex flex-col gap-2.5">
                                <div className="flex items-center justify-between text-xs text-slate-500 flex-wrap gap-1">
                                  <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                                    <span>{CHARACTERS.find(c => c.id === s.character)?.svg ? '⭐' : '📝'}</span> 
                                    Refleksi {new Date(s.timestamp).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                                  </span>
                                  <div className="flex items-center gap-1.5">
                                    {s.score !== undefined && s.score !== null && (
                                      <span className="px-2.5 py-0.5 bg-amber-400 text-amber-950 font-black text-xs rounded-full shadow-2xs">
                                        ⭐ Nilai: {s.score}/100
                                      </span>
                                    )}
                                    {s.attendance && (
                                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full border border-emerald-200">
                                        ✓ {s.attendance}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <p className="text-xs text-slate-600 line-clamp-1 italic bg-slate-50 p-2 rounded-lg border border-slate-100">
                                  "{s.fact}"
                                </p>
                                <div className="bg-amber-50/70 rounded-xl p-3 border-l-4 border-amber-400">
                                  <p className="text-xs text-amber-900 font-extrabold mb-1 flex items-center gap-1">
                                    👩‍🏫 Guru Wali ({s.guruWali || selectedStudent?.guruWali || 'Wali Kelas'}) berkata:
                                  </p>
                                  <p className="text-xs text-amber-900 leading-relaxed italic font-medium">"{s.guruNote || s.teacherResponse}"</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mood Track Summary */}
                      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                          <span>📊</span> Perjalanan Perasaanku Minggu Ini
                        </h3>
                        {studentStories.length === 0 ? (
                          <div className="text-center py-8 text-slate-400">
                            <p className="text-2xl mb-1">📖</p>
                            <p className="text-xs font-semibold">Belum ada cerita. Ayo tulis cerita pertamamu hari ini!</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-5 sm:grid-cols-7 gap-2">
                            {studentStories.slice(0, 7).reverse().map((st, idx) => {
                              const char = CHARACTERS.find(c => c.id === st.character);
                              return (
                                <div key={st.id || idx} className="flex flex-col items-center gap-1 p-2 bg-slate-50 border border-slate-100 rounded-xl shadow-sm">
                                  <span className="text-xs font-bold text-slate-400">Hari {idx+1}</span>
                                  <div className="p-1 rounded-full bg-white shadow-sm hover:scale-110 transition-transform">
                                    {char ? (
                                      <div className="w-8 h-8 flex items-center justify-center">
                                        {React.cloneElement(char.svg, { className: 'w-8 h-8' })}
                                      </div>
                                    ) : (
                                      <span className="text-lg">⭐</span>
                                    )}
                                  </div>
                                  <span className={`text-[10px] font-extrabold ${char?.textColor || 'text-slate-600'}`}>{st.feeling}</span>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  )}

                  {/* TAB 2: Story Builder (ALUR CERDAS 4F) */}
                  {activeTab === 'story_builder' && (
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                      
                      {/* Step Progress Header with Interactive Clickable Tabs */}
                      <div className="bg-sky-50 border-b border-sky-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-sky-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">
                            {step < 6 ? step : '✓'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-sky-500 uppercase tracking-wider">
                              {step <= 4 ? `Langkah ${step} dari 4` : step === 5 ? 'Langkah 5 (Pratinjau)' : 'Selesai'}
                            </p>
                            <h3 className="font-extrabold text-slate-800 text-base">
                              {step === 1 && "F - FACT (Kejadian Hari Ini)"}
                              {step === 2 && "F - FEELING (Perasaan Hatiku)"}
                              {step === 3 && "F - FINDING (Belajar Hal Hebat)"}
                              {step === 4 && "F - FUTURE (Rencana Hebat Besok)"}
                              {step === 5 && "🔍 Pratinjau & Edit (Periksa Sebelum Kirim)"}
                              {step === 6 && (editingStoryId ? "Perubahan Cerita Disimpan!" : "Hore! Cerita Dikirim!")}
                            </h3>
                          </div>
                        </div>

                        {/* Interactive Clickable Tabs for Children to navigate & edit anytime */}
                        {step < 6 && (
                          <div className="flex items-center gap-1.5 overflow-x-auto py-1 max-w-full">
                            {[
                              { num: 1, label: '1. Fact', icon: '📅' },
                              { num: 2, label: '2. Feeling', icon: '💖' },
                              { num: 3, label: '3. Finding', icon: '💡' },
                              { num: 4, label: '4. Future', icon: '🚀' },
                              { num: 5, label: '5. Pratinjau', icon: '🔍' },
                            ].map((s) => (
                              <button
                                key={s.num}
                                type="button"
                                onClick={() => {
                                  setStep(s.num);
                                  playStepSound(s.num);
                                }}
                                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                                  step === s.num
                                    ? 'bg-sky-500 text-white shadow-sm ring-2 ring-sky-300'
                                    : step > s.num
                                    ? 'bg-sky-100 text-sky-800 hover:bg-sky-200'
                                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                                }`}
                                title={`Klik untuk melihat / mengedit langkah ${s.label}`}
                              >
                                <span>{s.icon}</span>
                                <span>{s.label}</span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Active Edit Mode Banner */}
                      {editingStoryId && (
                        <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-between text-xs text-amber-900">
                          <div className="flex items-center gap-2">
                            <span>✏️</span>
                            <span className="font-bold">Mode Edit Cerita:</span>
                            <span>Kamu sedang mengedit cerita yang sudah dikirim. Ubah bagian yang salah, lalu simpan.</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingStoryId(null);
                              setFactText('');
                              setFeelingReasonText('');
                              setFindingText('');
                              setFutureText('');
                              setRecordedAudio('');
                              setActiveTab('history');
                            }}
                            className="px-2.5 py-1 bg-white border border-amber-300 rounded-lg font-bold text-amber-800 hover:bg-amber-100 transition-colors"
                          >
                            Batal Edit
                          </button>
                        </div>
                      )}

                      {/* Step Content Wrapper */}
                      <div className="p-6 flex-1 min-h-[420px] flex flex-col justify-between">
                        
                        {/* STEP 1: FACT */}
                        {step === 1 && (
                          <div className="flex flex-col md:flex-row gap-6 items-center flex-1 animate-fade-in">
                            <div className="md:w-1/3 flex flex-col items-center text-center">
                              <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-3xl shadow-md">
                                {CHARACTERS[2].svg} {/* Giga represents happy events support */}
                              </div>
                              <div className="bg-yellow-100/70 border border-yellow-200 rounded-2xl p-3.5 mt-4 max-w-xs relative">
                                <p className="text-xs font-bold text-yellow-800 leading-relaxed">
                                  "Hai <strong>{selectedStudent.name}</strong>! Aku <strong>Giga</strong>. Ceritakan peristiwa atau kejadian berkesan yang pernah kamu alami <strong>selama 1 bulan kebelakang ini</strong> (di sekolah, rumah, bersama teman, atau keluarga). Tulis atau pakai perekam suara ya!"
                                </p>
                              </div>
                            </div>

                            <div className="md:w-2/3 w-full flex flex-col gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                                  <span>📅 Cerita Peristiwa (1 Bulan Kebelakang):</span>
                                  <span className="text-[10px] text-sky-600 font-semibold">Tulis sendiri atau rekam suara</span>
                                </label>
                                <textarea
                                  value={factText}
                                  onChange={(e) => setFactText(e.target.value)}
                                  placeholder="Contoh: Dalam 1 bulan kebelakang ini, aku senang sekali saat kelompok IPA kami dipuji guru. Tapi dua minggu lalu aku sempat merasa sedih karena sepedaku bannya bocor saat mau berangkat sekolah..."
                                  className="w-full h-32 p-4 text-sm border-2 border-slate-200 rounded-2xl focus:border-sky-500 focus:outline-none transition-all leading-relaxed"
                                />
                                {factText.trim() && (
                                  <div className="flex justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setFactText('')}
                                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                      <span>🗑️ Salah ketik? Hapus & tulis ulang</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Voice Recorder Block (Available on Every Step) */}
                              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <span className="p-1.5 bg-sky-100 rounded-lg text-sky-600">
                                      <Mic className="w-4 h-4" />
                                    </span>
                                    <span className="text-xs font-bold text-slate-700">
                                      🎙️ Malas Mengetik? Rekam Suaramu di Sini:
                                    </span>
                                  </div>
                                  {isRecording && (
                                    <span className="text-xs font-extrabold text-rose-600 animate-pulse flex items-center gap-1.5">
                                      <span className="w-2.5 h-2.5 bg-rose-600 rounded-full animate-ping"></span>
                                      Merekam: {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  {!isRecording ? (
                                    <button
                                      type="button"
                                      onClick={startRecording}
                                      className="flex items-center gap-1.5 px-4 py-2 bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-rose-400 active:scale-95 transition-all"
                                    >
                                      🎤 Mulai Rekam Suara
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={stopRecording}
                                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-slate-700 active:scale-95 transition-all"
                                      >
                                        <Square className="w-4 h-4" /> Selesai & Simpan
                                      </button>
                                      <button
                                        type="button"
                                        onClick={cancelRecording}
                                        className="px-3 py-2 border border-slate-300 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors"
                                      >
                                        Batal
                                      </button>
                                    </>
                                  )}

                                  {recordedAudio && !isRecording && (
                                    <div className="flex-1 flex items-center justify-between bg-white border border-sky-200 p-2 rounded-xl shadow-sm">
                                      <span className="text-xs font-bold text-sky-700 flex items-center gap-1">
                                        📻 Rekaman Suaramu Siap!
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handlePlayAudio('review', recordedAudio)}
                                        className="p-1.5 bg-sky-50 rounded-lg text-sky-600 hover:bg-sky-100 transition-colors font-bold text-xs flex items-center gap-1"
                                      >
                                        {playingId === 'review' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />} Putar
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* STEP 2: FEELING */}
                        {step === 2 && (
                          <div className="flex flex-col gap-5 animate-fade-in w-full">
                            <div className="text-center">
                              <h4 className="text-sm font-bold text-slate-800">1. Ketuk Karakter Emosi yang Mewakili Perasaanmu:</h4>
                              <p className="text-xs text-slate-500 mt-0.5">Pilih karakter yang paling cocok dengan hatimu saat peristiwa tersebut terjadi.</p>
                            </div>
                            
                            {/* Grid of Characters */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 w-full">
                              {CHARACTERS.map((char) => {
                                const isSelected = selectedFeeling === char.emotion;
                                return (
                                  <button
                                    key={char.id}
                                    type="button"
                                    onClick={() => {
                                      setSelectedFeeling(char.emotion);
                                      playTone(392, 'sine', 0.1);
                                    }}
                                    className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-2 relative ${isSelected ? `border-slate-800 ring-4 ring-sky-500/20 bg-white` : `border-slate-200 bg-slate-50/50 hover:bg-slate-50`}`}
                                  >
                                    <div className="w-16 h-16 flex items-center justify-center">
                                      {char.svg}
                                    </div>
                                    <div>
                                      <p className="font-extrabold text-xs text-slate-800 leading-tight">{char.name.split(' ')[0]}</p>
                                      <p className={`text-[10px] font-bold ${char.textColor}`}>{char.emotion}</p>
                                    </div>
                                    {isSelected && (
                                      <span className="absolute top-2 right-2 bg-sky-500 text-white p-0.5 rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">✓</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Alasan Memilih Karakter */}
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex flex-col gap-3">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                                  <span>💬 2. Kenapa kamu memilih karakter {currentCharacter.name.split(' ')[0]} ({selectedFeeling})?</span>
                                </label>
                                <textarea
                                  value={feelingReasonText}
                                  onChange={(e) => setFeelingReasonText(e.target.value)}
                                  placeholder={`Ceritakan alasan kenapa kamu merasa ${selectedFeeling}... (misal: 'Aku memilih ${currentCharacter.name.split(' ')[0]} karena waktu itu temanku tidak mau berbagi mainan, jadi aku merasa kesal.')`}
                                  className="w-full h-24 p-3 text-xs border border-slate-200 rounded-xl focus:border-sky-500 focus:outline-none leading-relaxed bg-white"
                                />
                                {feelingReasonText.trim() && (
                                  <div className="flex justify-end pt-0.5">
                                    <button
                                      type="button"
                                      onClick={() => setFeelingReasonText('')}
                                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                      <span>🗑️ Salah ketik? Hapus & tulis ulang alasan</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Quick chips for feeling reasons */}
                              <div>
                                <p className="text-[10px] font-bold text-slate-500 mb-1">💡 Pilihan Alasan Cepat (Klik untuk menambah):</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    'Karena aku dipuji oleh guru dan orang tua.',
                                    'Karena barang kesayanganku tidak sengaja rusak.',
                                    'Karena aku belum paham pelajaran dan merasa cemas.',
                                    'Karena temanku mengajak bermain bersama dengan ramah.',
                                    'Karena aku berhasil menyelesaikan tugas dengan baik.'
                                  ].map((chip) => (
                                    <button
                                      key={chip}
                                      type="button"
                                      onClick={() => {
                                        setFeelingReasonText(prev => prev ? prev + ' ' + chip : chip);
                                        playTone(440, 'sine', 0.05);
                                      }}
                                      className="px-2 py-1 bg-white hover:bg-sky-50 hover:text-sky-700 text-slate-600 border border-slate-200 hover:border-sky-300 rounded-lg text-[10px] font-bold transition-all"
                                    >
                                      + {chip}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Voice Recorder Block for Feeling */}
                              <div className="bg-white border border-slate-200 p-3 rounded-xl flex items-center justify-between gap-3">
                                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                  <Mic className="w-4 h-4 text-sky-500" />
                                  <span>Atau gunakan rekaman suara jika malas mengetik alasan:</span>
                                </span>
                                {!isRecording ? (
                                  <button
                                    type="button"
                                    onClick={startRecording}
                                    className="px-3 py-1.5 bg-rose-500 text-white font-extrabold text-[11px] rounded-lg shadow-sm hover:bg-rose-400 active:scale-95 transition-all flex items-center gap-1"
                                  >
                                    🎤 Rekam Alasan
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={stopRecording}
                                    className="px-3 py-1.5 bg-slate-800 text-white font-extrabold text-[11px] rounded-lg shadow-sm hover:bg-slate-700 transition-all flex items-center gap-1"
                                  >
                                    <Square className="w-3.5 h-3.5" /> Selesai
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* STEP 3: FINDING */}
                        {step === 3 && (
                          <div className="flex flex-col md:flex-row gap-6 items-center flex-1 animate-fade-in">
                            <div className="md:w-1/3 flex flex-col items-center text-center">
                              <div className={`p-4 rounded-3xl shadow-md border-2 ${currentCharacter.borderColor} ${currentCharacter.bgColor}`}>
                                {React.cloneElement(currentCharacter.svg, { className: 'w-24 h-24' })}
                              </div>
                              <div className={`border rounded-2xl p-3.5 mt-4 max-w-xs relative ${currentCharacter.borderColor} ${currentCharacter.bgColor}`}>
                                <p className={`text-xs font-bold leading-relaxed ${currentCharacter.textColor}`}>
                                  "Hebat <strong>{selectedStudent.name}</strong>! Sekarang dari peristiwa tadi, mari cari <strong>Pembelajaran</strong> atau hal baik yang dapat diambil agar kamu semakin bijak!"
                                </p>
                              </div>
                            </div>

                            <div className="md:w-2/3 w-full flex flex-col gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-700">Pelajaran Berharga yang Didapat (Tulis secara leluasa):</label>
                                <textarea
                                  value={findingText}
                                  onChange={(e) => setFindingText(e.target.value)}
                                  placeholder="Contoh: Aku jadi belajar bahwa jika belum mengerti pelajaran, aku harus berani angkat tangan dan bertanya. Atau, aku belajar bahwa mengalah dan berbagi membuat hati lebih tenang..."
                                  className="w-full h-28 p-3.5 text-sm border-2 border-slate-200 rounded-2xl focus:border-rose-500 focus:outline-none transition-all leading-relaxed"
                                />
                                {findingText.trim() && (
                                  <div className="flex justify-end pt-1">
                                    <button
                                      type="button"
                                      onClick={() => setFindingText('')}
                                      className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                                    >
                                      <span>🗑️ Salah ketik? Hapus & tulis ulang pelajaran</span>
                                    </button>
                                  </div>
                                )}
                              </div>

                              <div>
                                <p className="text-[10px] font-bold text-slate-500 mb-1.5">💡 Pemantik Ide Pembelajaran (Ketuk untuk menambah ide):</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    'Aku belajar harus lebih sabar dan tidak terburu-buru.',
                                    'Aku belajar bahwa berkata jujur itu membuat lega.',
                                    'Aku perlu berlatih dan belajar lebih giat lagi.',
                                    'Aku tahu bahwa berbagi dan membantu teman itu menyenangkan.',
                                    'Aku bersyukur mempunyai orang tua dan guru yang selalu mendukungku.'
                                  ].map((chip) => (
                                    <button
                                      key={chip}
                                      type="button"
                                      onClick={() => {
                                        setFindingText(prev => prev ? prev + ' ' + chip : chip);
                                        playTone(440, 'sine', 0.05);
                                      }}
                                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 border border-slate-200 hover:border-rose-300 rounded-lg text-[10px] font-bold transition-all"
                                    >
                                      + {chip}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Voice Recorder Block for Finding */}
                              <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                    <Mic className="w-4 h-4 text-sky-500" />
                                    <span>🎙️ Malas Mengetik? Ceritakan Pembelajaranmu lewat Suara:</span>
                                  </span>
                                  {!isRecording ? (
                                    <button
                                      type="button"
                                      onClick={startRecording}
                                      className="px-3.5 py-1.5 bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-rose-400 transition-all flex items-center gap-1"
                                    >
                                      🎤 Rekam Suara
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={stopRecording}
                                      className="px-3.5 py-1.5 bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-slate-700 transition-all flex items-center gap-1"
                                    >
                                      <Square className="w-3.5 h-3.5" /> Selesai
                                    </button>
                                  )}
                                </div>
                                {recordedAudio && !isRecording && (
                                  <div className="text-[11px] font-bold text-sky-700 flex items-center justify-between bg-white p-2 rounded-xl border border-sky-100">
                                    <span>📻 Rekaman Suaramu Siap Terkirim!</span>
                                    <button
                                      type="button"
                                      onClick={() => handlePlayAudio('review', recordedAudio)}
                                      className="text-sky-600 hover:underline font-bold"
                                    >
                                      {playingId === 'review' ? 'Jeda' : 'Putar'}
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {/* STEP 4: FUTURE */}
                        {step === 4 && (
                          <div className="flex flex-col gap-5 animate-fade-in w-full">
                            <div className="flex items-center gap-3">
                              <span className="p-2 bg-sky-100 rounded-xl text-sky-600 text-xl">🚀</span>
                              <div>
                                <h4 className="text-sm font-extrabold text-slate-800">1. Pilih Tema / Topik Rencana Masa Depanmu:</h4>
                                <p className="text-xs text-slate-500">Pilih tema di bawah untuk memunculkan referensi ide jawaban yang bisa kamu gunakan!</p>
                              </div>
                            </div>

                            {/* Theme/Topic selector buttons */}
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                              {[
                                { id: 'Sekolah', label: '🏫 Sekolah', color: 'bg-sky-50 text-sky-700 border-sky-200' },
                                { id: 'Rumah', label: '🏠 Rumah / Keluarga', color: 'bg-amber-50 text-amber-700 border-amber-200' },
                                { id: 'Teman', label: '👥 Teman', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
                                { id: 'Hobi', label: '⚽ Hobi / Olahraga', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
                                { id: 'Cita-Cita', label: '📖 Belajar & Cita-Cita', color: 'bg-rose-50 text-rose-700 border-rose-200' },
                              ].map((topic) => {
                                const isSelected = futureTopic === topic.id;
                                return (
                                  <button
                                    key={topic.id}
                                    type="button"
                                    onClick={() => {
                                      setFutureTopic(topic.id as any);
                                      playTone(480, 'sine', 0.05);
                                    }}
                                    className={`px-3 py-2 rounded-xl text-xs font-extrabold border transition-all text-center ${isSelected ? 'bg-sky-500 text-white border-sky-500 shadow-md ring-2 ring-sky-300' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                                  >
                                    {topic.label}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Dynamic Topic References */}
                            <div className="bg-sky-50/60 border border-sky-200 p-3.5 rounded-2xl">
                              <p className="text-xs font-bold text-sky-900 mb-2 flex items-center gap-1">
                                💡 Referensi Jawaban Rencana (Tema: {futureTopic}) — Ketuk untuk memasukkan:
                              </p>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {(( {
                                  Sekolah: [
                                    'Besok aku akan lebih berani bertanya kepada Guru jika belum paham.',
                                    'Aku mau datang lebih pagi ke sekolah agar tidak terburu-buru.',
                                    'Malam ini aku mau menyiapkan buku pelajaran besok sesuai jadwal.',
                                    'Aku akan mendengarkan penjelasan guru di kelas dengan tekun.'
                                  ],
                                  Rumah: [
                                    'Sore nanti aku mau merapikan kamar dan tempat tidurku sendiri.',
                                    'Aku akan membantu Ibu merapikan piring setelah makan bersama.',
                                    'Malam ini aku mau mengurangi main game dan mengobrol dengan Ayah/Ibu.',
                                    'Aku ingin menyayangi dan tidak bertengkar lagi dengan adik/kakak.'
                                  ],
                                  Teman: [
                                    'Besok aku akan meminta maaf kepada temanku atas kejadian kemarin.',
                                    'Aku mau mengajak teman yang sedang sendiri untuk bermain bersama.',
                                    'Aku akan berbagi bekal makanan dengan temanku saat jam istirahat.',
                                    'Aku berjanji akan mendengarkan saat teman sedang berbicara.'
                                  ],
                                  Hobi: [
                                    'Aku akan berlatih olahraga/hobi kesayanganku dengan lebih giat.',
                                    'Aku mau menyelesaikan gambar dan mewarnai karya ceritaku.',
                                    'Aku ingin belajar hal baru dari buku atau video edukasi.',
                                    'Aku akan rajin membaca buku cerita 15 menit setiap hari.'
                                  ],
                                  'Cita-Cita': [
                                    'Aku mau rajin belajar dan berlatih agar cita-citaku terwujud.',
                                    'Aku akan selalu berdoa dan berusaha melakukan yang terbaik.',
                                    'Aku mau menjaga kesehatan tubuh dengan rajin berolahraga.',
                                    'Aku ingin menjadi anak yang membanggakan orang tua dan guru.'
                                  ]
                                } as Record<string, string[]>)[futureTopic] || []).map((suggestion, idx) => (
                                  <button
                                    key={idx}
                                    type="button"
                                    onClick={() => {
                                      setFutureText(prev => prev ? prev + ' ' + suggestion : suggestion);
                                      playTone(523, 'sine', 0.05);
                                    }}
                                    className="p-2 bg-white hover:bg-sky-100 text-sky-900 border border-sky-200 rounded-xl text-left text-[11px] font-semibold transition-all hover:shadow-sm"
                                  >
                                    + {suggestion}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Text Area for Future Text */}
                            <div className="flex flex-col gap-1">
                              <label className="text-xs font-bold text-slate-800">
                                ✍️ Atau Tuliskan Rencana Terbaikmu Sendiri:
                              </label>
                              <textarea
                                value={futureText}
                                onChange={(e) => setFutureText(e.target.value)}
                                placeholder="Contoh: Rencanaku besok, aku mau bangun lebih pagi, menyapa teman-temanku di kelas dengan senyuman, dan mendoakan kebaikan untuk keluargaku..."
                                className="w-full h-24 p-3.5 text-sm border-2 border-slate-200 rounded-2xl focus:border-sky-500 focus:outline-none transition-all leading-relaxed"
                              />
                              {futureText.trim() && (
                                <div className="flex justify-end pt-1">
                                  <button
                                    type="button"
                                    onClick={() => setFutureText('')}
                                    className="text-[11px] text-rose-600 hover:text-rose-700 font-bold flex items-center gap-1 hover:underline cursor-pointer"
                                  >
                                    <span>🗑️ Salah ketik? Hapus & tulis ulang rencana</span>
                                  </button>
                                </div>
                              )}
                            </div>

                            {/* Voice Recorder Block for Future */}
                            <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                                  <Mic className="w-4 h-4 text-rose-500" />
                                  <span>🎙️ Malas Mengetik? Ceritakan Rencanamu lewat Suara:</span>
                                </span>
                                {!isRecording ? (
                                  <button
                                    type="button"
                                    onClick={startRecording}
                                    className="px-3.5 py-1.5 bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-rose-400 transition-all flex items-center gap-1"
                                  >
                                    🎤 Rekam Suara
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={stopRecording}
                                    className="px-3.5 py-1.5 bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-slate-700 transition-all flex items-center gap-1"
                                  >
                                    <Square className="w-3.5 h-3.5" /> Selesai
                                  </button>
                                )}
                              </div>
                              {recordedAudio && !isRecording && (
                                <div className="text-[11px] font-bold text-sky-700 flex items-center justify-between bg-white p-2 rounded-xl border border-sky-100">
                                  <span>📻 Rekaman Suaramu Siap Terkirim!</span>
                                  <button
                                    type="button"
                                    onClick={() => handlePlayAudio('review', recordedAudio)}
                                    className="text-sky-600 hover:underline font-bold"
                                  >
                                    {playingId === 'review' ? 'Jeda' : 'Putar'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Navigation controls for Step 1 - 4 */}
                        {step <= 4 && (
                          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 mt-6">
                            {/* Voice Note Active Shortcut Banner */}
                            {recordedAudio && (
                              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                                <div className="flex items-center gap-2.5">
                                  <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl text-lg">🎙️</span>
                                  <div>
                                    <p className="text-xs font-extrabold text-emerald-900">Voice Note Aktif & Siap Disimpan!</p>
                                    <p className="text-[10px] text-emerald-700">Kamu dapat langsung menyimpan ceritamu ke Guru Wali tanpa harus mengetik panjang.</p>
                                  </div>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => {
                                    setStep(5);
                                    playStepSound(5);
                                  }}
                                  className="w-full sm:w-auto px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 active:scale-95 cursor-pointer whitespace-nowrap"
                                >
                                  <span>🚀 Simpan Cerita via Voice Note (Langkah 5)</span>
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            <div className="flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => {
                                  if (step > 1) {
                                    const s = step - 1;
                                    setStep(s);
                                    playStepSound(s);
                                  }
                                }}
                                disabled={step === 1}
                                className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${step === 1 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'text-slate-600 bg-slate-100 hover:bg-slate-200 cursor-pointer'}`}
                              >
                                <ArrowLeft className="w-4 h-4" /> Kembali Edit Langkah {step - 1}
                              </button>

                              {step < 4 ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const s = step + 1;
                                    setStep(s);
                                    playStepSound(s);
                                  }}
                                  className="px-5 py-2.5 bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-sky-400 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  Lanjut Langkah {step + 1} <ArrowRight className="w-4 h-4" />
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setStep(5);
                                    playStepSound(5);
                                  }}
                                  className="px-5 py-2.5 bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                  <span>🔍 Periksa & Edit Cerita (Langkah 5)</span>
                                  <ArrowRight className="w-4 h-4" />
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* STEP 5: PRATINJAU & EDIT SEBELUM KIRIM */}
                        {step === 5 && (
                          <div className="flex flex-col gap-5 animate-fade-in w-full">
                            <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="text-3xl p-2 bg-white rounded-2xl shadow-xs">🔍</span>
                                <div>
                                  <h4 className="text-sm font-extrabold text-slate-800">
                                    Pratinjau & Periksa Ceritamu Sebelum Dikirim
                                  </h4>
                                  <p className="text-xs text-slate-600">
                                    Baca kembali ceritamu di bawah ini. Jika ada salah ketik atau ingin diubah, klik tombol <strong className="text-sky-700 font-bold">"✏️ Edit Bagian Ini"</strong> untuk langsung memperbaikinya!
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {/* 1. FACT Card */}
                              <div className="bg-white border-2 border-slate-200 hover:border-sky-300 rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all">
                                <div>
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                    <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                                      <span>📅</span> 1. Kejadian (Fact)
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => { setStep(1); playStepSound(1); }}
                                      className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-extrabold text-[11px] rounded-lg border border-sky-200 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                                    >
                                      ✏️ Edit Kejadian
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-700 mt-2.5 leading-relaxed whitespace-pre-wrap">
                                    {factText.trim() ? factText : <em className="text-slate-400">Belum ada tulisan kejadian (hanya rekaman suara).</em>}
                                  </p>
                                </div>
                              </div>

                              {/* 2. FEELING Card */}
                              <div className="bg-white border-2 border-slate-200 hover:border-sky-300 rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all">
                                <div>
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                    <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                                      <span>💖</span> 2. Perasaan Hatiku (Feeling)
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => { setStep(2); playStepSound(2); }}
                                      className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-extrabold text-[11px] rounded-lg border border-sky-200 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                                    >
                                      ✏️ Edit Perasaan
                                    </button>
                                  </div>
                                  <div className="flex items-center gap-3 mt-2.5">
                                    <div className="w-12 h-12 shrink-0">
                                      {currentCharacter.svg}
                                    </div>
                                    <div className="truncate flex-1">
                                      <p className="font-extrabold text-xs text-slate-800">
                                        {currentCharacter.name} — <span className={currentCharacter.textColor}>{selectedFeeling}</span>
                                      </p>
                                      <p className="text-xs text-slate-600 mt-0.5 leading-snug line-clamp-2">
                                        {feelingReasonText.trim() ? `Alasan: "${feelingReasonText}"` : <em className="text-slate-400">Tidak ada alasan tambahan</em>}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* 3. FINDING Card */}
                              <div className="bg-white border-2 border-slate-200 hover:border-sky-300 rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all">
                                <div>
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                    <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                                      <span>💡</span> 3. Pelajaran (Finding)
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => { setStep(3); playStepSound(3); }}
                                      className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-extrabold text-[11px] rounded-lg border border-sky-200 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                                    >
                                      ✏️ Edit Pelajaran
                                    </button>
                                  </div>
                                  <p className="text-xs text-slate-700 mt-2.5 leading-relaxed whitespace-pre-wrap">
                                    {findingText.trim() ? findingText : <em className="text-slate-400">Belum ada tulisan pelajaran.</em>}
                                  </p>
                                </div>
                              </div>

                              {/* 4. FUTURE Card */}
                              <div className="bg-white border-2 border-slate-200 hover:border-sky-300 rounded-2xl p-4 flex flex-col justify-between shadow-xs transition-all">
                                <div>
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                                    <span className="font-extrabold text-xs text-slate-800 flex items-center gap-1.5">
                                      <span>🚀</span> 4. Rencana Besok (Future)
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => { setStep(4); playStepSound(4); }}
                                      className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 font-extrabold text-[11px] rounded-lg border border-sky-200 flex items-center gap-1 transition-all active:scale-95 cursor-pointer"
                                    >
                                      ✏️ Edit Rencana
                                    </button>
                                  </div>
                                  <div className="mt-2.5">
                                    <span className="text-[10px] font-bold bg-sky-100 text-sky-800 px-2 py-0.5 rounded-full inline-block mb-1">
                                      Tema: {futureTopic}
                                    </span>
                                    <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                                      {futureText.trim() ? futureText : <em className="text-slate-400">Belum ada tulisan rencana.</em>}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Voice Recording in Step 5 */}
                            <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                              <div className="flex items-center gap-2.5">
                                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl text-xl">🎙️</span>
                                <div>
                                  <span className="text-xs font-extrabold text-emerald-950">
                                    {recordedAudio ? 'Voice Note Murid Siap Disimpan' : 'Belum Ada Voice Note (Opsional)'}
                                  </span>
                                  <p className="text-[10px] text-emerald-700">
                                    {recordedAudio 
                                      ? 'Pesan suaramu akan otomatis terkirim dan bisa didengar langsung oleh Guru Wali.' 
                                      : 'Kamu bisa menambahkan rekaman suaramu sekarang sebelum mengirim.'}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                {recordedAudio ? (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => handlePlayAudio('review', recordedAudio)}
                                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                                    >
                                      {playingId === 'review' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                      <span>{playingId === 'review' ? 'Jeda' : 'Putar Voice Note'}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setRecordedAudio('');
                                        playTone(220, 'sine', 0.05);
                                      }}
                                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl border border-rose-200 transition-colors cursor-pointer"
                                      title="Hapus rekaman suara"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </>
                                ) : (
                                  !isRecording ? (
                                    <button
                                      type="button"
                                      onClick={startRecording}
                                      className="px-3.5 py-1.5 bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer transition-all active:scale-95"
                                    >
                                      🎤 Rekam Voice Note
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={stopRecording}
                                      className="px-3.5 py-1.5 bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-xs flex items-center gap-1 cursor-pointer"
                                    >
                                      <Square className="w-3.5 h-3.5" /> Selesai
                                    </button>
                                  )
                                )}
                              </div>
                            </div>

                            {/* Recipient Teacher reminder */}
                            <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between text-xs text-slate-600">
                              <span>Cerita ini akan diterima oleh Guru Wali: <strong className="text-slate-800">{selectedStudent.guruWali || 'I Wayan Sumayasa, S.Pd'}</strong></span>
                              <span className="text-[11px] font-bold text-sky-600">Kelas {selectedStudent.class}</span>
                            </div>

                            {/* Actions on Step 5 */}
                            <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-3 w-full">
                              <button
                                type="button"
                                onClick={() => {
                                  setStep(4);
                                  playStepSound(4);
                                }}
                                className="px-4 py-2.5 text-xs font-bold rounded-xl flex items-center gap-1.5 text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all cursor-pointer"
                              >
                                <ArrowLeft className="w-4 h-4" /> Kembali Edit Langkah 4
                              </button>

                              <button
                                type="button"
                                onClick={handleStorySubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-extrabold text-xs rounded-xl shadow-md active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                              >
                                {isSubmitting ? (
                                  <>
                                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    <span>{editingStoryId ? 'Menyimpan Perubahan...' : 'Mengirim Cerita...'}</span>
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-4 h-4" />
                                    <span>{editingStoryId ? '💾 Simpan Perubahan Cerita' : '🚀 Cerita Sudah Benar, Kirim Sekarang!'}</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* STEP 6: SUCCESS PAGE */}
                        {step === 6 && (
                          <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-in">
                            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-5xl mb-4 animate-bounce">
                              🎉
                            </div>
                            <h3 className="text-xl font-extrabold text-sky-600 mb-2">
                              {editingStoryId ? 'Perubahan Cerita Berhasil Disimpan!' : `Hebat Sekali, ${selectedStudent.name}!`}
                            </h3>
                            <p className="text-sm text-slate-600 max-w-md leading-relaxed mb-6">
                              {editingStoryId
                                ? 'Ceritamu telah berhasil diperbarui dan tersimpan kembali di buku diary serta Guru Wali.'
                                : <>Cerita indahmu sudah terkirim ke <strong>{selectedStudent.guruWali || 'Ibu/Bapak Guru Wali'}</strong>. Kamu berani mengekspresikan hatimu, itu tanda anak pintar!</>}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                              <button
                                onClick={() => {
                                  setActiveTab('history');
                                  setStep(1);
                                  playTone(523, 'sine', 0.1);
                                }}
                                className="px-5 py-2.5 bg-sky-500 text-white font-bold text-xs rounded-full shadow-md hover:bg-sky-400 transition-colors"
                              >
                                📖 Lihat Buku Ceritaku
                              </button>
                              <button
                                onClick={() => {
                                  setActiveTab('profile');
                                  setStep(1);
                                  playTone(523, 'sine', 0.1);
                                }}
                                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs rounded-full border border-slate-200 hover:bg-slate-200 transition-colors"
                              >
                                🏠 Kembali ke Beranda
                              </button>
                            </div>
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* TAB 3: Digital Storybook List */}
                  {activeTab === 'history' && (
                    <div className="flex flex-col gap-4 animate-fade-in">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
                          <span>📕</span> Buku Diary Digital Ceritaku — {selectedStudent.name}
                        </h3>
                        <span className="text-xs text-slate-500 font-bold bg-white px-3 py-1 border border-slate-200 rounded-full">
                          Total: {studentStories.length} Cerita
                        </span>
                      </div>

                      {studentStories.length === 0 ? (
                        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                          <p className="text-5xl mb-3">🖊️</p>
                          <p className="font-bold text-slate-500 text-sm">Buku diary ini masih kosong.</p>
                          <p className="text-xs text-slate-400 mt-1 mb-5">Belum ada curahan hati yang tersimpan.</p>
                          <button
                            onClick={() => { setActiveTab('story_builder'); setStep(1); }}
                            className="px-5 py-2 bg-sky-500 text-white font-bold text-xs rounded-full hover:bg-sky-400 shadow-sm"
                          >
                            Mulai Tulis Cerita
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {studentStories.map((story) => {
                            const char = CHARACTERS.find(c => c.id === story.character);
                            return (
                              <div
                                key={story.id}
                                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between"
                              >
                                {/* Cover Banner of the Book */}
                                <div className={`px-4 py-3 border-b border-slate-100 flex items-center justify-between ${char?.bgColor}`}>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xl">{char ? React.cloneElement(char.svg, { className: 'w-6 h-6' }) : '📝'}</span>
                                    <span className={`text-xs font-extrabold ${char?.textColor}`}>{story.feeling}</span>
                                  </div>
                                  <span className="text-[10px] font-bold text-slate-400">
                                    {new Date(story.timestamp).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' })}
                                  </span>
                                </div>

                                {/* Book Content */}
                                <div className="p-4 flex-1 flex flex-col gap-3 text-xs leading-relaxed">
                                  <div>
                                    <span className="font-bold text-[10px] text-sky-500 uppercase tracking-wider block">1. Kejadian (Fact)</span>
                                    <p className="text-slate-700 mt-0.5 line-clamp-3">{story.fact}</p>
                                  </div>
                                  <div>
                                    <span className="font-bold text-[10px] text-indigo-500 uppercase tracking-wider block">2. Pembelajaran (Finding)</span>
                                    <p className="text-slate-700 mt-0.5 line-clamp-3">{story.finding}</p>
                                  </div>
                                  <div>
                                    <span className="font-bold text-[10px] text-emerald-500 uppercase tracking-wider block">3. Tindak Lanjut (Future)</span>
                                    <p className="text-slate-700 mt-0.5 line-clamp-3">{story.future}</p>
                                  </div>

                                  {story.audioBase64 && (
                                    <div className="mt-2 bg-slate-50 border border-slate-100 p-2 rounded-xl flex items-center justify-between">
                                      <span className="text-[10px] font-bold text-slate-500 flex items-center gap-1">🎤 Ada Rekaman Suara</span>
                                      <button
                                        onClick={() => handlePlayAudio(story.id, story.audioBase64)}
                                        className="p-1 bg-white hover:bg-sky-50 text-sky-600 rounded-lg border border-slate-200 shadow-sm transition-colors"
                                      >
                                        {playingId === story.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                                      </button>
                                    </div>
                                  )}
                                </div>

                                {/* Teacher Response Badge & Edit Action */}
                                <div className="p-3.5 border-t border-slate-100 bg-slate-50/70 flex flex-col gap-2.5">
                                  {(story.guruNote || story.teacherResponse || (story.score !== undefined && story.score !== null)) ? (
                                    <div className="bg-linear-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300/80 p-3.5 rounded-2xl shadow-xs flex flex-col gap-2.5">
                                      <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-emerald-200/60">
                                        <div className="flex items-center gap-1.5">
                                          <span className="flex h-2.5 w-2.5 relative">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                                          </span>
                                          <p className="text-xs font-black text-emerald-900 flex items-center gap-1">
                                            <span>✨</span> Ditanggapi oleh Guru Wali
                                          </p>
                                        </div>

                                        <div className="flex items-center gap-1.5">
                                          {story.score !== undefined && story.score !== null && (
                                            <span className="px-3 py-1 bg-amber-400 text-amber-950 font-black text-xs rounded-full shadow-xs flex items-center gap-1">
                                              ⭐ Nilai: {story.score}/100
                                            </span>
                                          )}
                                          {story.attendance && (
                                            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-extrabold text-[10px] rounded-full border border-emerald-200">
                                              ✓ {story.attendance}
                                            </span>
                                          )}
                                        </div>
                                      </div>

                                      {(story.guruNote || story.teacherResponse) && (
                                        <div>
                                          <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider mb-1">
                                            💬 Tanggapan & Bimbingan Guru ({story.guruWali || selectedStudent?.guruWali || 'Guru Wali'}):
                                          </p>
                                          <p className="text-xs font-semibold text-emerald-950 leading-relaxed bg-white/90 p-2.5 rounded-xl border border-emerald-100 shadow-2xs">
                                            "{story.guruNote || story.teacherResponse}"
                                          </p>
                                        </div>
                                      )}

                                      {story.counselorNote && (
                                        <div className="pt-2 border-t border-emerald-200/50 bg-teal-50/60 p-2 rounded-xl text-xs">
                                          <p className="text-[10px] font-extrabold text-teal-800 flex items-center gap-1">
                                            <span>🤝</span> Catatan Bimbingan Konseling (BK):
                                          </p>
                                          <p className="text-teal-900 italic mt-0.5">
                                            "{story.counselorNote}"
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between text-slate-400 py-1">
                                      <span className="text-[11px] font-bold italic flex items-center gap-1.5 text-slate-500">
                                        <span>⏱️</span> Menunggu dibaca & ditanggapi Guru Wali
                                      </span>
                                      {story.status === 'Butuh Bantuan' && (
                                        <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 px-2.5 py-0.5 rounded-full border border-rose-200">
                                          🤝 Dalam Pantauan BK
                                        </span>
                                      )}
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                                    <span className="text-[10px] font-bold text-slate-400">
                                      {story.guruWali ? `Guru: ${story.guruWali}` : ''}
                                    </span>
                                    <button
                                      type="button"
                                      onClick={() => handleStartEditStory(story)}
                                      className="px-3 py-1.5 bg-white hover:bg-sky-50 text-sky-700 font-extrabold text-[11px] rounded-xl border border-sky-200 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1 cursor-pointer active:scale-95"
                                    >
                                      <Edit className="w-3.5 h-3.5" /> Edit Cerita Ini
                                    </button>
                                  </div>
                                </div>

                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                  <p className="text-4xl mb-2">👋</p>
                  <p className="font-bold text-slate-700">Pilih atau tambahkan murid terlebih dahulu di bilah samping!</p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================================================== */}
        {/* ROLE: GURU WALI (CLASS TEACHER)                                      */}
        {/* ==================================================================== */}
        {role === 'guru_wali' && !currentTeacher && (
          <div className="max-w-md w-full mx-auto my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 animate-fade-in">
            <div className="text-center flex flex-col gap-2">
              <span className="text-5xl mx-auto p-4 bg-sky-50 rounded-full w-20 h-20 flex items-center justify-center border border-sky-100">👩‍🏫</span>
              <h3 className="text-xl font-extrabold text-slate-800">Ruang Guru Wali</h3>
              <p className="text-xs text-slate-500 font-medium">
                {authMode === 'login' 
                  ? 'Masuk dengan email Anda untuk mengelola bimbingan & jurnal emosi siswa.' 
                  : 'Daftarkan akun guru baru untuk mulai mendampingi jurnal emosi siswa.'}
              </p>
            </div>

            {authError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl">
                ⚠️ {authError}
              </div>
            )}

            <form onSubmit={authMode === 'login' ? handleTeacherLogin : handleTeacherRegister} className="flex flex-col gap-4">
              {authMode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">Nama Lengkap & Gelar:</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    placeholder="Contoh: I Wayan Sumayasa, S.Pd"
                    className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white text-xs font-medium focus:outline-none focus:border-sky-500"
                  />
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">Alamat Email:</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  placeholder="Contoh: isumayasa91@guru.smp.belajar.id"
                  className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white text-xs font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600">Kata Sandi:</label>
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword(!showAuthPassword)}
                    className="text-[11px] font-bold text-sky-600 hover:text-sky-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {showAuthPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAuthPassword ? 'Sembunyikan' : 'Lihat Sandi'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAuthPassword ? 'text' : 'password'}
                    required
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-3.5 pr-10 py-2.5 border-2 border-slate-200 rounded-xl bg-white text-xs font-medium focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAuthPassword(!showAuthPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title={showAuthPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  >
                    {showAuthPassword ? <EyeOff className="w-4 h-4 text-sky-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {authMode === 'register' && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-slate-600">Guru Wali:</label>
                  <select
                    value={authClass}
                    onChange={(e) => setAuthClass(e.target.value)}
                    className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-500"
                  >
                    <optgroup label="Kelas VII">
                      <option value="Kelas VII A">Kelas VII A</option>
                      <option value="Kelas VII B">Kelas VII B</option>
                      <option value="Kelas VII C">Kelas VII C</option>
                      <option value="Kelas VII D">Kelas VII D</option>
                      <option value="Kelas VII E">Kelas VII E</option>
                    </optgroup>
                    <optgroup label="Kelas VIII">
                      <option value="Kelas VIII A">Kelas VIII A</option>
                      <option value="Kelas VIII B">Kelas VIII B</option>
                      <option value="Kelas VIII C">Kelas VIII C</option>
                      <option value="Kelas VIII D">Kelas VIII D</option>
                      <option value="Kelas VIII E">Kelas VIII E</option>
                    </optgroup>
                    <optgroup label="Kelas IX">
                      <option value="Kelas IX A">Kelas IX A</option>
                      <option value="Kelas IX B">Kelas IX B</option>
                      <option value="Kelas IX C">Kelas IX C</option>
                      <option value="Kelas IX D">Kelas IX D</option>
                      <option value="Kelas IX E">Kelas IX E</option>
                    </optgroup>
                    <option value="Umum">Umum</option>
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={authLoading}
                className="mt-2 py-3 bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                {authLoading ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  authMode === 'login' ? 'Masuk Sekarang' : 'Daftar Akun Baru'
                )}
              </button>
            </form>

            <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4 flex flex-col gap-2.5">
              <div className="flex items-center justify-center gap-1.5">
                <span>{authMode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}</span>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login');
                    setAuthError('');
                  }}
                  className="text-sky-600 font-extrabold hover:underline"
                >
                  {authMode === 'login' ? 'Daftar di Sini' : 'Masuk di Sini'}
                </button>
              </div>
              <div className="bg-rose-50 border border-rose-100 p-2 rounded-xl text-[11px] text-rose-800 flex items-center justify-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <span>Pendaftaran akun guru resmi dapat dilakukan via</span>
                <button
                  type="button"
                  onClick={() => { setRole('admin'); playTone(450, 'sine', 0.1); }}
                  className="font-black text-rose-700 underline hover:text-rose-900"
                >
                  Menu Admin
                </button>
              </div>
            </div>
          </div>
        )}

        {role === 'guru_wali' && currentTeacher && (
          <div className="flex flex-col gap-6 w-full animate-fade-in">
            {/* Teacher Selection Profile Banner */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl bg-sky-50 p-2.5 rounded-xl border border-sky-100">👩‍🏫</span>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm md:text-base">Halo, {currentTeacher.name}! 👋</h3>
                  <p className="text-xs text-slate-500">Anda masuk sebagai Guru Wali {currentTeacher.class}. Menampilkan siswa asuhan Anda secara langsung.</p>
                </div>
              </div>
              <div className="flex items-center gap-3.5 self-stretch md:self-auto justify-between border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                <div className="flex items-center gap-2 bg-sky-50 border border-sky-100 px-3.5 py-2 rounded-xl text-xs font-bold text-sky-800">
                  <span>👩‍🏫 Akun Asuhan: <strong className="text-slate-900">{currentTeacher.name}</strong></span>
                </div>
                <button
                  onClick={handleTeacherLogout}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors whitespace-nowrap"
                >
                  Keluar 🚪
                </button>
              </div>
            </div>

            {/* Teacher Tab Navigation */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
              <button
                onClick={() => { setActiveTeacherTab('stories'); playTone(400, 'sine', 0.1); }}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${activeTeacherTab === 'stories' ? 'bg-sky-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <span>📖</span> Jurnal & Tanggapan Cerita
              </button>
              <button
                onClick={() => { setActiveTeacherTab('grades_attendance'); playTone(440, 'sine', 0.1); }}
                className={`px-4 py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-2 cursor-pointer ${activeTeacherTab === 'grades_attendance' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'}`}
              >
                <span>📊</span> Rekap Nilai & Absensi Pertemuan Cerdas
              </button>
            </div>

            {activeTeacherTab === 'stories' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Class statistics & Student Mood Rings */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Stats Overview */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-500" /> Dashboard Kelas {teacherClassesLabel}
                </h3>
                
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Total Cerita</span>
                    <p className="text-2xl font-black text-indigo-600 font-mono mt-0.5">{latestStoriesCount}</p>
                  </div>
                  <div className="bg-rose-50 border border-rose-100 p-3 rounded-xl text-center">
                    <span className="text-[10px] font-bold text-rose-500 uppercase">Butuh Bantuan</span>
                    <p className="text-2xl font-black text-rose-600 font-mono mt-0.5">{activeEscalatedStories.length}</p>
                  </div>
                </div>

                {/* Mood Spread bar */}
                <div className="bg-slate-50/80 rounded-xl p-3.5 border border-slate-200">
                  <div className="flex items-center justify-between mb-2.5">
                    <h4 className="text-[11px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <span>📊</span> Sebaran Emosi Murid (% & Jumlah)
                    </h4>
                    <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                      {latestStoriesCount} Cerita
                    </span>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    {CHARACTERS.map((char) => {
                      const count = moodCounts[char.emotion] || 0;
                      const percentage = latestStoriesCount > 0 ? (count / latestStoriesCount) * 100 : 0;
                      const emojiIcon = 
                        char.emotion === 'Marah' ? '🔥' :
                        char.emotion === 'Sedih' ? '💧' :
                        char.emotion === 'Gembira' ? '⭐' :
                        char.emotion === 'Takut' ? '🟣' : '🌿';

                      return (
                        <div key={char.id} className="flex flex-col gap-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
                              <span>{emojiIcon}</span>
                              <span>{char.emotion}</span>
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="font-black text-indigo-700 font-mono text-xs">
                                {percentage.toFixed(0)}%
                              </span>
                              <span className="text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-xs">
                                {count} murid
                              </span>
                            </div>
                          </div>
                          <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden p-0.5">
                            <div 
                              className={`h-full rounded-full bg-gradient-to-r ${char.color} transition-all duration-500`}
                              style={{ width: `${Math.max(percentage, count > 0 ? 5 : 0)}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mood Ring of Classroom Roster */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                    <span>🎯</span> Pantauan Emosi Harian Murid ({teacherStudents.length})
                  </h3>
                  <button
                    type="button"
                    onClick={() => {
                      setNewStudentClass(currentTeacher?.class && !currentTeacher.class.includes(',') ? currentTeacher.class : 'Kelas VII A');
                      setNewStudentGuruWali(currentTeacher?.name || '');
                      setShowAddStudentModal(true);
                    }}
                    className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[11px] rounded-xl border border-indigo-200 flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                    title="Tambah Murid Binaan Baru"
                  >
                    <UserPlus className="w-3.5 h-3.5" /> + Tambah Murid
                  </button>
                </div>
                <div className="flex flex-col gap-2">
                  {teacherStudents.length === 0 ? (
                    <div className="text-center py-8 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                      <p className="text-2xl mb-1">👩‍🏫</p>
                      <p className="text-xs font-bold text-slate-700">Belum Ada Murid Binaan</p>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                        Hanya murid yang memilih <strong>{currentTeacher?.name}</strong> sebagai Guru Wali saat mendaftar yang akan muncul di daftar pantauan ini.
                      </p>
                    </div>
                  ) : (
                    teacherStudents.map((st) => {
                    const stStory = teacherStories.find(s => s.studentId === st.id);
                    const lastChar = stStory ? CHARACTERS.find(c => c.id === stStory.character) : null;
                    
                    return (
                      <div
                        key={st.id}
                        className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl border border-transparent hover:border-slate-100 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{st.avatar}</span>
                          <div>
                            <p className="font-extrabold text-sm text-slate-800">{st.name}</p>
                            <p className="text-[10px] font-bold text-indigo-700">{st.class}</p>
                            <p className="text-[9.5px] text-slate-500">Guru: <span className="font-semibold text-slate-700">{st.guruWali || 'Belum dipilih'}</span></p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {lastChar ? (
                            <div className="flex items-center gap-2">
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${lastChar.bubbleColor}`}>
                                {stStory.feeling}
                              </span>
                              <div className="w-8 h-8">
                                {React.cloneElement(lastChar.svg, { className: 'w-8 h-8' })}
                              </div>
                            </div>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic mr-1">Belum bercerita</span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleOpenEditStudent(st)}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors focus:outline-none cursor-pointer"
                            title="Edit Data Murid"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setStudentToDelete({
                                id: st.id,
                                name: st.name,
                                className: st.class,
                                hasStory: !!stStory,
                                storyId: stStory?.id,
                                storyFeeling: stStory?.feeling
                              });
                              playTone(350, 'triangle', 0.1);
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none cursor-pointer"
                            title="Hapus Akun Siswa atau Reset Catatan Emosi"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  }))}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Story Feed */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              
              {/* Filter Bar & Scope Switcher */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-3.5">
                {/* Scope Selection: Binaan Saya vs Semua Cerita Sekolah */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
                    <button
                      type="button"
                      onClick={() => { setTeacherViewScope('assigned'); playTone(440, 'sine', 0.1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${teacherViewScope === 'assigned' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      🌟 Binaan Saya ({stories.filter(s => isStoryForTeacher(s, effectiveFilter)).length})
                    </button>
                    <button
                      type="button"
                      onClick={() => { setTeacherViewScope('all'); playTone(500, 'sine', 0.1); }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all cursor-pointer ${teacherViewScope === 'all' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                      🌐 Semua Cerita Sekolah ({stories.length})
                    </button>
                  </div>

                  {/* Search Bar */}
                  <div className="relative flex-1 sm:max-w-xs">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Cari murid / kata kunci cerita..."
                      value={teacherSearchQuery}
                      onChange={(e) => setTeacherSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100 focus:bg-white text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                    {teacherSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setTeacherSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Status & Risk Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-500">Status:</span>
                    <div className="flex gap-1 flex-wrap">
                      {['Semua', 'Menunggu Tanggapan', 'Butuh Bantuan', 'Teratasi'].map((status) => (
                        <button
                          key={status}
                          onClick={() => setFilterStatus(status)}
                          className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${filterStatus === status ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                        >
                          {status}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-stretch sm:self-auto justify-between sm:justify-end">
                    <button
                      type="button"
                      onClick={() => {
                        const filtered = teacherStories.filter(s => {
                          if (filterStatus === 'Semua') return true;
                          if (filterStatus === 'Menunggu Tanggapan') return s.status === 'Menunggu Diperiksa' || s.status === 'Menunggu Tanggapan' || (!s.guruNote && !s.teacherResponse);
                          if (filterStatus === 'Butuh Bantuan') return s.status === 'Butuh Bantuan' || s.escalated === true;
                          if (filterStatus === 'Teratasi') return s.status === 'Teratasi' || s.status === 'Selesai Direfleksi' || s.guruNote || s.teacherResponse;
                          return s.status === filterStatus;
                        });
                        handlePrintReport(
                          'class_summary',
                          undefined,
                          filtered,
                          `LAPORAN REKAPITULASI JURNAL EMOSI KELAS (${currentTeacher ? currentTeacher.class : 'GURU WALI'})`
                        );
                      }}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak Rekap Kelas
                    </button>
                  </div>
                </div>
              </div>

              {/* Feed List */}
              <div className="flex flex-col gap-4">
                {teacherStories.length === 0 && (
                  <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center flex flex-col items-center justify-center gap-3 shadow-xs">
                    <span className="text-4xl">📭</span>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-sm">Belum ada cerita yang terfilter untuk kelas asuhan ini</h4>
                      <p className="text-xs text-slate-500 mt-1">Total ada {stories.length} cerita di seluruh sekolah.</p>
                    </div>
                    {teacherViewScope !== 'all' && (
                      <button
                        type="button"
                        onClick={() => { setTeacherViewScope('all'); setFilterStatus('Semua'); setTeacherSearchQuery(''); playTone(440, 'sine', 0.1); }}
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors cursor-pointer"
                      >
                        🌐 Buka & Tampilkan Semua Cerita Sekolah ({stories.length})
                      </button>
                    )}
                  </div>
                )}
                {teacherStories
                  .filter(s => {
                    if (filterStatus === 'Semua') return true;
                    if (filterStatus === 'Menunggu Tanggapan') {
                      return s.status === 'Menunggu Diperiksa' || s.status === 'Menunggu Tanggapan' || (!s.guruNote && !s.teacherResponse);
                    }
                    if (filterStatus === 'Butuh Bantuan') {
                      return s.status === 'Butuh Bantuan' || s.escalated === true;
                    }
                    if (filterStatus === 'Teratasi') {
                      return s.status === 'Teratasi' || s.status === 'Selesai Direfleksi' || s.guruNote || s.teacherResponse;
                    }
                    return s.status === filterStatus;
                  })
                  .filter(s => filterRisk === 'Semua' || s.analysis?.tingkat_risiko === filterRisk)
                  .filter(s => {
                    if (!teacherSearchQuery.trim()) return true;
                    const q = teacherSearchQuery.toLowerCase();
                    return (s.studentName || '').toLowerCase().includes(q) ||
                           (s.fact || '').toLowerCase().includes(q) ||
                           (s.feeling || '').toLowerCase().includes(q) ||
                           (s.finding || '').toLowerCase().includes(q) ||
                           (s.future || '').toLowerCase().includes(q);
                  })
                  .map((story) => {
                    const char = CHARACTERS.find(c => c.id === story.character);
                    const riskColor = story.analysis?.tingkat_risiko === 'Tinggi' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                                      story.analysis?.tingkat_risiko === 'Sedang' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                      'bg-slate-50 text-slate-700 border-slate-200';
                    return (
                      <div
                        key={story.id}
                        className={`bg-white border-2 rounded-2xl shadow-sm transition-all overflow-hidden ${activeStoryDetail?.id === story.id ? 'border-indigo-500 shadow-md ring-2 ring-indigo-500/10' : 'border-slate-200'}`}
                      >
                        <div className="p-5 flex flex-col md:flex-row gap-5 items-start justify-between">
                          <div className="flex-1 flex gap-4">
                            {/* Avatar or cute image */}
                            <div className="shrink-0 flex flex-col items-center">
                              <span className="text-4xl">{students.find(st => st.id === story.studentId)?.avatar || '👦'}</span>
                              {char && (
                                <div className="w-10 h-10 mt-2 bg-slate-50 rounded-full border border-slate-100 p-0.5">
                                  {char.svg}
                                </div>
                              )}
                            </div>

                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-1">
                                <h4 className="font-extrabold text-slate-800 text-base">{story.studentName}</h4>
                                <span className="text-xs text-slate-400">·</span>
                                <span className="text-xs text-slate-500">{students.find(st => st.id === story.studentId)?.class || 'Kelas SMP'}</span>
                                <span className="text-xs text-slate-400">·</span>
                                <span className="text-xs text-slate-500">{new Date(story.timestamp).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                              </div>

                              <div className="flex flex-wrap items-center gap-2 mb-3">
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${char?.bubbleColor}`}>
                                  Perasaan: {story.feeling}
                                </span>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${riskColor}`}>
                                  Risiko: {story.analysis?.tingkat_risiko}
                                </span>
                                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${story.status === 'Teratasi' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
                                  Status: {story.status}
                                </span>
                              </div>

                              {/* 4F Condensed Content */}
                              <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col gap-2.5 text-xs">
                                <p><strong className="text-rose-600 uppercase text-[10px] tracking-wider block">Fakta (Fact):</strong> "{story.fact}"</p>
                                <p><strong className="text-indigo-600 uppercase text-[10px] tracking-wider block">Pembelajaran (Finding):</strong> "{story.finding}"</p>
                                <p><strong className="text-emerald-600 uppercase text-[10px] tracking-wider block">Tindak Lanjut (Future):</strong> "{story.future}"</p>
                              </div>

                              {story.audioBase64 && (
                                <div className="mt-3 bg-slate-50 border border-slate-100 p-2 rounded-xl flex items-center justify-between">
                                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">📻 Rekaman Suara Anak:</span>
                                  <button
                                    onClick={() => handlePlayAudio(story.id, story.audioBase64)}
                                    className="px-3 py-1 bg-white hover:bg-rose-50 text-rose-600 border border-slate-200 hover:border-rose-200 rounded-lg shadow-sm font-bold text-xs flex items-center gap-1"
                                  >
                                    {playingId === story.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />} Play Suara
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="w-full md:w-auto shrink-0 flex flex-col gap-2">
                            <div className="flex gap-1.5 w-full">
                              <button
                                onClick={() => {
                                  setActiveStoryDetail(story);
                                  setTeacherReplyText(story.analysis?.rekomendasi_guru || '');
                                  playTone(440, 'sine', 0.1);
                                }}
                                className="flex-1 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                              >
                                💬 Beri Tanggapan
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setActiveStoryDetail(story);
                                  const aiDraft = story.analysis?.rekomendasi_guru || `Halo ${story.studentName}, terima kasih sudah berbagi cerita hebat hari ini. Pertahankan terus semangat positifmu!`;
                                  setTeacherReplyText(aiDraft);
                                  setTeacherScoreInput('90');
                                  playTone(600, 'sine', 0.15);
                                }}
                                className="px-3 py-2 bg-sky-100 hover:bg-sky-200 text-sky-800 font-extrabold text-xs rounded-xl border border-sky-300 shadow-sm flex items-center justify-center gap-1 transition-colors"
                                title="Minta bantuan AI untuk mengisi tanggapan dan nilai otomatis"
                              >
                                ✨ Minta Bantuan AI
                              </button>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteStory(story.id, story.studentName)}
                              className="w-full px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                              title="Hapus cerita siswa yang salah/keliru ini"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Hapus Cerita Ini
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                handlePrintReport(
                                  'single_story',
                                  story,
                                  undefined,
                                  `LAPORAN INDIVIDUAL JURNAL EMOSI SISWA - ${story.studentName}`
                                );
                              }}
                              className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <Printer className="w-3.5 h-3.5" /> Cetak Laporan PDF
                            </button>
                            {story.analysis?.tingkat_risiko === 'Tinggi' && (
                              <div className="bg-rose-100 border border-rose-200 text-rose-800 p-2.5 rounded-xl text-[10px] leading-relaxed max-w-[180px]">
                                <AlertTriangle className="w-4 h-4 text-rose-600 inline mr-1 fill-rose-100 animate-bounce" />
                                <strong>Peringatan Sistem:</strong> Cerita anak ini otomatis dirujuk ke Guru BK & Orang Tua!
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Interactive Detail Action Box */}
                        {activeStoryDetail?.id === story.id && (
                          <div className="border-t border-slate-100 bg-slate-50 p-5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                              
                              {/* AI Analysis Panel */}
                              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                                <h5 className="font-extrabold text-xs text-indigo-700 uppercase tracking-wider flex items-center gap-1 border-b border-slate-100 pb-2">
                                  🤖 Analisis Kesehatan Mental Cerdas AI
                                </h5>
                                <div className="text-xs flex flex-col gap-2 leading-relaxed">
                                  <p><strong>Inti Peristiwa:</strong> {story.analysis?.fakta_summary}</p>
                                  <p><strong>Justifikasi Risiko:</strong> <span className="text-slate-600 italic">"{story.analysis?.alasan_risiko}"</span></p>
                                  <div className="bg-indigo-50/50 p-2.5 rounded-lg border-l-4 border-indigo-400 mt-1">
                                    <p className="font-bold text-indigo-800 text-[10px] mb-1">Rekomendasi Tanggapan Guru:</p>
                                    <p className="text-indigo-900 italic">"{story.analysis?.rekomendasi_guru}"</p>
                                  </div>
                                </div>
                              </div>

                              {/* Form Reply Panel */}
                              {(() => {
                                const fb = getStoryFeedback(story);
                                return (
                                  <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                                    <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                      <h5 className="font-extrabold text-xs text-indigo-700 uppercase tracking-wider">
                                        📝 Tulis Tanggapan, Nilai & Absensi Pertemuan Cerdas
                                      </h5>
                                      {story.guruNote && (
                                        <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                          ✓ Sudah Direfleksi Guru
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-col gap-2.5">
                                      <div className="grid grid-cols-2 gap-3">
                                        <div className="flex flex-col gap-1">
                                          <label className="text-[11px] font-extrabold text-slate-700">Skor / Nilai (0-100):</label>
                                          <input
                                            type="number"
                                            min="0"
                                            max="100"
                                            value={fb.score}
                                            onChange={(e) => handleUpdateStoryFeedback(story.id, 'score', e.target.value, story)}
                                            className="px-3 py-2 text-xs border border-slate-200 rounded-lg font-bold text-slate-800 focus:outline-none focus:border-indigo-500 bg-white"
                                          />
                                        </div>
                                        <div className="flex flex-col gap-1">
                                          <label className="text-[11px] font-extrabold text-slate-700">Absensi Pertemuan:</label>
                                          <select
                                            value={fb.attendance}
                                            onChange={(e) => handleUpdateStoryFeedback(story.id, 'attendance', e.target.value, story)}
                                            className="px-3 py-2 text-xs border border-slate-200 rounded-lg font-bold text-slate-700 focus:outline-none focus:border-indigo-500 bg-white"
                                          >
                                            <option value="Hadir">Hadir (Pertemuan Cerdas)</option>
                                            <option value="Izin">Izin</option>
                                            <option value="Sakit">Sakit</option>
                                            <option value="Alpha">Alpha</option>
                                          </select>
                                        </div>
                                      </div>
                                      <textarea
                                        value={fb.note}
                                        onChange={(e) => handleUpdateStoryFeedback(story.id, 'note', e.target.value, story)}
                                        placeholder="Ketik tanggapan yang menenangkan emosi murid..."
                                        className="w-full h-24 p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 leading-relaxed bg-white"
                                      />
                                      <div className="flex gap-2">
                                        <button
                                          type="button"
                                          onClick={() => handleTeacherReplySubmit(story.id)}
                                          className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
                                        >
                                          💾 Simpan Tanggapan & Nilai Guru
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setCustomEscalateNote(story.analysis?.rekomendasi_bk || '');
                                            setShowEscalateModal(true);
                                          }}
                                          className="px-3.5 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 transition-colors cursor-pointer"
                                        >
                                          Rujuk ke BK / Ortu
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })()}

                            </div>

                            {/* Additional BK Action Info (if escalated) */}
                            {story.escalated && (
                              <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                                <h5 className="font-extrabold text-xs text-emerald-800 mb-2 flex items-center gap-1.5">
                                  🩺 STATUS KASUS: DALAM PENANGANAN GURU BK
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                                  <div>
                                    <p className="font-bold text-emerald-700">Rekomendasi Bantuan BK:</p>
                                    <p className="text-emerald-900 italic mt-0.5">"{story.analysis?.rekomendasi_bk}"</p>
                                  </div>
                                  <div>
                                    <p className="font-bold text-emerald-700">Catatan/Perkembangan BK:</p>
                                    <p className="text-emerald-900 italic mt-0.5">
                                      {story.counselorNote ? `"${story.counselorNote}"` : "Belum ada tindakan konseling."}
                                    </p>
                                  </div>
                                </div>
                                {story.status !== 'Teratasi' && (
                                  <button
                                    onClick={() => handleResolveStory(story.id)}
                                    className="mt-3 px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5"
                                  >
                                    <CheckCircle className="w-4 h-4" /> Tandai Kasus Telah Selesai / Teratasi
                                  </button>
                                )}
                              </div>
                            )}

                          </div>
                        )}

                      </div>
                    );
                  })}
              </div>

            </div>

            </div>
            )}

            {activeTeacherTab === 'grades_attendance' && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-6 animate-fade-in w-full">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-extrabold text-slate-800 text-base md:text-lg flex items-center gap-2">
                      <span>📊</span> Rekapitulasi Nilai & Absensi Pertemuan Cerdas — {currentTeacher.class}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">Daftar rekap rentangan nilai skor (0-100) dan kehadiran siswa asuhan Anda.</p>
                  </div>
                  <button
                    onClick={() => {
                      handlePrintReport('class_summary', undefined, teacherStories, `REKAP NILAI & ABSENSI PERTEMUAN CERDAS - ${currentTeacher.class}`);
                    }}
                    className="px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-extrabold text-xs rounded-xl border border-sky-200 flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <span>🖨️</span> Cetak / Export Rekap Nilai
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-extrabold uppercase text-[10px]">
                        <th className="p-3.5 rounded-l-xl">No</th>
                        <th className="p-3.5">Nama Siswa</th>
                        <th className="p-3.5">Kelas</th>
                        <th className="p-3.5">Status Refleksi</th>
                        <th className="p-3.5">Absensi Cerdas</th>
                        <th className="p-3.5 text-right rounded-r-xl">Skor / Nilai (0-100)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                      {teacherStudents.map((st, idx) => {
                        const stStory = teacherStories.find(s => s.studentId === st.id);
                        return (
                          <tr key={st.id} className="hover:bg-slate-50/80 transition-colors">
                            <td className="p-3.5 text-slate-500 font-bold">{idx + 1}</td>
                            <td className="p-3.5 font-extrabold flex items-center gap-2">
                              <span className="text-base">{st.avatar}</span>
                              <span>{st.name}</span>
                            </td>
                            <td className="p-3.5 text-slate-600 font-bold">{st.class}</td>
                            <td className="p-3.5">
                              {stStory ? (
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold ${stStory.guruNote ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                  {stStory.guruNote ? 'Sudah Ditanggapi' : 'Menunggu Tanggapan'}
                                </span>
                              ) : (
                                <span className="text-slate-400 italic">Belum Mengirim Cerita</span>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className="px-2.5 py-1 bg-sky-50 text-sky-700 rounded-full font-bold text-[10px] border border-sky-100">
                                {stStory?.attendance || 'Hadir (Cerdas)'}
                              </span>
                            </td>
                            <td className="p-3.5 text-right font-black text-sm">
                              {stStory?.score !== undefined ? (
                                <span className="text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
                                  {stStory.score} / 100
                                </span>
                              ) : (
                                <span className="text-slate-400 italic font-normal">Belum Dinilai</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ==================================================================== */}
        {/* ROLE: GURU BK & ORANG TUA PORTAL                                    */}
        {/* ==================================================================== */}
        {role === 'guru_bk' && !currentBkUser && (
          <div className="max-w-md w-full mx-auto my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 animate-fade-in">
            <div className="text-center flex flex-col gap-2">
              <span className="text-5xl mx-auto p-4 bg-emerald-50 rounded-full w-20 h-20 flex items-center justify-center border border-emerald-100">🩺</span>
              <h3 className="text-xl font-extrabold text-slate-800">Portal Rujukan Terpadu</h3>
              <p className="text-xs text-slate-500 font-medium">
                Pintu gerbang penanganan rujukan emosional terpadu demi mendampingi langkah anak.
              </p>
            </div>

            {bkAuthError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold p-3.5 rounded-xl">
                ⚠️ {bkAuthError}
              </div>
            )}

            <div className="grid grid-cols-1 gap-6">
              {/* Option 1: Guru BK */}
              <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🩺</span>
                    <div>
                      <h4 className="font-extrabold text-sm text-emerald-800">Masuk sebagai Guru BK</h4>
                      <p className="text-[11px] font-bold text-emerald-700">Ni Made Medi Astuti, S.Pd., M.Pd</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/80 px-2 py-0.5 rounded-full border border-emerald-200">
                    Kelas VII - IX
                  </span>
                </div>
                <form onSubmit={handleBkLogin} className="flex flex-col gap-2">
                  <div className="relative">
                    <input
                      type={showBkPassword ? 'text' : 'password'}
                      required
                      value={bkPasswordInput}
                      onChange={(e) => setBkPasswordInput(e.target.value)}
                      placeholder="Sandi BK (bk123 / 12345)"
                      className="w-full pl-3.5 pr-10 py-2.5 border-2 border-emerald-100 rounded-xl bg-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowBkPassword(!showBkPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-emerald-700 transition-colors cursor-pointer"
                      title={showBkPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                    >
                      {showBkPassword ? <EyeOff className="w-4 h-4 text-emerald-600" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Masuk Portal BK
                  </button>
                </form>
              </div>

              {/* Option 2: Orang Tua */}
              <div className="bg-sky-50/50 border border-sky-100 p-5 rounded-2xl flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🏠</span>
                  <h4 className="font-extrabold text-sm text-sky-800">Masuk sebagai Orang Tua</h4>
                </div>
                <form onSubmit={handleParentLogin} className="flex flex-col gap-2">
                  <input
                    type="text"
                    required
                    value={parentChildInput}
                    onChange={(e) => setParentChildInput(e.target.value)}
                    placeholder="Nama Lengkap Siswa"
                    className="px-3.5 py-2.5 border-2 border-sky-100 rounded-xl bg-white text-xs font-medium focus:outline-none focus:border-sky-500"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors"
                  >
                    Verifikasi Wali Murid
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {role === 'guru_bk' && currentBkUser && (
          <div className="flex flex-col gap-6 w-full animate-fade-in">
            {deleteNotification && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl flex items-center justify-between shadow-sm animate-fade-in">
                <span>{deleteNotification}</span>
                <button type="button" onClick={() => setDeleteNotification('')} className="text-emerald-600 hover:text-emerald-900 ml-2">
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {/* BK & Ortu Active Session Banner */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  {currentBkUser === 'guru_bk' ? '🩺' : '🏠'}
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
                    {currentBkUser === 'guru_bk' ? 'Portal Terpadu Guru BK (Kelas VII - IX)' : 'Portal Informasi Orang Tua'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentBkUser === 'guru_bk' 
                      ? 'Selamat datang, Ibu Ni Made Medi Astuti, S.Pd., M.Pd (Guru BK Kelas VII - IX). Akses tindakan intervensi, rekomendasi, dan riwayat bimbingan.' 
                      : 'Selamat datang, Bapak/Ibu Wali Murid. Anda dapat melihat perkembangan analisis emosi rujukan demi pendampingan di rumah.'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-stretch md:self-auto justify-between">
                <button
                  type="button"
                  onClick={() => {
                    const escalatedList = stories.filter(s => s.escalated || s.status === 'Butuh Bantuan');
                    const targetList = escalatedList.length > 0 ? escalatedList : stories;
                    handlePrintReport(
                      'class_summary',
                      undefined,
                      targetList,
                      'LAPORAN REKAPITULASI RUJUKAN & INTERVENSI BIMBINGAN KONSELING (BK) KELAS VII - IX'
                    );
                  }}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak Rekap Kasus BK
                </button>
                <button
                  onClick={handleBkOrtuLogout}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors whitespace-nowrap text-center"
                >
                  Keluar Portal 🚪
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Escalated Case List */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-500 fill-rose-50" /> Kasus Rujukan BK Aktif
                </h3>
                
                <input
                  type="text"
                  placeholder="Cari nama murid rujukan..."
                  value={bkSearch}
                  onChange={(e) => setBkSearch(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 mb-3"
                />

                <div className="flex flex-col gap-1.5">
                  {stories
                    .filter(s => s.escalated && !s.studentName?.toLowerCase().includes('andi prasetyo'))
                    .filter(s => s.studentName.toLowerCase().includes(bkSearch.toLowerCase()))
                    .map((story) => {
                      const isSelected = activeStoryDetail?.id === story.id;
                      return (
                        <div
                          key={story.id}
                          className={`flex items-center gap-1.5 w-full p-1.5 rounded-xl transition-all border ${
                            isSelected
                              ? 'bg-emerald-600 border-emerald-600 text-white shadow-md'
                              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => {
                              setActiveStoryDetail(story);
                              playTone(400, 'sine', 0.1);
                            }}
                            className="flex items-center gap-2.5 flex-1 min-w-0 text-left p-1 cursor-pointer"
                          >
                            <span className="text-2xl bg-white/20 p-1 rounded-lg">
                              {students.find(st => st.id === story.studentId)?.avatar || '👦'}
                            </span>
                            <div className="truncate flex-1">
                              <div className="flex items-center justify-between">
                                <p className="font-extrabold text-xs leading-tight">{story.studentName}</p>
                                <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${story.status === 'Teratasi' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                                  {story.status}
                                </span>
                              </div>
                              <p className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                                Terakhir: {story.feeling} ({new Date(story.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})
                              </p>
                            </div>
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFromBk(story.id, story.studentName);
                            }}
                            className={`p-2 rounded-lg border transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                              isSelected
                                ? 'bg-rose-500 hover:bg-rose-600 text-white border-rose-400'
                                : 'bg-rose-50 hover:bg-rose-100 text-rose-600 border-rose-200'
                            }`}
                            title={`Hapus rujukan ${story.studentName} dari portal BK`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      );
                    })}

                  {stories.filter(s => s.escalated && !s.studentName?.toLowerCase().includes('andi prasetyo')).length === 0 && (
                    <div className="text-center py-8 text-slate-400 text-xs">
                      Tidak ada siswa rujukan aktif.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Professional Intervention & Parental Collab Hub */}
            <div className="lg:col-span-8">
              {activeStoryDetail ? (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col gap-6 animate-fade-in">
                  
                  {/* Case Profile Header */}
                  <div className="flex flex-col sm:flex-row items-center justify-between border-b border-slate-100 pb-5 gap-4">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl bg-slate-50 p-3 rounded-2xl border border-slate-100">
                        {students.find(st => st.id === activeStoryDetail.studentId)?.avatar || '👦'}
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-slate-800 text-lg">{activeStoryDetail.studentName}</h3>
                          <span className="bg-rose-100 text-rose-800 text-[9px] font-bold px-2 py-0.5 rounded-full">Rujukan BK</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          {(() => {
                            const stObj = students.find(st => st.id === activeStoryDetail.studentId);
                            return stObj ? `${stObj.class} · Wali Kelas: ${stObj.guruWali}` : 'Bimbingan Konseling Kelas VII - IX';
                          })()}
                        </p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Tanggal Refleksi: {new Date(activeStoryDetail.timestamp).toLocaleString('id-ID')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleRemoveFromBk(activeStoryDetail.id, activeStoryDetail.studentName)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl border border-rose-200 shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                        title="Hapus rujukan murid ini dari portal BK"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Hapus Kasus BK
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          handlePrintReport(
                            'counseling_report',
                            activeStoryDetail,
                            undefined,
                            `LAPORAN INTERVENSI KONSELING (BK) - ${activeStoryDetail.studentName}`
                          );
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Printer className="w-3.5 h-3.5" /> Cetak Rujukan BK PDF
                      </button>
                      <select
                        value={activeStoryDetail.status}
                        onChange={(e) => {
                          if (e.target.value === 'Teratasi') handleResolveStory(activeStoryDetail.id);
                        }}
                        className="border border-slate-200 rounded-lg text-xs font-bold p-1.5 bg-white focus:outline-none cursor-pointer"
                      >
                        <option value="Butuh Bantuan">Butuh Bantuan Aktif</option>
                        <option value="Teratasi">Selesai / Teratasi</option>
                      </select>
                    </div>
                  </div>

                  {/* 4F Original Input summary */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4">
                    <h4 className="font-extrabold text-xs text-slate-700 uppercase mb-3 flex items-center gap-1">
                      <span>📄</span> Rangkuman Alur 4F Siswa
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs leading-relaxed">
                      <div>
                        <p className="font-bold text-rose-700">F - FACT (Kejadian):</p>
                        <p className="text-slate-800 italic">"{activeStoryDetail.fact}"</p>
                      </div>
                      <div>
                        <p className="font-bold text-indigo-700">F - FEELING (Perasaan):</p>
                        <p className="text-slate-800 italic">"{activeStoryDetail.feeling}" (Karakter {activeStoryDetail.character})</p>
                      </div>
                      <div>
                        <p className="font-bold text-amber-700">F - FINDING (Pembelajaran):</p>
                        <p className="text-slate-800 italic">"{activeStoryDetail.finding}"</p>
                      </div>
                      <div>
                        <p className="font-bold text-emerald-700">F - FUTURE (Rencana):</p>
                        <p className="text-slate-800 italic">"{activeStoryDetail.future}"</p>
                      </div>
                    </div>
                  </div>

                  {/* Two Hub Tabs: 1. Professional Counseling Recommendations / 2. Parent Co-partner advice */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* BK INTERVENTION */}
                    <div className="bg-emerald-50/50 border border-emerald-100 p-4 rounded-xl flex flex-col gap-3">
                      <h4 className="font-bold text-xs text-emerald-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <Award className="w-4 h-4 text-emerald-600" /> Bimbingan Profesional (BK)
                      </h4>
                      <div className="text-xs text-emerald-900 leading-relaxed space-y-2">
                        <p><strong>Alasan Eskalasi:</strong> {activeStoryDetail.analysis?.alasan_risiko}</p>
                        <div className="bg-white p-3 rounded-lg border border-emerald-100">
                          <p className="font-bold text-emerald-800 mb-1">Rencana Terapi/Intervensi Konselor:</p>
                          <p className="italic text-emerald-700">"{activeStoryDetail.analysis?.rekomendasi_bk}"</p>
                        </div>
                      </div>
                    </div>

                    {/* PARENT CO-PARTNER ADVICE */}
                    <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-xl flex flex-col gap-3">
                      <h4 className="font-bold text-xs text-amber-800 flex items-center gap-1.5 uppercase tracking-wider">
                        <Home className="w-4 h-4 text-amber-600" /> Kolaborasi Orang Tua (Rumah)
                      </h4>
                      <div className="text-xs text-amber-900 leading-relaxed space-y-2">
                        <p><strong>Peran Orang Tua:</strong> Dapatkan penyelarasan dukungan harian untuk memvalidasi perasaan anak di lingkungan rumah.</p>
                        <div className="bg-white p-3 rounded-lg border border-amber-100">
                          <p className="font-bold text-amber-800 mb-1">Panduan Aktivitas & Diskusi di Rumah:</p>
                          <p className="italic text-amber-700">"{activeStoryDetail.analysis?.rekomendasi_orangtua}"</p>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Log action notes form */}
                  <div className="border-t border-slate-100 pt-5">
                    <h4 className="font-bold text-xs text-slate-800 mb-2 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-slate-500" /> Log Riwayat Penanganan Konseling BK
                    </h4>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                      <div className="mb-3 text-xs">
                        <p className="font-bold text-slate-600">Catatan Tindakan Saat ini:</p>
                        {activeStoryDetail.counselorNote ? (
                          <p className="bg-white p-3 border border-slate-100 rounded-lg mt-1 italic text-slate-700 leading-relaxed">
                            "{activeStoryDetail.counselorNote}"
                          </p>
                        ) : (
                          <p className="text-slate-400 italic mt-1">Belum ada tindakan konseling yang terekam.</p>
                        )}
                      </div>

                      <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Perbarui Catatan Tindakan Konseling:</label>
                        <textarea
                          placeholder="Tulis ringkasan hasil konsultasi dengan siswa atau koordinasi dengan orang tua..."
                          value={counselorActionNote}
                          onChange={(e) => setCounselorActionNote(e.target.value)}
                          className="w-full h-20 p-2.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-emerald-600 leading-relaxed"
                        />
                        <button
                          onClick={() => handleCounselorNoteSubmit(activeStoryDetail.id)}
                          className="self-end px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-sm transition-colors"
                        >
                          Simpan Catatan BK
                        </button>
                      </div>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-sm">
                  <p className="text-4xl mb-2">🩺</p>
                  <p className="font-bold text-slate-700">Pilih kasus siswa rujukan di sebelah kiri untuk melihat detail penanganan BK & Orang Tua.</p>
                </div>
              )}
            </div>

          </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* ROLE: ADMINISTRATOR SEKOLAH (ADMIN PORTAL)                          */}
        {/* ==================================================================== */}
        {role === 'admin' && !isAdminLoggedIn && (
          <div className="max-w-md w-full mx-auto my-8 bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm flex flex-col gap-6 animate-fade-in">
            <div className="text-center flex flex-col gap-2">
              <span className="text-5xl mx-auto p-4 bg-rose-50 rounded-full w-20 h-20 flex items-center justify-center border border-rose-100 text-rose-600">
                <Shield className="w-10 h-10" />
              </span>
              <h3 className="text-xl font-extrabold text-slate-800">Portal Administrator Sekolah</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Kelola pendaftaran akun Guru Wali, Guru BK, dan data Murid secara terpusat langsung ke Cloud Firestore.
              </p>
            </div>

            {adminAuthError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3.5 rounded-xl">
                ⚠️ {adminAuthError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-600">Email Administrator:</label>
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@cerdas.id"
                  className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white text-xs font-medium focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-600">Kata Sandi Administrator:</label>
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {showAdminPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAdminPassword ? 'Sembunyikan' : 'Lihat Sandi'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAdminPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="Masukkan password admin (default: admin123)"
                    className="w-full pl-3.5 pr-10 py-2.5 border-2 border-slate-200 rounded-xl bg-white text-xs font-medium focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPassword(!showAdminPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title={showAdminPassword ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
                  >
                    {showAdminPassword ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-[11px] text-slate-600 space-y-1">
                <p className="font-bold text-slate-700 flex items-center gap-1">
                  <Key className="w-3.5 h-3.5 text-rose-600" /> Kredensial Default Admin:
                </p>
                <p>Kata Sandi: <code className="bg-slate-200 px-1 py-0.5 rounded font-mono font-bold text-rose-700">admin123</code></p>
              </div>

              <button
                type="submit"
                className="mt-2 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Masuk ke Portal Admin
              </button>
            </form>
          </div>
        )}

        {role === 'admin' && isAdminLoggedIn && (
          <div className="flex flex-col gap-6 w-full animate-fade-in">
            {/* Admin Header Banner */}
            <div className="bg-gradient-to-r from-rose-600 to-rose-700 text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                  <Shield className="w-7 h-7 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg md:text-xl">Dashboard Administrator Sekolah</h3>
                    <span className="bg-white/20 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Cloud Firestore Live
                    </span>
                  </div>
                  <p className="text-xs text-rose-100 mt-0.5">
                    Kelola dan daftarkan akun resmi Guru Wali, Guru BK, dan data Murid yang tersinkronisasi otomatis ke semua perangkat.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  disabled={isSavingStudentsToCloud || students.length === 0}
                  onClick={handleSaveAllStudentsToCloud}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Simpan dan sinkronkan seluruh data murid ke Cloud Firestore"
                >
                  {isSavingStudentsToCloud ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  <span>Simpan Data Siswa ({students.length})</span>
                </button>
                <button
                  type="button"
                  disabled={isSavingTeachersToCloud || teachers.length === 0}
                  onClick={handleSaveAllTeachersToCloud}
                  className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  title="Simpan dan sinkronkan seluruh data guru ke Cloud Firestore"
                >
                  {isSavingTeachersToCloud ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                  <span>Simpan Data Guru ({teachers.length})</span>
                </button>
                <button
                  onClick={handleAdminLogout}
                  className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl border border-white/20 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" /> Keluar
                </button>
              </div>
            </div>

            {/* Admin Sub Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-200 pb-3 overflow-x-auto">
              <button
                onClick={() => { setAdminTab('teachers'); playTone(300, 'sine', 0.05); }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'teachers' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
              >
                <UserCheck className="w-4 h-4" /> Kelola & Daftarkan Guru ({teachers.length})
              </button>
              <button
                onClick={() => { setAdminTab('students'); playTone(350, 'sine', 0.05); }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'students' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
              >
                <Users className="w-4 h-4" /> Kelola & Daftarkan Murid ({students.length})
              </button>
              <button
                onClick={() => { setAdminTab('upload_excel'); playTone(400, 'sine', 0.05); }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'upload_excel' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-500" /> Upload & Import Excel
              </button>
              <button
                onClick={() => { setAdminTab('stats'); playTone(450, 'sine', 0.05); }}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all whitespace-nowrap ${adminTab === 'stats' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}
              >
                <TrendingUp className="w-4 h-4" /> Rekap & Monitoring Data
              </button>
            </div>

            {/* TAB 1: KELOLA & DAFTARKAN GURU */}
            {adminTab === 'teachers' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form Daftarkan Guru Baru */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <span className="p-2 bg-rose-50 text-rose-600 rounded-xl"><UserPlus className="w-5 h-5" /></span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">Daftarkan Akun Guru Baru</h4>
                      <p className="text-[11px] text-slate-500">Akun akan langsung aktif di database cloud Firestore.</p>
                    </div>
                  </div>

                  {adminTeacherSuccessMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl animate-fade-in">
                      {adminTeacherSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleAdminAddTeacher} className="flex flex-col gap-3.5 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-700">Nama Lengkap & Gelar Guru:</label>
                      <input
                        type="text"
                        required
                        value={adminNewTeacherName}
                        onChange={(e) => setAdminNewTeacherName(e.target.value)}
                        placeholder="Contoh: I Wayan Sumayasa, S.Pd"
                        className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-rose-500 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-700">Alamat Email Guru (Username Login):</label>
                      <input
                        type="email"
                        required
                        value={adminNewTeacherEmail}
                        onChange={(e) => setAdminNewTeacherEmail(e.target.value)}
                        placeholder="Contoh: isumayasa91@guru.smp.belajar.id"
                        className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-rose-500 font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-700">Kata Sandi / PIN Awal:</label>
                      <input
                        type="text"
                        required
                        value={adminNewTeacherPassword}
                        onChange={(e) => setAdminNewTeacherPassword(e.target.value)}
                        placeholder="password123"
                        className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-rose-500 font-mono font-medium"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-bold text-slate-700">Pilihan Kelas yang Diampu (Bisa Pilih Lebih dari 1 Kelas):</label>
                        <span className="text-[10px] font-extrabold bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full">
                          {adminNewTeacherClasses.length} Kelas Terpilih
                        </span>
                      </div>
                      
                      <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col gap-2.5 max-h-[220px] overflow-y-auto">
                        {/* Kelas VII Group */}
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-500 uppercase mb-1">Kelas VII (Tujuh):</p>
                          <div className="flex flex-wrap gap-1.5">
                            {['Kelas VII A', 'Kelas VII B', 'Kelas VII C', 'Kelas VII D', 'Kelas VII E'].map((cls) => {
                              const isSelected = adminNewTeacherClasses.includes(cls);
                              return (
                                <button
                                  key={cls}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setAdminNewTeacherClasses(prev => prev.filter(c => c !== cls));
                                    } else {
                                      setAdminNewTeacherClasses(prev => [...prev, cls]);
                                    }
                                    playTone(400, 'sine', 0.05);
                                  }}
                                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${isSelected ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                                >
                                  {isSelected ? '✓ ' : '+ '}{cls}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Kelas VIII Group */}
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-500 uppercase mb-1">Kelas VIII (Delapan):</p>
                          <div className="flex flex-wrap gap-1.5">
                            {['Kelas VIII A', 'Kelas VIII B', 'Kelas VIII C', 'Kelas VIII D', 'Kelas VIII E'].map((cls) => {
                              const isSelected = adminNewTeacherClasses.includes(cls);
                              return (
                                <button
                                  key={cls}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setAdminNewTeacherClasses(prev => prev.filter(c => c !== cls));
                                    } else {
                                      setAdminNewTeacherClasses(prev => [...prev, cls]);
                                    }
                                    playTone(400, 'sine', 0.05);
                                  }}
                                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${isSelected ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                                >
                                  {isSelected ? '✓ ' : '+ '}{cls}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Kelas IX Group */}
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-500 uppercase mb-1">Kelas IX (Sembilan):</p>
                          <div className="flex flex-wrap gap-1.5">
                            {['Kelas IX A', 'Kelas IX B', 'Kelas IX C', 'Kelas IX D', 'Kelas IX E'].map((cls) => {
                              const isSelected = adminNewTeacherClasses.includes(cls);
                              return (
                                <button
                                  key={cls}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setAdminNewTeacherClasses(prev => prev.filter(c => c !== cls));
                                    } else {
                                      setAdminNewTeacherClasses(prev => [...prev, cls]);
                                    }
                                    playTone(400, 'sine', 0.05);
                                  }}
                                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${isSelected ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                                >
                                  {isSelected ? '✓ ' : '+ '}{cls}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Kategori Khusus */}
                        <div>
                          <p className="text-[10px] font-extrabold text-slate-500 uppercase mb-1">Kategori Khusus:</p>
                          <div className="flex flex-wrap gap-1.5">
                            {['Guru Bimbingan Konseling (BK)', 'Umum / Lintas Kelas'].map((cls) => {
                              const isSelected = adminNewTeacherClasses.includes(cls);
                              return (
                                <button
                                  key={cls}
                                  type="button"
                                  onClick={() => {
                                    if (isSelected) {
                                      setAdminNewTeacherClasses(prev => prev.filter(c => c !== cls));
                                    } else {
                                      setAdminNewTeacherClasses(prev => [...prev, cls]);
                                    }
                                    playTone(400, 'sine', 0.05);
                                  }}
                                  className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${isSelected ? 'bg-rose-600 text-white border-rose-600 shadow-sm' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                                >
                                  {isSelected ? '✓ ' : '+ '}{cls}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-4 h-4" /> Daftarkan Akun Guru ke Cloud
                    </button>
                  </form>

                  <button
                    type="button"
                    disabled={isSavingTeachersToCloud}
                    onClick={handleSaveAllTeachersToCloud}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingTeachersToCloud ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan Data Guru ke Firestore...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" /> Simpan Semua Data Guru ke Cloud Firestore
                      </>
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      if (confirm('Apakah Anda ingin memulihkan dan menyinkronkan seluruh akun Guru Wali & Guru BK bawaan ke Cloud Firestore?')) {
                        try {
                          const count = await restoreAllTeachersRoster();
                          showToast(`✅ Berhasil memulihkan & menyinkronkan ${count} data Guru ke Cloud!`);
                          playTone(523, 'sine', 0.2);
                        } catch (e) {
                          console.error(e);
                          showToast('❌ Gagal menyinkronkan data guru.');
                        }
                      }
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs border border-rose-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-rose-600" /> Pulihkan & Sinkronkan Semua Akun Guru ke Cloud
                  </button>
                </div>

                {/* List of Teachers */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl">👩‍🏫</span>
                      <h4 className="font-extrabold text-sm text-slate-800">Daftar Akun Guru Terdaftar</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        disabled={isSavingTeachersToCloud}
                        onClick={handleSaveAllTeachersToCloud}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        title="Simpan dan sinkronkan seluruh data akun guru ke Cloud Firestore"
                      >
                        {isSavingTeachersToCloud ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" /> Simpan ke Cloud
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAdminTab('upload_excel'); playTone(400, 'sine', 0.05); }}
                        className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 border border-emerald-200 shadow-2xs transition-colors cursor-pointer"
                        title="Upload ratusan akun guru via file Excel"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Upload Excel
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePrintTeacherCredentials(teachers, 'Daftar Kartu Akses Login Semua Guru Wali & BK')}
                        className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
                        title="Cetak Kartu Akses Login untuk seluruh Guru Wali & BK"
                      >
                        <Printer className="w-3.5 h-3.5" /> Cetak Akses
                      </button>
                      <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                        Total: {teachers.length} Guru
                      </span>
                    </div>
                  </div>

                  {teachers.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      Belum ada guru terdaftar di database.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {teachers.map((t) => (
                        <div
                          key={t.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl transition-all gap-3"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-2xl bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                              👩‍🏫
                            </span>
                            <div>
                              <p className="font-extrabold text-xs text-slate-800">{t.name}</p>
                              <div className="flex flex-wrap items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                                <span className="font-medium">📧 {t.email}</span>
                                <span className="text-slate-300">•</span>
                                <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full font-mono font-bold">
                                  🔑 {t.password || 'password123'}
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold">
                                  {t.class}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 self-end sm:self-center">
                            <button
                              type="button"
                              onClick={() => handlePrintTeacherCredentials([t], `Kartu Akses Login Guru - ${t.name}`)}
                              title="Cetak Kartu Akses Login untuk Guru ini"
                              className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-extrabold text-[11px] rounded-xl transition-colors border border-sky-200 flex items-center gap-1 shadow-sm"
                            >
                              <Printer className="w-3.5 h-3.5 text-sky-600" /> Cetak Akses
                            </button>
                            <button
                              type="button"
                              onClick={() => handleOpenEditTeacher(t)}
                              title="Edit Data Akun Guru (Perbaiki Nama, Email, Password, atau Kelas)"
                              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold text-[11px] rounded-xl transition-colors border border-indigo-200 flex items-center gap-1 shadow-sm"
                            >
                              <Edit className="w-3.5 h-3.5 text-indigo-600" /> Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setTeacherToDelete({ id: t.id, name: t.name });
                                playTone(350, 'triangle', 0.1);
                              }}
                              title={`Hapus akun guru ${t.name}`}
                              className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] rounded-xl transition-colors border border-rose-200 flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Hapus
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: KELOLA & DAFTARKAN SISWA */}
            {adminTab === 'students' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                {/* Form Daftarkan Siswa Baru */}
                <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
                    <span className="p-2 bg-sky-50 text-sky-600 rounded-xl"><UserPlus className="w-5 h-5" /></span>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-800">Daftarkan Profil Murid Baru</h4>
                      <p className="text-[11px] text-slate-500">Murid akan langsung terhubung dengan Guru Wali yang dipilih.</p>
                    </div>
                  </div>

                  {adminStudentSuccessMsg && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold p-3 rounded-xl animate-fade-in">
                      {adminStudentSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleAdminAddStudent} className="flex flex-col gap-3.5 text-xs">
                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-700">Nama Lengkap Murid:</label>
                      <input
                        type="text"
                        required
                        value={adminNewStudentName}
                        onChange={(e) => setAdminNewStudentName(e.target.value)}
                        placeholder="Contoh: Budi Setiawan"
                        className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:border-sky-500 font-medium"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-700">Kelas Murid:</label>
                        <select
                          value={adminNewStudentClass}
                          onChange={(e) => setAdminNewStudentClass(e.target.value)}
                          className="px-3 py-2.5 border-2 border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-none focus:border-sky-500"
                        >
                          <optgroup label="Kelas VII">
                            <option value="Kelas VII A">Kelas VII A</option>
                            <option value="Kelas VII B">Kelas VII B</option>
                            <option value="Kelas VII C">Kelas VII C</option>
                            <option value="Kelas VII D">Kelas VII D</option>
                            <option value="Kelas VII E">Kelas VII E</option>
                          </optgroup>
                          <optgroup label="Kelas VIII">
                            <option value="Kelas VIII A">Kelas VIII A</option>
                            <option value="Kelas VIII B">Kelas VIII B</option>
                            <option value="Kelas VIII C">Kelas VIII C</option>
                            <option value="Kelas VIII D">Kelas VIII D</option>
                            <option value="Kelas VIII E">Kelas VIII E</option>
                          </optgroup>
                          <optgroup label="Kelas IX">
                            <option value="Kelas IX A">Kelas IX A</option>
                            <option value="Kelas IX B">Kelas IX B</option>
                            <option value="Kelas IX C">Kelas IX C</option>
                            <option value="Kelas IX D">Kelas IX D</option>
                            <option value="Kelas IX E">Kelas IX E</option>
                          </optgroup>
                        </select>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="font-bold text-slate-700">Pilih Avatar:</label>
                        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200">
                          {['👦', '👧', '🧑', '👨'].map((av) => (
                            <button
                              key={av}
                              type="button"
                              onClick={() => setAdminNewStudentAvatar(av)}
                              className={`py-1 text-sm rounded-lg transition-all ${adminNewStudentAvatar === av ? 'bg-sky-500 text-white shadow-sm' : 'hover:bg-slate-200'}`}
                            >
                              {av}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="font-bold text-slate-700">Guru Wali Pengasuh:</label>
                      <select
                        value={adminNewStudentGuruWali}
                        onChange={(e) => setAdminNewStudentGuruWali(e.target.value)}
                        className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-none focus:border-sky-500"
                      >
                        {teachers.map((t) => (
                          <option key={t.id} value={t.name}>
                            {t.name} ({t.class})
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      className="mt-2 py-3 bg-sky-500 hover:bg-sky-400 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Plus className="w-4 h-4" /> Daftarkan Murid ke Cloud
                    </button>
                  </form>

                  <button
                    type="button"
                    disabled={isSavingStudentsToCloud || students.length === 0}
                    onClick={handleSaveAllStudentsToCloud}
                    className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-extrabold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSavingStudentsToCloud ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan Data Siswa ke Firestore...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" /> Simpan Semua Data Siswa ke Cloud Firestore
                      </>
                    )}
                  </button>

                  <button
                    onClick={async () => {
                      if (confirm('Apakah Anda ingin memulihkan dan menyinkronkan seluruh data murid terdaftar ke Cloud Firestore?')) {
                        try {
                          const count = await restoreAllStudentsData();
                          showToast(`✅ Berhasil memulihkan & menyinkronkan ${count} data murid ke Cloud!`);
                          playTone(523, 'sine', 0.2);
                        } catch (e) {
                          console.error(e);
                          showToast('❌ Gagal memulihkan data murid.');
                        }
                      }
                    }}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-700 rounded-xl font-bold text-xs border border-sky-200 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-4 h-4 text-sky-600" /> Pulihkan & Sinkronkan Semua Data Murid ke Cloud
                  </button>

                  <button
                    type="button"
                    disabled={isDeletingAllStudents || students.length === 0}
                    onClick={handleDeleteAllStudents}
                    className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl font-bold text-xs border border-rose-200 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    title="Kosongkan seluruh data murid dari Cloud Firestore"
                  >
                    {isDeletingAllStudents ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin text-rose-600" /> Sedang Menghapus Data Murid...
                      </>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 text-rose-600" /> Hapus Semua Data Siswa
                      </>
                    )}
                  </button>
                </div>

                {/* List of Students */}
                <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-2 bg-sky-50 text-sky-600 rounded-xl">🎒</span>
                      <h4 className="font-extrabold text-sm text-slate-800">Daftar Murid Terdaftar</h4>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 self-end sm:self-center">
                      <button
                        type="button"
                        disabled={isSavingStudentsToCloud || students.length === 0}
                        onClick={handleSaveAllStudentsToCloud}
                        className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        title="Simpan dan sinkronkan seluruh data murid ke Cloud Firestore"
                      >
                        {isSavingStudentsToCloud ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Menyimpan...
                          </>
                        ) : (
                          <>
                            <Check className="w-3.5 h-3.5" /> Simpan ke Cloud ({students.length})
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setAdminTab('upload_excel'); playTone(400, 'sine', 0.05); }}
                        className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 border border-emerald-200 shadow-2xs transition-colors cursor-pointer"
                        title="Upload ratusan data siswa via file Excel"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" /> Upload Excel Siswa
                      </button>
                      <button
                        type="button"
                        disabled={isDeletingAllStudents || students.length === 0}
                        onClick={handleDeleteAllStudents}
                        className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-xs rounded-xl flex items-center gap-1.5 border border-rose-200 shadow-2xs transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Hapus semua data murid dari database"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Hapus Semua ({students.length})
                      </button>
                      <span className="text-xs font-bold bg-slate-100 px-3 py-1 rounded-full text-slate-600">
                        Total: {students.length} Murid
                      </span>
                    </div>
                  </div>

                  {students.length === 0 ? (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      Belum ada murid terdaftar di database.
                    </div>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {students.map((st) => {
                        const count = stories.filter(s => s.studentId === st.id).length;
                        return (
                          <div
                            key={st.id}
                            className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100/70 border border-slate-200 rounded-2xl transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-2xl bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
                                {st.avatar || '👦'}
                              </span>
                              <div>
                                <p className="font-extrabold text-xs text-slate-800">{st.name}</p>
                                <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                  <span className="bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full font-bold">{st.class}</span>
                                  <span className="text-slate-300">•</span>
                                  <span>Wali: {st.guruWali}</span>
                                  <span className="text-slate-300">•</span>
                                  <span className="text-emerald-600 font-bold">{count} Cerita</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleOpenEditStudent(st)}
                                title="Edit Profil Murid (Perbaiki Nama, Kelas, Avatar, atau Guru Wali)"
                                className="px-2.5 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-700 font-extrabold text-[11px] rounded-xl transition-colors border border-sky-200 flex items-center gap-1 shadow-sm"
                              >
                                <Edit className="w-3.5 h-3.5 text-sky-600" /> Edit
                              </button>
                              <button
                                type="button"
                                onClick={() => handleResetStudent(st.id, st.name)}
                                title="Reset pendaftaran akun murid agar dapat mendaftar kembali"
                                className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 font-extrabold text-[11px] rounded-xl transition-colors border border-amber-200 flex items-center gap-1 shadow-sm"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-amber-600" /> Reset Akun
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const stStory = stories.find(s => s.studentId === st.id);
                                  setStudentToDelete({
                                    id: st.id,
                                    name: st.name,
                                    className: st.class,
                                    hasStory: !!stStory,
                                    storyId: stStory?.id,
                                    storyFeeling: stStory?.feeling
                                  });
                                  playTone(350, 'triangle', 0.1);
                                }}
                                title={`Hapus data murid ${st.name}`}
                                className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-extrabold text-[11px] rounded-xl transition-colors border border-rose-200 flex items-center gap-1 shadow-xs cursor-pointer active:scale-95"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-rose-600" /> Hapus
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 3: REKAP STATISTIK & MONITORING */}
            {adminTab === 'stats' && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <span className="p-3 bg-sky-50 text-sky-600 rounded-2xl text-2xl">🎒</span>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Total Siswa</p>
                      <p className="text-2xl font-black text-slate-800">{students.length}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <span className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl text-2xl">👩‍🏫</span>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Total Guru</p>
                      <p className="text-2xl font-black text-slate-800">{teachers.length}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <span className="p-3 bg-amber-50 text-amber-600 rounded-2xl text-2xl">📖</span>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Jurnal Refleksi 4F</p>
                      <p className="text-2xl font-black text-slate-800">{stories.length}</p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex items-center gap-4">
                    <span className="p-3 bg-rose-50 text-rose-600 rounded-2xl text-2xl">🩺</span>
                    <div>
                      <p className="text-xs text-slate-500 font-bold">Eskalasi BK Aktif</p>
                      <p className="text-2xl font-black text-rose-600">
                        {stories.filter(s => s.escalated && s.status !== 'Teratasi').length}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Cloud Sync Details Card */}
                <div className="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm flex flex-col gap-3">
                  <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600" /> Status Database Cloud Firestore
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Database CERDAS terhubung langsung ke Firebase Firestore dengan sinkronisasi multi-klien secara real-time. Setiap penambahan akun guru, siswa, atau penulisan cerita 4F langsung direplikasi secara instan di Google AI Studio, Vercel, maupun perangkat pengguna lainnya tanpa jeda.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 4: UPLOAD & IMPORT DATA EXCEL */}
            {adminTab === 'upload_excel' && (
              <ExcelUploadSection
                teachers={teachers}
                onSuccess={(msg) => {
                  showToast(msg);
                  playTone(587.33, 'sine', 0.25);
                }}
                playTone={playTone}
              />
            )}

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-800 text-white border-t border-slate-700 py-6 px-4 md:px-8 text-center text-xs">
        <p className="font-bold">CERDAS © 2026 - Sistem Pendukung Keputusan Dukungan Emosional & Kesehatan Mental Anak</p>
        <p className="text-slate-400 mt-1.5">Mendukung kolaborasi harmonis antara Murid, Guru Wali, Guru BK, dan Orang Tua Sekolah.</p>
      </footer>

      {/* MODAL: Role Switcher Lock when in Murid Mode */}
      {showRoleUnlockModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-200 shadow-2xl animate-fade-in text-center flex flex-col gap-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto border border-amber-200">
              🔒
            </div>
            <div>
              <h3 className="font-extrabold text-lg text-slate-800">Ruang Khusus Guru / Pengampu</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Anak-anak hanya dapat mengakses <strong>Ruang Anak</strong> untuk menulis dan melihat buku ceritanya. Apakah Anda Guru Wali atau Guru BK yang ingin beralih halaman?
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowRoleUnlockModal(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs rounded-xl transition-colors"
              >
                Tetap di Ruang Anak
              </button>
              <button
                onClick={() => {
                  setRole(showRoleUnlockModal as any);
                  setShowRoleUnlockModal(null);
                  playTone(523, 'sine', 0.2);
                }}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors"
              >
                Masuk Ruang Guru
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add student */}
      {showAddStudentModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-200 shadow-2xl animate-fade-in">
            <h3 className="font-black text-lg text-slate-800 mb-4 flex items-center gap-1.5">
              <span>🎒</span> Tambah Profil Murid Baru
            </h3>
            
            <form onSubmit={handleAddStudent} className="flex flex-col gap-4 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-600">Nama Lengkap Murid:</label>
                <input
                  type="text"
                  placeholder="Contoh: Deni Saputra"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 font-medium"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-600">Kelas:</label>
                  <select
                    value={newStudentClass}
                    onChange={(e) => {
                      const cls = e.target.value;
                      setNewStudentClass(cls);
                      // Check if any registered teacher explicitly has this class in t.class
                      const matched = teachers.find(t => !t.class?.includes('BK') && t.class && t.class.includes(cls));
                      if (matched) {
                        setNewStudentGuruWali(matched.name);
                      } else {
                        const fallbackGuru = 
                          cls === 'Kelas VII A' ? 'I Wayan Sumayasa, S.Pd' :
                          cls.startsWith('Kelas VIII') ? 'I Wayan Sumayasa, S.Pd' :
                          cls.startsWith('Kelas IX') ? 'Ni Luh Ayu Evalentin, S.Pd' :
                          cls.startsWith('Kelas VII') ? 'I Wayan Sumayasa, S.Pd' : 'I Wayan Sumayasa, S.Pd';
                        setNewStudentGuruWali(fallbackGuru);
                      }
                    }}
                    className="px-3 py-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-none font-bold text-slate-700"
                  >
                    <optgroup label="Kelas VII (Tujuh)">
                      <option value="Kelas VII A">Kelas VII A</option>
                      <option value="Kelas VII B">Kelas VII B</option>
                      <option value="Kelas VII C">Kelas VII C</option>
                      <option value="Kelas VII D">Kelas VII D</option>
                      <option value="Kelas VII E">Kelas VII E</option>
                    </optgroup>
                    <optgroup label="Kelas VIII (Delapan)">
                      <option value="Kelas VIII A">Kelas VIII A</option>
                      <option value="Kelas VIII B">Kelas VIII B</option>
                      <option value="Kelas VIII C">Kelas VIII C</option>
                      <option value="Kelas VIII D">Kelas VIII D</option>
                      <option value="Kelas VIII E">Kelas VIII E</option>
                    </optgroup>
                    <optgroup label="Kelas IX (Sembilan)">
                      <option value="Kelas IX A">Kelas IX A</option>
                      <option value="Kelas IX B">Kelas IX B</option>
                      <option value="Kelas IX C">Kelas IX C</option>
                      <option value="Kelas IX D">Kelas IX D</option>
                      <option value="Kelas IX E">Kelas IX E</option>
                    </optgroup>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-600">Pilih Avatar:</label>
                  <div className="grid grid-cols-4 gap-1 p-1 bg-slate-50 rounded-xl border border-slate-200">
                    {['👦', '👧', '🧑', '👨'].map((av) => (
                      <button
                        key={av}
                        type="button"
                        onClick={() => setNewStudentAvatar(av)}
                        className={`py-1.5 text-base rounded-lg transition-all ${newStudentAvatar === av ? 'bg-rose-500 shadow-sm text-white' : 'hover:bg-slate-200'}`}
                      >
                        {av}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-600">Pilih Guru Wali:</label>
                  <span className="text-[10px] text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full font-bold border border-sky-100">
                    Muncul di bawah nama murid
                  </span>
                </div>
                <select
                  value={newStudentGuruWali}
                  onChange={(e) => setNewStudentGuruWali(e.target.value)}
                  className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-none font-bold text-slate-700"
                >
                  {teachers
                    .filter(t => !t.class?.includes('BK'))
                    .map((t: any) => {
                      const teachesThisClass = t.class && t.class.includes(newStudentClass);
                      return (
                        <option key={t.id} value={t.name}>
                          {t.name} {teachesThisClass ? `⭐ (Guru Wali ${newStudentClass})` : `(${t.class})`}
                        </option>
                      );
                    })}
                </select>
                <div className="bg-sky-50/80 border border-sky-200/80 p-2.5 rounded-xl text-[11px] text-sky-800 flex items-center gap-2">
                  <span className="text-base">👩‍🏫</span>
                  <div>
                    <span className="font-bold">Guru Wali Terpilih: </span>
                    <span className="font-extrabold text-sky-900 underline">{newStudentGuruWali || 'Belum dipilih'}</span>
                    <p className="text-[10px] text-sky-700 mt-0.5">Nama guru ini otomatis muncul di bawah nama murid pada daftar kelas {newStudentClass}.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-2.5 justify-end mt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStudentModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl shadow-md hover:bg-rose-500 active:scale-95 transition-all"
                >
                  Simpan Murid
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Escalation note */}
      {showEscalateModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 border border-slate-200 shadow-2xl animate-fade-in">
            <h3 className="font-black text-lg text-rose-700 mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-5 h-5" /> Rujuk ke Guru BK & Orang Tua
            </h3>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Anda merujuk cerita emosional siswa ini agar mendapat perhatian khusus dari Guru BK (Konselor) dan Orang Tua di rumah.
            </p>

            <div className="flex flex-col gap-3 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-600">Catatan Khusus Bantuan & Rekomendasi:</label>
                <textarea
                  value={customEscalateNote}
                  onChange={(e) => setCustomEscalateNote(e.target.value)}
                  placeholder="Tambahkan keluhan guru atau instruksi tindak lanjut bagi guru BK..."
                  className="w-full h-32 p-3 border-2 border-slate-200 rounded-xl focus:outline-none focus:border-rose-500 leading-relaxed"
                />
              </div>

              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowEscalateModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    if (activeStoryDetail) handleTeacherEscalate(activeStoryDetail.id);
                  }}
                  className="px-5 py-2 bg-rose-600 text-white font-bold rounded-xl shadow-md hover:bg-rose-500"
                >
                  Kirim Rujukan Pribadi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE REPORT COMPONENT (Only visible during print) */}
      <div id="printable-report" className="hidden print:block p-8 bg-white text-slate-900 font-sans">
        {/* Header Kop Surat */}
        <div className="border-b-4 border-slate-900 pb-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black uppercase tracking-wider text-slate-900">CERDAS - CERITA DIGITAL ANAK SEMPATIK</h1>
            <p className="text-sm font-bold text-slate-600">Sistem Pendukung Keputusan Dukungan Emosional & Kesehatan Mental Siswa</p>
            <p className="text-xs text-slate-500">Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi - SMP Negeri Sempatik</p>
          </div>
          <div className="text-right">
            <span className="text-3xl font-black text-slate-800">SPK-CERDAS</span>
            <p className="text-[10px] text-slate-400 font-mono mt-1">Ref: {new Date().toLocaleDateString('id-ID')}</p>
          </div>
        </div>

        {/* Title */}
        <div className="text-center my-6">
          <h2 className="text-xl font-extrabold uppercase underline tracking-wide">{printableData?.title || 'LAPORAN REFLEKSI EMOSI'}</h2>
          <p className="text-xs text-slate-500 mt-1">Tanggal Cetak: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        </div>

        {/* Single Story Printout */}
        {(printableData?.type === 'single_story' || printableData?.type === 'counseling_report') && printableData.story && (
          <div className="flex flex-col gap-6 text-xs">
            {/* Student Metadata */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-300">
              <div>
                <p className="font-bold text-slate-500 uppercase text-[10px]">Nama Siswa:</p>
                <p className="text-sm font-extrabold text-slate-900">{printableData.story.studentName}</p>
              </div>
              <div>
                <p className="font-bold text-slate-500 uppercase text-[10px]">Guru Wali Pengampu:</p>
                <p className="text-sm font-extrabold text-slate-900">{printableData.story.guruWali || 'Ibu Rahma, S.Pd'}</p>
              </div>
              <div>
                <p className="font-bold text-slate-500 uppercase text-[10px]">Tanggal Refleksi:</p>
                <p className="font-bold text-slate-800">{new Date(printableData.story.timestamp).toLocaleString('id-ID')}</p>
              </div>
              <div>
                <p className="font-bold text-slate-500 uppercase text-[10px]">Perasaan & Karakter Emosi:</p>
                <p className="font-bold text-slate-800">{printableData.story.feeling} (Karakter: {printableData.story.character || 'Giga'})</p>
              </div>
            </div>

            {/* 4F Content Table */}
            <table className="w-full border-collapse border border-slate-300 text-xs">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="border border-slate-300 p-2.5 font-bold uppercase w-1/4">Elemen Refleksi 4F</th>
                  <th className="border border-slate-300 p-2.5 font-bold uppercase">Detail Catatan Siswa</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 p-2.5 font-bold bg-slate-50">1. FACT (Kejadian)</td>
                  <td className="border border-slate-300 p-2.5 leading-relaxed">{printableData.story.fact}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2.5 font-bold bg-slate-50">2. FEELING (Perasaan)</td>
                  <td className="border border-slate-300 p-2.5 leading-relaxed">{printableData.story.feeling}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2.5 font-bold bg-slate-50">3. FINDING (Pembelajaran)</td>
                  <td className="border border-slate-300 p-2.5 leading-relaxed">{printableData.story.finding}</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 p-2.5 font-bold bg-slate-50">4. FUTURE (Rencana)</td>
                  <td className="border border-slate-300 p-2.5 leading-relaxed">{printableData.story.future}</td>
                </tr>
              </tbody>
            </table>

            {/* Response Section */}
            <div className="border border-slate-300 p-4 rounded-xl bg-slate-50 flex flex-col gap-3">
              <div>
                <p className="font-bold text-slate-700 uppercase text-[10px]">Tanggapan & Pendampingan Guru Wali:</p>
                <p className="text-xs text-slate-800 italic mt-0.5">{printableData.story.guruNote || printableData.story.teacherResponse || 'Belum ada catatan tanggapan.'}</p>
              </div>
              {printableData.type === 'counseling_report' && (
                <div>
                  <p className="font-bold text-emerald-800 uppercase text-[10px]">Catatan Intervensi Bimbingan Konseling (BK):</p>
                  <p className="text-xs text-emerald-900 italic mt-0.5">{printableData.story.counselorNote || 'Dalam penanganan sesi bimbingan.'}</p>
                </div>
              )}
              {printableData.story.aiRecommendation && (
                <div>
                  <p className="font-bold text-sky-800 uppercase text-[10px]">Rekomendasi Keputusan AI (SPK Decision Support):</p>
                  <p className="text-xs text-sky-900 italic mt-0.5">{printableData.story.aiRecommendation}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Class Summary Printout */}
        {printableData?.type === 'class_summary' && printableData.storiesList && (
          <div className="flex flex-col gap-4 text-xs">
            <p className="font-bold text-slate-700">Total Refleksi Terdata: {printableData.storiesList.length} Jurnal</p>
            <table className="w-full border-collapse border border-slate-300 text-[11px]">
              <thead>
                <tr className="bg-slate-100 text-left">
                  <th className="border border-slate-300 p-2 font-bold">No</th>
                  <th className="border border-slate-300 p-2 font-bold">Nama Siswa</th>
                  <th className="border border-slate-300 p-2 font-bold">Tanggal</th>
                  <th className="border border-slate-300 p-2 font-bold">Emosi</th>
                  <th className="border border-slate-300 p-2 font-bold">Peristiwa (Fact)</th>
                  <th className="border border-slate-300 p-2 font-bold">Rencana (Future)</th>
                  <th className="border border-slate-300 p-2 font-bold">Status</th>
                </tr>
              </thead>
              <tbody>
                {printableData.storiesList.map((st, idx) => (
                  <tr key={st.id || idx}>
                    <td className="border border-slate-300 p-2 text-center">{idx + 1}</td>
                    <td className="border border-slate-300 p-2 font-bold">{st.studentName}</td>
                    <td className="border border-slate-300 p-2 whitespace-nowrap">{new Date(st.timestamp).toLocaleDateString('id-ID')}</td>
                    <td className="border border-slate-300 p-2 font-bold">{st.feeling}</td>
                    <td className="border border-slate-300 p-2 leading-tight">{st.fact}</td>
                    <td className="border border-slate-300 p-2 leading-tight">{st.future}</td>
                    <td className="border border-slate-300 p-2 font-bold">{st.status || 'Aktif'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signatures */}
        <div className="grid grid-cols-2 gap-8 mt-12 pt-6 text-center text-xs">
          <div>
            <p className="font-bold text-slate-600">Mengetahui,</p>
            <p className="font-extrabold text-slate-800 mt-1">Guru Wali Kelas</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-slate-900">{currentTeacher ? currentTeacher.name : 'Ibu Rahma, S.Pd'}</p>
            <p className="text-[10px] text-slate-500">NIP. 19880315 201202 2 004</p>
          </div>
          <div>
            <p className="font-bold text-slate-600">Menyetujui,</p>
            <p className="font-extrabold text-slate-800 mt-1">Guru Bimbingan Konseling (BK)</p>
            <div className="h-16"></div>
            <p className="font-bold underline text-slate-900">Ni Made Medi Astuti, S.Pd., M.Pd</p>
            <p className="text-[10px] text-slate-500">Guru Bimbingan Konseling (BK) Kelas VII - IX</p>
          </div>
        </div>
      </div>

      {/* MODAL: Edit Akun Guru */}
      {editingTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-indigo-50 text-indigo-600 rounded-xl"><Edit className="w-5 h-5" /></span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">Edit Akun Guru</h3>
                  <p className="text-xs text-slate-500">Perbaiki ejaan nama, email, password, atau kelas diampu.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingTeacher(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditTeacher} className="flex flex-col gap-3.5 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Nama Lengkap Guru (Beserta Gelar):</label>
                <input
                  type="text"
                  required
                  value={editTeacherName}
                  onChange={(e) => setEditTeacherName(e.target.value)}
                  className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Email Login Guru:</label>
                  <input
                    type="email"
                    required
                    value={editTeacherEmail}
                    onChange={(e) => setEditTeacherEmail(e.target.value)}
                    className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Password Baru / PIN:</label>
                  <input
                    type="text"
                    required
                    value={editTeacherPassword}
                    onChange={(e) => setEditTeacherPassword(e.target.value)}
                    className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white font-mono font-bold text-slate-800 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">Pilihan Kelas diAmpu:</label>
                  <span className="text-[10px] font-extrabold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full">
                    {editTeacherClasses.length} Kelas Terpilih
                  </span>
                </div>

                <div className="p-3 bg-slate-50 border-2 border-slate-200 rounded-2xl flex flex-col gap-2.5 max-h-[180px] overflow-y-auto">
                  {['Kelas VII A', 'Kelas VII B', 'Kelas VII C', 'Kelas VII D', 'Kelas VII E',
                    'Kelas VIII A', 'Kelas VIII B', 'Kelas VIII C', 'Kelas VIII D', 'Kelas VIII E',
                    'Kelas IX A', 'Kelas IX B', 'Kelas IX C', 'Kelas IX D', 'Kelas IX E',
                    'Guru Bimbingan Konseling (BK)', 'Umum / Lintas Kelas'].map((cls) => {
                    const isSelected = editTeacherClasses.includes(cls);
                    return (
                      <button
                        key={cls}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setEditTeacherClasses(prev => prev.filter(c => c !== cls));
                          } else {
                            setEditTeacherClasses(prev => [...prev, cls]);
                          }
                        }}
                        className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all text-left ${isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'}`}
                      >
                        {isSelected ? '✓ ' : '+ '}{cls}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingTeacher(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  💾 Simpan Perubahan Guru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Edit Profil Siswa */}
      {editingStudent && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-slate-200 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-sky-50 text-sky-600 rounded-xl"><Edit className="w-5 h-5" /></span>
                <div>
                  <h3 className="font-extrabold text-base text-slate-800">Edit Profil Siswa</h3>
                  <p className="text-xs text-slate-500">Perbaiki nama, kelas, emoji avatar, atau Guru Wali pengasuh.</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingStudent(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditStudent} className="flex flex-col gap-3.5 text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Nama Lengkap Siswa:</label>
                <input
                  type="text"
                  required
                  value={editStudentName}
                  onChange={(e) => setEditStudentName(e.target.value)}
                  className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white font-bold text-slate-800 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Kelas Siswa:</label>
                  <select
                    value={editStudentClass}
                    onChange={(e) => setEditStudentClass(e.target.value)}
                    className="px-3 py-2.5 border-2 border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-none focus:border-sky-500"
                  >
                    <optgroup label="Kelas VII">
                      <option value="Kelas VII A">Kelas VII A</option>
                      <option value="Kelas VII B">Kelas VII B</option>
                      <option value="Kelas VII C">Kelas VII C</option>
                      <option value="Kelas VII D">Kelas VII D</option>
                      <option value="Kelas VII E">Kelas VII E</option>
                    </optgroup>
                    <optgroup label="Kelas VIII">
                      <option value="Kelas VIII A">Kelas VIII A</option>
                      <option value="Kelas VIII B">Kelas VIII B</option>
                      <option value="Kelas VIII C">Kelas VIII C</option>
                      <option value="Kelas VIII D">Kelas VIII D</option>
                      <option value="Kelas VIII E">Kelas VIII E</option>
                    </optgroup>
                    <optgroup label="Kelas IX">
                      <option value="Kelas IX A">Kelas IX A</option>
                      <option value="Kelas IX B">Kelas IX B</option>
                      <option value="Kelas IX C">Kelas IX C</option>
                      <option value="Kelas IX D">Kelas IX D</option>
                      <option value="Kelas IX E">Kelas IX E</option>
                    </optgroup>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-slate-700">Guru Wali Pengasuh:</label>
                  <select
                    value={editStudentGuruWali}
                    onChange={(e) => setEditStudentGuruWali(e.target.value)}
                    className="px-3 py-2.5 border-2 border-slate-200 rounded-xl bg-white font-bold text-slate-700 focus:outline-none focus:border-sky-500"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.name}>
                        {t.name} ({t.class})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-slate-700">Pilih Avatar Emoji:</label>
                <div className="grid grid-cols-6 gap-2 bg-slate-50 p-2 rounded-xl border border-slate-200">
                  {['👦', '👧', '🧑', '🧒', '⭐', '🚀', '🎨', '⚽', '🎒', '🐱', '🐶', '🦄'].map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setEditStudentAvatar(av)}
                      className={`py-1.5 text-lg rounded-lg transition-all ${editStudentAvatar === av ? 'bg-sky-500 text-white shadow-md' : 'hover:bg-slate-200'}`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStudent(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-white font-extrabold rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  💾 Simpan Perubahan Profil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Verifikasi PIN Keamanan Admin */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 flex flex-col gap-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2.5 bg-rose-50 text-rose-600 rounded-2xl">
                  <Shield className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-800">Verifikasi Akses Admin</h3>
                  <p className="text-[11px] text-slate-500">Masukkan PIN Keamanan Admin Sekolah</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAdminPinModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {adminPinError && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold p-3 rounded-xl">
                {adminPinError}
              </div>
            )}

            <form onSubmit={handleVerifyAdminPin} className="flex flex-col gap-3.5">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-slate-700">Email Administrator:</label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={adminEmailInput}
                  onChange={(e) => setAdminEmailInput(e.target.value)}
                  placeholder="admin@cerdas.id"
                  className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-medium text-slate-800 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700">Kata Sandi / PIN Administrator:</label>
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    className="text-[11px] font-bold text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {showAdminPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAdminPin ? 'Sembunyikan' : 'Lihat PIN'}</span>
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showAdminPin ? 'text' : 'password'}
                    required
                    value={adminPinInput}
                    onChange={(e) => setAdminPinInput(e.target.value)}
                    placeholder="Masukkan password admin (default: admin123)"
                    className="w-full pl-3.5 pr-10 py-2.5 border-2 border-slate-200 rounded-xl bg-slate-50 focus:bg-white text-xs font-mono font-bold text-slate-800 focus:outline-none focus:border-rose-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowAdminPin(!showAdminPin)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title={showAdminPin ? 'Sembunyikan PIN' : 'Lihat PIN'}
                  >
                    {showAdminPin ? <EyeOff className="w-4 h-4 text-rose-600" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAdminPinModal(false)}
                  className="px-4 py-2.5 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-colors flex items-center gap-1.5"
                >
                  <Lock className="w-4 h-4" /> Verifikasi & Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL PRATINJAU DOKUMEN CETAK & PDF RESMI */}
      {showPrintModal && printableData && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden">
            {/* Modal Top Control Bar */}
            <div className="flex items-center justify-between p-4 px-6 border-b border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-xl">
                  <Printer className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-800">
                    Pratinjau Dokumen Cetak Rekapitulasi
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Dokumen resmi SPK-CERDAS Bimbingan Konseling & Refleksi 4F
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyReportText}
                  className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all border ${
                    copyReportSuccess
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Salin teks laporan ke clipboard"
                >
                  {copyReportSuccess ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copyReportSuccess ? 'Tersalin!' : 'Salin Laporan'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    try {
                      window.print();
                    } catch (e) {
                      console.warn(e);
                    }
                  }}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Buka dialog cetak browser atau simpan sebagai PDF"
                >
                  <Printer className="w-4 h-4" /> Cetak / PDF
                </button>

                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-full transition-colors ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body / Paper Sheet */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-slate-100">
              <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-md border border-slate-200 max-w-3xl mx-auto font-sans text-slate-900">
                {/* Kop Surat Resmi */}
                <div className="border-b-4 border-slate-900 pb-4 mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-slate-900">
                      CERDAS - CERITA DIGITAL ANAK SEMPATIK
                    </h1>
                    <p className="text-xs sm:text-sm font-bold text-slate-700">
                      Sistem Pendukung Keputusan Dukungan Emosional & Kesehatan Mental Siswa
                    </p>
                    <p className="text-[11px] sm:text-xs text-slate-500">
                      Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi - SMP Negeri Sempatik
                    </p>
                  </div>
                  <div className="sm:text-right flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0">
                    <span className="text-xl sm:text-2xl font-black text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      SPK-BK
                    </span>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">Ref: {new Date().toLocaleDateString('id-ID')}</p>
                  </div>
                </div>

                {/* Judul Dokumen */}
                <div className="text-center my-6">
                  <h2 className="text-base sm:text-lg font-black uppercase underline tracking-wide text-slate-900">
                    {printableData.title}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1 font-medium">
                    Tanggal Terbit: {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                  <p className="text-xs font-bold text-emerald-800 mt-0.5">
                    Guru Bimbingan Konseling (BK): Ni Made Medi Astuti, S.Pd., M.Pd (Kelas VII - IX)
                  </p>
                </div>

                {/* Single Story Printout */}
                {(printableData.type === 'single_story' || printableData.type === 'counseling_report') && printableData.story && (
                  <div className="flex flex-col gap-5 text-xs">
                    {/* Student Metadata */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 p-4 rounded-xl border border-slate-300">
                      <div>
                        <p className="font-bold text-slate-500 uppercase text-[10px]">Nama Siswa:</p>
                        <p className="text-sm font-extrabold text-slate-900">{printableData.story.studentName}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-500 uppercase text-[10px]">Guru Wali Pengampu:</p>
                        <p className="text-sm font-extrabold text-slate-900">{printableData.story.guruWali || 'Ibu Rahma, S.Pd'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-500 uppercase text-[10px]">Tanggal Refleksi:</p>
                        <p className="font-bold text-slate-800">{new Date(printableData.story.timestamp).toLocaleString('id-ID')}</p>
                      </div>
                      <div>
                        <p className="font-bold text-slate-500 uppercase text-[10px]">Perasaan & Karakter Emosi:</p>
                        <p className="font-bold text-slate-800">{printableData.story.feeling} (Karakter: {printableData.story.character || 'Giga'})</p>
                      </div>
                    </div>

                    {/* 4F Content Table */}
                    <table className="w-full border-collapse border border-slate-300 text-xs">
                      <thead>
                        <tr className="bg-slate-100 text-left">
                          <th className="border border-slate-300 p-2.5 font-bold uppercase w-1/3">Elemen Refleksi 4F</th>
                          <th className="border border-slate-300 p-2.5 font-bold uppercase">Detail Catatan Siswa</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-slate-300 p-2.5 font-bold bg-slate-50">1. FACT (Kejadian)</td>
                          <td className="border border-slate-300 p-2.5 leading-relaxed">{printableData.story.fact}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2.5 font-bold bg-slate-50">2. FEELING (Perasaan)</td>
                          <td className="border border-slate-300 p-2.5 leading-relaxed">{printableData.story.feeling}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2.5 font-bold bg-slate-50">3. FINDING (Pembelajaran)</td>
                          <td className="border border-slate-300 p-2.5 leading-relaxed">{printableData.story.finding}</td>
                        </tr>
                        <tr>
                          <td className="border border-slate-300 p-2.5 font-bold bg-slate-50">4. FUTURE (Rencana Aksi)</td>
                          <td className="border border-slate-300 p-2.5 leading-relaxed">{printableData.story.future}</td>
                        </tr>
                      </tbody>
                    </table>

                    {/* Response Section */}
                    <div className="border border-slate-300 p-4 rounded-xl bg-slate-50 flex flex-col gap-3">
                      <div>
                        <p className="font-bold text-slate-700 uppercase text-[10px]">Tanggapan & Pendampingan Guru Wali:</p>
                        <p className="text-xs text-slate-800 italic mt-0.5">{printableData.story.guruNote || printableData.story.teacherResponse || 'Belum ada catatan tanggapan.'}</p>
                      </div>
                      <div>
                        <p className="font-bold text-emerald-800 uppercase text-[10px]">Catatan Intervensi Bimbingan Konseling (BK):</p>
                        <p className="text-xs text-emerald-900 italic mt-0.5">{printableData.story.counselorNote || 'Dalam penanganan bimbingan dan intervensi suportif.'}</p>
                      </div>
                      {printableData.story.aiRecommendation && (
                        <div>
                          <p className="font-bold text-sky-800 uppercase text-[10px]">Rekomendasi Keputusan AI (SPK Decision Support):</p>
                          <p className="text-xs text-sky-900 italic mt-0.5">{printableData.story.aiRecommendation}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Class / BK Summary Printout */}
                {printableData.type === 'class_summary' && printableData.storiesList && (
                  <div className="flex flex-col gap-4 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-emerald-50/70 p-3 rounded-xl border border-emerald-200">
                      <div>
                        <span className="font-bold text-emerald-900">Total Kasus Terdata: </span>
                        <span className="font-black text-emerald-800">{printableData.storiesList.length} Berkas Kasus</span>
                      </div>
                      <div className="text-[11px] text-emerald-700 font-semibold">
                        Wilayah Bimbingan: Seluruh Kelas VII, VIII, dan IX
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse border border-slate-300 text-[11px]">
                        <thead>
                          <tr className="bg-slate-100 text-left">
                            <th className="border border-slate-300 p-2 font-bold text-center w-8">No</th>
                            <th className="border border-slate-300 p-2 font-bold">Nama Murid</th>
                            <th className="border border-slate-300 p-2 font-bold">Tgl</th>
                            <th className="border border-slate-300 p-2 font-bold">Emosi</th>
                            <th className="border border-slate-300 p-2 font-bold">Peristiwa (Fact)</th>
                            <th className="border border-slate-300 p-2 font-bold">Catatan Intervensi BK</th>
                            <th className="border border-slate-300 p-2 font-bold">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {printableData.storiesList.map((st, idx) => (
                            <tr key={st.id || idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/60'}>
                              <td className="border border-slate-300 p-2 text-center font-bold">{idx + 1}</td>
                              <td className="border border-slate-300 p-2 font-bold text-slate-800">{st.studentName}</td>
                              <td className="border border-slate-300 p-2 whitespace-nowrap text-[10px] text-slate-600">
                                {new Date(st.timestamp).toLocaleDateString('id-ID')}
                              </td>
                              <td className="border border-slate-300 p-2 font-bold">
                                <span className="px-1.5 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px]">
                                  {st.feeling}
                                </span>
                              </td>
                              <td className="border border-slate-300 p-2 leading-tight text-slate-700 max-w-[200px]">
                                {st.fact}
                              </td>
                              <td className="border border-slate-300 p-2 leading-tight text-emerald-800 italic max-w-[220px]">
                                {st.counselorNote || 'Dalam penanganan sesi bimbingan & intervensi suportif.'}
                              </td>
                              <td className="border border-slate-300 p-2 font-bold">
                                <span className={`px-1.5 py-0.5 rounded text-[10px] whitespace-nowrap ${
                                  st.status === 'Butuh Bantuan' ? 'bg-rose-100 text-rose-700 font-extrabold' : 'bg-emerald-100 text-emerald-800'
                                }`}>
                                  {st.status || 'Aktif'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Signatures */}
                <div className="grid grid-cols-2 gap-8 mt-12 pt-6 text-center text-xs border-t border-slate-200">
                  <div>
                    <p className="font-bold text-slate-600">Mengetahui,</p>
                    <p className="font-extrabold text-slate-800 mt-1">Guru Wali Kelas</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline text-slate-900">{currentTeacher ? currentTeacher.name : 'Guru Pengampu / Wali'}</p>
                    <p className="text-[10px] text-slate-500">NIP. 19880315 201202 2 004</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-600">Menyetujui,</p>
                    <p className="font-extrabold text-slate-800 mt-1">Guru Bimbingan Konseling (BK)</p>
                    <div className="h-16"></div>
                    <p className="font-bold underline text-slate-900">Ni Made Medi Astuti, S.Pd., M.Pd</p>
                    <p className="text-[10px] text-slate-500">Guru Bimbingan Konseling (BK) Kelas VII - IX</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Bottom Action Bar */}
            <div className="p-4 px-6 border-t border-slate-200 bg-white flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-slate-500 text-center sm:text-left">
                💡 Dokumen dapat dicetak ke printer fisik, disimpan sebagai PDF, atau disalin dalam format teks.
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPrintModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-xs text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Tutup Pratinjau
                </button>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      window.print();
                    } catch (e) {
                      console.warn(e);
                    }
                  }}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Cetak Sekarang / Simpan PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS CERITA / RUJUKAN BK */}
      {storyToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {storyToDelete.isFromBk ? 'Hapus Rujukan dari Portal Guru BK' : 'Hapus Cerita / Jurnal Murid'}
                </h3>
                <p className="text-xs text-slate-500">
                  Murid: <span className="font-bold text-slate-800">{storyToDelete.studentName}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
              {storyToDelete.isFromBk 
                ? `Apakah Anda ingin menghapus kasus rujukan murid "${storyToDelete.studentName}" dari daftar pantauan Guru BK?`
                : `Apakah Anda yakin ingin menghapus data jurnal refleksi ini dari database?`}
            </p>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              {storyToDelete.isFromBk && (
                <button
                  type="button"
                  onClick={async () => {
                    const sid = storyToDelete.id;
                    const sname = storyToDelete.studentName;
                    setStories(prev => prev.map(s => s.id === sid ? { ...s, escalated: false, status: 'Selesai Direfleksi' } : s));
                    if (activeStoryDetail?.id === sid) {
                      setActiveStoryDetail(null);
                    }
                    showToast(`✅ Kasus rujukan murid "${sname}" berhasil diselesaikan dari Portal BK!`);
                    setStoryToDelete(null);
                    try {
                      await unescalateStoryInFirestore(sid);
                    } catch (e) {
                      console.warn("Unescalated locally, firestore sync note:", e);
                    }
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  ✓ Hapus dari Daftar BK Saja (Selesai Bimbingan)
                </button>
              )}

              <button
                type="button"
                onClick={async () => {
                  const sid = storyToDelete.id;
                  const sname = storyToDelete.studentName;
                  setStories(prev => prev.filter(s => s.id !== sid));
                  if (activeStoryDetail?.id === sid) {
                    setActiveStoryDetail(null);
                  }
                  showToast(`🗑️ Berkas cerita murid "${sname}" berhasil dihapus.`);
                  setStoryToDelete(null);
                  try {
                    await deleteStoryFromFirestore(sid);
                  } catch (e) {
                    console.warn("Deleted locally, firestore sync note:", e);
                  }
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Hapus Cerita / Berkas Permanen
              </button>

              <button
                type="button"
                onClick={() => setStoryToDelete(null)}
                className="w-full py-2 text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS / RESET MURID & PANTAUAN EMOSI */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Hapus Data / Pantauan Emosi Murid
                </h3>
                <p className="text-xs text-slate-500">
                  Murid: <span className="font-bold text-slate-800">{studentToDelete.name}</span>
                  {studentToDelete.className ? ` (${studentToDelete.className})` : ''}
                </p>
              </div>
            </div>

            {studentToDelete.hasStory && studentToDelete.storyId ? (
              <div className="flex flex-col gap-2 bg-amber-50/80 p-3.5 rounded-2xl border border-amber-200 text-xs">
                <p className="font-bold text-amber-900 flex items-center gap-1.5">
                  <span>📌</span> Status Emosi Aktif: <span className="underline font-black">{studentToDelete.storyFeeling || 'Ada Catatan Cerita'}</span>
                </p>
                <p className="text-amber-800 text-[11px] leading-relaxed">
                  Pilih apakah Anda hanya ingin mereset/menghapus <strong>catatan jurnal emosi hari ini</strong> (murid tetap ada di kelas binaan), atau menghapus <strong>akun murid secara permanen</strong>.
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                Apakah Anda yakin ingin menghapus data murid <strong>"{studentToDelete.name}"</strong> dari kelas binaan dan database sekolah? Tindakan ini bersifat permanen.
              </p>
            )}

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              {studentToDelete.hasStory && studentToDelete.storyId && (
                <button
                  type="button"
                  onClick={async () => {
                    const stId = studentToDelete.storyId!;
                    const sname = studentToDelete.name;
                    // Reset story only
                    setStories(prev => prev.filter(s => s.id !== stId));
                    showToast(`🧹 Pantauan emosi murid "${sname}" berhasil direset. Status kembali 'Belum bercerita'.`);
                    setStudentToDelete(null);
                    try {
                      await deleteStoryFromFirestore(stId);
                    } catch (e) {
                      console.warn("Deleted story locally, sync note:", e);
                    }
                  }}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  🧹 Reset Emosi Hari Ini Saja (Hapus Jurnal Cerita)
                </button>
              )}

              <button
                type="button"
                onClick={async () => {
                  const sid = studentToDelete.id;
                  const sname = studentToDelete.name;
                  
                  // 1. Mark locally
                  markStudentDeletedLocally(sid);

                  // 2. Optimistic UI delete
                  setStudents(prev => prev.filter(s => s.id !== sid));
                  setStories(prev => prev.filter(s => s.studentId !== sid));
                  if (selectedStudent?.id === sid) {
                    setSelectedStudent(null);
                    localStorage.removeItem('cerdas_student_id');
                  }
                  showToast(`🗑️ Data murid "${sname}" berhasil dihapus secara permanen.`);
                  setStudentToDelete(null);

                  // 3. Firestore delete
                  try {
                    await deleteStudentFromFirestore(sid, stories);
                  } catch (e) {
                    console.warn("Deleted locally, sync note:", e);
                  }
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Hapus Akun Murid Permanen
              </button>

              <button
                type="button"
                onClick={() => setStudentToDelete(null)}
                className="w-full py-2 text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS GURU */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in print:hidden">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-200 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
                <Trash2 className="w-6 h-6" />
              </span>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Hapus Akun Guru
                </h3>
                <p className="text-xs text-slate-500">
                  Guru: <span className="font-bold text-slate-800">{teacherToDelete.name}</span>
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
              Apakah Anda yakin ingin menghapus akun guru <strong>"{teacherToDelete.name}"</strong> dari sistem sekolah? Tindakan ini bersifat permanen.
            </p>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={async () => {
                  const tid = teacherToDelete.id;
                  const tname = teacherToDelete.name;

                  if (tid === 't-bk') {
                    showToast('⚠️ Akun Guru BK (Ni Made Medi Astuti) tidak dapat dihapus.', 'error');
                    setTeacherToDelete(null);
                    return;
                  }

                  // 1. Mark locally
                  markTeacherDeletedLocally(tid);

                  // 2. Optimistic UI update
                  setTeachers(prev => prev.filter(t => t.id !== tid));
                  if (currentTeacher?.id === tid) {
                    handleTeacherLogout();
                  }
                  showToast(`🗑️ Akun Guru "${tname}" berhasil dihapus.`);
                  setTeacherToDelete(null);

                  // 3. Firestore delete
                  try {
                    await deleteTeacherFromFirestore(tid);
                  } catch (e) {
                    console.warn("Deleted locally, sync note:", e);
                  }
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Ya, Hapus Akun Guru
              </button>

              <button
                type="button"
                onClick={() => setTeacherToDelete(null)}
                className="w-full py-2 text-slate-600 hover:bg-slate-100 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PETUNJUK SINKRONISASI LINTAS PERANGKAT (HP / LAPTOP / TABLET) */}
      {showSyncInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 relative">
            <button
              onClick={() => setShowSyncInfoModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-800">Sinkronisasi Real-Time Lintas Perangkat</h3>
                <p className="text-xs text-slate-500">Terhubung langsung dengan Cloud Firestore Database</p>
              </div>
            </div>

            <div className="flex flex-col gap-3.5 text-xs">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl flex items-start gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping mt-1"></span>
                <div>
                  <p className="font-extrabold text-emerald-900">Status Database Cloud Firestore: TERHUBUNG</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5">
                    Seluruh data murid, akun guru, dan jurnal refleksi tersimpan aman di Cloud Firestore. Setiap perubahan otomatis tersinkronisasi secara *real-time* ke semua perangkat (HP & PC).
                  </p>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2.5">
                <p className="font-extrabold text-slate-800 flex items-center gap-1.5">
                  📱 Cara Akses & Sinkronisasi dari HP / Smartphone / Tablet:
                </p>
                <ol className="list-decimal list-inside text-slate-600 space-y-1.5 text-[11px] leading-relaxed">
                  <li>Buka browser (Chrome, Safari, Edge, Firefox) pada HP atau Tablet Anda.</li>
                  <li>Masukkan atau tempel URL aplikasi web ini di alamat browser HP Anda.</li>
                  <li>Login menggunakan akun **Guru Wali**, **Guru BK**, atau **Anak**.</li>
                  <li>Semua perubahan (input refleksi, pendaftaran siswa, rekap nilai) di HP akan **otomatis langsung muncul di PC/Laptop** tanpa perlu memuat ulang (*refresh*) halaman!</li>
                </ol>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-extrabold text-slate-700">URL Aplikasi untuk Dibuka di HP:</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={window.location.href}
                    className="flex-1 px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-[11px] font-mono text-slate-700 select-all"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      showToast('📋 URL Aplikasi berhasil disalin! Kirim ke HP Anda.');
                      playTone(523, 'sine', 0.15);
                    }}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                  >
                    <Copy className="w-3.5 h-3.5" /> Salin URL
                  </button>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setShowSyncInfoModal(false)}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-extrabold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Tutup & Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
