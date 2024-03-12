import React from 'react';
import { fireEvent, getByTestId, render } from '@testing-library/react';
import { MapAppHeader } from '../MapAppHeader';

const mockDispatch = jest.fn();
jest.mock('react-redux', () => ({
    useDispatch: () => mockDispatch,
}));

describe('MapAppHeader action tests', () => {
    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should show login modal on login button click', () => {
        const { container } = render(<MapAppHeader />);

        const loginButton = getByTestId(container, 'loginButton');
        fireEvent.click(loginButton);

        expect(mockDispatch).toHaveBeenNthCalledWith(1);
    });
});
