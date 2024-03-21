import { Observable, filter, mapTo } from 'rxjs';
import { LoginModalActionTypes, LoginModalSignUp } from './actions';

export function signUpEpic(action$): Observable<LoginModalSignUp> {
    return action$.pipe(
        filter(() => {
            return true;
        }),
        mapTo({ type: LoginModalActionTypes.SIGNUP_OK }),
    );
}
