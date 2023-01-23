import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <Stack.Navigator
      initialRouteName='Main'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='Main' component={MainPage} />
      <Stack.Screen name='Send' component={SendPage} />
    </Stack.Navigator>
  );
}

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

function SendPage() {
  return <View></View>;
}

export default HomeScreen;
