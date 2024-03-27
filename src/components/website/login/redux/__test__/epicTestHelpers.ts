import { Observable, lastValueFrom, of } from 'rxjs';
import { LoginModalAction, LoginModalVerifyRequest } from '../actions';
import { AuthenticationState } from '../state';
import { signUpEpic } from '../epic';

export async function verifyEpic(
    epicToTest: (action$, state$) => Observable<any>,
    sentAction: LoginModalVerifyRequest,
    initialState: any,
    expectedAction: any,
) {
    const state$ = epicToTest(of(sentAction), initialState);
    const receivedAction = await lastValueFrom(state$);

    expect(receivedAction).toEqual(expectedAction);
}

export async function verifySignUpEpic(
    sentAction: LoginModalVerifyRequest,
    initialState: {
        value: { authentication: AuthenticationState };
    },
    expectedAction: LoginModalAction,
) {
    await verifyEpic(signUpEpic, sentAction, initialState, expectedAction);
}
