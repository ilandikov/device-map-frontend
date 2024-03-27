import { AuthenticationState, AuthenticationStep } from '../state';

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

export function buildAuthenticationState(partialState: Partial<AuthenticationState>): AuthenticationState {
    return {
        step: partialState.step ?? AuthenticationStep.WELCOME,
        email: partialState.email ?? '',
        emailError: partialState.emailError ?? null,
        password: partialState.password ?? '',
        passwordRepeat: partialState.passwordRepeat ?? '',
        passwordError: partialState.passwordError ?? null,
    };
}

export function buildAuthenticationStateForEpic(partialState: Partial<AuthenticationState>) {
    return {
        value: {
            authentication: buildAuthenticationState(partialState),
        },
    };
}
