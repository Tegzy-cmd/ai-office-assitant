import dotenv from "dotenv";
import path from "path";

const environment = process.env.NODE_ENV || "staging";

dotenv.config({ path: path.resolve(process.cwd(), `.env.${environment}`) });
dotenv.config();
