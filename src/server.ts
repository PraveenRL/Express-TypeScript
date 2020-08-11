import { App } from "./app";

import { AuthenticationController } from "./controllers/authentication.controller";

import { config } from "dotenv";
import { validateEnv } from "./utils/validateEnv";

config();
validateEnv();

const app = new App(
    [
        new AuthenticationController(),
    ]
);

app.listen();