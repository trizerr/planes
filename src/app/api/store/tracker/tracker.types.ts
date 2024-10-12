export type Flight = {
  geography: {
    latitude: number;
    direction: number;
    longitude: number;
    altitude: number;
  };
  flight: {
    iataNumber: string;
    icaoNumber: string;
    number: string;
  };
  departure: {
    iataCode: string;
    icaoCode: string;
  };
  arrival: {
    iataCode: string;
    icaoCode: string;
  };
  airline: {
    iataCode: string;
    icaoCode: string;
  };
  aircraft: {
    registration: string;
    icaoCode: string;
    icao24: string;
    regNumber: string;
  };
  speed: {
    horizontal: number;
    isGround: number;
    vspeed: number;
  };
  system: {
    updated: number;
  };
  status: string;
};

export type TrackerState = {
  flights: Flight[];
  error: any;
};
