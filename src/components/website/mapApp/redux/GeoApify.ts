import { ofType } from 'redux-observable';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { AjaxResponse } from 'rxjs/internal/ajax/AjaxResponse';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType, mapAppSetLocationAddress } from './MapAppAction';
import { GeoApifyResponse, buildMapAppAddress } from './GeoApifyHelpers';

export const GeoApify: RootEpic = (action$, _, { geoApifyClient }) =>
    action$.pipe(
        ofType(MapAppActionType.GET_LOCATION_ADDRESS),
        mergeMap((action) => getAddress(geoApifyClient(action.location))),
    );

function getAddress(sendAddressRequest: Observable<AjaxResponse<GeoApifyResponse>>) {
    return sendAddressRequest.pipe(
        map((ajaxResponse) => {
            const geoApifyAddress = buildMapAppAddress(ajaxResponse.response);
            return mapAppSetLocationAddress(geoApifyAddress);
        }),
        catchError((error) => of(error)),
    );
}
