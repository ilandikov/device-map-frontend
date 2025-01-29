import { ofType } from 'redux-observable';
import { of, switchMap } from 'rxjs';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType, mapAppSetUserPoints } from '../../mapApp/redux/MapAppAction';

export const user: RootEpic = (action$) =>
    action$.pipe(
        ofType(MapAppActionType.GET_USER_POINTS),
        switchMap(() => of(mapAppSetUserPoints(320))),
    );
