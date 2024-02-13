import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import UserScreen from '../screens/UserScreen';
import RideScreen from '../screens/RideScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AuthorsScreen from '../screens/AuthorsScreen';
import PasswordChangeScreen from '../screens/PasswordChangeScreen';
import IconChangeScreen from '../screens/IconChangeScreen';
import SaveRouteScreen from '../screens/saveRouteScreen';
import RouteScreen from '../screens/RouteScreen';
import DriverProfileScreen from '../screens/DriverProfileScreen';

const Stack = createNativeStackNavigator();


export default function AppNavigation() {
  // do podmianki na token
  const { user } = 'test';
  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
          <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
          <Stack.Screen name="User" options={{headerShown: false}} component={UserScreen} />
          <Stack.Screen name="Ride" options={{headerShown: false}} component={RideScreen} />
          <Stack.Screen name="Settings" options={{headerShown: false}} component={SettingsScreen} />
          <Stack.Screen name="Authors" options={{headerShown: false}} component={AuthorsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Welcome'>
          <Stack.Screen name="Welcome" options={{headerShown: false}} component={WelcomeScreen} />
          <Stack.Screen name="Login" options={{headerShown: false}} component={LoginScreen} />
          <Stack.Screen name="SignUp" options={{headerShown: false}} component={SignUpScreen} />

          <Stack.Screen name="Home" options={{headerShown: false}} component={HomeScreen} />
          <Stack.Screen name="User" options={{headerShown: false}} component={UserScreen} />
          <Stack.Screen name="Ride" options={{headerShown: false}} component={RideScreen} />
          <Stack.Screen name="Settings" options={{headerShown: false}} component={SettingsScreen} />
          <Stack.Screen name="Authors" options={{headerShown: false}} component={AuthorsScreen} />
          <Stack.Screen name="PasswordChange" options={{headerShown: false}} component={PasswordChangeScreen} />
          <Stack.Screen name="IconChange" options={{headerShown: false}} component={IconChangeScreen} />
          <Stack.Screen name="SaveRoute" options={{headerShown: false}} component={SaveRouteScreen} />
          <Stack.Screen name="RouteScreen" options={{headerShown: false}} component={RouteScreen} />
          <Stack.Screen name="DriverProfile" options={{headerShown: false}} component={DriverProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}