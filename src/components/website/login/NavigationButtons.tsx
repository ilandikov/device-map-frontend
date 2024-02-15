import React from 'react';
import GoBack from '/src/assets/images/GoBack.svg';
import Cancel from '/src/assets/images/Cancel.svg';

export function NavigationButtons() {
    return (
        <div className="login-modal-navigation-container">
            <img className="login-modal-navigation-button" src={GoBack} alt="login-modal-navigation-go-back" />
            <img className="login-modal-navigation-button" src={Cancel} alt="login-modal-navigation-cancel" />
        </div>
    );
}
