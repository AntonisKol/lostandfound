import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import LandingScreen from "../components/ LandingScreen/ LandingScreen";
 
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={LandingScreen} />
       <Tab.Screen name="Found" component={LandingScreen} />
      <Tab.Screen name="Lost" component={LandingScreen} />
    </Tab.Navigator>
  );
}
