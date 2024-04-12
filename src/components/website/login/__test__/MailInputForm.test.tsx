import { fireEvent, getByTestId, getByText } from '@testing-library/react';
import React from 'react';
import { MailInputForm } from '../MailInputForm';
import {
    createEvent,
    renderForActionDispatchTest,
    renderForSnapshotTest,
} from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalInputTypes,
    LoginModalRemoteRequestType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from '../redux/LoginModalAction';
import {
    mockDispatch,
    mockLoginModalAuthenticationState,
    mockPrepareSelector,
} from '../../../../redux/__mocks__/AuthenticationState';
import { MailInputError } from '../redux/LoginModalAuthenticationState';

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
        mockLoginModalAuthenticationState({ email: 'enteredMail@form.fr', error: null });
        const component = renderForSnapshotTest(<MailInputForm />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail exists error', () => {
        mockLoginModalAuthenticationState({
            email: 'existing@mail.ru',
            error: new Error(MailInputError.ALREADY_EXISTS),
        });
        const component = renderForSnapshotTest(<MailInputForm />);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail not valid error', () => {
        mockLoginModalAuthenticationState({ email: 'notAMailAddress', error: new Error(MailInputError.NOT_VALID) });
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

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalInput(LoginModalInputTypes.EMAIL, 'new@email.com'));
    });

    it('should call email verification, update mail error and transition to password creation after mail has been sent to input', () => {
        const container = renderForActionDispatchTest(<MailInputForm />);

        const tryVerifyEmailButton = getByText(container, 'next');
        fireEvent.click(tryVerifyEmailButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME));
    });

    it('should move from mail already exists to password verification stage', () => {
        mockLoginModalAuthenticationState({ error: new Error(MailInputError.ALREADY_EXISTS) });
        const container = renderForActionDispatchTest(<MailInputForm />);

        const loginButton = getByText(container, 'accountLogin');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1, loginModalButtonClick('accountLogin'));
    });
});
