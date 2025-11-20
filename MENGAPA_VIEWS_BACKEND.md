# Mengapa Folder `views/` Termasuk Backend?

## 🎯 Jawaban Singkat

**Folder `views/` termasuk BACKEND** karena menggunakan **Server-Side Rendering (SSR)**. File EJS di-render di **SERVER** sebelum dikirim ke browser, bukan di client.

---

## 📊 Perbandingan: Server-Side vs Client-Side Rendering

### **Server-Side Rendering (SSR) - BACKEND** ✅
```
User Request → Server → Render Template → HTML Lengkap → Browser
```
- Template diproses di **SERVER**
- Server mengirim HTML yang sudah jadi
- Browser hanya menampilkan HTML final

### **Client-Side Rendering (CSR) - FRONTEND** ❌
```
User Request → Server → Send JS/JSON → Browser → Render di Browser
```
- Template diproses di **BROWSER**
- Browser menerima data, lalu render sendiri

---

## 🔍 Bukti dari Kode Project

### 1. **Konfigurasi di `index.js`**

```javascript
// View engine setup
app.set('view engine', 'ejs');              // Set EJS sebagai template engine
app.set('views', path.join(__dirname, 'views'));  // Set lokasi views folder
```

**Ini artinya**:
- Express.js dikonfigurasi untuk menggunakan EJS engine
- EJS engine berjalan di **SERVER**, bukan di browser

### 2. **Rendering di Route Handler**

```javascript
// Serve main portfolio page
app.get('/', (req, res) => {
  res.render('index');  // ← RENDER DI SERVER!
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.render('admin');  // ← RENDER DI SERVER!
});
```

**Apa yang terjadi**:
1. User request ke `/` atau `/admin`
2. **Server** (Express.js) menerima request
3. **Server** memproses file `views/index.ejs` atau `views/admin.ejs`
4. EJS engine (di server) mengubah template menjadi HTML
5. **Server** mengirim HTML lengkap ke browser
6. Browser menerima HTML yang sudah jadi

### 3. **File EJS Tidak Pernah Dikirim ke Browser**

File `.ejs` **tidak pernah** dikirim langsung ke browser. Yang dikirim adalah **HTML hasil render**.

```
Browser Request: GET /
       ↓
Server: Baca views/index.ejs
       ↓
Server: EJS Engine render → HTML
       ↓
Server: Kirim HTML ke browser
       ↓
Browser: Terima HTML (bukan file .ejs)
```

---

## 🔄 Proses Rendering Detail

### **Step-by-Step Rendering Process**

```
┌─────────────────────────────────────────────────────────┐
│ 1. USER REQUEST                                          │
│    Browser: GET http://localhost:3000/                   │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 2. SERVER MENERIMA REQUEST                               │
│    Express.js: app.get('/', (req, res) => { ... })      │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 3. SERVER MEMBACA TEMPLATE                               │
│    File: views/index.ejs                                 │
│    (File ini HANYA ada di server, tidak di browser)      │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 4. EJS ENGINE RENDER (DI SERVER!)                       │
│    EJS Engine membaca template                           │
│    Memproses syntax EJS (jika ada)                       │
│    Menghasilkan HTML murni                                │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 5. SERVER KIRIM HTML KE BROWSER                          │
│    res.render('index') → HTML lengkap                   │
└──────────────────┬──────────────────────────────────────┘
                   ↓
┌─────────────────────────────────────────────────────────┐
│ 6. BROWSER MENERIMA HTML                                 │
│    Browser dapat HTML yang sudah jadi                    │
│    Browser tidak pernah melihat file .ejs                │
│    Browser render HTML ke layar                        │
└─────────────────────────────────────────────────────────┘
```

---

## 💡 Perbedaan dengan Client-Side Rendering

### **React/Vue (Client-Side Rendering) - FRONTEND**

```javascript
// React Component (Frontend)
function App() {
  return <div>Hello World</div>;
}

// Browser menerima:
// - Bundle JavaScript
// - Browser yang render component
```

**File yang dikirim ke browser**: JavaScript files
**Rendering terjadi**: Di browser (client)

### **EJS (Server-Side Rendering) - BACKEND**

```javascript
// EJS Template (Backend)
// views/index.ejs
<div>Hello World</div>

// Server render menjadi:
// <div>Hello World</div>
```

**File yang dikirim ke browser**: HTML yang sudah jadi
**Rendering terjadi**: Di server (backend)

---

## 🎯 Alasan Folder `views/` Backend

### 1. **Diproses di Server**
- EJS engine berjalan di Node.js server
- Template diproses sebelum dikirim ke browser

### 2. **Tidak Dapat Diakses Browser**
- File `.ejs` tidak pernah dikirim ke browser
- Browser hanya menerima HTML hasil render
- User tidak bisa melihat source code EJS

### 3. **Menggunakan Server Resources**
- Memori server untuk render
- CPU server untuk proses template
- File system server untuk membaca template

### 4. **Bisa Akses Server Data**
EJS bisa mengakses data dari server (meskipun di project ini tidak digunakan):

```ejs
<!-- Contoh: EJS bisa akses data dari server -->
<% const projects = await Project.find(); %>
<% projects.forEach(project => { %>
  <div><%= project.title %></div>
<% }); %>
```

**Ini tidak mungkin dilakukan di frontend** karena:
- Frontend tidak bisa langsung akses database
- Frontend tidak bisa menggunakan `await` di template

---

## 📁 Struktur Folder yang Benar

```
portofolio_v2/
├── views/              ← BACKEND (Server-Side Rendering)
│   ├── index.ejs       (Template, diproses di server)
│   └── admin.ejs       (Template, diproses di server)
│
├── public/             ← FRONTEND (Static Files)
│   ├── js/             (JavaScript client-side)
│   ├── css/            (Styling)
│   └── assets/         (Images, dll)
│
├── controllers/        ← BACKEND (Business Logic)
├── routes/             ← BACKEND (API Routes)
├── models/             ← BACKEND (Database Models)
└── middleware/         ← BACKEND (Auth, dll)
```

---

## ✅ Kesimpulan

**Folder `views/` termasuk BACKEND karena**:

1. ✅ **Server-Side Rendering**: Template di-render di server, bukan di browser
2. ✅ **Diproses oleh Express.js**: EJS engine berjalan di Node.js server
3. ✅ **Tidak dikirim ke browser**: Browser hanya menerima HTML hasil render
4. ✅ **Menggunakan server resources**: Memori, CPU, file system server
5. ✅ **Bisa akses server data**: Template bisa mengakses database, session, dll

**Perbedaan utama**:
- **Backend (views/)**: Template diproses di **SERVER** → HTML dikirim ke browser
- **Frontend (public/)**: File statis dikirim langsung ke browser → Browser yang render

---

## 🔗 Referensi

- **EJS**: Embedded JavaScript templating engine
- **Server-Side Rendering**: Rendering HTML di server sebelum dikirim ke client
- **Express.js `res.render()`**: Method untuk render template di server


