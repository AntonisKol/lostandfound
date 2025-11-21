import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LandingScreen from "../components/ LandingScreen/ LandingScreen";
import FoundItemScreen from "../screens/FoundItemScreen/FoundItemScreen";
 
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={LandingScreen} />
       <Tab.Screen name="Found" component={FoundItemScreen} />
      <Tab.Screen name="Lost" component={LandingScreen} />
    </Tab.Navigator>
  );
}
