// /app/page.tsx
import Link from "next/link";
import words from "./data/words";

export default function Home() {
  return (
    <main style={{ padding: "20px" }}>
      <h1>Jogo de Palavras</h1>
      <p>Selecione um ID para começar o jogo:</p>
      <ul>
        {words.map((word) => (
          <li key={word.id}>
            <Link href={`/palavra/${word.id}`}>
              Palavra {word.id}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
