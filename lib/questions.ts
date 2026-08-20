import { Question } from "./types";

/**
 * PLACEHOLDER VRAGEN — pas dit hele bestand aan met de echte quizvragen.
 *
 * Elke vraag heeft verplicht: question, 4 options, correctIndex, timeLimitSeconds.
 * Optioneel: anecdote (tekst die de quizmaster kan voorlezen), imageUrl (foto in /public),
 * videoUrl (video in /public).
 *
 * Reken op ~45-60 sec. per vraag (incl. antwoorden + onthullen) voor een quiz van ~15 min.
 */
export const questions: Question[] = [
  {
    id: 0,
    type: "multiple_choice",
    question: "TODO: vraag 1 — bijvoorbeeld over hoe het bruidspaar elkaar ontmoette",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 0,
    timeLimitSeconds: 20,
  },
  {
    id: 1,
    type: "multiple_choice",
    question: "TODO: vraag 2 — met een leuke anekdote erbij",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 1,
    anecdote:
      "TODO: anekdote die de quizmaster voorleest voordat de antwoordopties getoond worden.",
    timeLimitSeconds: 20,
  },
  {
    id: 2,
    type: "multiple_choice",
    question: "TODO: vraag 3 — met een foto erbij",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 2,
    imageUrl: "/questions/vraag-3.jpg",
    timeLimitSeconds: 25,
  },
  {
    id: 3,
    type: "multiple_choice",
    question: "TODO: vraag 4",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 0,
    timeLimitSeconds: 20,
  },
  {
    id: 4,
    type: "multiple_choice",
    question: "TODO: vraag 5 — met een video erbij",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 1,
    videoUrl: "/questions/vraag-5.mp4",
    timeLimitSeconds: 30,
  },
  {
    id: 5,
    type: "multiple_choice",
    question: "TODO: vraag 6",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 3,
    timeLimitSeconds: 20,
  },
  {
    id: 6,
    type: "multiple_choice",
    question: "TODO: vraag 7 — met een leuke anekdote erbij",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 2,
    anecdote:
      "TODO: anekdote die de quizmaster voorleest voordat de antwoordopties getoond worden.",
    timeLimitSeconds: 20,
  },
  {
    id: 7,
    type: "multiple_choice",
    question: "TODO: vraag 8",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 0,
    timeLimitSeconds: 20,
  },
  {
    id: 8,
    type: "multiple_choice",
    question: "TODO: vraag 9 — met een foto erbij",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 1,
    imageUrl: "/questions/vraag-9.jpg",
    timeLimitSeconds: 25,
  },
  {
    id: 9,
    type: "multiple_choice",
    question: "TODO: vraag 10",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 2,
    timeLimitSeconds: 20,
  },
  {
    id: 10,
    type: "multiple_choice",
    question: "TODO: vraag 11",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 3,
    timeLimitSeconds: 20,
  },
  {
    id: 11,
    type: "multiple_choice",
    question: "TODO: vraag 12 — met een leuke anekdote erbij",
    options: ["TODO optie A", "TODO optie B", "TODO optie C", "TODO optie D"],
    correctIndex: 0,
    anecdote:
      "TODO: anekdote die de quizmaster voorleest voordat de antwoordopties getoond worden.",
    timeLimitSeconds: 20,
  },
];
