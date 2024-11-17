"use client";

import words from "@/app/data/words";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useState } from "react";
import Keyboard from "react-simple-keyboard";
import Confetti from "react-confetti";
import "react-simple-keyboard/build/css/index.css";

interface GamePageProps {
  params: { id: string };
}

export default function GamePage({ params }: GamePageProps) {
  const wordId = Number(params.id);
  const wordData = words.find((word) => word.id === wordId);
  const router = useRouter(); // Para navegação entre fases

  if (!wordData) {
    notFound();
    return null;
  }

  const [guess, setGuess] = useState<string[]>(Array(wordData.palavra.length).fill(""));
  const [correctLetters, setCorrectLetters] = useState<boolean[]>(
    Array(wordData.palavra.length).fill(false)
  );
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);

  const handleKeyPress = (button: string) => {
    if (button === "{bksp}") {
      if (currentIndex > 0) {
        const updatedGuess = [...guess];
        updatedGuess[currentIndex - 1] = ""; // Apaga a última letra
        setGuess(updatedGuess);
        setCurrentIndex((prev) => prev - 1); // Move o índice para trás
      }
    } else if (currentIndex < wordData.palavra.length && button.length === 1) {
      const updatedGuess = [...guess];
      updatedGuess[currentIndex] = button; // Insere a letra digitada
      setGuess(updatedGuess);
      setCurrentIndex((prev) => prev + 1); // Avança o índice
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedCorrectLetters = Array(wordData.palavra.length).fill(false);

    // Atualiza os estados das letras corretas
    for (let i = 0; i < wordData.palavra.length; i++) {
      if (guess[i]?.toLowerCase() === wordData.palavra[i]?.toLowerCase()) {
        updatedCorrectLetters[i] = true;
      }
    }

    setCorrectLetters(updatedCorrectLetters);

    const userGuess = guess.join("").toLowerCase();
    if (userGuess === wordData.palavra.toLowerCase()) {
      setShowConfetti(true); // Exibe confetes
      setShowCongrats(true); // Exibe a mensagem de parabéns
    }
  };

  const handleNextPhase = () => {
    router.push(`/palavra/${wordId + 1}`); // Vai para o próximo ID
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      {showConfetti && <Confetti />}
      {showCongrats ? (
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-4xl font-bold text-green-600">Parabéns! Você acertou!</h1>
          <button
            onClick={handleNextPhase}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors"
          >
            Próxima Fase
          </button>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Descubra a Palavra</h1>
          <p className="text-lg text-gray-600 mb-6">
            <strong>Dica:</strong> {wordData.dica}
          </p>
          <form onSubmit={handleSubmit} className="w-full max-w-md flex flex-col items-center">
            <div className="flex space-x-2 mb-4">
              {guess.map((letter, index) => (
                <div
                  key={index}
                  className={`w-12 h-12 border rounded-md flex items-center justify-center text-lg font-bold shadow ${correctLetters[index] ? "bg-green-500 text-white" : "bg-white text-black"
                    }`}
                >
                  {letter.toUpperCase()}
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="w-full py-2 px-4 text-white bg-blue-600 rounded-md shadow hover:bg-blue-700 transition-colors"
            >
              Enviar
            </button>
          </form>
          <div className="mt-6 w-full max-w-md bg-white p-4 shadow rounded-md">
            <Keyboard
              onKeyPress={handleKeyPress}
              layout={{
                default: [
                  "q w e r t y u i o p",
                  "a s d f g h j k l",
                  "z x c v b n m {bksp}",
                ],
              }}
              display={{
                "{bksp}": "⌫",
              }}
              theme={"hg-theme-default"}
            />
          </div>
        </>
      )}
    </main>
  );
}
