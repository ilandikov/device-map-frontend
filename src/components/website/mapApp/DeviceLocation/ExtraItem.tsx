import React from 'react';
import { useMapAppState } from '../redux/MapAppState';
import { DeviceItemWaitingCreation } from './DeviceItemWaitingCreation';
import { CreateDeviceItem } from './CreateDeviceItem';
import { CreateAccountOrLoginItem } from './CreateAccountOrLoginItem';

export function ExtraItem() {
    const { loggedInUser, isDeviceCreationOngoing } = useMapAppState();

    if (loggedInUser === null) {
        return <CreateAccountOrLoginItem />;
    }

    if (isDeviceCreationOngoing) {
        return <DeviceItemWaitingCreation />;
    }

    return <CreateDeviceItem />;
}
