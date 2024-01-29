/* Local dependencies */
import { GetDevicesActions, GetServiceActionTypes } from './action';

export interface GetDevicesState {
  loading: boolean;
  error: null | Error;
}

export const initialGetDevicesState: GetDevicesState = {
  loading: false,
  error: null,
};

export default function getDevices(state = initialGetDevicesState, action: GetDevicesActions) {
  switch (action.type) {
    case GetServiceActionTypes.GET_DEVICES_REQUEST:
      return {...state,
        id: action.id,
        loading: true,
        error: null,
    };
    default:
      return state;
  }
}
