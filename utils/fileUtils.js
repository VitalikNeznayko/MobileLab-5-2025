import * as FileSystem from 'expo-file-system';

export const APP_FOLDER = `${FileSystem.documentDirectory}AppData/`;

export const ensureAppFolderExists = async () => {
  try {
    const dirInfo = await FileSystem.getInfoAsync(APP_FOLDER);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(APP_FOLDER, { intermediates: true });
    }
  } catch (error) {
    console.warn("Failed to ensure App folder exists:", error);
  }
};
