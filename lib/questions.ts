import { Question } from "./types";

export const questions: Question[] = [
  {
    id: 0,
    type: "multiple_choice",
    question:
      "Welk huisdier had Erik vroeger, dat hij op een gegeven moment verkocht op de rommelmarkt?",
    options: ["Cavia's", "Wandelende takken", "Een schildpad", "Goudvissen"],
    correctIndex: 1,
    timeLimitSeconds: 20,
  },
  {
    id: 1,
    type: "multiple_choice",
    question: "Welke bijnaam kregen Eriks benen in de sportschool?",
    options: ["Luciferstokjes", "Kebabstaven", "Boomstammen", "Rietjes"],
    correctIndex: 1,
    imageUrl: "/questions/vraag-8.jpg",
    timeLimitSeconds: 20,
  },
  {
    id: 2,
    type: "multiple_choice",
    question:
      "Marly is dol op maisvingers eten. Wat hebben Marly en Cas gemeen als het op lekkers aankomt?",
    options: [
      "Ze bakken het liever zelf",
      "Ze graaien er allebei gulzig naar",
      "Ze delen het altijd eerlijk",
      "Ze eten het nooit op feestjes",
    ],
    correctIndex: 1,
    timeLimitSeconds: 20,
  },
  {
    id: 3,
    type: "multiple_choice",
    question:
      "Waar is Erik na het uitgaan wel eens slapend aangetroffen? (Hij is bekend als 'makkelijke slaper')",
    options: ["Op de bank", "In de tuin", "Op de badkamervloer", "In de auto"],
    correctIndex: 2,
    timeLimitSeconds: 20,
  },
  {
    id: 4,
    type: "multiple_choice",
    question: "In welke plaats woonden Cas en Erik voor het eerst samen?",
    options: ["Lekkerkerk", "Ouderkerk", "Stolwijk", "Krimpen aan de IJssel"],
    correctIndex: 1,
    timeLimitSeconds: 20,
  },
  {
    id: 5,
    type: "multiple_choice",
    question: "Hoe/waar vroeg Erik Cas ten huwelijk?",
    options: [
      "In een bootje bij Kreta",
      "In een bootje bij Corfu",
      "In een bootje bij Santorini",
      "In een bootje bij Rhodos",
    ],
    correctIndex: 1,
    timeLimitSeconds: 20,
  },
  {
    id: 6,
    type: "multiple_choice",
    question: "Waarmee bouwde Erik als kind het allerliefst?",
    options: [
      "Alleen met Lego",
      "Met K'nex, Duplo en zelfgebouwde hutten",
      "Met Meccano en houten blokken",
      "Alleen met kartonnen dozen",
    ],
    correctIndex: 1,
    timeLimitSeconds: 20,
  },
  {
    id: 7,
    type: "multiple_choice",
    question: "Wat verzamelde Erik vroeger fanatiek?",
    options: ["Voetbalplaatjes", "Pokémonkaarten", "Stripboeken", "Postzegels"],
    correctIndex: 1,
    timeLimitSeconds: 20,
  },
  {
    id: 8,
    type: "multiple_choice",
    question: "Wat was het favoriete vak van Erik op school?",
    options: ["Wiskunde", "Geschiedenis", "Aardrijkskunde", "Gym"],
    correctIndex: 2,
    timeLimitSeconds: 20,
  },
  {
    id: 9,
    type: "multiple_choice",
    question:
      "Cas en Erik waren allebei op dezelfde plek voordat ze elkaar kenden. Waar?",
    options: [
      "Op een festival in Nederland",
      "Op vakantie in Sri Lanka",
      "Op een camping in Spanje, Platja d'Aro",
      "Op een cruise in de Middellandse Zee",
    ],
    correctIndex: 2,
    timeLimitSeconds: 20,
  },
  {
    id: 10,
    type: "multiple_choice",
    question: "Wat vergat Erik meermaals als hij op vakantie ging?",
    options: ["Zijn paspoort", "Zijn zonnebril", "Zijn schoenen", "Zijn portemonnee"],
    correctIndex: 2,
    timeLimitSeconds: 20,
  },
  {
    id: 11,
    type: "multiple_choice",
    question: "Waar (bij welke club) scoorde Erik zijn 2 belangrijkste doelpunten?",
    options: [
      "Bij Alphense Boys",
      "Bij DOSR",
      "Bij VVSB",
      "Bij Roda '23",
    ],
    correctIndex: 1,
    videoUrl: "/questions/vraag-14.mp4",
    videoIntro: true,
    timeLimitSeconds: 20,
  },
  {
    id: 12,
    type: "multiple_choice",
    question: "Wat bestellen Cas en Erik het liefst als ze eten laten bezorgen?",
    options: ["Pizza", "Chinees", "Sushi", "Poke bowls"],
    correctIndex: 2,
    timeLimitSeconds: 20,
  },
  {
    id: 13,
    type: "multiple_choice",
    question: "Over hoeveel trajecten is Erik verkeersleider bij ProRail?",
    options: ["Vier", "Acht", "Twee", "Zes"],
    correctIndex: 3,
    timeLimitSeconds: 20,
  },
  {
    id: 14,
    type: "multiple_choice",
    question: "Hoe heten de katten van Erik en Cas?",
    options: ["Milo & Suus", "Lilo & Guus", "Lilo & Truus", "Milo & Guus"],
    correctIndex: 1,
    imageUrl: "/questions/vraag-katten.jpg",
    timeLimitSeconds: 25,
  },
  {
    id: 15,
    type: "photo_pick",
    question: "Op welke twee foto's zijn Erik & Cas te zien?",
    tiles: [
      { imageUrl: "/questions/paar-1.jpg" },
      { imageUrl: "/questions/paar-2.jpg" },
      { imageUrl: "/questions/paar-3.jpg" },
      { imageUrl: "/questions/paar-4.jpg" },
      { imageUrl: "/questions/paar-5.jpg" },
      { imageUrl: "/questions/paar-6.jpg" },
    ],
    correctIndexes: [0, 1],
    timeLimitSeconds: 25,
  },
  {
    id: 16,
    type: "multiple_choice",
    question: "Wat was Erik zijn belangrijkste taak in het huishouden aan de Ronsseweg?",
    options: ["Schoonmaken", "Eten koken", "Boodschappen", "Stofzuigen"],
    correctIndex: 0,
    timeLimitSeconds: 20,
  },
  {
    id: 17,
    type: "multiple_choice",
    question: "Wie ontmoette Cassandra voor het eerst?",
    options: ["Vrienden Erik", "Papa en mama", "Mariska", "Ronald"],
    correctIndex: 3,
    imageUrl: "/questions/vraag-10.jpg",
    timeLimitSeconds: 25,
  },
];

export const questionsById: Record<number, Question> = Object.fromEntries(
  questions.map((q) => [q.id, q])
);

/** Standaardvolgorde: de nieuwe fototegel-vraag eerst, dan de rest in oorspronkelijke volgorde. */
export const defaultQuestionOrder: number[] = [15, ...questions.filter((q) => q.id !== 15).map((q) => q.id)];

/**
 * Maakt een opgeslagen volgorde robuust tegen latere code-wijzigingen: vraag-
 * id's die niet meer bestaan vallen weg, nieuwe id's die nog niet in de
 * opgeslagen volgorde staan worden achteraan toegevoegd.
 */
export function resolveQuestionOrder(storedOrder: number[] | null | undefined): number[] {
  const known = new Set(questions.map((q) => q.id));
  const valid = (storedOrder ?? []).filter((id) => known.has(id));
  const missing = defaultQuestionOrder.filter((id) => !valid.includes(id));
  return [...valid, ...missing];
}

/** Past een opgeslagen volgorde/uitsluiting toe op de vragenlijst. */
export function getActiveQuestions(
  storedOrder: number[] | null | undefined,
  disabledIds: number[] | null | undefined
): Question[] {
  const order = resolveQuestionOrder(storedOrder);
  const disabled = new Set(disabledIds ?? []);
  return order
    .filter((id) => !disabled.has(id))
    .map((id) => questionsById[id])
    .filter((q): q is Question => Boolean(q));
}
