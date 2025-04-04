
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.voicecalendar.app',
  appName: 'Voice Calendar',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  android: {
    backgroundColor: '#1e3a8a',
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
      releaseType: 'AAB',
    }
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e3a8a',
      showSpinner: true,
      androidSpinnerStyle: 'large',
      spinnerColor: '#64D2FF',
    }
  }
};

export default config;
