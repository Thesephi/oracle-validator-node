import Big from "big.js";
import DataRequest from "../models/DataRequest";
import { NodeOptions } from "../models/NodeOptions";

export interface StakeResponse {
    amountBack: Big;
    success: boolean;
}

export interface DataRequestFinalizeClaimResponse {
    received: string;
    success: boolean;
}

export interface Provider {
    providerName: string;
    id: string;

    validateOptions(options: NodeOptions, providerConfig: any): string[];
    init(options: NodeOptions): Promise<void>;

    getTokenBalance(): Promise<Big>;
    getDataRequestById(requestId: string): Promise<DataRequest | null>;
    getDataRequests(): Promise<DataRequest[]>;

    stake(requestId: string, roundId: number, answer?: string): Promise<StakeResponse>;
    claim(requestId: string): Promise<DataRequestFinalizeClaimResponse>;
    challenge(requestId: string, answer: string): Promise<StakeResponse>
}
