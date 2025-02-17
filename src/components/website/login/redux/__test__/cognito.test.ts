import {
    LoginModalCheck,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
    loginModalRemoteRequest,
} from '../LoginModalAction';
import { AuthenticationStep } from '../AuthenticationState';
import { mapAppAuthenticationCompleted } from '../../../mapApp/redux/MapAppAction';
import { cognito } from '../cognito';
import { buildEpicTester } from '../../../../../redux/__test__/helpers';
import { cognitoRejectingClient, cognitoResolvingClient } from './cognitoTestHelpers';

const testCognitoEpic = buildEpicTester(cognito);

describe('user sign up tests', () => {
    it.each([
        [cognitoResolvingClient, [loginModalRemoteAnswerSuccess()]],
        [cognitoRejectingClient, [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should dispatch sign up notification when remote answer is: %s', async (client, expectedAction) => {
        const initialState = { step: AuthenticationStep.PASSWORD_CREATION_LOADING };

        await testCognitoEpic(
            { cognitoClient: client },
            { authentication: initialState },
            loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedAction,
        );
    });
});

describe('user password reset tests', () => {
    it.each([
        [cognitoResolvingClient, [loginModalRemoteAnswerSuccess()]],
        [cognitoRejectingClient, [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])(
        'should dispatch password has been reset notification when remote answer is: %s',
        async (client, expectedAction) => {
            const initialState = { step: AuthenticationStep.PASSWORD_RESET_LOADING };

            await testCognitoEpic(
                { cognitoClient: client },
                { authentication: initialState },
                loginModalRemoteRequest(LoginModalCheck.NONE),
                expectedAction,
            );
        },
    );
});

describe('user sign up OTP code confirmation tests (from password creation loading step)', () => {
    it.each([
        [cognitoResolvingClient, [loginModalRemoteAnswerSuccess()]],
        [cognitoRejectingClient, [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should dispatch OTP notification when remote answer is: %s', async (client, expectedAction) => {
        const initialState = { step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING };

        await testCognitoEpic(
            { cognitoClient: client },
            { authentication: initialState },
            loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedAction,
        );
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

    it.each([
        [cognitoResolvingClient, [loginModalRemoteAnswerSuccess()]],
        [cognitoRejectingClient, [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should dispatch forgot password notification when remote answer is: %s', async (client, expectedAction) => {
        const initialState = { step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING };

        await testCognitoEpic(
            { cognitoClient: client },
            { authentication: initialState },
            loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedAction,
        );
    });
});

describe('OTP code resend tests', () => {
    it.each([
        [cognitoResolvingClient, [loginModalRemoteAnswerSuccess()]],
        [cognitoRejectingClient, [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should resign out user when remote answer is: %s', async (client, expectedAction) => {
        const initialState = { step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING };

        await testCognitoEpic(
            { cognitoClient: client },
            { authentication: initialState },
            loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedAction,
        );
    });
});

describe('user sign out tests', () => {
    it.each([
        [cognitoResolvingClient, [loginModalRemoteAnswerSuccess()]],
        [cognitoRejectingClient, [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should sign out user when remote answer is: %s', async (client, expectedAction) => {
        const initialState = { step: AuthenticationStep.LOGGED_IN };

        await testCognitoEpic(
            { cognitoClient: client },
            { authentication: initialState },
            loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedAction,
        );
    });
});

describe('state tests', () => {
    const allSteps = Object.values(AuthenticationStep);
    it.each(allSteps)('should not process request at %s step when there is an error', async (step) => {
        const initialState = { step, error: new Error('something is wrong') };
        const expectedAction = [];

        await testCognitoEpic(
            {},
            { authentication: initialState },
            loginModalRemoteRequest(LoginModalCheck.NONE),
            expectedAction,
        );
    });
});
