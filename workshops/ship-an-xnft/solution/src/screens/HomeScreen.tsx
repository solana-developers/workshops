import { View, Text, TouchableOpacity, TextInput } from 'react-native';
import tw from 'twrnc';
import {
  createStackNavigator,
  StackCardStyleInterpolator,
} from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PublicKey, SystemProgram, Transaction } from '@solana/web3.js';

const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <Stack.Navigator
      initialRouteName='Main'
      screenOptions={{
        headerShown: true,
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
          // @ts-ignore
          friends.map((friend) => (
            <View
              style={tw`bg-[#386FA4] p-3 rounded-lg mt-3 flex-row justify-between`}
              key={friend.pubkey}
            >
              <Text style={tw`text-white  text-xl`}>{friend.name}</Text>
              <TouchableOpacity
                // @ts-ignore
                onPress={() => navigation.navigate('Send', { friend })}
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

function SendPage({ route }: { route: any }) {
  const [amount, setAmount] = useState<string>();
  const navigation = useNavigation();
  const transfer = async () => {
    console.log('transfer');
    console.log(
      route.params.friend,
      window.xnft.solana?.publicKey,
      route.params.friend.pubkey
    );
    const sender = new PublicKey(window.xnft.solana?.publicKey);
    const receiver = new PublicKey(route.params.friend.pubkey);
    const sols = parseInt(amount || '0');
    const ix = SystemProgram.transfer({
      fromPubkey: sender,
      toPubkey: receiver,
      lamports: sols * 1000000000,
    });
    const tx = new Transaction().add(ix);
    const signed = await window.xnft.solana.sendAndConfirm(tx);
    console.log(signed);
    // @ts-ignore
    navigation.navigate('Main');
  };
  return (
    <View style={tw`h-full bg-[#133C55]`}>
      <Text style={tw`text-white m-3 text-xl`}>
        Send SOL to {route.params.friend.name}
      </Text>
      <TextInput
        style={tw`bg-white m-3 rounded-lg p-3`}
        placeholder='Enter Amount'
        onChangeText={(e) => setAmount(e)}
      />
      <TouchableOpacity onPress={transfer}>
        <Text style={tw`text-black m-3 text-xl bg-white p-3 rounded-md`}>
          Send
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default HomeScreen;
