import { ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { EMPTY, catchError, map, mergeMap } from 'rxjs';
import { MapAppActionType, MapAppGetLocationAddress, mapAppSetLocationAddress } from './MapAppAction';
import { GeoApifyResponse, buildMapAppAddress } from './GeoApifyHelpers';
import { MapAppState } from './MapAppState';

export function GeoApify(action$, state$, { cognitoClient }) {
    return action$.pipe(
        ofType(MapAppActionType.GET_LOCATION_ADDRESS),
        mergeMap((action: MapAppGetLocationAddress) => {
            const mapAppState: MapAppState = state$.value.mapAppState;
            const alreadySelectedLocation = mapAppState.selectedMarker.location;
            const locationFromAction = action.location;
            if (
                alreadySelectedLocation &&
                alreadySelectedLocation.lat === locationFromAction.lat &&
                alreadySelectedLocation.lng === locationFromAction.lng
            ) {
                return EMPTY;
            }

            const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${locationFromAction.lat}&lon=${locationFromAction.lng}&apiKey=8b2ff18a6cd44e7a9a916eb52cc51f8b&lang=ru`;
            return ajax<GeoApifyResponse>({
                url,
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                crossDomain: true,
            }).pipe(
                map((ajaxResponse) => {
                    const geoApifyAddress = buildMapAppAddress(ajaxResponse.response);
                    return mapAppSetLocationAddress(geoApifyAddress);
                }),
                catchError((error) => error),
            );
        }),
    );
}
