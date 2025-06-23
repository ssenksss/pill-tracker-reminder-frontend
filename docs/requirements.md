## 1 Funkcionalni zahtevi

- Registracija i login korisnika
- Dodavanje, izmena i brisanje lekova
- Podešavanje više termina i doza po leku
- Slanje dnevnih podsetnika
- Pregled logova uzimanja lekova
- Validacija unosa i prikaz grešaka u formama
- Responzivni prikaz i navigacija na svim uređajima

## 2 Veze sa okruženjem

- Frontend šalje HTTP zahteve ka backend REST API-ju
- Backend koristi MySQL bazu podataka
- JWT token se koristi za autentifikaciju i čuva se u LocalStorage
- REST API testiran pomoću Postman alata

## 3 Performanse

- Brzi odziv korisničkog interfejsa optimizovan za sve veličine ekrana
- API odziv manji od 300ms po zahtevu
- Minimalna potrošnja memorije i internet saobraćaja
- Interfejs funkcioniše u uslovima slabije mreže

## 4 Prilozi

- Snimci ekrana iz aplikacije: Dashboard, Add Pill, Alerts, History
- UML dijagrami:
    - Use Case dijagram – interakcije korisnika sa sistemom
    - Class dijagram – entiteti: korisnik, lek, log
    - Sequence dijagram – tok dodavanja leka i generisanja podsetnika
- Test izveštaji: manualna validacija funkcionalnosti (Postman/Thunder)
