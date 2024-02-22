import { renderHook } from '@testing-library/react';
import { useCallbackWithoutError } from '../useCallbackWithoutError';

describe('Custom hook test', () => {
    const callbackMock = jest.fn();

    afterEach(() => {
        callbackMock.mockReset();
    });

    it('should not call callback after the first render without error', () => {
        renderHook(() => useCallbackWithoutError({ callback: callbackMock, error: null }));

        expect(callbackMock).toHaveBeenCalledTimes(0);
    });

    it('should call callback if there is no error on rerender', () => {
        const noError = null;
        const { rerender } = renderHook(() => useCallbackWithoutError({ callback: callbackMock, error: noError }));

        rerender({ callback: callbackMock, noError });

        expect(callbackMock).toHaveBeenCalledTimes(1);
    });

    it('should not call callback if error is still present on rerender', () => {
        const error = new Error('oops');
        const { rerender } = renderHook((props) => useCallbackWithoutError(props), {
            initialProps: { callback: callbackMock, error },
        });

        rerender({ callback: callbackMock, error: new Error('new oops') });

        expect(callbackMock).not.toHaveBeenCalled();
    });
});
