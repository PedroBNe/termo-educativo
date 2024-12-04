/* eslint-disable react-hooks/rules-of-hooks */
"use client"

import words from "@/app/data/words";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";
import Keyboard from "react-simple-keyboard";
import Confetti from "react-confetti";
import "react-simple-keyboard/build/css/index.css";

interface GamePageProps {
  params: { id: string };
}

export default function GamePage({ params }: GamePageProps) {
  const wordId = Number(params.id);
  const wordData = words.find((word) => word.id === wordId);
  const router = useRouter();

  // Estados do jogo
  const [guess, setGuess] = useState<string[]>([]);
  const [correctLetters, setCorrectLetters] = useState<boolean[]>([]);
  const [almostCorrectLetters, setAlmostCorrectLetters] = useState<boolean[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showCongrats, setShowCongrats] = useState<boolean>(false);
  const [showFinalCongrats, setShowFinalCongrats] = useState<boolean>(false);

  // Histórico de tentativas
  const [attemptsHistory, setAttemptsHistory] = useState<{ guess: string[]; correctLetters: boolean[]; almostCorrectLetters: boolean[] }[]>([]);

  if (!wordData) {
    notFound();
    return null;
  }

  // Initialize states based on wordData
  useEffect(() => {
    setGuess(Array(wordData.palavra.length).fill(""));
    setCorrectLetters(Array(wordData.palavra.length).fill(false));
    setAlmostCorrectLetters(Array(wordData.palavra.length).fill(false));
  }, [wordData]);

  // Função para lidar com as teclas pressionadas no teclado virtual
  const handleKeyPress = (button: string) => {
    if (button === "{bksp}") {
      // Ao pressionar backspace, apaga a letra na posição atual
      if (currentIndex > 0) {
        const updatedGuess = [...guess];
        updatedGuess[currentIndex - 1] = "";
        setGuess(updatedGuess);
        setCurrentIndex((prev) => prev - 1);
      }
    } else if (currentIndex < wordData.palavra.length && button.length === 1) {
      // Se o botão pressionado for uma letra e ainda houver espaço, adiciona à tentativa
      const updatedGuess = [...guess];
      updatedGuess[currentIndex] = button;
      setGuess(updatedGuess);
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Função para verificar a resposta e adicionar ao histórico de tentativas
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedCorrectLetters = Array(wordData.palavra.length).fill(false);
    const updatedAlmostCorrectLetters = Array(wordData.palavra.length).fill(false);

    // Verificar as letras corretas
    for (let i = 0; i < wordData.palavra.length; i++) {
      if (guess[i]?.toLowerCase() === wordData.palavra[i]?.toLowerCase()) {
        updatedCorrectLetters[i] = true;
      }
    }

    // Verificar as letras quase corretas
    for (let i = 0; i < wordData.palavra.length; i++) {
      if (!updatedCorrectLetters[i]) {
        const guessLetter = guess[i]?.toLowerCase();
        if (guessLetter && wordData.palavra.toLowerCase().includes(guessLetter)) {
          if (wordData.palavra.toLowerCase().indexOf(guessLetter) !== i) {
            updatedAlmostCorrectLetters[i] = true;
          }
        }
      }
    }

    setCorrectLetters(updatedCorrectLetters);
    setAlmostCorrectLetters(updatedAlmostCorrectLetters);

    const userGuess = guess.join("").toLowerCase();

    // Adicionando a tentativa ao histórico
    setAttemptsHistory((prevHistory) => [
      ...prevHistory,
      { guess: [...guess], correctLetters: updatedCorrectLetters, almostCorrectLetters: updatedAlmostCorrectLetters },
    ]);

    // Verificar se a tentativa está correta
    if (userGuess === wordData.palavra.toLowerCase()) {
      setShowConfetti(true);
      setShowCongrats(true);
    } else {
      // Limpar os campos para nova tentativa
      setGuess(Array(wordData.palavra.length).fill(""));
      setCorrectLetters(Array(wordData.palavra.length).fill(false));
      setAlmostCorrectLetters(Array(wordData.palavra.length).fill(false));
      setCurrentIndex(0);
    }
  };

  // Função para avançar para a próxima fase
  const handleNextPhase = () => {
    if (wordId === words[words.length - 1].id) {
      setShowCongrats(false);
      setShowFinalCongrats(true);
    } else {
      router.push(`/palavra/${wordId + 1}`);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 bg-[url('/image.jpg')]">
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-6 py-16">
        {showConfetti && <Confetti />}
        {showFinalCongrats ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-4xl font-bold text-green-600 text-center">
              🎉 Parabéns! Você completou todos as palavras! 🎉
            </h1>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-3 bg-[#222] text-white font-semibold rounded-md shadow hover:bg-[#000] transition-colors"
            >
              Voltar para a Página Inicial
            </button>
          </div>
        ) : showCongrats ? (
          <div className="flex flex-col items-center justify-center space-y-4">
            <h1 className="text-4xl font-bold text-green-600 text-center">Parabéns! Você acertou!</h1>
            <button
              onClick={handleNextPhase}
              className="px-6 py-3 bg-[#222] text-white font-semibold rounded-md shadow hover:bg-[#000] transition-colors"
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
              <div className="flex space-x-2 mb-4 max-w-[80vw]">
                {guess.map((letter, index) => (
                  <div
                    key={index}
                    className={`w-12 h-12 border rounded-md flex items-center justify-center text-lg font-bold shadow 
                      ${correctLetters[index] ? "bg-green-500 text-white" : 
                        almostCorrectLetters[index] ? "bg-yellow-500 text-white" : 
                        "bg-white text-black"}`}
                  >
                    {letter.toUpperCase()}
                  </div>
                ))}
              </div>
              <button
                type="submit"
                className="w-full py-2 px-4 text-white bg-[#222] rounded-md shadow hover:bg-[#000] transition-colors"
              >
                Enviar
              </button>
            </form>

            {showCongrats && (
              <div className="mt-4 text-green-600">
                <p>Você acertou! 🎉</p>
              </div>
            )}

            {/* Exibir Histórico de Tentativas */}
            <div className="mt-6 w-full max-w-md bg-white md:p-4 shadow rounded-md">
              {attemptsHistory.length > 0 && (
                <div className="space-y-4">
                  {attemptsHistory.map((attempt, index) => (
                    <div key={index} className="flex space-x-2">
                      {attempt.guess.map((letter, i) => (
                        <div
                          key={i}
                          className={`w-12 h-12 border rounded-md flex items-center justify-center text-lg font-bold shadow
                            ${attempt.correctLetters[i] ? "bg-green-500 text-white" : 
                              attempt.almostCorrectLetters[i] ? "bg-yellow-500 text-white" : 
                              "bg-white text-black"}`}
                        >
                          {letter.toUpperCase()}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="mt-6 w-full max-w-md bg-white md:p-4 shadow rounded-md">
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
      </div>
    </main>
  );
}