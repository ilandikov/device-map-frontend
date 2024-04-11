import CognitoClient from '@mancho.devs/cognito';
import { lastValueFrom, of } from 'rxjs';
import {
    LoginModalAction,
    LoginModalNotificationTypes,
    LoginModalVerifyRequest,
    LoginModalVerifyTypes,
    loginModalFailureNotification,
    loginModalNoAction,
    loginModalSuccessNotification,
    loginModalVerifyRequest,
} from '../actions';
import { buildAuthenticationState, buildAuthenticationStateForEpic } from '../__mocks__/AuthenticationState';
import { AuthenticationState, AuthenticationStep } from '../state';
import { cognito } from '../epic';
import { verifyCognitoEpic } from './epicTestHelpers';

const cognitoClient = new CognitoClient({
    UserPoolId: process.env.GATSBY_COGNITO_USER_POOL_ID,
    ClientId: process.env.GATSBY_COGNITO_CLIENT_ID,
});

enum PromiseResult {
    RESOLVE = 'RESOLVE',
    REJECT = 'REJECT',
}

class cognitoTestClient {
    private _mockedResult: PromiseResult;

    constructor(mockedResult: PromiseResult) {
        this._mockedResult = mockedResult;
    }

    signUp() {
        return this.mockedPromise();
    }
    signUpConfirmCode() {
        return this.mockedPromise();
    }
    confirmPassword() {
        return this.mockedPromise();
    }
    signIn() {
        return this.mockedPromise();
    }
    forgotPassword() {
        return this.mockedPromise();
    }

    private mockedPromise() {
        if (this._mockedResult === PromiseResult.REJECT) {
            return Promise.reject();
        }
        return Promise.resolve();
    }
}

async function verifyCognitoEpic2(
    sentAction: LoginModalVerifyRequest,
    initialState: AuthenticationState,
    remoteServiceAnswer: PromiseResult,
    expectedAction: LoginModalAction,
) {
    const output$ = cognito(
        of(sentAction),
        {
            value: {
                authentication: initialState,
            },
        },
        {
            cognitoClient: new cognitoTestClient(remoteServiceAnswer),
        },
    );
    const receivedAction = await lastValueFrom(output$);
    expect(receivedAction).toEqual(expectedAction);
}

describe('user sign up tests', () => {
    it.each([
        [PromiseResult.RESOLVE, loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_UP)],
        [
            PromiseResult.REJECT,
            loginModalFailureNotification(LoginModalNotificationTypes.SIGN_UP, 'cognitoUnknownException'),
        ],
    ])(
        'should dispatch sign up notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_CREATION_LOADING,
            });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

            await verifyCognitoEpic2(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );

    it.each([
        [PromiseResult.RESOLVE, loginModalSuccessNotification(LoginModalNotificationTypes.PASSWORD_RESET)],
        [
            PromiseResult.REJECT,
            loginModalFailureNotification(LoginModalNotificationTypes.PASSWORD_RESET, 'cognitoUnknownException'),
        ],
    ])(
        'should dispatch password has been reset notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({
                step: AuthenticationStep.PASSWORD_RESET_LOADING,
            });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.PASSWORD);

            await verifyCognitoEpic2(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});

describe('user sign up OTP code confirmation tests (from password creation loading step)', () => {
    it.each([
        [PromiseResult.RESOLVE, loginModalSuccessNotification(LoginModalNotificationTypes.OTP)],
        [
            PromiseResult.REJECT,
            loginModalFailureNotification(LoginModalNotificationTypes.OTP, 'cognitoUnknownException'),
        ],
    ])('should dispatch OTP notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({
            step: AuthenticationStep.PASSWORD_CREATION_OTP_LOADING,
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpic2(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });

    it('should dispatch no action and not call signUp() from password reset loading step', async () => {
        const initialState = buildAuthenticationStateForEpic({
            step: AuthenticationStep.PASSWORD_RESET_LOADING,
        });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.OTP);

        await verifyCognitoEpic(sentAction, initialState, loginModalNoAction(), { cognitoClient });
    });
});

describe('user sign in tests', () => {
    it.each([
        [PromiseResult.RESOLVE, loginModalSuccessNotification(LoginModalNotificationTypes.SIGN_IN)],
        [
            PromiseResult.REJECT,
            loginModalFailureNotification(LoginModalNotificationTypes.SIGN_IN, 'cognitoUnknownException'),
        ],
    ])('should dispatch login notification when remote answer is: %s', async (remoteServiceAnswer, expectedAction) => {
        const initialState = buildAuthenticationState({ step: AuthenticationStep.LOGIN_LOADING });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL_AND_PASSWORD);

        await verifyCognitoEpic2(sentAction, initialState, remoteServiceAnswer, expectedAction);
    });
});

describe('password reset tests', () => {
    it('should not call cognito service on email verification during mail input step', async () => {
        const initialState = buildAuthenticationStateForEpic({ step: AuthenticationStep.MAIL_INPUT });
        const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

        const output = cognito(of(sentAction), initialState, { cognitoClient: {} });
        const receivedAction = await lastValueFrom(output);
        expect(receivedAction).toEqual(loginModalNoAction());
    });

    it.each([
        [PromiseResult.RESOLVE, loginModalSuccessNotification(LoginModalNotificationTypes.FORGOT_PASSWORD)],
        [
            PromiseResult.REJECT,
            loginModalFailureNotification(LoginModalNotificationTypes.FORGOT_PASSWORD, 'cognitoUnknownException'),
        ],
    ])(
        'should dispatch forgot password notification when remote answer is: %s',
        async (remoteServiceAnswer, expectedAction) => {
            const initialState = buildAuthenticationState({ step: AuthenticationStep.PASSWORD_RESET_LOADING });
            const sentAction = loginModalVerifyRequest(LoginModalVerifyTypes.EMAIL);

            await verifyCognitoEpic2(sentAction, initialState, remoteServiceAnswer, expectedAction);
        },
    );
});
