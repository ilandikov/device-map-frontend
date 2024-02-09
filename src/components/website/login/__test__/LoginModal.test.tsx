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
import { userAuthStateFromUserEmail } from '../UserAuthStateUtils';

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
    initialUserEmail: string,
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
        <LoginModal />
    </Provider>
);

describe('LoginModal snapshot tests', () => {
    function renderComponentAsJSON() {
        return renderer.create(componentWithStoreProvider).toJSON();
    }

    it('should match the snapshot at user welcome stage', () => {
        mockUseUserAuthState(UserAuthState.WELCOME, '');
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockUseUserAuthState(UserAuthState.MAIL_INPUT_START, '');
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists stage', () => {
        mockUseUserAuthState(UserAuthState.MAIL_ALREADY_EXISTS, '');
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid stage', () => {
        mockUseUserAuthState(UserAuthState.MAIL_NOT_VALID, '');
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password input stage', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '');
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password not match stage', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION_MATCH_ERROR, '');
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password input stage', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_INPUT, '');
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockUseUserAuthState(UserAuthState.OTP_INPUT, '');
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });
});

describe('LoginModal action tests', () => {
    it('should call setting the new state from welcome to email input', () => {
        mockUseUserAuthState(UserAuthState.WELCOME, '');
        const { container } = render(componentWithStoreProvider);

        const registerButton = getByText(container, 'accountRegister');
        fireEvent.click(registerButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.MAIL_INPUT_START);
    });

    it('should call email setter from email input', () => {
        mockUseUserAuthState(UserAuthState.MAIL_INPUT_START, '');
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
        mockUseUserAuthState(UserAuthState.MAIL_ALREADY_EXISTS, '');
        const { container } = render(componentWithStoreProvider);
        const loginButton = getByText(container, 'accountLogin');

        expect(loginButton).toBeInTheDocument();
        fireEvent.click(loginButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.PASSWORD_INPUT);
    });

    it('should update the user email on input on password input stage', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_INPUT, '');
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

    it('should update user password when typed', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '');
        const { container } = render(componentWithStoreProvider);
        const userPasswordInput = getByTestId(container, 'userPassword');

        expect(userPasswordInput).toBeInTheDocument();
        fireEvent.change(userPasswordInput, { target: { value: 'verySecurePassword1' } });

        expect(setUserPassword).toHaveBeenCalledWith('verySecurePassword1');
    });

    it('should update repeated user password when typed', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '');
        const { container } = render(componentWithStoreProvider);
        const userPasswordRepeatInput = getByTestId(container, 'userPasswordRepeat');

        expect(userPasswordRepeatInput).toBeInTheDocument();
        fireEvent.change(userPasswordRepeatInput, { target: { value: 'evenBetterPassword' } });

        expect(setUserPasswordRepeat).toHaveBeenCalledWith('evenBetterPassword');
    });

    it('should call password verification when next button is pressed', () => {
        const spyOnUserAuthStateFromUserPasswords = jest.spyOn(userAuthStateUtils, 'userStateFromUserPasswords');

        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '', 'passwordOne', 'PasswordTwo');
        const { container } = render(componentWithStoreProvider);

        const tryVerifyPasswordsButton = getByText(container, 'next');

        expect(tryVerifyPasswordsButton).toBeInTheDocument();
        fireEvent.click(tryVerifyPasswordsButton);

        expect(spyOnUserAuthStateFromUserPasswords).toHaveBeenCalledWith('passwordOne', 'PasswordTwo');
    });

    /** TODO
     * This test now tests calling setUserAuthState() which is ONE OF THE ENDPOINTS
     * of the callback on the button. Instead this test should be testing a dispatch
     * of the action from the button.
     */
    it('should call password verifier when password shall be created', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '', 'securePassword', 'securePassword');
        const { container } = render(componentWithStoreProvider);
        const tryStoreUserPasswordButton = getByText(container, 'next');

        expect(tryStoreUserPasswordButton).toBeInTheDocument();
        fireEvent.click(tryStoreUserPasswordButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.OTP_INPUT);
    });

    it('should call password verifier when password shall be created', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '', 'onePassword', 'anotherPassword');
        const { container } = render(componentWithStoreProvider);
        const tryStoreUserPasswordButton = getByText(container, 'next');

        expect(tryStoreUserPasswordButton).toBeInTheDocument();
        fireEvent.click(tryStoreUserPasswordButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.PASSWORD_CREATION_MATCH_ERROR);
    });

    it.failing('should show error if password has not been input or it is an empty string', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '', '', '');
        const { container } = render(componentWithStoreProvider);
        const tryStoreUserPasswordButton = getByText(container, 'next');

        expect(tryStoreUserPasswordButton).toBeInTheDocument();
        fireEvent.click(tryStoreUserPasswordButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.PASSWORD_CREATION_MATCH_ERROR);
    });

    it.each([0, 1, 2, 3, 4, 5])('should enter numeric characters in OTP input number %i', (inputIndex) => {
        mockUseUserAuthState(UserAuthState.OTP_INPUT, '');
        const { container } = render(componentWithStoreProvider);
        const OTPInput = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

        expect(OTPInput).toBeInTheDocument();
        fireEvent.change(OTPInput, { target: { value: `${inputIndex}` } });

        expect(OTPInput.value).toEqual(`${inputIndex}`);
    });

    it.each([0, 1, 2, 3, 4, 5])('should not enter non numeric characters in OTP input number %i', (inputIndex) => {
        mockUseUserAuthState(UserAuthState.OTP_INPUT, '');
        const { container } = render(componentWithStoreProvider);
        const OTPInput = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

        expect(OTPInput).toBeInTheDocument();
        fireEvent.change(OTPInput, { target: { value: 'a' } });

        expect(OTPInput.value).toEqual('');
    });

    it.each([0, 1, 2, 3, 4])(
        'should focus on next input element when a digit is input for input %i (Only the first 5 inputs, index=0...4)',
        (inputIndex) => {
            mockUseUserAuthState(UserAuthState.OTP_INPUT, '');
            const { container } = render(componentWithStoreProvider);
            const OTPInput = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

            expect(OTPInput).toBeInTheDocument();
            OTPInput.focus();
            fireEvent.change(OTPInput, { target: { value: '1' } });

            const nextOTPInput = getByTestId(container, `OTPInput${inputIndex + 1}`) as HTMLInputElement;
            expect(nextOTPInput).toBeInTheDocument();
            expect(nextOTPInput).toHaveFocus();
        },
    );

    it('should focus on "next" button when a digit is input for last input (index = 5)', () => {
        mockUseUserAuthState(UserAuthState.OTP_INPUT, '');
        const { container } = render(componentWithStoreProvider);
        const OTPInput = getByTestId(container, 'OTPInput5') as HTMLInputElement;

        expect(OTPInput).toBeInTheDocument();
        OTPInput.focus();
        fireEvent.change(OTPInput, { target: { value: '1' } });

        const nextButton = getByText(container, 'next');

        expect(nextButton).toBeInTheDocument();
        expect(nextButton).toHaveFocus();
    });

    it.each([0, 1, 2, 3, 4, 5])(
        'should rewrite an existing value that has already been input in OTP input number %i',
        (inputIndex) => {
            mockUseUserAuthState(UserAuthState.OTP_INPUT, '');
            const { container } = render(componentWithStoreProvider);
            const OTPInput = getByTestId(container, `OTPInput${inputIndex}`) as HTMLInputElement;

            expect(OTPInput).toBeInTheDocument();
            fireEvent.change(OTPInput, { target: { value: '3' } });
            expect(OTPInput.value).toEqual('3');

            OTPInput.focus();
            expect(OTPInput.value).toEqual('');
        },
    );

    it('should focus on the next empty input after a digit has been input', () => {
        mockUseUserAuthState(UserAuthState.OTP_INPUT, '');
        const { container } = render(componentWithStoreProvider);
        const OTPInput0 = getByTestId(container, 'OTPInput0') as HTMLInputElement;
        const OTPInput1 = getByTestId(container, 'OTPInput1') as HTMLInputElement;
        const OTPInput2 = getByTestId(container, 'OTPInput2') as HTMLInputElement;
        const OTPInput3 = getByTestId(container, 'OTPInput3') as HTMLInputElement;
        fireEvent.change(OTPInput1, { target: { value: '1' } });
        fireEvent.change(OTPInput2, { target: { value: '2' } });

        OTPInput0.focus();
        fireEvent.change(OTPInput0, { target: { value: '1' } });

        expect(OTPInput3).toHaveFocus();
    });
});

describe('user email logic tests', () => {
    it('should move to password creation when new email is presented', () => {
        const email = 'good@email.com';

        const newUserState = userAuthStateFromUserEmail(email);

        expect(newUserState).toEqual(UserAuthState.PASSWORD_CREATION);
    });

    it('should move to email not valid stage when a bad email is presented', () => {
        const email = 'this is not an email!';

        const newUserState = userAuthStateFromUserEmail(email);

        expect(newUserState).toEqual(UserAuthState.MAIL_NOT_VALID);
    });

    it('should move to email already exists stage when already existing mail is presented', () => {
        const email = 'already@exists.com';

        const newUserState = userAuthStateFromUserEmail(email);

        expect(newUserState).toEqual(UserAuthState.MAIL_ALREADY_EXISTS);
    });
});
