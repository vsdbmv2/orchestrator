import { Router } from "express";
import sequenceController from "../controllers/sequenceController";

const router = Router();

router.get("/sequence/count/:id", sequenceController.getCount);
router.get("/sequence/coverage/avg/:id", sequenceController.getCoverageAvg);
router.get("/sequence/translation/count/:id", sequenceController.getTranslationCount);
router.get("/sequence/count/day/:id", sequenceController.getCountPerDay);
router.get("/sequence/count/country/:id", sequenceController.getCountPerCountry);
router.get("/sequence/subtype/count/:id", sequenceController.getCountSubtypeGeneral);

export default router;
