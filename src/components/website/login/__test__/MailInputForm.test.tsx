import { fireEvent, getByTestId, getByText } from '@testing-library/react';
import React from 'react';
import { MailInputForm } from '../MailInputForm';
import {
    createEvent,
    renderForActionDispatchTest,
    renderForSnapshotTest,
} from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalInputType,
    LoginModalRemoteRequestType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from '../redux/LoginModalAction';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { CognitoErrors } from '../redux/cognitoHelpers';
import { MailInputError } from '../redux/AuthenticationErrors';

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

describe('MailInputForm snapshot tests', () => {
    it('should match the snapshot without error', () => {
        mockAuthenticationState({ email: 'enteredMail@form.fr', error: null });
        const component = renderForSnapshotTest(<MailInputForm />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists error', () => {
        mockAuthenticationState({
            email: 'existing@mail.ru',
            error: new Error(CognitoErrors.USERNAME_EXISTS),
        });
        const component = renderForSnapshotTest(<MailInputForm />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid error', () => {
        mockAuthenticationState({ email: 'notAMailAddress', error: new Error(MailInputError.NOT_VALID) });
        const component = renderForSnapshotTest(<MailInputForm />);

        expect(component).toMatchSnapshot();
    });
});

describe('MailInputForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it('should call email setter from email input', () => {
        const container = renderForActionDispatchTest(<MailInputForm />);

        const emailInput = getByTestId(container, 'emailInput');
        fireEvent.change(emailInput, createEvent('new@email.com'));

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalInput(LoginModalInputType.EMAIL, 'new@email.com'));
    });

    it('should call email verification, update mail error and transition to password creation after mail has been sent to input', () => {
        const container = renderForActionDispatchTest(<MailInputForm />);

        const tryVerifyEmailButton = getByText(container, 'next');
        fireEvent.click(tryVerifyEmailButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME));
    });

    it('should move from mail already exists to password verification stage', () => {
        mockAuthenticationState({ error: new Error(CognitoErrors.USERNAME_EXISTS) });
        const container = renderForActionDispatchTest(<MailInputForm />);

        const loginButton = getByText(container, 'accountLogin');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('accountLogin'));
    });
});
