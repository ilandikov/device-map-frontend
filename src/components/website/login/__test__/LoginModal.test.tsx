/* External dependencies */
import React from 'react';
import { Provider } from 'react-redux';
import { fireEvent, getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom';

/* Local dependencies */
import { configureTestStore } from '../../../../../tests/utils';
import { LoginModal } from '../LoginModal';
import { loginModalButtonClick } from '../redux/actions';
import { mockDispatch, mockLoginModalState, mockPrepareSelector } from '../redux/__mocks__/LoginModalState';
import { UserAuthState } from '../redux/state';
import { renderAsJSON } from './LoginModalTestHelpers';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));
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
            userEmail: '',
            userAuthState: UserAuthState.MAIL_INPUT,
        });
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at login stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.LOGIN,
            userEmail: '',
        });
        const component = renderAsJSON(componentWithStoreProvider);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password reset stage', () => {
        mockLoginModalState({
            userAuthState: UserAuthState.LOGIN_PASSWORD_RESET,
            userEmail: '',
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

describe('LoginModal action tests - welcome stage', () => {
    beforeEach(() => {
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
