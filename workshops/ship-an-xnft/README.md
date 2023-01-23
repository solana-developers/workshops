# Ship your first xNFT ⛴️

## 🎬 Recorded Sessions

| Link                                                                                                                                   | Instructor      | Type            |
| -------------------------------------------------------------------------------------------------------------------------------------- | --------------- | --------------- |
| [<img src="../../.docs/youtube-icon.png" alt="youtube" width="20" align="center"/> Video](https://www.youtube.com/watch?v=FQYmWWw5l04) | Valentin Madrid | Tutorial Series |

## 🎒 What even is an xNFT ?

First of all, the "X" in xNFT stands for eXecutable. So basically an xNFT is an eXecutable NFT. But.. where can it be executed ? That's where [Backpack](https://www.backpack.app/) comes in. Backpack is a multi chain crypto wallet developed by a company named Coral founded by Armani Ferrante, the creator of the Solana Anchor Framework. It can run apps called xNFTs, and has it's own app store. That means the property right for an app is own-able as an NFT. If that didn't make sense, don't stress out, you're gonna be able to try it out yourself.

## 🔧 Dependencies

To follow along in this tutorial, you are going to need:

- Basic knowledge of Javascript and React
- Node JS
- NPM/Yarn
- A web browser, which you probably have if you're reading this.
  Now that this is out of the way, let's get to the fun part!

## 📗 What are we going to learn ?

By the end of this course, you're gonna have shipped a badass xNFT, it will be an address book in which you can add your friends and send them some cool SOL Tokens. Here's a little demo:
DEMO HERE
You will learn everything there is to learn about creating xNFTs, or almost. We created multiple parts for you to understand everything easier. Let's look at what our brain will have to store as you complete this course..

---

- **1. Getting started with Backpack**
  - 1.1 - Installing Backpack
  - 1.2 - Create your first xNFT
  - 1.3 - Test your xNFT
  - 1.4 - Your first View
  - 1.5 - Styling with CSS
- **2. Getting started with Backpack**
  - 2.1 - Customise your View with components
  - 2.2 - Conditional rendering
  - 2.3 - Mapping over objects
- **3. Styling with Tailwind CSS**
- **4. Storage and navigation**
  - 4.1 - Storing data in Local Storage
  - 4.2 - Navigation
  - - Stack Navigator
  - - Tab Navigator
- **5. Hooks and signing transactions**
  - 5.1 - Use React Hooks
  - 5.2 - Use Backpack Hooks
  - 5.3 - Sign and send Transactions

This looks like a lot, but trust me, it isn't. You're going to understand all of this pretty fast.

---

**1. Getting started with Backpack**
**1.1 - Installing Backpack**
To install Backpack, you are going to have to download the Edge build of the newest Backpack release on Github, and import it into your Browser Extensions.
[Backpack Github](https://github.com/coral-xyz/backpack/releases) - Download the `build-edge.zip` of the newest release. Unzip it and put the folder in a location you will find again later.

Once that is done, navigate to your Browser Extensions Tab, where you will need to toggle the "Developer Mode" to "ON" in the upper right corner. If you can't find the button, a quick search on Google for your particular Browser will do it.

Now, in the upper left corner of the "Extensions" Tab in your browser, click `"Load unpacked"` and select the file that you unzipped a couple minutes ago.

You should be good to go. Now, look at your extensions and you should be able to see a beautiful red backpack. Click on it and create yourself a wallet. Feel free to play around and look at everything that the app has to offer. You can even test some xNFTs by installing them on the [xNFT App Store](https://xnft.gg).
Now, go into the settings and enable the developer mode.

**1.2 - Create your first xNFT**

Run the command `git clone https://github.com/coral-xyz/xnft-quickstart.git my-project`. Then run `cd my-project`.

**1.3 - Test your xNFT**

After installing, run `yarn` and `yarn dev` or `npm install`and `npm run dev` in the folder where the project is located. Open your Backpack Wallet again, navigate to xNFTs and click simulator. You should now be seeing your working app with a "Hello world" on the top left. Congrats, you now have a working xNFT !
Let's look at how to change what is rendered, by opening App.tsx and changing

```ts
<Text>Hello world!</Text>
```

to

```ts
<Text>I like Solana</Text>
```

Save the file and open your Backpack App again to see what changed. You can see where this is going, let's customise our app even more with other Components.

**1.4 - Your first View**

Let's create a View, it's a little like a `<div>` in html, and serves to wrap around components in your Apps. Your App.tsx should look like this right now:

```ts
import React from 'react';
import { registerRootComponent } from 'expo';
import { View, Text } from 'react-native';

function App() {
  return (
    <View>
      <Text style={{ color: 'white' }}>I like Solana</Text>
    </View>
  );
}
export default registerRootComponent(App);
```

**1.5 - Styling with CSS**

If you want to build the next unicorn startup, your product needs to look good. That's where styling comes in. For now, we will use regular CSS to customise the way our App looks:

- Change the background colour and height of the View:

```ts
<View  style={{ backgroundColor: 'blue', height: '100%' }}>
```

- Change the text colour to white, the margin to the top to 10px and the font family to italic.

```ts
<Text  style={{ color: 'white', marginTop: '10px', fontFamily: 'italic' }}>
```

Preview those changes and play around with CSS a little bit.
If you don't like regular CSS, don't worry. We wont be using it a lot because we will use TailwindCSS later.

**2. Let's start shipping**
**2.1 - Customize your View with Components**

We've seen View and Text, let's discover some new components and add them into our App:

```ts
<View style={{ backgroundColor: 'blue', height: '100%' }}>
  <Text style={{ color: 'white', marginTop: '10px', fontFamily: 'italic' }}>
    Hello world!
  </Text>
  <TextInput
    onChange={() => console.log('changed')}
    placeholder={'write something here'}
    style={{ color: 'white' }}
  />
  <Button
    title={'Click me'}
    onPress={() => console.log('clicked')}
    color={'white'}
  />
  <Image
    source={{
      uri: 'https://solana.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2FsolanaLogoMark.17260911.svg&w=256&q=75',
    }}
    style={{ height: '100px', width: '100px' }}
  />
</View>
```

Do not forget to import your new components(TextInput, Button, Image) from react-native.

- TextInput: A field to input text
- Button: A button
- Image: Renders an Image on the screen

Now its your turn to do something, delete everything we have added to App.tsx and create an App that has a black background and that has a text wrapped by a View which has a margin of 5px, which welcomes me in the top left(with something like: "Hey there!").
My example code is the following:

```ts
function App() {
  return (
    <View style={{ backgroundColor: 'black', height: '100%' }}>
      <View style={{ margin: '5px' }}>
        <Text style={{ color: 'white' }}>Hey there, mega dev!</Text>
      </View>
    </View>
  );
}
```

**2.2 - Conditional rendering**

Just like in React, you can render something based on the State of a data type, which can be an object, an array, a boolean etc..

Let's create an object called `friends` just under `function App()`, which will look like this:

```ts
const friends = [
  { name: 'John', pubkey: '0x00001' },
  { name: 'Bob', pubkey: '0x00002' },
  { name: 'Jane', pubkey: '0x00003' },
];
```

Now we only want to display our greeting text if the user has friends. Because our app isn't dynamic yet, we will need to use the object from above.

```ts
<View style={{ backgroundColor: 'black', height: '100%' }}>
  <View style={{ margin: '5px' }}>
    {friends ? (
      <Text style={{ color: 'white' }}>Hey there, mega dev!</Text>
    ) : (
      <Text style={{ color: 'white' }}>No friends yet</Text>
    )}
  </View>
</View>
```

Basically this is checking if there is data in the friends array, if yes it greets the user, if no it tells him he hasn't got any friends on the app yet. You can try to empty the friends array if you want to see what gets rendered.

**2.3 - Mapping over data**

As we may have multiple friends that in our address book we will have to display every friend in the friends object with their name and a button to send SOL to them. Let's look at the code:

```ts
<View style={{ backgroundColor: 'black', height: '100%' }}>
  <View style={{ margin: '5px' }}>
    <Text style={{ color: 'white' }}>Hey there, mega dev!</Text>
    <Text style={{ color: 'white', marginTop: '20px' }}>My frens:</Text>
    {friends ? (
      friends.map((friend) => (
        <View
          style={{
            marginTop: '5px',
            width: '100%',
            backgroundColor: 'blue',
          }}
        >
          <Text style={{ color: 'white' }}>{friend.name}</Text>
          <TouchableOpacity style={{ backgroundColor: 'white' }}>
            Send $SOL
          </TouchableOpacity>
        </View>
      ))
    ) : (
      <Text style={{ color: 'white' }}>No friends yet</Text>
    )}
  </View>
</View>
```

So what does this do ? First of all we check if the user has friends on the app, if not we display "No friends yet". If the user has friends, it maps every friend with their name and a Button. As you may have noticed, we aren't using a `<Button>` component, but something called `<TouchableOpacity>`, it's pretty similar to a Button, only thing that changes is that we can style it.
Ignore the styling for now, we are gonna change that in the next step.

**3. Styling with TailwindCSS**

TailwindCSS makes CSS way easier, and guess what, you can use it in React Native, which means you can use it in your xNFT App. Cool right ?
I'm not gonna explain Tailwind too much, if you want to learn TailwindCSS, you can read the [Docs](https://tailwindcss.com/docs/installation) or watch the [Tutorial Series](https://www.youtube.com/playlist?list=PL5f_mz_zU5eXWYDXHUDOLBE0scnuJofO0).

First of all, install a package called twrnc, which stands for "Tailwind React Native Classnames", with one of these commands: `yarn add twrnc` or `npm i twrnc`.
Now add this:

```ts
import tw from 'twrnc';
```

at the top of your App.tsx.
The way twrnc works, is that you add the tailwind class into the style property of a component, it would look like this on a Text for example:

```ts
<Text style={tw`text-white text-xl`}>Hello world!</Text>
```

I've made a couple changes to the style for you, which you can copy into your App.tsx. Your App.tsx should now look like this:

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
          <Text style={{ color: 'white' }}>No friends yet</Text>
        )}
      </View>
    </View>
  );
}

export default registerRootComponent(App);
```

**4. Storage and navigation - 🕺 make it dynamic**

Now that we have a pretty good looking static App, let's move onto making our App Writable. We want a user to be able to add friends by knowing their name and public key.

**4.1 Storing data in Localstorage**

There are multiple ways of storing data locally in react-native, but we will be using the AsyncStorage package package. Install it by running `yarn add @react-native-async-storage/async-storage` or `npm install @react-native-async-storage/async-storage`.
Add this line to the imports in App.tsx:

```ts
import AsyncStorage from '@react-native-async-storage/async-storage';
```

This package is pretty easy to use, let's create a function to save data and to read data from LocalStorage.

```ts
async function testStorage() {
  // save the friends array to local storage
  try {
    const jsonValue = JSON.stringify(friends);
    await AsyncStorage.setItem('friends', jsonValue);
  } catch (e) {
    console.log(e);
  }

  // retrieve the friends array from localstorage
  const value = await AsyncStorage.getItem('friends');
  console.log('friends', value);
}

testStorage();
```

Add this to your code below the friends array that we made. Then, right click your xNFT and look at the console, normally you should see your friends array displayed on there. We will need this in some of the next steps.

**4.2 Navigation**

Okay, we're gonna use a lot of boilerplate code now, you just have to understand what it does, and be able to copy paste some of the stuff whenever you need it.
Basically there will be a Bottom Tab Navigator, which is gonna be two tabs in the bottom of the App(to navigate between tabs lol) and a Stack Navigator, to change screens while you are in one tab.
Let's take instagram for example, the "Home/Feed" Tab and "Search" Tab are Bottom Tab navigators. Now, when you click on a profile while sliding in your feed, the profile is opened using the Stack Navigator.

First of all, import these in your App.tsx:

```ts
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
```

now, create a folder named `"screens"` and create two files in it, one named `HomeScreen.tsx` and the other one named `FriendsScreen.tsx`. What we are going to do now, is putting everything we made in the App folder into our HomeScreen.tsx, because it is the "home" of our app.
Our HomeScreen.tsx will now look like this:

```ts
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

const friends = [
  { name: 'John', pubkey: '0x00001' },
  { name: 'Bob', pubkey: '0x00002' },
  { name: 'Jane', pubkey: '0x00003' },
];

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
```

So basically we will have two Pages in our Home Tab, one will be the Page where we see all of our friends, and the second one to send $SOL to your friend. The initial route will be the Main "Page", and we'll be able to navigate to the send page when clicking the Button.

This next part is going to get a bit more difficult to understand, let's look at how our App.tsx will look like now:

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

We have two screens, Home and Friends, which you can navigate using the Navigation menu at the bottom of the App. When on the HomeScreen, you see the inital route of the HomeScreen Stack Navigator, which is our Main Page. When you click on the Friends Tab, you will see an empty screen, that we will fill out out in the next step. Take a second to look at the code and understand it. If you do not understand it, search up some docs or a tutorial for navigation in react native.

**5. Hooks and signing transactions**

**5.1 - Using React hooks**

You can use regular React hooks as useEffect or useState in your xNFTs. So let's create a Form in which a user can add new friends and store them into Local Storage.
FriendsScreen.tsx

```ts
import { View, Text, TextInput, Button } from 'react-native';
import tw from 'twrnc';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function FriendsScreen() {
  const [addFriend, setAddFriend] = useState({ name: '', pubkey: '' });
  const [friends, setFriends] = useState<any>();

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
    </View>
  );
}

export default FriendsScreen;
```

We store an object of the users Input called "addFriend" and an array with all the friends called "friends" in useState. On every render of the FriendsScreen, the app will get all the friends from LocalStorage. When adding a friend, we add the new friend to the total friends list and push the new list to AsyncStorage.

Now that we are storing our friends locally, let's open HomeScreen.tsx and get all the friends from AsyncStorage on page render for our MainPage() function, and don't forget to import useEffect at the top of the file.

```ts
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
```

Now open your xNFT on Backpack, and add a friend on the friends Tab, use your own Public Key in the pubkey field. Look at the HomeScreen, you should have a new friend on there now. If it doesn't display, close and reopen your xNFT app.

**5.2 - Signing and sending Solana Transactions**
