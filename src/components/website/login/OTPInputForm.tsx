import { useI18next } from 'gatsby-plugin-react-i18next';
import React, { createRef, forwardRef, useRef } from 'react';
import './OTPInput.scss';
import { userAuthStateFromOTP } from './UserAuthStateUtils';
import { UserAuthState } from './LoginModal';

interface OTPInputProps {
    index: number;
    onChange: () => void;
}

export const OTPInput = forwardRef<HTMLInputElement>(function OTPInput(
    props: OTPInputProps,
    ref: React.Ref<HTMLInputElement> | null,
) {
    return (
        <input
            key={`OTPInput${props.index}`}
            data-testid={`OTPInput${props.index}`}
            type="number"
            pattern="[0-9]"
            maxLength={1}
            ref={ref}
            onFocus={(event) => (event.target.value = '')}
            onChange={props.onChange}
        />
    );
});

interface OTPInputFormProps {
    userAuthState: UserAuthState.LOGIN_OTP | UserAuthState.SIGNUP_OTP;
    setUserAuthState: (string) => void;
}

export function OTPInputForm(props: OTPInputFormProps) {
    const { t } = useI18next();

    const nextButton = useRef(null);

    const inputRefs = [0, 1, 2, 3, 4, 5].map(() => createRef<HTMLInputElement>());

    const inputs = inputRefs.map((inputRef, index) => {
        return (
            <OTPInput
                {...{
                    index,
                    onChange: () => {
                        const nextElementToFocus = getNextElementForFocus(index);
                        nextElementToFocus.current.focus();
                    },
                }}
                ref={inputRef}
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
                        const nextUserAuthState = userAuthStateFromOTP(props.userAuthState);
                        props.setUserAuthState(nextUserAuthState);
                    }}
                >
                    {t('next')}
                </button>
            </div>
        </>
    );
}
