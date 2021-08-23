import Module, { ModuleDependencies } from '@fluxprotocol/oracle-provider-core/dist/Module';
import { EnvArgs } from '@fluxprotocol/oracle-provider-core/dist/Provider';
import logger from '../../services/LoggerService';

export default class AnalyticsLoggerModule extends Module {
    name = 'analytics-logger-module';

    // 10 seconds
    minimumTimeBetweenLogs: number = 10_000;
    timeBetweenLogs: number = 0;

    async tick(timeSinceLastTick: number) {
        this.timeBetweenLogs += timeSinceLastTick;

        if (this.timeBetweenLogs < this.minimumTimeBetweenLogs) {
            return;
        }

        logger.info('Processed x out of y');

        this.timeBetweenLogs = 0;
    }
}
