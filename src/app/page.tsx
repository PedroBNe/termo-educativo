import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-[url('/image.jpg')] p-6">
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-6">
        <h1 className="text-4xl font-bold text-[#000] mb-6 text-center">Termo Educativo</h1>
        <p className="text-lg text-gray-700 mb-8 text-center">
          Bem-vindo! Clique no botão abaixo para começar o jogo.
        </p>
        <Link href="/palavra/1">
          <button className="px-6 py-3 bg-[#222] text-white font-semibold rounded-md shadow hover:bg-[#000] transition-colors">
            Começar o Jogo
          </button>
        </Link>
      </div>
    </main>
  );
}
