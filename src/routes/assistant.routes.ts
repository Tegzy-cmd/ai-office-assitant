import {Router} from "express";
import { cleanMeetingNotesController } from "../controllers/meeting-notes.controller";

const assistantRouter = Router();

assistantRouter.post("/", cleanMeetingNotesController);

export default assistantRouter;