/// <reference path="../.astro/types.d.ts" />

declare global {
  interface Window {
    fontsReadyDispatched?: boolean;
  }
}

export {};