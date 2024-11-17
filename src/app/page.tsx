import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-blue-600 mb-6">Termo Educativo</h1>
      <p className="text-lg text-gray-700 mb-8">
        Bem-vindo! Clique no botão abaixo para começar o jogo.
      </p>
      <Link href="/palavra/1">
        <button className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow hover:bg-blue-700 transition-colors">
          Começar o Jogo
        </button>
      </Link>
    </main>
  );
}
