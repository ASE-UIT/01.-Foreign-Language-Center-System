import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../Screens/WelcomeScreen';
import LoginScreen from '../Screens/LoginScreen';
import RegisterScreen from '../Screens/RegisterScreen';
import RoleScreen from '../Screens/RoleScreen';
import ScheduleScreen from '../Screens/ScheduleScreen';
import StudentHomeScreen from '../Screens/StudentHomeScreen';

export type RootStackParamList = {
  Welcome: undefined;
  Login: undefined | userInfo; // set for passing param
  Register: undefined; // add RegisterScreen
  Schedule: undefined;
  Role: undefined | userInfo; // add RoleScreen
  StudentHome: undefined | userInfo;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />

      {/* add Register Screen*/}
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* add Role Screen*/}
      <Stack.Screen name="Role" component={RoleScreen} />
      {/* add Schedule Screen*/}
      <Stack.Screen name="Schedule" component={ScheduleScreen} />

      <Stack.Screen name="StudentHome" component={StudentHomeScreen} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;