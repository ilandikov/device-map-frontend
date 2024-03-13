import { UserAuthState } from '../login/LoginModal';

export interface MapAppState {
    userAuthState: UserAuthState;
}

export const mapAppInitialState: MapAppState = {
    userAuthState: UserAuthState.PRODUCT_DESCRIPTION,
};

export enum MapAppActionTypes {
    LOGIN_BUTTON_CLICK = 'SHOW_LOGIN_MODAL',
}

export function MapAppReducer(state: MapAppState = mapAppInitialState, action = undefined) {
    if (!action) {
        return state;
    }

    switch (action.type) {
        case MapAppActionTypes.LOGIN_BUTTON_CLICK:
            return {
                ...state,
                userAuthState: UserAuthState.WELCOME,
            };
    }

    return state;
}
