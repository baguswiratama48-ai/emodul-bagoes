export interface SubSection {
  id: string;
  title: string;
  content: string;
}

export interface MaterialSection {
  id: string;
  title: string;
  icon: string;
  subsections?: SubSection[];
  content?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface Video {
  id: string;
  title: string;
  url: string;
  description: string;
  task?: string;
}

export interface Module {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  objectives: string[];
  prerequisites: string[];
  duration: string;
  sections: MaterialSection[];
  videos: Video[];
  quizQuestions: QuizQuestion[];
  glossary: Record<string, string>;
  // New optional metadata fields
  level?: string;
  phase?: string;
  lessonNumber?: number;
  model?: string;
  activity?: string;
  product?: string;
  meaningfulUnderstanding?: string;
  reflectionQuestions?: { id: number; question: string; hint: string }[];
}

export const demandModule: Module = {
  id: 'permintaan',
  title: 'Permintaan (Demand)',
  subtitle: 'dan Kurva Permintaan',
  description: 'Mempelajari konsep permintaan dalam ekonomi, faktor-faktor yang mempengaruhi permintaan, hukum permintaan, serta cara membuat dan menganalisis kurva permintaan.',
  objectives: [
    'Menjelaskan pengertian permintaan dalam kegiatan ekonomi',
    'Mengidentifikasi faktor-faktor yang mempengaruhi permintaan',
    'Menjelaskan hukum permintaan dan konsep ceteris paribus',
    'Membuat dan menganalisis tabel skedul permintaan',
    'Menggambar dan menginterpretasikan kurva permintaan',
    'Menghitung fungsi permintaan menggunakan rumus matematika',
    'Membedakan pergerakan sepanjang kurva dan pergeseran kurva permintaan',
  ],
  prerequisites: [
    'Memahami konsep dasar kebutuhan dan keinginan manusia',
    'Mengenal konsep pasar dalam ekonomi',
    'Kemampuan dasar matematika (grafik koordinat)',
  ],
  duration: '3 JP (3 x 45 menit)',
  sections: [
    {
      id: 'pengertian',
      title: 'Pengertian Permintaan',
      icon: '📖',
      content: `
# Pengertian Permintaan (Demand)

**Permintaan (Demand)** adalah jumlah barang atau jasa yang ingin dan mampu dibeli oleh konsumen pada berbagai tingkat harga dalam periode waktu tertentu.

## Kata Kunci Penting:
- **Ingin (willingness)**: Ada keinginan untuk membeli
- **Mampu (ability)**: Memiliki daya beli/uang untuk membeli
- **Berbagai tingkat harga**: Permintaan berubah sesuai harga
- **Periode waktu tertentu**: Misalnya per hari, per minggu, per bulan

## Contoh Sederhana:
Bayangkan kamu ingin membeli es kopi di kantin:
- Jika harganya Rp5.000, kamu mungkin beli 3 gelas per minggu
- Jika harganya Rp10.000, kamu mungkin hanya beli 1 gelas per minggu
- Jika harganya Rp20.000, kamu mungkin tidak jadi beli sama sekali

Itulah yang disebut **permintaan** - keinginan + kemampuan membeli pada berbagai tingkat harga!

## Faktor-faktor yang Mempengaruhi Permintaan:

1. **Harga barang itu sendiri (Px)**
   - Semakin mahal, permintaan cenderung turun
   
2. **Pendapatan konsumen (I - Income)**
   - Pendapatan naik → permintaan barang normal naik
   
3. **Harga barang lain (Py)**
   - Barang substitusi (pengganti): harga naik → permintaan barang lain naik
   - Barang komplementer (pelengkap): harga naik → permintaan barang lain turun
   
4. **Selera konsumen (T - Taste)**
   - Trend, mode, kebiasaan mempengaruhi permintaan
   
5. **Jumlah penduduk (Pop - Population)**
   - Penduduk bertambah → permintaan meningkat
   
6. **Ekspektasi harga masa depan (E - Expectation)**
   - Jika diprediksi harga naik → permintaan sekarang meningkat
      `,
    },
    {
      id: 'macam-permintaan',
      title: 'Macam-Macam Permintaan',
      icon: '📋',
      content: `
# Macam-Macam Permintaan

Permintaan dapat diklasifikasikan berdasarkan dua kriteria utama:

## A. Berdasarkan Daya Beli

### 1. Permintaan Efektif ✅
Permintaan yang disertai dengan **keinginan DAN kemampuan** untuk membeli.

> **Contoh**: Kamu ingin membeli laptop seharga Rp8 juta dan sudah punya uangnya. Ini adalah permintaan efektif karena bisa langsung terwujud.

### 2. Permintaan Potensial 🔄
Permintaan yang disertai **kemampuan membeli** tetapi belum ada keinginan untuk membeli saat ini.

> **Contoh**: Kamu punya uang Rp8 juta tapi belum memutuskan untuk membeli laptop karena masih mempertimbangkan pilihan lain.

### 3. Permintaan Absolut ❌
Permintaan yang hanya berupa **keinginan** tanpa didukung kemampuan membeli.

> **Contoh**: Kamu sangat ingin punya mobil sport mewah seharga Rp2 miliar, tapi tidak punya uang sebanyak itu. Ini hanyalah angan-angan!

---

## B. Berdasarkan Jumlah Peminta

### 1. Permintaan Individu 👤
Permintaan yang dilakukan oleh **satu orang** konsumen terhadap suatu barang.

> **Contoh**: Andi meminta 3 buah apel per hari dengan harga Rp5.000/buah

### 2. Permintaan Pasar 👥
**Penjumlahan** dari seluruh permintaan individu dalam satu pasar.

> **Contoh**: Di kelas ada 30 siswa. Jika masing-masing meminta rata-rata 2 pulpen per bulan, maka permintaan pasar = 60 pulpen per bulan

---

## Tabel Perbandingan Jenis Permintaan

| Jenis Permintaan | Keinginan | Kemampuan | Dapat Terwujud? |
|------------------|-----------|-----------|-----------------|
| Efektif | Ada ✅ | Ada ✅ | Ya ✅ |
| Potensial | Belum ❌ | Ada ✅ | Mungkin 🔄 |
| Absolut | Ada ✅ | Tidak ❌ | Tidak ❌ |
      `,
    },
    {
      id: 'hukum-permintaan',
      title: 'Hukum Permintaan',
      icon: '⚖️',
      content: `
# Hukum Permintaan

## Bunyi Hukum Permintaan:

> **"Jika harga suatu barang naik, maka jumlah barang yang diminta akan turun. Sebaliknya, jika harga barang turun, maka jumlah barang yang diminta akan naik, dengan asumsi faktor lain tetap (ceteris paribus)."**

## Dalam Notasi:
- **P ↑ → Qd ↓** (Harga naik, permintaan turun)
- **P ↓ → Qd ↑** (Harga turun, permintaan naik)

---

## 🔑 Konsep Ceteris Paribus

**Ceteris Paribus** berasal dari bahasa Latin yang artinya **"hal-hal lain dianggap tetap"**.

Mengapa penting? Karena permintaan dipengaruhi banyak faktor. Untuk melihat hubungan murni antara harga dan jumlah permintaan, kita harus mengasumsikan faktor lain tidak berubah.

### Faktor yang diasumsikan tetap:
- ✓ Pendapatan konsumen
- ✓ Harga barang lain
- ✓ Selera konsumen
- ✓ Jumlah penduduk
- ✓ Ekspektasi harga masa depan

---

## 📊 Contoh Penerapan Hukum Permintaan

### Kasus: Harga Paket Data Internet

| Harga per GB | Jumlah Pengguna |
|--------------|-----------------|
| Rp25.000 | 80 juta orang |
| Rp20.000 | 100 juta orang |
| Rp15.000 | 130 juta orang |
| Rp10.000 | 170 juta orang |
| Rp5.000 | 220 juta orang |

**Analisis**: Semakin murah harga paket data internet per GB, semakin banyak orang yang menggunakannya. Ini sesuai dengan hukum permintaan!

---

## ⚠️ Pengecualian Hukum Permintaan

Ada beberapa kasus di mana hukum permintaan **tidak berlaku**:

### 1. Barang Giffen
Barang inferior yang permintaannya justru naik saat harga naik.
> Contoh: Di daerah miskin, ketika harga beras naik, orang justru membeli lebih banyak beras karena tidak mampu membeli makanan lain yang lebih mahal.

### 2. Barang Veblen (Prestise)
Barang mewah yang dibeli untuk menunjukkan status sosial.
> Contoh: Tas branded yang semakin mahal justru semakin diminati karena menunjukkan prestise.

### 3. Spekulasi
Ketika orang mengharapkan harga akan terus naik.
> Contoh: Harga emas naik, orang justru membeli lebih banyak karena berharap harga akan lebih tinggi lagi.
      `,
    },
    {
      id: 'kurva-permintaan',
      title: 'Tabel & Kurva Permintaan',
      icon: '📈',
      content: `
# Tabel dan Kurva Permintaan

## 📋 Tabel Skedul Permintaan

Tabel skedul permintaan adalah tabel yang menunjukkan **hubungan antara harga dan jumlah barang yang diminta** dalam suatu periode waktu.

### Contoh: Permintaan Es Jeruk di Kantin

| Titik | Harga (Rp) | Jumlah Diminta (gelas/hari) |
|-------|------------|---------------------------|
| A | 10.000 | 20 |
| B | 8.000 | 40 |
| C | 6.000 | 60 |
| D | 4.000 | 80 |
| E | 2.000 | 100 |

---

## 📈 Kurva Permintaan

Kurva permintaan adalah **representasi grafis** dari tabel skedul permintaan.

### Cara Menggambar Kurva Permintaan:
1. Sumbu vertikal (Y) = **Harga (P)**
2. Sumbu horizontal (X) = **Jumlah diminta (Qd)**
3. Plot setiap titik dari tabel
4. Hubungkan titik-titik tersebut

### Karakteristik Kurva Permintaan:
- **Berslope negatif** (miring dari kiri atas ke kanan bawah)
- Menunjukkan hubungan **terbalik** antara harga dan jumlah diminta
- Diberi label **D** (Demand)

---

## 🎯 Mengapa Kurva Permintaan Berslope Negatif?

Ada tiga alasan utama:

### 1. Efek Substitusi
Ketika harga suatu barang naik, konsumen beralih ke barang pengganti yang lebih murah.
> Contoh: Harga Indomie naik → orang beralih ke mie merek lain

### 2. Efek Pendapatan
Ketika harga naik, daya beli konsumen menurun sehingga membeli lebih sedikit.
> Contoh: Harga bensin naik → budget terbatas → beli lebih sedikit

### 3. Hukum Utilitas Marjinal yang Semakin Berkurang
Kepuasan tambahan dari mengkonsumsi satu unit tambahan semakin menurun, sehingga konsumen hanya mau membeli lebih banyak jika harganya lebih murah.
> Contoh: Es krim pertama sangat nikmat, es krim kelima sudah biasa saja

---

## 📊 Interaktif: Kurva Permintaan

*Lihat grafik interaktif di bagian bawah halaman ini. Kamu bisa hover pada setiap titik untuk melihat detail harga dan jumlah permintaan!*
      `,
    },
    {
      id: 'fungsi-permintaan',
      title: 'Fungsi Permintaan',
      icon: '🔢',
      content: `
# Fungsi Permintaan

## 📐 Rumus Umum Fungsi Permintaan

Fungsi permintaan menunjukkan hubungan **matematis** antara harga (P) dan jumlah yang diminta (Qd).

### Rumus:

**Qd = -aP + b**

atau bisa ditulis:

**Qd = b - aP**

**Keterangan:**
- **Qd** = Jumlah barang yang diminta
- **P** = Harga barang
- **a** = Koefisien arah (slope) → bernilai negatif
- **b** = Konstanta (nilai Qd ketika P = 0)

---

## 📝 Cara Menentukan Fungsi Permintaan

Jika diketahui **dua titik** pada kurva permintaan, gunakan langkah berikut:

### Langkah 1: Hitung slope (gradien)

**a = (Q₂ - Q₁) / (P₂ - P₁)**

### Langkah 2: Masukkan ke persamaan titik

**(Q - Q₁) / (Q₂ - Q₁) = (P - P₁) / (P₂ - P₁)**

---

## 📊 Contoh Soal

### Soal Cerita:

> Pak Budi memiliki toko sepatu di pasar tradisional. Ketika harga sepatu **Rp100.000 per pasang**, jumlah sepatu yang terjual adalah **20 pasang per hari**. Setelah Pak Budi menurunkan harga menjadi **Rp80.000 per pasang**, jumlah sepatu yang terjual meningkat menjadi **40 pasang per hari**.
>
> Berdasarkan data tersebut, tentukan fungsi permintaan sepatu di toko Pak Budi!

### Data yang Diketahui:
- **Titik A:** P₁ = 100.000, Q₁ = 20
- **Titik B:** P₂ = 80.000, Q₂ = 40

### Penyelesaian:

**Langkah 1:** Hitung perubahan
- ΔQ = Q₂ - Q₁ = 40 - 20 = **20**
- ΔP = P₂ - P₁ = 80.000 - 100.000 = **-20.000**

**Langkah 2:** Hitung slope (a)
- a = ΔQ / ΔP = 20 / (-20.000) = **-0,001**

**Langkah 3:** Substitusi ke persamaan garis

Gunakan rumus: (Q - Q₁) / (Q₂ - Q₁) = (P - P₁) / (P₂ - P₁)

(Q - 20) / (40 - 20) = (P - 100.000) / (80.000 - 100.000)

(Q - 20) / 20 = (P - 100.000) / (-20.000)

Q - 20 = 20 × (P - 100.000) / (-20.000)

Q - 20 = -0,001P + 100

Q = -0,001P + 100 + 20

**Q = -0,001P + 120**

### ✅ Jawaban:
**Qd = -0,001P + 120** atau **Qd = 120 - 0,001P**

---

### Verifikasi Jawaban:
- Jika P = 100.000 → Qd = -0,001(100.000) + 120 = -100 + 120 = **20** ✓
- Jika P = 80.000 → Qd = -0,001(80.000) + 120 = -80 + 120 = **40** ✓
      `,
    },
    {
      id: 'perubahan-permintaan',
      title: 'Perubahan Permintaan',
      icon: '🔄',
      content: `
# Perubahan Permintaan

Ada **dua jenis** perubahan yang terjadi pada permintaan:

---

## 1. Pergerakan Sepanjang Kurva (Movement Along the Curve)

### Definisi:
Perubahan jumlah barang yang diminta **akibat perubahan harga barang itu sendiri**, dengan asumsi ceteris paribus.

### Ciri-ciri:
- Kurva permintaan **TIDAK bergeser**
- Terjadi **perpindahan titik** dari satu posisi ke posisi lain pada kurva yang sama
- Disebabkan oleh **perubahan harga barang itu sendiri**

### Contoh:
- Harga es jeruk turun dari Rp10.000 ke Rp6.000
- Permintaan naik dari 20 gelas ke 60 gelas
- Ini adalah pergerakan dari titik A ke titik C pada kurva yang sama

---

## 2. Pergeseran Kurva (Shift of the Curve)

### Definisi:
Perubahan jumlah barang yang diminta pada **setiap tingkat harga** akibat perubahan faktor-faktor selain harga.

### Ciri-ciri:
- Kurva permintaan **BERGESER** ke kiri atau ke kanan
- Terjadi karena faktor **NON-HARGA** berubah

### Jenis Pergeseran:

#### ➡️ Pergeseran ke Kanan (D₀ → D₁)
**Permintaan meningkat** pada setiap tingkat harga

**Penyebab:**
- Pendapatan naik (barang normal)
- Harga barang substitusi naik
- Harga barang komplementer turun
- Selera meningkat
- Jumlah penduduk bertambah
- Ekspektasi harga akan naik

#### ⬅️ Pergeseran ke Kiri (D₀ → D₂)
**Permintaan menurun** pada setiap tingkat harga

**Penyebab:**
- Pendapatan turun (barang normal)
- Harga barang substitusi turun
- Harga barang komplementer naik
- Selera menurun
- Jumlah penduduk berkurang
- Ekspektasi harga akan turun

---

## 📊 Tabel Perbandingan

| Aspek | Pergerakan Sepanjang Kurva | Pergeseran Kurva |
|-------|---------------------------|-----------------|
| Penyebab | Harga barang itu sendiri | Faktor non-harga |
| Kurva | Tetap di posisi sama | Bergeser kiri/kanan |
| Notasi | A → B pada D | D₀ → D₁ atau D₀ → D₂ |

---

## 🎯 Contoh Kasus

### Kasus 1: Pergerakan Sepanjang Kurva
> "Harga kopi di cafe naik dari Rp25.000 menjadi Rp35.000, sehingga pengunjung yang membeli kopi berkurang dari 100 menjadi 60 cangkir per hari."

✅ Ini adalah **pergerakan sepanjang kurva** karena disebabkan perubahan harga kopi itu sendiri.

### Kasus 2: Pergeseran Kurva
> "Tren diet sehat membuat permintaan jus buah meningkat dari 50 menjadi 80 gelas per hari pada setiap tingkat harga."

✅ Ini adalah **pergeseran kurva ke kanan** karena disebabkan perubahan selera (faktor non-harga).

---

*Coba simulasi pergeseran kurva di bagian interaktif!*
      `,
    },
  ],
  videos: [
    {
      id: 'video-1',
      title: 'Pengantar Konsep Permintaan',
      url: 'https://www.youtube.com/embed/OSDYAzU5v-I',
      description: 'Video pengenalan tentang konsep dasar permintaan dalam ekonomi',
    },
    {
      id: 'video-2',
      title: 'Hukum Permintaan dan Ceteris Paribus',
      url: 'https://www.youtube.com/embed/dq1KMVUt570',
      description: 'Penjelasan tentang hukum permintaan dan asumsi ceteris paribus',
    },
    {
      id: 'video-3',
      title: 'Membuat Kurva Permintaan',
      url: 'https://www.youtube.com/embed/ifzlTBn1xgU',
      description: 'Tutorial cara membuat tabel dan kurva permintaan',
    },
    {
      id: 'video-4',
      title: 'Fungsi dan Pergeseran Kurva Permintaan',
      url: 'https://www.youtube.com/embed/AUfiSTR9G5Y',
      description: 'Penjelasan fungsi permintaan dan pergeseran kurva',
    },
  ],
  quizQuestions: [
    {
      id: 'q1',
      question: 'Apa yang dimaksud dengan permintaan (demand)?',
      options: [
        'Jumlah barang yang tersedia di pasar',
        'Jumlah barang yang ingin dan mampu dibeli konsumen pada berbagai tingkat harga',
        'Jumlah barang yang diproduksi oleh produsen',
        'Keinginan konsumen tanpa mempertimbangkan kemampuan membeli',
      ],
      correctAnswer: 1,
      explanation: 'Permintaan adalah jumlah barang yang INGIN dan MAMPU dibeli oleh konsumen pada berbagai tingkat harga dalam periode waktu tertentu. Kata kunci: ingin + mampu + berbagai tingkat harga.',
    },
    {
      id: 'q2',
      question: 'Jika seseorang sangat ingin membeli iPhone terbaru tetapi tidak memiliki uang yang cukup, permintaan ini termasuk jenis...',
      options: [
        'Permintaan efektif',
        'Permintaan potensial',
        'Permintaan absolut',
        'Permintaan pasar',
      ],
      correctAnswer: 2,
      explanation: 'Permintaan absolut adalah permintaan yang hanya berupa keinginan tanpa didukung kemampuan membeli. Orang tersebut ingin tapi tidak mampu, sehingga termasuk permintaan absolut.',
    },
    {
      id: 'q3',
      question: 'Bunyi hukum permintaan yang benar adalah...',
      options: [
        'Jika harga naik maka permintaan naik',
        'Jika harga turun maka permintaan turun',
        'Jika harga naik maka permintaan turun, ceteris paribus',
        'Harga dan permintaan tidak memiliki hubungan',
      ],
      correctAnswer: 2,
      explanation: 'Hukum permintaan menyatakan bahwa ada hubungan TERBALIK antara harga dan jumlah yang diminta. Jika harga naik, permintaan turun (dengan asumsi ceteris paribus).',
    },
    {
      id: 'q4',
      question: 'Apa arti dari "ceteris paribus"?',
      options: [
        'Harga selalu berubah',
        'Semua faktor berubah bersamaan',
        'Faktor-faktor lain dianggap tetap',
        'Permintaan selalu sama',
      ],
      correctAnswer: 2,
      explanation: 'Ceteris paribus adalah istilah Latin yang berarti "hal-hal lain dianggap tetap". Ini digunakan untuk menganalisis hubungan antara dua variabel saja.',
    },
    {
      id: 'q5',
      question: 'Kurva permintaan memiliki slope negatif (miring ke kanan bawah) karena...',
      options: [
        'Harga dan permintaan berbanding lurus',
        'Harga dan permintaan berbanding terbalik',
        'Permintaan tidak dipengaruhi harga',
        'Produsen menentukan harga',
      ],
      correctAnswer: 1,
      explanation: 'Kurva permintaan berslope negatif karena adanya hubungan TERBALIK antara harga dan jumlah yang diminta. Semakin tinggi harga, semakin sedikit yang diminta.',
    },
    {
      id: 'q6',
      question: 'Jika diketahui titik A (P=5000, Q=100) dan titik B (P=3000, Q=140), berapa nilai slope (a)?',
      options: [
        '0,02',
        '-0,02',
        '50',
        '-50',
      ],
      correctAnswer: 1,
      explanation: 'Slope = ΔQ/ΔP = (140-100)/(3000-5000) = 40/(-2000) = -0,02. Slope kurva permintaan selalu negatif.',
    },
    {
      id: 'q7',
      question: 'Pergeseran kurva permintaan ke kanan menunjukkan...',
      options: [
        'Permintaan menurun pada setiap tingkat harga',
        'Permintaan meningkat pada setiap tingkat harga',
        'Harga barang tersebut naik',
        'Harga barang tersebut turun',
      ],
      correctAnswer: 1,
      explanation: 'Pergeseran kurva ke kanan menunjukkan PENINGKATAN permintaan pada setiap tingkat harga, yang disebabkan oleh faktor non-harga seperti kenaikan pendapatan atau perubahan selera.',
    },
    {
      id: 'q8',
      question: 'Manakah yang merupakan contoh pergerakan SEPANJANG kurva permintaan?',
      options: [
        'Pendapatan masyarakat meningkat',
        'Harga barang substitusi naik',
        'Harga barang itu sendiri turun dari Rp10.000 ke Rp8.000',
        'Terjadi perubahan selera konsumen',
      ],
      correctAnswer: 2,
      explanation: 'Pergerakan sepanjang kurva HANYA disebabkan oleh perubahan harga barang itu sendiri. Faktor lain (pendapatan, harga barang lain, selera) menyebabkan pergeseran kurva.',
    },
    {
      id: 'q9',
      question: 'Barang Giffen adalah pengecualian hukum permintaan karena...',
      options: [
        'Harga turun, permintaan turun',
        'Harga naik, permintaan naik',
        'Permintaan tidak terpengaruh harga',
        'Merupakan barang mewah',
      ],
      correctAnswer: 1,
      explanation: 'Barang Giffen adalah barang inferior yang justru permintaannya NAIK ketika harganya NAIK. Ini terjadi karena efek pendapatan yang sangat kuat pada konsumen berpenghasilan rendah.',
    },
    {
      id: 'q10',
      question: 'Permintaan pasar adalah...',
      options: [
        'Permintaan satu orang konsumen',
        'Penjumlahan seluruh permintaan individu',
        'Permintaan yang didukung daya beli',
        'Permintaan barang mewah',
      ],
      correctAnswer: 1,
      explanation: 'Permintaan pasar adalah TOTAL dari semua permintaan individu dalam suatu pasar. Misalnya, jika ada 100 konsumen yang masing-masing minta 5 unit, permintaan pasar = 500 unit.',
    },
  ],
  glossary: {
    'Permintaan (Demand)': 'Jumlah barang atau jasa yang ingin dan mampu dibeli konsumen pada berbagai tingkat harga dalam periode waktu tertentu.',
    'Hukum Permintaan': 'Jika harga naik, jumlah yang diminta turun; jika harga turun, jumlah yang diminta naik (ceteris paribus).',
    'Ceteris Paribus': 'Asumsi bahwa faktor-faktor lain dianggap tetap/tidak berubah.',
    'Kurva Permintaan': 'Grafik yang menunjukkan hubungan antara harga dan jumlah barang yang diminta.',
    'Permintaan Efektif': 'Permintaan yang disertai keinginan dan kemampuan membeli.',
    'Permintaan Potensial': 'Permintaan yang memiliki kemampuan membeli tetapi belum ada keinginan.',
    'Permintaan Absolut': 'Permintaan berupa keinginan saja tanpa kemampuan membeli.',
    'Permintaan Individu': 'Permintaan oleh satu orang konsumen.',
    'Permintaan Pasar': 'Penjumlahan dari seluruh permintaan individu.',
    'Fungsi Permintaan': 'Persamaan matematika yang menunjukkan hubungan harga dan jumlah diminta (Qd = -aP + b).',
    'Barang Substitusi': 'Barang pengganti yang dapat menggantikan fungsi barang lain.',
    'Barang Komplementer': 'Barang pelengkap yang digunakan bersama barang lain.',
    'Barang Giffen': 'Barang inferior yang permintaannya naik ketika harganya naik.',
    'Barang Veblen': 'Barang mewah yang permintaannya naik ketika harganya naik karena faktor prestise.',
    'Slope Kurva': 'Kemiringan kurva yang menunjukkan perubahan jumlah permintaan per unit perubahan harga.',
    'Pergeseran Kurva': 'Perpindahan posisi kurva ke kiri atau kanan akibat faktor non-harga.',
    'Efek Substitusi': 'Perubahan permintaan karena konsumen beralih ke barang pengganti.',
    'Efek Pendapatan': 'Perubahan permintaan karena daya beli konsumen berubah.',
  },
};

export const supplyModule: Module = {
  id: 'penawaran',
  title: 'Penawaran (Supply)',
  subtitle: 'dan Kurva Penawaran',
  description: 'Mempelajari konsep penawaran dalam ekonomi, faktor-faktor yang mempengaruhi penawaran, hukum penawaran, serta cara membuat dan menganalisis kurva penawaran.',
  objectives: [
    'Menjelaskan pengertian penawaran (supply)',
    'Mengidentifikasi faktor-faktor yang memengaruhi penawaran',
    'Menjelaskan hukum penawaran',
    'Menganalisis kurva penawaran dan fungsi penawaran',
    'Membedakan gerakan sepanjang kurva dan pergeseran kurva penawaran',
  ],
  prerequisites: [
    'Memahami konsep dasar ekonomi',
    'Memahami peran produsen dalam kegiatan ekonomi',
    'Kemampuan dasar matematika (persamaan linear)',
  ],
  duration: '3 JP (3 x 45 menit)',
  sections: [
    {
      id: 'pengertian-faktor',
      title: 'Pengertian & Faktor Penawaran',
      icon: '📦',
      content: `
# 1. Pengertian
**Penawaran (supply)** adalah jumlah barang atau jasa yang akan dijual (ditawarkan) pada tingkat harga tertentu. Dari pengertian tersebut tampak bahwa penawaran ditinjau dari sudut **produsen/penjual**.

# 2. Faktor-Faktor yang Memengaruhi Penawaran
Penawaran datang dari pihak penjual sebagai pihak yang menyediakan barang dan jasa dalam perekonomian. Penawaran terhadap suatu barang dipengaruhi oleh berbagai hal, antara lain sebagai berikut.

### a. Harga Barang atau Jasa Lain
Selain dapat memengaruhi permintaan, harga barang atau jasa lain juga dapat memengaruhi penawaran. **Barang substitusi** ataupun **komplementer** berhubungan satu sama lain dan akan saling memengaruhi.

### b. Biaya Produksi
Biaya produksi berkaitan dengan biaya yang harus dikeluarkan oleh produsen untuk memproduksi barang. 
- Dalam memproduksi suatu barang, produsen akan memperhatikan **efektivitas** dan **efisiensi**. 
- Semakin efektif dan efisien proses produksi, maka **biaya produksi akan semakin sedikit**. 
- Hal ini tentu saja juga akan memengaruhi penawaran barang.

### c. Teknologi
Perkembangan teknologi juga memengaruhi penawaran. Perusahaan yang mampu memanfaatkan teknologi dengan baik dalam proses produksi akan menghasilkan barang **lebih banyak** dengan **biaya yang lebih murah**.

### d. Perkiraan Harga pada Masa Depan
Pada situasi dan kondisi tertentu perusahaan dapat memprediksi tingkat kebutuhan atas suatu barang atau jasa. Prediksi tersebut akan memudahkan suatu perusahaan menentukan perkiraan harga pada masa depan.

### e. Pajak
Pajak merupakan kontribusi atau pungutan yang wajib dibayarkan masyarakat kepada negara dengan kriteria tertentu. 
- Pajak yang dikenakan terhadap barang atau jasa akan **menambah harga** barang atau jasa yang ditawarkan. 
- **Beban pajak tinggi** akan mengakibatkan harga barang naik sehingga berpotensi pada kuantitas barang yang ditawarkan akan **turun**. 
- Meskipun demikian, produsen juga akan mengalihkan sebagian tanggungan pajaknya pada konsumen.

### f. Subsidi
Subsidi adalah bantuan yang diberikan pemerintah kepada produsen agar harga yang ditawarkan sesuai dengan harapan pemerintah. 
- Bantuan keuangan yang diterima oleh produsen akan **menurunkan harga** barang atau jasa yang akan ditawarkan di pasar. 
- Pemberian subsidi berpotensi dapat **meningkatkan penawaran**.
      `,
    },
    {
      id: 'hukum-kurva',
      title: 'Hukum & Kurva Penawaran',
      icon: '📈',
      content: `
# 3. Hukum Penawaran
Hukum penawaran menjelaskan tentang hubungan antara harga barang dan jumlah barang yang ditawarkan penjual. **Jumlah barang berhubungan secara positif dengan harga barang tersebut.**

> **Bunyi Hukum Penawaran:**
> "Semakin **tinggi** harga barang, semakin **banyak** barang yang akan dijual (ditawarkan) produsen. Sebaliknya, semakin **rendah** harga barang, jumlah barang yang dijual (ditawarkan) produsen semakin **sedikit**".

# 4. Kurva dan Fungsi Penawaran

### a. Kurva Penawaran
Kurva penawaran berslop **positif** dan berbentuk miring dari **kiri bawah ke kanan atas**. 

**Contoh Tabel Penawaran:**

| Titik | Harga Barang (Rp) | Kuantitas (Unit) |
| :--- | :--- | :--- |
| A | 10.000 | 100 |
| B | 15.000 | 150 |
| C | 20.000 | 200 |
| D | 25.000 | 250 |

# 5. Fungsi Penawaran
Fungsi penawaran merupakan bentuk matematis untuk menyusun daftar penawaran pada berbagai kemungkinan tingkat harga. 

**Bentuk umum fungsi penawaran:**
$$ Qs = aP + b $$
*atau*
$$ P = aQ + b $$
      `,
    },
    {
      id: 'gerakan-pergeseran',
      title: 'Gerakan & Pergeseran Kurva',
      icon: '🔄',
      content: `
# 6. Gerakan Sepanjang Kurva Penawaran dan Pergeseran Kurva Penawaran

### a. Gerakan Sepanjang Kurva Penawaran
Penurunan atau kenaikan **harga suatu barang** dapat menimbulkan gerakan sepanjang kurva penawaran.

- **Kurva penawaran adalah SS.**
- Pada saat harga $P$, jumlah barang yang ditawarkan adalah $Q$ berada pada titik $L$.
- Pada saat harga **naik** menjadi $P_1$, jumlah barang yang ditawarkan juga **bertambah** menjadi $Q_1$, serta hubungan antara $P_1$ dan $Q_1$ ditunjukkan pada titik $K$. Pada keadaan ini kurva penawaran akan bergerak ke **atas (ke kanan)**.
- Pada saat harga **turun** menjadi $P_2$, jumlah barang yang ditawarkan juga **berkurang** menjadi $Q_2$, serta hubungan antara $P_2$ dan $Q_2$ ditunjukkan pada titik $M$. Pada keadaan ini kurva penawaran akan bergerak ke **bawah (ke kiri)**.

### b. Pergeseran Kurva Penawaran
Perubahan **faktor-faktor lain selain harga**, misalnya adanya **pajak** atau **subsidi**, **biaya produksi**, dan **teknologi** dapat menimbulkan pergeseran kurva penawaran.

- Perubahan pada jumlah barang yang ditawarkan merupakan salah satu akibat dari pergeseran kurva penawaran.
- Kurva tersebut menunjukkan pergeseran kurva penawaran dari $SS$ ke $S_1 S_1$, disebabkan oleh jumlah barang yang ditawarkan **bertambah** dari $Q$ menjadi $Q_1$, walaupun harga tetap sebesar $P$.
- Perubahan jumlah barang yang ditawarkan dari $Q$ ke $Q_2$ menyebabkan pergeseran kurva penawaran yang ditunjukkan oleh $SS$ ke $S_2 S_2$ (berkurang).
      `,
    },
  ],
  videos: [
    {
      id: 'video-s1',
      title: 'Konsep Dasar Penawaran',
      url: 'https://www.youtube.com/embed/oBY7ST6GdpQ',
      description: 'Penjelasan tentang pengertian dan konsep dasar penawaran.',
    },
    {
      id: 'video-s2',
      title: 'Faktor Penawaran',
      url: 'https://www.youtube.com/embed/TC5Bko5SvWg',
      description: 'Video penjelasan faktor-faktor yang memengaruhi penawaran.',
    }
  ],
  quizQuestions: Array.from({ length: 50 }, (_, i) => {
    const questions = [
      // 1-10: Pengertian & Konsep Dasar
      { q: 'Penawaran ditinjau dari sudut pandang siapa?', opts: ['Pembeli', 'Produsen/Penjual', 'Pemerintah', 'Distributor'], ans: 1, exp: 'Penawaran adalah jumlah barang yang ditawarkan oleh penjual/produsen.' },
      { q: 'Apa definisi dari penawaran?', opts: ['Jumlah barang yang dibeli konsumen', 'Jumlah barang yang tersedia dan dijual pada tingkat harga tertentu', 'Jumlah barang yang diproduksi pabrik', 'Keinginan konsumen membeli barang'], ans: 1, exp: 'Penawaran adalah jumlah barang/jasa yang akan dijual pada tingkat harga tertentu.' },
      { q: 'Hubungan antara harga dan jumlah penawaran adalah...', opts: ['Positif', 'Negatif', 'Netral', 'Tidak berhubungan'], ans: 0, exp: 'Bersifat positif: harga naik, penawaran naik.' },
      { q: 'Manakah yang BUKAN merupakan faktor yang memengaruhi penawaran?', opts: ['Biaya produksi', 'Selera konsumen', 'Teknologi', 'Pajak'], ans: 1, exp: 'Selera konsumen memengaruhi Permintaan, bukan Penawaran.' },
      { q: 'Apa tujuan utama produsen dalam melakukan penawaran?', opts: ['Mencari keuntungan', 'Memuaskan konsumen', 'Mengurangi stok', 'Membayar pajak'], ans: 0, exp: 'Motif utama produsen adalah profit/keuntungan.' },
      { q: 'Dalam hukum penawaran, asumsi yang digunakan adalah...', opts: ['Ceteris Paribus', 'Mutatis Mutandis', 'Vice Versa', 'Ipso Facto'], ans: 0, exp: 'Faktor lain dianggap tetap (Ceteris Paribus).' },
      { q: 'Jika harga barang naik, maka jumlah barang yang ditawarkan akan...', opts: ['Turun', 'Tetap', 'Naik', 'Hilang'], ans: 2, exp: 'Sesuai hukum penawaran, harga naik -> penawaran naik.' },
      { q: 'Kata "Supply" dalam bahasa Indonesia berarti...', opts: ['Permintaan', 'Penawaran', 'Pasar', 'Harga'], ans: 1, exp: 'Supply = Penawaran.' },
      { q: 'Pihak yang menyediakan barang dan jasa disebut...', opts: ['Konsumen', 'Produsen', 'Regulator', 'Kreditor'], ans: 1, exp: 'Produsen adalah penyedia barang.' },
      { q: 'Penawaran berkaitan erat dengan perilaku...', opts: ['Penjual', 'Pembeli', 'Pemerintah', 'Bank'], ans: 0, exp: 'Penawaran mencerminkan perilaku penjual.' },

      // 11-20: Faktor-Faktor (Biaya, Teknologi, Pajak, Subsidi)
      { q: 'Jika biaya produksi meningkat, apa yang terjadi pada penawaran?', opts: ['Meningkat', 'Menurun', 'Tetap', 'Tidak tentu'], ans: 1, exp: 'Biaya mahal membuat produsen mengurangi produksi -> penawaran turun.' },
      { q: 'Penggunaan teknologi modern dalam produksi akan mengakibatkan...', opts: ['Biaya produksi naik', 'Penawaran menurun', 'Penawaran meningkat', 'Kualitas menurun'], ans: 2, exp: 'Teknologi meningkatkan efisiensi -> produksi naik -> penawaran naik.' },
      { q: 'Pemberian subsidi oleh pemerintah akan berdampak pada...', opts: ['Kenaikan harga', 'Penurunan penawaran', 'Peningkatan penawaran', 'Penurunan produksi'], ans: 2, exp: 'Subsidi menurunkan biaya bagi produsen -> penawaran meningkat.' },
      { q: 'Pajak yang tinggi akan menyebabkan kurva penawaran bergeser ke...', opts: ['Kanan', 'Kiri', 'Atas kanan', 'Bawah kanan'], ans: 1, exp: 'Pajak tinggi = biaya naik = penawaran turun = geser kiri.' },
      { q: 'Prediksi harga masa depan yang tinggi akan membuat produsen saat ini...', opts: ['Menambah penjualan', 'Menahan/mengurangi penjualan', 'Menurunkan harga', 'Obral barang'], ans: 1, exp: 'Produsen menahan stok untuk dijual nanti saat harga mahal.' },
      { q: 'Barang pengganti yang dapat memengaruhi penawaran disebut...', opts: ['Barang komplementer', 'Barang substitusi', 'Barang mewah', 'Barang inferior'], ans: 1, exp: 'Barang substitusi.' },
      { q: 'Efisiensi dalam proses produksi berkaitan dengan faktor...', opts: ['Pajak', 'Subsidi', 'Biaya Produksi', 'Selera'], ans: 2, exp: 'Efektivitas dan efisiensi berkaitan dengan biaya produksi.' },
      { q: 'Jika harga barang substitusi naik, produsen mungkin akan...', opts: ['Beralih memproduksi barang substitusi tersebut', 'Tetap memproduksi barang lama', 'Berhenti produksi', 'Menurunkan harga'], ans: 0, exp: 'Karena barang substitusi harganya lebih menarik (mahal), produsen beralih ke sana.' },
      { q: 'Kontribusi wajib kepada negara yang memengaruhi harga barang disebut...', opts: ['Subsidi', 'Pajak', 'Laba', 'Upah'], ans: 1, exp: 'Definisi pajak.' },
      { q: 'Manakah yang akan menggeser kurva penawaran ke kanan?', opts: ['Kenaikan pajak', 'Bencana alam', 'Pemberian subsidi', 'Kenaikan upah buruh'], ans: 2, exp: 'Subsidi meningkatkan penawaran (geser kanan).' },

      // 21-30: Hukum & Kurva
      { q: 'Kurva penawaran bergerak dari...', opts: ['Kiri atas ke kanan bawah', 'Kiri bawah ke kanan atas', 'Horisontal', 'Vertikal'], ans: 1, exp: 'Slope positif: kiri bawah ke kanan atas.' },
      { q: 'Kemiringan (slope) kurva penawaran adalah...', opts: ['Positif', 'Negatif', 'Nol', 'Tak terhingga'], ans: 0, exp: 'Slope positif.' },
      { q: 'Gerakan sepanjang kurva penawaran disebabkan oleh...', opts: ['Perubahan teknologi', 'Perubahan pajak', 'Perubahan pendapatan', 'Perubahan harga barang itu sendiri'], ans: 3, exp: 'Hanya harga barang itu sendiri yang menyebabkan gerakan sepanjang kurva.' },
      { q: 'Jika harga turun dari P1 ke P2, maka titik pada kurva akan bergerak ke...', opts: ['Atas/Kanan', 'Bawah/Kiri', 'Pindah kurva', 'Tetap'], ans: 1, exp: 'Harga turun -> jumlah turun -> gerak ke kiri bawah.' },
      { q: 'Tabel yang menunjukkan hubungan harga dan jumlah penawaran disebut...', opts: ['Skedul permintaan', 'Skedul penawaran', 'Grafik pasar', 'Tabel periodik'], ans: 1, exp: 'Skedul penawaran.' },
      { q: 'Pada kurva penawaran, sumbu vertikal (tegak) menggambarkan...', opts: ['Kuantitas (Q)', 'Harga (P)', 'Pendapatan (Y)', 'Biaya (C)'], ans: 1, exp: 'Sumbu Y adalah Harga (P).' },
      { q: 'Pada kurva penawaran, sumbu horizontal (mendatar) menggambarkan...', opts: ['Kuantitas (Q)', 'Harga (P)', 'Waktu (t)', 'Laba (R)'], ans: 0, exp: 'Sumbu X adalah Kuantitas (Q).' },
      { q: 'Bentuk kurva penawaran lurus vertikal menunjukkan penawaran bersifat...', opts: ['Elastis sempurna', 'Inelastis sempurna', 'Elastis', 'Inelastis'], ans: 1, exp: 'Vertikal = Inelastis sempurna (jumlah tetap berapapun harganya).' },
      { q: 'Simbol untuk jumlah barang yang ditawarkan adalah...', opts: ['Qd', 'Qs', 'P', 'E'], ans: 1, exp: 'Qs = Quantity Supplied.' },
      { q: 'Apa yang terjadi pada kurva jika jumlah penawaran bertambah pada harga yang sama?', opts: ['Bergeser ke kanan', 'Bergeser ke kiri', 'Bergerak ke atas', 'Bergerak ke bawah'], ans: 0, exp: 'Penawaran bertambah = geser kanan.' },

      // 31-40: Analisis Kasus & Logika
      { q: 'Pak Budi petani durian. Saat harga naik, ia semangat menjual. Ini contoh...', opts: ['Hukum Permintaan', 'Hukum Penawaran', 'Hukum Gossen', 'Hukum Ekonomi'], ans: 1, exp: 'Sesuai hukum penawaran.' },
      { q: 'Pabrik sepatu menggunakan robot baru. Dampaknya...', opts: ['Kurva S geser kiri', 'Kurva S geser kanan', 'Kurva D geser kanan', 'Tidak ada perubahan'], ans: 1, exp: 'Teknologi (robot) -> efisiensi -> S geser kanan.' },
      { q: 'Pemerintah menaikkan cukai rokok. Dampaknya bagi pabrik rokok...', opts: ['Menambah produksi', 'Mengurangi penawaran rokok', 'Harga rokok turun', 'Kurva geser kanan'], ans: 1, exp: 'Cukai/Pajak naik -> biaya naik -> penawaran turun.' },
      { q: 'Petani gagal panen karena hama. Kurva penawaran beras akan...', opts: ['Geser ke kiri', 'Geser ke kanan', 'Tetap', 'Menjadi vertikal'], ans: 0, exp: 'Gagal panen -> jumlah barang berkurang -> geser kiri.' },
      { q: 'Harga bensin naik. Bagaimana penawaran jasa ojek online?', opts: ['Cenderung turun jika tarif tetap', 'Meningkat pesat', 'Tidak berpengaruh', 'Sangat elastis'], ans: 0, exp: 'Bensin adalah biaya produksi ojek. Biaya naik -> penawaran turun (supir malas narik jika tarif tidak naik).' },
      { q: 'Jika harga 10.000 jml 50, harga 12.000 jml 60. Ini menunjukkan...', opts: ['Fungsi permintaan', 'Fungsi penawaran', 'Titik keseimbangan', 'Elastisitas silang'], ans: 1, exp: 'Harga naik, jumlah naik -> Penawaran.' },
      { q: 'Apa dampak kenaikan UMR (Upah Minimum) terhadap kurva penawaran perusahaan padat karya?', opts: ['Geser kanan', 'Geser kiri', 'Bergerak sepanjang kurva', 'Tidak berubah'], ans: 1, exp: 'Upah naik = biaya produksi naik -> penawaran turun (geser kiri).' },
      { q: 'Perusahaan mebel beralih menggunakan kayu legal yang mahal. Penawaran mebel murah akan...', opts: ['Bertambah', 'Berkurang', 'Stabil', 'Nol'], ans: 1, exp: 'Biaya bahan baku mahal -> penawaran berkurang.' },
      { q: 'Ditemukannya ladang minyak baru akan membuat kurva penawaran minyak...', opts: ['Geser kanan', 'Geser kiri', 'Tetap', 'Hilang'], ans: 0, exp: 'Sumber daya bertambah -> penawaran naik (geser kanan).' },
      { q: 'Pemberian insentif pajak bagi UMKM bertujuan untuk...', opts: ['Menurunkan penawaran', 'Meningkatkan penawaran UMKM', 'Mengurangi jumlah UMKM', 'Meningkatkan impor'], ans: 1, exp: 'Insentif pajak = pengurangan pajak -> biaya turun -> penawaran naik.' },

      // 41-50: Soal Hitungan & Fungsi
      { q: 'Diketahui P1=1000 Q1=10, P2=2000 Q2=20. Fungsi penawarannya?', opts: ['Qs = 0.01P', 'Qs = -0.01P', 'Qs = 100P', 'Qs = P - 100'], ans: 0, exp: 'm = (20-10)/(2000-1000) = 10/1000 = 0.01. Q-10 = 0.01(P-1000) -> Q = 0.01P.' },
      { q: 'Jika fungsi Qs = 2P - 10, berapa Qs saat P = 20?', opts: ['10', '20', '30', '40'], ans: 2, exp: 'Qs = 2(20) - 10 = 40 - 10 = 30.' },
      { q: 'Fungsi Qs = -100 + 4P. Jika harga P=50, maka Qs...', opts: ['50', '100', '150', '200'], ans: 1, exp: 'Qs = -100 + 4(50) = -100 + 200 = 100.' },
      { q: 'Pada fungsi Qs = aP + b, nilai "a" seharusnya...', opts: ['Positif', 'Negatif', 'Nol', 'Tak terdefinisi'], ans: 0, exp: 'Slope penawaran positif.' },
      { q: 'Titik potong kurva Qs = 2P - 20 pada sumbu P (saat Q=0) adalah...', opts: ['10', '20', '-20', '0'], ans: 0, exp: '0 = 2P - 20 -> 2P = 20 -> P = 10.' },
      { q: 'Jika fungsi penawaran P = 2Q + 400. Berapa harga saat jumlah 100 unit?', opts: ['500', '600', '400', '200'], ans: 1, exp: 'P = 2(100) + 400 = 200 + 400 = 600.' },
      { q: 'Diketahui tabel: A(500, 50), B(1000, 100). Koefisien elastisitasnya?', opts: ['1', '0.5', '2', '0'], ans: 0, exp: 'Tepatnya fungsi linear Q=0.1P, unitary elastic di titik asal, tapi soal ini menanyakan fungsi linear sederhana' },
      { q: 'Bentuk fungsi penawaran linier adalah...', opts: ['P = a - bQ', 'P = a + bQ', 'P = a/Q', 'P = Q^2'], ans: 1, exp: 'P = a + bQ (gradien positif).' },
      { q: 'Jika Qs = 5P. Ini berarti...', opts: ['Tidak ada konstanta tetap', 'Penawaran minus', 'Permintaan', 'Salah rumus'], ans: 0, exp: 'Kurva mulai dari titik origin (0,0).' },
      { q: 'Dalam persamaan Qs = -50 + 10P, angka 10 menunjukkan...', opts: ['Slope/Kemiringan', 'Konstanta', 'Harga', 'Kuantitas'], ans: 0, exp: 'Koefisien variabel bebas (P) adalah slope.' },
    ];
    const q = questions[i % questions.length];
    return {
      id: `q${i + 1}`,
      question: q.q,
      options: q.opts,
      correctAnswer: q.ans,
      explanation: q.exp,
    };
  }),
  glossary: {
    'Penawaran (Supply)': 'Jumlah barang/jasa yang dijual pada tingkat harga tertentu.',
    'Produsen': 'Pihak yang menyediakan/menjual barang dan jasa.',
    'Hukum Penawaran': 'Prinsip bahwa harga tinggi meningkatkan jumlah yang ditawarkan, dan sebaliknya.',
    'Ceteris Paribus': 'Faktor-faktor lain selain harga dianggap tetap.',
    'Barang Substitusi': 'Barang pengganti yang dapat memengaruhi penawaran barang lain.',
    'Barang Komplementer': 'Barang pelengkap.',
    'Biaya Produksi': 'Biaya yang dikeluarkan untuk memproduksi barang (efisiensi memengaruhi penawaran).',
    'Teknologi': 'Sarana produksi yang jika berkembang dapat meningkatkan penawaran.',
    'Subsidi': 'Bantuan pemerintah yang menurunkan biaya produksi.',
    'Pajak': 'Pungutan negara yang menambah biaya dan menurunkan penawaran.',
    'Kurva Penawaran': 'Grafik hubungan P dan Qs yang berslope positif.',
    'Slope Positif': 'Kemiringan kurva dari kiri bawah ke kanan atas.',
    'Pergeseran Kurva': 'Perubahan kurva ke kiri/kanan akibat faktor non-harga.',
    'Gerakan Sepanjang Kurva': 'Perubahan titik pada kurva akibat perubahan harga barang itu sendiri.',
    'Prediksi Harga Masa Depan': 'Ekspektasi produsen terhadap harga yang akan datang.',
  },
};

export const ekonomiPasarModule: Module = {
  id: 'pasar',
  title: 'PASAR',
  subtitle: 'Konsep dan Struktur Pasar',
  description: 'Mempelajari konsep pasar dalam ekonomi, berbagai struktur pasar, serta peran perkembangan iptek terhadap jenis pasar dan pasar input.',
  objectives: [
    'Menjelaskan pengertian pasar serta syarat-syarat terbentuknya pasar.',
    'Mengidentifikasi fungsi dan peranan pasar dalam kegiatan ekonomi.',
    'Mengklasifikasikan berbagai macam pasar berdasarkan jenis, wujud, jangkauan, waktu, tempat, dan barang yang diperjualbelikan.',
    'Menganalisis struktur pasar yang meliputi pasar persaingan sempurna dan pasar persaingan tidak sempurna (monopoli, oligopoli, dan monopolistik).',
    'Menjelaskan peran perkembangan ilmu pengetahuan dan teknologi terhadap perubahan jenis dan struktur pasar.',
    'Mengidentifikasi pengertian serta jenis-jenis pasar input dalam kegiatan ekonomi.',
  ],
  prerequisites: [
    'Konsep dasar kegiatan ekonomi (produksi, distribusi, dan konsumsi).',
    'Pengertian permintaan dan penawaran dalam kegiatan ekonomi.',
    'Mekanisme terbentuknya harga dalam kegiatan pasar.',
  ],
  duration: '6 JP (2 × Pertemuan × 3 JP × 45 menit)',
  meaningfulUnderstanding: 'Kegiatan jual beli merupakan bagian penting dalam kehidupan ekonomi masyarakat. Melalui interaksi antara penjual dan pembeli, kebutuhan manusia dapat terpenuhi dan harga barang terbentuk. Perkembangan teknologi juga membuat kegiatan jual beli tidak hanya terjadi secara langsung, tetapi juga melalui media digital. Memahami hal ini membantu peserta didik mengenali bagaimana kegiatan ekonomi berlangsung dalam kehidupan sehari-hari.',
  sections: [
    {
      id: 'pengertian-syarat',
      title: '1. Pengertian & Syarat',
      icon: '🏪',
      content: `
# 🏪 1. Pengertian dan Syarat Pasar

> Pasar sebagai pusat pertemuan penjual dan pembeli (produsen dan konsumen), telah dikenal sejak zaman dahulu. Ketika pertama kali muncul, perdagangan masih berupa pertukaran barang dengan barang (**barter**) yang awalnya berada di persimpangan jalur lalu lintas yang penting, seperti di pelabuhan. Pasar kemudian meluas, baik bentuk dan jenis komoditas yang dijual maupun proses transaksinya.

---

### 🔍 Pengertian Pasar
Pasar dalam **arti sempit** diartikan sebagai tempat bertemunya penjual dan pembeli untuk bertransaksi barang dan jasa. Dalam **arti luas**, pasar merupakan suatu proses di mana penjual dan pembeli saling berinteraksi untuk menetapkan harga keseimbangan. Secara umum, pasar adalah tempat bertemunya permintaan dan penawaran sehingga dapat menetapkan harga.

### 📋 Syarat Pasar
Terjadinya sebuah pasar diperlukan syarat-syarat, antara lain:
1. Terdapat **penjual dan pembeli**.
2. Tersedia **barang dan jasa** yang diperjualbelikan.
3. Terjadinya **transaksi** antara penjual dan pembeli melalui proses tawar-menawar.
4. Tersedia **media** untuk interaksi antara penjual dan pembeli.
      `,
    },
    {
      id: 'fungsi-peran',
      title: '2. Fungsi & Peranan',
      icon: '⚙️',
      content: `
# ⚙️ 2. Fungsi dan Peranan Pasar

Dalam kenyataannya pasar mempunyai tiga fungsi utama yaitu sebagai berikut:

| Fungsi | Penjelasan |
| :--- | :--- |
| **a. Fungsi distribusi** | Pasar memungkinkan produsen berhubungan dengan konsumen, baik secara langsung maupun tidak langsung dengan perantara dalam perdagangan. |
| **b. Fungsi pembentukan harga** | Harga pasar akan terbentuk dengan adanya kesepakatan antara pembeli dan penjual. |
| **c. Fungsi promosi** | Pasar dapat digunakan oleh produsen untuk memperkenalkan barang yang diproduksinya. Hal ini terutama untuk barang-barang baru. |

---

### 👥 Peranan Pasar
Adapun peran pasar yaitu sebagai berikut:

*   **a. Peranan pasar bagi produsen**: Pasar dapat membantu memperlancar penjualan hasil produksi, sebagai tempat untuk mempromosikan barang dan hasil produksi, serta produsen juga dapat memperoleh barang atau jasa yang akan digunakan untuk keperluan proses produksi.
*   **b. Peranan pasar bagi konsumen**: Memudahkan memperoleh barang atau jasa yang dibutuhkan.
*   **c. Peranan pasar bagi pembangunan**: Pasar juga menyediakan segala macam barang dan jasa yang bermanfaat bagi pembangunan. Pasar juga dapat dijadikan sebagai sumber pendapatan pemerintah untuk membiayai pembangunan melalui pajak dan retribusi.
*   **d. Peranan pasar bagi sumber daya manusia**: Pasar turut membantu mengurangi pengangguran, memanfaatkan sumber daya manusia, serta membuka lapangan kerja.
      `,
    },
    {
      id: 'macam-pasar',
      title: '3. Macam-Macam Pasar',
      icon: '📦',
      content: `
# 📦 3. Macam-Macam Pasar

Berikut adalah pengelompokan pasar berdasarkan berbagai kriteria:

1.  **Menurut jenisnya**: Pasar terdiri atas pasar barang konsumsi dan pasar faktor produksi.
2.  **Menurut wujudnya**: Pasar dibedakan atas pasar konkret dan pasar abstrak.
3.  **Menurut luas jangkauan distribusi**: Pasar terdiri atas pasar lokal, daerah, nasional, dan internasional.
4.  **Menurut waktu jual beli**: Pasar terdiri atas pasar harian, mingguan, bulanan, dan tahunan.
5.  **Menurut nama tempat atau daerah**: Yang termasuk jenis pasar ini antara lain Pasar Cikini, Pasar Kramat Jati, dan sebagainya.
6.  **Menurut barang yang dijual**: Yang termasuk jenis pasar ini antara lain pasar buah, pasar sayur, pasar ikan, dan sebagainya.
      `,
    },
    {
      id: 'struktur-pasar',
      title: '4. Struktur Pasar',
      icon: '💎',
      content: `
# 💎 4. Struktur Pasar

Jenis-jenis pasar dalam pasar barang terdiri atas **pasar persaingan sempurna** dan **pasar persaingan tidak sempurna**.

---

### ✨ a. Pasar Persaingan Sempurna
Pasar persaingan sempurna adalah suatu bentuk interaksi antara permintaan dan penawaran yang ditandai oleh jumlah produsen dan konsumen yang sangat banyak serta hampir tidak terbatas. 

> **Pasar persaingan sempurna** merupakan struktur pasar yang paling ideal karena dianggap struktur pasar yang dapat menjamin terwujudnya kegiatan memproduksi barang atau jasa yang memiliki efisiensi optimal.

**Ciri-ciri pasar persaingan sempurna:**
*   Terdapat banyak penjual dan pembeli.
*   Barang yang diperdagangkan homogen (serupa).
*   Setiap perusahaan bebas keluar atau masuk.
*   Pembeli mengetahui kondisi pasar.
*   Faktor-faktor produksi bergerak bebas.
*   Perusahaan menerima harga yang ditentukan pasar.
*   Tidak ada campur tangan pemerintah.

**Kelebihan:**
- Tidak memerlukan adanya iklan.
- Tidak tampak kegiatan saling menyaingi antarpelaku.
- Adanya satu harga.
- Kepuasan konsumen maksimal karena bebas memilih.
- Keuntungan produsen maksimal karena dapat menjual barang sebanyak-banyaknya.
- Produksi barang yang diperlukan konsumen dengan biaya minimal.

**Kekurangan:**
- Tidak ada pilihan bagi konsumen untuk memilih barang karena semua barang sama dan sejenis.
- Pekerja menerima gaji atau upah yang rendah.
- Perusahaan tidak mempunyai anggaran untuk mengadakan penelitian karena keuntungan hanya memperoleh keuntungan normal.

---

### 🏢 b. Pasar Persaingan Tidak Sempurna

#### 1) Pasar Monopoli
Pasar monopoli adalah suatu bentuk pasar yang hanya ada satu penjual yang menguasai perdagangan barang atau jasa sehingga pembeli tidak bisa mendapatkan barang pengganti (substitusi). Oleh karena hanya ada satu penjual, penjual dapat menentukan harga dan memperoleh keuntungan yang tinggi.

*   **Kelebihan Monopoli:**
    a. Menghindari produk-produk tiruan dan persaingan yang tidak bermanfaat.
    b. Menimbulkan skala ekonomi yang menurunkan biaya produksi.
    c. Terciptanya kesinambungan stabilitas perusahaan.
    d. Mendorong penggunaan mesin-mesin generasi terbaru dengan tingkat teknologi tinggi.
    e. Mendorong peningkatan kinerja departemen penelitian dan pengembangan.
*   **Kekurangan Monopoli:**
    a. Penyalahgunaan kekuatan ekonomi.
    b. Pembeli tidak memiliki alternatif hasil pilihan barang yang dibeli.
    c. Adanya kesenjangan dalam pembagian pendapatan.
    d. Tidak ada persaingan.
    e. Mengurangi kesejahteraan konsumen.

#### 2) Pasar Oligopoli
Pasar oligopoli adalah suatu bentuk pasar di mana hanya terdapat beberapa produsen atau sedikit perusahaan yang menjual produk-produk yang identik atau hampir sama dengan jumlah pembeli yang banyak.
Adakalanya pasar oligopoli terdiri atas dua perusahaan saja yang disebut **duopoli**.

*   **Kelebihan Oligopoli:**
    a. Terdapat sedikit penjual karena dibutuhkan investasi besar untuk masuk ke pasar.
    b. Jumlah penjual yang sedikit membuat penjual dapat mengendalikan harga dalam tingkat tertentu.
    c. Bila terjadi perang harga, konsumen akan diuntungkan.
*   **Kekurangan Oligopoli:**
    a. Terdapat rintangan yang kuat untuk masuk ke pasar.
    b. Akan terjadi perang harga.
    c. Produsen bisa melakukan kerja sama (kartel) yang pada akhirnya merugikan konsumen.

#### 3) Pasar Monopolistik
Pasar monopolistik adalah bentuk pasar yang terdapat banyak produsen menjual produk yang kurang lebih sama, tetapi dengan berbagai macam variasi.

*   **Kelebihan Monopolistik:**
    a. Terdapat banyak penjual sehingga konsumen memiliki pilihan.
    b. Bebas keluar masuk pasar akan mendorong produsen untuk berkompetisi secara sehat.
    c. Diferensiasi produk mendorong konsumen untuk selektif dalam menentukan produk yang diinginkan.
    d. Pasar persaingan monopolistik merupakan pasar yang mudah dijumpai.
*   **Kekurangan Monopolistik:**
    a. Memiliki tingkat persaingan yang tinggi.
    b. Meskipun terdapat kebebasan untuk keluar masuk, untuk memasuki pasar tetap membutuhkan modal yang besar.
    c. Mendorong produsen mengadakan inovasi produk sehingga meningkatkan biaya perusahaan yang akhirnya berimbas pada harga produk.

#### 4) Pasar Oligopsoni dan Monopsoni
*   **Pasar oligopsoni** adalah kondisi pasar yang terdapat beberapa pembeli yang masing-masing pembeli memiliki peran cukup besar untuk memengaruhi harga.
*   **Pasar monopsoni** adalah keadaan satu pelaku usaha menguasai penerimaan pasokan atau menjadi pembeli tunggal atas barang atau jasa dalam suatu pasar komoditas.
      `,
    },
    {
      id: 'iptek-pasar',
      title: '5. IPTEK & Pasar',
      icon: '🌐',
      content: `
# 🌐 5. Peran Iptek terhadap Perubahan Jenis dan Struktur Pasar

Teknologi dewasa ini berkembang sangat pesat. Hal ini terbukti dengan banyaknya jaringan internet yang dapat diakses di mana pun berada. Kebergantungan pada internet sangat besar. Hal ini dimanfaatkan oleh wirausaha dalam memasarkan produk-produknya.

> Banyak toko online yang dipasarkan melalui internet, tidak hanya itu, transaksi online melibatkan banyak pihak sehingga memengaruhi perputaran uang. Hal ini sangat berpengaruh terhadap perekonomian.

Teknologi juga dapat memengaruhi struktur pasar. Dahulu telepon merupakan bentuk pasar monopoli karena hanya dimiliki oleh perusahaan besar saja. Dahulu telepon berbentuk telepon rumah yang hanya dimiliki oleh sekelompok orang tertentu saja. 

**Perubahan Struktur:** 
Oleh karena perkembangan teknologi, sekarang orang dapat memiliki telepon genggam yang lebih murah dan praktis. Dengan munculnya telepon genggam, perusahaan telepon berbentuk fixed line (telepon rumah) mulai ditinggalkan dan beralih ke telepon genggam.
      `,
    },
    {
      id: 'pasar-input',
      title: '6. Pasar Input',
      icon: '🏗️',
      content: `
# 🏗️ 6. Pasar Input

Pasar input adalah pasar yang menyediakan berbagai faktor produksi.

**Ciri-ciri pasar input antara lain sebagai berikut:**
a. Tidak berwujud fisik, tetapi berwujud kegiatan.
b. Permintaan dan penawaran faktor produksi dilakukan dalam jumlah besar.
c. Jenis penawaran dan permintaan faktor produksi sesuai dengan produksi yang dihasilkan.
d. Penawaran faktor produksi kadang merupakan monopoli, sementara permintaan faktor produksi bersifat kolektif.

---

### 🔑 Jenis-Jenis Pasar Input

*   **a. Pasar sumber daya alam/tanah**: Faktor produksi tanah meliputi permukaan dan semua yang terkandung di dalamnya. Balas jasa yang diterima dari pengguna faktor produksi tanah adalah **sewa**. Harga dan jumlah permintaan tanah berbeda-beda karena perbedaan sifat tanah (kesuburan, letak, dsb).
*   **b. Pasar tenaga kerja**: Seluruh aktivitas dari pelaku yang tujuannya mempertemukan para pencari kerja dengan pengguna tenaga kerja. Permintaan tenaga kerja datang dari rumah tangga produksi, sedangkan penawaran datang dari masyarakat.
*   **c. Pasar modal**: Tempat jual beli dana dan investasi jangka panjang. Permintaan modal berasal dari pengusaha dan penawaran berasal dari pemilik modal.
*   **d. Pasar kewirausahaan**: Kewirausahaan merupakan inisiatif untuk mengoordinasi faktor produksi guna mencapai efisiensi yang maksimal. Orang yang melakukan koordinasi disebut **wirausahawan**.
      `,
    },
  ],
  videos: [
    {
      id: 'video-pasar-1',
      title: 'Konsep Dasar Pasar',
      url: 'https://www.youtube.com/embed/EO_9e2kcZm8',
      description: 'Penjelasan mendalam mengenai pengertian, syarat, dan fungsi pasar dalam ekonomi.',
      task: 'Buatlah ringkasan dari video pembelajaran di atas minimal 100 kata.'
    },
    {
      id: 'video-pasar-2',
      title: 'Struktur dan Macam Pasar',
      url: 'https://www.youtube.com/embed/VbBHbXjbECU',
      description: 'Membahas berbagai macam struktur pasar mulai dari persaingan sempurna hingga monopoli.',
      task: 'Buatlah ringkasan dari video pembelajaran di atas minimal 100 kata.'
    },
  ],
  quizQuestions: [
    {
      id: 'q-pasar-1',
      question: 'Secara ekonomi, pasar dapat terbentuk meskipun penjual dan pembeli tidak bertemu secara fisik. Syarat utama terjadinya pasar adalah...',
      options: [
        'Adanya gedung pasar yang megah',
        'Pertemuan langsung antara penjual dan pembeli',
        'Adanya kesepakatan harga dan transaksi atas barang/jasa',
        'Tersedianya barang dalam jumlah yang sangat banyak'
      ],
      correctAnswer: 2,
      explanation: 'Syarat utama pasar adalah adanya penjual, pembeli, barang/jasa, dan terjadinya kesepakatan transaksi/harga, baik secara langsung maupun tidak langsung.'
    },
    {
      id: 'q-pasar-2',
      question: 'Pasar memiliki fungsi mengorganisir faktor-faktor produksi untuk menghasilkan barang dan jasa. Hal ini disebut fungsi...',
      options: ['Distribusi', 'Pembentukan Harga', 'Promosi', 'Produksi'],
      correctAnswer: 1,
      explanation: 'Fungsi pembentukan harga terjadi melalui interaksi permintaan dan penawaran yang mengorganisir nilai barang/jasa.'
    },
    {
      id: 'q-pasar-3',
      question: 'Berdasarkan wujudnya, pasar bursa efek dan pasar online termasuk dalam kategori pasar...',
      options: ['Konkrit', 'Abstrak', 'Harian', 'Nasional'],
      correctAnswer: 1,
      explanation: 'Pasar abstrak adalah pasar di mana penjual dan pembeli tidak bertemu langsung dan barang yang diperjualbelikan tidak tersedia secara fisik saat transaksi.'
    },
    {
      id: 'q-pasar-4',
      question: 'Pasar yang hanya dibuka satu kali dalam setahun, seperti Pekan Raya Jakarta (PRJ), disebut pasar...',
      options: ['Mingguan', 'Bulanan', 'Temporer', 'Tahunan'],
      correctAnswer: 3,
      explanation: 'Pasar tahunan diadakan sekali setahun dan biasanya bertujuan memperingati peristiwa tertentu.'
    },
    {
      id: 'q-pasar-5',
      question: 'Struktur pasar yang ditandai dengan banyak penjual tetapi produk yang dijual memiliki perbedaan (diferensiasi) disebut...',
      options: ['Persaingan Sempurna', 'Monopoli', 'Oligopoli', 'Persaingan Monopolistik'],
      correctAnswer: 3,
      explanation: 'Pasar persaingan monopolistik memiliki banyak penjual dengan produk yang serupa tapi memiliki ciri khas (diferensiasi) seperti merek atau kemasan.'
    },
    {
      id: 'q-pasar-6',
      question: 'Pasar di mana hanya terdapat satu pembeli tunggal untuk banyak penjual disebut...',
      options: ['Monopoli', 'Oligopoli', 'Monopsoni', 'Oligopsoni'],
      correctAnswer: 2,
      explanation: 'Monopsoni adalah keadaan pasar dengan satu pembeli tunggal yang menguasai penerimaan pasokan barang.'
    },
    {
      id: 'q-pasar-7',
      question: 'Salah satu ciri pasar persaingan sempurna adalah penjual berperan sebagai...',
      options: ['Price Maker', 'Price Taker', 'Price Leader', 'Price Driver'],
      correctAnswer: 1,
      explanation: 'Dalam pasar persaingan sempurna, penjual tidak bisa menentukan harga sendiri dan hanya mengikuti harga pasar (Price Taker).'
    },
    {
      id: 'q-pasar-8',
      question: 'Perusahaan Listrik Negara (PLN) dalam menyediakan listrik bagi masyarakat Indonesia merupakan contoh pasar...',
      options: ['Monopoli', 'Oligopoli', 'Monopolistik', 'Persaingan Sempurna'],
      correctAnswer: 0,
      explanation: 'PLN adalah penjual tunggal jasa listrik di Indonesia, sehingga dikategorikan sebagai pasar monopoli (monopoli negara).'
    },
    {
      id: 'q-pasar-9',
      question: 'Pasar yang memperjualbelikan faktor produksi berupa mesin dan peralatan termasuk dalam pasar...',
      options: ['Input Modal', 'Input Tenaga Kerja', 'Barang Konsumsi', 'Input Alam'],
      correctAnswer: 0,
      explanation: 'Mesin dan peralatan adalah bagian dari faktor produksi modal.'
    },
    {
      id: 'q-pasar-10',
      question: 'Perkembangan IPTEK memungkinkan adanya "Marketplace" digital. Dampak positif IPTEK bagi konsumen adalah...',
      options: [
        'Memperpendek rantai distribusi sehingga harga lebih murah',
        'Menghilangkan peran pedagang kecil',
        'Menyebabkan perilaku konsumtif berlebihan',
        'Mengurangi lapangan pekerjaan di pasar tradisional'
      ],
      correctAnswer: 0,
      explanation: 'IPTEK memudahkan akses langsung dari produsen ke konsumen, sehingga memotong biaya perantara dan harga menjadi lebih bersaing.'
    },
    {
      id: 'q-pasar-11',
      question: 'Balas jasa yang diterima oleh pemilik faktor produksi alam (tanah) disebut...',
      options: ['Upah', 'Bunga', 'Sewa', 'Laba'],
      correctAnswer: 2,
      explanation: 'Pemilik tanah menerima sewa (rent) sebagai balas jasa atas penggunaan tanahnya dalam proses produksi.'
    },
    {
      id: 'q-pasar-12',
      question: 'Pasar modal merupakan tempat transaksi instrumen keuangan jangka panjang, contohnya adalah...',
      options: ['Saham dan Obligasi', 'Uang Tunai', 'Beras dan Gula', 'Tenaga Kerja'],
      correctAnswer: 0,
      explanation: 'Saham dan obligasi adalah instrumen utama yang diperjualbelikan di pasar modal.'
    },
    {
      id: 'q-pasar-13',
      question: 'Dalam pasar oligopoli, munculnya persaingan harga yang sangat ketat sering dihindari karena akan merugikan semua pihak. Maka perusahaan cenderung bersaing lewat...',
      options: ['Kualitas barang', 'Iklan dan Pelayanan', 'Jumlah karyawan', 'Lokasi toko'],
      correctAnswer: 1,
      explanation: 'Perusahaan oligopoli lebih memilih persaingan non-harga seperti iklan yang masif dan peningkatan pelayanan.'
    },
    {
      id: 'q-pasar-14',
      question: 'Salah satu kelemahan pasar monopoli bagi masyarakat adalah...',
      options: [
        'Efisien dalam penggunaan sumber daya',
        'Harga barang cenderung stabil',
        'Kualitas barang sangat tinggi',
        'Konsumen tidak punya pilihan barang lain'
      ],
      correctAnswer: 3,
      explanation: 'Karena hanya ada satu penjual, konsumen terpaksa menerima produk dan harga yang ditetapkan monopolis tanpa pilihan alternatif.'
    },
    {
      id: 'q-pasar-15',
      question: 'Pasar yang menyediakan bibit unggul, pupuk, dan lahan pertanian disebut pasar input...',
      options: ['Modal', 'Alam', 'Tenaga Kerja', 'Kewirausahaan'],
      correctAnswer: 1,
      explanation: 'Lahan dan bibit (sumber daya organik) termasuk dalam kategori faktor produksi alam.'
    },
    {
      id: 'q-pasar-16',
      question: 'Pasar Sayur di suatu daerah hanya buka subuh hingga jam 7 pagi. Berdasarkan waktunya, ini termasuk pasar...',
      options: ['Harian', 'Mingguan', 'Temporer', 'Bulanan'],
      correctAnswer: 0,
      explanation: 'Pasar harian adalah pasar yang kegiatannya berlangsung setiap hari, meskipun jam operasionalnya terbatas.'
    },
    {
      id: 'q-pasar-17',
      question: 'Seseorang yang memiliki inisiatif untuk mengorganisir faktor produksi guna mencapai efisiensi maksimal dalam pasar disebut...',
      options: ['Manajer', 'Karyawan', 'Wirausahawan', 'Investor'],
      correctAnswer: 2,
      explanation: 'Wirausahawan bertugas mengoordinasikan tanah, modal, dan tenaga kerja.'
    },
    {
      id: 'q-pasar-18',
      question: 'Contoh pasar oligopoli di Indonesia yang paling terlihat adalah industri...',
      options: ['Beras', 'Semen dan Telekomunikasi (Provider)', 'Pakaian Jadi', 'Listrik'],
      correctAnswer: 1,
      explanation: 'Industri semen and provider seluler hanya dikuasai oleh beberapa perusahaan besar, sehingga disebut oligopoli.'
    },
    {
      id: 'q-pasar-19',
      question: 'Di pasar persaingan sempurna, informasi pasar bersifat...',
      options: ['Tertutup', 'Rahasia perusahaan', 'Sempurna dan terbuka', 'Sangat mahal'],
      correctAnswer: 2,
      explanation: 'Semua pelaku pasar memiliki informasi yang sama dan lengkap mengenai harga serta kondisi pasar.'
    },
    {
      id: 'q-pasar-20',
      question: 'Pasar faktor produksi tenaga kerja mempertemukan permintaan tenaga kerja dari ... dengan penawaran dari ...',
      options: [
        'Rumah Tangga Konsumen (RTK); Rumah Tangga Produsen (RTP)',
        'Rumah Tangga Produsen (RTP); Rumah Tangga Konsumen (RTK)',
        'Pemerintah; Luar Negeri',
        'Bank; Nasabah'
      ],
      correctAnswer: 1,
      explanation: 'Perusahaan (RTP) membutuhkan/meminta tenaga kerja, sedangkan masyarakat (RTK) sebagai pemilik tenaga kerja menawarkan jasanya.'
    },
    {
      id: 'q-pasar-21',
      question: 'Bursa tenaga kerja online memungkinkan pencari kerja melamar ke luar negeri dengan mudah. Ini adalah contoh pengaruh IPTEK terhadap pasar...',
      options: ['Lokal', 'Nasional', 'Internasional', 'Regional'],
      correctAnswer: 2,
      explanation: 'Teknologi meniadakan batasan geografis, memungkinkan jangkauan pasar hingga level internasional.'
    },
    {
      id: 'q-pasar-22',
      question: 'Hambatan masuk (barriers to entry) yang sangat tinggi merupakan ciri utama dari pasar...',
      options: ['Persaingan Sempurna', 'Monopoli', 'Persaingan Monopolistik', 'Oligopsoni'],
      correctAnswer: 1,
      explanation: 'Pasar monopoli sulit ditembus pesaing baru karena adanya undang-undang, penguasaan bahan baku, atau modal yang sangat besar.'
    },
    {
      id: 'q-pasar-23',
      question: 'Pasar yang jangkauannya mencakup satu wilayah negara tertentu disebut pasar...',
      options: ['Lokal', 'Regional', 'Nasional', 'Global'],
      correctAnswer: 2,
      explanation: 'Pasar nasional melayani permintaan and penawaran dari seluruh penjuru suatu negara.'
    },
    {
      id: 'q-pasar-24',
      question: 'Harga yang terbentuk di pasar merupakan hasil dari kesepakatan antara...',
      options: ['Penjual dan Pemerintah', 'Pembeli dan Bank', 'Permintaan dan Penawaran', 'Produsen dan Distributor'],
      correctAnswer: 2,
      explanation: 'Harga pasar terbentuk dari titik temu antara kurva permintaan (pembeli) and penawaran (penjual).'
    },
    {
      id: 'q-pasar-25',
      question: 'Fungsi pasar sebagai sarana memperkenalkan barang baru kepada calon pembeli disebut fungsi...',
      options: ['Distribusi', 'Pembentukan Harga', 'Promosi', 'Produksi'],
      correctAnswer: 2,
      explanation: 'Promosi bertujuan membujuk konsumen agar tertarik membeli produk.'
    },
    {
      id: 'q-pasar-26',
      question: 'Contoh nyata dari pasar persaingan monopolistik adalah pasar...',
      options: ['Sabun mandi dan sampo', 'Listrik', 'Beras di pasar induk', 'Bensin oleh Pertamina'],
      correctAnswer: 0,
      explanation: 'Banyak merek sabun/sampo yang bersaing dengan keunggulan merek masing-masing (diferensiasi).'
    },
    {
      id: 'q-pasar-27',
      question: 'Pasar input modal sering juga disebut sebagai pasar...',
      options: ['Tenaga Kerja', 'Dana atau Invetasi', 'Lahan Pertanian', 'Bahan Baku'],
      correctAnswer: 1,
      explanation: 'Modal dalam ekonomi tidak hanya berupa mesin, tapi juga dana investasi yang digunakan untuk produksi.'
    },
    {
      id: 'q-pasar-28',
      question: 'Jika pasar hanya terdiri dari beberapa pembeli besar bagi banyak penjual kecil, maka disebut...',
      options: ['Oligopoli', 'Oligopsoni', 'Monopoli', 'Monopsoni'],
      correctAnswer: 1,
      explanation: 'Oligopsoni adalah penguasaan pasar oleh beberapa pembeli saja.'
    },
    {
      id: 'q-pasar-29',
      question: 'Hukum pasar menyatakan bahwa jika harga naik, maka penawaran akan...',
      options: ['Turun', 'Tetap', 'Naik', 'Hilang'],
      correctAnswer: 2,
      explanation: 'Hukum penawaran berbanding lurus: harga naik, jumlah barang yang ditawarkan naik.'
    },
    {
      id: 'q-pasar-30',
      question: 'Pasar yang menjual barang-barang mentah seperti gandum, kopi, and karet dunia disebut pasar...',
      options: ['Konsumsi', 'Barang Jadi', 'Komoditas', 'Input Tenaga Kerja'],
      correctAnswer: 2,
      explanation: 'Bursa komoditas memperdagangkan barang mentah utama dalam skala besar/internasional.'
    },
    {
      id: 'q-pasar-31',
      question: 'Suatu bentuk pasar yang di dalamnya terdapat banyak penjual barang yang sejenis tetapi mempunyai perbedaan-perbedaan pada produknya (merk, kualitas, kemasan) disebut pasar...',
      options: ['Persaingan Sempurna', 'Monopoli', 'Oligopoli', 'Monopolistik'],
      correctAnswer: 3,
      explanation: 'Definisi kunci pasar monopolistik adalah diferensiasi produk.'
    },
    {
      id: 'q-pasar-32',
      question: 'Pasar Sekunder pada bursa efek termasuk dalam kategori pasar...',
      options: ['Konkrit', 'Abstrak', 'Lokal', 'Mingguan'],
      correctAnswer: 1,
      explanation: 'Transaksi bursa efek tidak memerlukan kehadiran fisik barang dagangan saat deal terjadi.'
    },
    {
      id: 'q-pasar-33',
      question: 'Fungsi pasar dalam menyalurkan barang dari produsen ke konsumen agar tepat waktu dan tempat disebut fungsi...',
      options: ['Distribusi', 'Pembentukan Harga', 'Promosi', 'Alokasi'],
      correctAnswer: 0,
      explanation: 'Distribusi adalah proses penyampaian barang/jasa kepada para pemakai.'
    },
    {
      id: 'q-pasar-34',
      question: 'Dalam pasar monopoli, kurva permintaan yang dihadapi perusahaan adalah...',
      options: [
        'Horizontal (datar)',
        'Vertikal (tegak)',
        'Menurun dari kiri atas ke kanan bawah',
        'Menaik dari kiri bawah ke kanan atas'
      ],
      correctAnswer: 2,
      explanation: 'Karena monopolis adalah satu-satunya penjual, kurva permintaannya sama dengan kurva permintaan pasar yang menurun.'
    },
    {
      id: 'q-pasar-35',
      question: 'Pasar yang memperjualbelikan faktor produksi modal fisik seperti gedung dan traktor disebut pasar...',
      options: ['Input Modal', 'Input Tenaga Kerja', 'Input Alam', 'Barang Jadi'],
      correctAnswer: 0,
      explanation: 'Gedung and alat mesin adalah bentuk modal tetap/fisik.'
    },
    {
      id: 'q-pasar-36',
      question: 'Berikut merupakan contoh pasar harian, KECUALI...',
      options: ['Pasar Tradisional Kota', 'Supermarket', 'Pasar Kaget Hari Minggu', 'Warung Kelontong'],
      correctAnswer: 2,
      explanation: 'Pasar kaget hari Minggu adalah pasar mingguan.'
    },
    {
      id: 'q-pasar-37',
      question: 'Pasar persaingan sempurna sulit ditemukan di dunia nyata secara murni, namun yang paling mendekati adalah pasar...',
      options: ['Mobil Mewah', 'Hasil Pertanian (Beras/Sayur)', 'Smartphone', 'Jasa Transportasi Kereta Api'],
      correctAnswer: 1,
      explanation: 'Barang pertanian cenderung homogen and banyak penjual/pembeli kecil.'
    },
    {
      id: 'q-pasar-38',
      question: 'Kartel merupakan kerja sama beberapa perusahaan di bawah satu pimpinan untuk menguasai pasar. Fenomena ini biasanya terjadi pada struktur...',
      options: ['Monopoli', 'Oligopoli', 'Persaingan Sempurna', 'Monopolistik'],
      correctAnswer: 1,
      explanation: 'Beberapa perusahaan besar dalam oligopoli bisa melakukan kolusi/kartel untuk menentukan harga.'
    },
    {
      id: 'q-pasar-39',
      question: 'Pasar yang menjadi tempat bertemunya penawaran tenaga kerja terampil dengan perusahaan yang membutuhkan disebut...',
      options: ['Pasar Komoditas', 'Bursa Tenaga Kerja', 'Bursa Efek', 'Pasar Barang Jasa'],
      correctAnswer: 1,
      explanation: 'Bursa tenaga kerja menyediakan informasi and akses untuk faktor produksi manusia.'
    },
    {
      id: 'q-pasar-40',
      question: 'Salah satu dampak negatif adanya pasar monopoli adalah terjadinya "deadweight loss" yang berarti...',
      options: [
        'Keuntungan yang terlalu besar bagi konsumen',
        'Hilangnya kesejahteraan masyarakat karena harga terlalu tinggi',
        'Pemerintah kehilangan pendapatan pajak',
        'Penjual mengalami kerugian terus menerus'
      ],
      correctAnswer: 1,
      explanation: 'Harga tinggi dan jumlah barang sedikit di pasar monopoli mengurangi total kesejahteraan ekonomi masyarakat.'
    },
    {
      id: 'q-pasar-41',
      question: 'Pasar yang melakukan transaksi untuk pengiriman di masa depan disebut pasar...',
      options: ['Spot', 'Mingguan', 'Berjangka (Futures)', 'Konkrit'],
      correctAnswer: 2,
      explanation: 'Pasar berjangka melakukan kontrak sekarang untuk penyerahan barang di kemudian hari.'
    },
    {
      id: 'q-pasar-42',
      question: 'Pemberian upah kepada buruh pabrik merupakan bentuk transaksi di pasar...',
      options: ['Barang Jasa', 'Input Alam', 'Input Tenaga Kerja', 'Input Modal'],
      correctAnswer: 2,
      explanation: 'Upah adalah balas jasa di pasar tenaga kerja.'
    },
    {
      id: 'q-pasar-43',
      question: 'Sektor perbankan yang terdiri dari beberapa bank besar dominan merupakan contoh aplikasi struktur pasar...',
      options: ['Monopoli', 'Oligopoli', 'Persaingan Sempurna', 'Monopsoni'],
      correctAnswer: 1,
      explanation: 'Layanan perbankan dikuasai beberapa pemain besar di tiap negara.'
    },
    {
      id: 'q-pasar-44',
      question: 'Penggunaan QRIS di pasar tradisional memudahkan transaksi secara digital. Ini menunjukkan peran IPTEK dalam meningkatkan...',
      options: ['Jumlah barang', 'Kualitas barang', 'Efisiensi dan Kemudahan Pembayaran', 'Jumlah pedagang'],
      correctAnswer: 2,
      explanation: 'Digitalisasi pembayaran memangkas hambatan teknis transaksi.'
    },
    {
      id: 'q-pasar-45',
      question: 'Pasar regional adalah pasar yang jangkauannya mencakup...',
      options: ['Satu kecamatan', 'Beberapa negara di kawasan tertentu (misal: ASEAN)', 'Seluruh dunia', 'Satu provinsi saja'],
      correctAnswer: 1,
      explanation: 'Regional merujuk pada kawasan geografis tertentu (lintas negara).'
    },
    {
      id: 'q-pasar-46',
      question: 'Pasar input kewirausahaan memberikan balas jasa berupa...',
      options: ['Bunga', 'Sewa', 'Upah', 'Laba (Profit)'],
      correctAnswer: 3,
      explanation: 'Pengusaha menerima laba atas keberanian mengambil risiko and mengelola usaha.'
    },
    {
      id: 'q-pasar-47',
      question: 'Di pasar persaingan sempurna, barang yang dijual bersifat homogen, artinya...',
      options: ['Sangat mahal', 'Berbeda-beda kualitasnya', 'Sama atau serupa secara fisik dan kualitas', 'Langka'],
      correctAnswer: 2,
      explanation: 'Barang homogen membuat konsumen tidak pilih-pilih merk karena barang dianggap identik.'
    },
    {
      id: 'q-pasar-48',
      question: 'Penetapan harga eceran tertinggi (HET) oleh pemerintah di pasar bertujuan untuk...',
      options: ['Melindungi Produsen', 'Melindungi Konsumen', 'Menambah Pajak', 'Menciptakan Monopoli'],
      correctAnswer: 1,
      explanation: 'HET mencegah harga naik terlalu tinggi sehingga tetap terjangkau oleh konsumen.'
    },
    {
      id: 'q-pasar-49',
      question: 'Pasar internasional adalah pasar yang mempertemukan permintaan dan penawaran dari...',
      options: ['Dua orang dari desa berbeda', 'Seluruh negara di dunia', 'Hanya negara kaya', 'Hanya negara berkembang'],
      correctAnswer: 1,
      explanation: 'Melibatkan interaksi antarnegara di seluruh dunia.'
    },
    {
      id: 'q-pasar-50',
      question: 'Dalam jangka panjang, keuntungan perusahaan di pasar persaingan sempurna cenderung...',
      options: ['Sangat besar (Supernormal)', 'Normal (Nol ekonomi)', 'Mengalami kerugian', 'Tidak terbatas'],
      correctAnswer: 1,
      explanation: 'Karena kemudahan masuk/keluar pasar, persaingan akan menekan keuntungan hingga level normal.'
    }
  ],
  glossary: {
    'Pasar': 'Tempat bertemunya penjual dan pembeli untuk melakukan transaksi.',
    'Barter': 'Pertukaran barang dengan barang tanpa perantara uang.',
    'Harga Keseimbangan': 'Harga yang terbentuk dari kesepakatan antara permintaan dan penawaran.',
    'Price Taker': 'Kondisi di mana penjual tidak bisa menentukan harga sendiri, melainkan mengikuti harga pasar.',
    'Monopoli': 'Struktur pasar di mana hanya ada satu penjual.',
    'Oligopoli': 'Struktur pasar dengan beberapa penjual yang mendominasi.',
    'Monopolistik': 'Pasar dengan banyak penjual yang membedakan produknya melalui merek atau kualitas.',
    'Monopsoni': 'Keadaan di mana hanya ada satu pembeli tunggal.',
    'Pasar Input': 'Pasar yang menyediakan faktor produksi seperti tanah, modal, dan tenaga kerja.',
    'Pasar Output': 'Tempat jual beli barang dan jasa hasil produksi (barang jadi).',
    'Permintaan': 'Jumlah barang atau jasa yang ingin dibeli masyarakat pada berbagai tingkat harga.',
    'Penawaran': 'Jumlah barang atau jasa yang ditawarkan penjual pada berbagai tingkat harga.',
    'Ceteris Paribus': 'Asumsi bahwa faktor-faktor lain selain harga dianggap tetap atau tidak berubah.',
    'Pasar Konkrit': 'Pasar di mana barang yang diperjualbelikan tersedia di tempat (nyata).',
    'Pasar Abstrak': 'Pasar di mana transaksi dilakukan tanpa kehadiran fisik barang (misal: pasar online).',
    'Pasar Harian': 'Pasar yang menyelenggarakan kegiatan jual beli setiap hari.',
    'Pasar Mingguan': 'Pasar yang diadakan hanya satu kali dalam satu minggu (misal: pasar senin).',
    'Pasar Bulanan': 'Pasar yang diadakan sebulan sekali, biasanya di sekitar pabrik atau kantor.',
    'Pasar Tahunan': 'Pasar yang diadakan sekali dalam setahun (misal: PRJ atau pasar malam tahunan).',
    'Pasar Temporer': 'Pasar yang diselenggarakan pada waktu tertentu saja (misal: pasar bazaar).',
    'Pasar Lokal': 'Pasar yang wilayah pemasarannya hanya meliputi daerah tertentu (kota/desa).',
    'Pasar Nasional': 'Pasar yang melayani permintaan dan penawaran dari seluruh wilayah negara.',
    'Pasar Regional': 'Pasar yang cakupan pemasarannya meliputi kawasan beberapa negara (misal: ASEAN).',
    'Pasar Internasional': 'Pasar yang mempertemukan permintaan dan penawaran dari seluruh penjuru dunia.',
    'Diferensiasi Produk': 'Perbedaan yang sengaja dibuat pada produk (logo, kemasan, kualitas) untuk menarik konsumen.',
    'Barang Homogen': 'Barang-barang yang memiliki sifat dan kualitas yang sama atau identik.',
    'Price Maker': 'Penjual yang memiliki kekuatan untuk menentukan harga sendiri (biasanya pada monopoli).',
    'Pasar Persaingan Sempurna': 'Pasar dengan banyak penjual/pembeli dan barang bersifat homogen.',
    'Pasar Persaingan Tidak Sempurna': 'Pasar di mana salah satu syarat pasar persaingan sempurna tidak terpenuhi.',
    'Oligopsoni': 'Keadaan pasar yang dikuasai oleh beberapa pembeli saja.',
    'Pasar Modal': 'Tempat transaksi instrumen keuangan jangka panjang (saham, obligasi).',
    'Saham': 'Tanda penyertaan modal seseorang atau pihak dalam suatu perusahaan.',
    'Obligasi': 'Surat utang jangka panjang yang diterbitkan perusahaan atau pemerintah.',
    'Faktor Produksi': 'Segala sumber daya yang digunakan dalam proses menghasilkan barang/jasa.',
    'Sewa (Rent)': 'Balas jasa yang diterima pemilik faktor produksi alam (tanah).',
    'Upah (Wage)': 'Balas jasa yang diterima pemilik faktor produksi tenaga kerja.',
    'Bunga (Interest)': 'Balas jasa yang diterima pemilik faktor produksi modal.',
    'Laba (Profit)': 'Balas jasa yang diterima pengusaha/wirausahawan atas pengelolaan faktor produksi.',
    'IPTEK': 'Ilmu Pengetahuan dan Teknologi yang mendukung perkembangan pasar.',
    'Marketplace': 'Platform digital tempat bertemunya banyak penjual dan pembeli secara online.',
    'E-Commerce': 'Kegiatan perdagangan barang dan jasa melalui media elektronik/internet.',
    'Distribusi': 'Kegiatan menyalurkan barang dari produsen ke tangan konsumen.',
    'Promosi': 'Kegiatan memperkenalkan dan membujuk konsumen agar membeli produk.',
    'Alokasi': 'Pembagian sumber daya atau dana untuk tujuan tertentu agar efektif.',
    'Efisiensi Ekonomi': 'Keadaan di mana sumber daya dialokasikan secara optimal untuk meminimalisir pemborosan.',
    'Surplus Konsumen': 'Selisih antara harga maksimum yang bersedia dibayar konsumen dengan harga pasar.',
    'Surplus Produsen': 'Selisih antara harga pasar dengan harga terendah yang bersedia diterima produsen.',
    'Kartel': 'Kerja sama antarperusahaan pesaing untuk mengontrol harga atau produksi.',
    'Pasar Barang Konsumsi': 'Pasar yang memperjualbelikan barang untuk keperluan hidup sehari-hari.',
    'Bursa Efek': 'Lembaga yang menyelenggarakan sistem perdagangan efek (saham/obligasi).',
  },
  reflectionQuestions: [
    {
      id: 1,
      question: 'Sejauh mana pemahaman Anda mengenai perbedaan antara pasar persaingan sempurna dan tidak sempurna setelah mempelajari modul ini?',
      hint: 'Jelaskan poin-poin utama yang kamu pahami tentang struktur pasar tersebut.'
    },
    {
      id: 2,
      question: 'Dari berbagai jenis pasar yang ada, manakah yang menurut Anda paling berpengaruh dalam kehidupan sehari-hari? Berikan alasannya.',
      hint: 'Pikirkan pasar yang sering kamu kunjungi atau gunakan jasanya.'
    },
    {
      id: 3,
      question: 'Bagaimana pendapat Anda mengenai peran teknologi (IPTEK) dalam mengubah wajah pasar tradisional menjadi pasar digital saat ini?',
      hint: 'Pertimbangkan kemudahan and tantangan yang muncul akibat digitalisasi pasar.'
    },
    {
      id: 4,
      question: 'Apakah Anda menemui kesulitan dalam memahami konsep pasar input (faktor produksi)? Bagian mana yang menurut Anda paling menantang?',
      hint: 'Kejujuranmu membantu dalam evaluasi pembelajaran ke depannya.'
    },
    {
      id: 5,
      question: 'Setelah mempelajari modul Pasar ini, apa target atau rencana Anda dalam menerapkan ilmu ini di kehidupan nyata atau rencana wirausaha Anda?',
      hint: 'Hubungkan materi pasar dengan cita-cita atau kegiatan ekonomimu.'
    }
  ]
};

// Ekonomi module for Kelas X
export const ekonomiModules: Module[] = [demandModule, supplyModule, ekonomiPasarModule];

// All modules (untuk backwards compatibility)
export const modules: Module[] = [demandModule, supplyModule, ekonomiPasarModule];
