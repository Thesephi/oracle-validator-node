export function createProviderMock() {
    return {
        providerName: 'mock',
        id: 'mock',

        validateOptions: jest.fn(),
        init: jest.fn(),

        getTokenBalance: jest.fn(),
        getDataRequestById: jest.fn(),
        getDataRequests: jest.fn(),

        stake: jest.fn(),
        claim: jest.fn(),
        challenge: jest.fn(),
    };
}
