import { MapAppActionTypes } from '../MapAppReducer';

interface MapAppAction {
    type: MapAppActionTypes;
}

export function mapAppLoginModalClose(): MapAppAction {
    return { type: MapAppActionTypes.LOGIN_MODAL_OPEN };
}
