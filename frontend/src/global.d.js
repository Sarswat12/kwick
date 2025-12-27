/* Conversion failed for global.d.ts - original contents are below as a comment.
   Error: Debug Failure. Output generation failed */

// Global TypeScript declarations to help the editor when some library types are missing
declare module 'react';
declare module 'react/jsx-runtime';

// Fallback JSX namespace so files with custom elements or missing lib types don't error in the editor.
// This is intentionally permissive — consider removing or tightening once types are resolved project-wide.
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
