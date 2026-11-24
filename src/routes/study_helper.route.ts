import {Router} from "express";
import { studyHelperController } from "../controllers/study_helper.controller";

const studyRouter = Router();

studyRouter.post("/", studyHelperController);

export default studyRouter;