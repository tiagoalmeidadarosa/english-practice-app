"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sentences, SentencePair } from "@/data/sentences";

export default function Home() {
  const [dailySentences, setDailySentences] = useState<SentencePair[]>([]);
  const [userTranslations, setUserTranslations] = useState<string[]>([]);
  const [results, setResults] = useState<{
    correct: number;
    incorrect: number;
    details: any[];
  } | null>(null);

  useEffect(() => {
    const getDailySentences = () => {
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).valueOf()) /
          86400000
      );
      const start = (dayOfYear * 5) % sentences.length;
      const newSentences = [];
      for (let i = 0; i < 5; i++) {
        newSentences.push(sentences[(start + i) % sentences.length]);
      }
      setDailySentences(newSentences);
      setUserTranslations(new Array(5).fill(""));
    };
    getDailySentences();
  }, []);

  const handleInputChange = (index: number, value: string) => {
    const newTranslations = [...userTranslations];
    newTranslations[index] = value;
    setUserTranslations(newTranslations);
  };

  const checkAnswers = () => {
    let correct = 0;
    let incorrect = 0;
    const details = dailySentences.map((sentence, index) => {
      const isCorrect =
        userTranslations[index].trim().toLowerCase() ===
        sentence.english.toLowerCase();
      if (isCorrect) {
        correct++;
      } else {
        incorrect++;
      }
      return {
        portuguese: sentence.portuguese,
        userAnswer: userTranslations[index],
        correctAnswer: sentence.english,
        isCorrect,
      };
    });
    setResults({ correct, incorrect, details });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Practice Your English</CardTitle>
          </CardHeader>
          <CardContent>
            {dailySentences.map((sentence, index) => (
              <div key={sentence.id} className="mb-4">
                <Label htmlFor={`sentence-${index}`} className="mb-2 block font-bold">
                  {sentence.portuguese}
                </Label>
                <Input
                  id={`sentence-${index}`}
                  value={userTranslations[index]}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  placeholder="Type the English translation"
                />
              </div>
            ))}
            <Button onClick={checkAnswers}>Submit</Button>

            {results && (
              <div className="mt-6">
                <h2 className="text-xl font-bold">Results</h2>
                <p>Correct: {results.correct}</p>
                <p>Incorrect: {results.incorrect}</p>
                <div className="mt-4 space-y-4">
                  {results.details.map((detail, index) => (
                    <Card
                      key={index}
                      className={
                        detail.isCorrect ? "bg-green-100" : "bg-red-100"
                      }
                    >
                      <CardContent className="p-4">
                        <p>
                          <strong>Portuguese:</strong> {detail.portuguese}
                        </p>
                        <p>
                          <strong>Your Answer:</strong> {detail.userAnswer}
                        </p>
                        {!detail.isCorrect && (
                          <p>
                            <strong>Correct Answer:</strong>{" "}
                            {detail.correctAnswer}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
