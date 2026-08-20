# Bruiloftquiz 💛

Een live quiz voor op de bruiloft. Gasten doen mee vanaf hun eigen telefoon, de
quizmaster bedient de voortgang vanaf een eigen scherm. Alles synchroniseert
live via Supabase.

## Vragen toevoegen

De echte vragen staan nog niet in de app — vul ze in in **`lib/questions.ts`**.
Elke vraag heeft een tekst, 4 opties, het juiste antwoord, een tijdslimiet, en
optioneel een anekdote, foto (`imageUrl`, bestand in `public/questions/`) of
video (`videoUrl`, idem). Het bestand bevat nu 12 placeholder-vragen als
voorbeeld — pas ze aan of voeg er meer toe.

## Lokaal draaien

```bash
npm install
npm run dev
```

Open:
- `http://localhost:3000` — het join-scherm voor gasten
- `http://localhost:3000/host` — het quizmaster-paneel (PIN, zie `.env.local`)

## Hoe het werkt

- **Gasten** (`/`, `/play`) vullen hun naam in en zien live mee: wachtkamer →
  vraag → antwoord onthullen → (tussentijds) scoreboard → eindstand.
- **Quizmaster** (`/host`, achter een PIN) bedient alles handmatig: quiz
  starten, antwoord onthullen, volgende vraag, tussenstand tonen, eindstand
  tonen.
- Alle synchronisatie loopt via **Supabase Realtime** — zodra de quizmaster
  op een knop drukt, wisselen alle telefoons (getest tot ~75 gelijktijdig)
  automatisch mee van scherm.
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
