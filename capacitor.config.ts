
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.563873e733ab4670996e9112fa27fbdb',
  appName: 'luxe-villa-stay-app',
  webDir: 'dist',
  server: {
    url: 'https://563873e7-33ab-4670-996e-9112fa27fbdb.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  android: {
    backgroundColor: "#FFFFFF",
    allowMixedContent: true,
    buildOptions: {
      keystorePath: null,
      keystorePassword: null,
      keystoreAlias: null,
      keystoreAliasPassword: null,
      releaseType: "APK"
    }
  }
};

export default config;
