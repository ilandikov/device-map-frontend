import { ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { catchError, map, mergeMap, of } from 'rxjs';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType, mapAppSetLocationAddress } from './MapAppAction';
import { GeoApifyResponse, buildMapAppAddress } from './GeoApifyHelpers';

export const GeoApify: RootEpic = (action$, _state$, { cognitoClient }) =>
    action$.pipe(
        ofType(MapAppActionType.GET_LOCATION_ADDRESS),
        mergeMap((action) => {
            const location = action.location;
            return ajax<GeoApifyResponse>({
                url: `https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.lon}&apiKey=8b2ff18a6cd44e7a9a916eb52cc51f8b&lang=ru`,
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                crossDomain: true,
            }).pipe(
                map((ajaxResponse) => {
                    const geoApifyAddress = buildMapAppAddress(ajaxResponse.response);
                    return mapAppSetLocationAddress(geoApifyAddress);
                }),
                catchError((error) => of(error)),
            );
        }),
    );
