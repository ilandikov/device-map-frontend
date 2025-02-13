import { lastValueFrom, of, toArray } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { MapAppAction } from '../MapAppAction';
import { GeoApify } from '../GeoApify';
import { buildStateForGeoApifyTest } from '../../../../../redux/__mocks__/stateBuilders';
import { AddressClient } from '../../../../../redux/store';

export async function testGeoApifyEpic(
    addressClient: AddressClient,
    sentAction: MapAppAction,
    expectedActions: MapAppAction[],
) {
    const output$ = GeoApify(of(sentAction), buildStateForGeoApifyTest(), {
        addressClient,
    });
    const receivedActions = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedActions).toEqual(expectedActions);
}

export const resolvingAddressClient: AddressClient = {
    geoApifyGetAddress: () => fromPromise(Promise.resolve({} as any)),
    getAddress: () => Promise.resolve({ address: { line1: 'Чуй, 120', line2: 'Первомайский, Бишкек' } }),
};

export const rejectingAddressClient = {
    geoApifyGetAddress: () => fromPromise(Promise.reject('something went wrong')),
    getAddress: () => Promise.reject('something went wrong'),
};
