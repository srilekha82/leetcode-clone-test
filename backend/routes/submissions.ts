import { Router } from 'express';
import { addSubmission, getSubmission, createSubmission, batchwiseSubmission, updateSubmission } from '../controllers/submissionController';

const router = Router();

router.patch('/users/:id/submission', addSubmission);
router.get('/:id', getSubmission);
router.post('/', createSubmission);
router.post('/batch', batchwiseSubmission);
router.patch('/update', updateSubmission);

export default router;
