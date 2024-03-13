import React from 'react';
import './NavigationButtons.scss';
import GoBack from '/src/assets/images/GoBack.svg';
import Cancel from '/src/assets/images/Cancel.svg';
import { useAppDispatch } from '../../../redux/store';
import { UserAuthState } from './UserAuthStateUtils';
import { loginModalButtonClick } from './actions';

interface NavigationButtonsProps {
    setUserAuthState: (string) => void;
    goBackState: UserAuthState;
}

export function NavigationButtons(props: NavigationButtonsProps) {
    const dispatch = useAppDispatch();

    return (
        <nav className="login-modal-navigation-container">
            <button
                data-testid="goBackButton"
                onClick={() => {
                    dispatch(loginModalButtonClick('goBack'));
                    props.setUserAuthState(props.goBackState);
                }}
            >
                <img src={GoBack} alt="login-modal-navigation-go-back" />
            </button>
            <button
                data-testid="cancelButton"
                onClick={() => {
                    dispatch(loginModalButtonClick('cancel'));
                    props.setUserAuthState(UserAuthState.WELCOME);
                }}
            >
                <img src={Cancel} alt="login-modal-navigation-cancel" />
            </button>
        </nav>
    );
}
