import React from 'react';
import './NavigationButtons.scss';
import GoBack from '/src/assets/images/GoBack.svg';
import Cancel from '/src/assets/images/Cancel.svg';
import { UserAuthState } from './LoginModal';

export function NavigationButtons(props: { setUserAuthState: (string) => void; goBackState: UserAuthState }) {
    return (
        <header className="login-modal-navigation-container">
            <button
                data-testid="goBackButton"
                onClick={() => {
                    props.setUserAuthState(props.goBackState);
                }}
            >
                <img src={GoBack} alt="login-modal-navigation-go-back" />
            </button>
            <button
                data-testid="cancelButton"
                onClick={() => {
                    props.setUserAuthState(UserAuthState.WELCOME);
                }}
            >
                <img src={Cancel} alt="login-modal-navigation-cancel" />
            </button>
        </header>
    );
}
