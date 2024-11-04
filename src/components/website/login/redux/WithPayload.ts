import { LoginModalInput, LoginModalInputType } from './LoginModalAction';
import { AuthenticationState } from './AuthenticationState';

export function withPayload(action: LoginModalInput): Partial<AuthenticationState> {
    return { error: null, ...setFieldFromPayload(action) };
}

function setFieldFromPayload(action: LoginModalInput): Partial<AuthenticationState> {
    const input = action.input;
    switch (input.type) {
        case LoginModalInputType.EMAIL:
            return { email: input.payload };
        case LoginModalInputType.PASSWORD:
            return { password: input.payload };
        case LoginModalInputType.PASSWORD_REPEAT:
            return { passwordRepeat: input.payload };
        case LoginModalInputType.OTP:
            return { OTP: input.payload };
        default:
            return {};
    }
}
