"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("config"));
const connect_1 = __importDefault(require("./utils/connect"));
const logger_1 = __importDefault(require("./utils/logger"));
const routes_1 = __importDefault(require("./routes"));
const deserializeUser_1 = __importDefault(require("./middleware/deserializeUser"));
const cors_1 = __importDefault(require("cors"));
const port = config_1.default.get("port");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(deserializeUser_1.default);
app.use(express_1.default.json());
app.listen(port, async () => {
    logger_1.default.info(`App is running at http://localhost:${port}`);
    await (0, connect_1.default)();
    (0, routes_1.default)(app);
});
