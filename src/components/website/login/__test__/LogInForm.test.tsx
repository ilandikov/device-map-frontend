import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureTestStore } from '../../../../../tests/utils';
import { LogInForm } from '../LogInForm';
import { UserAuthState } from '../UserAuthStateUtils';
import { createEvent } from '../../TestHelpers';
import {
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalButtonClick,
    loginModalInput,
    loginModalVerifyRequest,
} from '../actions';
import { setUserAuthState, setUserEmail, setUserPassword } from './LoginModalTestHelpers';
import { mockDispatch, mockLoginModalState, mockPrepareSelector } from './__mocks__/LoginModalState';

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

function componentWithStoreProvider(
    userAuthState: UserAuthState,
    userEmail: string,
    userPassword: string,
    userPasswordRepeat: string,
) {
    return render(
        <Provider store={store}>
            <LogInForm
                {...{
                    userAuthState,
                    setUserAuthState,
                    userEmail,
                    setUserEmail,
                    userPassword,
                    setUserPassword,
                    userPasswordRepeat,
                }}
            />
        </Provider>,
    );
}

describe('LogInForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should update the user email on input on password input stage', () => {
        mockLoginModalState({ userAuthState: UserAuthState.LOGIN });
        const { container } = componentWithStoreProvider(UserAuthState.LOGIN, '', '', '');

        const emailInput = getByTestId(container, 'emailInput');
        fireEvent.change(emailInput, createEvent('hereIsMyMail@server.com'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputTypes.USER_EMAIL, 'hereIsMyMail@server.com'),
        );
    });

    it('should show the already input email on password input stage', () => {
        mockLoginModalState({ userEmail: 'here_is_my@email.com' });
        const { container } = componentWithStoreProvider(UserAuthState.LOGIN, 'here_is_my@email.com', '', '');

        const emailInput = getByTestId(container, 'emailInput') as HTMLInputElement;

        expect(emailInput.value).toEqual('here_is_my@email.com');
    });

    it('should update user password when typed', () => {
        const { container } = componentWithStoreProvider(UserAuthState.LOGIN, 'user@email.com', '', '');

        const userPasswordInput = getByTestId(container, 'userPasswordLogin');
        fireEvent.change(userPasswordInput, createEvent('strongPassword'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputTypes.USER_PASSWORD, 'strongPassword'),
        );
    });

    it('should call user authentication when next button is pressed', () => {
        const { container } = componentWithStoreProvider(
            UserAuthState.SIGNUP_PASSWORD,
            'user@mail.com',
            'aPassword',
            '',
        );

        const tryVerifyPasswordsButton = getByText(container, 'next');
        fireEvent.click(tryVerifyPasswordsButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL_AND_PASSWORD),
        );
    });

    it('should transition to password reset state when reset button was clicked', () => {
        const { container } = componentWithStoreProvider(UserAuthState.LOGIN, 'user@email.com', '', '');

        const resetPasswordButton = getByText(container, 'resetPassword');
        fireEvent.click(resetPasswordButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('resetPassword'));
    });
});
