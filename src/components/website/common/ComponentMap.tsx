import { ReactElement } from 'react';

type EnumConstraint = string | number | symbol;

export type ComponentMap<TStep extends EnumConstraint> = {
    [key in TStep]: ReactElement;
};
