export { categories } from "./categories";
export {
  Question,
  QuestionFilter,
  StudyRecommendation,
  StudySession,
} from "./question";
export { mathQuestions } from "./math/mathQuestions";
export { physicsQuestions } from "./physics/physicsQuestions";
export { chemistryQuestions } from "./chemistry/chemistryQuestions";
export { biologyQuestions } from "./biology/biologyQuestions";
export { historyQuestions } from "./history/historyQuestions";
export { geographyQuestions } from "./geography/geographyQuestions";
export { portugueseQuestions } from "./portuguese/portugueseQuestions";
export { literatureQuestions } from "./literature/literatureQuestions";
export { philosophyQuestions } from "./philosophy/philosophyQuestions";
export { sociologyQuestions } from "./sociology/sociologyQuestions";
export { englishQuestions } from "./english/englishQuestions";

// Array com todas as questões
export const allQuestions = [
  ...mathQuestions,
  ...physicsQuestions,
  ...chemistryQuestions,
  ...biologyQuestions,
  ...historyQuestions,
  ...geographyQuestions,
  ...portugueseQuestions,
  ...literatureQuestions,
  ...philosophyQuestions,
  ...sociologyQuestions,
  ...englishQuestions,
];
