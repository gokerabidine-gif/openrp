import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.openrp.mobile',
  appName: 'OpenRP',
  webDir: 'dist',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#151a1b',
    allowMixedContent: false,
  },
};

export default config;
