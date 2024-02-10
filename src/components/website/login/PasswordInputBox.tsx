import React, { ChangeEventHandler } from 'react';
import { UserAuthState } from './LoginModal';

export function PasswordInputBox(props: {
    userAuthState: UserAuthState;
    helpText: string;
    testId: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
}) {
    return (
        <>
            <p className="login-modal-input-help">{props.helpText}</p>
            <div
                className={`login-modal-input-box-container${props.userAuthState === UserAuthState.PASSWORD_CREATION_MATCH_ERROR ? ' login-modal-input-wrong' : ''}`}
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
