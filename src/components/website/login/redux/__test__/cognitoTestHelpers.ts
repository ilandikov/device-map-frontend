import { lastValueFrom, of, toArray } from 'rxjs';
import { LoginModalAction, LoginModalRemoteRequest } from '../LoginModalAction';
import { LoginModalAuthenticationState } from '../LoginModalAuthenticationState';
import { cognito } from '../cognito';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';

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

    signOut() {
        return this._mockedResult;
    }
}

export async function verifyCognitoEpicAction(
    sentAction: LoginModalRemoteRequest,
    initialState: LoginModalAuthenticationState,
    remoteServiceAnswer: Promise<void>,
    expectedActions: (LoginModalAction | MapAppAction)[],
) {
    const output$ = cognito(
        of(sentAction),
        {
            value: {
                loginModalAuthentication: initialState,
            },
        },
        {
            cognitoClient: new cognitoTestClient(remoteServiceAnswer),
        },
    );
    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(expectedActions);
}

export async function verifyCognitoEpicNoAction(
    sentAction: LoginModalRemoteRequest,
    initialState: LoginModalAuthenticationState,
) {
    const output$ = cognito(
        of(sentAction),
        {
            value: {
                loginModalAuthentication: initialState,
            },
        },
        { cognitoClient: {} },
    );
    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual([]);
}
