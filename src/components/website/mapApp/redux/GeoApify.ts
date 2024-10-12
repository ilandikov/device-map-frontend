import { ofType } from 'redux-observable';
import { ajax } from 'rxjs/ajax';
import { catchError, map, mergeMap } from 'rxjs';
import { MapAppActionType, mapAppSetLocationAddress } from './MapAppAction';
import { GeoApifyResponse } from './GeoApifyAPI';

export function GeoApify(action$, _state$, { cognitoClient }) {
    return action$.pipe(
        ofType(MapAppActionType.GET_LOCATION_ADDRESS),
        mergeMap((action: any) => {
            const location = action.location;
            const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${location.lat}&lon=${location.lng}&apiKey=8b2ff18a6cd44e7a9a916eb52cc51f8b&lang=ru`;
            return ajax<GeoApifyResponse>({
                url,
                method: 'GET',
                headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
                crossDomain: true,
            }).pipe(
                map((ajaxResponse) => {
                    const response = ajaxResponse.response;
                    const properties = response.features[0].properties;
                    const geoApifyAddress = {
                        addressLine1: `${properties.street}, ${properties.housenumber}`,
                        addressLine2: `${properties.district}, ${properties.city}`,
                    };
                    return mapAppSetLocationAddress(geoApifyAddress);
                }),
                catchError((error) => error),
            );
        }),
    );
}
