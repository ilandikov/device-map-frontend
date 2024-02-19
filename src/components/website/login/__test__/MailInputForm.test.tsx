import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { UserAuthState } from '../LoginModal';
import * as userAuthStateUtils from '../UserAuthStateUtils';
import { configureTestStore } from '../../../../../tests/utils';
import { MailInputForm } from '../MailInputForm';
import { renderAsJSON, resetHookMocks, setUserAuthState, setUserEmail } from './LoginModalTestHelpers';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

const store = configureTestStore();

function componentWithStoreProvider(userAuthState: UserAuthState, userEmail: string) {
    return (
        <Provider store={store}>
            <MailInputForm
                {...{
                    userAuthState,
                    setUserAuthState,
                    userEmail,
                    setUserEmail,
                }}
            />
        </Provider>
    );
}

function renderComponent(userAuthState: UserAuthState, userEmail: string) {
    return render(componentWithStoreProvider(userAuthState, userEmail));
}

describe('MailInputForm snapshot tests', () => {
    beforeEach(() => {
        resetHookMocks();
    });

    it('should match the snapshot at mail input stage', () => {
        const component = renderAsJSON(componentWithStoreProvider(UserAuthState.MAIL_INPUT, ''));

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists stage', () => {
        const component = renderAsJSON(componentWithStoreProvider(UserAuthState.MAIL_INPUT_ERROR_EXISTENCE, ''));

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid stage', () => {
        const component = renderAsJSON(componentWithStoreProvider(UserAuthState.MAIL_INPUT_ERROR_VALIDITY, ''));

        expect(component).toMatchSnapshot();
    });
});

describe('MailInputForm action tests', () => {
    beforeEach(() => {
        resetHookMocks();
    });

    it('should call email setter from email input', () => {
        const { container } = renderComponent(UserAuthState.MAIL_INPUT, '');

        const emailInput = getByTestId(container, 'emailInput');

        expect(emailInput).toBeInTheDocument();
        fireEvent.change(emailInput, { target: { value: 'new@email.com' } });

        expect(setUserEmail).toHaveBeenCalledWith('new@email.com');
    });

    it('should call email verification after mail has been sent to input', () => {
        const spyOnUserAuthStateFromUserEmail = jest.spyOn(userAuthStateUtils, 'userAuthStateFromUserEmail');

        const { container } = renderComponent(UserAuthState.MAIL_INPUT, 'new@email.com');

        const tryVerifyEmailButton = getByText(container, 'next');

        expect(tryVerifyEmailButton).toBeInTheDocument();
        fireEvent.click(tryVerifyEmailButton);

        expect(spyOnUserAuthStateFromUserEmail).toHaveBeenCalledWith('new@email.com');
    });

    it('should move from mail already exists to password verification stage', () => {
        const { container } = renderComponent(UserAuthState.MAIL_INPUT_ERROR_EXISTENCE, '');
        const loginButton = getByText(container, 'accountLogin');

        expect(loginButton).toBeInTheDocument();
        fireEvent.click(loginButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.LOGIN);
    });
});
