import { AuthenticationState } from '../../components/website/login/redux/AuthenticationState';

import { MapAppState, buildMapAppState } from '../../components/website/mapApp/redux/MapAppState';

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
export let mockPrepareSelector: () => any;

export function mockAuthenticationState(authenticationState: Partial<AuthenticationState>) {
    mockPrepareSelector = () => {
        return authenticationState;
    };
}

export function mockMapAppState(mapAppState: Partial<MapAppState>) {
    mockPrepareSelector = () => {
        return buildMapAppState(mapAppState);
    };
}
