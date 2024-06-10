
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Grid';
import OutlinedInput from '@mui/material/OutlinedInput';
import { Card } from '@mui/material';
import { styled } from '@mui/system';
import { useEffect, useRef, forwardRef, useImperativeHandle, useState } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';
import MapStyle from './Styles/MapStyle.json';
import useStore from '../../Hooks/useStore';
import './Styles/hide.css';
import { Steps } from 'intro.js-react';

const FormGrid = styled(Grid)(() => ({
  display: 'flex',
  flexDirection: 'column',
}));

const center = { lat: 48.8584, lng: 2.2945 };


// eslint-disable-next-line react/prop-types
const ShippingDetails = forwardRef(({Introsteps}, ref) => {
  const { setDuration, setDistance, directionsDisplay, setDirectionsDisplay, originAddress, destinationAddress, setOriginAddress, setDestinationAddress, origin, setOrigin, destination, setDestination, map, setMap } = useStore();
  const autocompleteOriginRef = useRef(null);
  const autocompleteDestinationRef = useRef(null);
  const [introEnabled, setIntroEnabled] = useState(true);
  const mapkey = import.meta.env.VITE_REACT_APP_MAP_KEY;

  const onExit = () => {
    setIntroEnabled(true);
  };



  useImperativeHandle(ref, () => ({
    isValid() {
      return originAddress && destinationAddress;
    }
  }));

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: mapkey,
    libraries: ['places']
  });

  const defaultMapOptions = {
    fullscreenControl: false,
    streetViewControl: false,
    zoomControl: false,
    mapTypeControl: false,
    styles: MapStyle
  };

  const onLoadOrigin = (autocomplete) => {
    autocompleteOriginRef.current = autocomplete;
  };

  const onLoadDestination = (autocomplete) => {
    autocompleteDestinationRef.current = autocomplete;
  };

  const onPlaceChangedOrigin = () => {
    const places = autocompleteOriginRef.current.getPlace();
    if (!places.geometry) {
      console.error("Returned place contains no geometry");
      return;
    }
    const newOrigin = { lat: places.geometry.location.lat(), lng: places.geometry.location.lng() };
    setOrigin(newOrigin);
    setOriginAddress(places.formatted_address);
    if (destination) {
      drawRoute(newOrigin, destination);
    }
  };

  const onPlaceChangedDestination = () => {
    const places = autocompleteDestinationRef.current.getPlace();
    if (!places.geometry) {
      console.error("Returned place contains no geometry");
      return;
    }
    const newDestination = { lat: places.geometry.location.lat(), lng: places.geometry.location.lng() };
    setDestination(newDestination);
    setDestinationAddress(places.formatted_address);
    if (origin) {
      drawRoute(origin, newDestination);
    }
  };

  useEffect(() => {
    if (isLoaded && map) {
      if (!directionsDisplay) {
        const newDirectionsDisplay = new window.google.maps.DirectionsRenderer();
        newDirectionsDisplay.setMap(map);
        setDirectionsDisplay(newDirectionsDisplay);
      } else {
        directionsDisplay.setMap(map);
      }
    }
  }, [isLoaded, map, directionsDisplay, setDirectionsDisplay]);
  

  const drawRoute = (newOrigin, newDestination) => {
    if (isLoaded && map && newOrigin && newDestination && directionsDisplay) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: newOrigin,
          destination: newDestination,
          travelMode: 'DRIVING',
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(result);
            const distanceService = new window.google.maps.DistanceMatrixService();
            distanceService.getDistanceMatrix(
              {
                origins: [newOrigin],
                destinations: [newDestination],
                travelMode: 'DRIVING',
              },
              (response, status) => {
                if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
                  const distance = response.rows[0].elements[0].distance.value / 1000; // Convertir de metros a kilómetros
                  const duration = response.rows[0].elements[0].duration.value / 60; // Convertir de segundos a minutos
                  setDistance(distance);
                  setDuration(duration);
                } else {
                  console.error('Error al calcular la distancia y duración', response);
                }
              }
            );
          } else {
            console.error("Directions request returned no results.", result);
          }
        }
      );
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Grid container spacing={3}>
      <Steps
        enabled={introEnabled}
        steps={Introsteps}
        initialStep={0}
        onExit={onExit}
      />
      <FormGrid item xs={12} id='step-origin'>
        <FormLabel htmlFor="actual" required>
          Origin
        </FormLabel>
        <Autocomplete
          onPlaceChanged={onPlaceChangedOrigin}
          onLoad={onLoadOrigin}
        >
        <OutlinedInput
          id="actual"
          name="actual"
          type="text"
          style={{ width: '100%' }}
          value={originAddress}
          onChange={(event) => setOriginAddress(event.target.value)}
        />
        </Autocomplete>
      </FormGrid>
      <FormGrid item xs={12} id='step-destination'>
        <FormLabel htmlFor="destino">Destination</FormLabel>
        <Autocomplete
          onPlaceChanged={onPlaceChangedDestination}
          onLoad={onLoadDestination}
        >
          <OutlinedInput
            id="destino"
            name="destino"
            style={{ width: '100%' }}
            type="text"
            placeholder="New York"
            value={destinationAddress}
            onChange={(event) => setDestinationAddress(event.target.value)}
          />
        </Autocomplete>
      </FormGrid>
      <FormGrid item xs={12}>
        <Card id='step-map'>
        <GoogleMap
            mapContainerStyle={{ minWidth: '600px', height: '400px' }}
            center={origin || center}
            zoom={15}
            options={defaultMapOptions}
            onLoad={setMap}
          >
          </GoogleMap>
        </Card>
        </FormGrid>
    </Grid>
  );
})

ShippingDetails.displayName = 'ShippingDetails';
export default ShippingDetails;
