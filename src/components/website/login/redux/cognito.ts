import { EMPTY, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { RootEpic } from '../../../../redux/store';
import { LoginModalActionType } from './LoginModalAction';
import { authenticationMethods, processAuthMethod } from './cognitoEndpoints';

export const cognito: RootEpic = (action$, state$, { cognitoClient }) => {
    return action$.pipe(
        ofType(LoginModalActionType.REMOTE_REQUEST),
        switchMap((action) => {
            const authenticationState = state$.value.authentication;
            const skipRequest = authenticationState.error !== null;
            if (skipRequest) {
                return EMPTY;
            }

            const authenticationMethod = authenticationMethods[`${action.request}.${authenticationState.step}`];
            if (!authenticationMethod) {
                return EMPTY;
            }

            return processAuthMethod(authenticationMethod, cognitoClient, authenticationState);
        }),
    );
};
