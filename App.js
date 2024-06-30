import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from './components/Home';
import Settings from './components/Settings';
import Qibla from './components/Qibla';
import QiblaOnboardingScreen from './components/QiblaOnboardingScreen';
import NearbyMosques from './components/NearbyMosques';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeStack" component={Home} options={{ headerShown: false }}/>
      <Stack.Screen name="Settings" component={Settings} options={{ headerBackTitle: "Back", headerTransparent: true, headerTintColor: "#fff" }}/>
    </Stack.Navigator>
  )
}

function QiblaStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="QiblaOnboardingScreen" component={QiblaOnboardingScreen} options={{ headerShown: false}}/>
      <Stack.Screen name="realQibla" component={Qibla} options={{ headerBackTitle: 'Help', headerTintColor: "#fff", headerShown: true, headerTransparent: true, headerTitleStyle: { color: '#002331'}}}/>
    </Stack.Navigator>
  )
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator initialRouteName="Home" screenOptions={{tabBarStyle: {backgroundColor: '#002331'}}}>
        <Tab.Screen name="Home" component={HomeStackScreen} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="home-outline" color={"#66c7aa"} size={size}/>)}}/>
        <Tab.Screen name="Qibla" component={QiblaStackScreen} options={{ headerShown: false, tabBarIcon: ({ color, size }) => (<MaterialCommunityIcons name="compass-outline" color={"#66c7aa"} size={size}/>)}}/>
        <Tab.Screen name="Nearby Mosques" component={NearbyMosques} options={{ headerShown: false, tabBarIcon: ({ color, size, tabBarStyle }) => (<MaterialCommunityIcons name="mosque" color={"#66c7aa"} size={size}/>)}}/>
       </Tab.Navigator>
    </NavigationContainer>
  );
}