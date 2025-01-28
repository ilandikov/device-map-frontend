import { EMPTY, Observable, catchError, mergeMap, of, switchMap } from 'rxjs';
import { ofType } from 'redux-observable';
import {
    T22ApproveDeviceResponse,
    T22CreateDeviceResponse,
    T22DeleteDeviceResponse,
    T22ListDevicesResponse,
} from '@mancho-school-t22/graphql-types';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { MapAppAction, MapAppActionType } from '../../mapApp/redux/MapAppAction';
import { DevicesClient, RootEpic } from '../../../../redux/store';
import { MapAppState } from '../../mapApp/redux/MapAppState';
import {
    MapAppApproveDeviceRequest,
    MapAppCreateDeviceRequest,
    MapAppDeleteDeviceRequest,
    MapAppListDevicesRequest,
    MapAppRemoteRequestType,
    mapAppAddDevice,
    mapAppApproveDevice,
    mapAppDeleteDevice,
    mapAppRemoteErrorAnswer,
    mapAppSetDevices,
} from '../../mapApp/redux/MapAppRemoteActions';

export const devices: RootEpic = (action$, $state, { devicesClient }) =>
    action$.pipe(
        ofType(MapAppActionType.MAP_APP_DEVICE_REMOTE_REQUEST),
        switchMap((action) => {
            const request = devicesRequests[action.request];
            if (!request) {
                return EMPTY;
            }

            return fromPromise(request.call(devicesClient, $state.value.mapAppState, action)).pipe(
                mergeMap(request.responseToAction),
                catchError((error) => of(mapAppRemoteErrorAnswer(error))),
            );
        }),
    );

type DevicesRequest<TResponse, TRequestAction> = {
    call: (client: DevicesClient, state: MapAppState, action: TRequestAction) => Promise<TResponse>;
    responseToAction: (response: TResponse) => Observable<MapAppAction>;
};

const listDevicesRequest: DevicesRequest<T22ListDevicesResponse, MapAppListDevicesRequest> = {
    call: (client, _) => client.forAnonymousUser.listDevices(),
    responseToAction: (response) => of(mapAppSetDevices(response.devices)),
};

const createDeviceRequest: DevicesRequest<T22CreateDeviceResponse, MapAppCreateDeviceRequest> = {
    call: (client, state) => client.forAuthenticatedUser.createDevice({ location: state.selectedMarker.location }),
    responseToAction: (response) => of(mapAppAddDevice(response.device)),
};

const deleteDeviceRequest: DevicesRequest<T22DeleteDeviceResponse, MapAppDeleteDeviceRequest> = {
    call: (client, _, action) => client.forAuthenticatedUser.deleteDevice({ id: action.id }),
    responseToAction: (response) => of(mapAppDeleteDevice(response.id)),
};

const approveDevice: DevicesRequest<T22ApproveDeviceResponse, MapAppApproveDeviceRequest> = {
    call: (client, _, action) => client.forAuthenticatedUser.approveDevice({ id: action.id }),
    responseToAction: (response) => of(mapAppApproveDevice(response.id, response.lastUpdate)),
};

// TODO add explicit types instead of any
const devicesRequests: { [key in MapAppRemoteRequestType]: DevicesRequest<any, any> } = {
    LIST_DEVICES: listDevicesRequest,
    CREATE_DEVICE: createDeviceRequest,
    DELETE_DEVICE: deleteDeviceRequest,
    APPROVE_DEVICE: approveDevice,
};
