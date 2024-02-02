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

describe('AboutUs component', () => {
    const store = configureTestStore();

    function renderAtUserAuthStateAsJSON(userAuthState: UserAuthState) {
        const component = (
            <I18nextProvider i18n={i18n}>
                <Provider store={store}>
                    <LoginModal initialUserAuthState={userAuthState} />
                </Provider>
            </I18nextProvider>
        );
        return renderer.create(component).toJSON();
    }

    it('should match the snapshot at user welcome stage', () => {
        const component = renderAtUserAuthStateAsJSON(UserAuthState.WELCOME);

        expect(component).toMatchSnapshot();
    });

    it('should match the snapshot at mail input stage', () => {
        const component = renderAtUserAuthStateAsJSON(UserAuthState.MAIL_INPUT_START);

        expect(component).toMatchSnapshot();
    });
});

describe('LoginModal state transition tests', () => {
    const store = configureTestStore();

    function renderAtUserAuthState(userAuthState: UserAuthState) {
        const component = (
            <Provider store={store}>
                <LoginModal initialUserAuthState={userAuthState} />
            </Provider>
        );
        return render(component);
    }

    const setUserAuthState = jest.fn();

    beforeEach(() => {
        setUserAuthState.mockImplementation((userAuthState) => userAuthState);
        React.useState = jest
            .fn()
            .mockImplementationOnce(() => [UserAuthState.WELCOME, setUserAuthState])
            .mockImplementation((x) => [x, jest.fn()]);
    });

    it('should transition from welcome state to email input state', () => {
        const { container } = renderAtUserAuthState(UserAuthState.WELCOME);

        const registerButton = getByText(container, 'accountRegister');
        fireEvent.click(registerButton);

        expect(setUserAuthState).toHaveBeenCalledWith(UserAuthState.MAIL_INPUT_START);
    });
});
