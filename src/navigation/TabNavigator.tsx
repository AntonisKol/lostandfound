import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LandingScreen from "../components/ LandingScreen/ LandingScreen";
import FoundItemScreen from "../screens/FoundItemScreen/FoundItemScreen";
import FoundItemsFeed from "../screens/FoundItemsFeed/FoundItemsFeed";
import MapScreen from "../screens/MapScreen/MapScreen";
 
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>      
    <Tab.Screen name="Feed" component={FoundItemsFeed} />
       <Tab.Screen name="Found" component={FoundItemScreen} />
      <Tab.Screen name="Lost" component={LandingScreen} />
      <Tab.Screen name="Map" component={MapScreen} options={{ title: "Map" }} />

    </Tab.Navigator>
  );
}
