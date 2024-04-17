import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useRef } from 'react';
import './OTPInput.scss';
import { useAppDispatch } from '../../../redux/store';
import {
    LoginModalInputType,
    LoginModalRemoteRequestType,
    loginModalInput,
    loginModalRemoteRequest,
} from './redux/LoginModalAction';
import { useLoginModalAuthentication } from './redux/LoginModalAuthenticationState';
import {
    collectOTPValue,
    fillInputsFromInputEvent,
    focusOnNextInputOrNextButton,
    isOTPInputEventValid,
} from './OTPFormHelpers';

export function OTPForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

    const { error } = useLoginModalAuthentication();

    const nextButton = useRef(null);

    const inputRefs = [0, 1, 2, 3, 4, 5].map(() => useRef(null));

    const inputs = inputRefs.map((inputRef, index) => {
        return (
            <input
                type="number"
                pattern="[0-9]"
                maxLength={1}
                key={`OTPInput${index}`}
                data-testid={`OTPInput${index}`}
                ref={inputRef}
                onFocus={(event) => (event.target.value = '')}
                onChange={(event) => {
                    if (isOTPInputEventValid(event) === false) {
                        inputRef.current.value = '';
                        return;
                    }

                    fillInputsFromInputEvent(event, index, inputRefs);

                    focusOnNextInputOrNextButton(index, inputRefs, nextButton);
                }}
            />
        );
    });

    return (
        <>
            <div className="login-modal-input-container">
                <p className="login-modal-input-help">{t('OTPEnter')}</p>
                <div className="login-modal-input-otp-container">{inputs}</div>
                <p className="login-modal-input-help login-modal-opaque-text">{t('OTPExplanation')}</p>
                <button
                    className="login-modal-input-help login-modal-correct-input"
                    onClick={() => {
                        dispatch(loginModalRemoteRequest(LoginModalRemoteRequestType.OTP_RESEND));
                    }}
                >
                    {t('OTPSendAgain')}
                </button>
                {error && <p className="login-modal-input-help login-modal-wrong-input">{t(error.message)}</p>}
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    ref={nextButton}
                    onClick={() => {
                        const OTPCode = collectOTPValue(inputRefs);
                        dispatch(loginModalInput(LoginModalInputType.OTP, OTPCode));

                        dispatch(loginModalRemoteRequest(LoginModalRemoteRequestType.OTP));
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
