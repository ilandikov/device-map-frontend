import { MapAppActionTypes } from '../MapAppReducer';

export interface MapAppAction {
    type: MapAppActionTypes;
}

export function mapAppLoginModalClose(): MapAppAction {
    return { type: MapAppActionTypes.LOGIN_MODAL_OPEN };
}
