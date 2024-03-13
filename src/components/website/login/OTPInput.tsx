import React, { forwardRef } from 'react';

interface OTPInputProps {
    index: number;
    onChange: () => void;
}

export const OTPInput = forwardRef<HTMLInputElement>(function OTPInput(
    props: OTPInputProps,
    ref: React.Ref<HTMLInputElement> | null,
) {
    return (
        <input
            key={`OTPInput${props.index}`}
            data-testid={`OTPInput${props.index}`}
            type="number"
            pattern="[0-9]"
            maxLength={1}
            ref={ref}
            onFocus={(event) => (event.target.value = '')}
            onChange={props.onChange}
        />
    );
});
