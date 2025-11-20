# Struktur Frontend dan Backend - Portfolio Website

## 📋 Daftar Isi
1. [Backend Structure](#backend-structure)
2. [Frontend Structure](#frontend-structure)
3. [Arsitektur dan Alur Data](#arsitektur-dan-alur-data)
4. [Komunikasi Frontend-Backend](#komunikasi-frontend-backend)

---

## 🔧 BACKEND STRUCTURE

Backend menggunakan **Express.js** dengan arsitektur **MVC (Model-View-Controller)**.

### 📁 Root Directory Backend

```
portofolio_v2/
├── index.js                    # Entry point server Express.js
├── package.json                # Dependencies dan scripts
├── .env                        # Environment variables (konfigurasi)
└── config.env                  # Template konfigurasi
```

### 📂 Folder dan File Backend

#### 1. **config/** - Konfigurasi
```
config/
└── database.js                 # Koneksi MongoDB menggunakan Mongoose
```
**Fungsi**: Menghubungkan aplikasi ke database MongoDB

#### 2. **models/** - Data Models (Schema Database)
```
models/
├── User.js                     # Model untuk user/admin (username, password, role)
├── Project.js                  # Model untuk project portfolio
└── Settings.js                 # Model untuk pengaturan website (hero section, dll)
```
**Fungsi**: 
- Mendefinisikan struktur data (schema) menggunakan Mongoose
- Menyediakan validasi data
- Berisi method untuk interaksi database

#### 3. **controllers/** - Business Logic
```
controllers/
├── authController.js           # Login, logout, status check
├── projectController.js        # CRUD operations untuk projects
└── settingsController.js      # Update settings website
```
**Fungsi**: 
- Menangani logic bisnis aplikasi
- Berinteraksi dengan models untuk CRUD operations
- Mengembalikan response ke client (JSON)

**Contoh Flow**:
```
Request → Controller → Model → Database → Model → Controller → Response
```

#### 4. **routes/** - API Endpoints
```
routes/
├── auth.js                     # Routes: /api/auth/*
│   ├── POST /api/auth/login
│   ├── POST /api/auth/logout
│   └── GET /api/auth/status
├── projects.js                 # Routes: /api/projects/*
│   ├── GET /api/projects
│   ├── GET /api/projects/featured
│   ├── GET /api/projects/category/:category
│   ├── POST /api/projects (admin only)
│   ├── PUT /api/projects/:id (admin only)
│   └── DELETE /api/projects/:id (admin only)
└── settings.js                 # Routes: /api/settings/*
    ├── GET /api/settings
    └── PUT /api/settings (admin only)
```
**Fungsi**: 
- Mendefinisikan endpoint API
- Menghubungkan URL dengan controller functions
- Menambahkan middleware (authentication, file upload)

#### 5. **middleware/** - Middleware Functions
```
middleware/
└── auth.js                     # Authentication & Authorization middleware
    ├── requireAuth()           # Cek apakah user sudah login
    └── requireAdmin()          # Cek apakah user adalah admin
```
**Fungsi**: 
- Validasi autentikasi sebelum mengakses route tertentu
- Role-based access control (admin vs visitor)

#### 6. **views/** - Server-Side Rendering Templates
```
views/
├── index.ejs                   # Template untuk halaman portfolio (public)
└── admin.ejs                   # Template untuk admin panel
```
**Fungsi**: 
- Template EJS yang dirender di server
- Menghasilkan HTML yang dikirim ke browser
- Menggunakan engine EJS (embedded JavaScript)

---

## 🎨 FRONTEND STRUCTURE

Frontend menggunakan **Vanilla JavaScript** (tanpa framework) dengan **static assets**.

### 📁 Folder `public/` - Static Files

Semua file di folder `public/` dilayani sebagai static files oleh Express.js.

```
public/
├── css/
│   ├── style.css              # Styling untuk halaman portfolio
│   └── admin.css              # Styling untuk admin panel
│
├── js/
│   ├── main.js                # JavaScript untuk halaman portfolio
│   └── admin.js               # JavaScript untuk admin panel
│
├── assets/                    # Gambar, logo, icons
│   ├── Foto.JPG
│   ├── hero1.jpg
│   ├── Adobe_Photoshop_CC_icon.svg.png
│   └── ... (file assets lainnya)
│
└── uploads/                   # Gambar project yang diupload admin
    └── image-*.jpg/png/webp
```

### 📄 Frontend Files Detail

#### 1. **views/index.ejs** - Halaman Portfolio (Public)
**Struktur HTML**:
- Navigation bar
- Hero section (dengan foto profil)
- About section
- Skills section
- Projects section (dinamis, di-load dari API)
- Contact section
- Footer

**Fitur**:
- Menggunakan EJS template engine
- Data dinamis di-load via JavaScript (`main.js`)
- Responsive design

#### 2. **views/admin.ejs** - Admin Panel
**Struktur HTML**:
- Login modal
- Admin dashboard
- Project management table
- Settings form (hero section, skills summary)
- Add/Edit project modal
- Delete confirmation modal

**Fitur**:
- Authentication required
- CRUD operations untuk projects
- Update settings website
- Image upload dengan preview

#### 3. **public/js/main.js** - Frontend Logic Portfolio
**Fungsi Utama**:
```javascript
// 1. Load Settings dari API
loadSettings() → fetch('/api/settings')

// 2. Load Projects dari API
loadProjects(category) → fetch('/api/projects')

// 3. DOM Manipulation
- Toggle mobile navbar
- Smooth scrolling
- Project filtering
- Parallax effects
- Animations

// 4. Apply Settings ke HTML
applySettings(settings) → Update hero, skills, footer
```

**Karakteristik Frontend**:
- ✅ Menggunakan `document.addEventListener`
- ✅ Manipulasi DOM (`querySelector`, `getElementById`)
- ✅ Fetch API untuk komunikasi dengan backend
- ✅ Event handling (click, scroll, submit)
- ✅ Client-side rendering (menampilkan data dari API)

#### 4. **public/js/admin.js** - Frontend Logic Admin Panel
**Fungsi Utama**:
```javascript
// 1. Authentication
checkAuthStatus() → fetch('/api/auth/status')
handleLogin() → fetch('/api/auth/login', POST)
logout() → fetch('/api/auth/logout', POST)

// 2. Project Management
loadProjects() → fetch('/api/projects')
handleProjectSubmit() → fetch('/api/projects', POST/PUT)
deleteProject() → fetch('/api/projects/:id', DELETE)

// 3. Settings Management
loadSettings() → fetch('/api/settings')
saveSetting() → fetch('/api/settings', PUT)

// 4. UI Interactions
- Modal handling
- Form validation
- Image preview
- Success/Error messages
```

**Karakteristik Frontend**:
- ✅ Menggunakan Fetch API untuk semua operasi
- ✅ FormData untuk upload file
- ✅ Modal management
- ✅ Real-time updates tanpa reload

#### 5. **public/css/style.css** - Styling Portfolio
- Styling untuk semua section portfolio
- Responsive design (mobile, tablet, desktop)
- Animations dan transitions
- Color scheme dan typography

#### 6. **public/css/admin.css** - Styling Admin Panel
- Styling khusus untuk admin interface
- Table styling
- Modal styling
- Form styling

---

## 🔄 ARSITEKTUR DAN ALUR DATA

### Request Flow (Frontend → Backend)

```
Browser (Frontend)
    ↓
1. User mengklik/berinteraksi
    ↓
2. JavaScript (main.js/admin.js) menangani event
    ↓
3. Fetch API request ke endpoint backend
    ↓
Express Server (Backend)
    ↓
4. Route menerima request (routes/*.js)
    ↓
5. Middleware validasi (auth.js) - jika diperlukan
    ↓
6. Controller memproses request (controllers/*.js)
    ↓
7. Model berinteraksi dengan database (models/*.js)
    ↓
8. Database (MongoDB) menyimpan/mengambil data
    ↓
9. Response dikembalikan sebagai JSON
    ↓
Browser (Frontend)
    ↓
10. JavaScript menerima response
    ↓
11. DOM di-update dengan data baru
```

### Contoh Flow: Menampilkan Projects

```
1. User membuka halaman portfolio (/)
   ↓
2. index.ejs di-render di server → HTML dikirim ke browser
   ↓
3. Browser load main.js
   ↓
4. main.js menjalankan: loadProjects('all')
   ↓
5. Fetch request: GET /api/projects
   ↓
6. Route: routes/projects.js → getAllProjects
   ↓
7. Controller: projectController.js → getAllProjects()
   ↓
8. Model: Project.find() → Query ke MongoDB
   ↓
9. MongoDB mengembalikan data projects
   ↓
10. Controller mengembalikan JSON: res.json(projects)
    ↓
11. main.js menerima response → displayProjects(projects)
    ↓
12. DOM di-update: projectsGrid.innerHTML = ...
```

### Contoh Flow: Admin Menambah Project

```
1. Admin login → POST /api/auth/login
   ↓
2. Session dibuat → req.session.userId = user._id
   ↓
3. Admin mengisi form project → admin.js
   ↓
4. Form submit → handleProjectSubmit()
   ↓
5. Fetch request: POST /api/projects (dengan FormData + image)
   ↓
6. Route: routes/projects.js → requireAdmin middleware
   ↓
7. Middleware auth.js: Cek session → Jika admin, lanjut
   ↓
8. Multer middleware: Upload file ke public/uploads/
   ↓
9. Controller: projectController.js → createProject()
   ↓
10. Model: new Project() → project.save()
    ↓
11. MongoDB menyimpan project baru
    ↓
12. Response: res.status(201).json(project)
    ↓
13. admin.js menerima response → loadProjects() (refresh table)
```

---

## 🔌 KOMUNIKASI FRONTEND-BACKEND

### API Endpoints yang Digunakan Frontend

#### **main.js** menggunakan:
1. `GET /api/settings` - Load settings website
2. `GET /api/projects` - Load semua projects
3. `GET /api/projects/category/:category` - Filter projects by category

#### **admin.js** menggunakan:
1. `GET /api/auth/status` - Cek status login
2. `POST /api/auth/login` - Login admin
3. `POST /api/auth/logout` - Logout admin
4. `GET /api/projects` - Load projects untuk table
5. `POST /api/projects` - Create project baru
6. `PUT /api/projects/:id` - Update project
7. `DELETE /api/projects/:id` - Delete project
8. `GET /api/settings` - Load settings
9. `PUT /api/settings` - Update settings

### Data Format

**Request Format**:
- JSON: `Content-Type: application/json`
- FormData: `enctype: multipart/form-data` (untuk file upload)

**Response Format**:
- JSON: `{ message: "...", data: {...} }`
- Array: `[{...}, {...}]`
- Single Object: `{...}`

---

## 📊 RINGKASAN PERBEDAAN

| Aspek | Backend | Frontend |
|-------|---------|----------|
| **Lokasi** | Root folder, `config/`, `controllers/`, `routes/`, `models/`, `middleware/` | `public/`, `views/` |
| **Bahasa** | Node.js (JavaScript Server-side) | JavaScript (Client-side) |
| **Framework** | Express.js | Vanilla JS (tanpa framework) |
| **Template Engine** | EJS (di server) | - |
| **Database** | MongoDB (via Mongoose) | - |
| **API** | Menyediakan REST API | Menggunakan Fetch API |
| **File Upload** | Multer (server-side) | FormData (client-side) |
| **Authentication** | Express-session | Fetch API + Session |
| **Rendering** | Server-side (EJS) | Client-side (DOM manipulation) |
| **Static Files** | Melayani dari `public/` | File di `public/` |

---

## 🎯 KESIMPULAN

**Backend**:
- Menyediakan API endpoints untuk CRUD operations
- Mengelola database (MongoDB)
- Menangani authentication & authorization
- Memproses file uploads
- Render template EJS

**Frontend**:
- Menampilkan UI kepada user
- Berkomunikasi dengan backend via Fetch API
- Menangani user interactions
- Memanipulasi DOM untuk update UI
- Client-side rendering dan animations

**Komunikasi**: REST API menggunakan JSON dan FormData untuk file uploads.


