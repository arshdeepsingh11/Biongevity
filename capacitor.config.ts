import type { CapacitorConfig } from "@capacitor/cli";

/** Wraps the static Next.js export (./out) as the iOS / Android app. */
const config: CapacitorConfig = {
  appId: "com.bioaro.biongevity",
  appName: "Biongevity",
  webDir: "out",
  ios: { contentInset: "always" },
  android: { allowMixedContent: false },
};

export default config;
