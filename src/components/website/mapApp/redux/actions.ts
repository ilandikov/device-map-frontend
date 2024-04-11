import { MapAppActionTypes } from '../MapAppReducer';

export function mapAppLoginModalClose() {
    return { type: MapAppActionTypes.LOGIN_MODAL_OPEN };
}
