import { MapAppState } from '../MapAppReducer';

export const mockDispatch = jest.fn();

export let mockPrepareSelector: () => any;
export function mockMapAppState(mockState: Partial<MapAppState>) {
    mockPrepareSelector = () => {
        return mockState;
    };
}
