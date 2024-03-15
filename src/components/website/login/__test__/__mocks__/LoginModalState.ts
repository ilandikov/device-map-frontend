import { LoginModalState } from '../../reducer';

export const mockDispatch = jest.fn();

export let mockPrepareSelector: () => any;
export function mockLoginModalState(mockState: Partial<LoginModalState>) {
    mockPrepareSelector = () => {
        return mockState;
    };
}
