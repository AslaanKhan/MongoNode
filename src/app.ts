import express from "express";
import config from "config";
import connect from "./utils/connect";
import logger from "./utils/logger";
import routes from "./routes";
import deserializeUser from "./middleware/deserializeUser";
import cors from "cors";

const port = config.get<number>("port");

const app = express();
app.use(cors());

app.use(deserializeUser)
app.use(express.json());

app.listen(port, async () => {
    logger.info(`App is running at http://localhost:${port}`);
    await connect();
    routes(app);
});