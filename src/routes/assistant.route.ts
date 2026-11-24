import {Router} from "express";
import { cleanMeetingNotesController } from "../controllers/meeting_notes.controller";

const assistantRouter = Router();

assistantRouter.post("/", cleanMeetingNotesController);

export default assistantRouter;