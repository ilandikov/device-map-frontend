/* External dependencies */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { fireEvent, getByText, render } from '@testing-library/react';
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
        <LoginModal />
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
