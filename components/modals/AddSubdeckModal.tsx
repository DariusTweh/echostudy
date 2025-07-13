import React, { useState,useEffect  } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Papa from 'papaparse';
import { supabase } from '../../api/supabaseClient';
export default function AddSubdeckModal({ visible, onClose, onSubmit, activeParentDeckId,onImportComplete }) {
  const [subdeckName, setSubdeckName] = useState('');
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  const [error, setError] = useState('');

 const handleAdd = () => {
  if (pdfGenerated) return; // ⛔ don’t run if already created via PDF

  const trimmed = subdeckName.trim();
  if (!trimmed) {
    setError('Subdeck name is required.');
    return;
  }

  onSubmit(trimmed);
  setSubdeckName('');
  setError('');
  onClose();
};
useEffect(() => {
  if (visible) setPdfGenerated(false);
}, [visible]);

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.keyboardContainer}
        >
          <View style={styles.container}>
            <Text style={styles.title}>Create Subdeck</Text>

            <TextInput
              style={styles.input}
              placeholder="Subdeck name"
              placeholderTextColor="#9CA3AF"
              value={subdeckName}
              onChangeText={(text) => {
                setSubdeckName(text);
                setError('');
              }}
            />

           <TouchableOpacity
  style={styles.fileButton}
onPress={async () => {
  try {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (result.canceled) return;

    const pdfUri = result.assets[0].uri;
    const subdeckNameTrimmed = subdeckName.trim();

    if (!subdeckNameTrimmed) {
      setError('Please enter a subdeck name before importing.');
      return;
    }

    // ✅ Step 1: Create the deck first with 'generating' status
    const { data: deckData, error: deckError } = await supabase
      .from('flashcard_decks')
      .insert([{ 
        title: subdeckNameTrimmed,
        parent_deck_id: activeParentDeckId,
        status: 'generating'
      }])
      .select()
      .single();

    if (deckError) {
      console.error('❌ Deck creation error:', deckError);
      setError('Failed to create subdeck.');
      return;
    }

    const newDeckId = deckData.id;

    // ✅ Step 2: Close modal & clear input
    setSubdeckName('');
    setError('');
    onClose(); // close immediately

    // ✅ Step 3: Upload PDF in background (no blocking UI)
    const formData = new FormData();
    formData.append('deckId', newDeckId);
    formData.append('file', {
      uri: pdfUri,
      name: result.assets[0].name,
      type: 'application/pdf',
    });

    fetch('http://192.168.0.187:5000/api/flashcards/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formData,
    })
      .then(() => {
        // Optional: callback to reload decks when done
        if (onImportComplete) {
          onImportComplete(newDeckId, subdeckNameTrimmed);
        }
      })
      .catch(e => {
        console.error('❌ PDF processing failed:', e);
      });

  } catch (e) {
    console.error('❌ PDF import error:', e);
    setError('Something went wrong.');
  }
}}
>
  <Text style={styles.fileButtonText}>📄 Generate from PDF</Text>
</TouchableOpacity>


            {error ? <Text style={styles.error}>{error}</Text> : null}

            <View style={styles.buttonRow}>
              <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
  onPress={handleAdd}
  style={[
    styles.submitButton,
    pdfGenerated && { backgroundColor: '#9CA3AF' }, // visually grayed out
  ]}
  disabled={pdfGenerated}
>
  <Text style={styles.submitText}>
    {pdfGenerated ? '✓ Created' : 'Create'}
  </Text>
</TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>


    </Modal>
    
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardContainer: {
    width: '90%',
  },
  container: {
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 12,
  },
  loadingOverlay: {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.4)',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 20,
  zIndex: 100,
},
loadingText: {
  color: '#fff',
  fontSize: 18,
  fontWeight: '600',
},

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 12,
  },
  fileButton: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  fileButtonText: {
    fontSize: 16,
    color: '#1E293B',
  },
  error: {
    color: 'red',
    fontSize: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 12,
  },
  cancelButton: {
    marginRight: 15,
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#64748B',
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
