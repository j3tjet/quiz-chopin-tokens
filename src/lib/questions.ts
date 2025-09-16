export type Question = {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
};

export const QUESTIONS: Question[] = [
  {
    id: "q1",
    prompt: "¿Qué es Celestia, en una frase?",
    options: [
      "Una base de datos SQL",
      "Una capa de disponibilidad de datos (DA)",
      "Un explorador de bloques",
      "Un lenguaje de programación",
    ],
    correctIndex: 1,
  },
  {
    id: "q2",
    prompt: "¿Para qué sirve Chopin en una app web?",
    options: [
      "Para añadir verificabilidad y notarización",
      "Para minificar CSS",
      "Para alojar imágenes",
      "Para reemplazar el navegador",
    ],
    correctIndex: 0,
  },
  {
    id: "q3",
    prompt: "¿Qué función entrega tiempo verificable en Chopin?",
    options: [
      "Oracle.now()",
      "Oracle.date()",
      "Oracle.time()",
      "Oracle.clock()",
    ],
    correctIndex: 0,
  },
  {
    id: "q4",
    prompt: "¿Qué llamada usarías para aleatoriedad con prueba?",
    options: [
      "Oracle.random()",
      "Oracle.shuffle()",
      "Oracle.luck()",
      "Oracle.randInt()",
    ],
    correctIndex: 0,
  },
  {
    id: "q5",
    prompt: "¿Qué hace Oracle.notarize()?",
    options: [
      "Sube un archivo a IPFS",
      "Registra/nota una acción o dato para poder verificarlo",
      "Compila el proyecto",
      "Renderiza componentes del cliente",
    ],
    correctIndex: 1,
  },
];
