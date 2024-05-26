import React, { Component, useEffect, useContext, useState } from "react";
import {
  Image,
  Button,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { auth, db } from "../firebase.js";
import { pickImage, askForPermission, uploadImage } from "../utils.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import Context from "../context/Context";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

import { useNavigation } from "@react-navigation/native";

export default function Profile() {
  const {
    theme: { colors },
  } = useContext(Context);

  const [displayName, setDisplayName] = useState("");
  const [uzmanlik, setUzmanlik] = useState("");
  const [hastane, setHastane] = useState(""); // New field for hospital
  const [unvan, setUnvan] = useState(""); // New field for title
  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const status = await askForPermission();
      setPermissionStatus(status);
    })();
  }, []);

  var collectionData = {};

  async function fetchData() {
    const docRef = doc(db, "users", auth.currentUser.uid);
    const docSnap = await getDoc(docRef);

    var data = {};
    if (docSnap.exists) {
      setDisplayName(
        docSnap.data().displayName ? docSnap.data().displayName : ""
      );
      setUzmanlik(docSnap.data().uzmanlik ? docSnap.data().uzmanlik : ""); // Set uzmanlik if present
      setHastane(docSnap.data().hastane ? docSnap.data().hastane : ""); // Set hastane if present
      setUnvan(docSnap.data().unvan ? docSnap.data().unvan : ""); // Set unvan if present
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
      userType: "doctor",
      uzmanlik,
      hastane,
      unvan, // Include new fields
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
          <Text style={styles.textInfo}>Doktor Profili</Text>
          <Text style={styles.textInfo2}>Profil resmini ekleyebilirsiniz</Text>
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
          <Text>{uzmanlik}</Text>
          {/* Ad Soyad Input */}
          <TextInput
            placeholder="Adınız ve Soyadınız"
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.Input}
          />

          {/* Uzmanlık Input */}
          <TextInput
            placeholder="Uzmanlık Alanınız"
            value={uzmanlik}
            onChangeText={setUzmanlik}
            style={styles.Input}
          />

          {/* Hastane Input */}
          <TextInput
            placeholder="Çalıştığınız Hastane"
            value={hastane}
            onChangeText={setHastane}
            style={styles.Input}
          />

          {/* Ünvan Input */}
          <TextInput
            placeholder="Ünvanınız"
            value={unvan}
            onChangeText={setUnvan}
            style={styles.Input}
          />

          {/* Güncelle Butonu */}
          <Button
            title="Güncelle"
            color={colors.button}
            style={{ width: 300, marginTop: 20 }}
            onPress={handlePress}
            disabled={!displayName || !uzmanlik || !hastane || !unvan}
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
    marginTop: 20,
    color: "#000000",
  },
  Input: {
    marginTop: 20,
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
