import React from 'react';
import { render } from '@testing-library/react';
import * as prettier from 'prettier';
import { Options } from 'approvals/lib/Core/Options';
import { verify } from 'approvals/lib/Providers/Jest/JestApprovals';
import {
    click,
    componentWithStoreProvider,
    testDispatchedAction,
    testSnapshot,
    testValueInInput,
    type,
} from '../../../../../tests/utils/RenderingHelpers';
import { LogInForm } from '../LogInForm';
import {
    LoginModalButton,
    LoginModalCheck,
    LoginModalInputType,
    loginModalButtonClick,
    loginModalInput,
    loginModalRemoteRequest,
} from '../redux/LoginModalAction';
import { mockAuthenticationState, mockDispatch, mockPrepareSelector } from '../../../../redux/__mocks__/mocks';
import { AuthenticationStep } from '../redux/AuthenticationState';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useDispatch: () => mockDispatch,
    useSelector: () => mockPrepareSelector(),
}));

function prettifyHTML(html: string) {
    return prettier.format(html, {
        parser: 'html',
        bracketSameLine: true,
        htmlWhitespaceSensitivity: 'ignore',
        printWidth: 120,
    });
}

function verifyComponent(component: React.JSX.Element) {
    const { container } = render(componentWithStoreProvider(component));
    const htmlOutput = prettifyHTML(container.innerHTML);
    const options = new Options().forFile().withFileExtention('.html');
    verify(htmlOutput, options);
}

describe('LogInForm snapshot test', () => {
    it('should match snapshot without error', () => {
        mockAuthenticationState({ email: 'verify@me.uk', password: 'password1' });

        verifyComponent(<LogInForm />);
    });

    it('should match snapshot with error', () => {
        mockAuthenticationState({ error: new Error('somethingIsWrong') });

        testSnapshot(<LogInForm />);
    });
});

describe('LogInForm action tests', () => {
    beforeEach(() => {
        mockDispatch.mockReset();
    });

    it.each([
        {
            name: 'should update the user email on input on password input stage',
            state: { step: AuthenticationStep.LOGIN },
            userAction: () => type(<LogInForm />, 'emailInput', 'hereIsMyMail@server.com'),
            dispatched: loginModalInput(LoginModalInputType.EMAIL, 'hereIsMyMail@server.com'),
        },
        {
            name: 'should update user password when typed',
            state: {},
            userAction: () => type(<LogInForm />, 'passwordInput', 'strongPassword'),
            dispatched: loginModalInput(LoginModalInputType.PASSWORD, 'strongPassword'),
        },
        {
            name: 'should call user authentication when next button is pressed',
            state: {},
            userAction: () => click(<LogInForm />, 'nextButton'),
            dispatched: loginModalRemoteRequest(LoginModalCheck.NONE),
        },
        {
            name: 'should update user password when typed',
            state: {},
            userAction: () => click(<LogInForm />, 'resetPasswordButton'),
            dispatched: loginModalButtonClick(LoginModalButton.RESET_PASSWORD),
        },
    ])('$name', ({ state, userAction, dispatched }) => {
        mockAuthenticationState(state);

        userAction();

        testDispatchedAction(dispatched);
    });
});

describe('LogInForm state connection tests', () => {
    it('should render email and password', () => {
        mockAuthenticationState({ email: 'here_is_my@email.com', password: 'hereIsMyPassword' });

        testValueInInput(<LogInForm />, 'emailInput', 'here_is_my@email.com');
        testValueInInput(<LogInForm />, 'passwordInput', 'hereIsMyPassword');
    });
});
