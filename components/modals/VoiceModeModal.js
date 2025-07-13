import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';

export default function VoiceModeModal({ visible, onClose, term, definition, onNext }) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const recordingRef = useRef(null);

  useEffect(() => {
    if (visible) {
      startConversation();
    }
    return () => {
      stopRecording();
    };
  }, [visible]);

  const playRemoteAudio = async (url) => {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri: url });
      await sound.setVolumeAsync(1.0);
      await sound.playAsync();
      await new Promise((resolve) => {
        sound.setOnPlaybackStatusUpdate((status) => {
          if (status.didJustFinish) {
            sound.unloadAsync();
            resolve();
          }
        });
      });
    } catch (err) {
      console.error('🔊 Error playing audio:', err);
    }
  };

  const fetchAndPlayTTS = async (text) => {
    try {
      console.log('🟡 Sending to TTS:', text);

      const response = await fetch('http://192.168.0.187:5000/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });

      const data = await response.json();
      if (data.speechUrl) {
        console.log('🎧 Playing speech from:', data.speechUrl);
        await playRemoteAudio(`http://192.168.0.187:5000${data.speechUrl}`);
      } else {
        console.warn('⚠️ No speechUrl in response');
      }
    } catch (err) {
      console.error('❌ TTS error:', err.message || err);
    }
  };

  const startConversation = async () => {
    setFeedback('');

    // 🔊 Speak the term
    await fetchAndPlayTTS(term);

    // 🎙 Start recording after term is read
    await startRecording();

    setTimeout(async () => {
      await stopRecordingAndEvaluate();
    }, 4000);
  };

  const startRecording = async () => {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        console.warn('❌ Microphone permission denied');
        setFeedback('Microphone access denied.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

     const recordingOptions = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
    audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.caf',
    audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MAX,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  isMeteringEnabled: true,
};

const { recording } = await Audio.Recording.createAsync(recordingOptions);
      recordingRef.current = recording;
      console.log('🎙️ Recording started...');
    } catch (err) {
      console.error('🎙️ Error starting recording:', err);
      setFeedback('Failed to start recording.');
    }
  };

  const stopRecording = async () => {
    try {
      if (recordingRef.current) {
        await recordingRef.current.stopAndUnloadAsync();
        recordingRef.current = null;
      }
    } catch (err) {
      console.error('🎙️ Error stopping recording:', err);
    }
  };

  const stopRecordingAndEvaluate = async () => {
    setLoading(true);
    try {
      const recording = recordingRef.current;
      if (!recording) throw new Error('No active recording found.');

      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      recordingRef.current = null;

      const formData = new FormData();
      formData.append('audio', {
        uri,
        type: 'audio/m4a',
        name: 'voice.m4a',
      });
      formData.append('term', term);
      formData.append('definition', definition);

      const response = await fetch('http://192.168.0.187:5000/api/voice-check', {
        method: 'POST',
        body: formData,
      });

      const text = await response.text();
      console.log('🔍 Raw response:', text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error('❌ Failed to parse JSON:', err.message);
        setFeedback('Error: Invalid server response.');
        setLoading(false);
        return;
      }

      const spokenFeedback = data.evaluation || 'Response evaluated.';
      setFeedback(spokenFeedback);

      if (data.speechUrl) {
        await playRemoteAudio(`http://192.168.0.187:5000${data.speechUrl}`);
      }

      setTimeout(() => {
        setLoading(false);
        onClose();
        if (onNext) onNext();
      }, 1000);
    } catch (err) {
      console.error('❌ Error during voice flow:', err.message || err);
      setFeedback('Something went wrong.');
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modal}>
        {loading ? (
          <ActivityIndicator size="large" color="#3B82F6" />
        ) : (
          <View>
            <Text style={styles.title}>🧠 Voice Mode</Text>
            <Text style={styles.feedback}>{feedback}</Text>
            <Text style={styles.note}>Listening automatically...</Text>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#ffffffee',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  feedback: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  note: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
});
