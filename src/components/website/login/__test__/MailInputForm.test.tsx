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
import { renderAsJSON } from './LoginModalTestHelpers';
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

function componentWithStoreProvider() {
    return (
        <Provider store={store}>
            <MailInputForm />
        </Provider>
    );
}

describe('MailInputForm snapshot tests', () => {
    it('should match the snapshot without error', () => {
        mockLoginModalState({ userEmail: '', userEmailError: null });
        const component = renderAsJSON(componentWithStoreProvider());

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists error', () => {
        mockLoginModalState({ userEmail: '', userEmailError: new Error(MailInputError.ALREADY_EXISTS) });
        const component = renderAsJSON(componentWithStoreProvider());

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid error', () => {
        mockLoginModalState({ userEmail: '', userEmailError: new Error(MailInputError.NOT_VALID) });
        const component = renderAsJSON(componentWithStoreProvider());

        expect(component).toMatchSnapshot();
    });
});

describe('MailInputForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should call email setter from email input', () => {
        mockLoginModalState({ userEmailError: null });
        const { container } = render(componentWithStoreProvider());

        const emailInput = getByTestId(container, 'emailInput');

        fireEvent.change(emailInput, createEvent('new@email.com'));

        expect(mockDispatch).toHaveBeenNthCalledWith(
            1,
            loginModalInput(LoginModalInputTypes.USER_EMAIL, 'new@email.com'),
        );
    });

    it('should call email verification, update mail error and transition to password creation after mail has been sent to input', () => {
        mockLoginModalState({ userEmailError: null });
        const { container } = render(componentWithStoreProvider());

        const tryVerifyEmailButton = getByText(container, 'next');

        fireEvent.click(tryVerifyEmailButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalVerifyRequest(LoginModalVerifyTypes.USER_EMAIL));
    });

    it('should move from mail already exists to password verification stage', () => {
        mockLoginModalState({ userEmailError: new Error(MailInputError.ALREADY_EXISTS) });
        const { container } = render(componentWithStoreProvider());
        const loginButton = getByText(container, 'accountLogin');

        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('accountLogin'));
    });
});
