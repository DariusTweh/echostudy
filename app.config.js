export default () => ({
  expo: {
    name: 'EchoStudy',
    slug: 'echostudy',
    owner: 'tinosolutions', // 👈 critical for linking
    version: '1.0.0',
    ios: {
      bundleIdentifier: 'com.echostudy.app',
      infoPlist: {
        NSMicrophoneUsageDescription: 'EchoStudy uses your mic to evaluate spoken flashcard answers.',
      },
    },
    plugins: ['expo-av'],
    extra: {
      SUPABASE_URL: 'https://tkgiyaibgehowhlzjxjd.supabase.co',
      SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    },
  },
});
