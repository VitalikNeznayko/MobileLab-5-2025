import { useEffect } from "react";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as FileSystem from "expo-file-system";

import Home from "./screens/Home";
import FileEditor from "./screens/FileEditor";
import InfoElement from "./screens/InfoElement";
import Stats from "./screens/Stats";

const Tab = createBottomTabNavigator();
const DATA_DIR = FileSystem.documentDirectory + "AppData/";

export default function App() {
  useEffect(() => {
    initializeAppFolder();
  }, []);

  const initializeAppFolder = async () => {
    const folder = await FileSystem.getInfoAsync(DATA_DIR);
    if (!folder.exists) {
      await FileSystem.makeDirectoryAsync(DATA_DIR, { intermediates: true });
    }
  };

  const icons = {
    Home: require("./assets/img/Home.png"),
    Stats: require("./assets/img/Stats.png"),
  };

  const renderTabIcon = (routeName, isFocused) => {
    const icon = icons[routeName];
    if (!icon) return null;
    return (
      <Image
        source={icon}
        style={{
          width: 24,
          height: 24,
          tintColor: isFocused ? "#007aff" : "gray",
        }}
      />
    );
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => renderTabIcon(route.name, focused),
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen
          name="FileEditor"
          component={FileEditor}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen
          name="InfoElement"
          component={InfoElement}
          options={{
            tabBarButton: () => null,
          }}
        />
        <Tab.Screen name="Stats" component={Stats} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
