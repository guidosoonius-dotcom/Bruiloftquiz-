export type QuizPhase = "lobby" | "question" | "reveal" | "leaderboard" | "finished";

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
  selected_option: number;
  is_correct: boolean;
  points_awarded: number;
  answered_at: string;
}

export type QuestionType = "multiple_choice";

export interface Question {
  /** Index in the questions array — used as the join key everywhere. */
  id: number;
  type: QuestionType;
  /** TODO: vraagtekst invullen */
  question: string;
  /** TODO: 4 antwoordopties invullen */
  options: [string, string, string, string];
  /** Index (0-3) van het juiste antwoord */
  correctIndex: number;
  /** Optioneel: leuk verhaaltje/anekdote dat de quizmaster erbij kan voorlezen */
  anecdote?: string;
  /** Optioneel: pad naar een foto in /public, bv. "/questions/vraag-3.jpg" */
  imageUrl?: string;
  /** Optioneel: pad naar een video in /public, bv. "/questions/vraag-5.mp4" */
  videoUrl?: string;
  /** Hoeveel seconden gasten hebben om te antwoorden */
  timeLimitSeconds: number;
}
