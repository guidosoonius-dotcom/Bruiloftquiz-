# Bruiloftquiz 💛

Een live quiz voor op de bruiloft. Gasten doen mee vanaf hun eigen telefoon, de
quizmaster bedient de voortgang vanaf een eigen scherm. Alles synchroniseert
live via Supabase.

## Vragen toevoegen

De vragen staan in **`lib/questions.ts`** (16 stuks). Er zijn twee vraagtypes:

- `type: "multiple_choice"` — tekst, 4 opties, het juiste antwoord, een
  tijdslimiet, en optioneel een anekdote, foto (`imageUrl`, bestand in
  `public/questions/`) of video (`videoUrl`, idem).
- `type: "photo_pick"` — een grid van `tiles` (elk optioneel een `imageUrl`;
  zonder foto tonen we een placeholder-tegel) waarvan de speler er precies 2
  moet aantikken; `correctIndexes` wijst de 2 juiste tegels aan.

Zet `videoIntro: true` naast `videoUrl` (alleen bij `multiple_choice`) als de
video eerst apart getoond moet worden, vóórdat de vraag zelf verschijnt
(zoals bij de voetbalvraag): de quizmaster speelt de video af op alle
telefoons, en drukt daarna op "▶ Start vraag" om pas dan de opties en de
timer te tonen.

Let op: het veld `id` van elke vraag is de sleutel waarmee antwoorden in
Supabase worden opgeslagen (`question_index`). Zolang je bestaande vragen
niet hernummert kun je gerust nieuwe toevoegen — de volgorde/uitsluiting
regel je toch al los via het quizmaster-paneel (zie hieronder). Verander je
wél een bestaand `id`, reset dan de testdata (zie "Quiz resetten"), anders
horen oude antwoorden bij de verkeerde vraag.

### Volgorde aanpassen of vragen uitsluiten

Op `/host` staat, zolang de quiz nog in de wachtkamer staat, een sectie
"Vragen beheren": met ▲/▼ verschuif je een vraag, met de Aan/Uit-knop sluit
je 'm uit voor deze speelronde (zonder 'm uit de code te hoeven halen). Dit
schrijft naar de `quiz_config`-tabel in Supabase en geldt meteen voor
gasten en het beamerscherm. Er moet altijd minstens 1 vraag actief blijven.
Wijzig de volgorde niet meer zodra de quiz gestart is — bestaande antwoorden
blijven gekoppeld aan de positie waarop ze gegeven zijn.

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
  starten, antwoord onthullen, volgende (of vorige) vraag, tussenstand
  tonen, eindstand tonen.
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
