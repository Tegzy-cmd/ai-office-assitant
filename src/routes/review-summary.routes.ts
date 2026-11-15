import {Router} from "express";
import { reviewSummaryController } from "../controllers/review-summary.controller"

const reviewRouter = Router();

reviewRouter.post("/", reviewSummaryController)

export default reviewRouter
