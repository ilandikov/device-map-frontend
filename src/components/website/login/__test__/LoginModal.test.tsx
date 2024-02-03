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
function mockUseUserAuthState(initialUserAuthState: UserAuthState, initialUserEmail: string) {
    setUserAuthState = jest.fn();
    setUserAuthState.mockImplementation((userAuthState) => userAuthState);
    setUserEmail = jest.fn();
    setUserEmail.mockImplementation((userEmail) => userEmail);
    React.useState = jest
        .fn()
        .mockImplementationOnce(() => [initialUserAuthState, setUserAuthState])
        .mockImplementationOnce(() => [initialUserEmail, setUserEmail])
        .mockImplementation((x) => [x, jest.fn()]);
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
        mockUseUserAuthState(UserAuthState.MAIL_INPUT_START, 'new@email.com');
        const { container } = render(componentWithStoreProvider);

        const tryVerifyEmailButton = getByText(container, 'next');

        expect(tryVerifyEmailButton).toBeInTheDocument();
        fireEvent.click(tryVerifyEmailButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.PASSWORD_INPUT);
    });
});
