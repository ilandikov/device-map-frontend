/* External dependencies */
import React from 'react';
import { I18nextProvider } from 'gatsby-plugin-react-i18next';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { fireEvent, getByText, render } from '@testing-library/react';
import '@testing-library/jest-dom';

/* Local dependencies */
import i18n from '../../../../../tests/utils/i18nForTest';
import { configureTestStore } from '../../../../../tests/utils';
import { LoginModal, UserAuthState } from '../LoginModal';

jest.mock('gatsby-plugin-react-i18next', () => ({
    ...jest.requireActual('gatsby-plugin-react-i18next'),
    useI18next: jest.fn().mockImplementation(() => ({
        t: jest.fn().mockImplementation((val) => val),
    })),
}));

let setUserAuthState: jest.Mock;
function mockUseUserAuthState(initialUserAuthState: UserAuthState) {
    setUserAuthState = jest.fn();
    setUserAuthState.mockImplementation((userAuthState) => userAuthState);
    React.useState = jest
        .fn()
        .mockImplementationOnce(() => [initialUserAuthState, setUserAuthState])
        .mockImplementation((x) => [x, jest.fn()]);
}

describe('LoginModal snapshot tests', () => {
    const store = configureTestStore();

    function renderWithI18nextProviderAsJSON() {
        const component = (
            <I18nextProvider i18n={i18n}>
                <Provider store={store}>
                    <LoginModal />
                </Provider>
            </I18nextProvider>
        );
        return renderer.create(component).toJSON();
    }

    it('should match the snapshot at user welcome stage', () => {
        mockUseUserAuthState(UserAuthState.WELCOME);
        const component = renderWithI18nextProviderAsJSON();

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        mockUseUserAuthState(UserAuthState.MAIL_INPUT_START);
        const component = renderWithI18nextProviderAsJSON();

        expect(component).toMatchSnapshot();
    });
});

describe('LoginModal state transition tests', () => {
    const store = configureTestStore();

    function renderAtUserAuthState() {
        const component = (
            <Provider store={store}>
                <LoginModal />
            </Provider>
        );
        return render(component);
    }

    it('should transition from welcome state to email input state', () => {
        mockUseUserAuthState(UserAuthState.WELCOME);
        const { container } = renderAtUserAuthState();

        const registerButton = getByText(container, 'accountRegister');
        fireEvent.click(registerButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.MAIL_INPUT_START);
    });
});
