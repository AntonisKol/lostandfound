import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FoundItemScreen from "../screens/FoundItemScreen/FoundItemScreen";
import FoundItemsFeed from "../screens/FoundItemsFeed/FoundItemsFeed";
import MapScreen from "../screens/MapScreen/MapScreen";
import LostItemScreen from "../screens/LostItemScreen/LostItemScreen";
import AccountScreen from "../screens/AccountScreen/AccountScreen";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Feed" component={FoundItemsFeed} />
      <Tab.Screen name="Found" component={FoundItemScreen} />
      <Tab.Screen name="Lost" component={LostItemScreen} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: "Map" }} />
      <Tab.Screen name="Account" component={AccountScreen} />

    </Tab.Navigator>
  );
}

export default TabNavigator;