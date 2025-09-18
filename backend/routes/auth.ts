import { Router } from 'express';
import { signup, signin, signout, validateSession } from '../controllers/authController';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/signout', signout);
router.get('/validate-session', validateSession);

export default router;
