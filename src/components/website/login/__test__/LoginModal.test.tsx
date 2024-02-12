/* External dependencies */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom';

/* Local dependencies */
import { configureTestStore } from '../../../../../tests/utils';
import { LoginModal, UserAuthState } from '../LoginModal';
import * as userAuthStateUtils from '../UserAuthStateUtils';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

let setUserAuthState: jest.Mock;
let setUserEmail: jest.Mock;
let setUserPassword: jest.Mock;
let setUserPasswordRepeat: jest.Mock;
function mockUseUserAuthState(
    initialUserAuthState: UserAuthState,
    initialUserEmail: string = '',
    userPassword: string = '',
    userPasswordRepeat: string = '',
) {
    setUserAuthState = jest.fn();
    setUserAuthState.mockImplementation((userAuthState) => userAuthState);
    setUserEmail = jest.fn();
    setUserEmail.mockImplementation((userEmail) => userEmail);
    setUserPassword = jest.fn();
    setUserPassword.mockImplementation((userEmail) => userEmail);
    setUserPasswordRepeat = jest.fn();
    setUserPasswordRepeat.mockImplementation((userEmail) => userEmail);
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
        <div className="login-modal-container">
            <div className="login-modal">
                <div className="login-modal-content-container">
                    <LoginModal />
                </div>
            </div>
        </div>
    </Provider>
);

describe('LoginModal snapshot tests', () => {
    function renderComponentAsJSON() {
        return renderer.create(componentWithStoreProvider).toJSON();
    }

    it('should match the snapshot at user welcome stage', () => {
        mockUseUserAuthState(UserAuthState.WELCOME);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockUseUserAuthState(UserAuthState.MAIL_INPUT_START);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists stage', () => {
        mockUseUserAuthState(UserAuthState.MAIL_ALREADY_EXISTS, '');
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid stage', () => {
        mockUseUserAuthState(UserAuthState.MAIL_NOT_VALID);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password input stage', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password not match stage', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION_MATCH_ERROR);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password input stage', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_INPUT);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockUseUserAuthState(UserAuthState.OTP_INPUT);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP loading stage', () => {
        mockUseUserAuthState(UserAuthState.OTP_LOADING);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });
});

describe('LoginModal action tests - welcome stage', () => {
    it('should call setting the new state from welcome to email input', () => {
        mockUseUserAuthState(UserAuthState.WELCOME);
        const { container } = render(componentWithStoreProvider);

        const registerButton = getByText(container, 'accountRegister');
        fireEvent.click(registerButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.MAIL_INPUT_START);
    });
});

describe('LoginModal action tests - email stages', () => {
    it('should call email setter from email input', () => {
        mockUseUserAuthState(UserAuthState.MAIL_INPUT_START);
        const { container } = render(componentWithStoreProvider);

        const emailInput = getByTestId(container, 'emailInput');

        expect(emailInput).toBeInTheDocument();
        fireEvent.change(emailInput, { target: { value: 'new@email.com' } });

        expect(setUserEmail).toHaveBeenCalledWith('new@email.com');
    });

    it('should call email verification after mail has been sent to input', () => {
        const spyOnUserAuthStateFromUserEmail = jest.spyOn(userAuthStateUtils, 'userAuthStateFromUserEmail');

        mockUseUserAuthState(UserAuthState.MAIL_INPUT_START, 'new@email.com');
        const { container } = render(componentWithStoreProvider);

        const tryVerifyEmailButton = getByText(container, 'next');

        expect(tryVerifyEmailButton).toBeInTheDocument();
        fireEvent.click(tryVerifyEmailButton);

        expect(spyOnUserAuthStateFromUserEmail).toHaveBeenCalledWith('new@email.com');
    });

    it('should move from mail already exists to password verification stage', () => {
        mockUseUserAuthState(UserAuthState.MAIL_ALREADY_EXISTS);
        const { container } = render(componentWithStoreProvider);
        const loginButton = getByText(container, 'accountLogin');

        expect(loginButton).toBeInTheDocument();
        fireEvent.click(loginButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.PASSWORD_INPUT);
    });
});

describe('LoginModal action tests - password input stages', () => {
    it('should update the user email on input on password input stage', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_INPUT);
        const { container } = render(componentWithStoreProvider);

        const emailInput = getByTestId(container, 'emailInput');
        expect(emailInput).toBeInTheDocument();

        fireEvent.change(emailInput, { target: { value: 'hereIsMyMail@server.com' } });
        expect(setUserEmail).toHaveBeenCalledWith('hereIsMyMail@server.com');
    });

    it('should show the already input email on password input stage', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_INPUT, 'here_is_my@email.com');
        const { container } = render(componentWithStoreProvider);
        const emailInput = getByTestId(container, 'emailInput');

        expect(emailInput).toBeInTheDocument();
        expect((emailInput as HTMLInputElement).value).toEqual('here_is_my@email.com');
    });
});

describe('LoginModal action tests - password creation stages', () => {
    it('should update user password when typed', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION);
        const { container } = render(componentWithStoreProvider);
        const userPasswordInput = getByTestId(container, 'userPassword');

        expect(userPasswordInput).toBeInTheDocument();
        fireEvent.change(userPasswordInput, { target: { value: 'verySecurePassword1' } });

        expect(setUserPassword).toHaveBeenCalledWith('verySecurePassword1');
    });

    it('should update repeated user password when typed', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION);
        const { container } = render(componentWithStoreProvider);
        const userPasswordRepeatInput = getByTestId(container, 'userPasswordRepeat');

        expect(userPasswordRepeatInput).toBeInTheDocument();
        fireEvent.change(userPasswordRepeatInput, { target: { value: 'evenBetterPassword' } });

        expect(setUserPasswordRepeat).toHaveBeenCalledWith('evenBetterPassword');
    });

    it('should call password verification when next button is pressed', () => {
        const spyOnUserAuthStateFromUserPasswords = jest.spyOn(userAuthStateUtils, 'userAuthStateFromUserPasswords');

        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '', 'passwordOne', 'PasswordTwo');
        const { container } = render(componentWithStoreProvider);

        const tryVerifyPasswordsButton = getByText(container, 'next');

        expect(tryVerifyPasswordsButton).toBeInTheDocument();
        fireEvent.click(tryVerifyPasswordsButton);

        expect(spyOnUserAuthStateFromUserPasswords).toHaveBeenCalledWith('passwordOne', 'PasswordTwo');
    });
});

// TODO after OTP button & input will be united in one component, this shall go to the tests of that component.
describe('LoginModal action tests - OTP stages', () => {
    it('should transition to loading from OTP stage', () => {
        mockUseUserAuthState(UserAuthState.OTP_INPUT);
        const { container } = render(componentWithStoreProvider);

        const nextButton = getByText(container, 'next');
        expect(nextButton).toBeInTheDocument();

        fireEvent.click(nextButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.OTP_LOADING);
    });
});
