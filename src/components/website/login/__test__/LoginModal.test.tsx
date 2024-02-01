/* External dependencies */
import React from 'react';
import { I18nextProvider } from 'gatsby-plugin-react-i18next';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { queryByTestId, render } from '@testing-library/react';
import '@testing-library/jest-dom';

/* Local dependencies */
import i18n from '../../../../../tests/utils/i18nForTest';
import { configureTestStore } from '../../../../../tests/utils';
import { LoginModal } from '../LoginModal';

describe('AboutUs component', () => {
    const store = configureTestStore();

    function getRenderComponent() {
        return (
            <I18nextProvider i18n={i18n}>
                <Provider store={store}>
                    <LoginModal />
                </Provider>
            </I18nextProvider>
        );
    }

    it('should match the snapshot', () => {
        const component = renderer.create(getRenderComponent());

        expect(component.toJSON()).toMatchSnapshot();
    });

    it('should render elements on the welcome stage', () => {
        const { container } = render(getRenderComponent());

        const ellipses = queryByTestId(container, 'ellipses');
        expect(ellipses).toBeInTheDocument();
    });
});
