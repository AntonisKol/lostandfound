import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./TabNavigator";
import { NavigationContainer } from "@react-navigation/native";
import LandingPage from "../screens/LandingPage/LandingPage";
import ItemDetailsScreen from "../screens/ItemDetailsScreen/ItemDetailsScreen";

const Stack = createNativeStackNavigator();

 const RootNavigator = () => {
  return (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Landing" component={LandingPage} />
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      <Stack.Screen
        name="ItemDetails"
        component={ItemDetailsScreen}
        options={{ headerShown: true, title: "Item Details" }}
      />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

export default RootNavigator;