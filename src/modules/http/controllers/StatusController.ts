import { ModuleDependencies } from '@fluxprotocol/oracle-provider-core/dist/Module';
import express from 'express';
// import { calculateBalanceStatus } from '../../../services/NodeBalanceService';
// import { getLatestDataRequests } from '../../NodeSyncer';
// import { NodeHttpContext } from '../NodeHttpContext';

export default function activateStatusRoutes(app: express.Express, dependencies: ModuleDependencies) {
    app.get('/status', async (req, res) => {


        res.json({
            processing: dependencies.jobWalker.processingIds.size,
            watching: dependencies.jobWalker.requests.size,
        });
        // @ts-ignore
        // const context: NodeHttpContext = req.context;
        // const balanceStatus = calculateBalanceStatus(context.jobWalker.nodeBalance, context.jobWalker);
        // const latestRequests = await getLatestDataRequests();

        // res.json({
        //     processing: context.jobWalker.processingIds.size,
        //     watching: context.jobWalker.requests.size,
        //     profit: balanceStatus.profit.toString(),
        //     activelyStaking: balanceStatus.activelyStaking.toString(),
        //     balance: balanceStatus.balance.toString(),
        //     latestRequests: latestRequests.map((latestRequest) => ({
        //         provider: latestRequest.provider,
        //         requestId: latestRequest.id,
        //     })),
        // });
    });
}
