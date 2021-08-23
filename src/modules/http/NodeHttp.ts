import express from 'express';
import activateStatusRoutes from './controllers/StatusController';
import Module from "@fluxprotocol/oracle-provider-core/dist/Module";

export default class HttpModule extends Module {
    async init() {
        const app = express();

        activateStatusRoutes(app, this.dependencies);

        const httpPort = Number(this.config['HTTP_PORT'] ?? '9344');

        app.listen(httpPort, () => {
            this.dependencies.logger.info(`🌍 HTTP listening on port ${httpPort}`);
        });
    }
}
