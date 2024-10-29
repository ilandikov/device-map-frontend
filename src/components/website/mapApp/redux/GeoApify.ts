import { ofType } from 'redux-observable';
import { Observable, catchError, map, mergeMap, of } from 'rxjs';
import { AjaxResponse } from 'rxjs/internal/ajax/AjaxResponse';
import { RootEpic } from '../../../../redux/store';
import { MapAppActionType, mapAppSetLocationAddress } from './MapAppAction';
import { GeoApifyResponse, buildMapAppAddress } from './GeoApifyHelpers';

export const GeoApify: RootEpic = (action$, _, { geoApifyClient }) =>
    action$.pipe(
        ofType(MapAppActionType.GET_LOCATION_ADDRESS),
        mergeMap((action) => getGeoApifyAddress(geoApifyClient(action.location))),
    );

function getGeoApifyAddress(sendAddressRequest: Observable<AjaxResponse<GeoApifyResponse>>) {
    function processResponse(ajaxResponse: AjaxResponse<GeoApifyResponse>) {
        const address = buildMapAppAddress(ajaxResponse.response);
        return mapAppSetLocationAddress(address);
    }

    return sendAddressRequest.pipe(
        map(processResponse),
        catchError((error) => of(error)),
    );
}
