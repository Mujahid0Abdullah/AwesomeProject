import React, { Component, useEffect, useContext, useState } from "react";
import {
  Image,
  Button,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,Switch
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { auth, db } from "../firebase.js";
import { pickImage, askForPermission, uploadImage } from "../utils.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import messaging from '@react-native-firebase/messaging';
import app from "@react-native-firebase/app"
import * as firebase from 'firebase/app';

import Context from "../context/Context";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const {
    theme: { colors },
  } = useContext(Context);

  const [displayName, setDisplayName] = useState("");
  const [age, setAge] = useState("");
  const [telefonNo, setTelefonNo] = useState(""); // New field for hospital
  const [kilo, setKilo] = useState(""); // New field for hospital

  const [userGen, setUserGen] = useState("Erkek"); // New field for hospital

  const [desc, setDesc] = useState(""); // New field for title
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const status = await askForPermission();
      setPermissionStatus(status);
    })();
  }, []);

/*
  const saveTokenToDatabase = async (token) => {
    if (auth.currentUser) {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await setDoc(userDoc, { token }, { merge: true });
    }
  };
  
  const getToken = async () => {
    console.log("gettoken")
    const token = await messaging().getToken();
    console.log(token)
    saveTokenToDatabase(token);
  };

  messaging().getToken()
  .then(fcmToken => {
    if (fcmToken) {
      console.log(fcmToken)
    } else {
      console.log("fcmToken yok")
    } 
  });*/
  /*
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
      getToken();
    }
  };*/
  /*
  useEffect(() => {
    //requestUserPermission();
    messaging().onTokenRefresh((token) => {
      saveTokenToDatabase(token);
    });
  }, []);
*/



  var collectionData = {};

  async function fetchData() {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    var data = {};
    if (docSnap.exists) {
      setDisplayName(
        docSnap.data().displayName ? docSnap.data().displayName : ""
      );
      setAge(docSnap.data().age ? docSnap.data().age : ""); // Set age if present
      setTelefonNo(docSnap.data().telefonNo ? docSnap.data().telefonNo : ""); // Set telefonNo if present
      setDesc(docSnap.data().desc ? docSnap.data().desc : ""); // Set desc if present
      //setUse(docSnap.data());
      data = docSnap.data();
      collectionData = docSnap.data();
      console.log("data is :", data);
    } else {
      console.log("No such document!");
    }
    return data;
  }

  useFocusEffect(
    React.useCallback(() => { 
      fetchData();
     

    }, [])
  );

  async function handlePress() {
    const user = auth.currentUser;
    let photoURL;
    if (selectedImage) {
      const { url } = await uploadImage(
        selectedImage,
        `images/${user.uid}`,
        "profilePicture"
      );
      photoURL = url;
    }
    const data = await fetchData(); // Fetch data to pre-fill some fields
    const userData = {
      displayName,
      email: user.email,
      userType: "patient",
      userGen,
      age,
      telefonNo,
      desc, // Include new fields
      kilo
    };
    console.log(userData);
    if (photoURL) {
      userData.photoURL = photoURL;
    }
    await Promise.all([
      updateProfile(user, userData),
      setDoc(doc(db, "users", user.uid), { ...userData, uid: user.uid }),
    ]);
    navigation.navigate("home");
  }

  async function handleProfilePicture() {
    const result = await pickImage();

    console.log("ddd+" + result.assets.uri);
    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  const user1 = auth.currentUser;
  const img1 = user1.photoURL;
  return (
    <React.Fragment>
      <StatusBar style="auto" />
      <ScrollView style={{ flex: 1 }}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            flex: 1,
            padding: Constants.statusBarHeight + 20,
            padding: 20,
          }}
        >
          <Text style={styles.textInfo}>Hasta Profili</Text>
          <Text >Profil resmini ekleyebilirsiniz</Text>
          <TouchableOpacity onPress={handleProfilePicture} style={styles.img}>
            {!selectedImage ? (
              !img1 ? (
                <MaterialCommunityIcons
                  size={45}
                  name="camera-plus"
                  color={colors.iconGray}
                />
              ) : (
                <Image
                  source={{ uri: img1 }}
                  style={{ width: "100%", height: "100%", borderRadius: 120 }}
                />
              )
            ) : (
              <Image
                source={{ uri: selectedImage }}
                style={{ width: "100%", height: "100%", borderRadius: 120 }}
              />
            )}
          </TouchableOpacity>
          <Text>{displayName}</Text>
          <Text>{age}</Text>
          {/* Ad Soyad Input */}
          <TextInput
            placeholder="Adınız ve Soyadınız"
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.Input}
          />
                    <Text style={styles.textInfo2} >yaşınız</Text>

          {/* Input */}
          <TextInput
            placeholder="yaşınız"
            value={age}
            onChangeText={setAge}
            style={styles.Input}
          />
                    <Text style={styles.textInfo2} >Kilonuz</Text>

           <TextInput
            placeholder="Kilonuz"
            value={kilo}
            onChangeText={setKilo}
            style={styles.Input}
          />
           <View style={{flexDirection:'row' , alignItems:'center',alignSelf:'flex-start'}}>
          <Text >{userGen}</Text>
          <Switch
      value={userGen === "Erkek"}
      onValueChange={(newValue) => setUserGen(newValue? "Erkek" : "Kadın")}
      thumbColor={colors.button} // Set the thumb color to the button color
      trackColor={{ true: colors.button, false: colors.button }} // Set the track color to the button color
    />
    </View>
         <Text style={styles.textInfo2} >Telefon No</Text>

          {/* tno Input */}
          <TextInput
            placeholder="telefon No"
            value={telefonNo}
            onChangeText={setTelefonNo}
            style={styles.Input}
          />
          <Text style={styles.textInfo2} >Açıklama</Text>

          {/* Ünvan Input */}
          <TextInput
            placeholder="Açıklama"
            value={desc}
            onChangeText={setDesc}
            style={styles.Input}
          />

          {/* Güncelle Butonu */}
          <Button
            title="Güncelle"
            color={colors.button}
            style={{ width: 300, marginTop: 20 }}
            onPress={handlePress}
            disabled={!displayName || !age || !telefonNo || !desc}
          />
        </View>
      </ScrollView>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({
  img: {
    marginTop: 30,
    borderRadius: 120,
    marginBottom: 4,
    width: 120,
    height: 120,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "#fefefe",
  },
  textInfo: {
    fontSize: 22,
    color: "#3395ff",
  },

  textInfo2: {
    fontSize: 14,
    marginTop: 10,
    marginLeft:28,
    color: "#000000",
    
    alignSelf:"flex-start"
  },
  Input: {
    marginTop: 2,
    borderBottomColor: "#92cbdf",
    marginBottom: 20,
    width: 300,
    backgroundColor: "white",
    textAlign: "center",
    borderRadius: 9,
    borderWidth: 2,
    height: 55,
    //borderColor: "#757575",
    curve: "circular",
  },
});
