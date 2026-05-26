# CCTV Verify — PWA v1.0

Forensisk tidstämpling för CCTV-dokumentation.

## Vad är nytt jämfört med CCTV-Time Catch

- **Endast två lägen:** Standard och Full forensik (Minimal borttaget)
- **Standard-läget är rensare:** "VERKLIG TID" + datum, ingen offset, ingen tidszon
- **CCTV-tid utan "(manuell)"-suffix** i Standard
- **Bättre manuell inmatning:** tryck i ett fält → all text markeras → skriv över direkt
- **Kraftigt förbättrad OCR:**
  - ROI-detektion: hittar automatiskt ljusa rektangulära områden (CCTV-displayer)
  - Multi-pass: testar 5 regioner × 2 bildvarianter × 4 OCR-lägen tills någon matchar
  - Otsu thresholding för optimal binarisering
  - 3x uppskalning för bättre läsbarhet av små siffror
- **Gratis, offline, ingen API-nyckel** — fungerar för alla som öppnar appen

## Förväntad träffsäkerhet på OCR

Var realistisk: Tesseract är gjord för tryckt text, inte CCTV-displayer. Träffsäkerhet beror starkt på bildkvalitet:

- Tydlig digital klocka, bra ljus, rakt framifrån: 70-85%
- Typisk CCTV (LCD, vinkel, normalt ljus): 40-60%
- Dålig kontrast eller suddig bild: 20-30%

Kontrollera alltid siffrorna innan du trycker "Räkna ut differens".

## Snabbstart — testa direkt på iPhone

1. Gå till **https://app.netlify.com/drop**
2. Dra och släpp **hela mappen** `cctv-verify/` på sidan
3. Öppna URL:en i **Safari** på iPhonen
4. Tryck **Starta kamera** → tillåt åtkomst

## Installera som hemskärms-app

I Safari: **Dela-ikonen** → **"Lägg till på hemskärmen"** → **Lägg till**

## Filstruktur

```
cctv-verify/
├── index.html              # Huvudappen
├── manifest.webmanifest    # PWA-manifest
├── sw.js                   # Service worker
├── icons/
│   ├── apple-touch-icon.png
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── maskable-192.png
│   └── maskable-512.png
└── README.md
```

## Funktioner

- Live kamerasökare med tids-overlay (uppdateras 20 ggr/sek)
- Tidsynk mot 3 oberoende källor med medianvärde
- Auto-resynk var 5:e minut och vid återkomst från bakgrund
- Tap-to-focus och pinch-to-zoom
- Förbättrad Tesseract-OCR med ROI-detektion
- Manuell inmatning med smart fältredigering
- Inbränd CCTV-jämförelse direkt i bilden
- Offline-stöd för app-skalet
