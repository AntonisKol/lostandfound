import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FoundItemScreen from "../screens/FoundItemScreen/FoundItemScreen";
import FoundItemsFeed from "../screens/FoundItemsFeed/FoundItemsFeed";
import MapScreen from "../screens/MapScreen/MapScreen";
import LostItemScreen from "../screens/LostItemScreen/LostItemScreen";
import AccountScreen from "../screens/AccountScreen/AccountScreen";
import { colors } from "../constants/theme";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.stamp,
        tabBarInactiveTintColor: colors.inkSoft,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          overflow: "hidden",
        },
      }}
    >
    <Tab.Screen name="Feed" component={FoundItemsFeed} />
      <Tab.Screen name="Found" component={FoundItemScreen} />
      <Tab.Screen name="Lost" component={LostItemScreen} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: "Map" }} />
      <Tab.Screen name="Account" component={AccountScreen} />

    </Tab.Navigator>
  );
}

export default TabNavigator;