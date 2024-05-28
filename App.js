import { StatusBar } from 'expo-status-bar';
import React,{useContext,useEffect, useState} from 'react';
import { StyleSheet, Text, View ,LogBox, Button} from 'react-native';
import {app,db} from "./firebase.js"
import {useAssets} from "expo-asset";
import {createStackNavigator} from "@react-navigation/stack"
import {NavigationContainer} from "@react-navigation/native"
import { doc, setDoc,getDoc } from 'firebase/firestore';


import { getAuth,onAuthStateChanged } from'@firebase/auth';
import SignIn from './screens/SignIn.js';
import Context from "./context/Context.js"
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs"
import ContextWrapper from './context/ContextWrapper.js';
import Profile from "./screens/Profile.js"
import Chats from "./screens/Chats.js"
import Photo from "./screens/Photo.js"
import Contacts from './screens/Contacts.js';
import Doctorapp from './screens/Doctorapp.js';
import Chat from "./screens/Chat.js"
import ChatHeader from './components/ChatHeader.js';
import SignInDoctor from './screens/SignInDoctor.js';
import HastaProfile from './screens/HastaProfile.js';
import PatientAppointmentsScreen from "./screens/PatientAppointmentsScreen.js"
import DoctorAppointmentsScreen from "./screens/DoctorAppointmentsScreen.js"
const auth = getAuth(app);
/*
LogBox.ignoreLogs([
  "fff",
  "ddd"
  
])*/

const Stack = createStackNavigator()
const Tab = createMaterialTopTabNavigator();
var usertype=""
function App() {
 const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const {theme: {colors}} = useContext(Context)

  async function fetchData(user){
    console.log(auth.currentUser.uid)
    const docRef = doc(db, "users",user.uid );

    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
    
    const data = docSnap.data();
    console.log("data is :", data);
    setUserType(data.userType);

    
     
   } else {
     // doc.data() will be undefined in this case
    console.log("No such document!");
   } 
   }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      if (user) {
        console.log("logged in")
        setCurrUser(user);
        fetchData(user);
        console.log(data.userType )

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
          options={{headerStyle:{backgroundColor:"#34b7f1",borderBottomLeftRadius:19,borderBottomRightRadius:19}}}
           style={{alignItems:"center"}} 
           name='sign In'
            component={SignIn}/>

          <Stack.Screen 
          options={{headerStyle:{backgroundColor:"#34b7f1",borderBottomLeftRadius:19,borderBottomRightRadius:19}}}
           style={{alignItems:"center"}} 
           name='Doktor Girişi'
            component={SignInDoctor}/>

          
        </Stack.Navigator>
      ):( 
     <Stack.Navigator screenOptions={{ headerStyle:{
      backgroundColor: "white",
      
      shadowOpacity:0,
      elevation:0
     },
     headerTintColor: "#1B0AE8",
    /* ,headerTitleAlign: 'center' */}}>

      {!currUser.displayName && (
 <Stack.Screen 
 name='profile' component={userType==="doctor" ?Profile:HastaProfile} 
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

      <Stack.Screen style={{backgroundColor:"#445354"}}
      name='doktorapp' 
      options={{title:"Doktor"}} 
      component={Doctorapp}/>
   
      <Stack.Screen name='Hastaprofile' component={HastaProfile} options={{headerShown:false}}/>

      <Stack.Screen name='chat' component={Chat} options={{headerTitle: (props)=> <ChatHeader {...props}/> }} />
     </Stack.Navigator> 
     )}
     
    </NavigationContainer>
  );
}
function Home(){
  const [userType, setUserType] = useState(""); // Burada userType state'i oluşturun
  useEffect(() => {
    // userType bilgisini Firestore'dan çekin ve setUserType ile ayarlayın
    async function fetchUserType() {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserType(data.userType);
        console.log("usertype in Home Component"+userType)
        console.log(userType)
      
      }
    }
    fetchUserType();
  }, []);


  return <Tab.Navigator>
    <Tab.Screen name="PROFILE" component={userType==="doctor" ?Profile:HastaProfile}/>
    <Tab.Screen name="chats" component={Chats}/>
    <Tab.Screen name="Randevularım" component={userType==="doctor" ?DoctorAppointmentsScreen:PatientAppointmentsScreen}/>
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