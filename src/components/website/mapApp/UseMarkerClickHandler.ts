import { LeafletMouseEvent } from 'leaflet';
import { useAppDispatch } from '../../../redux/store';
import { MapAppComponents, useMapAppState } from './redux/MapAppState';
import { mapAppSetLocationCoordinates, mapAppShowComponent } from './redux/MapAppAction';

export function useMarkerClickHandler() {
    const dispatch = useAppDispatch();
    const { selectedMarker } = useMapAppState();
    const selectedMarkerLocation = selectedMarker.location;

    return (event: LeafletMouseEvent) => {
        const alreadySelectedMarkerClicked =
            selectedMarkerLocation &&
            selectedMarkerLocation.lat === event.latlng.lat &&
            selectedMarkerLocation.lon === event.latlng.lng;
        if (alreadySelectedMarkerClicked) {
            return;
        }

        dispatch(mapAppSetLocationCoordinates({ lat: event.latlng.lat, lon: event.latlng.lng }));
        dispatch(mapAppShowComponent(MapAppComponents.DEVICE_LOCATION));
    };
}
