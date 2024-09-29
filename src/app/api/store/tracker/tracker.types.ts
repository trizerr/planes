export type Flight = {
  geography: {
    latitude: number;
    longitude: number;
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
  aircraft: {
    registration: string;
    icaoCode: string;
    icao24: string;
    regNumber: string;
  };
  status: string;
};

export type TrackerState = {
  flights: Flight[];
  error: any;
};
