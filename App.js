import { StatusBar } from "expo-status-bar";
import React, { useContext, useEffect, 
  useState } from "react";
import { StyleSheet, Text, View, LogBox, Button, Pressable } from "react-native";
import { app, db } from "./firebase.js";
import { useAssets } from "expo-asset";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { doc, setDoc, getDoc } from "firebase/firestore";
import * as Notifications from "expo-notifications";
import { useRoute, useFocusEffect } from "@react-navigation/native";


import { getAuth, onAuthStateChanged } from "@firebase/auth";
import SignIn from "./screens/SignIn.js";
import Context from "./context/Context.js";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ContextWrapper from "./context/ContextWrapper.js";
import Profile from "./screens/Profile.js";
import Chats from "./screens/Chats.js";
import Photo from "./screens/Photo.js";
import Contacts from "./screens/Contacts.js";
import messaging from "@react-native-firebase/messaging";
import Doctorapp from "./screens/Doctorapp.js";
import Chat from "./screens/Chat.js";
import ChatHeader from "./components/ChatHeader.js";
import SignInDoctor from "./screens/SignInDoctor.js";
import HastaProfile from "./screens/HastaProfile.js";
import PatientAppointmentsScreen from "./screens/PatientAppointmentsScreen.js";
import DoctorAppointmentsScreen from "./screens/DoctorAppointmentsScreen.js";
import BarcodeScannerScreen from "./screens/BarcodeScannerScreen.js";
import { PermissionsAndroid } from "react-native";
PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
const auth = getAuth(app);

LogBox.ignoreAllLogs();//Ignore all log notifications


const Stack = createStackNavigator();
const Tab = createMaterialTopTabNavigator();
var usertype = "";
function App() {
  const [currUser, setCurrUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userType, setUserType] = useState(null);
  const {
    theme: { colors },
  } = useContext(Context);

  const saveTokenToDatabase = async (token) => {
    if (auth.currentUser) {
      const userDoc = doc(db, "users", auth.currentUser.uid);
      await setDoc(userDoc, { token }, { merge: true });
    }
  };

  useEffect(() => {
    async function getToken() {
      const token = (await Notifications.getDevicePushTokenAsync()).data;
      console.log(token);
      console.log("token");

      saveTokenToDatabase(token);
    }
    return () => getToken();
  }, []);

  async function fetchData(user) {
    console.log(auth.currentUser.uid);
    const docRef = doc(db, "users", user.uid);

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
        console.log("logged in");
        setCurrUser(user);
        fetchData(user);
        console.log(data.userType);
      }
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Text>Loading...</Text>;
  }
  return (
    <NavigationContainer>
      {!currUser ? (
        <Stack.Navigator>
          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: "#0F7FCB",
                borderBottomLeftRadius: 19,
                borderBottomRightRadius: 19,
              },
            }}
            style={{ alignItems: "center" }}
            name="Giriş "
            component={SignIn}
          />

          <Stack.Screen
            options={{
              headerStyle: {
                backgroundColor: "#34b7f1",
                borderBottomLeftRadius: 19,
                borderBottomRightRadius: 19,
              },
            }}
            style={{ alignItems: "center" }}
            name="Doktor Girişi"
            component={SignInDoctor}
          />
        </Stack.Navigator>
      ) : (
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: "white",

              shadowOpacity: 0,
              elevation: 0,
            },
            headerTintColor: "#0F7FCB",
            /* ,headerTitleAlign: 'center' */
          }}
        >
          {!currUser.displayName && (
            <Stack.Screen
              name="profile"
              component={userType === "doctor" ? Profile : HastaProfile}
              options={{ headerShown: false }}
            />
          )}

          <Stack.Screen
            style={{ backgroundColor: "#445354" }}
            name="home"
            options={({ navigation }) => ({
              title: "Doctors' WAY",
              headerRight: () => (
                <Pressable style={[styles.button, styles.buttonOpen]}
                  title="Scan QR Code"
                  onPress={() => navigation.navigate('BarcodeScanner')}
                ><Text style={{color:"white"}}>Scan QR Code</Text></Pressable>
              ),
              headerStyle: {
                backgroundColor: "white",
              },
            })}
         
            component={Home}
          />

          <Stack.Screen
            name="contacts"
            style={{ backgroundColor: "#445354" }}
            options={{ title: "Doktor Seç" }}
            component={Contacts}
          />

          <Stack.Screen
            style={{ backgroundColor: "#445354" }}
            name="doktorapp"
            options={{ title: "Doktor" }}
            component={Doctorapp}
          />
          <Stack.Screen name="BarcodeScanner" component={BarcodeScannerScreen} />
          <Stack.Screen
            name="Hastaprofile"
            component={HastaProfile}
            options={{ headerShown: false }}
          />

          <Stack.Screen
            name="chat"
            component={Chat}
            options={{ headerTitle: (props) => <ChatHeader {...props}  />  }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
function Home() {
  const {
    theme: { colors },
  } = useContext(Context);
  const [userType, setUserType] = useState(""); // Burada userType state'i oluşturun
  useEffect(() => {
    // userType bilgisini Firestore'dan çekin ve setUserType ile ayarlayın
    async function fetchUserType() {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserType(data.userType);
        console.log("usertype in Home Component" + userType);
        console.log(userType);
      }
    }
    fetchUserType();
  }, []);

/*
  useFocusEffect(
    React.useCallback(() => { 
       // userType bilgisini Firestore'dan çekin ve setUserType ile ayarlayın
    async function fetchUserType() {
      const docRef = doc(db, "users", auth.currentUser.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setUserType(data.userType);
        console.log("usertype in Home Component" + userType);
        console.log(userType);
      }
    }
    fetchUserType();
    }, [])
  );*/
  return (
    <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: { fontSize: 12, fontWeight: 'bold' },
      tabBarStyle: { backgroundColor:"white" },
      tabBarActiveTintColor:  colors.primary,
      tabBarInactiveTintColor: '#000',
      tabBarIndicatorStyle: { backgroundColor: colors.primary },
    }}
    >
      <Tab.Screen
        name="PROFILE"
        component={userType === "doctor" ?  Profile : HastaProfile}
      />
      <Tab.Screen name="chats" component={Chats} />
      <Tab.Screen
        name="Randevularım"
        component={
          userType === "doctor"
            ? DoctorAppointmentsScreen
            : PatientAppointmentsScreen
        }
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  }, button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,   alignItems: 'center',

  },
  buttonOpen: {
    backgroundColor: '#000',marginRight:7,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
});

function Main() {
  const [assets] = useAssets(
    require("./assets/chatbg.png"),
    require("./assets/icon.png")
  );
  if (!assets) {
    return <Text>Loading...</Text>;
  }
  return (
    <ContextWrapper>
      <App />
    </ContextWrapper>
  );
}

export default Main; /*

/*
  const getToken = async () => {
    console.log("gettoken")
    const token = (await Notifications.getDevicePushTokenAsync()).data;

    //const token = await firebase.messaging().getToken();
    console.log(token)
    saveTokenToDatabase(token);
  };*/
/*
  messaging().getToken()
  .then(fcmToken => {
    if (fcmToken) {
      console.log(fcmToken)
    } else {
      console.log("fcmToken yok")
    } 
  });*/
/*
  
  };*/
/*
  const functions = require('firebase-admin').functions();
const admin = require('firebase-admin');

admin.initializeApp();

exports.sendAppointmentDeletionNotification = functions.firestore
  .document('appointments/{appointmentId}')
  .onDelete(async (snapshot, context) => {
    const appointmentData = snapshot.data();
    const patientId = appointmentData.patientId; // Assuming you have a patientId field

    // Get the patient's device token (implement logic to retrieve it)
    const patientDeviceToken = await getPatientDeviceToken(patientId);

    if (!patientDeviceToken) {
      console.warn('Patient device token not found:', patientId);
      return;
    }

    const message = {
      notification: {
        title: 'Randevunuz Silindi',
        body: `Dr. ${appointmentData.doktorDisplayName} ile olan randevunuz iptal edildi.`,
      },
      token: patientDeviceToken,
    };

    // Send the notification using Firebase Cloud Messaging (FCM)
    admin.messaging().send(message)
      .then((response) => {
        console.log('Notification sent successfully:', response);
      })
      .catch((error) => {
        console.error('Error sending notification:', error);
      });
  });

// Replace this with your logic to retrieve the patient's device token
async function getPatientDeviceToken(patientId) {
  // Implement logic to fetch the device token from your database or user profile
  // based on the patientId
  return 'YOUR_PLACEHOLDER_DEVICE_TOKEN'; // Replace with actual logic
}

    useEffect(() => {
  
      const getToken = async () => {
        console.log("gettoken")
        const token = (await Notifications.getDevicePushTokenAsync()).data;
    
        //const token = await firebase.messaging().getToken();
        console.log(token)
        saveTokenToDatabase(token);
      };
      getToken()
  }, []);*/
