import { fireEvent, getByTestId, getByText, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { MailInputError } from '../UserAuthStateUtils';
import { configureTestStore } from '../../../../../tests/utils';
import { MailInputForm } from '../MailInputForm';
import { createEvent } from '../../TestHelpers';
import {
    LoginModalInputTypes,
    LoginModalVerifyTypes,
    loginModalButtonClick,
    loginModalInput,
    loginModalVerifyRequest,
} from '../actions';
import { renderAsJSON, resetLoginModalMocks, setUserAuthState, setUserEmail } from './LoginModalTestHelpers';
import { mockDispatch, mockLoginModalState, mockPrepareSelector } from './__mocks__/LoginModalState';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

const store = configureTestStore();

function componentWithStoreProvider(userEmail: string) {
    return (
        <Provider store={store}>
            <MailInputForm
                {...{
                    setUserAuthState,
                    userEmail,
                    setUserEmail,
                }}
            />
        </Provider>
    );
}

let setMailInputError: jest.Mock;

function mockMailInputErrorUseState(initialMailInputError: Error | null) {
    mockLoginModalState({ userEmailError: initialMailInputError });
}

function resetHookMock() {
    setMailInputError = jest.fn().mockImplementation((error) => error);
}

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

describe('MailInputForm snapshot tests', () => {
    beforeEach(() => {
        resetHookMock();
    });

    it('should match the snapshot without error', () => {
        mockMailInputErrorUseState(null);
        const component = renderAsJSON(componentWithStoreProvider(''));

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists error', () => {
        mockMailInputErrorUseState(new Error(MailInputError.ALREADY_EXISTS));
        const component = renderAsJSON(componentWithStoreProvider(''));

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid error', () => {
        mockMailInputErrorUseState(new Error(MailInputError.NOT_VALID));
        const component = renderAsJSON(componentWithStoreProvider(''));

        expect(component).toMatchSnapshot();
    });
});

describe('MailInputForm action tests', () => {
    beforeEach(() => {
        resetHookMock();
        resetLoginModalMocks();
        mockDispatch.mockReset();
    });

    it('should call email setter from email input', () => {
        mockMailInputErrorUseState(null);
        const { container } = render(componentWithStoreProvider(''));

        const emailInput = getByTestId(container, 'emailInput');

        fireEvent.change(emailInput, createEvent('new@email.com'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputTypes.USER_EMAIL, 'new@email.com'),
        );
    });

    it('should call email verification, update mail error and transition to password creation after mail has been sent to input', () => {
        mockMailInputErrorUseState(null);
        const { container } = render(componentWithStoreProvider('new@email.com'));

        const tryVerifyEmailButton = getByText(container, 'next');

        fireEvent.click(tryVerifyEmailButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL));
    });

    it('should move from mail already exists to password verification stage', () => {
        mockMailInputErrorUseState(new Error(MailInputError.ALREADY_EXISTS));
        const { container } = render(componentWithStoreProvider(''));
        const loginButton = getByText(container, 'accountLogin');

        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('accountLogin'));
    });
});
