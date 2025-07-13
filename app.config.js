export default ({ config }) => ({
  ...config,
  expo: {
    ...config.expo,
    name: 'EchoStudy',
    slug: 'echostudy',
    owner: 'tinosolutions',
    version: '1.0.0',
    ios: {
      ...config.expo?.ios,
      bundleIdentifier: 'com.echostudy.app',
      infoPlist: {
        ...config.expo?.ios?.infoPlist,
        NSMicrophoneUsageDescription: 'EchoStudy uses your mic to evaluate spoken flashcard answers.',
        ITSAppUsesNonExemptEncryption: false, // ✅ Required for iOS builds
      },
    },
    plugins: ['expo-av'],
    extra: {
      ...config.expo?.extra,
      SUPABASE_URL: 'https://tkgiyaibgehowhlzjxjd.supabase.co',
      SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      eas: {
        projectId: 'eb0614d8-681a-42c0-a544-faaf7ee6ebe9', // ✅ Critical
      },
    },
  },
});
