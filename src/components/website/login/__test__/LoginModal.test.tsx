/* External dependencies */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom';

/* Local dependencies */
import { configureTestStore } from '../../../../../tests/utils';
import { LoginModal, UserAuthState } from '../LoginModal';
import {
    resetHookMocks,
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
    function renderComponentAsJSON(component: React.ReactElement) {
        return renderer.create(component).toJSON();
    }

    it('should match the snapshot at user welcome stage', () => {
        mockLoginModalUseStates(UserAuthState.WELCOME);
        const component = renderComponentAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockLoginModalUseStates(UserAuthState.MAIL_INPUT);
        const component = renderComponentAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists stage', () => {
        mockLoginModalUseStates(UserAuthState.MAIL_INPUT_ERROR_EXISTENCE, '');
        const component = renderComponentAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid stage', () => {
        mockLoginModalUseStates(UserAuthState.MAIL_INPUT_ERROR_VALIDITY);
        const component = renderComponentAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password input stage', () => {
        mockLoginModalUseStates(UserAuthState.SIGNUP_PASSWORD);
        const component = renderComponentAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password not match stage', () => {
        mockLoginModalUseStates(UserAuthState.SIGNUP_PASSWORD_ERROR);
        const component = renderComponentAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password input stage', () => {
        mockLoginModalUseStates(UserAuthState.LOGIN);
        const component = renderComponentAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password input stage', () => {
        mockLoginModalUseStates(UserAuthState.LOGIN_PASSWORD_RESET);
        const component = renderComponentAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockLoginModalUseStates(UserAuthState.SIGNUP_OTP);
        const component = renderComponentAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP loading stage', () => {
        mockLoginModalUseStates(UserAuthState.SIGNUP_OTP_LOADING);
        const component = renderComponentAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });
});

describe('LoginModal action tests - welcome stage', () => {
    beforeEach(() => {
        resetHookMocks();
    });

    it('should transition to email input from welcome state', () => {
        mockLoginModalUseStates(UserAuthState.WELCOME);
        const { container } = render(componentWithStoreProvider);

        const registerButton = getByText(container, 'accountRegister');
        fireEvent.click(registerButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.MAIL_INPUT);
    });

    it('should transition to login from welcome state', () => {
        mockLoginModalUseStates(UserAuthState.WELCOME);
        const { container } = render(componentWithStoreProvider);

        const loginButton = getByText(container, 'accountLogin');
        fireEvent.click(loginButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.LOGIN);
    });
});

describe('LoginModal go back button click actions', () => {
    beforeEach(() => {
        resetHookMocks();
    });

    it.each([
        // From mail input to welcome
        [UserAuthState.MAIL_INPUT, UserAuthState.WELCOME],
        [UserAuthState.MAIL_INPUT_ERROR_EXISTENCE, UserAuthState.WELCOME],
        [UserAuthState.MAIL_INPUT_ERROR_VALIDITY, UserAuthState.WELCOME],

        // From password input to mail input
        [UserAuthState.LOGIN, UserAuthState.MAIL_INPUT],

        // From password reset to login
        [UserAuthState.LOGIN_PASSWORD_RESET, UserAuthState.LOGIN],

        // From password creation to mail input
        [UserAuthState.SIGNUP_PASSWORD, UserAuthState.MAIL_INPUT],
        [UserAuthState.SIGNUP_PASSWORD_ERROR, UserAuthState.MAIL_INPUT],
    ])('should go back from state %s to %s state on go back button click', (goBackClickedState, goBackToState) => {
        mockLoginModalUseStates(goBackClickedState);
        const { container } = render(componentWithStoreProvider);

        const goBackButton = getByTestId(container, 'goBackButton');
        expect(goBackButton).toBeInTheDocument();
        fireEvent.click(goBackButton);

        expect(setUserAuthState).toHaveBeenCalledWith(goBackToState);
    });
});
