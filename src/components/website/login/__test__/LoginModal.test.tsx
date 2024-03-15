/* External dependencies */
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom';

/* Local dependencies */
import { configureTestStore } from '../../../../../tests/utils';
import { LoginModal } from '../LoginModal';
import { UserAuthState } from '../UserAuthStateUtils';
import { loginModalButtonClick } from '../actions';
import {
    renderAsJSON,
    resetLoginModalMocks,
    setUserAuthState,
    setUserEmail,
    setUserPassword,
    setUserPasswordRepeat,
} from './LoginModalTestHelpers';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

const mockDispatch = jest.fn();
let mockReturnedStateValue = jest.fn();

function mockUseDispatch() {
    return mockDispatch;
}

function mockUseSelector() {
    return mockReturnedStateValue();
}

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: mockUseDispatch,
    useSelector: mockUseSelector,
}));

function mockLoginModalState(mockState: any) {
    mockReturnedStateValue = jest.fn().mockImplementation(() => {
        return mockState;
    });
}

function mockLoginModalUseStates(
    initialUserAuthState: UserAuthState,
    initialUserEmail: string = '',
    userPassword: string = '',
    userPasswordRepeat: string = '',
) {
    React.useState = jest
        .fn()
        .mockImplementationOnce(() => [initialUserAuthState, setUserAuthState])
        .mockImplementationOnce(() => [initialUserEmail, setUserEmail])
        .mockImplementationOnce(() => [userPassword, setUserPassword])
        .mockImplementationOnce(() => [userPasswordRepeat, setUserPasswordRepeat]);
}

const store = configureTestStore();

const componentWithStoreProvider = (
    <Provider store={store}>
        <LoginModal />
    </Provider>
);

describe('LoginModal snapshot tests', () => {
    it('should match the snapshot at user welcome stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.WELCOME,
        });

        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.MAIL_INPUT,
        });
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at login stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.LOGIN,
        });
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password reset stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.LOGIN_PASSWORD_RESET,
        });
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP for login stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.LOGIN_OTP,
        });
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for login stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.LOGIN_OTP_LOADING,
        });
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password creation stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.SIGNUP_PASSWORD,
        });
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.SIGNUP_OTP,
        });
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for sign up stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.SIGNUP_OTP_LOADING,
        });
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });
});

// TODO extract welcome component and move it and its tests to a separate file
describe('LoginModal action tests - welcome stage', () => {
    beforeEach(() => {
        resetLoginModalMocks();
        mockDispatch.mockReset();
    });

    it('should transition to email input from welcome state', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.WELCOME,
        });
        const { container } = render(componentWithStoreProvider);

        const registerButton = getByText(container, 'accountRegister');
        fireEvent.click(registerButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('accountRegister'));
    });

    it('should transition to login from welcome state', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.WELCOME,
        });
        const { container } = render(componentWithStoreProvider);

        const loginButton = getByText(container, 'accountLogin');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('accountLogin'));
    });
});

describe('LoginModal go back button click actions', () => {
    beforeEach(() => {
        resetLoginModalMocks();
    });

    it.each([
        // From mail input to welcome
        [UserAuthState.MAIL_INPUT, UserAuthState.WELCOME],

        // From password input to mail input
        [UserAuthState.LOGIN, UserAuthState.MAIL_INPUT],

        // From password reset to login
        [UserAuthState.LOGIN_PASSWORD_RESET, UserAuthState.LOGIN],

        // From password creation to mail input
        [UserAuthState.SIGNUP_PASSWORD, UserAuthState.MAIL_INPUT],
    ])('should go back from state %s to %s state on go back button click', (goBackClickedState, goBackToState) => {
        mockLoginModalUseStates(goBackClickedState);
        const { container } = render(componentWithStoreProvider);

        const goBackButton = getByTestId(container, 'goBackButton');
        fireEvent.click(goBackButton);

        expect(setUserAuthState).toHaveBeenNthCalledWith(1, goBackToState);
    });
});
