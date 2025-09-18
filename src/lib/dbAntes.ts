export type ResponseRec = {
  id: string;
  player: string;
  questionId: string;
  choiceIndex: number;
  isCorrect: boolean;
  verifiedAt: number; // epoch ms
  proofId: string;
};

const _responses: ResponseRec[] = [];

export function dbAddResponse(r: ResponseRec) {
  _responses.push(r);
}

export function dbFindResponse(player: string, questionId: string) {
  return _responses.find(
    (r) => r.player === player && r.questionId === questionId
  );
}

export function dbGetResponses() {
  return _responses;
}
