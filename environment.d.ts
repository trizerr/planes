// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Next from 'next';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: string;
      NEXT_PUBLIC_AVIATION_BASE_URL: string;
      NEXT_PUBLIC_AVIATION_API_KEY: string;
    }
  }
}
