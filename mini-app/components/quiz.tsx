"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Share } from "@/components/share";
import { url } from "@/lib/metadata";

type Animal = "cat" | "dog" | "fox" | "hamster" | "horse";

interface Question {
  text: string;
  options: { label: string; animal: Animal }[];
}

const questions: Question[] = [
  {
    text: "What is your favorite type of food?",
    options: [
      { label: "Fish", animal: "cat" },
      { label: "Meat", animal: "dog" },
      { label: "Berries", animal: "fox" },
      { label: "Seeds", animal: "hamster" },
      { label: "Grain", animal: "horse" },
    ],
  },
  {
    text: "How do you prefer to spend a weekend?",
    options: [
      { label: "Sleeping", animal: "cat" },
      { label: "Playing fetch", animal: "dog" },
      { label: "Exploring", animal: "fox" },
      { label: "Storing food", animal: "hamster" },
      { label: "Running", animal: "horse" },
    ],
  },
  {
    text: "What is your personality like?",
    options: [
      { label: "Independent", animal: "cat" },
      { label: "Friendly", animal: "dog" },
      { label: "Curious", animal: "fox" },
      { label: "Organized", animal: "hamster" },
      { label: "Strong", animal: "horse" },
    ],
  },
  {
    text: "Which environment do you thrive in?",
    options: [
      { label: "Indoor", animal: "cat" },
      { label: "Outdoor", animal: "dog" },
      { label: "Forest", animal: "fox" },
      { label: "Cage", animal: "hamster" },
      { label: "Pasture", animal: "horse" },
    ],
  },
  {
    text: "What is your favorite activity?",
    options: [
      { label: "Purring", animal: "cat" },
      { label: "Barking", animal: "dog" },
      { label: "Sneaking", animal: "fox" },
      { label: "Nibbling", animal: "hamster" },
      { label: "Galloping", animal: "horse" },
    ],
  },
];

function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function Quiz() {
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, Animal>>({});
  const [result, setResult] = useState<Animal | null>(null);

  useEffect(() => {
    const qs = questions.map((q) => ({
      ...q,
      options: shuffleArray(q.options),
    }));
    setShuffledQuestions(qs);
  }, []);

  const handleSelect = (qIndex: number, animal: Animal) => {
    setAnswers((prev) => ({ ...prev, [qIndex]: animal }));
  };

  const handleSubmit = () => {
    const score: Record<Animal, number> = {
      cat: 0,
      dog: 0,
      fox: 0,
      hamster: 0,
      horse: 0,
    };
    Object.values(answers).forEach((a) => {
      score[a] += 1;
    });
    const max = Math.max(...Object.values(score));
    const winners = Object.entries(score)
      .filter(([, v]) => v === max)
      .map(([k]) => k as Animal);
    setResult(winners[0]); // pick first in case of tie
  };

  const handleRetake = () => {
    setAnswers({});
    setResult(null);
    setShuffledQuestions(
      questions.map((q) => ({
        ...q,
        options: shuffleArray(q.options),
      }))
    );
  };

  if (result) {
    return (
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-2xl font-semibold">You are a {result}!</h2>
        <img
          src={`/${result}.png`}
          alt={result}
          width={256}
          height={256}
          className="rounded"
        />
        <Share text={`I am a ${result}! ${url}`} />
        <Button variant="outline" onClick={handleRetake}>
          Retake Quiz
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      {shuffledQuestions.map((q, idx) => (
        <div key={idx} className="mb-6">
          <h3 className="text-lg font-medium mb-2">{q.text}</h3>
          <div className="grid grid-cols-2 gap-2">
            {q.options.map((opt) => (
              <Button
                key={opt.label}
                variant={answers[idx] === opt.animal ? "secondary" : "outline"}
                onClick={() => handleSelect(idx, opt.animal)}
              >
                {opt.label}
              </Button>
            ))}
          </div>
        </div>
      ))}
      <Button
        className="w-full"
        onClick={handleSubmit}
        disabled={Object.keys(answers).length !== shuffledQuestions.length}
      >
        Show Result
      </Button>
    </div>
  );
}
