/* External dependencies */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom';

/* Local dependencies */
import { configureTestStore } from '../../../../../tests/utils';
import { LoginModal, UserAuthState } from '../LoginModal';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

let setUserAuthState: jest.Mock;
let setUserEmail: jest.Mock;
let setUserPasswordA: jest.Mock;
let setUserPasswordB: jest.Mock;
function mockUseUserAuthState(initialUserAuthState: UserAuthState, initialUserEmail: string) {
    setUserAuthState = jest.fn();
    setUserAuthState.mockImplementation((userAuthState) => userAuthState);
    setUserEmail = jest.fn();
    setUserEmail.mockImplementation((userEmail) => userEmail);
    setUserPasswordA = jest.fn();
    setUserPasswordA.mockImplementation((userEmail) => userEmail);
    setUserPasswordB = jest.fn();
    setUserPasswordB.mockImplementation((userEmail) => userEmail);
    React.useState = jest
        .fn()
        .mockImplementationOnce(() => [initialUserAuthState, setUserAuthState])
        .mockImplementationOnce(() => [initialUserEmail, setUserEmail])
        .mockImplementationOnce(() => ['', setUserPasswordA])
        .mockImplementationOnce(() => ['', setUserPasswordB]);
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

    /** TODO
     * This test now tests calling setUserAuthState() which is ONE OF THE ENDPOINTS
     * of the callback on the button. Instead this test should be testing a dispatch
     * of the action from the button.
     */
    it('should call email verification after mail has been sent to input', () => {
        mockUseUserAuthState(UserAuthState.MAIL_INPUT_START, 'new@email.com');
        const { container } = render(componentWithStoreProvider);

        const tryVerifyEmailButton = getByText(container, 'next');

        expect(tryVerifyEmailButton).toBeInTheDocument();
        fireEvent.click(tryVerifyEmailButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.PASSWORD_CREATION);
    });

    it('should move from mail already exists to password verification stage', () => {
        mockUseUserAuthState(UserAuthState.MAIL_ALREADY_EXISTS, '');
        const { container } = render(componentWithStoreProvider);
        const loginButton = getByText(container, 'accountLogin');

        expect(loginButton).toBeInTheDocument();
        fireEvent.click(loginButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.PASSWORD_CREATION);
    });

    it('should update password A when typed', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '');
        const { container } = render(componentWithStoreProvider);
        const userPasswordAInput = getByTestId(container, 'userPasswordA');

        expect(userPasswordAInput).toBeInTheDocument();
        fireEvent.change(userPasswordAInput, { target: { value: 'verySecurePassword1' } });

        expect(setUserPasswordA).toHaveBeenCalledWith('verySecurePassword1');
    });

    it('should update password B when typed', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '');
        const { container } = render(componentWithStoreProvider);
        const userPasswordBInput = getByTestId(container, 'userPasswordB');

        expect(userPasswordBInput).toBeInTheDocument();
        fireEvent.change(userPasswordBInput, { target: { value: 'evenBetterPassword' } });

        expect(setUserPasswordB).toHaveBeenCalledWith('evenBetterPassword');
    });

    /** TODO
     * This test now tests calling setUserAuthState() which is ONE OF THE ENDPOINTS
     * of the callback on the button. Instead this test should be testing a dispatch
     * of the action from the button.
     */
    it('should call password verifier when password shall be created', () => {
        mockUseUserAuthState(UserAuthState.PASSWORD_CREATION, '');
        const { container } = render(componentWithStoreProvider);
        const tryStoreUserPasswordButton = getByText(container, 'next');

        expect(tryStoreUserPasswordButton).toBeInTheDocument();
        fireEvent.click(tryStoreUserPasswordButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.OTP_INPUT);
    });
});
