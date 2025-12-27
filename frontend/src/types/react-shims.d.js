/* Conversion failed for react-shims.d.ts - original contents are below as a comment.
   Error: Debug Failure. Output generation failed */

import * as React from 'react';

// Minimal shims for React types used across the codebase in dev only.
declare module 'react' {
  // Keep existing types but add these in case the TS server fails to resolve them
  export type FC<P = {}> = React.FunctionComponent<P>;
  export type ComponentProps<T> = any;
  export type ComponentPropsWithoutRef<T> = any;
  export type MouseEvent = any;
  export type ElementRef<T> = any;
  export type ReactNode = any;
}
