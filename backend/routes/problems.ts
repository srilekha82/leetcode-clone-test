import { Router } from 'express';
import { getProblems, getProblem, createProblem } from '../controllers/problemController';

const router = Router();

router.get('/', getProblems);
router.get('/:id', getProblem);
router.post('/', createProblem);

export default router;
