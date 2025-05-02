import React, { useEffect, useState } from "react";
import { Text, StyleSheet, Alert, ScrollView, View } from "react-native";
import * as FileSystem from "expo-file-system";

const formatBytesToGB = (bytes) => (bytes / 1024 / 1024 / 1024).toFixed(2);

const Stats = () => {
  const [stats, setStats] = useState({
    total: null,
    free: null,
    used: null,
  });

  const loadStorageStats = async () => {
    try {
      const free = await FileSystem.getFreeDiskStorageAsync();
      const total = await FileSystem.getTotalDiskCapacityAsync();
      const used = total - free;

      setStats({ total, free, used });
    } catch (error) {
      Alert.alert("Помилка", "Не вдалося завантажити статистику памʼяті");
    }
  };

  useEffect(() => {
    loadStorageStats();
  }, []);

  const usedPercentage = stats.total
    ? ((stats.used / stats.total) * 100).toFixed(2)
    : 0;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Сховище пристрою</Text>

      <View style={styles.statContainer}>
        <Text style={styles.item}>
          Загальна памʼять:{" "}
          {stats.total
            ? `${formatBytesToGB(stats.total)} GB`
            : "Завантаження..."}
        </Text>
      </View>

      <View style={styles.statContainer}>
        <Text style={styles.item}>
          Вільна памʼять:{" "}
          {stats.free ? `${formatBytesToGB(stats.free)} GB` : "Завантаження..."}
        </Text>
      </View>

      <View style={styles.statContainer}>
        <Text style={styles.item}>
          Використано:{" "}
          {stats.used ? `${formatBytesToGB(stats.used)} GB` : "Завантаження..."}
        </Text>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Використано: {usedPercentage}%</Text>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBar, { width: `${usedPercentage}%` }]} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 55,
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 24,
    alignSelf: "center",
  },
  statContainer: {
    alignItems: "center",
    marginBottom: 18,
  },
  item: {
    fontSize: 18,
    textAlign: "center",
  },
  progressContainer: {
    marginTop: 20,
    width: "100%",
    alignItems: "center",
  },
  progressText: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: "center",
  },
  progressBarBackground: {
    width: "80%",
    height: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3b82f6",
    borderRadius: 5,
  },
});

export default Stats;
