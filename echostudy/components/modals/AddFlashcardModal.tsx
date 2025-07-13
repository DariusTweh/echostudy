import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Image,
  ScrollView,
  Switch,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../../api/supabaseClient';

export default function AddFlashcardModal({ visible, onClose, onSubmit }) {
  const [term, setTerm] = useState('');
  const [definition, setDefinition] = useState('');
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [addAnother, setAddAnother] = useState(false);

  const handleAddTag = () => {
    const cleanTag = tagInput.trim();
    if (cleanTag && !tags.includes(cleanTag)) {
      setTags([...tags, cleanTag]);
    }
    setTagInput('');
  };
  
  const handleImagePick = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

    const handleSubmit = () => {
      if (!term.trim() || !definition.trim()) return;

    onSubmit({
  term: term.trim(),
  definition: definition.trim(),
  tags,
  image: imageUri,
  addAnother, // ✅ pass this to parent
});

      if (addAnother) {
        setTerm('');
        setDefinition('');
        setTags([]);
        setTagInput('');
        setImageUri(null);
      } else {
        onClose();
      }
    };
    
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Create Flashcard</Text>

          <Text style={styles.subtitle}>Advance Options</Text>
          <View style={styles.toolbarRow}>
            <TouchableOpacity style={styles.toolButton}><Text>🎤 Record Voice</Text></TouchableOpacity>
            <TouchableOpacity style={styles.toolButton} onPress={handleImagePick}><Text>🖼️ Upload Image</Text></TouchableOpacity>
            <TouchableOpacity style={styles.toolButton}><Text>✏️ Add Drawing</Text></TouchableOpacity>
            <TouchableOpacity style={styles.toolButton}><Text>∑\ Insert LaTeX</Text></TouchableOpacity>
          </View>

          <TextInput
            style={styles.input}
            placeholder="Term"
            value={term}
            onChangeText={setTerm}
          />

          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Definition"
            value={definition}
            onChangeText={setDefinition}
            multiline
          />

          <Text style={styles.label}>Tags</Text>
          <View style={styles.tagInputRow}>
            {tags.map((tag, idx) => (
              <View key={idx} style={styles.tag}><Text style={styles.tagText}>{tag}</Text></View>
            ))}
            <TextInput
              style={styles.tagInput}
              placeholder="Add a tag"
              value={tagInput}
              onChangeText={(text) => {
                if (text.endsWith(' ')) {
                  handleAddTag();
                } else {
                  setTagInput(text);
                }
              }}
              onSubmitEditing={handleAddTag}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Add Another</Text>
            <Switch value={addAnother} onValueChange={setAddAnother} />
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSubmit} style={styles.saveButton}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  container: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 12,
    color: '#6B7280',
  },
  toolbarRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  toolButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginHorizontal: 4,
  },
  input: {
    height: 48,
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#0F172A',
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 6,
    color: '#1E293B',
  },
  tagInputRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },
  tagText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  tagInput: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  switchLabel: {
    fontSize: 16,
    color: '#1E293B',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    backgroundColor: '#F9FAFB',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  cancelText: {
    color: '#3B82F6',
    fontSize: 16,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  saveText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

