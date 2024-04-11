import { Observable, lastValueFrom, of } from 'rxjs';
import { LoginModalAction, LoginModalVerifyRequest } from '../actions';
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
