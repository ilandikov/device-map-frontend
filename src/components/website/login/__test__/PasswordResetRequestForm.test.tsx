import { fireEvent, getByTestId, render } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { configureTestStore } from '../../../../../tests/utils';
import { PasswordResetRequestForm } from '../PasswordResetRequestForm';
import { resetHookMocks, setUserEmail } from './LoginModalTestHelpers';

const store = configureTestStore();

function componentWithStoreProvider(userEmail: string = '') {
    return render(
        <Provider store={store}>
            <PasswordResetRequestForm {...{ userEmail, setUserEmail }} />
        </Provider>,
    );
}

describe('rename me', () => {
    beforeEach(() => {
        resetHookMocks();
    });

    it('should update user mail when set', () => {
        const { container } = componentWithStoreProvider();

        const emailInput = getByTestId(container, 'emailInput');

        expect(emailInput).toBeInTheDocument();
        fireEvent.change(emailInput, { target: { value: 'new@email.com' } });

        expect(setUserEmail).toHaveBeenCalledWith('new@email.com');
    });
});
