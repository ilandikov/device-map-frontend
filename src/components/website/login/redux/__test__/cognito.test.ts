import {
    LoginModalCheck,
    LoginModalRemoteAnswerType,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
    loginModalRemoteRequest,
} from '../LoginModalAction';
import { AuthenticationStep, buildAuthenticationState } from '../AuthenticationState';
import { mapAppAuthenticationCompleted } from '../../../mapApp/redux/MapAppAction';
import {
    cognitoPasswordResetConfirmationResult,
    cognitoPasswordResetRequestResult,
    cognitoSignInResult,
    cognitoSignOutResult,
    cognitoSignUpConfirmationResult,
    cognitoSignUpRequestResult,
    verifyCognitoEpicAction,
    verifyCognitoEpicNoAction,
} from './cognitoTestHelpers';

describe('user sign up tests', () => {
    it.each([
        [
            Promise.resolve(cognitoSignUpRequestResult),
            [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_UP)],
        ],
        [
            Promise.reject(),
            [loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_UP, 'cognitoUnknownException')],
        ],
    ])(
        'should dispatch sign up notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            });
            const sentAction = loginModalRemoteRequest(LoginModalCheck.PASSWORD);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user password reset tests', () => {
    it.each([
        [
            Promise.resolve(cognitoPasswordResetConfirmationResult),
            [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.PASSWORD_RESET), mapAppAuthenticationCompleted()],
        ],
        [
            Promise.reject(),
            [loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.PASSWORD_RESET, 'cognitoUnknownException')],
        ],
    ])(
        'should dispatch password has been reset notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_LOADING,
            });
            const sentAction = loginModalRemoteRequest(LoginModalCheck.PASSWORD);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user sign up OTP code confirmation tests (from password creation loading step)', () => {
    it.each([
        [
            Promise.resolve(cognitoSignUpConfirmationResult),
            [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP), mapAppAuthenticationCompleted()],
        ],
        [Promise.reject(), [loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.OTP, 'cognitoUnknownException')]],
    ])('should dispatch OTP notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const sentAction = loginModalRemoteRequest(LoginModalCheck.OTP);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('user sign in tests', () => {
    it.each([
        [
            Promise.resolve(cognitoSignInResult),
            [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_IN), mapAppAuthenticationCompleted()],
        ],
        [
            Promise.reject(),
            [loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_IN, 'cognitoUnknownException')],
        ],
    ])('should dispatch login notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.LOGIN_LOADING });
        const sentAction = loginModalRemoteRequest(LoginModalCheck.NONE);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('password reset request tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.MAIL_INPUT });
        const sentAction = loginModalRemoteRequest(LoginModalCheck.USERNAME);

        await verifyCognitoEpicNoAction(sentAction, initialState);
    });

    it.each([
        [
            Promise.resolve(cognitoPasswordResetRequestResult),
            [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.FORGOT_PASSWORD)],
        ],
        [
            Promise.reject(),
            [loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.FORGOT_PASSWORD, 'cognitoUnknownException')],
        ],
    ])(
        'should dispatch forgot password notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_REQUEST_LOADING,
            });
            const sentAction = loginModalRemoteRequest(LoginModalCheck.USERNAME);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('OTP code resend tests', () => {
    it.each([
        [Promise.resolve(), [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.OTP_RESEND)]],
        [
            Promise.reject(),
            [loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.OTP_RESEND, 'cognitoUnknownException')],
        ],
    ])('should resign out user when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_RESEND_LOADING,
        });
        const sentAction = loginModalRemoteRequest(LoginModalCheck.NONE);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('user sign out tests', () => {
    it.each([
        [Promise.resolve(cognitoSignOutResult), [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_OUT)]],
        [
            Promise.reject(),
            [loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_OUT, 'cognitoUnknownException')],
        ],
    ])('should sign out user when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.LOGGED_IN,
        });
        const sentAction = loginModalRemoteRequest(LoginModalCheck.NONE);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('state tests', () => {
    const allRemoteRequests: LoginModalCheck[] = Object.values(LoginModalCheck);
    it.each(allRemoteRequests)('should not process request %s when there is an error', async (request) => {
        for (const step of Object.values(AuthenticationStep)) {
            const initialState = buildAuthenticationState({ step, error: new Error('something is wrong') });

            const sentAction = loginModalRemoteRequest(request);

            await verifyCognitoEpicNoAction(sentAction, initialState);
        }
    });
});
