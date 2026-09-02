export type QuizPhase = "lobby" | "video_intro" | "question" | "reveal" | "leaderboard" | "finished";

export interface QuizState {
  id: number;
  phase: QuizPhase;
  current_question_index: number;
  question_started_at: string | null;
}

export interface Player {
  id: string;
  name: string;
  created_at: string;
}

export interface Answer {
  id: string;
  player_id: string;
  question_index: number;
  /** Gekozen optie bij een multiple_choice vraag */
  selected_option: number | null;
  /** Gekozen tegels bij een photo_pick vraag */
  selected_options: number[] | null;
  is_correct: boolean;
  points_awarded: number;
  answered_at: string;
}

export type QuestionType = "multiple_choice" | "photo_pick";

interface QuestionBase {
  /** Index in de questions array — wordt gebruikt als join key overal. */
  id: number;
  /** Vraagtekst */
  question: string;
  /** Optioneel: leuk verhaaltje/anekdote dat de quizmaster erbij kan voorlezen */
  anecdote?: string;
  /** Hoeveel seconden gasten hebben om te antwoorden */
  timeLimitSeconds: number;
}

export interface MultipleChoiceQuestion extends QuestionBase {
  type: "multiple_choice";
  /** 4 antwoordopties */
  options: [string, string, string, string];
  /** Index (0-3) van het juiste antwoord */
  correctIndex: number;
  /** Optioneel: pad naar een foto in /public, bv. "/questions/vraag-3.jpg" */
  imageUrl?: string;
  /** Optioneel: pad naar een video in /public, bv. "/questions/vraag-5.mp4" */
  videoUrl?: string;
  /** Als true: toon de video eerst apart (quizmaster bedient), pas daarna de vraag zelf */
  videoIntro?: boolean;
}

export interface PhotoPickQuestion extends QuestionBase {
  type: "photo_pick";
  /**
   * Tegels om uit te kiezen. `imageUrl` mag ontbreken zolang de echte foto's
   * nog niet zijn aangeleverd — dan tonen we een placeholder-tegel.
   */
  tiles: { imageUrl?: string }[];
  /** Precies de 2 tegel-indexen die correct zijn */
  correctIndexes: [number, number];
}

export type Question = MultipleChoiceQuestion | PhotoPickQuestion;
