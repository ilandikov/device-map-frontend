import { LoginModalState } from '../../reducer';

export const mockDispatch = jest.fn();

export let mockUseSelector: () => any;
export function mockLoginModalState(mockState: Partial<LoginModalState>) {
    mockUseSelector = () => {
        return mockState;
    };
}
