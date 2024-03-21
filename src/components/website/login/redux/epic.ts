import { Observable, filter, mapTo } from 'rxjs';

export function signUpEpic(action$): Observable<any> {
    return action$.pipe(
        filter(() => {
            return true;
        }),
        mapTo(action$.toPromise()),
    );
}
