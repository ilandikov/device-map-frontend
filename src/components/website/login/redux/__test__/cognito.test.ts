import { loginModalRemoteAnswerFailure, loginModalRemoteAnswerSuccess } from '../LoginModalAction';
import { AuthenticationStep, buildAuthenticationState } from '../AuthenticationState';
import { mapAppAuthenticationCompleted } from '../../../mapApp/redux/MapAppAction';
import {
    ClientType,
    cognitoPasswordResetConfirmationResult,
    cognitoPasswordResetRequestResult,
    cognitoSignInResult,
    cognitoSignOutResult,
    cognitoSignUpConfirmationResult,
    cognitoSignUpRequestResult,
    testCognitoNoOutput,
    testCognitoOutputAction,
} from './cognitoTestHelpers';

describe('user sign up tests', () => {
    it.each([
        [ClientType.RESOLVING, Promise.resolve(cognitoSignUpRequestResult), [loginModalRemoteAnswerSuccess()]],
        [ClientType.REJECTING, Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])(
        'should dispatch sign up notification when remote answer is: %s',
        async (clientType, remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            });

            await testCognitoOutputAction(initialState, remoteServiceAnswer, clientType, expectedAction);
        },
    );
});

describe('user password reset tests', () => {
    it.each([
        [
            ClientType.RESOLVING,
            Promise.resolve(cognitoPasswordResetConfirmationResult),
            [loginModalRemoteAnswerSuccess()],
        ],
        [ClientType.REJECTING, Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])(
        'should dispatch password has been reset notification when remote answer is: %s',
        async (clientType, remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_LOADING,
            });

            await testCognitoOutputAction(initialState, remoteServiceAnswer, clientType, expectedAction);
        },
    );
});

describe('user sign up OTP code confirmation tests (from password creation loading step)', () => {
    it.each([
        [ClientType.RESOLVING, Promise.resolve(cognitoSignUpConfirmationResult), [loginModalRemoteAnswerSuccess()]],
        [ClientType.REJECTING, Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])(
        'should dispatch OTP notification when remote answer is: %s',
        async (clientType, remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
            });

            await testCognitoOutputAction(initialState, remoteServiceAnswer, clientType, expectedAction);
        },
    );
});

describe('user sign in tests', () => {
    it.each([
        [
            ClientType.RESOLVING,
            Promise.resolve(cognitoSignInResult),
            [loginModalRemoteAnswerSuccess(), mapAppAuthenticationCompleted('0636d777-7355-4fc4-899c-5a7268434a57')],
        ],
        [ClientType.REJECTING, Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])(
        'should dispatch login notification when remote answer is: %s',
        async (clientType, remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({ step: AuthenticationStep.LOGIN_LOADING });

            await testCognitoOutputAction(initialState, remoteServiceAnswer, clientType, expectedAction);
        },
    );
});

describe('password reset request tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.MAIL_INPUT });

        await testCognitoNoOutput(initialState);
    });

    it.each([
        [ClientType.RESOLVING, Promise.resolve(cognitoPasswordResetRequestResult), [loginModalRemoteAnswerSuccess()]],
        [ClientType.REJECTING, Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])(
        'should dispatch forgot password notification when remote answer is: %s',
        async (clientType, remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING,
            });

            await testCognitoOutputAction(initialState, remoteServiceAnswer, clientType, expectedAction);
        },
    );
});

describe('OTP code resend tests', () => {
    it.each([
        [ClientType.RESOLVING, Promise.resolve(), [loginModalRemoteAnswerSuccess()]],
        [ClientType.REJECTING, Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should resign out user when remote answer is: %s', async (clientType, remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING,
        });

        await testCognitoOutputAction(initialState, remoteServiceAnswer, clientType, expectedAction);
    });
});

describe('user sign out tests', () => {
    it.each([
        [ClientType.RESOLVING, Promise.resolve(cognitoSignOutResult), [loginModalRemoteAnswerSuccess()]],
        [ClientType.REJECTING, Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should sign out user when remote answer is: %s', async (clientType, remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGGED_IN,
        });

        await testCognitoOutputAction(initialState, remoteServiceAnswer, clientType, expectedAction);
    });
});

describe('state tests', () => {
    const allSteps = Object.values(AuthenticationStep);
    it.each(allSteps)('should not process request at %s step when there is an error', async (step) => {
        const initialState = buildAuthenticationState({ step, error: new Error('something is wrong') });

        await testCognitoNoOutput(initialState);
    });
});
