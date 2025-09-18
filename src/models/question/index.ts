export { categories } from "./categories";
export {
  Question,
  QuestionFilter,
  StudyRecommendation,
  StudySession,
} from "./question";

// Importar todas as questões
import { mathQuestions } from "./math/mathQuestions";
import { physicsQuestions } from "./physics/physicsQuestions";
import { chemistryQuestions } from "./chemistry/chemistryQuestions";
import { biologyQuestions } from "./biology/biologyQuestions";
import { historyQuestions } from "./history/historyQuestions";
import { geographyQuestions } from "./geography/geographyQuestions";
import { portugueseQuestions } from "./portuguese/portugueseQuestions";
import { literatureQuestions } from "./literature/literatureQuestions";
import { philosophyQuestions } from "./philosophy/philosophyQuestions";
import { sociologyQuestions } from "./sociology/sociologyQuestions";
import { englishQuestions } from "./english/englishQuestions";

// Exportar as questões individuais
export { mathQuestions };
export { physicsQuestions };
export { chemistryQuestions };
export { biologyQuestions };
export { historyQuestions };
export { geographyQuestions };
export { portugueseQuestions };
export { literatureQuestions };
export { philosophyQuestions };
export { sociologyQuestions };
export { englishQuestions };

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
