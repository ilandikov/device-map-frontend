/* External dependencies */
import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { fireEvent, getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom';

/* Local dependencies */
import { configureTestStore } from '../../../../../tests/utils';
import { LoginModal, UserAuthState } from '../LoginModal';
import { mockLoginModalHooks } from './LoginModalTestHelpers';

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
    function renderComponentAsJSON() {
        return renderer.create(componentWithStoreProvider).toJSON();
    }

    it('should match the snapshot at user welcome stage', () => {
        mockLoginModalUseStates(UserAuthState.WELCOME);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockLoginModalUseStates(UserAuthState.MAIL_INPUT_START);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists stage', () => {
        mockLoginModalUseStates(UserAuthState.MAIL_ALREADY_EXISTS, '');
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid stage', () => {
        mockLoginModalUseStates(UserAuthState.MAIL_NOT_VALID);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password input stage', () => {
        mockLoginModalUseStates(UserAuthState.PASSWORD_CREATION);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password not match stage', () => {
        mockLoginModalUseStates(UserAuthState.PASSWORD_CREATION_MATCH_ERROR);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at password input stage', () => {
        mockLoginModalUseStates(UserAuthState.PASSWORD_INPUT);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP input stage', () => {
        mockLoginModalUseStates(UserAuthState.OTP_INPUT);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at OTP loading stage', () => {
        mockLoginModalUseStates(UserAuthState.OTP_LOADING);
        const component = renderComponentAsJSON();

        expect(component).toMatchSnapshot();
    });
});

describe('LoginModal action tests - welcome stage', () => {
    beforeEach(() => {
        const hooks = mockLoginModalHooks();
        setUserAuthState = hooks.setUserAuthState;
        setUserEmail = hooks.setUserEmail;
        setUserPassword = hooks.setUserPassword;
        setUserPasswordRepeat = hooks.setUserPasswordRepeat;
    });

    it('should call setting the new state from welcome to email input', () => {
        mockLoginModalUseStates(UserAuthState.WELCOME);
        const { container } = render(componentWithStoreProvider);

        const registerButton = getByText(container, 'accountRegister');
        fireEvent.click(registerButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.MAIL_INPUT_START);
    });
});
