/* External dependencies */
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom';

/* Local dependencies */
import { configureTestStore } from '../../../../../tests/utils';
import { LoginModal } from '../LoginModal';
import { UserAuthState } from '../UserAuthStateUtils';
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
jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
}));

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
        mockLoginModalUseStates(UserAuthState.WELCOME);
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockLoginModalUseStates(UserAuthState.MAIL_INPUT);
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at login stage', () => {
        mockLoginModalUseStates(UserAuthState.LOGIN);
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password reset stage', () => {
        mockLoginModalUseStates(UserAuthState.LOGIN_PASSWORD_RESET);
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP for login stage', () => {
        mockLoginModalUseStates(UserAuthState.LOGIN_OTP);
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for login stage', () => {
        mockLoginModalUseStates(UserAuthState.LOGIN_OTP_LOADING);
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password creation stage', () => {
        mockLoginModalUseStates(UserAuthState.SIGNUP_PASSWORD);
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockLoginModalUseStates(UserAuthState.SIGNUP_OTP);
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP checking for sign up stage', () => {
        mockLoginModalUseStates(UserAuthState.SIGNUP_OTP_LOADING);
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });
});

describe('LoginModal action tests - welcome stage', () => {
    beforeEach(() => {
        resetLoginModalMocks();
        mockDispatch.mockReset();
    });

    it('should transition to email input from welcome state', () => {
        mockLoginModalUseStates(UserAuthState.WELCOME);
        const { container } = render(componentWithStoreProvider);

        const registerButton = getByText(container, 'accountRegister');
        fireEvent.click(registerButton);

        expect(setUserAuthState).toHaveBeenNthCalledWith(1, UserAuthState.MAIL_INPUT);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'buttonClicked', button: 'accountRegister' });
    });

    it('should transition to login from welcome state', () => {
        mockLoginModalUseStates(UserAuthState.WELCOME);
        const { container } = render(componentWithStoreProvider);

        const loginButton = getByText(container, 'accountLogin');
        fireEvent.click(loginButton);

        expect(setUserAuthState).toHaveBeenNthCalledWith(1, UserAuthState.LOGIN);
        expect(mockDispatch).toHaveBeenNthCalledWith(1, { type: 'buttonClicked', button: 'accountLogin' });
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
