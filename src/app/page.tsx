'use client';
import React, { useCallback, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/api/store/store';
import flightDelayThunks from '@/app/api/store/tracker/tracker.thunks';
import { selectFlights } from '@/app/api/store/tracker/tracker.selectors';
import {
  GoogleMap,
  LoadScript,
  Marker,
  MarkerClusterer,
} from '@react-google-maps/api';
import { Stack } from '@mui/system';
import CloseIcon from './icons/close.svg';
import { Button, CircularProgress, Typography } from '@mui/material';
import { format } from 'date-fns';
import { Flight } from '@/app/api/store/tracker/tracker.types';

export default function Home() {
  const dispatch = useAppDispatch();
  //select flights information from storage
  const flights = useAppSelector(selectFlights);

  //Current clicked plane
  const [selectedFlight, setSelectedFlight] = React.useState<Flight | null>(
    null
  );

  const [finishedClusters, setFinishedClusters] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(true);

  useEffect(() => {
    // Fetch flights on app initialization
    dispatch(flightDelayThunks.getFlights());
  }, []);

  const isClustering =
    (process.env.NODE_ENV === 'development'
      ? flights.length > finishedClusters / 3
      : flights.length > finishedClusters) ||
    finishedClusters === 0 ||
    flights.length === 0;

  console.log('isClustering', isClustering);
  console.log('finishedClusters', finishedClusters);
  console.log('flights.length', flights.length);

  useEffect(() => {
    console.log('isClustering!', isClustering);
    console.log('finishedClusters!', finishedClusters);
    console.log('flights.length!', flights.length);
    setTimeout(() => {
      console.log('isClustering timeout', isClustering);
      setIsLoading(isClustering);
    }, 0);
  }, [isClustering]);
  //
  // requestIdleCallback(() => {
  //   setIsLoading(isClustering);
  // });

  const flightsMemoized = useCallback(
    (clusterer: any) => {
      return flights.map((flight) => {
        //generate url of svg depending on the direction of the flight
        const url =
          'data:image/svg+xml;charset=UTF-8;base64,' +
          btoa(generateSvg(originalSvg, flight.geography.direction));

        return (
          <Marker
            icon={{
              url,
              //@ts-ignore
              scaledSize: { width: 30, height: 30 },
            }}
            onClick={() => setSelectedFlight(flight)}
            key={flight.flight.icaoNumber}
            position={{
              lat: flight.geography.latitude,
              lng: flight.geography.longitude,
            }}
            clusterer={clusterer}
          />
        );
      });
    },
    [flights]
  );
  return (
    <Stack>
      {isLoading && (
        <Stack
          position={'absolute'}
          width={'100%'}
          height={'100%'}
          zIndex={2}
          justifyContent={'center'}
          alignItems={'center'}
          bgcolor={'rgba(39, 55, 77, 0.5)'}
        >
          <CircularProgress
            variant="indeterminate"
            value={finishedClusters / flights.length}
          />
          <Typography>Loading...</Typography>
        </Stack>
      )}
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      >
        <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
          <MarkerClusterer
            batchSizeIE={30}
            onClusteringEnd={() => {
              console.log('onClusteringEnd');
              setFinishedClusters((prev) => {
                return prev + 1;
              });
            }}
          >
            {(clusterer) => {
              return <>{flightsMemoized(clusterer)}</>;
            }}
          </MarkerClusterer>
        </GoogleMap>
      </LoadScript>
      {selectedFlight && (
        <Stack
          position={'absolute'}
          width={'500px'}
          height={'400px'}
          bottom={24}
          left={24}
          borderRadius={8}
          bgcolor={'rgba(39, 55, 77, 0.9)'}
          p={'16px'}
        >
          <Stack direction={'row'} justifyContent={'space-between'}>
            <Typography fontSize={'20px'} lineHeight={'20px'} fontWeight={600}>
              Aircraft
            </Typography>
            <Stack direction={'row'} alignItems={'center'}>
              <Typography fontSize={'20px'} lineHeight={'20px'} pr={'4px'}>
                Updated at:{' '}
                {format(
                  new Date(selectedFlight.system.updated * 1000),
                  'MMM dd, HH:mm'
                )}
              </Typography>
              <Button
                variant={'text'}
                onClick={() => setSelectedFlight(null)}
                sx={{
                  width: '16px',
                  padding: 0,
                  minWidth: 0,
                }}
              >
                <CloseIcon />
              </Button>
            </Stack>
          </Stack>
          <Devider />
          <Stack direction={'row'}>
            <Stack spacing={'8px'}>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Reg Number:{' '}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                IcaoCode:{' '}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Arrival:{' '}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Departure:{' '}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Flight:{' '}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Airline:{' '}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Status:{' '}
              </Typography>
            </Stack>
            <VerticalDevider />
            <Stack spacing={'8px'}>
              <Typography
                fontSize={'20px'}
                fontWeight={500}
                height={'20px'}
                lineHeight={'20px'}
              >
                {selectedFlight.aircraft.regNumber}{' '}
              </Typography>
              <Typography
                fontSize={'20px'}
                fontWeight={500}
                height={'20px'}
                lineHeight={'20px'}
              >
                {selectedFlight.aircraft.icaoCode}{' '}
              </Typography>
              <Typography
                fontSize={'20px'}
                fontWeight={500}
                height={'20px'}
                lineHeight={'20px'}
              >
                {selectedFlight.arrival.icaoCode}{' '}
              </Typography>
              <Typography
                fontSize={'20px'}
                fontWeight={500}
                height={'20px'}
                lineHeight={'20px'}
              >
                {selectedFlight.departure.icaoCode}{' '}
              </Typography>
              <Typography
                fontSize={'20px'}
                fontWeight={500}
                height={'20px'}
                lineHeight={'20px'}
              >
                {selectedFlight.flight.icaoNumber}{' '}
              </Typography>
              <Typography
                fontSize={'20px'}
                fontWeight={500}
                height={'20px'}
                lineHeight={'20px'}
              >
                {selectedFlight.airline.icaoCode}{' '}
              </Typography>
              <Typography
                fontSize={'20px'}
                height={'20px'}
                fontWeight={500}
                lineHeight={'20px'}
              >
                {selectedFlight.status}{' '}
              </Typography>
            </Stack>
          </Stack>
          <Devider />
          <Stack direction={'row'}>
            <Stack spacing={'8px'}>
              <Typography
                fontSize={'20px'}
                lineHeight={'20px'}
                fontWeight={600}
              >
                Position{' '}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Latitude: {selectedFlight.geography.latitude}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Longitude: {selectedFlight.geography.longitude}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Direction: {selectedFlight.geography.direction}
              </Typography>
            </Stack>
            <VerticalDevider />
            <Stack spacing={'8px'}>
              <Typography
                fontSize={'20px'}
                lineHeight={'20px'}
                fontWeight={600}
              >
                Speed{' '}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Horizontal: {selectedFlight.speed.horizontal}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Vertical: {selectedFlight.speed.vspeed}
              </Typography>
              <Typography fontSize={'20px'} lineHeight={'20px'}>
                Altitude: {selectedFlight.geography.altitude}
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      )}
    </Stack>
  );
}

const containerStyle = {
  width: '100vw',
  height: '100vh',
};

const center = {
  lat: 50.450001,
  lng: 30.523333,
};

const Devider = () => {
  return <Stack height={'2px'} bgcolor={'white'} width={'100%'} my={'8px'} />;
};

const VerticalDevider = () => {
  return <Stack width={'2px'} bgcolor={'white'} height={'100%'} mx={'8px'} />;
};

const generateSvg = (svgCode: any, angle: any) => {
  // Ensure the angle is within 0-360 degrees
  angle = angle % 360;

  // Create a DOM parser to parse the SVG string
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(svgCode, 'image/svg+xml');

  // Find the first <g> element
  const gElement = xmlDoc.querySelector('svg > g');

  if (gElement) {
    // Get the existing transform attribute
    let transform = gElement.getAttribute('transform') || '';

    // Append the rotation to the transform attribute
    transform += ` rotate(${angle} 256 256)`;

    // Set the new transform attribute
    gElement.setAttribute('transform', transform);

    // Serialize the updated SVG back to a string
    const serializer = new XMLSerializer();
    const newSVGCode = serializer.serializeToString(xmlDoc);

    return newSVGCode;
  } else {
    console.error('No <g> element found in the SVG.');
    return svgCode;
  }
};

const originalSvg = `<svg height="800px" width="800px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 512 512" xml:space="preserve">
<g transform="translate(1 1)">
	<g>
		<path style="fill:#FD9808;" d="M425.667,361.667L306.2,263.533V170.52c0-13.653-6.827-26.453-17.067-34.133
			c0-2.56,0-5.973,0-8.533c23.893,0,43.52,18.773,43.52,42.667v93.013l119.467,98.133c10.24,7.68,17.067,20.48,17.067,34.133v12.8
			h-25.6v-12.8C442.733,382.147,436.76,370.2,425.667,361.667"/>
		<polygon style="fill:#FD9808;" points="289.133,408.6 314.733,408.6 374.467,502.467 343.747,494.787 		"/>
	</g>
	<g>
		<path style="fill:#FFFFFF;" d="M84.333,361.667L203.8,263.533V170.52c0-13.653,6.827-26.453,17.067-34.133c0-2.56,0-5.973,0-8.533
			c-23.893,0-43.52,18.773-43.52,42.667v93.013L58.733,361.667c-10.24,7.68-17.067,20.48-17.067,34.133v12.8h25.6v-12.8
			C67.267,382.147,73.24,370.2,84.333,361.667"/>
		<polygon style="fill:#FFFFFF;" points="220.867,408.6 195.267,408.6 135.533,502.467 166.253,494.787 		"/>
	</g>
	<g>
		<path style="fill:#FFDD09;" d="M220.867,442.733l25.6-290.133c0-8.533,0-17.067,0.853-25.6c-23.893,0-43.52,18.773-52.053,42.667
			v93.867L84.333,361.667c-10.24,7.68-17.067,20.48-17.067,34.133v12.8h153.6l-59.733,93.867L203.8,485.4L220.867,442.733z"/>
		<path style="fill:#FFDD09;" d="M289.133,442.733l-25.6-290.133c0-8.533,0-17.067-0.853-25.6c23.893,0,43.52,18.773,52.053,42.667
			v93.867l110.933,98.133c10.24,7.68,17.067,20.48,17.067,34.133v12.8h-153.6l59.733,93.867L306.2,485.4L289.133,442.733z"/>
	</g>
	<g>
		<path style="fill:#FCC309;" d="M289.133,442.733l-0.853,1.707c-17.067,21.333-48.64,21.333-65.707,0l-1.707-1.707V152.6
			c-0.853-44.373,6.827-89.6,21.333-132.267l1.707-4.267c3.413-11.093,19.627-11.093,23.04,0l1.707,4.267
			C282.307,63,289.987,108.227,289.133,152.6V442.733z"/>
		<polygon style="fill:#FCC309;" points="169.667,323.267 195.267,348.867 169.667,374.467 144.067,348.867 		"/>
		<polygon style="fill:#FCC309;" points="340.333,323.267 365.933,348.867 340.333,374.467 314.733,348.867 		"/>
	</g>
	<path d="M255,469.187c-15.36,0-29.867-6.827-39.253-18.773l-0.853-1.707c-1.707-1.707-2.56-3.413-2.56-5.973V152.6
		c-0.853-41.813,5.973-88.747,21.333-134.827l1.707-4.267C237.933,4.973,245.613-1,255-1l0,0c9.387,0,17.067,5.973,19.627,14.507
		l1.707,4.267c15.36,46.08,23.04,92.16,21.333,134.827v290.133c0,1.707-0.853,4.267-1.707,5.12l-0.853,1.707
		C284.867,462.36,270.36,469.187,255,469.187z M229.4,440.173c6.827,7.68,15.36,11.947,25.6,11.947s19.627-4.267,25.6-11.947V152.6
		c0.853-40.96-5.973-85.333-20.48-128.853l-1.707-4.267c-0.853-2.56-2.56-2.56-3.413-2.56l0,0c-0.853,0-2.56,0-3.413,2.56
		l-1.707,4.267c-14.507,43.52-21.333,88.747-20.48,128.853V440.173z M289.133,442.733L289.133,442.733L289.133,442.733z"/>
	<path d="M374.467,511c-0.853,0-1.707,0-1.707,0l-68.267-17.067c-2.56-0.853-5.12-2.56-5.973-5.12l-17.067-42.667
		c0-0.853-0.853-1.707-0.853-3.413V152.6c0-7.68,0-15.36-0.853-24.747c0-2.56,0.853-4.267,2.56-5.973s3.413-2.56,5.973-2.56
		c13.653,0,26.453,5.12,36.693,15.36c9.387,9.387,15.36,23.04,15.36,36.693v89.6l116.907,95.573
		c11.947,9.387,19.627,24.747,19.627,40.107V408.6c0,5.12-3.413,8.533-8.533,8.533h-138.24l51.2,81.067
		c1.707,2.56,1.707,6.827,0,9.387C379.587,510.147,377.027,511,374.467,511z M312.173,478.573l43.52,11.093l-48.64-75.947
		c-1.707-2.56-1.707-5.973,0-8.533c1.707-2.56,4.267-4.267,7.68-4.267H459.8v-4.267c0-10.24-5.12-20.48-13.653-27.307L326.68,270.36
		c-2.56-1.707-3.413-4.267-3.413-6.827V170.52c0-9.387-3.413-17.92-10.24-24.747c-4.267-4.267-9.387-7.68-15.36-8.533
		c0,5.973,0,11.093,0,16.213V441.88L312.173,478.573z"/>
	<path d="M135.533,511c-2.56,0-5.12-1.707-6.827-3.413c-1.707-2.56-2.56-6.827,0-9.387l51.2-81.067H41.667
		c-5.12,0-8.533-3.413-8.533-8.533v-12.8c0-15.36,7.68-30.72,19.627-40.96l116.907-94.72v-89.6c0-13.653,5.12-26.453,15.36-36.693
		c9.387-9.387,22.187-14.507,36.693-15.36c2.56,0,4.267,0.853,5.973,2.56c1.707,1.707,2.56,4.267,2.56,5.973
		c-0.853,10.24-0.853,17.92-0.853,25.6v290.133c0,0.853,0,2.56-0.853,3.413l-17.067,42.667c-0.853,2.56-3.413,4.267-5.973,5.12
		L137.24,511C137.24,511,136.387,511,135.533,511z M50.2,400.067h145.067c3.413,0,5.973,1.707,7.68,4.267
		c1.707,2.56,1.707,5.973,0,8.533l-48.64,75.947l43.52-11.093l14.507-36.693V152.6c0-5.12,0-10.24,0-15.36
		c-5.973,1.707-11.093,4.267-15.36,8.533c-6.827,6.827-10.24,15.36-10.24,24.747v93.013c0,2.56-0.853,5.12-3.413,6.827
		L63.853,368.493C55.32,375.32,50.2,385.56,50.2,395.8C50.2,395.8,50.2,400.067,50.2,400.067z M220.867,442.733L220.867,442.733
		L220.867,442.733z"/>
	<path d="M41.667,451.267c-5.12,0-8.533-3.413-8.533-8.533V408.6c0-5.12,3.413-8.533,8.533-8.533S50.2,403.48,50.2,408.6v34.133
		C50.2,447.853,46.787,451.267,41.667,451.267z"/>
	<path d="M468.333,451.267c-5.12,0-8.533-3.413-8.533-8.533V408.6c0-5.12,3.413-8.533,8.533-8.533c5.12,0,8.533,3.413,8.533,8.533
		v34.133C476.867,447.853,473.453,451.267,468.333,451.267z"/>
	<path d="M118.467,417.133h-76.8c-5.12,0-8.533-3.413-8.533-8.533v-12.8c0-15.36,7.68-30.72,19.627-40.96l59.733-46.08
		c2.56-1.707,5.973-2.56,9.387-0.853c2.56,1.707,5.12,4.267,5.12,7.68V408.6C127,413.72,123.587,417.133,118.467,417.133z
		 M50.2,400.067h59.733v-67.413l-46.08,35.84C55.32,374.467,50.2,384.707,50.2,395.8C50.2,395.8,50.2,400.067,50.2,400.067z"/>
	<path d="M468.333,417.133h-76.8c-5.12,0-8.533-3.413-8.533-8.533v-92.16c0-3.413,1.707-5.973,5.12-7.68
		c2.56-1.707,5.973-0.853,9.387,0.853l59.733,46.08c12.8,9.387,19.627,24.747,19.627,40.96V408.6
		C476.867,413.72,473.453,417.133,468.333,417.133z M400.067,400.067H459.8V395.8c0-10.24-5.12-20.48-13.653-27.307l-46.08-34.987
		V400.067z"/>
	<path d="M169.667,383c-2.56,0-4.267-0.853-5.973-2.56l-25.6-25.6c-3.413-3.413-3.413-8.533,0-11.947l25.6-25.6
		c3.413-3.413,8.533-3.413,11.947,0l25.6,25.6c3.413,3.413,3.413,8.533,0,11.947l-25.6,25.6
		C173.933,382.147,172.227,383,169.667,383z M156.013,348.867l13.653,13.653l13.653-13.653l-13.653-13.653L156.013,348.867z"/>
	<path d="M340.333,383c-2.56,0-4.267-0.853-5.973-2.56l-25.6-25.6c-3.413-3.413-3.413-8.533,0-11.947l25.6-25.6
		c3.413-3.413,8.533-3.413,11.947,0l25.6,25.6c3.413,3.413,3.413,8.533,0,11.947l-25.6,25.6C344.6,382.147,342.893,383,340.333,383z
		 M326.68,348.867l13.653,13.653l13.653-13.653l-13.653-13.653L326.68,348.867z"/>
</g>
</svg>`;
