import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useRef } from 'react';
import './OTPInput.scss';
import { userAuthStateFromOTP } from './UserAuthStateUtils';

export function OTPInputForm(props: { setUserAuthState: (string) => void }) {
    const { t } = useI18next();

    const OTPNextButton = useRef(null);

    const inputElementRefs = [0, 1, 2, 3, 4, 5].map(() => useRef(null));

    const inputElements = inputElementRefs.map((inputElementRef, index) => {
        const OTPInputUniqueId = `OTPInput${index}`;
        return (
            <input
                type="number"
                pattern="[0-9]"
                maxLength={1}
                key={OTPInputUniqueId}
                data-testid={OTPInputUniqueId}
                ref={inputElementRef}
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

        if (nextInputIndex === inputElementRefs.length) {
            return OTPNextButton;
        }

        const valueInNextInput = inputElementRefs[nextInputIndex].current.value;
        if (valueInNextInput !== '') {
            return getNextElementForFocus(nextInputIndex);
        }

        return inputElementRefs[nextInputIndex];
    }

    return (
        <>
            <div className="login-modal-input-container">
                <p className="login-modal-input-help">{t('OTPEnter')}</p>
                <div className="login-modal-input-otp-container">{inputElements}</div>
                <p className="login-modal-input-help login-modal-opaque-text">{t('OTPExplanation')}</p>
                <p className="login-modal-input-help login-modal-correct-input">{t('OTPSendAgain')}</p>
            </div>
            <div className="login-modal-button-container">
                <input
                    className="login-modal-button-black-on-green"
                    type="button"
                    value={t('next')}
                    ref={OTPNextButton}
                    onClick={() => {
                        const nextUserAuthState = userAuthStateFromOTP();
                        props.setUserAuthState(nextUserAuthState);
                    }}
                />
            </div>
        </>
    );
}
