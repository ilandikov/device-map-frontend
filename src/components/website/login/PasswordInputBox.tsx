import React, { ChangeEventHandler } from 'react';
import { UserAuthState } from './LoginModal';

export function PasswordInputBox(props: {
    helpText: string;
    userAuthState: UserAuthState.PASSWORD_CREATION | UserAuthState.PASSWORD_CREATION_MATCH_ERROR;
    onChange: ChangeEventHandler<HTMLInputElement>;
    testId: string;
}) {
    return (
        <>
            <p className="login-modal-input-help">{props.helpText}</p>
            <div
                className={`login-modal-input-inner-container${props.userAuthState === UserAuthState.PASSWORD_CREATION_MATCH_ERROR ? ' login-modal-input-inner-container-wrong-input' : ''}`}
            >
                <input
                    className="login-modal-input-text"
                    type="password"
                    onChange={props.onChange}
                    data-testid={props.testId}
                />
            </div>
        </>
    );
}
