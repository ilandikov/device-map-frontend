import { ofType } from 'redux-observable';
import { EMPTY, lastValueFrom, of, switchMap, toArray } from 'rxjs';
import { RootEpic } from '../../../../../redux/store';
import { LoginModalAction, LoginModalActionType, LoginModalCheck, loginModalRemoteRequest } from '../LoginModalAction';
import { MapAppAction } from '../../../mapApp/redux/MapAppAction';

export interface FakeClientInterface {
    remoteService: () => Promise<any>;
}

export const myEpic: RootEpic = (action$, _, { fakeClient }) =>
    action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap(() => processMyEpic(fakeClient)),
    );

function processMyEpic(_client: FakeClientInterface) {
    return EMPTY;
}

export async function testMyEpic(
    remoteServiceAnswer: Promise<any>,
    expectedActions: (LoginModalAction | MapAppAction)[],
) {
    const fakeClient = { remoteService: () => remoteServiceAnswer };

    const action = of(loginModalRemoteRequest(LoginModalCheck.NONE));
    const output$ = myEpic(action, {} as any, { fakeClient });

    const receivedAction = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedAction).toEqual(expectedActions);
}

describe('myEpic tests', () => {
    it('should do nothing', async () => {
        const remoteServiceAnswer = Promise.resolve();

        const expectedAction = [];

        await testMyEpic(remoteServiceAnswer, expectedAction);
    });
});
