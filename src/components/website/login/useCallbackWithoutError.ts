import { useEffect, useRef } from 'react';

export function useCallbackWithoutError(props: { callback: () => void; error: Error | null }) {
    const hasMounted = useRef(false);

    useEffect(() => {
        if (hasMounted.current === false) {
            // console.log('custom hook: skip first');
            hasMounted.current = true;
            return;
        }

        if (props.error) {
            // console.log('custom hook: error detected, skip');
            return;
        }

        // console.log(props.error);
        // console.log('custom hook: callback');
        props.callback();
    });
}
