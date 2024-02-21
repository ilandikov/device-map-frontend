import React from 'react';
import './NavigationButtons.scss';
import GoBack from '/src/assets/images/GoBack.svg';
import Cancel from '/src/assets/images/Cancel.svg';
import { UserAuthState } from './LoginModal';

export function NavigationButtons(props: { setUserAuthState: (string) => void; goBackState: UserAuthState }) {
    return (
        <div className="login-modal-navigation-container">
            <img
                className="login-modal-navigation-button"
                src={GoBack}
                alt="login-modal-navigation-go-back"
                data-testid="goBackButton"
                onClick={() => {
                    props.setUserAuthState(props.goBackState);
                }}
            />
            <img
                className="login-modal-navigation-button"
                src={Cancel}
                alt="login-modal-navigation-cancel"
                data-testid="cancelButton"
                onClick={() => {
                    props.setUserAuthState(UserAuthState.WELCOME);
                }}
            />
        </div>
    );
}
