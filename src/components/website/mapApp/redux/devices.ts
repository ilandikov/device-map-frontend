import { EMPTY, Observable, catchError, mergeMap, of } from 'rxjs';
import { ofType } from 'redux-observable';
import {
    T22ApproveDeviceRequestResponse,
    T22CreateDeviceRequestResponse,
    T22DeleteDeviceRequestResponse,
    T22ListDevicesResponse,
} from '@mancho-school-t22/graphql-types';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { DevicesClient, RootEpic } from '../../../../redux/store';
import { MapAppAction } from './MapAppAction';
import { MapAppState } from './MapAppState';
import {
    DeviceActionType,
    DeviceApproveRequest,
    DeviceCreateRequest,
    DeviceDeleteRequest,
    DeviceListRequest,
    DeviceRemoteRequest,
    DeviceRemoteRequestType,
    deviceApproved,
    deviceDeleted,
    deviceRemoteError,
    devicesListed,
} from './DeviceAction';

export const devices: RootEpic = (action$, $state, { devicesClient }) =>
    action$.pipe(
        ofType(DeviceActionType.DEVICE_REMOTE_REQUEST),
        mergeMap((action) => {
            const request = devicesRequests[action.request];
            if (!request) {
                return EMPTY;
            }

            return fromPromise(request.call(devicesClient, $state.value.mapAppState, action)).pipe(
                mergeMap(request.responseToAction),
                catchError((error) => of(deviceRemoteError(error))),
            );
        }),
    );

type DevicesRequest<TResponse, TRequestAction> = {
    call: (client: DevicesClient, state: MapAppState, action: TRequestAction) => Promise<TResponse>;
    responseToAction: (response: TResponse) => Observable<MapAppAction>;
};

const listDevicesRequest: DevicesRequest<T22ListDevicesResponse, DeviceListRequest> = {
    call: (client, _) => client.forAnonymousUser.listDevices(),
    responseToAction: (response) => of(devicesListed(response.devices)),
};

const createDeviceRequest: DevicesRequest<T22CreateDeviceRequestResponse, DeviceCreateRequest> = {
    call: (client, state) => client.forAuthenticatedUser.createDevice({ location: state.selectedMarker.location }),
    responseToAction: () => EMPTY,
};

const deleteDeviceRequest: DevicesRequest<T22CreateDeviceRequestResponse, DeviceDeleteRequest> = {
    call: (client, _, action) => client.forAuthenticatedUser.deleteDevice({ id: action.id }),
    responseToAction: (response) => of(deviceDeleted(response.id)),
};

const approveDevice: DevicesRequest<T22ApproveDeviceRequestResponse, DeviceApproveRequest> = {
    call: (client, _, action) => client.forAuthenticatedUser.approveDevice({ id: action.id }),
    responseToAction: (response) => of(deviceApproved(response.id)),
};

type DeviceRemoteResponse =
    | T22ListDevicesResponse
    | T22CreateDeviceRequestResponse
    | T22DeleteDeviceRequestResponse
    | T22ApproveDeviceRequestResponse;

const devicesRequests: {
    [key in DeviceRemoteRequestType]: DevicesRequest<DeviceRemoteResponse, DeviceRemoteRequest>;
} = {
    LIST_DEVICES: listDevicesRequest,
    CREATE_DEVICE_REQUEST: createDeviceRequest,
    DELETE_DEVICE: deleteDeviceRequest,
    APPROVE_DEVICE: approveDevice,
};
