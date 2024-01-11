import { Router } from "express";

import epitopeController from "../controllers/epitopeController";
import auth from "../middlewares/auth";

const router = Router();

router.get("/epitope/count/:id", auth.getUser("user"), epitopeController.getCount);
router.get("/epitope/iedb/count/", epitopeController.getIedbCount);
router.get("/epitope/iedb/assay/count/", epitopeController.getIedbAssayCount);
router.get("/epitope/assay/top/:id", epitopeController.getTopEpitopesWithAssay);

export default router;
