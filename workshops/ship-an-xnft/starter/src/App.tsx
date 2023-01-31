import React from 'react';
import { registerRootComponent } from 'expo';
import { View, Text } from 'react-native';

function App() {
  return (
    <View>
      <Text>Hello world!</Text>
    </View>
  );
}

export default registerRootComponent(App);
