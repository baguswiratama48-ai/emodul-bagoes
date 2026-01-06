// Kunci jawaban LKPD - hanya bisa diakses oleh guru
export const lkpdAnswerKeys = [
  {
    id: 1,
    title: "Soal 1: Penjualan Es Teh di Kantin",
    data: {
      p1: 5000,
      q1: 100,
      p2: 3000,
      q2: 160
    },
    steps: [
      "Identifikasi data dari soal cerita:",
      "• Titik A: P₁ = 5.000, Q₁ = 100",
      "• Titik B: P₂ = 3.000, Q₂ = 160",
      "",
      "Langkah 1: Hitung perubahan",
      "• ΔQ = Q₂ - Q₁ = 160 - 100 = 60",
      "• ΔP = P₂ - P₁ = 3.000 - 5.000 = -2.000",
      "",
      "Langkah 2: Hitung slope (a)",
      "• a = ΔQ / ΔP = 60 / (-2.000) = -0,03",
      "",
      "Langkah 3: Substitusi ke persamaan",
      "• Q - Q₁ = a(P - P₁)",
      "• Q - 100 = -0,03(P - 5.000)",
      "• Q - 100 = -0,03P + 150",
      "• Q = -0,03P + 250"
    ],
    answer: "Qd = -0,03P + 250",
    verification: [
      "Verifikasi:",
      "• Jika P = 5.000 → Qd = -0,03(5.000) + 250 = -150 + 250 = 100 ✓",
      "• Jika P = 3.000 → Qd = -0,03(3.000) + 250 = -90 + 250 = 160 ✓"
    ]
  },
  {
    id: 2,
    title: "Soal 2: Penjualan Pulpen di Koperasi",
    data: {
      p1: 4000,
      q1: 50,
      p2: 6000,
      q2: 30
    },
    steps: [
      "Identifikasi data dari soal cerita:",
      "• Titik A: P₁ = 4.000, Q₁ = 50",
      "• Titik B: P₂ = 6.000, Q₂ = 30",
      "",
      "Langkah 1: Hitung perubahan",
      "• ΔQ = Q₂ - Q₁ = 30 - 50 = -20",
      "• ΔP = P₂ - P₁ = 6.000 - 4.000 = 2.000",
      "",
      "Langkah 2: Hitung slope (a)",
      "• a = ΔQ / ΔP = -20 / 2.000 = -0,01",
      "",
      "Langkah 3: Substitusi ke persamaan",
      "• Q - Q₁ = a(P - P₁)",
      "• Q - 50 = -0,01(P - 4.000)",
      "• Q - 50 = -0,01P + 40",
      "• Q = -0,01P + 90"
    ],
    answer: "Qd = -0,01P + 90",
    verification: [
      "Verifikasi:",
      "• Jika P = 4.000 → Qd = -0,01(4.000) + 90 = -40 + 90 = 50 ✓",
      "• Jika P = 6.000 → Qd = -0,01(6.000) + 90 = -60 + 90 = 30 ✓"
    ]
  },
  {
    id: 3,
    title: "Soal 3: Penjualan Bakso di Stadion",
    data: {
      p1: 15000,
      q1: 80,
      p2: 12000,
      q2: 110
    },
    steps: [
      "Identifikasi data dari soal cerita:",
      "• Titik A: P₁ = 15.000, Q₁ = 80",
      "• Titik B: P₂ = 12.000, Q₂ = 110",
      "",
      "Langkah 1: Hitung perubahan",
      "• ΔQ = Q₂ - Q₁ = 110 - 80 = 30",
      "• ΔP = P₂ - P₁ = 12.000 - 15.000 = -3.000",
      "",
      "Langkah 2: Hitung slope (a)",
      "• a = ΔQ / ΔP = 30 / (-3.000) = -0,01",
      "",
      "Langkah 3: Substitusi ke persamaan",
      "• Q - Q₁ = a(P - P₁)",
      "• Q - 80 = -0,01(P - 15.000)",
      "• Q - 80 = -0,01P + 150",
      "• Q = -0,01P + 230",
      "",
      "Langkah 4: Hitung Q jika P = 10.000",
      "• Q = -0,01(10.000) + 230",
      "• Q = -100 + 230 = 130 mangkok"
    ],
    answer: "Qd = -0,01P + 230; Jika P = 10.000, maka Q = 130 mangkok",
    verification: [
      "Verifikasi:",
      "• Jika P = 15.000 → Qd = -0,01(15.000) + 230 = -150 + 230 = 80 ✓",
      "• Jika P = 12.000 → Qd = -0,01(12.000) + 230 = -120 + 230 = 110 ✓"
    ]
  },
  {
    id: 4,
    title: "Soal 4: Analisis Kasus",
    data: {
      p1: 75000,
      q1: 40,
      p2: 60000,
      q2: 60
    },
    steps: [
      "Identifikasi data dari soal cerita:",
      "• Harga awal = Rp75.000, terjual 40 eksemplar",
      "• Diskon 20% → Harga baru = 75.000 - (20% × 75.000) = 75.000 - 15.000 = Rp60.000",
      "• Setelah diskon terjual 60 eksemplar",
      "",
      "Data titik:",
      "• Titik A: P₁ = 75.000, Q₁ = 40",
      "• Titik B: P₂ = 60.000, Q₂ = 60",
      "",
      "Langkah 1: Hitung perubahan",
      "• ΔQ = Q₂ - Q₁ = 60 - 40 = 20",
      "• ΔP = P₂ - P₁ = 60.000 - 75.000 = -15.000",
      "",
      "Langkah 2: Hitung slope (a)",
      "• a = ΔQ / ΔP = 20 / (-15.000) = -0,00133 (atau -1/750)",
      "",
      "Langkah 3: Substitusi ke persamaan",
      "• Q - 40 = -0,00133(P - 75.000)",
      "• Q - 40 = -0,00133P + 100",
      "• Q = -0,00133P + 140",
      "",
      "Bagian b: Jika Q = 80, cari P",
      "• 80 = -0,00133P + 140",
      "• 0,00133P = 140 - 80 = 60",
      "• P = 60 / 0,00133 = 45.000"
    ],
    answer: "a) Qd = -0,00133P + 140 (atau Qd = 140 - P/750)\nb) Untuk menjual 80 eksemplar, harga harus Rp45.000",
    verification: [
      "Verifikasi:",
      "• Jika P = 75.000 → Qd = -0,00133(75.000) + 140 ≈ 40 ✓",
      "• Jika P = 60.000 → Qd = -0,00133(60.000) + 140 ≈ 60 ✓",
      "• Jika P = 45.000 → Qd = -0,00133(45.000) + 140 ≈ 80 ✓"
    ]
  }
];

// Kunci jawaban kuis Ekonomi
export const quizAnswerKeysEkonomi = {
  'q1': {
    correctAnswer: 1,
    explanation: 'Permintaan adalah jumlah barang yang INGIN dan MAMPU dibeli oleh konsumen pada berbagai tingkat harga dalam periode waktu tertentu. Kata kunci: ingin + mampu + berbagai tingkat harga.'
  },
  'q2': {
    correctAnswer: 2,
    explanation: 'Permintaan absolut adalah permintaan yang hanya berupa keinginan tanpa didukung kemampuan membeli. Orang tersebut ingin tapi tidak mampu, sehingga termasuk permintaan absolut.'
  },
  'q3': {
    correctAnswer: 2,
    explanation: 'Hukum permintaan menyatakan bahwa ada hubungan TERBALIK antara harga dan jumlah yang diminta. Jika harga naik, permintaan turun (dengan asumsi ceteris paribus).'
  },
  'q4': {
    correctAnswer: 2,
    explanation: 'Ceteris paribus adalah istilah Latin yang berarti "hal-hal lain dianggap tetap". Ini digunakan untuk menganalisis hubungan antara dua variabel saja.'
  },
  'q5': {
    correctAnswer: 1,
    explanation: 'Kurva permintaan berslope negatif karena adanya hubungan TERBALIK antara harga dan jumlah yang diminta. Semakin tinggi harga, semakin sedikit yang diminta.'
  },
  'q6': {
    correctAnswer: 1,
    explanation: 'Slope = (Q₂-Q₁)/(P₂-P₁) = (140-100)/(3000-5000) = 40/(-2000) = -0,02'
  },
  'q7': {
    correctAnswer: 0,
    explanation: 'Selera konsumen adalah faktor NON-HARGA yang menyebabkan pergeseran kurva permintaan, bukan pergerakan sepanjang kurva.'
  },
  'q8': {
    correctAnswer: 1,
    explanation: 'Ketika harga naik (faktor harga), terjadi pergerakan sepanjang kurva dari satu titik ke titik lain, bukan pergeseran kurva.'
  },
  'q9': {
    correctAnswer: 2,
    explanation: 'Teh dan kopi adalah barang substitusi. Jika harga kopi naik, konsumen beralih ke teh, sehingga permintaan teh meningkat.'
  },
  'q10': {
    correctAnswer: 0,
    explanation: 'Pendapatan naik menyebabkan daya beli meningkat. Untuk barang normal, hal ini menyebabkan kurva permintaan bergeser ke KANAN (permintaan meningkat pada setiap tingkat harga).'
  }
};

// Kunci jawaban kuis PKWU
export const quizAnswerKeysPKWU = {
  'pkwu-q1': {
    correctAnswer: 1,
    explanation: 'Limbah bangun datar adalah bahan sisa atau sampah yang memiliki bentuk dasar dua dimensi, seperti kertas, kardus, plastik lembaran, dan kain perca.'
  },
  'pkwu-q2': {
    correctAnswer: 1,
    explanation: 'Upcycling mengubah limbah menjadi produk bernilai lebih tinggi dari bentuk aslinya, sementara recycling mengolah kembali menjadi bahan dasar.'
  },
  'pkwu-q3': {
    correctAnswer: 1,
    explanation: 'Wirausaha kerajinan limbah ramah lingkungan karena mengurangi limbah, menghemat sumber daya, dan mendukung konsep ekonomi hijau (green economy).'
  },
  'pkwu-q4': {
    correctAnswer: 1,
    explanation: 'Green Economy adalah model ekonomi yang berfokus pada pembangunan berkelanjutan tanpa merusak lingkungan, di mana bisnis limbah termasuk di dalamnya.'
  },
  'pkwu-q5': {
    correctAnswer: 1,
    explanation: 'USP (Unique Selling Point) adalah keunikan atau nilai tambah yang membedakan produk Anda dari produk pesaing, menjadi alasan mengapa konsumen harus memilih produk Anda.'
  },
  'pkwu-q6': {
    correctAnswer: 1,
    explanation: 'Plastik sachet cocok untuk tas atau dompet karena karakteristiknya yang anti air, kuat, ringan, dan memiliki warna/merk yang bervariasi.'
  },
  'pkwu-q7': {
    correctAnswer: 2,
    explanation: 'Tren eco-friendly yang meningkat adalah faktor eksternal yang menguntungkan, sehingga termasuk kategori Opportunity (Peluang).'
  },
  'pkwu-q8': {
    correctAnswer: 1,
    explanation: 'Marketplace online memberikan keuntungan jangkauan pasar yang luas dan kemudahan akses bagi pembeli dari berbagai daerah.'
  },
  'pkwu-q9': {
    correctAnswer: 1,
    explanation: 'Storytelling bertujuan untuk menceritakan proses pembuatan dan dampak positif produk, sehingga membangun koneksi emosional dengan konsumen.'
  },
  'pkwu-q10': {
    correctAnswer: 2,
    explanation: 'Harga jual = Biaya produksi + Margin. Dengan margin 100%, maka Rp 40.000 + (100% × Rp 40.000) = Rp 80.000.'
  }
};

// Kunci LKPD untuk PKWU
export const lkpdAnswerKeysPKWU = [
  {
    id: 1,
    title: "Soal 1: Identifikasi Limbah di Lingkungan",
    steps: [
      "Langkah 1: Observasi lingkungan sekitar",
      "• Identifikasi jenis-jenis limbah yang ada",
      "• Klasifikasikan berdasarkan bentuk (bangun datar/ruang)",
      "",
      "Langkah 2: Analisis potensi",
      "• Tentukan jumlah ketersediaan limbah",
      "• Nilai kondisi dan kelayakan limbah",
      "",
      "Langkah 3: Ide produk",
      "• Sesuaikan dengan karakteristik limbah",
      "• Pertimbangkan target pasar"
    ],
    answer: "Jawaban bersifat terbuka, dinilai berdasarkan kelengkapan analisis dan kreativitas ide produk",
    verification: [
      "Kriteria penilaian:",
      "• Kelengkapan identifikasi limbah (25%)",
      "• Ketepatan klasifikasi (25%)",
      "• Kreativitas ide produk (25%)",
      "• Analisis potensi pasar (25%)"
    ]
  },
  {
    id: 2,
    title: "Soal 2: Analisis SWOT Produk Kerajinan",
    steps: [
      "Langkah 1: Identifikasi Strengths (Kekuatan)",
      "• Bahan baku murah/gratis",
      "• Produk unik dan ramah lingkungan",
      "",
      "Langkah 2: Identifikasi Weaknesses (Kelemahan)",
      "• Butuh keterampilan khusus",
      "• Waktu produksi relatif lama",
      "",
      "Langkah 3: Identifikasi Opportunities (Peluang)",
      "• Tren eco-friendly meningkat",
      "• Pasar online berkembang",
      "",
      "Langkah 4: Identifikasi Threats (Ancaman)",
      "• Persaingan meningkat",
      "• Perubahan tren pasar"
    ],
    answer: "Analisis SWOT yang lengkap dengan minimal 3 poin per kategori",
    verification: [
      "Kriteria penilaian:",
      "• Kelengkapan analisis per kategori (40%)",
      "• Relevansi dengan produk yang dipilih (30%)",
      "• Strategi berdasarkan analisis (30%)"
    ]
  },
  {
    id: 3,
    title: "Soal 3: Perhitungan Harga Jual",
    steps: [
      "Langkah 1: Hitung biaya bahan baku",
      "• Total biaya bahan = jumlah × harga satuan",
      "",
      "Langkah 2: Hitung biaya tenaga kerja",
      "• Estimasi waktu × upah per jam",
      "",
      "Langkah 3: Hitung biaya overhead",
      "• Listrik, transportasi, dll",
      "",
      "Langkah 4: Total biaya produksi",
      "• Total = bahan + tenaga kerja + overhead",
      "",
      "Langkah 5: Tentukan margin keuntungan",
      "• Harga jual = Total biaya × (1 + margin%)"
    ],
    answer: "Perhitungan yang sistematis dengan margin keuntungan minimal 50-100%",
    verification: [
      "Contoh: Biaya Rp 40.000, margin 100%",
      "Harga jual = 40.000 × (1 + 1) = Rp 80.000"
    ]
  }
];

// Backward compatibility
export const quizAnswerKeys = quizAnswerKeysEkonomi;