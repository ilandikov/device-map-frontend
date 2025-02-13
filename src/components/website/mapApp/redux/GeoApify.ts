import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AddressClient, RootEpic } from '../../../../redux/store';
import { MapAppActionType, MapAppGetLocationAddress, mapAppSetLocationAddress } from './MapAppAction';

export const GeoApify: RootEpic = (action$, _, { addressClient }) =>
    action$.pipe(
        ofType(MapAppActionType.GET_LOCATION_ADDRESS),
        mergeMap((action) => processGetAddressResponse(addressClient, action)),
    );

function processGetAddressResponse(addressClient: AddressClient, action: MapAppGetLocationAddress) {
    return fromPromise(addressClient.getAddress({ location: action.location })).pipe(
        map((response) => mapAppSetLocationAddress(response.address)),
        catchError((error) => of(error)),
    );
}
