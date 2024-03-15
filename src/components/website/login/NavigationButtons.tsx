import React from 'react';
import './NavigationButtons.scss';
import GoBack from '/src/assets/images/GoBack.svg';
import Cancel from '/src/assets/images/Cancel.svg';
import { useAppDispatch } from '../../../redux/store';
import { loginModalButtonClick } from './actions';

export function NavigationButtons() {
    const dispatch = useAppDispatch();

    return (
        <nav className="login-modal-navigation-container">
            <button
                data-testid="goBackButton"
                onClick={() => {
                    dispatch(loginModalButtonClick('goBack'));
                }}
            >
                <img src={GoBack} alt="login-modal-navigation-go-back" />
            </button>
            <button
                data-testid="cancelButton"
                onClick={() => {
                    dispatch(loginModalButtonClick('cancel'));
                }}
            >
                <img src={Cancel} alt="login-modal-navigation-cancel" />
            </button>
        </nav>
    );
}
