import { knowledgeBase } from '../src/data/store';

export default function handler(req: any, res: any) {
  const sorted = [...knowledgeBase].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.status(200).json(sorted);
}
