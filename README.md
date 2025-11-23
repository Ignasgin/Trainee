# 🏋️ Trainee - Nutrition & Workout Platform

[![Azure](https://img.shields.io/badge/Deployed%20on-Azure-0089D6?logo=microsoft-azure)](https://trainee-api.azurewebsites.net)
[![React](https://img.shields.io/badge/React-19.2.0-61DAFB?logo=react)](https://react.dev)
[![Django](https://img.shields.io/badge/Django-5.2.7-092E20?logo=django)](https://www.djangoproject.com)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.17-06B6D4?logo=tailwind-css)](https://tailwindcss.com)

**Live App:** [trainee-api.azurewebsites.net](https://trainee-api.azurewebsites.net)

## 📋 Projekto aprašymas

Projekto tikslas – pagerinti vartotojų gyvenimo įpročius, suteikiant galimybę kurti, dalintis ir naudotis mitybos bei sporto planais. Sistema padeda vartotojams susidaryti asmeninius algoritmus (pvz., dienos mitybos planą ar treniruočių seką), stebėti su tuo susijusią informaciją (kalorijų skaičiavimą, rekomendacijas), bendrauti su kitais bendruomenės nariais bei įsitraukti į sveikos gyvensenos veiklas.

### Veikimo principas

Kuriama platforma susideda iš internetinės aplikacijos (naudojamos vartotojų ir administratorių) bei aplikacijų programavimo sąsajos (API). Registruoti vartotojai gali kurti savo planus, skelbti juos viešai, komentuoti bei reitinguoti kitų įkeltą turinį. Administratorius prižiūri visą platformos turinį, tvirtina ar šalina netinkamus planus bei postus.

Neregistruotas sistemos naudotojas (svečias) galės:
1.	Peržiūrėti viešus postus ir komentarus;
2.	Peržiūrėti platformos reprezentacinį puslapį;
3.	Prisijungti prie internetinės aplikacijos.

Registruotas sistemos naudotojas galės:
1.	Atsijungti nuo internetinės aplikacijos;
2.	Prisijungti (užsiregistruoti) prie platformos;
3.	Susikurti postą (algoritmą / planą):
3.1. Įkelti mitybos planą arba treniruočių seką;
3.2. Pridėti papildomą informaciją (kalorijų skaičiavimas, rekomendacijos);
3.3. Redaguoti savo sukurtą postą;
4.	Skelbti savo postą viešai;
5.	Komentuoti kitų vartotojų postus;
6.	Reitinguoti kitų vartotojų planus;
7.	Peržiūrėti kitų naudotojų profilio informaciją.

Administratorius galės:
1.	Patvirtinti naujų naudotojų registracijas;
2.	Patvirtinti norimus skelbti viešai postus;
3.	Šalinti netinkamus postus ar komentarus;
4.	Pašalinti naudotojus, pažeidžiančius taisykles.

## 🛠️ Technologijos

### Frontend
- **Framework:** React 19.2.0 + Vite 7.2.2
- **Styling:** Tailwind CSS 4.1.17
- **Routing:** React Router DOM 7.9.6
- **HTTP Client:** Axios 1.13.2
- **Icons:** React Icons 5.4.0
- **Fonts:** Google Fonts (Inter)

### Backend
- **Framework:** Django 5.2.7
- **REST API:** Django REST Framework 3.16.1
- **Authentication:** Simple JWT 5.5.1 (access + refresh tokens)
- **CORS:** django-cors-headers 4.6.0
- **Database:** Azure MySQL Flexible Server
- **Database Driver:** mysql-connector-python 9.1.0

### Deployment
- **Platform:** Azure App Service
- **Domain:** trainee-api.azurewebsites.net
- **Protocol:** HTTPS
- **Architecture:** Single-domain - Django serves React build from `/frontend/dist/`
- **CI/CD:** GitHub Actions auto-deploy on push to main

## ✨ Funkcionalumas

### Neregistruotas naudotojas (Svečias)
- ✅ Peržiūrėti viešus postus ir komentarus
- ✅ Peržiūrėti platformos reprezentacinį puslapį
- ✅ Prisijungti prie internetinės aplikacijos

### Registruotas naudotojas
- ✅ Atsijungti nuo internetinės aplikacijos
- ✅ Prisijungti (užsiregistruoti) prie platformos
- ✅ Susikurti postą (mitybos planą arba treniruočių seką)
  - Pridėti papildomą informaciją (kalorijų skaičiavimas, rekomendacijos)
  - Redaguoti savo sukurtą postą
- ✅ Skelbti savo postą viešai (laukia admin patvirtinimo)
- ✅ Komentuoti kitų vartotojų postus
- ✅ Reitinguoti kitų vartotojų planus (1-5 žvaigždutės)
- ✅ Peržiūrėti savo profilio informaciją ir postus

### Administratorius
- ✅ Patvirtinti naujų naudotojų registracijas
- ✅ Patvirtinti norimus skelbti viešai postus
- ✅ Šalinti netinkamus postus ar komentarus
- ✅ Pašalinti naudotojus, pažeidžiančius taisykles

## 🎨 UI/UX Features

- ✅ **Responsive Design** - Pilnai pritaikyta mobiliems įrenginiams (<768px breakpoint)
- ✅ **Hamburger Menu** - Mobile slide-in navigation su animacijomis
- ✅ **Vector Icons** - React Icons visoje aplikacijoje (Hero Icons, Game Icons)
- ✅ **Animations** - Fade-in, scale-in, hover effects su Tailwind custom keyframes
- ✅ **Modal Components** - Reusable modal sistema su backdrop blur
- ✅ **Responsive Images** - max-width: 100%, height: auto behavior
- ✅ **Form Validation** - Real-time validation UI su ikonais
- ✅ **Loading States** - Spinner animacijos su ikonais
- ✅ **Gradient Themes** - Primary (green) → Secondary (blue) gradients
- ✅ **Consistent Spacing** - Grid alignment su gap-4, gap-6
- ✅ **Google Fonts** - Inter font family (300-900 weights)

### UI Wireframes

#### Desktop Layout (>768px)
```
┌─────────────────────────────────────────────────────────┐
│ Header (gradient green→blue)                            │
│ Logo | Home | Profile | Admin | Logout                  │
└─────────────────────────────────────────────────────────┘
│                                                           │
│  Content Area (white background)                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐                   │
│  │ Card 1  │ │ Card 2  │ │ Card 3  │  (3-column grid)  │
│  │ Icon    │ │ Icon    │ │ Icon    │                   │
│  └─────────┘ └─────────┘ └─────────┘                   │
│                                                           │
└─────────────────────────────────────────────────────────┘
│ Footer (dark gray gradient)                              │
│ Made with ❤️ | © 2025 | About | Contact | Privacy       │
└─────────────────────────────────────────────────────────┘
```

#### Mobile Layout (<768px)
```
┌──────────────────┐
│ Header           │
│ Logo    [☰]     │
└──────────────────┘
│ Content          │
│ ┌──────────────┐ │
│ │ Card 1       │ │
│ │ Full width   │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ Card 2       │ │
│ └──────────────┘ │
└──────────────────┘
│ Footer           │
└──────────────────┘

[☰] → Slide-in Menu
┌──────────────┐
│ [X]          │
│ Home         │
│ Profile      │
│ Logout       │
└──────────────┘
```

### UI Elements Breakdown

| Area | Desktop | Mobile | Elements |
|------|---------|--------|----------|
| **Header** | Horizontal nav | Hamburger menu | Logo, nav links, gradient background |
| **Content** | 3-column grid | 1-column stack | Cards with icons, hover effects |
| **Footer** | 3-section layout | Stacked | Social links, copyright, animated heart |
| **Forms** | Side-by-side | Stacked | Text inputs, textareas, selects, checkboxes |
| **Modals** | Centered overlay | Full-width padding | Backdrop blur, close button, responsive images |

## 🚀 Setup Instructions

### Prerequisites
- Node.js 20.19+ or 22.12+
- Python 3.13+
- MySQL Database

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Development server
npm run build  # Production build
```

### Backend Setup
```bash
pip install -r requirements.txt

# Configure database in Trainee/settings.py
# Set environment variables for production:
# - SECRET_KEY
# - ALLOWED_HOSTS
# - DB credentials

python manage.py migrate
python manage.py createsuperuser  # Create admin user
python manage.py runserver
```

### Deploy to Azure
1. Push to GitHub main branch
2. Azure App Service auto-deploys via GitHub Actions
3. Django serves React build from `frontend/dist/`

## 📁 Project Structure

```
Trainee/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Header, Footer, Modal
│   │   ├── context/         # AuthContext
│   │   ├── pages/           # All page components
│   │   ├── services/        # API client (axios + JWT interceptors)
│   │   ├── App.jsx          # Main app with routes
│   │   └── index.css        # Tailwind + custom CSS
│   ├── dist/                # Production build (served by Django)
│   └── tailwind.config.js   # Custom colors & animations
├── core/                     # Django app
│   ├── models.py            # User, Section, Post, Comment, Rating
│   ├── serializers.py       # DRF serializers
│   ├── views.py             # API endpoints
│   └── urls.py              # API routing
├── Trainee/                  # Django project
│   ├── settings.py          # Configuration
│   └── urls.py              # Root URL config (API + React routing)
├── manage.py
└── requirements.txt
```

## 🔐 Authentication

- **JWT Tokens:** Access (1h) + Refresh (1d)
- **Auto-refresh:** Axios interceptor handles 401 errors
- **Storage:** sessionStorage (both tokens)
- **Endpoints:**
  - `POST /api/auth/login/` - Login
  - `POST /api/auth/refresh/` - Refresh access token
  - `POST /api/users/register/` - Register (awaits admin approval)

## 📝 API Endpoints

### Public
- `GET /api/sections/` - List all sections
- `GET /api/sections/{id}/posts/` - Posts in section

### Authenticated
- `POST /api/posts/create/` - Create post
- `GET /api/posts/{id}/` - Post detail
- `POST /api/posts/{id}/comments/create/` - Add comment
- `POST /api/posts/{id}/ratings/create/` - Add rating

### Admin Only
- `GET /api/admin/pending-users/` - Pending user registrations
- `PUT /api/admin/users/{id}/approve/` - Approve user
- `GET /api/admin/pending-posts/` - Pending posts
- `PUT /api/posts/{id}/approve/` - Approve post

## 🎯 Development Notes

- **Node.js Version:** Using 21.7.1 (Vite recommends 20.19+/22.12+, works with warning)
- **CORS:** Configured for same-domain deployment
- **Static Files:** Separate URL pattern for `/assets/` to avoid MIME type issues
- **Pagination:** API returns paginated responses, frontend handles both formats
- **Error Handling:** Console logging + user-friendly error messages

## 📞 Contact

**Author:** Trainee Team  
**GitHub:** [Ignasgin/Trainee](https://github.com/Ignasgin/Trainee)  
**Live Demo:** [trainee-api.azurewebsites.net](https://trainee-api.azurewebsites.net)

