import logger from "pino";
import dayjs from "dayjs";
import { pid } from "process";

const log = logger({
    base: {
        pid: false
    },
    transport: {
        target: "pino-pretty",
    },
    timestamp: () => `,"time":"${dayjs().format()}"`,
})

export default log;