import React from 'react';
import { MailInputForm } from '../MailInputForm';
import {
    doUserButtonClick,
    doUserInput,
    renderForSnapshotTest,
    verifyDispatchedAction,
} from '../../../../../tests/utils/RenderingHelpers';
import {
    LoginModalInputType,
    LoginModalRemoteRequestType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from '../redux/LoginModalAction';
import {
    mockDispatch,
    mockLoginModalAuthenticationState,
    mockPrepareSelector,
    resetMocks,
} from '../../../../redux/__mocks__/mocks';
import { CognitoErrors } from '../redux/cognitoHelpers';
import { MailInputError } from '../redux/LoginModalAuthenticationHelpers';

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
            error: new Error(CognitoErrors.USERNAME_EXISTS),
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
        resetMocks();
    });

    it('should call email setter from email input', () => {
        mockLoginModalAuthenticationState({});

        doUserInput(<MailInputForm />, 'emailInput', 'new@email.com');

        verifyDispatchedAction(loginModalInput(LoginModalInputType.EMAIL, 'new@email.com'));
    });

    it('should dispatch email verification, on next button click', () => {
        mockLoginModalAuthenticationState({});

        doUserButtonClick(<MailInputForm />, 'next');

        verifyDispatchedAction(loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME));
    });

    it('should be able to click account login button when mail already exists error is present', () => {
        mockLoginModalAuthenticationState({ error: new Error(CognitoErrors.USERNAME_EXISTS) });

        doUserButtonClick(<MailInputForm />, 'accountLogin');

        verifyDispatchedAction(loginModalButtonClick('accountLogin'));
    });
});
