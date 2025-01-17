import { ofType } from 'redux-observable';
import { catchError, lastValueFrom, mergeMap, of, switchMap, toArray } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { RootEpic } from '../../../../../redux/store';
import { LoginModalAction, LoginModalActionType, LoginModalCheck, loginModalRemoteRequest } from '../LoginModalAction';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';

export interface FakeClientInterface {
    remoteServiceAsFunction: () => Promise<any>;
}

export const myEpic: RootEpic = (action$, _, { fakeClient }) =>
    action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap(() => processInMyEpic(fakeClient)),
    );

function processInMyEpic(fakeClient: FakeClientInterface) {
    return fromPromise(fakeClient.remoteServiceAsFunction()).pipe(
        mergeMap(() => of({ promise: 'resolved' } as any)),
        catchError(() => of({ promise: 'rejected' } as any)),
    );
}

export async function testMyEpicWithRemoteServiceAsFunction(
    remoteServiceAnswer: Promise<any>,
    expectedActions: (LoginModalAction | MapAppAction)[],
) {
    const fakeClient: FakeClientInterface = { remoteServiceAsFunction: () => remoteServiceAnswer };

    const action = of(loginModalRemoteRequest(LoginModalCheck.NONE));
    const output$ = myEpic(action, {} as any, { fakeClient });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(expectedActions);
}

describe('myEpic tests', () => {
    it('should resolve', async () => {
        const remoteServiceAnswer = Promise.resolve();

        const expectedAction = [{ promise: 'resolved' } as any];

        await testMyEpicWithRemoteServiceAsFunction(remoteServiceAnswer, expectedAction);
    });

    it('should reject', async () => {
        const remoteServiceAnswer = Promise.reject();

        const expectedAction = [{ promise: 'rejected' } as any];

        await testMyEpicWithRemoteServiceAsFunction(remoteServiceAnswer, expectedAction);
    });
});
