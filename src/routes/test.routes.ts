import { Router } from 'express';
import { postTestItem, getAllTestItems } from '../controllers/test.controller';

const router = Router();

router.get('/', getAllTestItems);
router.post('/', postTestItem);

export default router;
