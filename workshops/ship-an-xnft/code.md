after tailwind styling

```ts
import { registerRootComponent } from 'expo';
import React from 'react';
import { View, Text, Pressable, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

function App() {
  const friends = [
    { name: 'John', pubkey: '0x00001' },
    { name: 'Bob', pubkey: '0x00002' },
    { name: 'Jane', pubkey: '0x00003' },
  ];

  return (
    <View style={tw`h-full bg-[#133C55]`}>
      <View style={tw`m-5`}>
        <Text style={tw`text-white text-xl`}>Hey there, mega dev!</Text>
        <Text style={tw`text-white text-lg mt-3`}>My frens:</Text>
        {friends ? (
          friends.map((friend) => (
            <View
              style={tw`bg-[#386FA4] p-3 rounded-lg mt-3 flex-row justify-between`}
              key={friend.pubkey}
            >
              <Text style={tw`text-white text-xl`}>{friend.name}</Text>
              <TouchableOpacity
                style={tw`rounded bg-[#84D2F6] text-white p-2 font-mono`}
              >
                Send
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={tw`text-white text-xl`}>No friends yet</Text>
        )}
      </View>
    </View>
  );
}

export default registerRootComponent(App);
```

App.tsx after Navigation changes

```ts
import { registerRootComponent } from 'expo';
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import HomeScreen from './screens/HomeScreen';
import FriendsScreen from './screens/FriendsScreen';

const Tab = createBottomTabNavigator();

function App() {
  const friends = [
    { name: 'John', pubkey: '0x00001' },
    { name: 'Bob', pubkey: '0x00002' },
    { name: 'Jane', pubkey: '0x00003' },
  ];

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
```

HomeScreen.tsx after Navigation changes

```ts

```

HomeScreen.tsx after localstorage + useeffect

````ts
function MainPage() {
  const navigation = useNavigation();
  const [friends, setFriends] = useState<any>(null);
  useEffect(() => {
    AsyncStorage.getItem('friends').then((friends) => {
      if (friends) {
        setFriends(JSON.parse(friends));
      }
    });
  }, []);

  return (
    <View style={tw`h-full bg-[#133C55]`}>
      <View style={tw`m-5`}>
        <Text style={tw`text-white text-xl`}>Hey there, mega dev!</Text>
        <Text style={tw`text-white text-lg mt-3`}>My frens:</Text>
        {friends ? (
          friends.map((friend) => (
            <View
              style={tw`bg-[#386FA4] p-3 rounded-lg mt-3 flex-row justify-between`}
              key={friend.pubkey}
            >
              <Text style={tw`text-white  text-xl`}>{friend.name}</Text>
              <TouchableOpacity
                onPress={() => {}}
                style={tw`rounded bg-[#84D2F6] text-white p-2 font-mono`}
              >
                <Text>Send</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={tw`text-white text-xl`}>No friends yet</Text>
        )}
      </View>
    </View>
  );
}
```ts
````
