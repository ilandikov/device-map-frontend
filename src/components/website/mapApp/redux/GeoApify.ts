import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, of } from 'rxjs';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType, mapAppSetLocationAddress } from './MapAppAction';
import { buildMapAppAddress } from './GeoApifyHelpers';

export const GeoApify: RootEpic = (action$, _state$, { geoApifyClient }) =>
    action$.pipe(
        ofType(MapAppActionType.GET_LOCATION_ADDRESS),
        mergeMap((action) => {
            const location = action.location;

            return geoApifyClient(location).pipe(
                map((ajaxResponse) => {
                    const geoApifyAddress = buildMapAppAddress(ajaxResponse.response);
                    return mapAppSetLocationAddress(geoApifyAddress);
                }),
                catchError((error) => of(error)),
            );
        }),
    );
