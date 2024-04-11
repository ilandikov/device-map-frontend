import { lastValueFrom, of } from 'rxjs';
import { LoginModalAction, LoginModalVerifyRequest, loginModalNoAction } from '../actions';
import { AuthenticationState } from '../state';
import { cognito } from '../epic';

class cognitoTestClient {
    private _mockedResult: Promise<void>;

    constructor(mockedResult: Promise<void>) {
        this._mockedResult = mockedResult;
    }

    signUp() {
        return this._mockedResult;
    }

    signUpConfirmCode() {
        return this._mockedResult;
    }

    confirmPassword() {
        return this._mockedResult;
    }

    signIn() {
        return this._mockedResult;
    }

    forgotPassword() {
        return this._mockedResult;
    }
}

export async function verifyCognitoEpic2(
    sentAction: LoginModalVerifyRequest,
    initialState: AuthenticationState,
    remoteServiceAnswer: Promise<void>,
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

export async function verifyCognitoEpicNoAction(
    sentAction: LoginModalVerifyRequest,
    initialState: AuthenticationState,
) {
    const output = cognito(
        of(sentAction),
        {
            value: {
                authentication: initialState,
            },
        },
        { cognitoClient: {} },
    );
    const receivedAction = await lastValueFrom(output);
    expect(receivedAction).toEqual(loginModalNoAction());
}
