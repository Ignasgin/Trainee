# Azure App Service Deployment Guide

## 📋 Prieš pradedant

Jūsų MySQL database jau Azure! Dabar pa-host'insime Django aplikaciją.

---

## 🚀 Deployment per Azure Portal (Web UI)

### **1. Sukurti Azure App Service**

1. **Eikite į Azure Portal**: https://portal.azure.com
2. **Create a resource** → **Web App**
3. **Užpildykite:**
   - **Subscription**: Jūsų subscription
   - **Resource Group**: (sukurkite naują arba naudokite esamą su DB)
   - **Name**: `trainee-api` (bus: trainee-api.azurewebsites.net)
   - **Publish**: `Code`
   - **Runtime stack**: `Python 3.11` arba `Python 3.12`
   - **Operating System**: `Linux`
   - **Region**: `North Europe` (arba tas pats kur DB)
   - **Pricing plan**: `B1` (Basic) arba `F1` (Free - studentams)

4. **Review + Create** → **Create**

---

### **2. Konfigūruoti Application Settings (Environment Variables)**

1. **App Service** → **Configuration** → **Application settings**
2. **Pridėkite šiuos kintamuosius** (vienas po kito):

| Name | Value |
|------|-------|
| `SECRET_KEY` | `jūsų-slaptas-raktas` (sugeneruokite naują!) |
| `DEBUG` | `False` |
| `ALLOWED_HOSTS` | `trainee-api.azurewebsites.net,*.azurewebsites.net` |
| `DB_NAME` | `trainee_db` |
| `DB_USER` | `trainee_admin` |
| `DB_PASSWORD` | `jūsų-db-slaptažodis` |
| `DB_HOST` | `trainee-db-server.mysql.database.azure.com` |
| `DB_PORT` | `3306` |
| `DJANGO_SETTINGS_MODULE` | `Trainee.settings_production` |
| `SCM_DO_BUILD_DURING_DEPLOYMENT` | `true` |
| `WEBSITE_HTTPLOGGING_RETENTION_DAYS` | `7` |

3. **Save** → **Continue**

---

### **3. Deploy per GitHub** (Rekomenduojama)

#### Option A: GitHub Actions (Automatinis)

1. **App Service** → **Deployment Center**
2. **Source**: Pasirinkite `GitHub`
3. **Authorize** GitHub (jei reikia)
4. **Organization**: `Ignasgin`
5. **Repository**: `Trainee`
6. **Branch**: `main`
7. **Save**

**Azure automatiškai:**
- Sukurs `.github/workflows/main_trainee-api.yml`
- Paleist deployment po kiekvieno commit į `main`
- Build'ins, deploy'ins, paleist migracija

#### Option B: Local Git Deploy

1. **App Service** → **Deployment Center**
2. **Source**: `Local Git`
3. **Save**
4. **Nukopijuokite Git URL**: `https://trainee-api.scm.azurewebsites.net:443/trainee-api.git`

Lokaliai:
```bash
cd c:\Users\as\Desktop\Trainee
git remote add azure https://trainee-api.scm.azurewebsites.net:443/trainee-api.git
git push azure main
```

#### Option C: ZIP Deploy (Greičiausias testuoti)

```bash
# 1. Suspausti projektą
Compress-Archive -Path * -DestinationPath trainee-api.zip

# 2. Upload per Azure CLI
az webapp deployment source config-zip --resource-group <resource-group> --name trainee-api --src trainee-api.zip
```

---

### **4. Įjungti MySQL firewall rule**

Jūsų Azure MySQL turi leisti prisijungti iš App Service!

1. **Azure Portal** → **Azure Database for MySQL**
2. **Connection security** → **Firewall rules**
3. **Add client IP**: arba
4. ✅ **Allow access to Azure services**: `ON`
5. **Save**

---

### **5. Startup Command**

**App Service** → **Configuration** → **General settings**

**Startup Command**:
```bash
gunicorn --bind=0.0.0.0:8000 --config gunicorn_config.py Trainee.wsgi
```

**Save**

---

### **6. Test Deployment**

1. **App Service** → **Overview**
2. **Copy URL**: `https://trainee-api.azurewebsites.net`
3. **Testuokite**:
   - `GET https://trainee-api.azurewebsites.net/api/sections/` ← Public
   - `POST https://trainee-api.azurewebsites.net/api/auth/login/` ← JWT login

---

## 🔍 Debugging

### Žiūrėti Logs:

**App Service** → **Log stream** arba:

```bash
az webapp log tail --name trainee-api --resource-group <resource-group>
```

### Dažnos problemos:

1. **500 Error**:
   - Patikrinkite `DEBUG=False`
   - Patikrinkite DB credentials
   - Žiūrėkite logs: `Application logs`

2. **Static files neveikia**:
   ```bash
   python manage.py collectstatic --noinput
   ```

3. **Database connection failed**:
   - Patikrinkite MySQL firewall rules
   - Patikrinkite `DB_HOST`, `DB_USER`, `DB_PASSWORD`
   - SSL certificate (`BaltimoreCyberTrustRoot.crt.pem`) yra projekte

---

## ✅ Production Checklist

- [ ] `DEBUG=False`
- [ ] Naujas `SECRET_KEY`
- [ ] `ALLOWED_HOSTS` nustatytas
- [ ] Database credentials teisingi
- [ ] MySQL firewall leidžia Azure services
- [ ] Static files collected (`collectstatic`)
- [ ] Migrations paleistos (`migrate`)
- [ ] SSL enabled (automatiškai Azure)
- [ ] HTTPS redirect enabled

---

## 📊 Costs (kainos)

| Tier | Kaina/mėn | Savybės |
|------|-----------|---------|
| **F1 Free** | €0 | 60min/day, 1GB RAM (studentams) |
| **B1 Basic** | ~€8-12 | Always-on, 1.75GB RAM |
| **S1 Standard** | ~€50 | Auto-scale, 1.75GB RAM |

MySQL jau turite, tad App Service F1/B1 pakanka!

---

## 🎯 Post-Deployment

### Atnaujinti Postman:

1. **base_url**: `https://trainee-api.azurewebsites.net`
2. **Auth endpoint**: `/api/auth/login/`
3. **Test!**

### Custom Domain (optional):

**App Service** → **Custom domains** → Add `www.jūsų-domenas.lt`

---

## 📞 Pagalba

Jei klausimai:
1. Azure logs: `App Service → Log stream`
2. Django errors: `az webapp log tail`
3. Database: Patikrinkite connection string

**Sėkmės gynime! 🎓**
