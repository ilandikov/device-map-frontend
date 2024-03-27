import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useRef } from 'react';
import './OTPInput.scss';
import { useAppDispatch } from '../../../redux/store';
import { LoginModalInputTypes, LoginModalVerifyTypes, loginModalInput, loginModalVerifyRequest } from './redux/actions';

export function OTPForm() {
    const { t } = useI18next();
    const dispatch = useAppDispatch();

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
                onChange={() => {
                    const nextElementToFocus = getNextElementForFocus(index);
                    nextElementToFocus.current.focus();
                }}
            />
        );
    });

    function getNextElementForFocus(index: number) {
        const nextInputIndex = index + 1;

        if (nextInputIndex === inputRefs.length) {
            return nextButton;
        }

        const valueInNextInput = inputRefs[nextInputIndex].current.value;
        if (valueInNextInput !== '') {
            return getNextElementForFocus(nextInputIndex);
        }

        return inputRefs[nextInputIndex];
    }

    return (
        <>
            <div className="login-modal-input-container">
                <p className="login-modal-input-help">{t('OTPEnter')}</p>
                <div className="login-modal-input-otp-container">{inputs}</div>
                <p className="login-modal-input-help login-modal-opaque-text">{t('OTPExplanation')}</p>
                <p className="login-modal-input-help login-modal-correct-input">{t('OTPSendAgain')}</p>
            </div>
            <div className="login-modal-button-container">
                <button
                    className="login-modal-button-black-on-green"
                    ref={nextButton}
                    onClick={() => {
                        dispatch(loginModalInput(LoginModalInputTypes.OTP, inputRefs[0].current.value));
                        dispatch(loginModalVerifyRequest(LoginModalVerifyTypes.OTP));
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
