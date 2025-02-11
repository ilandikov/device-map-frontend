import { LeafletMouseEvent } from 'leaflet';
import { useAppDispatch } from '../../../redux/store';
import { MapAppUsageStep, useMapAppState } from './redux/MapAppState';
import { mapAppSetLocationCoordinates, mapAppSetUsageStep } from './redux/MapAppAction';

export function useMarkerClickHandler() {
    const dispatch = useAppDispatch();
    const selectedMarkerLocation = useMapAppState().selectedMarker.location;

    return (event: LeafletMouseEvent) => {
        const alreadySelectedMarkerClicked =
            selectedMarkerLocation &&
            selectedMarkerLocation.lat === event.latlng.lat &&
            selectedMarkerLocation.lon === event.latlng.lng;
        if (alreadySelectedMarkerClicked) {
            return;
        }

        dispatch(mapAppSetLocationCoordinates({ lat: event.latlng.lat, lon: event.latlng.lng }));
        dispatch(mapAppSetUsageStep(MapAppUsageStep.DEVICE_MANAGEMENT));
    };
}
