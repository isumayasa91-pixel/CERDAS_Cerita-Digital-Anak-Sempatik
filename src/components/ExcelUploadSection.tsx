import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  FileSpreadsheet, 
  UploadCloud, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  Trash2, 
  Users, 
  UserCheck, 
  RefreshCw,
  Info
} from 'lucide-react';
import { 
  bulkImportStudentsToFirestore, 
  bulkImportTeachersToFirestore, 
  Teacher 
} from '../services/firestoreService';

interface ExcelUploadSectionProps {
  teachers: Teacher[];
  onSuccess: (message: string) => void;
  playTone: (freq: number, type?: OscillatorType, duration?: number) => void;
}

export const ExcelUploadSection: React.FC<ExcelUploadSectionProps> = ({
  teachers,
  onSuccess,
  playTone
}) => {
  const [activeUploadType, setActiveUploadType] = useState<'students' | 'teachers'>('students');
  const [parsedStudents, setParsedStudents] = useState<Array<{ name: string; class: string; guruWali?: string; avatar?: string }>>([]);
  const [parsedTeachers, setParsedTeachers] = useState<Array<{ name: string; email: string; password?: string; class: string }>>([]);
  const [fileName, setFileName] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Template Download for Students
  const handleDownloadStudentTemplate = () => {
    const sampleData = [
      {
        'Nama Lengkap': 'I Putu Prama Setiawan',
        'Kelas': 'Kelas VII A',
        'Guru Wali': 'I Nyoman Gede Juwastra, S.Sn',
        'Jenis Kelamin': 'Laki-laki'
      },
      {
        'Nama Lengkap': 'Ni Kadek Cantika Lestari',
        'Kelas': 'Kelas VII B',
        'Guru Wali': 'Ibu Rahma, S.Pd',
        'Jenis Kelamin': 'Perempuan'
      },
      {
        'Nama Lengkap': 'I Wayan Budi Widya',
        'Kelas': 'Kelas VIII A',
        'Guru Wali': 'I Wayan Sumayasa, S.Pd',
        'Jenis Kelamin': 'Laki-laki'
      },
      {
        'Nama Lengkap': 'Ahmad Farhan Saputra',
        'Kelas': 'Kelas IX A',
        'Guru Wali': 'Bapak Deni Saputra, S.Pd',
        'Jenis Kelamin': 'Laki-laki'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Siswa');
    XLSX.writeFile(wb, 'Template_Data_Siswa_Cerdas.xlsx');
    playTone(523, 'sine', 0.15);
  };

  // Template Download for Teachers
  const handleDownloadTeacherTemplate = () => {
    const sampleData = [
      {
        'Nama Lengkap & Gelar': 'I Wayan Sumayasa, S.Pd',
        'Email Login': 'isumayasa91@guru.smp.belajar.id',
        'Password / PIN': 'password123',
        'Kelas / Rombel': 'Kelas VIII A, Kelas VIII B'
      },
      {
        'Nama Lengkap & Gelar': 'I Nyoman Gede Juwastra, S.Sn',
        'Email Login': 'nyoman@cerdas.id',
        'Password / PIN': 'password123',
        'Kelas / Rombel': 'Kelas VII A'
      },
      {
        'Nama Lengkap & Gelar': 'Ni Made Medi Astuti, S.Pd., M.Pd',
        'Email Login': 'mediastuti@cerdas.id',
        'Password / PIN': 'password123',
        'Kelas / Rombel': 'Guru BK (Kelas VII - IX)'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(sampleData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Template Guru');
    XLSX.writeFile(wb, 'Template_Data_Guru_Cerdas.xlsx');
    playTone(523, 'sine', 0.15);
  };

  // File Upload & Parse
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setErrorMsg('');
    setParsedStudents([]);
    setParsedTeachers([]);

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rows: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (rows.length === 0) {
        setErrorMsg('File Excel kosong atau tidak memiliki data yang valid.');
        return;
      }

      if (activeUploadType === 'students') {
        const studentList: Array<{ name: string; class: string; guruWali?: string; avatar?: string }> = [];
        for (const row of rows) {
          // Normalize column headers
          const name = row['Nama Lengkap'] || row['Nama Siswa'] || row['Nama'] || row['NAME'] || row['nama'] || '';
          const cls = row['Kelas'] || row['KELAS'] || row['kelas'] || row['Class'] || 'Kelas VII A';
          const guru = row['Guru Wali'] || row['Guru'] || row['GURU WALI'] || row['Wali Kelas'] || '';
          const gender = (row['Jenis Kelamin'] || row['Gender'] || row['JK'] || '').toString().toLowerCase();
          const avatar = gender.includes('p') || gender.includes('perempuan') || gender.includes('f') ? '👧' : '👦';

          if (name.toString().trim()) {
            studentList.push({
              name: name.toString().trim(),
              class: cls.toString().trim().startsWith('Kelas') ? cls.toString().trim() : `Kelas ${cls.toString().trim()}`,
              guruWali: guru.toString().trim() || undefined,
              avatar
            });
          }
        }

        if (studentList.length === 0) {
          setErrorMsg('Tidak ditemukan kolom "Nama" atau "Nama Lengkap" pada file Excel.');
        } else {
          setParsedStudents(studentList);
          playTone(440, 'sine', 0.1);
        }
      } else {
        const teacherList: Array<{ name: string; email: string; password?: string; class: string }> = [];
        for (const row of rows) {
          const name = row['Nama Lengkap & Gelar'] || row['Nama Guru'] || row['Nama'] || row['NAME'] || row['nama'] || '';
          const email = row['Email Login'] || row['Email'] || row['EMAIL'] || row['Username'] || '';
          const password = row['Password / PIN'] || row['Password'] || row['PIN'] || 'password123';
          const cls = row['Kelas / Rombel'] || row['Kelas'] || row['Rombel'] || row['Mapel'] || 'Umum';

          if (name.toString().trim() && email.toString().trim()) {
            teacherList.push({
              name: name.toString().trim(),
              email: email.toString().trim().toLowerCase(),
              password: password.toString().trim() || 'password123',
              class: cls.toString().trim()
            });
          }
        }

        if (teacherList.length === 0) {
          setErrorMsg('Tidak ditemukan kolom "Nama" dan "Email" pada file Excel.');
        } else {
          setParsedTeachers(teacherList);
          playTone(440, 'sine', 0.1);
        }
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Gagal membaca file Excel. Pastikan format file berakhiran .xlsx, .xls, atau .csv');
    }
  };

  // Submit Bulk Upload to Firestore
  const handleSaveToCloud = async () => {
    setIsUploading(true);
    setErrorMsg('');

    try {
      if (activeUploadType === 'students') {
        if (parsedStudents.length === 0) return;
        const count = await bulkImportStudentsToFirestore(parsedStudents);
        onSuccess(`✅ Berhasil mengimpor ${count} data murid dari file "${fileName}" ke Cloud Firestore!`);
        setParsedStudents([]);
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        playTone(587.33, 'sine', 0.25);
      } else {
        if (parsedTeachers.length === 0) return;
        const count = await bulkImportTeachersToFirestore(parsedTeachers);
        onSuccess(`✅ Berhasil mengimpor ${count} data akun guru dari file "${fileName}" ke Cloud Firestore!`);
        setParsedTeachers([]);
        setFileName('');
        if (fileInputRef.current) fileInputRef.current.value = '';
        playTone(587.33, 'sine', 0.25);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Terjadi kesalahan saat menyimpan data ke Cloud Firestore. Silakan coba lagi.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner & Mode Selector */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="p-3.5 bg-white/20 backdrop-blur-md rounded-2xl border border-white/20 shadow-inner">
            <FileSpreadsheet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black tracking-tight">Upload & Import Data Excel (.xlsx / .csv)</h3>
            <p className="text-xs text-white/90 font-medium mt-0.5">
              Daftarkan ratusan siswa atau akun guru sekaligus dengan cepat melalui file Excel.
            </p>
          </div>
        </div>

        {/* Upload Mode Switcher */}
        <div className="flex items-center bg-black/20 p-1 rounded-2xl border border-white/20 self-stretch sm:self-auto">
          <button
            type="button"
            onClick={() => {
              setActiveUploadType('students');
              setParsedStudents([]);
              setParsedTeachers([]);
              setFileName('');
              setErrorMsg('');
              if (fileInputRef.current) fileInputRef.current.value = '';
              playTone(350, 'sine', 0.05);
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeUploadType === 'students' ? 'bg-white text-emerald-800 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Data Murid
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveUploadType('teachers');
              setParsedStudents([]);
              setParsedTeachers([]);
              setFileName('');
              setErrorMsg('');
              if (fileInputRef.current) fileInputRef.current.value = '';
              playTone(380, 'sine', 0.05);
            }}
            className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeUploadType === 'teachers' ? 'bg-white text-teal-800 shadow-sm' : 'text-white/80 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Data Guru
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Card: File Upload & Template Download */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-extrabold text-sm text-slate-800 flex items-center gap-2">
              <span>{activeUploadType === 'students' ? '🎒' : '👩‍🏫'}</span>
              1. Pilih & Upload File {activeUploadType === 'students' ? 'Murid' : 'Guru'}
            </h4>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
              .xlsx / .xls / .csv
            </span>
          </div>

          {/* Download Template Action */}
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col gap-2.5">
            <div className="flex items-start gap-2 text-xs text-slate-600">
              <Info className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                Gunakan template resmi agar kolom nama, kelas, dan akun langsung terbaca secara akurat:
              </span>
            </div>
            <button
              type="button"
              onClick={activeUploadType === 'students' ? handleDownloadStudentTemplate : handleDownloadTeacherTemplate}
              className="w-full py-2.5 bg-white hover:bg-emerald-50 text-emerald-700 border-2 border-emerald-200 rounded-xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              Unduh Format Template Excel {activeUploadType === 'students' ? 'Siswa' : 'Guru'}
            </button>
          </div>

          {/* Upload Dropzone */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-xs text-slate-700">Pilih Dokumen Excel dari Perangkat:</label>
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-emerald-300 hover:border-emerald-500 bg-emerald-50/50 hover:bg-emerald-50 p-6 rounded-2xl flex flex-col items-center justify-center gap-2 text-center cursor-pointer transition-all group"
            >
              <div className="p-3 bg-white rounded-full border border-emerald-200 shadow-sm group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="font-extrabold text-xs text-slate-800">
                  {fileName ? fileName : 'Klik untuk memilih file Excel'}
                </p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Mendukung format Microsoft Excel (.xlsx, .xls) dan CSV
                </p>
              </div>
            </div>
            <input 
              ref={fileInputRef}
              type="file" 
              accept=".xlsx, .xls, .csv" 
              onChange={handleFileChange}
              className="hidden" 
            />
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Guidelines Info Box */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1.5 text-[11px] text-slate-600">
            <p className="font-bold text-slate-700">💡 Format Kolom yang Dikenali Sistem:</p>
            {activeUploadType === 'students' ? (
              <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                <li><span className="font-semibold text-slate-700">Nama Lengkap</span> (Wajib)</li>
                <li><span className="font-semibold text-slate-700">Kelas</span> (Contoh: Kelas VII A, Kelas VIII B)</li>
                <li><span className="font-semibold text-slate-700">Guru Wali</span> (Otomatis diarahkan sesuai kelas jika dikosongkan)</li>
                <li><span className="font-semibold text-slate-700">Jenis Kelamin</span> (L / P untuk avatar foto)</li>
              </ul>
            ) : (
              <ul className="list-disc list-inside space-y-0.5 text-slate-500">
                <li><span className="font-semibold text-slate-700">Nama Lengkap & Gelar</span> (Wajib)</li>
                <li><span className="font-semibold text-slate-700">Email Login</span> (Wajib, Contoh: nama@cerdas.id)</li>
                <li><span className="font-semibold text-slate-700">Password / PIN</span> (Default: password123 jika kosong)</li>
                <li><span className="font-semibold text-slate-700">Kelas / Rombel</span> (Contoh: Kelas VII A, Guru BK)</li>
              </ul>
            )}
          </div>
        </div>

        {/* Right Card: Data Preview & Action */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">📊</span>
              <div>
                <h4 className="font-extrabold text-sm text-slate-800">2. Pratinjau & Konfirmasi Data</h4>
                <p className="text-[11px] text-slate-500">
                  {activeUploadType === 'students' ? `${parsedStudents.length} baris data siswa terdeteksi` : `${parsedTeachers.length} baris akun guru terdeteksi`}
                </p>
              </div>
            </div>

            {(parsedStudents.length > 0 || parsedTeachers.length > 0) && (
              <button
                type="button"
                onClick={() => {
                  setParsedStudents([]);
                  setParsedTeachers([]);
                  setFileName('');
                  if (fileInputRef.current) fileInputRef.current.value = '';
                  playTone(300, 'sine', 0.05);
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1 border border-rose-200"
              >
                <Trash2 className="w-3.5 h-3.5" /> Batal / Reset
              </button>
            )}
          </div>

          {/* Students Preview Table */}
          {activeUploadType === 'students' && (
            <>
              {parsedStudents.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-600">Belum ada file Excel yang dipilih</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Unggah file Excel di samping untuk melihat pratinjau data.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-[360px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-slate-700 font-extrabold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="p-3 text-center w-10">No</th>
                          <th className="p-3">Nama Siswa</th>
                          <th className="p-3">Kelas</th>
                          <th className="p-3">Guru Wali</th>
                          <th className="p-3 text-center">Avatar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedStudents.map((st, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                            <td className="p-3 font-extrabold text-slate-800">{st.name}</td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-sky-50 text-sky-700 font-bold rounded-full text-[11px] border border-sky-200">
                                {st.class}
                              </span>
                            </td>
                            <td className="p-3 text-slate-600 text-[11px]">
                              {st.guruWali || 'Otomatis diisi'}
                            </td>
                            <td className="p-3 text-center text-base">{st.avatar || '👦'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-extrabold text-emerald-900">
                        Siap mengimpor {parsedStudents.length} murid ke database Cloud Firestore.
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={handleSaveToCloud}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan ke Server...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" /> Simpan & Upload ke Server
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Teachers Preview Table */}
          {activeUploadType === 'teachers' && (
            <>
              {parsedTeachers.length === 0 ? (
                <div className="text-center py-16 flex flex-col items-center justify-center gap-3 text-slate-400">
                  <div className="p-4 bg-slate-50 rounded-full border border-slate-100">
                    <FileSpreadsheet className="w-8 h-8 text-slate-300" />
                  </div>
                  <div>
                    <p className="font-bold text-xs text-slate-600">Belum ada file Excel guru yang dipilih</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Unggah file Excel di samping untuk melihat pratinjau data guru.</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="border border-slate-200 rounded-2xl overflow-hidden max-h-[360px] overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-50 text-slate-700 font-extrabold sticky top-0 border-b border-slate-200">
                        <tr>
                          <th className="p-3 text-center w-10">No</th>
                          <th className="p-3">Nama Lengkap & Gelar</th>
                          <th className="p-3">Email Login</th>
                          <th className="p-3">Password</th>
                          <th className="p-3">Kelas / Rombel</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {parsedTeachers.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="p-3 text-center font-mono font-bold text-slate-400">{idx + 1}</td>
                            <td className="p-3 font-extrabold text-slate-800">{t.name}</td>
                            <td className="p-3 text-slate-600 font-mono text-[11px]">{t.email}</td>
                            <td className="p-3">
                              <span className="font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-[11px]">
                                {t.password || 'password123'}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 font-bold rounded-full text-[11px] border border-indigo-200">
                                {t.class}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      <span className="text-xs font-extrabold text-emerald-900">
                        Siap mengimpor {parsedTeachers.length} akun guru ke database Cloud Firestore.
                      </span>
                    </div>
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={handleSaveToCloud}
                      className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer shrink-0 disabled:opacity-50"
                    >
                      {isUploading ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" /> Menyimpan ke Server...
                        </>
                      ) : (
                        <>
                          <UploadCloud className="w-4 h-4" /> Simpan & Upload ke Server
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
