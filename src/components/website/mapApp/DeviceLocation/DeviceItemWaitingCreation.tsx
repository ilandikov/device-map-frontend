import React from 'react';
import { T22Device } from '@mancho-school-t22/graphql-types';
import { DeviceItem } from './DeviceItem';

export function DeviceItemWaitingCreation(props: { device: T22Device }) {
    return <DeviceItem device={props.device} />;
}
