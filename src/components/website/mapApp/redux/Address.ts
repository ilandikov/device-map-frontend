import { ofType } from 'redux-observable';
import { catchError, map, mergeMap, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { AddressClient, RootEpic } from '../../../../redux/store';
import { MapAppActionType, SelectedMarkerGetAddress, selectedMarkerSetAddress } from './MapAppAction';

export const address: RootEpic = (action$, _, { addressClient }) =>
    action$.pipe(
        ofType(MapAppActionType.SELECTED_MARKER_GET_ADDRESS),
        mergeMap((action) => processGetAddressResponse(addressClient, action)),
    );

function processGetAddressResponse(addressClient: AddressClient, action: SelectedMarkerGetAddress) {
    return fromPromise(addressClient.getAddress({ location: action.location })).pipe(
        map((response) => selectedMarkerSetAddress(response.address)),
        catchError((error) => of(error)),
    );
}
