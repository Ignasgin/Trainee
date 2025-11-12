# 🔧 Azure App Service Konfigūracija

## ✅ ŽINGSnis PO ŽINGSNIO

### 1️⃣ Atidaryti Azure Portal
1. Eiti į: https://portal.azure.com
2. Prisijungti su savo Microsoft paskyra

### 2️⃣ Rasti savo App Service
1. Ieškos juostoje viršuje įrašyti: **trainee-api**
2. Pasirinkti **trainee-api** (App Service)

### 3️⃣ Atidaryti Configuration
1. Kairėje meniu rasti **Settings** sekciją
2. Paspausti **Configuration**
3. Pateksite į "Application settings" puslapį

### 4️⃣ Pridėti Environment Variables

Dabar reikia pridėti **7 naujus settings**. Kiekvienam:
1. Spausti mygtuką **+ New application setting** (viršuje)
2. Įvesti **Name** ir **Value** (žiūrėti žemiau)
3. Spausti **OK**

---

## 📝 SETTINGS, KURIUOS REIKIA PRIDĖTI:

### Setting #1: SECRET_KEY
```
Name:  SECRET_KEY
Value: django-insecure-rho1t()l=4_sgyww6is7=19(p8x#&xri%o(p$--tdxbwps^m!g
```

### Setting #2: DEBUG
```
Name:  DEBUG
Value: False
```

### Setting #3: ALLOWED_HOSTS
```
Name:  ALLOWED_HOSTS
Value: trainee-api.azurewebsites.net,.azurewebsites.net
```

### Setting #4: DB_NAME
```
Name:  DB_NAME
Value: sql7802231
```

### Setting #5: DB_USER
```
Name:  DB_USER
Value: sql7802230
```

### Setting #6: DB_PASSWORD
```
Name:  DB_PASSWORD
Value: Mypassword1
```

### Setting #7: DB_HOST
```
Name:  DB_HOST
Value: sql7802231.mysql.database.azure.com
```

---

### 5️⃣ Išsaugoti pakeitimus
1. Po to, kai pridėsite visus 7 settings, **BŪTINAI** spauskite mygtuką **Save** viršuje
2. Azure paklaus ar tikrai norite išsaugoti - spauskite **Continue**
3. App Service automatiškai **perkraus** (restart) - tai užtruks ~30-60 sekundžių

---

### 6️⃣ Patikrinti ar veikia

Palaukite 1-2 minutes po restart, tada:

1. **Variantas A:** Paleiskite testą:
   ```powershell
   python check_azure_health.py
   ```

2. **Variantas B:** Tiesiog atidarykite naršyklėje:
   ```
   https://trainee-api.azurewebsites.net/api/sections/
   ```
   
   Jei matote JSON su sekcijomis - **VEIKIA! ✅**
   Jei matote "Server Error (500)" - dar neveikia ❌

---

## 🔍 Jei vis dar neveikia

### Patikrinti MySQL Firewall

1. Azure Portal → ieškoti **sql7802231** (jūsų MySQL serveris)
2. **Networking** → **Firewall rules**
3. Įjungti: **Allow public access from any Azure service within Azure to this server** = **YES** ✅
4. Spausti **Save**

### Patikrinti Logs

1. Azure Portal → **trainee-api** (App Service)
2. **Monitoring** → **Log stream**
3. Matysite realiu laiku, kas vyksta serveryje
4. Ieškokite eilučių su "ERROR" arba "Exception"

---

## 📊 Ko tikėtis po taisymo

**Prieš:**
```
❌ GET /api/sections/ → 500 Server Error
❌ GET /api/posts/ → 500 Server Error  
❌ POST /api/token/ → 404 Not Found
```

**Po taisymo:**
```
✅ GET /api/sections/ → 200 OK (JSON su sekcijomis)
✅ GET /api/posts/ → 200 OK (JSON su posts)
✅ POST /api/token/ → 200 OK (JWT login veikia)
```

---

## ⚠️ SVARBU

- **NIEKADA** nedarykite `git push` su šiais environment variables settings.py faile!
- Azure naudoja environment variables iš **Configuration** puslapio
- Local development naudoja default values iš `settings.py`
- Šitie settings NIEKADA nebus matomi GitHub'e (saugūs slaptažodžiai)

---

## 📞 Troubleshooting

### "Setting not saved"
- Patikrinkite ar paspaudėte **Save** viršuje
- Patikrinkite ar nėra typo errors (Name turi būti TIKSLIAI kaip parašyta)

### "Still getting 500 errors"
- Palaukite 2-3 minutes po restart
- Patikrinkite MySQL firewall rules
- Pažiūrėkite Log stream real-time errors

### "404 on /api/token/"
- Tai reiškia URL routing problema
- Patikrinkite ar code deployed per GitHub Actions
- Pažiūrėkite Azure → Deployment Center → Logs

---

**Sekantis žingsnis:** Kai pridėsite visus settings ir išsaugosite, parašykite man - patikrinsime ar veikia! 🚀
