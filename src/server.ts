import App from './app';
import AuthController from './controller/auth.controller';
import TableController from './controller/table/table.controller';


const app = new App(
    [
        new AuthController(),
        new TableController()
    ],
    5000
);

app.listen();