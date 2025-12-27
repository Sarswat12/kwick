/* Conversion failed for global-shims.d.ts - original contents are below as a comment.
   Error: Debug Failure. Output generation failed */

// Auto-generated quick shims to silence missing type declarations during local development.
// These are pragmatic stubs — for a proper fix install @types packages or add specific typings.

declare module '*';

// Provide wildcard for scoped radix packages
declare module '@radix-ui/*';

// Common packages used in the project (shims)
declare module 'lucide-react';
declare module 'sonner';
declare module 'recharts';
declare module 'embla-carousel-react';
declare module 'class-variance-authority';
declare module 'cmdk';
declare module 'input-otp';
declare module 'vaul';
declare module 'react-day-picker';
declare module 'react-resizable-panels';
declare module 'react-hook-form';
declare module 'tailwind-merge';
declare module 'clsx';

// allow any other imports to succeed
interface NodeModule {
  hot?: any;
}
