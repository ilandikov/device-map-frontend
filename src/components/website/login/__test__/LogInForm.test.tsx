import { fireEvent, getByTestId, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
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
