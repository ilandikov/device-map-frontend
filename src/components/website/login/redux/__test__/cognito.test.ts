import {
    LoginModalCheck,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
    loginModalRemoteRequest,
} from '../LoginModalAction';
import { AuthenticationStep } from '../AuthenticationState';
import { mapAppAuthenticationCompleted } from '../../../mapApp/redux/MapAppAction';
import { cognito } from '../cognito';
import { buildEpicTester, itShouldAnswerBy } from '../../../../../redux/__test__/helpers';
import { cognitoRejectingClient, cognitoResolvingClient } from './cognitoTestHelpers';

const testCognitoEpic = buildEpicTester(cognito);

describe('user sign up tests', () => {
    [
        { stage: 'sign up', step: AuthenticationStep.PASSWORD_CREATION_LOADING },
        { stage: 'password reset', step: AuthenticationStep.PASSWORD_RESET_LOADING },
        { stage: 'sign up OTP', step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING },
        { stage: 'sign up OTP resend', step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING },
        { stage: 'forgot password', step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING },
        { stage: 'sign out', step: AuthenticationStep.LOGGED_IN },
    ].forEach(({ stage, step }) => {
        itShouldAnswerBy(`confirming ${stage}`, {
            epic: cognito,
            remoteClients: { cognitoClient: cognitoResolvingClient },
            partialRootState: { authentication: { step } },
            sentAction: loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedActions: [loginModalRemoteAnswerSuccess()],
        });

        itShouldAnswerBy(`sending error from ${stage}`, {
            epic: cognito,
            remoteClients: { cognitoClient: cognitoRejectingClient },
            partialRootState: { authentication: { step } },
            sentAction: loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedActions: [loginModalRemoteAnswerFailure('cognitoUnknownException')],
        });
    });
});

describe('user sign in tests', () => {
    it.each([
        [
            cognitoResolvingClient,
            [loginModalRemoteAnswerSuccess(), mapAppAuthenticationCompleted('0636d777-7355-4fc4-899c-5a7268434a57')],
        ],
        [cognitoRejectingClient, [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should dispatch login notification when remote answer is: %s', async (client, expectedAction) => {
        const initialState = { step: AuthenticationStep.LOGIN_LOADING };

        await testCognitoEpic(
            { cognitoClient: client },
            { authentication: initialState },
            loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedAction,
        );
    });
});

describe('password reset request tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        const initialState = { step: AuthenticationStep.MAIL_INPUT };
        const expectedAction = [];

        await testCognitoEpic(
            {},
            { authentication: initialState },
            loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedAction,
        );
    });
});

describe('state tests', () => {
    Object.values(AuthenticationStep).forEach((step) => {
        itShouldAnswerBy(`doing nothing at step ${step} when there is an error`, {
            epic: cognito,
            partialRootState: { authentication: { step, error: new Error('something is wrong') } },
            sentAction: loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedActions: [],
        });
    });
});
