import { riskReport, recalculateStats } from '../src/data/store';

export default function handler(req: any, res: any) {
  recalculateStats();
  res.status(200).json(riskReport);
}
