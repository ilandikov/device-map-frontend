import { RootState } from '../store';
import { authenticationInitialState } from '../../components/website/login/redux/LoginModalAuthenticationState';
import { initialGetDevicesState } from '../../components/devices/getDevices/redux/reducer';
import { mapAppInitialState } from '../../components/website/mapApp/redux/MapAppState';

export function buildInitialTestState(): RootState {
    return {
        loginModalAuthentication: authenticationInitialState,
        getDevices: initialGetDevicesState,
        mapAppState: mapAppInitialState,
    };
}
