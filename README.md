# Trainee
Projekto tikslas – pagerinti vartotojų gyvenimo įpročius, suteikiant galimybę kurti, dalintis ir naudotis mitybos bei sporto planais. Sistema padeda vartotojams susidaryti asmeninius algoritmus (pvz., dienos mitybos planą ar treniruočių seką), stebėti su tuo susijusią informaciją (kalorijų skaičiavimą, rekomendacijas), bendrauti su kitais bendruomenės nariais bei įsitraukti į sveikos gyvensenos veiklas.
Veikimo principas – kuriama platforma susideda iš internetinės aplikacijos (naudojamos vartotojų ir administratorių) bei aplikacijų programavimo sąsajos (API). Registruoti vartotojai gali kurti savo planus, skelbti juos viešai, komentuoti bei reitinguoti kitų įkeltą turinį. Administratorius prižiūri visą platformos turinį, tvirtina ar šalina netinkamus planus bei postus.

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

Sistemos sudedamosios dalys:
•	Kliento pusė (Front-End) – React.js technologija;
•	Serverio pusė (Back-End) – Python (Django). Autentifikacijai naudojamas JWT (JSON Web Tokens);
•	Duomenų bazė – MySQL;
•	Cloud aplinka – DigitalOcean serveris, kuriame talpinamos visos sistemos dalys.
Platforma pasiekiama per HTTPS protokolą. Vartotojų sąveika vyksta per internetinę aplikaciją, kuri jungiasi prie API. API atlieka duomenų mainus su duomenų baze bei vykdo autentifikacijos procesus (naudojant JWT).

