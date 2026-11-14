import {Router} from "express";
import { cleanMeetingNotesController } from "../controllers/meeting-notes.controller";

const assistantRouter = Router();

assistantRouter.post("/clean-meeting-notes", cleanMeetingNotesController);

export default assistantRouter;