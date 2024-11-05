import { loginModalRemoteAnswerFailure, loginModalRemoteAnswerSuccess } from '../LoginModalAction';
import { AuthenticationStep, buildAuthenticationState } from '../AuthenticationState';
import { mapAppAuthenticationCompleted } from '../../../mapApp/redux/MapAppAction';
import {
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
        [Promise.resolve(cognitoSignUpRequestResult), [loginModalRemoteAnswerSuccess()]],
        [Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])(
        'should dispatch sign up notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            });

            await testCognitoOutputAction(initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user password reset tests', () => {
    it.each([
        [
            Promise.resolve(cognitoPasswordResetConfirmationResult),
            [loginModalRemoteAnswerSuccess(), mapAppAuthenticationCompleted()],
        ],
        [Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])(
        'should dispatch password has been reset notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_LOADING,
            });

            await testCognitoOutputAction(initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user sign up OTP code confirmation tests (from password creation loading step)', () => {
    it.each([
        [
            Promise.resolve(cognitoSignUpConfirmationResult),
            [loginModalRemoteAnswerSuccess(), mapAppAuthenticationCompleted()],
        ],
        [Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should dispatch OTP notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });

        await testCognitoOutputAction(initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('user sign in tests', () => {
    it.each([
        [Promise.resolve(cognitoSignInResult), [loginModalRemoteAnswerSuccess(), mapAppAuthenticationCompleted()]],
        [Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should dispatch login notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.LOGIN_LOADING });

        await testCognitoOutputAction(initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('password reset request tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.MAIL_INPUT });

        await testCognitoNoOutput(initialState);
    });

    it.each([
        [Promise.resolve(cognitoPasswordResetRequestResult), [loginModalRemoteAnswerSuccess()]],
        [Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])(
        'should dispatch forgot password notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING,
            });

            await testCognitoOutputAction(initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('OTP code resend tests', () => {
    it.each([
        [Promise.resolve(), [loginModalRemoteAnswerSuccess()]],
        [Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should resign out user when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING,
        });

        await testCognitoOutputAction(initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('user sign out tests', () => {
    it.each([
        [Promise.resolve(cognitoSignOutResult), [loginModalRemoteAnswerSuccess()]],
        [Promise.reject(), [loginModalRemoteAnswerFailure('cognitoUnknownException')]],
    ])('should sign out user when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGGED_IN,
        });

        await testCognitoOutputAction(initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('state tests', () => {
    it('should not process request %s when there is an error', async () => {
        for (const step of Object.values(AuthenticationStep)) {
            const initialState = buildAuthenticationState({ step, error: new Error('something is wrong') });

            await testCognitoNoOutput(initialState);
        }
    });
});
