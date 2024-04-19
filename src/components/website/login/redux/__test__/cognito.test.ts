import {
    LoginModalRemoteAnswerType,
    LoginModalRemoteRequestType,
    loginModalRemoteAnswerFailure,
    loginModalRemoteAnswerSuccess,
    loginModalRemoteRequest,
} from '../LoginModalAction';
import { AuthenticationStep, buildAuthenticationState } from '../LoginModalAuthenticationState';
import { mapAppAuthenticationCompleted } from '../../../mapApp/redux/MapAppAction';
import { verifyCognitoEpicAction, verifyCognitoEpicNoAction } from './cognitoTestHelpers';

const cognitoSignUpResult = {
    user: {
        username: '3kr4i6ngfa@mailcurity.com',
        pool: {
            userPoolId: 'us-west-2_Vks7GkhlO',
            clientId: '7nm1627efll9vkbn9dnqhimp4g',
            client: {
                endpoint: 'https://cognito-idp.us-west-2.amazonaws.com/',
                fetchOptions: {},
            },
            advancedSecurityDataCollectionFlag: true,
            storage: {},
        },
        Session: null,
        client: {
            endpoint: 'https://cognito-idp.us-west-2.amazonaws.com/',
            fetchOptions: {},
        },
        signInUserSession: null,
        authenticationFlowType: 'USER_SRP_AUTH',
        storage: {},
        keyPrefix: 'CognitoIdentityServiceProvider.7nm1627efll9vkbn9dnqhimp4g',
        userDataKey: 'CognitoIdentityServiceProvider.7nm1627efll9vkbn9dnqhimp4g.3kr4i6ngfa@mailcurity.com.userData',
    },
    userConfirmed: false,
    userSub: 'd726792b-41af-4091-8877-302f5f9d31e9',
    codeDeliveryDetails: {
        AttributeName: 'email',
        DeliveryMedium: 'EMAIL',
        Destination: '3***@m***',
    },
};
describe('user sign up tests', () => {
    it.each([
        [Promise.resolve(cognitoSignUpResult), [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_UP)]],
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
            const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.PASSWORD);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

const cognitoPasswordResetConfirmationResult = {
    CodeDeliveryDetails: {
        AttributeName: 'email',
        DeliveryMedium: 'EMAIL',
        Destination: '3***@m***',
    },
};
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
            const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.PASSWORD);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

const cognitoSignUpConfirmationResult = 'SUCCESS';
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
        const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.OTP);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });

    it('should dispatch no action and not call signUp() from password reset loading step', async () => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.OTP);

        await verifyCognitoEpicNoAction(sentAction, initialState);
    });
});

describe('user sign in tests', () => {
    it.each([
        [
            Promise.resolve(),
            [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_IN), mapAppAuthenticationCompleted()],
        ],
        [
            Promise.reject(),
            [loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_IN, 'cognitoUnknownException')],
        ],
    ])('should dispatch login notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.LOGIN_LOADING });
        const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME_AND_PASSWORD);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('password reset request tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.MAIL_INPUT });
        const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME);

        await verifyCognitoEpicNoAction(sentAction, initialState);
    });

    it.each([
        [Promise.resolve(), [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.FORGOT_PASSWORD)]],
        [
            Promise.reject(),
            [loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.FORGOT_PASSWORD, 'cognitoUnknownException')],
        ],
    ])(
        'should dispatch forgot password notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_LOADING,
            });
            const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.USERNAME);

            await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user sign out tests', () => {
    it.each([
        [Promise.resolve(), [loginModalRemoteAnswerSuccess(LoginModalRemoteAnswerType.SIGN_OUT)]],
        [
            Promise.reject(),
            [loginModalRemoteAnswerFailure(LoginModalRemoteAnswerType.SIGN_OUT, 'cognitoUnknownException')],
        ],
    ])('should sign out user when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const sentAction = loginModalRemoteRequest(LoginModalRemoteRequestType.SIGN_OUT);

        await verifyCognitoEpicAction(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});
