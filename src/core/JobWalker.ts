import Big from "big.js";
import { JOB_WALKER_INTERVAL } from "../config";
import DataRequest from "../models/DataRequest";
import { NodeOptions } from "../models/NodeOptions";
import ProviderRegistry from "../providers/ProviderRegistry";
import { storeDataRequest } from "../services/DataRequestService";
import logger from "../services/LoggerService";
import NodeBalance from "./NodeBalance";

export default class JobWalker {
    nodeOptions: NodeOptions;
    providerRegistry: ProviderRegistry;
    nodeBalance: NodeBalance;
    requests: DataRequest[];
    processingIds: string[] = [];

    constructor(nodeOptions: NodeOptions, providerRegistry: ProviderRegistry, nodeBalance: NodeBalance, initialRequests: DataRequest[] = []) {
        this.requests = initialRequests.filter(r => typeof r.claimedAmount === 'undefined');
        this.nodeOptions = nodeOptions;
        this.providerRegistry = providerRegistry;
        this.nodeBalance = nodeBalance;
    }

    async addNewDataRequest(request: DataRequest) {
        try {
            await request.execute();
            await request.stakeOrChallenge(
                this.nodeOptions,
                this.providerRegistry,
                this.nodeBalance,
            );

            await storeDataRequest(request);
            this.requests.push(request);
        } catch (error) {
            logger.error(`[JobWalker.addNewDataRequest] ${error}`);
        }
    }

    private async walkRequest(request: DataRequest) {
        const newStatus = await this.providerRegistry.getDataRequestById(request.providerId, request.id);
        if (!newStatus) return;

        request.update(newStatus);

        if (request.isClaimable()) {
            // Claim the earnings and
            const isClaimSuccesful = await request.claim(this.providerRegistry);

            if (isClaimSuccesful) {
                const index = this.requests.findIndex(r => r.internalId === request.internalId);
                this.requests.splice(index, 1);
                this.nodeBalance.deposit(request.providerId, new Big(request.claimedAmount ?? 0));
            }
        }

        // Check status of request
        // If finalizable, finalize it
        // If claimable, claim it
        // If challenged rexecute etc.
        await storeDataRequest(request);
    }

    startWalker() {
        setInterval(() => {
            this.requests.forEach(async (request) => {
                // Request is already being processed
                if (this.processingIds.includes(request.internalId)) {
                    return;
                }

                this.processingIds.push(request.internalId);
                await this.walkRequest(request);

                // Let the next loop know we are ready to be processed again
                // We can't trust the forEach index, because it could be gone by the time we processed it
                const index = this.processingIds.findIndex(id => id === request.internalId);
                this.processingIds.splice(index, 1);
            });
        }, JOB_WALKER_INTERVAL);
    }
}
