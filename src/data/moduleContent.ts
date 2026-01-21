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
    'Menjelaskan pengertian penawaran dalam kegiatan ekonomi',
    'Mengidentifikasi faktor-faktor yang mempengaruhi penawaran',
    'Menjelaskan hukum penawaran dan konsep ceteris paribus',
    'Membuat dan menganalisis tabel skedul penawaran',
    'Menggambar dan menginterpretasikan kurva penawaran',
    'Menghitung fungsi penawaran menggunakan rumus matematika',
    'Membedakan pergerakan sepanjang kurva dan pergeseran kurva penawaran',
  ],
  prerequisites: [
    'Memahami konsep dasar permintaan (demand)',
    'Memahami konsep perilaku produsen',
    'Kemampuan dasar matematika (grafik koordinat & fungsi linear)',
  ],
  duration: '3 JP (3 x 45 menit)',
  sections: [
    {
      id: 'pengertian-penawaran',
      title: 'Pengertian Penawaran',
      icon: '📦',
      content: `
# Pengertian Penawaran (Supply)

**Penawaran (Supply)** adalah jumlah barang atau jasa yang tersedia dan dapat dijual oleh produsen (penjual) pada berbagai tingkat harga dalam periode waktu tertentu.

## Kata Kunci Penting:
- **Tersedia**: Barang sudah siap untuk dijual
- **Dapat dijual**: Produsen mau dan mampu menjualnya
- **Berbagai tingkat harga**: Penawaran berubah sesuai harga
- **Periode waktu tertentu**: Per hari, per bulan, dsb.

## Sudut Pandang Produsen
Jika dalam **Permintaan** kita melihat dari sisi *pembeli* (konsumen), maka dalam **Penawaran** kita melihat dari sisi *penjual* (produsen).

> **Logika Penjual**:
> "Kalau harga barang naik, saya ingin jual lebih banyak supaya untung lebih besar!"

## Faktor-faktor yang Mempengaruhi Penawaran:

1.  **Harga barang itu sendiri**
    -   Jika harga naik, penawaran ikut naik (ingin untung).

2.  **Biaya Produksi**
    -   Biaya bahan baku, upah tenaga kerja, sewa gedung.
    -   Jika biaya produksi naik, keuntungan menipis $\rightarrow$ produsen mengurangi penawaran.

3.  **Teknologi**
    -   Mesin canggih bisa produksi lebih cepat & murah $\rightarrow$ penawaran meningkat.

4.  **Harga barang lain**
    -   Jika harga barang lain (yang sejenis) naik, produsen mungkin beralih memproduksi barang tersebut.

5.  **Perkiraan harga masa depan**
    -   Jika diprediksi harga akan naik bulan depan, produsen mungkin menahan stok sekarang (penawaran turun) untuk dijual nanti.

6.  **Jumlah Produsen**
    -   Semakin banyak penjual, semakin banyak barang yang ditawarkan di pasar.

7.  **Kebijakan Pemerintah**
    -   Pajak (menambah biaya) $\rightarrow$ menurunkan penawaran.
    -   Subsidi (mengurangi biaya) $\rightarrow$ menaikkan penawaran.
      `,
    },
    {
      id: 'hukum-penawaran',
      title: 'Hukum Penawaran',
      icon: '⚖️',
      content: `
# Hukum Penawaran

## Bunyi Hukum Penawaran:

> **"Jika harga suatu barang naik, maka jumlah barang yang ditawarkan akan naik. Sebaliknya, jika harga barang turun, maka jumlah barang yang ditawarkan akan turun, dengan asumsi faktor lain tetap (ceteris paribus)."**

## Dalam Notasi:
- **P $\\uparrow$ $\\rightarrow$ Qs $\\uparrow$** (Harga naik, penawaran naik)
- **P $\\downarrow$ $\\rightarrow$ Qs $\\downarrow$** (Harga turun, penawaran turun)

> **Ingat!** Hubungannya adalah **SEARAH** (Berbanding Lurus/Positif).

---

## 🔑 Mengapa Hubungannya Positif?

1.  **Motif Keuntungan (Profit Motive)**
    -   Harga tinggi memberikan insentif bagi produsen untuk memproduksi lebih banyak agar laba meningkat.

2.  **Kemampuan Menutupi Biaya**
    -   Saat harga tinggi, produsen bisa menutupi biaya produksi marjinal yang mungkin meningkat saat menambah output.

---

## 📊 Contoh Penerapan Hukum Penawaran

### Kasus: Petani Cabai

| Harga Cabai (per kg) | Jumlah yang Ditawarkan (kg) |
| :--- | :--- |
| Rp 10.000 | 50 kg |
| Rp 20.000 | 80 kg |
| Rp 40.000 | 120 kg |
| Rp 60.000 | 200 kg |

**Analisis**:
Saat harga murah (Rp 10.000), petani malas memanen atau menanam banyak karena untungnya tipis. Tapi saat harga melonjak (Rp 60.000), petani semangat memanen bahkan menanam lebih banyak agar untung besar.

      `,
    },
    {
      id: 'kurva-penawaran',
      title: 'Tabel & Kurva Penawaran',
      icon: '📈',
      content: `
# Tabel dan Kurva Penawaran

## 📋 Tabel Skedul Penawaran

Skedul penawaran adalah tabel yang menunjukkan hubungan antara harga dan jumlah barang yang ditawarkan.

### Contoh: Penawaran Toko Roti

| Titik | Harga Roti (Rp) | Jumlah Ditawarkan (buah) |
| :--- | :--- | :--- |
| A | 2.000 | 10 |
| B | 4.000 | 30 |
| C | 6.000 | 50 |
| D | 8.000 | 70 |
| E | 10.000 | 90 |

---

## 📈 Kurva Penawaran (Supply Curve)

### Karakteristik Kurva Penawaran:
1.  **Berslope Positif**: Miring dari **kiri bawah ke kanan atas**.
2.  Menunjukkan hubungan **berbanding lurus** antara harga dan jumlah ditawarkan.
3.  Diberi label **S** (Supply).

*(Bayangkan garis menanjak seperti sedang mendaki gunung)*

---

## 🔄 Pergerakan vs Pergeseran Kurva

Sama seperti permintaan, penawaran juga mengalami dua jenis perubahan:

### 1. Pergerakan Sepanjang Kurva (Movement Along the Curve)
-   Disebabkan oleh **perubahan HARGA barang itu sendiri**.
-   Contoh: Harga naik dari Rp 2.000 ke Rp 4.000, maka titik pindah dari A ke B.

### 2. Pergeseran Kurva (Shift of the Curve)
-   Disebabkan oleh **faktor NON-HARGA** (Biaya produksi, teknologi, dll).
-   **Geser Kanan (S $\\rightarrow$ S1)**: Penawaran bertambah.
    -   Contoh: Ditemukan mesin baru yang efisien, subsidi pemerintah.
-   **Geser Kiri (S $\\rightarrow$ S2)**: Penawaran berkurang.
    -   Contoh: Gagal panen, kenaikan harga BBM (biaya produksi naik).

      `,
    },
    {
      id: 'fungsi-penawaran',
      title: 'Fungsi Penawaran',
      icon: '🔢',
      content: `
# Fungsi Penawaran

## 📐 Rumus Umum Fungsi Penawaran

Fungsi penawaran menunjukkan hubungan matematis antara harga (P) dan jumlah yang ditawarkan (Qs).

### Rumus:

**Qs = aP - b**
atau
**Qs = -b + aP**

**Keterangan:**
-   **Qs** = Jumlah barang yang ditawarkan (Quantity Supplied)
-   **P** = Harga barang (Price)
-   **a** = Koefisien arah (slope) $\\rightarrow$ bernilai **POSITIF** (+)
-   **b** = Konstanta

> **Tips Cepat**: Ciri fungsi penawaran adalah variabel P (Harga) bertanda **POSITIF**.
> Contoh: Qs = 2P - 10 (Benar, Penawaran)
> Contoh: Qd = -2P + 10 (Salah, ini Permintaan karena minus)

---

## 📝 Contoh Soal Mencari Fungsi

Diketahui:
-   Saat harga (P1) **Rp 2.000**, jumlah (Q1) **10 unit**.
-   Saat harga (P2) **Rp 4.000**, jumlah (Q2) **30 unit**.

**Tentukan fungsi penawarannya!**

### Penyelesaian:
Gunakan rumus persamaan garis melalui dua titik:

$$ \\frac{Q - Q_1}{Q_2 - Q_1} = \\frac{P - P_1}{P_2 - P_1} $$

1.  Masukkan angka:
$$ \\frac{Q - 10}{30 - 10} = \\frac{P - 2000}{4000 - 2000} $$

2.  Sederhanakan penyebut:
$$ \\frac{Q - 10}{20} = \\frac{P - 2000}{2000} $$

3.  Kali silang:
$$ 2000(Q - 10) = 20(P - 2000) $$
$$ 2000Q - 20000 = 20P - 40000 $$

4.  Cari Q:
$$ 2000Q = 20P - 40000 + 20000 $$
$$ 2000Q = 20P - 20000 $$
$$ Q = \\frac{20}{2000}P - \\frac{20000}{2000} $$
**Qs = 0,01P - 10**

### ✅ Cek Jawaban:
Jika P = 2000 $\\rightarrow$ Q = 0,01(2000) - 10 = 20 - 10 = 10 (Benar!) 
      `,
    },
  ],
  videos: [
    {
      id: 'video-s1',
      title: 'Konsep Dasar Penawaran',
      url: 'https://www.youtube.com/embed/zO9hT8tD_9g',
      description: 'Penjelasan mudah tentang apa itu penawaran dan hukum penawaran.',
    },
    {
      id: 'video-s2',
      title: 'Faktor yang Mempengaruhi Penawaran',
      url: 'https://www.youtube.com/embed/uC64X_aT2_s',
      description: 'Mengapa jumlah barang yang dijual bisa berubah-ubah? Simak faktornya.',
    },
    {
      id: 'video-s3',
      title: 'Cara Membuat Kurva Penawaran',
      url: 'https://www.youtube.com/embed/3D9KgQ5i_3Y',
      description: 'Tutorial menggambar kurva penawaran dari tabel skedul.',
    },
    {
      id: 'video-s4',
      title: 'Menghitung Fungsi Penawaran',
      url: 'https://www.youtube.com/embed/example4',
      description: 'Latihan soal matematika menghitung fungsi penawaran.',
    },
  ],
  quizQuestions: [
    {
      id: 'qs1',
      question: 'Apa definisi yang tepat untuk Penawaran (Supply)?',
      options: [
        'Jumlah barang yang ingin dibeli konsumen',
        'Jumlah barang yang diproduksi dan dijual oleh produsen pada berbagai tingkat harga',
        'Jumlah stok barang di gudang',
        'Keinginan produsen untuk mendapatkan laba',
      ],
      correctAnswer: 1,
      explanation: 'Penawaran adalah jumlah barang yang tersedia dan dapat dijual oleh produsen pada berbagai tingkat harga dalam waktu tertentu.',
    },
    {
      id: 'qs2',
      question: 'Bagaimana bunyi Hukum Penawaran?',
      options: [
        'Jika harga naik, penawaran turun',
        'Jika harga turun, penawaran naik',
        'Jika harga naik, penawaran naik (ceteris paribus)',
        'Harga tidak mempengaruhi penawaran',
      ],
      correctAnswer: 2,
      explanation: 'Hukum penawaran berbanding lurus: Harga naik $\rightarrow$ Penawaran naik. Produsen ingin jual lebih banyak saat harga mahal.',
    },
    {
      id: 'qs3',
      question: 'Manakah faktor yang menyebabkan kurva penawaran bergeser ke KANAN?',
      options: [
        'Kenaikan biaya produksi',
        'Teknologi semakin canggih dan efisien',
        'Kenaikan pajak',
        'Penurunan jumlah produsen',
      ],
      correctAnswer: 1,
      explanation: 'Teknologi yang canggih membuat produksi lebih murah dan cepat, sehingga produsen bisa menawarkan lebih banyak barang. Ini menggeser kurva ke kanan.',
    },
    {
      id: 'qs4',
      question: 'Jika fungsi penawaran adalah Qs = 2P - 500, berapa jumlah barang yang ditawarkan saat harga (P) = 1.000?',
      options: [
        '1000',
        '1500',
        '2000',
        '2500',
      ],
      correctAnswer: 1,
      explanation: 'Qs = 2(1000) - 500 = 2000 - 500 = 1500 unit.',
    },
    {
      id: 'qs5',
      question: 'Pergerakan dari titik A ke titik B pada kurva penawaran yang sama disebabkan oleh...',
      options: [
        'Perubahan teknologi',
        'Perubahan harga barang itu sendiri',
        'Perubahan harga bahan baku',
        'Perubahan musim',
      ],
      correctAnswer: 1,
      explanation: 'Pergerakan SEPANJANG kurva (movement along the curve) hanya disebabkan oleh perubahan harga barang itu sendiri.',
    },
    {
      id: 'qs6',
      question: 'Apa yang terjadi pada kurva penawaran roti jika harga tepung terigu (bahan baku) naik drastis?',
      options: [
        'Kurva bergeser ke kanan',
        'Kurva bergeser ke kiri',
        'Hanya bergerak sepanjang kurva ke atas',
        'Kurva menjadi vertikal',
      ],
      correctAnswer: 1,
      explanation: 'Kenaikan harga bahan baku = biaya produksi naik. Jika biaya naik, produsen mengurangi produksi. Kurva penawaran bergeser ke KIRI.',
    },
    {
      id: 'qs7',
      question: 'Manakah fungsi di bawah ini yang merupakan fungsi Penawaran?',
      options: [
        'Q = -5P + 100',
        'Q = 100 - 2P',
        'Q = 3P - 20',
        'P = -2Q + 50',
      ],
      correctAnswer: 2,
      explanation: 'Fungsi penawaran memiliki slope positif (koefisien P positif). Pilihan C (Q = 3P - 20) adalah satu-satunya yang P-nya positif.',
    },
    {
      id: 'qs8',
      question: 'Kurva penawaran bergerak dari kiri bawah ke...',
      options: [
        'Kanan bawah',
        'Kiri atas',
        'Kanan atas',
        'Tegak lurus',
      ],
      correctAnswer: 2,
      explanation: 'Kurva penawaran memiliki slope positif, artinya bergerak miring naik dari kiri bawah ke kanan atas.',
    },
    {
      id: 'qs9',
      question: 'Penerapan pajak oleh pemerintah akan mengakibatkan...',
      options: [
        'Penawaran bertambah',
        'Penawaran berkurang',
        'Permintaan bertambah',
        'Harga barang turun',
      ],
      correctAnswer: 1,
      explanation: 'Pajak dianggap sebagai tambahan biaya bagi produsen. Jika biaya naik, penawaran berkurang (kurva geser kiri).',
    },
    {
      id: 'qs10',
      question: 'Dalam fungsi Qs = aP - b, nilai "a" disebut...',
      options: [
        'Konstanta',
        'Intersep',
        'Slope / Kemiringan',
        'Variabel',
      ],
      correctAnswer: 2,
      explanation: 'Nilai "a" yang melekat pada P adalah gradien/slope/kemiringan kurva.',
    },
  ],
  glossary: {
    'Penawaran (Supply)': 'Jumlah barang yang ditawarkan produsen pada berbagai tingkat harga.',
    'Hukum Penawaran': 'Harga naik, penawaran naik; Harga turun, penawaran turun (ceteris paribus).',
    'Biaya Produksi': 'Semua pengeluaran yang dilakukan perusahaan untuk menghasilkan barang/jasa.',
    'Profit Motive': 'Dorongan/motivasi produsen untuk mendapatkan keuntungan sebesar-besarnya.',
    'Kurva Penawaran': 'Grafik yang menghubungkan harga dan jumlah penawaran (slope positif).',
    'Slope Positif': 'Kemiringan garis naik ke kanan atas (berbanding lurus).',
    'Pergeseran Kurva S': 'Perubahan posisi kurva S akibat faktor non-harga.',
    'Pajak': 'Iuran wajib yang meningkatkan biaya produksi dan menurunkan penawaran.',
    'Subsidi': 'Bantuan pemerintah yang menurunkan biaya produksi dan menaikkan penawaran.',
    'Teknologi': 'Metode produksi yang jika semakin canggih akan meningkatkan penawaran.',
  },
};

// Ekonomi module for Kelas X
export const ekonomiModules: Module[] = [demandModule, supplyModule];

// All modules (untuk backwards compatibility)
export const modules: Module[] = [demandModule, supplyModule];

