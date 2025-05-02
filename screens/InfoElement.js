import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import * as FileSystem from "expo-file-system";

const FileInfoScreen = ({ route, navigation }) => {
  const filePath = route?.params?.filePath;
  const [fileDetails, setFileDetails] = useState(null);

  useEffect(() => {
    const getFileDetails = async () => {
      try {
        const fileData = await FileSystem.getInfoAsync(filePath);

        if (fileData.exists) {
          const details = {
            fileName: fileData.uri.split("/").pop(),
            lastModified: fileData.modificationTime
              ? new Date(fileData.modificationTime).toLocaleString()
              : "Unknown",
            fileSize: fileData.size
              ? `${(fileData.size / 1024).toFixed(2)} KB`
              : '0 KB',
          };
          setFileDetails(details);
        } else {
          Alert.alert("Помилка", "Файл не існує.");
        }
      } catch (error) {
        Alert.alert("Помилка", "Не вдалося отримати інформацію про файл.");
      }
    };

    getFileDetails();
  }, [filePath]);

  return (
    <View style={styles.wrapper}>
      {fileDetails ? (
        <View style={styles.detailsBox}>
          <Text style={styles.title}>File Details</Text>
          <Text style={styles.info}>Name: {fileDetails.fileName}</Text>
          <Text style={styles.info}>
            Last Modified: {fileDetails.lastModified}
          </Text>
          <Text style={styles.info}>Size: {fileDetails.fileSize}</Text>
        </View>
      ) : (
        <Text style={styles.loading}>Loading file details...</Text>
      )}

      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() =>
            navigation.navigate("FileEditor", {
              filePath: filePath,
              fileName: fileDetails?.fileName,
            })
          }
        >
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.actionText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eaeaea",
    padding: 20,
  },
  detailsBox: {
    marginBottom: 30,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    width: "90%",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  info: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  loading: {
    fontSize: 18,
    color: "#888",
    textAlign: "center",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  actionButton: {
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: "#6c757d",
  },
  actionText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default FileInfoScreen;
