import { EMPTY, Observable, catchError, from, map, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import {
    Subscription,
    T22ApproveDeviceResponse,
    T22CreateDeviceResponse,
    T22DeleteDeviceResponse,
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
    deviceCreated,
    deviceCreated2,
    deviceCreationSubscriptionRequest,
    deviceDeleted,
    deviceRemoteError,
    devicesListed,
} from './DeviceAction';

export const devices: RootEpic = (action$, $state, { devicesClient }) =>
    action$.pipe(
        ofType(DeviceActionType.DEVICE_REMOTE_REQUEST),
        switchMap((action) => {
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

const createDeviceRequest: DevicesRequest<T22CreateDeviceResponse, DeviceCreateRequest> = {
    call: (client, state) => client.forAuthenticatedUser.createDevice({ location: state.selectedMarker.location }),
    responseToAction: (response) =>
        from([deviceCreated(response.device), deviceCreationSubscriptionRequest(response.device.id)]),
};

const deleteDeviceRequest: DevicesRequest<T22DeleteDeviceResponse, DeviceDeleteRequest> = {
    call: (client, _, action) => client.forAuthenticatedUser.deleteDevice({ id: action.id }),
    responseToAction: (response) => of(deviceDeleted(response.id)),
};

const approveDevice: DevicesRequest<T22ApproveDeviceResponse, DeviceApproveRequest> = {
    call: (client, _, action) => client.forAuthenticatedUser.approveDevice({ id: action.id }),
    responseToAction: (response) => of(deviceApproved(response.id, response.lastUpdate)),
};

type DeviceRemoteResponse =
    | T22ListDevicesResponse
    | T22CreateDeviceResponse
    | T22DeleteDeviceResponse
    | T22ApproveDeviceResponse;

const devicesRequests: {
    [key in DeviceRemoteRequestType]: DevicesRequest<DeviceRemoteResponse, DeviceRemoteRequest>;
} = {
    LIST_DEVICES: listDevicesRequest,
    CREATE_DEVICE: createDeviceRequest,
    DELETE_DEVICE: deleteDeviceRequest,
    APPROVE_DEVICE: approveDevice,
};

export type DeviceSubscription = Observable<Subscription>;

export const deviceSubscriptions: RootEpic = (action$, _, { project }) =>
    action$.pipe(
        ofType(DeviceActionType.DEVICE_SUBSCRIPTION_REQUEST),
        mergeMap((action) =>
            project(action.id).pipe(
                map((data) => deviceCreated2(data.T22OnDeviceCreation)),
                catchError(() => of(deviceRemoteError('could not subscribe to device update'))),
            ),
        ),
    );
