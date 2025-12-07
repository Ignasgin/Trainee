# 🏋️ TRAINEE - GALUTINĖ PROJEKTO ATASKAITA

**Projekto pavadinimas:** Trainee - Mitybos ir Sporto Planų Platforma  
**Autorius:** [Jūsų vardas]  
**Data:** 2025-11-28  
**GitHub:** https://github.com/Ignasgin/Trainee  
**Live Demo:** https://trainee-api.azurewebsites.net

---

## 1. SPRENDŽIAMO UŽDAVINIO APRAŠYMAS

### 1.1. Sistemos Paskirtis

Trainee yra internetinė platforma, skirta mitybos ir sporto planų kūrimui, dalijimusiui bei naudojimui. Sistema padeda vartotojams:

- **Kurti** asmeninius mitybos planus ir treniruočių programas
- **Dalintis** savo sukurtais planais su bendruomene
- **Stebėti** su sveikata susijusią informaciją (kalorijų skaičiavimas, rekomendacijos)
- **Bendrauti** su kitais vartotojais per komentarus ir reitingavimą
- **Įsitraukti** į sveikos gyvensenos veiklas

**Pagrindinė problema:** Žmonėms trūksta centralizuotos platformos, kur galėtų rasti patikimus, bendruomenės patvirtintus mitybos ir sporto planus, pritaikytus įvairiems tikslams.

**Sprendimas:** Trainee platforma su moderuotu turiniu, vartotojų įvertinimais ir socialinėmis funkcijomis, leidžianti lengvai rasti, kurti ir sekti mitybos/sporto planus.

---

### 1.2. Funkciniai Reikalavimai

#### 1.2.1. Neregistruotas Naudotojas (Svečias)

| ID | Reikalavimas | Prioritetas |
|----|--------------|-------------|
| FR-G1 | Peržiūrėti viešai paskelbtus postus (meal/workout plans) | Aukštas |
| FR-G2 | Peržiūrėti komentarus ir reitingus | Aukštas |
| FR-G3 | Peržiūrėti platformos reprezentacinį puslapį | Vidutinis |
| FR-G4 | Užsiregistruoti sistemoje | Aukštas |
| FR-G5 | Prisijungti prie sistemos | Aukštas |

#### 1.2.2. Registruotas Naudotojas

| ID | Reikalavimas | Prioritetas |
|----|--------------|-------------|
| FR-U1 | Atsijungti nuo sistemos | Aukštas |
| FR-U2 | Kurti naujus postus (mitybos planai / treniruočių sekos) | Aukštas |
| FR-U3 | Pridėti papildomą informaciją (kalorijų skaičiavimas, rekomendacijos) | Vidutinis |
| FR-U4 | Redaguoti savo sukurtus postus | Aukštas |
| FR-U5 | Ištrinti savo postus | Aukštas |
| FR-U6 | Paskelbti postą viešai (laukia admin patvirtinimo) | Aukštas |
| FR-U7 | Komentuoti kitų vartotojų postus | Vidutinis |
| FR-U8 | Reitinguoti kitų vartotojų planus (1-5 žvaigždutės) | Vidutinis |
| FR-U9 | Peržiūrėti savo profilio informaciją ir postus | Aukštas |
| FR-U10 | Peržiūrėti tik patvirtintus viešus postus sekcijose | Aukštas |
| FR-U11 | Peržiūrėti visus savo postus (įskaitant laukiančius patvirtinimo) | Vidutinis |

#### 1.2.3. Administratorius

| ID | Reikalavimas | Prioritetas |
|----|--------------|-------------|
| FR-A1 | Patvirtinti naujų naudotojų registracijas | Aukštas |
| FR-A2 | Patvirtinti/atmesti viešai norimus skelbti postus | Aukštas |
| FR-A3 | Šalinti netinkamus postus | Aukštas |
| FR-A4 | Šalinti netinkamus komentarus | Vidutinis |
| FR-A5 | Pašalinti naudotojus, pažeidžiančius taisykles | Žemas |
| FR-A6 | Peržiūrėti sistemos debug informaciją (visi postai/vartotojai) | Žemas |

---

## 2. SISTEMOS ARCHITEKTŪRA

### 2.1. UML Deployment Diagrama

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT DEVICE                           │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Web Browser (Chrome/Firefox/Safari)          │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  React SPA (Single Page Application)          │  │   │
│  │  │  - React 19.2.0                                │  │   │
│  │  │  - React Router DOM 7.9.6                      │  │   │
│  │  │  - Tailwind CSS 3.4.0                          │  │   │
│  │  │  - Axios HTTP Client                           │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │ JSON
                            ▼
┌─────────────────────────────────────────────────────────────┐
│              AZURE APP SERVICE (Cloud)                      │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         Web Server (Gunicorn/Whitenoise)            │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  Django REST Framework Backend               │  │   │
│  │  │  - Django 5.2.7                               │  │   │
│  │  │  - Django REST Framework 3.16.1               │  │   │
│  │  │  - Simple JWT Authentication                  │  │   │
│  │  │  - CORS Headers                               │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  │                                                        │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  Static Files (Whitenoise)                    │  │   │
│  │  │  - React build output (HTML/CSS/JS)           │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ MySQL Protocol
                            │ TCP 3306
                            ▼
┌─────────────────────────────────────────────────────────────┐
│         AZURE MYSQL FLEXIBLE SERVER (Cloud)                 │
│  ┌─────────────────────────────────────────────────────┐   │
│  │              MySQL Database 8.0                      │   │
│  │  ┌───────────────────────────────────────────────┐  │   │
│  │  │  Database Tables:                             │  │   │
│  │  │  - auth_user                                  │  │   │
│  │  │  - core_section                               │  │   │
│  │  │  - core_post                                  │  │   │
│  │  │  - core_comment                               │  │   │
│  │  │  - core_rating                                │  │   │
│  │  └───────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ CI/CD Pipeline
                            │
┌─────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY                        │
│  ┌─────────────────────────────────────────────────────┐   │
│  │           GitHub Actions (Automation)                │   │
│  │  - Automatic build on git push                       │   │
│  │  - Frontend build (npm run build)                    │   │
│  │  - Python dependencies install                       │   │
│  │  - collectstatic for Django                          │   │
│  │  - Deploy to Azure App Service                       │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### 2.2. Technologijų Stacks

#### Frontend Stack
- **Framework:** React 19.2.0
- **Build Tool:** Vite 7.2.2
- **Styling:** Tailwind CSS 3.4.0
- **Routing:** React Router DOM 7.9.6
- **HTTP Client:** Axios 1.13.2
- **Icons:** React Icons 5.4.0
- **Fonts:** Google Fonts (Inter)

#### Backend Stack
- **Framework:** Django 5.2.7
- **REST API:** Django REST Framework 3.16.1
- **Authentication:** Simple JWT 5.5.1
- **CORS:** django-cors-headers 4.6.0
- **Database Driver:** mysql-connector-python 9.1.0
- **Static Files:** Whitenoise 6.8.2

#### Infrastructure
- **Hosting:** Azure App Service
- **Database:** Azure MySQL Flexible Server
- **CI/CD:** GitHub Actions
- **Protocol:** HTTPS
- **Domain:** trainee-api.azurewebsites.net

---

## 3. NAUDOTOJO SĄSAJOS PROJEKTAS

### 3.1. Wireframe'ai ir Realizacijos

#### 3.1.1. Pagrindinis Puslapis (Home)

**Wireframe:**
```
┌────────────────────────────────────────────────────┐
│  Header [Logo] [Home] [Profile] [Admin] [Logout]  │
├────────────────────────────────────────────────────┤
│                                                    │
│         Welcome to Trainee                         │
│    Your nutrition and workout platform             │
│                                                    │
│  [Create New Post]  [About Platform]               │
│                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Section  │  │ Section  │  │ Section  │        │
│  │   [📁]   │  │   [📁]   │  │   [📁]   │        │
│  │  Weight  │  │  Cardio  │  │   Diet   │        │
│  │  Loss    │  │          │  │  Plans   │        │
│  │ 15 posts │  │ 23 posts │  │ 31 posts │        │
│  └──────────┘  └──────────┘  └──────────┘        │
│                                                    │
├────────────────────────────────────────────────────┤
│  Footer: Made with ❤️ | © 2025 | About | Contact  │
└────────────────────────────────────────────────────┘
```

**Realizacija:**
![Home Page Screenshot]
<!-- Įkelkite screenshot čia -->
_Screenshot'as: Pagrindinis puslapis su sekcijų kortomis_

**Funkcionalumas:**
- Responsive 3-column grid (desktop) → 1-column (mobile)
- Hover efektai ant kortelių
- Gradient header
- Modal "About Platform" su informacija

---

#### 3.1.2. Registracija (Register)

**Wireframe:**
```
┌────────────────────────────────┐
│  Header                        │
├────────────────────────────────┤
│                                │
│    Create Your Account         │
│                                │
│  Username: [____________]      │
│  Email:    [____________]      │
│  Password: [____________]      │
│  Confirm:  [____________]      │
│                                │
│     [Create Account]           │
│                                │
│  Already have account? Login   │
│                                │
├────────────────────────────────┤
│  Footer                        │
└────────────────────────────────┘
```

**Realizacija:**
![Register Page Screenshot]
<!-- Įkelkite screenshot čia -->
_Screenshot'as: Registracijos forma su ikonelėmis_

**Funkcionalumas:**
- Real-time validation
- Password strength indicator (vizualiai)
- Ikonos prie kiekvieno input
- Error messages po laukais

---

#### 3.1.3. Post'o Kūrimas (Create Post)

**Wireframe:**
```
┌──────────────────────────────────────┐
│  Header                              │
├──────────────────────────────────────┤
│                                      │
│    Create New Post                   │
│                                      │
│  Title: [___________________]        │
│                                      │
│  Type:  (•) Meal  ( ) Workout        │
│                                      │
│  Section: [Dropdown ▼]               │
│                                      │
│  Description:                        │
│  [________________________]          │
│  [________________________]          │
│  [________________________]          │
│                                      │
│  Calories: [______]  (optional)      │
│                                      │
│  Recommendations:                    │
│  [________________________]          │
│                                      │
│     [Submit Post]                    │
│                                      │
├──────────────────────────────────────┤
│  Footer                              │
└──────────────────────────────────────┘
```

**Realizacija:**
![Create Post Screenshot]
<!-- Įkelkite screenshot čia -->
_Screenshot'as: Post'o kūrimo forma su visais laukais_

**Funkcionalumas:**
- Radio buttons su ikonelėmis (Meal 🍽️ / Workout 🏋️)
- Dropdown su sekcijomis
- Textarea su line-clamp
- Number input kalorijoms
- Validacija su error pranešimais

---

#### 3.1.4. Post'o Detalės (Post Detail)

**Wireframe:**
```
┌────────────────────────────────────────┐
│  Header                                │
├────────────────────────────────────────┤
│  [← Back]                              │
│                                        │
│  Meal Plan Title                       │
│  By: username | Section: Weight Loss   │
│  ⭐ 4.5 (23 ratings) | 💬 15 comments   │
│  🔥 500 kcal                           │
│                                        │
│  Description text here...              │
│                                        │
│  Recommendations:                      │
│  - Tip 1                               │
│  - Tip 2                               │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Rate this post: ⭐⭐⭐⭐⭐          │ │
│  └──────────────────────────────────┘ │
│                                        │
│  Comments:                             │
│  ┌──────────────────────────────────┐ │
│  │ 👤 user123    |  2025-11-20      │ │
│  │ Great plan!                   [🗑]│ │
│  └──────────────────────────────────┘ │
│                                        │
│  [Add Comment: _______________]        │
│                                        │
├────────────────────────────────────────┤
│  Footer                                │
└────────────────────────────────────────┘
```

**Realizacija:**
![Post Detail Screenshot]
<!-- Įkelkite screenshot čia -->
_Screenshot'as: Post'o detalės su komentarais ir rating_

**Funkcionalumas:**
- Star rating su hover efektais
- Comment lista su delete mygtuku (admin)
- Author info su ikonėlėmis
- Statistika (calories, rating, comments)
- Responsive layout

---

#### 3.1.5. Profilis (Profile)

**Wireframe:**
```
┌────────────────────────────────────────┐
│  Header                                │
├────────────────────────────────────────┤
│                                        │
│  👤 Username                           │
│  📧 email@example.com                  │
│  Role: User                            │
│                                        │
│  Your Posts:                           │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Post Title           [✏️] [🗑️]  │ │
│  │ 🍽️ Meal | ⏳ Pending Approval   │ │
│  │ Description preview...            │ │
│  │ 🔥 500 kcal | ⭐ 4.5 | 💬 10      │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Another Post        [✏️] [🗑️]   │ │
│  │ 🏋️ Workout | ✅ Approved         │ │
│  └──────────────────────────────────┘ │
│                                        │
├────────────────────────────────────────┤
│  Footer                                │
└────────────────────────────────────────┘
```

**Realizacija:**
![Profile Screenshot]
<!-- Įkelkite screenshot čia -->
_Screenshot'as: Vartotojo profilis su post'ų sąrašu_

**Funkcionalumas:**
- Vartotojo info card
- Post'ų sąrašas su status badges
- Edit ir Delete mygtukai kiekvienam post'ui
- Status indicator (Pending/Approved)
- Statistika prie kiekvieno post'o

---

#### 3.1.6. Admin Panel

**Wireframe:**
```
┌────────────────────────────────────────┐
│  Header                                │
├────────────────────────────────────────┤
│                                        │
│  Admin Panel                           │
│                                        │
│  [Pending Users] [Pending Posts] [Debug]│
│                                        │
│  Pending Posts (5):                    │
│  ┌──────────────────────────────────┐ │
│  │ Post Title - by user123          │ │
│  │ Type: Meal | Section: Diet Plans │ │
│  │ [✅ Approve]  [❌ Reject]         │ │
│  └──────────────────────────────────┘ │
│                                        │
│  ┌──────────────────────────────────┐ │
│  │ Another Post - by user456        │ │
│  │ Type: Workout | Section: Cardio  │ │
│  │ [✅ Approve]  [❌ Reject]         │ │
│  └──────────────────────────────────┘ │
│                                        │
├────────────────────────────────────────┤
│  Footer                                │
└────────────────────────────────────────┘
```

**Realizacija:**
![Admin Panel Screenshot]
<!-- Įkelkite screenshot čia -->
_Screenshot'as: Admin panel su pending posts_

**Funkcionalumas:**
- Tab navigation (Pending Users / Posts / Debug)
- Approve/Reject mygtukai
- Debug view su visais posts/users
- System statistics summary

---

### 3.2. Responsive Design Pavyzdžiai

#### Desktop (>768px)
![Desktop View Screenshot]
<!-- Įkelkite screenshot čia -->
_Screenshot'as: Desktop layout su horizontal navigation_

#### Mobile (<768px)
![Mobile View Screenshot]
<!-- Įkelkite screenshot čia -->
_Screenshot'as: Mobile layout su hamburger menu_

#### Hamburger Menu
![Hamburger Menu Screenshot]
<!-- Įkelkite screenshot čia -->
_Screenshot'as: Slide-in mobile menu_

---

## 4. API SPECIFIKACIJA

### 4.1. OpenAPI Dokumentacija

Pilną API specifikaciją rasite: `api-spec.yaml` faile.

**Base URL:** `https://trainee-api.azurewebsites.net/api`

**Authentication:** Bearer JWT Token
```
Authorization: Bearer <access_token>
```

---

### 4.2. API Endpoint'ai su Pavyzdžiais

#### 4.2.1. Autentifikacija

##### POST /api/auth/login/
**Aprašymas:** Prisijungti prie sistemos ir gauti JWT tokens

**Request Body:**
```json
{
  "username": "demo_user",
  "password": "password123"
}
```

**Response 200 OK:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "demo_user",
    "email": "demo@example.com",
    "role": "user",
    "is_active": true
  }
}
```

**Response 401 Unauthorized:**
```json
{
  "detail": "No active account found with the given credentials"
}
```

**Galimi Response Codes:**
- `200` - Sėkmingai prisijungta
- `400` - Netinkami duomenys
- `401` - Neteisingi credentials

---

##### POST /api/auth/refresh/
**Aprašymas:** Atnaujinti access token naudojant refresh token

**Request Body:**
```json
{
  "refresh": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response 200 OK:**
```json
{
  "access": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Galimi Response Codes:**
- `200` - Token atnaujintas
- `401` - Refresh token invalid/expired

---

#### 4.2.2. Vartotojai

##### POST /api/users/register/
**Aprašymas:** Registruoti naują vartotoją (laukia admin patvirtinimo)

**Request Body:**
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "securePass123",
  "password2": "securePass123"
}
```

**Response 201 Created:**
```json
{
  "id": 15,
  "username": "newuser",
  "email": "newuser@example.com",
  "is_active": false,
  "message": "User registered successfully. Awaiting admin approval."
}
```

**Response 400 Bad Request:**
```json
{
  "username": ["A user with that username already exists."],
  "email": ["Enter a valid email address."],
  "password": ["This password is too short. It must contain at least 8 characters."]
}
```

**Galimi Response Codes:**
- `201` - Sėkmingai užsiregistruota
- `400` - Validation errors

---

##### GET /api/users/{id}/posts/
**Aprašymas:** Gauti vartotojo postus

**Authorization:** Required (JWT)

**Response 200 OK:**
```json
{
  "count": 5,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 10,
      "title": "High Protein Breakfast",
      "description": "Perfect morning meal...",
      "type": "meal",
      "section": {
        "id": 2,
        "name": "Weight Loss"
      },
      "calories": 450,
      "is_public": true,
      "is_approved": true,
      "average_rating": 4.5,
      "comment_count": 12,
      "created_at": "2025-11-20T10:30:00Z"
    }
  ]
}
```

**Galimi Response Codes:**
- `200` - Success
- `401` - Unauthorized
- `404` - User not found

---

#### 4.2.3. Sekcijos

##### GET /api/sections/
**Aprašymas:** Gauti visas sekcijas

**Authorization:** Not required

**Response 200 OK:**
```json
{
  "count": 6,
  "results": [
    {
      "id": 1,
      "name": "Weight Loss",
      "description": "Plans and workouts for losing weight",
      "post_count": 15
    },
    {
      "id": 2,
      "name": "Muscle Gain",
      "description": "Build muscle mass with our programs",
      "post_count": 23
    }
  ]
}
```

**Galimi Response Codes:**
- `200` - Success

---

##### GET /api/sections/{id}/posts/
**Aprašymas:** Gauti sekcijos postus (tik patvirtinti viešai)

**Authorization:** Not required

**Response 200 OK:**
```json
{
  "count": 15,
  "results": [
    {
      "id": 5,
      "title": "Keto Diet Plan",
      "description": "Complete keto meal plan for beginners...",
      "type": "meal",
      "author_username": "keto_expert",
      "calories": 1800,
      "average_rating": 4.7,
      "comment_count": 28,
      "created_at": "2025-11-15T14:20:00Z"
    }
  ]
}
```

**Galimi Response Codes:**
- `200` - Success
- `404` - Section not found

---

#### 4.2.4. Postai

##### POST /api/posts/create/
**Aprašymas:** Sukurti naują postą

**Authorization:** Required (JWT)

**Request Body:**
```json
{
  "title": "Morning Yoga Routine",
  "description": "15-minute yoga routine perfect for mornings...",
  "type": "workout",
  "section_id": 3,
  "calories": 120,
  "recommendations": "Best performed on empty stomach",
  "is_public": true
}
```

**Response 201 Created:**
```json
{
  "id": 45,
  "title": "Morning Yoga Routine",
  "description": "15-minute yoga routine perfect for mornings...",
  "type": "workout",
  "section": {
    "id": 3,
    "name": "Flexibility"
  },
  "calories": 120,
  "recommendations": "Best performed on empty stomach",
  "is_public": true,
  "is_approved": false,
  "user": {
    "id": 5,
    "username": "yoga_master"
  },
  "created_at": "2025-11-23T09:15:00Z"
}
```

**Response 400 Bad Request:**
```json
{
  "title": ["This field is required."],
  "description": ["Ensure this field has at least 20 characters. (Current: 15)"]
}
```

**Galimi Response Codes:**
- `201` - Post sukurtas
- `400` - Validation errors
- `401` - Unauthorized

---

##### GET /api/posts/{id}/
**Aprašymas:** Gauti post'o detales

**Authorization:** Not required

**Response 200 OK:**
```json
{
  "id": 10,
  "title": "HIIT Cardio Workout",
  "description": "High intensity interval training...",
  "type": "workout",
  "section": {
    "id": 4,
    "name": "Cardio"
  },
  "user": {
    "id": 3,
    "username": "fitness_pro"
  },
  "author_username": "fitness_pro",
  "calories": 400,
  "recommendations": "Warm up for 5 minutes before starting",
  "is_public": true,
  "is_approved": true,
  "average_rating": 4.8,
  "comment_count": 35,
  "created_at": "2025-11-18T16:45:00Z",
  "updated_at": "2025-11-19T10:30:00Z"
}
```

**Galimi Response Codes:**
- `200` - Success
- `404` - Post not found

---

##### PATCH /api/posts/{id}/update/
**Aprašymas:** Redaguoti savo postą

**Authorization:** Required (JWT, post owner)

**Request Body:**
```json
{
  "title": "Updated HIIT Cardio Workout",
  "calories": 450
}
```

**Response 200 OK:**
```json
{
  "id": 10,
  "title": "Updated HIIT Cardio Workout",
  "calories": 450,
  "updated_at": "2025-11-23T14:20:00Z"
}
```

**Galimi Response Codes:**
- `200` - Post updated
- `400` - Validation errors
- `401` - Unauthorized
- `403` - Not post owner
- `404` - Post not found

---

##### DELETE /api/posts/{id}/delete/
**Aprašymas:** Ištrinti postą (savininkas arba admin)

**Authorization:** Required (JWT)

**Response 204 No Content:**
```
(empty body)
```

**Galimi Response Codes:**
- `204` - Post deleted
- `401` - Unauthorized
- `403` - Not authorized to delete
- `404` - Post not found

---

##### PUT /api/posts/{id}/approve/
**Aprašymas:** Patvirtinti postą (admin only)

**Authorization:** Required (JWT, admin)

**Response 200 OK:**
```json
{
  "id": 45,
  "title": "Morning Yoga Routine",
  "is_approved": true,
  "approved_at": "2025-11-23T15:00:00Z"
}
```

**Galimi Response Codes:**
- `200` - Post approved
- `401` - Unauthorized
- `403` - Not admin
- `404` - Post not found

---

#### 4.2.5. Komentarai

##### GET /api/posts/{post_id}/comments/
**Aprašymas:** Gauti post'o komentarus

**Authorization:** Not required

**Response 200 OK:**
```json
{
  "count": 12,
  "results": [
    {
      "id": 5,
      "text": "Great workout! Tried it this morning.",
      "user": {
        "id": 7,
        "username": "morning_person"
      },
      "author_username": "morning_person",
      "post": 10,
      "created_at": "2025-11-22T08:30:00Z"
    }
  ]
}
```

**Galimi Response Codes:**
- `200` - Success
- `404` - Post not found

---

##### POST /api/posts/{post_id}/comments/create/
**Aprašymas:** Pridėti komentarą

**Authorization:** Required (JWT)

**Request Body:**
```json
{
  "text": "This is exactly what I was looking for!"
}
```

**Response 201 Created:**
```json
{
  "id": 50,
  "text": "This is exactly what I was looking for!",
  "user": {
    "id": 5,
    "username": "demo_user"
  },
  "author_username": "demo_user",
  "post": 10,
  "created_at": "2025-11-23T16:45:00Z"
}
```

**Response 400 Bad Request:**
```json
{
  "text": ["This field is required."]
}
```

**Galimi Response Codes:**
- `201` - Comment created
- `400` - Validation errors
- `401` - Unauthorized
- `404` - Post not found

---

##### DELETE /api/comments/{id}/delete/
**Aprašymas:** Ištrinti komentarą (savininkas arba admin)

**Authorization:** Required (JWT)

**Response 204 No Content:**
```
(empty body)
```

**Galimi Response Codes:**
- `204` - Comment deleted
- `401` - Unauthorized
- `403` - Not authorized
- `404` - Comment not found

---

#### 4.2.6. Reitingai

##### GET /api/posts/{post_id}/ratings/
**Aprašymas:** Gauti post'o reitingus

**Authorization:** Not required

**Response 200 OK:**
```json
{
  "count": 23,
  "results": [
    {
      "id": 15,
      "rating": 5,
      "user": {
        "id": 8,
        "username": "satisfied_user"
      },
      "post": 10,
      "created_at": "2025-11-20T12:00:00Z"
    }
  ]
}
```

**Galimi Response Codes:**
- `200` - Success

---

##### POST /api/posts/{post_id}/ratings/create/
**Aprašymas:** Įvertinti postą (1-5 žvaigždutės)

**Authorization:** Required (JWT)

**Request Body:**
```json
{
  "rating": 5
}
```

**Response 201 Created:**
```json
{
  "id": 30,
  "rating": 5,
  "user": {
    "id": 5,
    "username": "demo_user"
  },
  "post": 10,
  "created_at": "2025-11-23T17:00:00Z"
}
```

**Response 400 Bad Request:**
```json
{
  "rating": ["Rating must be between 1 and 5"],
  "non_field_errors": ["You have already rated this post"]
}
```

**Galimi Response Codes:**
- `201` - Rating created
- `400` - Validation errors / Already rated
- `401` - Unauthorized
- `404` - Post not found

---

#### 4.2.7. Admin Endpoints

##### GET /api/admin/pending-users/
**Aprašymas:** Gauti nepatvirtintų vartotojų sąrašą

**Authorization:** Required (JWT, admin)

**Response 200 OK:**
```json
{
  "count": 3,
  "results": [
    {
      "id": 15,
      "username": "newuser",
      "email": "newuser@example.com",
      "date_joined": "2025-11-23T10:00:00Z",
      "is_active": false
    }
  ]
}
```

**Galimi Response Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Not admin

---

##### PUT /api/admin/users/{id}/approve/
**Aprašymas:** Patvirtinti vartotojo registraciją

**Authorization:** Required (JWT, admin)

**Response 200 OK:**
```json
{
  "id": 15,
  "username": "newuser",
  "is_active": true,
  "approved_at": "2025-11-23T18:00:00Z"
}
```

**Galimi Response Codes:**
- `200` - User approved
- `401` - Unauthorized
- `403` - Not admin
- `404` - User not found

---

##### GET /api/admin/pending-posts/
**Aprašymas:** Gauti nepatvirtintų postų sąrašą

**Authorization:** Required (JWT, admin)

**Response 200 OK:**
```json
{
  "count": 5,
  "results": [
    {
      "id": 45,
      "title": "Morning Yoga Routine",
      "type": "workout",
      "user": {
        "id": 5,
        "username": "yoga_master"
      },
      "author_username": "yoga_master",
      "section": {
        "id": 3,
        "name": "Flexibility"
      },
      "is_approved": false,
      "created_at": "2025-11-23T09:15:00Z"
    }
  ]
}
```

**Galimi Response Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Not admin

---

##### GET /api/admin/debug/all-posts/
**Aprašymas:** Debug endpoint - visi postai ir vartotojai su status info

**Authorization:** Required (JWT, admin)

**Response 200 OK:**
```json
{
  "posts": [
    {
      "id": 10,
      "title": "HIIT Cardio",
      "type": "workout",
      "is_public": true,
      "is_approved": true,
      "author": "fitness_pro",
      "author_id": 3,
      "created_at": "2025-11-18T16:45:00Z"
    }
  ],
  "users": [
    {
      "id": 5,
      "username": "demo_user",
      "email": "demo@example.com",
      "is_active": true,
      "is_staff": false,
      "post_count": 3
    }
  ],
  "summary": {
    "total_posts": 9,
    "public_approved": 6,
    "public_pending": 1,
    "private_approved": 2,
    "private_pending": 0
  }
}
```

**Galimi Response Codes:**
- `200` - Success
- `401` - Unauthorized
- `403` - Not admin

---

### 4.3. Error Response Format

Visos klaidos grąžinamos su JSON formatu:

```json
{
  "detail": "Authentication credentials were not provided.",
  "error": "authentication_required"
}
```

arba su field-specific errors:

```json
{
  "title": ["This field is required."],
  "description": ["Ensure this field has at least 20 characters."],
  "calories": ["A valid integer is required."]
}
```

---

## 5. PROJEKTO IŠVADOS

### 5.1. Įgyvendinti Tikslai

✅ **Sėkmingai realizuoti visi pagrindiniai funkciniai reikalavimai:**

1. **Autentifikacija ir Autorizacija**
   - JWT token sistema su auto-refresh mechanizmu
   - Role-based access control (User / Admin)
   - Secure password handling

2. **CRUD Operacijos**
   - Posts: Create, Read, Update, Delete
   - Comments: Create, Read, Delete (admin)
   - Ratings: Create, Read
   - Full validation su error handling

3. **Admin Funkcionalumas**
   - User approval sistema
   - Post moderation
   - Debug tools visai sistemai stebėti

4. **UI/UX Excellence**
   - Fully responsive design (mobile-first)
   - Smooth animations ir transitions
   - Consistent design system
   - Accessible ir intuitive interface

### 5.2. Techniniai Pasiekimai

✅ **Backend:**
- RESTful API su Django REST Framework
- Optimizuoti database queries
- Proper error handling ir validation
- Security best practices (CORS, JWT, HTTPS)

✅ **Frontend:**
- Modern React 19 su hooks
- Tailwind CSS responsive design
- Axios interceptors su auto-refresh
- Reusable komponentų biblioteka

✅ **DevOps:**
- CI/CD pipeline su GitHub Actions
- Automatic deployment į Azure
- Static files optimization
- Database migrations automation

### 5.3. Iššūkiai ir Sprendimai

| Iššūkis | Sprendimas |
|---------|-----------|
| **CSS neužsikrauna production** | Whitenoise konfigūracija + URL routing fix |
| **Static files MIME type errors** | Django URL pattern adjustment (`/assets/` exclusion) |
| **JWT token expiration** | Axios interceptor su automatic refresh |
| **Responsive images overflow** | max-width: 100%, responsive breakpoints |
| **Modal netelpa mobile** | Dynamic padding + max-height + scroll |
| **via.placeholder.com DNS errors** | CSS gradient placeholders |

### 5.4. Sistemos Privalumai

1. **Vartotojui:**
   - Intuityvus interface
   - Greitas loading (optimized bundles)
   - Veikia visose platformose (responsive)
   - Real-time feedback (validation, loading states)

2. **Administratoriui:**
   - Centralizuotas control panel
   - Debug tools detaliems diagnostika
   - Batch operations support
   - Clear moderation workflow

3. **Kūrėjui:**
   - Clean code structure
   - Modular architecture
   - Easy to extend
   - Well documented API

### 5.5. Tolimesni Patobulinimai (Future Work)

**Prioritetas: Aukštas**
- [ ] Email verification naujiem vartotojams
- [ ] Password reset funkcionalumas
- [ ] Image upload postams
- [ ] Search funkcionalumas postams

**Prioritetas: Vidutinis**
- [ ] User profile pictures
- [ ] Post categories/tags
- [ ] Social sharing buttons
- [ ] Favorite/Bookmark sistema

**Prioritetas: Žemas**
- [ ] Dark mode
- [ ] Multi-language support
- [ ] Export posts į PDF
- [ ] Mobile native app

### 5.6. Išmoktos Pamokos

1. **Architecture Planning:** Early planning saves time later
2. **Responsive Design:** Mobile-first approach is essential
3. **Error Handling:** Defensive programming prevents production issues
4. **Testing:** More tests = fewer bugs in production
5. **Documentation:** Good docs save hours of debugging

### 5.7. Projekto Metrika

| Metrika | Vertė |
|---------|-------|
| **Kodo eilutės** | ~5,000+ lines |
| **Komponentų** | 15+ React components |
| **API Endpoints** | 25+ endpoints |
| **Database Tables** | 5 core tables |
| **Deployment Time** | ~5 minutes (automated) |
| **Page Load Time** | <2 seconds |
| **Mobile Responsive** | 100% |
| **Test Coverage** | Backend models tested |

---

## 6. PRIEDAI

### 6.1. Nuorodos

- **Live Demo:** https://trainee-api.azurewebsites.net
- **GitHub Repository:** https://github.com/Ignasgin/Trainee
- **API Spec:** `api-spec.yaml`
- **Requirements Checklist:** `REQUIREMENTS_CHECKLIST.md`

### 6.2. Naudota Literatūra

1. Django Documentation - https://docs.djangoproject.com/
2. Django REST Framework - https://www.django-rest-framework.org/
3. React Documentation - https://react.dev/
4. Tailwind CSS - https://tailwindcss.com/
5. Azure App Service - https://azure.microsoft.com/

### 6.3. Projekto Komanda

- **Developer:** [Jūsų vardas]
- **Advisor:** [Vadovo vardas] (jei taikoma)
- **Institution:** [Universitetas/Kolegija]
- **Year:** 2025

---

**Pabaiga**

Trainee platforma sėkmingai realizuota kaip full-stack web aplikacija, atitinkanti visus techninius ir funkcinius reikalavimus. Sistema yra paruošta production naudojimui ir gali būti toliau plėtojama su papildomomis funkcijomis.

