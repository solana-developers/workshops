import { View, Text, TextInput, Button } from 'react-native';
import tw from 'twrnc';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function FriendsScreen() {
  const [addFriend, setAddFriend] = useState({ name: '', pubkey: '' });
  const [friends, setFriends] = useState<any>([]);

  useEffect(() => {
    const getFriends = async () => {
      const friends = await AsyncStorage.getItem('friends');
      console.log('friends', friends);
      if (friends) {
        setFriends(JSON.parse(friends));
      }
    };
    getFriends();
  }, []);

  const addFriendToLS = () => {
    AsyncStorage.setItem('friends', JSON.stringify([...friends, addFriend]));
    setAddFriend({ name: '', pubkey: '' });
  };

  const removeAllFriends = () => {
    AsyncStorage.removeItem('friends');
    setFriends([]);
  };

  return (
    <View style={tw`h-full bg-[#133C55]`}>
      <View style={tw`m-5`}>
        <Text style={tw`text-white text-xl`}>Friends</Text>
        <View style={tw`p-3 rounded-lg mt-3`}>
          <TextInput
            onChangeText={(e) => setAddFriend({ ...addFriend, pubkey: e })}
            style={tw`text-white  text-xl p-2 bg-[#386FA4] rounded-lg`}
            placeholder={'Friends Pubkey'}
            value={addFriend.pubkey}
          />
          <TextInput
            onChangeText={(e) => setAddFriend({ ...addFriend, name: e })}
            style={tw`text-white  text-xl p-2 bg-[#386FA4] rounded-lg mt-3`}
            placeholder={'Friends Name'}
            value={addFriend.name}
          />
        </View>
        <Button
          title='Add Friend'
          color='black'
          onPress={() => addFriendToLS()}
        />
      </View>
      <View style={tw`m-5`}>
        <Button
          title='Remove Friends'
          color='black'
          onPress={() => removeAllFriends()}
        />
      </View>
    </View>
  );
}

export default FriendsScreen;
