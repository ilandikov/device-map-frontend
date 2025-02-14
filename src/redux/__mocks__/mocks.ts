import { AuthenticationState } from '../../components/website/login/redux/AuthenticationState';

import { MapAppState } from '../../components/website/mapApp/redux/MapAppState';
import { ShallowPartial, buildInitialTestState } from '../stateBuilders';
import { RootState } from '../store';

/* To mock the react-redux functionalities in regard to {@link LoginModalState}
 * add the following code to the test:

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

 * and then use the following to set the state in each test:

mockLoginModalAuthenticationState({
    field: value,
        });

 */

export const mockDispatch = jest.fn();
export let mockPrepareSelector: () => RootState;

export function mockAuthenticationState(authentication: Partial<AuthenticationState>) {
    mockState({ authentication });
}

export function mockMapAppState(mapAppState: Partial<MapAppState>) {
    mockState({ mapAppState });
}

export function mockState(mockState: ShallowPartial<RootState>) {
    mockPrepareSelector = () => {
        return buildInitialTestState(mockState);
    };
}
