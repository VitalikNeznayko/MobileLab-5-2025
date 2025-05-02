import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import * as FileSystem from "expo-file-system";

const FileEditor = ({ route, navigation }) => {
  const { filePath, fileName } = route.params;
  const [content, setContent] = useState("");
  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    const loadFileContent = async () => {
      try {
        const fileData = await FileSystem.readAsStringAsync(filePath);
        setContent(fileData);
      } catch (error) {
        Alert.alert("Помилка", "Помилка при читанні файлу.");
      }
    };

    loadFileContent();
  }, []);

  const handleSave = async () => {
    try {
      await FileSystem.writeAsStringAsync(filePath, content);
      Alert.alert("Успіх", "Файл успішно збережено.");
      setIsEdited(false);
    } catch (error) {
      Alert.alert("Помилка", "Помилка при збереженні файлу.");
    }
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backBtnText}>⬅ Назад</Text>
      </TouchableOpacity>

      <Text style={styles.header}>Editing: {fileName}</Text>
      <TextInput
        style={styles.textArea}
        multiline
        value={content}
        onChangeText={(text) => {
          setContent(text);
          setIsEdited(true);
        }}
        placeholder="Почніть писати..."
      />
      {isEdited && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>💾 Save</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FileEditor;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  backBtn: {
    marginBottom: 10,
  },
  backBtnText: {
    color: "#007bff",
    fontSize: 16,
  },
  header: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#333",
  },
  textArea: {
    flex: 1,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#fff",
    textAlignVertical: "top",
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: "#007bff",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
