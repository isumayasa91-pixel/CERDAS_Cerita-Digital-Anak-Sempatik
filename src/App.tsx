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
  Trash2
} from 'lucide-react';

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
  const [role, setRole] = useState<'murid' | 'guru_wali' | 'guru_bk'>('murid');
  const [students, setStudents] = useState<any[]>([]);
  const [stories, setStories] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  
  // Murid state variables
  const [activeTab, setActiveTab] = useState<'profile' | 'history' | 'story_builder'>('profile');
  const [step, setStep] = useState(1); // 1 to 4 (Fact, Feeling, Finding, Future), 5 is Review/Success
  const [factText, setFactText] = useState('');
  const [selectedFeeling, setSelectedFeeling] = useState<string>('Gembira');
  const [findingText, setFindingText] = useState('');
  const [futureText, setFutureText] = useState('');
  const [recordedAudio, setRecordedAudio] = useState<string>(''); // base64
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successConfetti, setSuccessConfetti] = useState(false);

  // Audio Recording States
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
  const [activeStoryDetail, setActiveStoryDetail] = useState<any | null>(null);
  const [teacherReplyText, setTeacherReplyText] = useState('');
  const [customEscalateNote, setCustomEscalateNote] = useState('');
  const [showEscalateModal, setShowEscalateModal] = useState(false);
  const [activeGuruWaliFilter, setActiveGuruWaliFilter] = useState<string>('Semua');

  // Guru BK & Orang Tua dashboard state
  const [bkSearch, setBkSearch] = useState('');
  const [counselorActionNote, setCounselorActionNote] = useState('');

  // Form for adding student
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('Kelas VII A');
  const [newStudentAvatar, setNewStudentAvatar] = useState('👦');
  const [newStudentGuruWali, setNewStudentGuruWali] = useState('Ibu Rahma, S.Pd');

  // Teacher Authentication States
  const [currentTeacher, setCurrentTeacher] = useState<any>(() => {
    const saved = localStorage.getItem('currentTeacher');
    return saved ? JSON.parse(saved) : null;
  });
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
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
  const [parentChildInput, setParentChildInput] = useState('');
  const [bkAuthError, setBkAuthError] = useState('');

  // Load Initial Data
  const loadData = async () => {
    try {
      const resStudents = await fetch('/api/students');
      const dataStudents = await resStudents.json();
      setStudents(dataStudents);

      const resStories = await fetch('/api/stories');
      const dataStories = await resStories.json();
      setStories(dataStories);

      const resTeachers = await fetch('/api/teachers');
      const dataTeachers = await resTeachers.json();
      setTeachers(dataTeachers);
      if (dataTeachers.length > 0) {
        setNewStudentGuruWali(dataTeachers[0].name);
      }
      
      // Select first student as default if none selected
      if (dataStudents.length > 0 && !selectedStudent) {
        setSelectedStudent(dataStudents[0]);
      }
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    loadData();
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
    const freqs = [261.63, 329.63, 392.00, 523.25, 659.25]; // C, E, G, C5, E5
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

  // Submit story handler
  const handleStorySubmit = async () => {
    if (!factText.trim() || !findingText.trim() || !futureText.trim()) {
      alert("Harap isi seluruh refleksi 4F dengan lengkap!");
      return;
    }

    setIsSubmitting(true);
    const activeChar = CHARACTERS.find(c => c.emotion === selectedFeeling);

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          studentName: selectedStudent.name,
          fact: factText,
          feeling: selectedFeeling,
          character: activeChar?.id || 'Giga',
          finding: findingText,
          future: futureText,
          audioBase64: recordedAudio
        })
      });

      if (!response.ok) {
        throw new Error("Gagal mengirim cerita");
      }

      const newStory = await response.json();
      
      // Update local states
      setStories(prev => [newStory, ...prev]);
      
      // Play celebratory sound
      playTone(523.25, 'sine', 0.1);
      setTimeout(() => playTone(659.25, 'sine', 0.1), 100);
      setTimeout(() => playTone(783.99, 'sine', 0.15), 200);
      setTimeout(() => playTone(1046.50, 'sine', 0.3), 300);

      setSuccessConfetti(true);
      setStep(5); // Go to success page

      // Reset fields
      setFactText('');
      setFindingText('');
      setFutureText('');
      setRecordedAudio('');
    } catch (err) {
      alert("Terjadi kesalahan saat mengirim cerita. Silakan coba kembali.");
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Teacher reply submit handler
  const handleTeacherReplySubmit = async (storyId: string) => {
    if (!teacherReplyText.trim()) {
      alert("Tanggapan guru tidak boleh kosong!");
      return;
    }

    try {
      const res = await fetch(`/api/stories/${storyId}/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teacherResponse: teacherReplyText })
      });
      const updatedStory = await res.json();
      
      setStories(prev => prev.map(s => s.id === storyId ? updatedStory : s));
      setActiveStoryDetail(updatedStory);
      setTeacherReplyText('');
      playTone(523.25, 'sine', 0.2);
    } catch (err) {
      console.error(err);
    }
  };

  // Teacher manual escalation submit
  const handleTeacherEscalate = async (storyId: string) => {
    try {
      const res = await fetch(`/api/stories/${storyId}/escalate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counselorNote: customEscalateNote })
      });
      const updatedStory = await res.json();

      setStories(prev => prev.map(s => s.id === storyId ? updatedStory : s));
      setActiveStoryDetail(updatedStory);
      setShowEscalateModal(false);
      setCustomEscalateNote('');
      playTone(392, 'triangle', 0.3);
    } catch (err) {
      console.error(err);
    }
  };

  // Counselor logs session action note
  const handleCounselorNoteSubmit = async (storyId: string) => {
    if (!counselorActionNote.trim()) {
      alert("Catatan penanganan BK tidak boleh kosong!");
      return;
    }

    try {
      const res = await fetch(`/api/stories/${storyId}/bk-note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ counselorNote: counselorActionNote })
      });
      const updatedStory = await res.json();

      setStories(prev => prev.map(s => s.id === storyId ? updatedStory : s));
      setActiveStoryDetail(updatedStory);
      setCounselorActionNote('');
      playTone(523.25, 'sine', 0.2);
    } catch (err) {
      console.error(err);
    }
  };

  // Mark story issue as resolved
  const handleResolveStory = async (storyId: string) => {
    try {
      const res = await fetch(`/api/stories/${storyId}/resolve`, {
        method: 'POST'
      });
      const updatedStory = await res.json();

      setStories(prev => prev.map(s => s.id === storyId ? updatedStory : s));
      setActiveStoryDetail(updatedStory);
      playTone(659.25, 'sine', 0.2);
    } catch (err) {
      console.error(err);
    }
  };

  // Add new student
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newStudentName,
          className: newStudentClass,
          avatar: newStudentAvatar,
          guruWali: newStudentGuruWali
        })
      });
      const newStud = await res.json();
      setStudents(prev => [...prev, newStud]);
      setSelectedStudent(newStud);
      setNewStudentName('');
      setShowAddStudentModal(false);
      playTone(523.25, 'sine', 0.15);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete student and their story history
  const handleDeleteStudent = async (studentId: string, name: string) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus siswa "${name}" beserta seluruh riwayat ceritanya?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/students/${studentId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setStudents(prev => prev.filter(st => st.id !== studentId));
        setStories(prev => prev.filter(s => s.studentId !== studentId));
        if (selectedStudent?.id === studentId) {
          setSelectedStudent(null);
        }
        playTone(220, 'triangle', 0.2);
      } else {
        alert("Gagal menghapus siswa.");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan.");
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
      const res = await fetch('/api/teachers/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authEmail, password: authPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCurrentTeacher(data.teacher);
        localStorage.setItem('currentTeacher', JSON.stringify(data.teacher));
        setActiveGuruWaliFilter(data.teacher.name);
        setAuthEmail('');
        setAuthPassword('');
        playTone(523.25, 'sine', 0.15);
      } else {
        setAuthError(data.error || 'Email atau password salah');
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
      const res = await fetch('/api/teachers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: authName,
          email: authEmail,
          password: authPassword,
          className: authClass
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Auto login after register
        setCurrentTeacher(data.teacher);
        localStorage.setItem('currentTeacher', JSON.stringify(data.teacher));
        setActiveGuruWaliFilter(data.teacher.name);
        setAuthName('');
        setAuthEmail('');
        setAuthPassword('');
        setAuthMode('login');
        playTone(523.25, 'sine', 0.15);
        // Refresh dynamic list of teachers immediately
        loadData();
      } else {
        setAuthError(data.error || 'Pendaftaran gagal');
      }
    } catch (err) {
      console.error(err);
      setAuthError('Gagal mendaftar. Silakan coba kembali.');
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
      setBkAuthError('Siswa tidak terdaftar. Masukkan nama lengkap siswa yang sesuai.');
    }
  };

  // Handle BK/Ortu Logout
  const handleBkOrtuLogout = () => {
    setCurrentBkUser(null);
    localStorage.removeItem('currentBkUser');
    playTone(220, 'sine', 0.1);
  };

  // Filtered lists for the active teacher (Guru Wali)
  const teacherStudents = students.filter(st => activeGuruWaliFilter === 'Semua' || st.guruWali === activeGuruWaliFilter);
  const teacherStories = stories.filter(story => {
    const student = students.find(st => st.id === story.studentId);
    return activeGuruWaliFilter === 'Semua' || (student && student.guruWali === activeGuruWaliFilter);
  });

  // Student specific history
  const studentStories = stories.filter(s => s.studentId === selectedStudent?.id);

  // Statistics Calculation
  const latestStoriesCount = teacherStories.length;
  const moodCounts = teacherStories.reduce((acc: any, curr) => {
    acc[curr.feeling] = (acc[curr.feeling] || 0) + 1;
    return acc;
  }, {});

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
        <nav className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl max-w-md w-auto">
          <button 
            onClick={() => { setRole('murid'); playTone(300, 'sine', 0.1); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${role === 'murid' ? 'bg-white text-sky-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🎒 <span className="hidden sm:inline">Ruang</span> Anak
          </button>
          <button 
            onClick={() => { setRole('guru_wali'); playTone(350, 'sine', 0.1); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${role === 'guru_wali' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            👩‍🏫 <span className="hidden sm:inline">Ruang</span> Guru Wali
          </button>
          <button 
            onClick={() => { setRole('guru_bk'); playTone(400, 'sine', 0.1); }}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${role === 'guru_bk' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
          >
            🩺 <span className="hidden sm:inline">Ruang</span> BK & Ortu
          </button>
        </nav>

        {/* Zone 3: Active Profile Indicator */}
        <div className="flex items-center gap-2">
          {role === 'murid' && selectedStudent ? (
            <div className="flex items-center gap-2 bg-sky-50 px-3 py-1 rounded-full border border-sky-100">
              <span className="text-lg">{selectedStudent.avatar}</span>
              <span className="text-xs font-bold text-sky-700 truncate max-w-[100px]">{selectedStudent.name.split(' ')[0]}</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-bold text-slate-700">
                {role === 'guru_wali' ? 'Guru Wali Kelas' : 'Guru BK'}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Primary Workspace Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col gap-6">
        
        {/* ==================================================================== */}
        {/* ROLE: MURID (ANAK-ANAK)                                             */}
        {/* ==================================================================== */}
        {role === 'murid' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* Sidebar: Student Profile Selector & Fast Actions */}
            <div className="lg:col-span-3 flex flex-col gap-4">
              <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1">
                  <span>👤</span> Pilih Akun Anak
                </h3>
                <div className="flex flex-col gap-1.5 max-h-[220px] overflow-y-auto pr-1">
                  {students.map((st) => (
                    <div
                      key={st.id}
                      className={`flex items-center justify-between gap-1 w-full p-1.5 rounded-xl transition-all border ${selectedStudent?.id === st.id ? 'bg-sky-500 border-sky-500 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedStudent(st);
                          setActiveTab('profile');
                          setStep(1);
                          playTone(329.63, 'sine', 0.1);
                        }}
                        className="flex items-center gap-3 flex-1 text-left focus:outline-none"
                      >
                        <span className="text-2xl bg-white/20 p-1.5 rounded-lg">{st.avatar}</span>
                        <div className="truncate">
                          <p className="font-bold text-sm leading-tight">{st.name}</p>
                          <p className={`text-[10px] ${selectedStudent?.id === st.id ? 'text-white/85' : 'text-slate-500'}`}>
                            {st.class} · Wali: {st.guruWali ? st.guruWali.split(',')[0] : 'Umum'}
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteStudent(st.id, st.name);
                        }}
                        className={`p-2 rounded-lg transition-colors focus:outline-none ${selectedStudent?.id === st.id ? 'text-sky-100 hover:text-white hover:bg-white/15' : 'text-slate-400 hover:text-sky-600 hover:bg-sky-50'}`}
                        title="Hapus Siswa"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setShowAddStudentModal(true)}
                  className="mt-3 flex items-center justify-center gap-1.5 w-full py-2 border-2 border-dashed border-sky-300 rounded-xl text-sky-600 font-bold text-xs hover:bg-sky-50 transition-colors"
                >
                  <Plus className="w-4 h-4" /> Tambah Murid Baru
                </button>
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
                            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2 text-slate-900">Halo, {selectedStudent.name}! 👋</h2>
                            <p className="text-slate-800 text-sm md:text-base max-w-xl font-semibold leading-relaxed">
                              Selamat datang di Ruang CERDAS! Hari ini adalah hari baru yang penuh petualangan. Karakter emosi lucumu sudah siap mendengarkan rahasia atau ceritamu hari ini lho!
                            </p>
                            <button
                              onClick={() => { setActiveTab('story_builder'); setStep(1); playTone(523.25, 'sine', 0.2); }}
                              className="mt-4 px-6 py-2.5 bg-sky-600 text-white font-extrabold text-sm rounded-full shadow-lg shadow-sky-700/20 hover:scale-105 transition-transform flex items-center gap-2 mx-auto md:mx-0"
                            >
                              🚀 Tulis Cerita Pertamaku Hari Ini!
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Fresh Notification / Inbox from Teacher */}
                      {studentStories.some(s => s.teacherResponse) && (
                        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 shadow-sm">
                          <h3 className="text-amber-800 font-extrabold text-sm flex items-center gap-2 mb-3">
                            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-300 animate-pulse" /> 
                            KOTAK PESAN BAHAGIA (Tanggapan dari Wali Kelas)
                          </h3>
                          <div className="flex flex-col gap-3">
                            {studentStories.filter(s => s.teacherResponse).slice(0, 2).map((s) => (
                              <div key={s.id} className="bg-white border border-amber-100 p-4 rounded-xl shadow-sm flex flex-col gap-2">
                                <div className="flex items-center justify-between text-xs text-slate-500">
                                  <span className="font-bold flex items-center gap-1">
                                    <span>{CHARACTERS.find(c => c.id === s.character)?.svg ? '⭐' : '📝'}</span> 
                                    Cerita hari {new Date(s.timestamp).toLocaleDateString('id-ID', { weekday: 'long' })}
                                  </span>
                                  <span>{new Date(s.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                                </div>
                                <p className="text-xs text-slate-600 line-clamp-1 italic">"{s.fact}"</p>
                                <div className="bg-amber-50/50 rounded-lg p-3 border-l-4 border-amber-400">
                                  <p className="text-xs text-amber-900 font-semibold mb-1 flex items-center gap-1">
                                    👩‍🏫 Ibu Wali Kelas berkata:
                                  </p>
                                  <p className="text-xs text-amber-800 leading-relaxed italic">"{s.teacherResponse}"</p>
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
                      
                      {/* Step Progress Header */}
                      <div className="bg-sky-50 border-b border-sky-100 px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          <div className="bg-sky-500 text-white w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs">
                            {step < 5 ? step : '✓'}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-sky-500 uppercase tracking-wider">Langkah {step} dari 4</p>
                            <h3 className="font-extrabold text-slate-800 text-base">
                              {step === 1 && "F - FACT (Kejadian Hari Ini)"}
                              {step === 2 && "F - FEELING (Perasaan Hatiku)"}
                              {step === 3 && "F - FINDING (Belajar Hal Hebat)"}
                              {step === 4 && "F - FUTURE (Rencana Hebat Besok)"}
                              {step === 5 && "Hore! Cerita Dikirim!"}
                            </h3>
                          </div>
                        </div>

                        {/* Visual Dots */}
                        {step < 5 && (
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4].map((sNum) => (
                              <div
                                key={sNum}
                                className={`h-2.5 rounded-full transition-all ${step === sNum ? 'w-8 bg-sky-500' : 'w-2.5 bg-sky-200'}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>

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
                                  "Hai! Aku <strong>Giga</strong>. Kejadian seru, membingungkan, atau menyedihkan apa yang kamu alami hari ini? Tuliskan di kotak atau klik perekam suara ya!"
                                </p>
                              </div>
                            </div>

                            <div className="md:w-2/3 w-full flex flex-col gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-600">Kejadian Hari Ini (Tulis di sini):</label>
                                <textarea
                                  value={factText}
                                  onChange={(e) => setFactText(e.target.value)}
                                  placeholder="Contoh: Tadi siang aku senang sekali mendapat nilai bagus di tugas IPA, tapi sorenya aku kesal karena sepedaku bannya bocor..."
                                  className="w-full h-32 p-4 text-sm border-2 border-slate-200 rounded-2xl focus:border-sky-500 focus:outline-none transition-all leading-relaxed"
                                />
                              </div>

                              {/* Voice Recorder Block */}
                              <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-2">
                                    <span className="p-1.5 bg-sky-100 rounded-lg text-sky-600">
                                      <Mic className="w-4 h-4" />
                                    </span>
                                    <span className="text-xs font-bold text-slate-700">Atau Gunakan Perekam Suara:</span>
                                  </div>
                                  {isRecording && (
                                    <span className="text-xs font-extrabold text-sky-600 animate-pulse flex items-center gap-1.5">
                                      <span className="w-2.5 h-2.5 bg-sky-600 rounded-full"></span>
                                      Perekam Aktif: {Math.floor(recordingSeconds / 60)}:{(recordingSeconds % 60).toString().padStart(2, '0')}
                                    </span>
                                  )}
                                </div>

                                <div className="flex items-center gap-3">
                                  {!isRecording ? (
                                    <button
                                      type="button"
                                      onClick={startRecording}
                                      className="flex items-center gap-1.5 px-4 py-2.5 bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-sky-400 active:scale-95 transition-all"
                                    >
                                      🎤 Mulai Rekam
                                    </button>
                                  ) : (
                                    <>
                                      <button
                                        type="button"
                                        onClick={stopRecording}
                                        className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-slate-700 active:scale-95 transition-all"
                                      >
                                        <Square className="w-4 h-4" /> Selesai & Simpan
                                      </button>
                                      <button
                                        type="button"
                                        onClick={cancelRecording}
                                        className="px-3 py-2.5 border border-slate-300 text-slate-600 font-bold text-xs rounded-xl hover:bg-slate-100 transition-colors"
                                      >
                                        Batal
                                      </button>
                                    </>
                                  )}

                                  {recordedAudio && !isRecording && (
                                    <div className="flex-1 flex items-center justify-between bg-white border border-sky-100 p-2 rounded-xl">
                                      <span className="text-xs font-bold text-sky-700 flex items-center gap-1">
                                        📻 Rekaman Suaramu Siap!
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handlePlayAudio('review', recordedAudio)}
                                        className="p-1.5 bg-sky-50 rounded-lg text-sky-600 hover:bg-sky-100 transition-colors"
                                      >
                                        {playingId === 'review' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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
                          <div className="flex flex-col gap-6 animate-fade-in items-center w-full">
                            <h4 className="text-center text-sm font-bold text-slate-600">Ketuk Karakter yang mewakili perasaanmu hari ini:</h4>
                            
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
                                    <div className="w-20 h-20 flex items-center justify-center">
                                      {char.svg}
                                    </div>
                                    <div>
                                      <p className="font-extrabold text-xs text-slate-800 leading-tight">{char.name.split(' ')[0]}</p>
                                      <p className={`text-[10px] font-bold ${char.textColor}`}>{char.emotion}</p>
                                    </div>
                                    {isSelected && (
                                      <span className="absolute top-2 right-2 bg-sky-500 text-white p-0.5 rounded-full text-[10px] w-4 h-4 flex items-center justify-center">✓</span>
                                    )}
                                  </button>
                                );
                              })}
                            </div>

                            {/* Dialogue bubble for active character */}
                            <div className={`w-full max-w-2xl border-2 ${currentCharacter.borderColor} ${currentCharacter.bgColor} rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4 mt-2 shadow-sm`}>
                              <div className="shrink-0 w-16 h-16 flex items-center justify-center bg-white rounded-full p-1 shadow-sm">
                                {React.cloneElement(currentCharacter.svg, { className: 'w-12 h-12' })}
                              </div>
                              <div className="text-center sm:text-left">
                                <p className="text-xs font-bold text-slate-800">Pesan dari {currentCharacter.name.split(' ')[0]}:</p>
                                <p className={`text-xs font-medium italic mt-1 leading-relaxed ${currentCharacter.textColor}`}>
                                  "{currentCharacter.quote}"
                                </p>
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
                                  "Hebat! Kita sudah tahu kejadian dan perasaanmu. Sekarang, mari cari <strong>Pembelajaran</strong> atau sisi baik yang didapat dari peristiwa tadi!"
                                </p>
                              </div>
                            </div>

                            <div className="md:w-2/3 w-full flex flex-col gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-600">Pelajaran Berharga Hari Ini (Tulis di sini):</label>
                                <textarea
                                  value={findingText}
                                  onChange={(e) => setFindingText(e.target.value)}
                                  placeholder="Contoh: Aku jadi tahu kalau tidak paham matematika harus berani angkat tangan dan bertanya. Atau, aku sadar merebut mainan itu membuat temanku sedih..."
                                  className="w-full h-32 p-4 text-sm border-2 border-slate-200 rounded-2xl focus:border-rose-500 focus:outline-none transition-all leading-relaxed"
                                />
                              </div>

                              <div>
                                <p className="text-[10px] font-bold text-slate-500 mb-1.5">💡 Ketuk Ide Pembelajaran Cepat:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    'Aku belajar harus lebih sabar mengantre.',
                                    'Aku belajar bahwa jujur itu melegakan hati.',
                                    'Aku perlu berlatih lebih giat lagi.',
                                    'Aku tahu bahwa berbagi itu menyenangkan.',
                                    'Aku menyadari semua makhluk hidup pasti berpisah.',
                                    'Aku bersyukur mempunyai orang tua yang sayang padaku.'
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
                            </div>
                          </div>
                        )}

                        {/* STEP 4: FUTURE */}
                        {step === 4 && (
                          <div className="flex flex-col md:flex-row gap-6 items-center flex-1 animate-fade-in">
                            <div className="md:w-1/3 flex flex-col items-center text-center">
                              <div className={`p-4 rounded-3xl shadow-md border-2 ${currentCharacter.borderColor} ${currentCharacter.bgColor}`}>
                                {React.cloneElement(currentCharacter.svg, { className: 'w-24 h-24' })}
                              </div>
                              <div className={`border rounded-2xl p-3.5 mt-4 max-w-xs relative ${currentCharacter.borderColor} ${currentCharacter.bgColor}`}>
                                <p className={`text-xs font-bold leading-relaxed ${currentCharacter.textColor}`}>
                                  "Langkah terakhir, teman cerdas! Apa <strong>Rencana Tindak Lanjut</strong> atau langkah seru yang akan kamu lakukan besok/selanjutnya?"
                                </p>
                              </div>
                            </div>

                             <div className="md:w-2/3 w-full flex flex-col gap-4">
                              <div className="flex flex-col gap-1">
                                <label className="text-xs font-bold text-slate-600">Rencanaku Selanjutnya (Tulis di sini):</label>
                                <textarea
                                  value={futureText}
                                  onChange={(e) => setFutureText(e.target.value)}
                                  placeholder="Contoh: Besok aku mau minta maaf ke Andi, atau malam ini aku mau belajar perkalian desimal bersama Kakak..."
                                  className="w-full h-32 p-4 text-sm border-2 border-slate-200 rounded-2xl focus:border-sky-500 focus:outline-none transition-all leading-relaxed"
                                />
                              </div>

                              <div>
                                <p className="text-[10px] font-bold text-slate-500 mb-1.5">🚀 Ketuk Ide Rencana Cepat:</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {[
                                    'Besok aku akan meminta maaf kepada temanku.',
                                    'Malam ini aku mau tidur lebih cepat agar tidak kesiangan.',
                                    'Aku akan belajar kembali bersama Ibu malam ini.',
                                    'Aku mau mengajak temanku bermain lego bersama besok.',
                                    'Aku akan mendoakan kucing kesayanganku setiap malam.',
                                    'Aku ingin berbicara santai dengan Ibu guru besok pagi.'
                                  ].map((chip) => (
                                    <button
                                      key={chip}
                                      type="button"
                                      onClick={() => {
                                        setFutureText(prev => prev ? prev + ' ' + chip : chip);
                                        playTone(440, 'sine', 0.05);
                                      }}
                                      className="px-2.5 py-1.5 bg-slate-100 hover:bg-sky-50 hover:text-sky-600 text-slate-600 border border-slate-200 hover:border-sky-300 rounded-lg text-[10px] font-bold transition-all"
                                    >
                                      + {chip}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Navigation controls within Wizard */}
                        {step < 5 && (
                          <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-6">
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
                              className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all ${step === 1 ? 'text-slate-300 bg-slate-50 cursor-not-allowed' : 'text-slate-600 bg-slate-100 hover:bg-slate-200'}`}
                            >
                              <ArrowLeft className="w-4 h-4" /> Kembali
                            </button>

                            {step < 4 ? (
                              <button
                                type="button"
                                onClick={() => {
                                  const s = step + 1;
                                  setStep(s);
                                  playStepSound(s);
                                }}
                                className="px-5 py-2.5 bg-sky-500 text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-sky-400 active:scale-95 transition-all flex items-center gap-1.5"
                              >
                                Lanjut <ArrowRight className="w-4 h-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={handleStorySubmit}
                                disabled={isSubmitting}
                                className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-yellow-400 text-slate-900 font-extrabold text-xs rounded-xl shadow-md hover:opacity-95 active:scale-95 transition-all flex items-center gap-1.5"
                              >
                                {isSubmitting ? (
                                  <>
                                    <span className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></span>
                                    Mengirim Cerita...
                                  </>
                                ) : (
                                  <>
                                    <Send className="w-4 h-4" /> Kirim Cerita Indahku
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                        )}

                        {/* STEP 5: SUCCESS PAGE */}
                        {step === 5 && (
                          <div className="flex flex-col items-center justify-center text-center py-12 animate-fade-in">
                            <div className="w-24 h-24 bg-sky-100 rounded-full flex items-center justify-center text-5xl mb-4 animate-bounce">
                              🎉
                            </div>
                            <h3 className="text-xl font-extrabold text-sky-600 mb-2">Hebat Sekali, {selectedStudent.name}!</h3>
                            <p className="text-sm text-slate-600 max-w-md leading-relaxed mb-6">
                              Cerita indahmu sudah terkirim ke <strong>Ibu/Bapak Guru Wali Kelas</strong>. Kamu berani mengekspresikan hatimu, itu tanda anak pintar!
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
                          <span>📕</span> Buku Diary Digital Ceritaku
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

                                {/* Teacher Response Badge */}
                                <div className="p-3 border-t border-slate-100 bg-slate-50/50">
                                  {story.teacherResponse ? (
                                    <div className="bg-amber-50 border border-amber-200 p-2.5 rounded-xl">
                                      <p className="text-[10px] font-extrabold text-amber-800 flex items-center gap-1">
                                        👩‍🏫 Tanggapan Wali Kelas:
                                      </p>
                                      <p className="text-[10px] font-medium text-amber-700 italic mt-0.5 leading-normal">
                                        "{story.teacherResponse}"
                                      </p>
                                    </div>
                                  ) : (
                                    <div className="flex items-center justify-between text-slate-400">
                                      <span className="text-[10px] font-bold italic flex items-center gap-1">
                                        ⏱️ Menunggu dibaca Guru Wali
                                      </span>
                                      {story.status === 'Butuh Bantuan' && (
                                        <span className="text-[9px] font-bold bg-sky-100 text-sky-700 px-2 py-0.5 rounded-full">
                                          BK Terhubung
                                        </span>
                                      )}
                                    </div>
                                  )}
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
              <h3 className="text-xl font-extrabold text-slate-800">Ruang Guru Wali Kelas</h3>
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
                    placeholder="Contoh: Bapak I Sumayasa, M.Pd"
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
                <label className="text-xs font-bold text-slate-600">Kata Sandi:</label>
                <input
                  type="password"
                  required
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white text-xs font-medium focus:outline-none focus:border-sky-500"
                />
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

            <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4 flex items-center justify-center gap-1.5">
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
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap">Filter:</span>
                  <select
                    value={activeGuruWaliFilter}
                    onChange={(e) => {
                      setActiveGuruWaliFilter(e.target.value);
                      setActiveStoryDetail(null);
                      playTone(440, 'sine', 0.1);
                    }}
                    className="px-3.5 py-2 border-2 border-slate-200 rounded-xl bg-white text-xs font-bold text-slate-700 focus:outline-none focus:border-sky-500"
                  >
                    <option value="Semua">Semua Guru Wali (Administrator)</option>
                    <option value={currentTeacher.name}>{currentTeacher.name} (Asuhan Anda)</option>
                    <option value="Ibu Rahma, S.Pd">Ibu Rahma, S.Pd (Kelas VII)</option>
                    <option value="Bapak I Sumayasa, M.Pd">Bapak I Sumayasa, M.Pd (Kelas VIII)</option>
                    <option value="Bapak Deni Saputra, S.Pd">Bapak Deni Saputra, S.Pd (Kelas IX)</option>
                    <option value="Ibu Sri Wahyuni, S.Pd">Ibu Sri Wahyuni, S.Pd (Umum)</option>
                  </select>
                </div>
                <button
                  onClick={handleTeacherLogout}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors whitespace-nowrap"
                >
                  Keluar 🚪
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT COLUMN: Class statistics & Student Mood Rings */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              
              {/* Stats Overview */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-indigo-500" /> Dashboard Kelas 4A & 4B
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
                <div>
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-2">Sebaran Emosi Murid saat ini:</h4>
                  <div className="flex flex-col gap-2">
                    {CHARACTERS.map((char) => {
                      const count = moodCounts[char.emotion] || 0;
                      const percentage = latestStoriesCount > 0 ? (count / latestStoriesCount) * 100 : 0;
                      return (
                        <div key={char.id} className="flex items-center gap-2 text-xs">
                          <span className="w-16 font-bold text-slate-600 truncate">{char.emotion}</span>
                          <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${char.color} transition-all`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="w-6 font-bold text-slate-500 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Mood Ring of Classroom Roster */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-1.5">
                  <span>🎯</span> Pantauan Emosi Harian Murid
                </h3>
                <div className="flex flex-col gap-2">
                  {teacherStudents.map((st) => {
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
                            <p className="text-[10px] text-slate-500">{st.class}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
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
                            onClick={() => handleDeleteStudent(st.id, st.name)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors focus:outline-none"
                            title="Hapus Akun Siswa"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* RIGHT COLUMN: Interactive Story Feed */}
            <div className="lg:col-span-8 flex flex-col gap-4">
              
              {/* Filter Bar */}
              <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-xs font-bold text-slate-500">Filter Status:</span>
                  <div className="flex gap-1">
                    {['Semua', 'Menunggu Tanggapan', 'Butuh Bantuan', 'Teratasi'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${filterStatus === status ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <span className="text-xs font-bold text-slate-500">Filter Risiko:</span>
                  <div className="flex gap-1">
                    {['Semua', 'Rendah', 'Sedang', 'Tinggi'].map((risk) => (
                      <button
                        key={risk}
                        onClick={() => setFilterRisk(risk)}
                        className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${filterRisk === risk ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                      >
                        {risk}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Feed List */}
              <div className="flex flex-col gap-4">
                {teacherStories
                  .filter(s => filterStatus === 'Semua' || s.status === filterStatus)
                  .filter(s => filterRisk === 'Semua' || s.analysis?.tingkat_risiko === filterRisk)
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
                                <span className="text-xs text-slate-500">Kelas 4A</span>
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
                            <button
                              onClick={() => {
                                setActiveStoryDetail(story);
                                setTeacherReplyText(story.analysis?.rekomendasi_guru || '');
                                playTone(440, 'sine', 0.1);
                              }}
                              className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                            >
                              <MessageCircle className="w-4 h-4" /> Berikan Dukungan
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
                              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
                                <h5 className="font-extrabold text-xs text-indigo-700 uppercase tracking-wider border-b border-slate-100 pb-2">
                                  📝 Tulis Tanggapan Hangat Anda ke Murid
                                </h5>
                                <div className="flex flex-col gap-2">
                                  <textarea
                                    value={teacherReplyText}
                                    onChange={(e) => setTeacherReplyText(e.target.value)}
                                    placeholder="Ketik tanggapan yang menenangkan emosi murid..."
                                    className="w-full h-24 p-3 text-xs border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-500 leading-relaxed"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleTeacherReplySubmit(story.id)}
                                      className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 transition-colors"
                                    >
                                      Kirim Tanggapan ke Murid
                                    </button>
                                    <button
                                      onClick={() => {
                                        setCustomEscalateNote(story.analysis?.rekomendasi_bk || '');
                                        setShowEscalateModal(true);
                                      }}
                                      className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg border border-rose-200 transition-colors"
                                    >
                                      Rujuk ke BK / Ortu
                                    </button>
                                  </div>
                                </div>
                              </div>

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
                <div className="flex items-center gap-2">
                  <span className="text-xl">🩺</span>
                  <h4 className="font-extrabold text-sm text-emerald-800">Masuk sebagai Guru BK</h4>
                </div>
                <form onSubmit={handleBkLogin} className="flex flex-col gap-2">
                  <input
                    type="password"
                    required
                    value={bkPasswordInput}
                    onChange={(e) => setBkPasswordInput(e.target.value)}
                    placeholder="Sandi BK (bk123 / 12345)"
                    className="px-3.5 py-2.5 border-2 border-emerald-100 rounded-xl bg-white text-xs font-medium focus:outline-none focus:border-emerald-500"
                  />
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
            {/* BK & Ortu Active Session Banner */}
            <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <span className="text-3xl bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
                  {currentBkUser === 'guru_bk' ? '🩺' : '🏠'}
                </span>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-sm md:text-base">
                    {currentBkUser === 'guru_bk' ? 'Portal Terpadu Guru BK' : 'Portal Informasi Orang Tua'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentBkUser === 'guru_bk' 
                      ? 'Selamat datang, Bapak/Ibu Guru BK. Akses tindakan intervensi, rekomendasi, dan riwayat bimbingan.' 
                      : 'Selamat datang, Bapak/Ibu Wali Murid. Anda dapat melihat perkembangan analisis emosi rujukan demi pendampingan di rumah.'}
                  </p>
                </div>
              </div>
              <button
                onClick={handleBkOrtuLogout}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition-colors whitespace-nowrap self-stretch md:self-auto text-center"
              >
                Keluar Portal 🚪
              </button>
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
                    .filter(s => s.escalated)
                    .filter(s => s.studentName.toLowerCase().includes(bkSearch.toLowerCase()))
                    .map((story) => {
                      const char = CHARACTERS.find(c => c.id === story.character);
                      const isSelected = activeStoryDetail?.id === story.id;
                      return (
                        <button
                          key={story.id}
                          onClick={() => {
                            setActiveStoryDetail(story);
                            playTone(400, 'sine', 0.1);
                          }}
                          className={`flex items-center gap-3 w-full p-2.5 rounded-xl transition-all border text-left ${isSelected ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'}`}
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
                      );
                    })}

                  {stories.filter(s => s.escalated).length === 0 && (
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
                        <p className="text-xs text-slate-500">Kelas 4A · Wali Kelas: Ibu Guru Rahma</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Tanggal Refleksi: {new Date(activeStoryDetail.timestamp).toLocaleString('id-ID')}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-500">Status Kasus:</span>
                      <select
                        value={activeStoryDetail.status}
                        onChange={(e) => {
                          if (e.target.value === 'Teratasi') handleResolveStory(activeStoryDetail.id);
                        }}
                        className="border border-slate-200 rounded-lg text-xs font-bold p-1 bg-white focus:outline-none"
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

      </main>

      {/* FOOTER */}
      <footer className="mt-auto bg-slate-800 text-white border-t border-slate-700 py-6 px-4 md:px-8 text-center text-xs">
        <p className="font-bold">CERDAS © 2026 - Sistem Pendukung Keputusan Dukungan Emosional & Kesehatan Mental Anak</p>
        <p className="text-slate-400 mt-1.5">Mendukung kolaborasi harmonis antara Murid, Wali Kelas, Guru BK, dan Orang Tua Sekolah.</p>
      </footer>

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
                    onChange={(e) => setNewStudentClass(e.target.value)}
                    className="px-3 py-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-none"
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
                <label className="font-bold text-slate-600">Guru Wali:</label>
                <select
                  value={newStudentGuruWali}
                  onChange={(e) => setNewStudentGuruWali(e.target.value)}
                  className="px-3.5 py-2.5 border-2 border-slate-200 rounded-xl bg-white focus:outline-none font-medium"
                >
                  {teachers.map((t: any) => (
                    <option key={t.id} value={t.name}>
                      {t.name} ({t.class})
                    </option>
                  ))}
                </select>
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

    </div>
  );
}
