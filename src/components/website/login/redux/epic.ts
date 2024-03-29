import { Observable, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import { LoginModalAction, LoginModalActionTypes, loginModalNoAction } from './actions';

export function cognito(action$): Observable<LoginModalAction> {
    return action$.pipe(
        ofType(LoginModalActionTypes.VERIFY_REQUEST),
        switchMap(() => {
            return of(loginModalNoAction(), loginModalNoAction());
        }),
    );
}
