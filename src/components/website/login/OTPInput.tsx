import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { useRef } from 'react';

export function OTPInput(props: { nextButton: React.MutableRefObject<any> }) {
    const { t } = useI18next();

    const inputElementRefs = [0, 1, 2, 3, 4, 5].map(() => useRef(null));

    const inputElements = inputElementRefs.map((_, index) => (
        <input
            type="number"
            pattern="[0-9]"
            maxLength={1}
            key={`OTPInput${index}`}
            data-testid={`OTPInput${index}`}
            ref={inputElementRefs[index]}
            onFocus={(event) => (event.target.value = '')}
            onChange={() => {
                const nextElementToFocus = getNextElementForFocus(index);
                nextElementToFocus.current.focus();
            }}
        />
    ));

    function getNextElementForFocus(index: number) {
        const nextInputIndex = index + 1;

        if (nextInputIndex === inputElementRefs.length) {
            return props.nextButton;
        }

        const valueInNextInput = inputElementRefs[nextInputIndex].current.value;
        if (valueInNextInput !== '') {
            return getNextElementForFocus(nextInputIndex);
        }

        return inputElementRefs[nextInputIndex];
    }

    return (
        <div className="login-modal-input-outer-container">
            <p className="login-modal-input-description">{t('OTPEnter')}</p>
            <div className="login-modal-input-otp-container">{inputElements}</div>
            <p className="login-modal-input-description login-modal-opaque-text">{t('OTPExplanation')}</p>
            <p className="login-modal-input-description login-modal-correct-input">{t('OTPSendAgain')}</p>
        </div>
    );
}
