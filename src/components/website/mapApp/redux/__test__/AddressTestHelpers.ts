import { lastValueFrom, of, toArray } from 'rxjs';
import { MapAppAction } from '../MapAppAction';
import { address } from '../Address';
import { buildTestStateObservable } from '../../../../../redux/__mocks__/stateBuilders';
import { AddressClient } from '../../../../../redux/store';

export async function testAddressEpic(
    addressClient: AddressClient,
    sentAction: MapAppAction,
    expectedActions: MapAppAction[],
) {
    const output$ = address(of(sentAction), buildTestStateObservable({}), {
        addressClient,
    });
    const receivedActions = await lastValueFrom(output$.pipe(toArray()));
    expect(receivedActions).toEqual(expectedActions);
}

export const resolvingAddressClient: AddressClient = {
    getAddress: () => Promise.resolve({ address: { line1: 'Чуй, 120', line2: 'Первомайский, Бишкек' } }),
};

export const rejectingAddressClient: AddressClient = {
    getAddress: () => Promise.reject('something went wrong'),
};
