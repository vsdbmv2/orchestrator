import { Router } from "express";
import frontendController from "../controllers/frontendController";

const router = Router();

router.post("/epitope_assay/", frontendController.getEpitopeInfos);
router.post("/epitope_by_linearsequence/", frontendController.getEpitopeList);
router.post("/lucifrequence/", frontendController.luciFrequence);

export default router;
