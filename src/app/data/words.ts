// /data/words.ts
export interface Word {
  id: number;
  palavra: string;
  dica: string;
}

const words: Word[] = [
  {
    id: 1,
    palavra: "Amiga",
    dica: "É aquela pessoa que você procura para brincar e conversar. Ela te ajuda quando você precisa e compartilha as alegrias e risadas.",
  },
  {
    id: 2,
    palavra: "Respeito",
    dica: "É o que sentimos quando deixamos outra pessoa falar e ouvimos com atenção, mesmo que ela pense diferente. É importante para amizades e para a escola.",
  },
];

export default words;
