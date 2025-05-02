import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
  Button,
} from "react-native";
import * as FileSystem from "expo-file-system";
import { useNavigation } from "@react-navigation/native";
import { APP_FOLDER, ensureAppFolderExists } from "../utils/fileUtils";

const Home = () => {
  const [currentPath, setCurrentPath] = useState(APP_FOLDER);
  const [items, setItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [createType, setCreateType] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const initialize = async () => {
      await ensureAppFolderExists();
      loadDirectory(APP_FOLDER);
    };
    initialize();
  }, []);

  const loadDirectory = async (path) => {
    try {
      const dirItems = await FileSystem.readDirectoryAsync(path);
      const itemsWithInfo = await Promise.all(
        dirItems.map(async (name) => {
          const fullPath = path + name + "/";
          const info = await FileSystem.getInfoAsync(fullPath);
          return {
            name,
            isDirectory: info.isDirectory,
            fullPath: info.isDirectory ? fullPath : path + name,
          };
        })
      );
      setItems(itemsWithInfo);
      setCurrentPath(path);
    } catch (err) {
      console.error("Помилка при читанні:", err);
    }
  };

  const goBack = () => {
    if (currentPath !== APP_FOLDER) {
      const newPath = currentPath.split("/").slice(0, -2).join("/") + "/";
      loadDirectory(newPath);
    }
  };

  const createItem = async () => {
    const name = newName.trim();
    if (!name) {
      Alert.alert("Помилка", "Введіть назву");
      return;
    }

    const newPath =
      currentPath + name + (createType === "folder" ? "/" : ".txt");

    try {
      if (createType === "folder") {
        await FileSystem.makeDirectoryAsync(newPath, { intermediates: true });
      } else {
        await FileSystem.writeAsStringAsync(newPath, "");
      }
      setShowModal(false);
      setNewName("");
      setCreateType(null);
      loadDirectory(currentPath);
    } catch (err) {
      Alert.alert("Помилка", "Не вдалося створити");
    }
  };

  const confirmDelete = (item) => {
    Alert.alert("Підтвердити видалення", `Видалити "${item.name}"?`, [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Видалити",
        style: "destructive",
        onPress: async () => {
          try {
            await FileSystem.deleteAsync(item.fullPath, { idempotent: true });
            loadDirectory(currentPath);
          } catch (err) {
            Alert.alert("Помилка", "Не вдалося видалити");
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.pathText}>
        📂 Шлях: {currentPath.replace(FileSystem.documentDirectory, "") || "/"}
      </Text>

      {currentPath !== APP_FOLDER && (
        <TouchableOpacity style={styles.backBtn} onPress={goBack}>
          <Text style={styles.backBtnText}>⬅ Назад</Text>
        </TouchableOpacity>
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.fullPath}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() =>
              item.isDirectory
                ? loadDirectory(item.fullPath)
                : navigation.navigate("InfoElement", {
                    filePath: item.fullPath,
                  })
            }
            onLongPress={() => confirmDelete(item)}
          >
            <Text style={styles.cardText}>
              {item.isDirectory ? "📁 " : "📄 "}
              {item.name}
            </Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#007bff" }]}
          onPress={() => {
            setCreateType("folder");
            setShowModal(true);
          }}
        >
          <Text style={styles.actionText}>📁 Нова папка</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, { backgroundColor: "#28a745" }]}
          onPress={() => {
            setCreateType("file");
            setShowModal(true);
          }}
        >
          <Text style={styles.actionText}>📝 Новий файл</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalHeader}>
              {createType === "folder" ? "Створити папку" : "Створити файл"}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={`Введіть назву ${
                createType === "folder" ? "папки" : "файлу"
              }`}
              value={newName}
              onChangeText={setNewName}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.createButton]}
                onPress={createItem}
              >
                <Text style={styles.modalButtonText}>Створити</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.modalButtonText}>Скасувати</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: "#f0f2f5",
  },
  pathText: {
    marginTop: 20,
    fontSize: 13,
    color: "#6c757d",
    marginBottom: 10,
  },
  backBtn: {
    marginBottom: 10,
  },
  backBtnText: {
    color: "#007bff",
    fontSize: 16,
  },
  card: {
    padding: 14,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    marginBottom: 8,
    elevation: 2,
  },
  cardText: {
    fontSize: 17,
    color: "#212529",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 18,
  },
  actionButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  actionText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "#00000099",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
    alignItems: "center",
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
    textAlign: "center",
  },
  modalInput: {
    width: "100%",
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 5,
  },
  createButton: {
    backgroundColor: "#28a745",
  },
  cancelButton: {
    backgroundColor: "#dc3545",
  },
  modalButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderColor: "#ced4da",
    borderWidth: 1,
    borderRadius: 6,
    padding: 10,
    marginBottom: 14,
  },
});
