import { Observable, lastValueFrom, of } from 'rxjs';
import { LoginModalAction, LoginModalVerifyRequest, loginModalNoAction } from '../actions';
import { AuthenticationState } from '../state';
import { cognito } from '../epic';

export async function verifyEpic(
    epicToTest: (action$, state$, dependencies) => Observable<any>,
    sentAction: LoginModalVerifyRequest,
    initialState: any,
    expectedAction: any,
    dependencies: any,
) {
    const state$ = epicToTest(of(sentAction), initialState, dependencies);
    const receivedAction = await lastValueFrom(state$);

    expect(receivedAction).toEqual(expectedAction);
}

export async function verifyCognitoEpic(
    sentAction: LoginModalVerifyRequest,
    initialState: {
        value: { authentication: AuthenticationState };
    },
    expectedAction: LoginModalAction,
    dependencies: any,
) {
    await verifyEpic(cognito, sentAction, initialState, expectedAction, dependencies);
}

export enum PromiseResult {
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

export async function verifyCognitoEpic2(
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
