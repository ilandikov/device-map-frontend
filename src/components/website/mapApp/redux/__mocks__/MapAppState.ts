import { MapAppState } from '../MapAppReducer';

export let mockPrepareSelector: () => any;
export function mockMapAppState(mockState: Partial<MapAppState>) {
    mockPrepareSelector = () => {
        return mockState;
    };
}
