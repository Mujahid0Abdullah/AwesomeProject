import { StatusBar } from 'expo-status-bar';
import React,{useContext,useEffect, useState} from 'react';
import { StyleSheet, Text, View ,LogBox, Button} from 'react-native';
import {app} from "./firebase.js"
import {useAssets} from "expo-asset";
import {createStackNavigator} from "@react-navigation/stack"
import {NavigationContainer} from "@react-navigation/native"
import { getAuth,onAuthStateChanged } from'@firebase/auth';
import SignIn from './screens/SignIn.js';
import Context from "./context/Context.js"
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs"
import ContextWrapper from './context/ContextWrapper.js';
import Profile from "./screens/Profile.js"
import Chats from "./screens/Chats.js"
import Photo from "./screens/Photo.js"
import Contacts from './screens/Contacts.js';
import Chat from "./screens/Chat.js"
import ChatHeader from './components/ChatHeader.js';
const auth = getAuth(app);

LogBox.ignoreLogs([
  "fff",
  "ddd"
  
])

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator();

function App() {
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const {theme: {colors}} = useContext(Context)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        console.log("logged in")
        setCurrUser(user);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text> ;
  }
  return (
    <NavigationContainer >
      {!currUser ?(
        <Stack.Navigator>
          <Stack.Screen 
          options={{headerStyle:{backgroundColor:"#128c7e",borderBottomLeftRadius:19,borderBottomRightRadius:19}}}
           style={{alignItems:"center"}} 
           name='sign In'
            component={SignIn}/>

          
        </Stack.Navigator>
      ):( 
     <Stack.Navigator screenOptions={{ headerStyle:{
      backgroundColor: "#128c7e",
      shadowOpacity:0,
      elevation:0
     },
     headerTintColor: "white"}}>
      {!currUser.displayName && (
 <Stack.Screen 
 name='profile' component={Profile} 
 options={{headerShown:false}}/>
      )}
     

      <Stack.Screen style={{backgroundColor:"#445354"}}
      name='home' 
      options={{title:"Doktorlarım"}} 
      component={Home}/>
         <Stack.Screen 
      name='contacts' style={{backgroundColor:"#445354"}}
      options={{title:"Doktor Seç"}} 
      component={Contacts}/>

      <Stack.Screen name='chat' component={Chat} options={{headerTitle: (props)=> <ChatHeader {...props}/> }} />
     </Stack.Navigator> 
     )}
     
    </NavigationContainer>
  );
}
function Home(){
  return <Tab.Navigator>
    <Tab.Screen name="photo" component={Photo}/>
    <Tab.Screen name="chats" component={Chats}/>
  </Tab.Navigator>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function Main(){
  const [assets]= useAssets(
    require("./assets/chatbg.png"),
    require("./assets/icon.png"),
  )
  if(!assets){
    return <Text>Loading...</Text>
  }
  return <ContextWrapper><App/>
  </ContextWrapper>;
}

export default Main 