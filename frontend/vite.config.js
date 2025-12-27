
  import { defineConfig } from 'vite';
  import react from '@vitejs/plugin-react-swc';
  import path from 'path';

  export default defineConfig({
    plugins: [react()],
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
  'vaul': 'vaul',
  'sonner': 'sonner',
  'recharts': 'recharts',
  'react-resizable-panels': 'react-resizable-panels',
  'react-hook-form': 'react-hook-form',
  'react-day-picker': 'react-day-picker',
  'lucide-react': 'lucide-react',
  'input-otp': 'input-otp',
  'figma:asset/3f22f5e1924a1155508264d926209679c69c4d58.png': path.resolve(__dirname, './src/assets/3f22f5e1924a1155508264d926209679c69c4d58.png'),
  'figma:asset/0d614d647708b531941f50b65044707def9ffe56.png': path.resolve(__dirname, './src/assets/0d614d647708b531941f50b65044707def9ffe56.png'),
  'figma:asset/10ee7b9df1348eac2536593117bd0e60529f8059.png': path.resolve(__dirname, './src/assets/10ee7b9df1348eac2536593117bd0e60529f8059.png'),
  'figma:asset/zomato.png': path.resolve(__dirname, './src/assets/zomato.png'),
  'figma:asset/zomato.jpg': path.resolve(__dirname, './src/assets/zomato.jpg'),
  'figma:asset/ecommerce.png': path.resolve(__dirname, './src/assets/ecommerce.png'),
  'figma:asset/ecommerce.jpg': path.resolve(__dirname, './src/assets/ecommerce.jpg'),
  'figma:asset/blinkit.png': path.resolve(__dirname, './src/assets/blinkit.png'),
  'figma:asset/blinkit.jpg': path.resolve(__dirname, './src/assets/blinkit.jpg'),
  'figma:asset/apolo.png': path.resolve(__dirname, './src/assets/apolo.png'),
  'figma:asset/apolo.jpg': path.resolve(__dirname, './src/assets/apolo.jpg'),
  'embla-carousel-react': 'embla-carousel-react',
  'cmdk': 'cmdk',
  'class-variance-authority': 'class-variance-authority',
        '@radix-ui/react-tooltip@1.1.8': '@radix-ui/react-tooltip',
        '@radix-ui/react-toggle@1.1.2': '@radix-ui/react-toggle',
        '@radix-ui/react-toggle-group@1.1.2': '@radix-ui/react-toggle-group',
        '@radix-ui/react-tabs@1.1.3': '@radix-ui/react-tabs',
        '@radix-ui/react-switch@1.1.3': '@radix-ui/react-switch',
        '@radix-ui/react-slot@1.1.2': '@radix-ui/react-slot',
        '@radix-ui/react-slider@1.2.3': '@radix-ui/react-slider',
        '@radix-ui/react-separator@1.1.2': '@radix-ui/react-separator',
        '@radix-ui/react-select@2.1.6': '@radix-ui/react-select',
        '@radix-ui/react-scroll-area@1.2.3': '@radix-ui/react-scroll-area',
        '@radix-ui/react-radio-group@1.2.3': '@radix-ui/react-radio-group',
        '@radix-ui/react-progress@1.1.2': '@radix-ui/react-progress',
        '@radix-ui/react-popover@1.1.6': '@radix-ui/react-popover',
        '@radix-ui/react-navigation-menu@1.2.5': '@radix-ui/react-navigation-menu',
        '@radix-ui/react-menubar@1.1.6': '@radix-ui/react-menubar',
        '@radix-ui/react-label@2.1.2': '@radix-ui/react-label',
        '@radix-ui/react-hover-card@1.1.6': '@radix-ui/react-hover-card',
        '@radix-ui/react-dropdown-menu@2.1.6': '@radix-ui/react-dropdown-menu',
        '@radix-ui/react-dialog@1.1.6': '@radix-ui/react-dialog',
        '@radix-ui/react-context-menu@2.2.6': '@radix-ui/react-context-menu',
        '@radix-ui/react-collapsible@1.1.3': '@radix-ui/react-collapsible',
        '@radix-ui/react-checkbox@1.1.4': '@radix-ui/react-checkbox',
        '@radix-ui/react-avatar@1.1.3': '@radix-ui/react-avatar',
        '@radix-ui/react-aspect-ratio@1.1.2': '@radix-ui/react-aspect-ratio',
        '@radix-ui/react-alert-dialog@1.1.6': '@radix-ui/react-alert-dialog',
        '@radix-ui/react-accordion@1.2.3': '@radix-ui/react-accordion',
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'esnext',
      outDir: 'dist',
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react')) return 'vendor_react';
              if (id.includes('lucide-react')) return 'vendor_icons';
              if (id.includes('@radix-ui')) return 'vendor_radix';
              return 'vendor_misc';
            }
          }
        }
      }
    },
    server: {
      port: 3000,
      open: true,
    },
  });