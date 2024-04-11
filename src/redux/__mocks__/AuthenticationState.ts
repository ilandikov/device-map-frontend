import { AuthenticationState } from '../../components/website/login/redux/state';
import { MapAppState } from '../../components/website/mapApp/redux/MapAppReducer';

/* To mock the react-redux functionalities in regard to {@link LoginModalState}
 * add the following code to the test:

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

 * and then use the following to set the state in each test:

mockLoginModalState({
    field: value,
        });

 */

export const mockDispatch = jest.fn();
export let mockPrepareSelector: () => any;

export function mockAuthenticationState(mockState: Partial<AuthenticationState>) {
    mockPrepareSelector = () => {
        return mockState;
    };
}

export function mockMapAppState(mockState: Partial<MapAppState>) {
    mockPrepareSelector = () => {
        return mockState;
    };
}
