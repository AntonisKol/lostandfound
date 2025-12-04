import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import FoundItemDetailsScreen from "../screens/FoundItemDetailsScreen";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createNativeStackNavigator();

 const RootNavigator = () => {
  return (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: true }}>
     <Stack.Screen name="Tabs" component={TabNavigator} options={{ headerShown: false }} />
     <Stack.Screen name="FoundItemDetails" component={FoundItemDetailsScreen} options={{ title: "Item Details" }} />
   </Stack.Navigator>
  </NavigationContainer>
  );
}

export default RootNavigator;