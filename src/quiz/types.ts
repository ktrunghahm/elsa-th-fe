export interface Quiz {
  answers: Record<number, number>;
  quizId: string;
  totalScore: number;
  quiz: {
    name: string;
    content: { questions: { text: string; options: { text: string; answer: boolean | null }[] }[] };
  };
}
