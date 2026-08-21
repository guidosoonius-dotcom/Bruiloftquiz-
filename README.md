# Bruiloftquiz 💛

Een live quiz voor op de bruiloft. Gasten doen mee vanaf hun eigen telefoon, de
quizmaster bedient de voortgang vanaf een eigen scherm. Alles synchroniseert
live via Supabase.

## Vragen toevoegen

De vragen staan in **`lib/questions.ts`** (16 stuks). Elke vraag heeft een
tekst, 4 opties, het juiste antwoord, een tijdslimiet, en optioneel een
anekdote, foto (`imageUrl`, bestand in `public/questions/`) of video
(`videoUrl`, idem).

Zet `videoIntro: true` naast `videoUrl` als de video eerst apart getoond moet
worden, vóórdat de vraag zelf verschijnt (zoals bij vraag 14): de quizmaster
speelt de video af op alle telefoons, en drukt daarna op "▶ Start vraag" om
pas dan de opties en de timer te tonen.

## Lokaal draaien

```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000` — het join-scherm voor gasten
- `http://localhost:3000/host` — het quizmaster-paneel (PIN, zie `.env.local`)
- `http://localhost:3000/screen` — het beamerscherm voor in de zaal

## Hoe het werkt

- **Gasten** (`/`, `/play`) vullen hun naam in, geven hun antwoord op hun
  eigen telefoon en zien live mee: wachtkamer → vraag → antwoord onthullen →
  (tussentijds) scoreboard → eindstand.
- **Quizmaster** (`/host`, achter een PIN) bedient alles handmatig: quiz
  starten, antwoord onthullen, volgende vraag, tussenstand tonen, eindstand
  tonen.
- **Beamerscherm** (`/screen`, geen PIN nodig — puur weergave) volgt dezelfde
  quiz automatisch mee, maar dan groot: meer ruimte voor de vraagtekst,
  foto's en video's, plus een live teller van hoeveel mensen al geantwoord
  hebben en (bij onthullen) hoeveel stemmen elk antwoord kreeg. Open deze op
  het apparaat dat op de beamer is aangesloten — gasten blijven gewoon op
  hun eigen telefoon antwoorden.
- Alle synchronisatie loopt via **Supabase Realtime** — zodra de quizmaster
  op een knop drukt, wisselen alle telefoons én het beamerscherm (getest tot
  ~75 gelijktijdige telefoons) automatisch mee van scherm.
- Score = snelheid + juist antwoord (zie `lib/scoring.ts`).

## Configuratie

Env vars staan in `.env.local` (niet in git):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_HOST_PIN=1234
```

Verander `NEXT_PUBLIC_HOST_PIN` voor de bruiloft naar iets dat alleen jij weet.

## Quiz resetten

Op `/host` staat onderaan een link "Terug naar wachtkamer" — dat zet de quiz
terug naar de start zonder scores te wissen. Wil je ook alle spelers/scores
wissen (bv. na een testrun), doe dat via de Supabase-tabellen `players` en
`answers`.

## Deployen

Deploy naar [Vercel](https://vercel.com/new) (of vergelijkbaar) en zet
dezelfde env vars daar neer. Gasten scannen dan een QR-code naar de live URL
op de dag zelf.
