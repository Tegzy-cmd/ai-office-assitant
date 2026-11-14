import app from "./app";
import { log } from "./utils/logger";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    log(`Server running on port ${PORT}`);
});

