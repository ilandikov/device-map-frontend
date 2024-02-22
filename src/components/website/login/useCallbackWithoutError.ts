import { useEffect, useRef } from 'react';

export function useCallbackWithoutError(props: { callback: () => void; error: Error | null }) {
    const hasMounted = useRef(false);

    useEffect(() => {
        if (hasMounted.current === false) {
            hasMounted.current = true;
            return;
        }

        if (props.error) {
            return;
        }

        props.callback();
    }, [props.error]);
}
