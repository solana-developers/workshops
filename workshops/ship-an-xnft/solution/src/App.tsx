import { registerRootComponent } from 'expo';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/FriendsScreen';
import FriendsScreen from './screens/HomeScreen';

const Tab = createBottomTabNavigator();

declare global {
  interface Window {
    xnft: any;
  }
}

function App() {
  function TabNavigator() {
    return (
      <Tab.Navigator
        initialRouteName='Home'
        screenOptions={{
          tabBarActiveTintColor: 'black',
        }}
      >
        <Tab.Screen
          name='Home'
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name='account'
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name='List'
          component={FriendsScreen}
          options={{
            headerShown: false,
            tabBarLabel: 'Friends',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name='routes' color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    );
  }

  return (
    <NavigationContainer>
      <TabNavigator />
    </NavigationContainer>
  );
}

export default registerRootComponent(App);
