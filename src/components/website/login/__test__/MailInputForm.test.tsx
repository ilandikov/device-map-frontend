import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { UserAuthState } from '../LoginModal';
import * as userAuthStateUtils from '../UserAuthStateUtils';
import { configureTestStore } from '../../../../../tests/utils';
import { MailInputForm } from '../MailInputForm';
import { mockLoginModalHooks } from './LoginModalTestHelpers';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

const { setUserAuthState, setUserEmail } = mockLoginModalHooks();

const store = configureTestStore();

function componentWithStoreProvider(userAuthState: UserAuthState, userEmail: string) {
    return render(
        <Provider store={store}>
            <MailInputForm
                {...{
                    userAuthState,
                    setUserAuthState,
                    userEmail,
                    setUserEmail,
                }}
            />
        </Provider>,
    );
}

describe('MailInputForm action tests', () => {
    it('should call email setter from email input', () => {
        const { container } = componentWithStoreProvider(UserAuthState.MAIL_INPUT_START, '');

        const emailInput = getByTestId(container, 'emailInput');

        expect(emailInput).toBeInTheDocument();
        fireEvent.change(emailInput, { target: { value: 'new@email.com' } });

        expect(setUserEmail).toHaveBeenCalledWith('new@email.com');
    });

    it('should call email verification after mail has been sent to input', () => {
        const spyOnUserAuthStateFromUserEmail = jest.spyOn(userAuthStateUtils, 'userAuthStateFromUserEmail');

        const { container } = componentWithStoreProvider(UserAuthState.MAIL_INPUT_START, 'new@email.com');

        const tryVerifyEmailButton = getByText(container, 'next');

        expect(tryVerifyEmailButton).toBeInTheDocument();
        fireEvent.click(tryVerifyEmailButton);

        expect(spyOnUserAuthStateFromUserEmail).toHaveBeenCalledWith('new@email.com');
    });

    it('should move from mail already exists to password verification stage', () => {
        const { container } = componentWithStoreProvider(UserAuthState.MAIL_ALREADY_EXISTS, '');
        const loginButton = getByText(container, 'accountLogin');

        expect(loginButton).toBeInTheDocument();
        fireEvent.click(loginButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.PASSWORD_INPUT);
    });
});
