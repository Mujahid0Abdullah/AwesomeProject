import React, { useEffect, useContext, useState } from "react";
import {
  Image,
  Button,Pressable,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import QRCode from 'react-native-qrcode-svg';

import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
import { StyleSheet } from "react-native";
import { auth, db } from "../firebase.js";
import { pickImage, askForPermission, uploadImage } from "../utils.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Context from "../context/Context";
import { updateProfile } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker } from "react-native-maps";
import Geocoder from "react-native-geocoding";

export default function Profile() {
  const {
    theme: { colors },
  } = useContext(Context);

  const [displayName, setDisplayName] = useState("");
  const [uzmanlik, setUzmanlik] = useState("");
  const [hastane, setHastane] = useState(""); // New field for hospital
  const [unvan, setUnvan] = useState(""); // New field for title
  const [userType, setUserType] = useState("");
  const [email, setEmail] = useState("");
  const [qrValue, setQrValue] = useState('');

  const [selectedImage, setSelectedImage] = useState(null);
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [region, setRegion] = useState({
    latitude: 39.78825,
    longitude: 36.4324,
    latitudeDelta: 8,
    longitudeDelta: 8,
  });
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
      setUserType(docSnap.data().userType )
      setEmail(docSnap.data().email)
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


  useEffect(() => {
    const userDetails = {
      displayName: displayName,
      email: email,
      userType: userType,
      uzmanlik: uzmanlik,
    };
    setQrValue(`doctorapp://${encodeURIComponent(JSON.stringify(userDetails))}`);
  }, [displayName]);
  //-----------------------GÜNCELLEME BUTUNU ----------
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
      region
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
    // return userData
  }
  /*
  useEffect(() => {
    async function navigateToHome() {
      const updatedUserData = await handlePress();
      if (updatedUserData) {
        navigation.navigate("home");
      }
    }
  
    navigateToHome();
  }, []);*/

  //-------------Kullanıcı Fotoğrafı--------------
  async function handleProfilePicture() {
    const result = await pickImage();
    console.log("ddd+" + result.assets.uri);
    if (!result.cancelled) {
      setSelectedImage(result.assets[0].uri);
    }
  }

  //----------------adress konum'a çevirmek((GOOGLE CLOUD))---------------
  Geocoder.init("AIzaSyAkMkFa1ErOqmxfz7bCoocJ6mrcVfNHryA"); // Replace with your API key

  const handleGeocode = async () => {
    if (unvan) {
      try {
        const json = await Geocoder.from(unvan);
        console.log(json);

        const location = json.results[0].geometry.location;
        console.log(location);
        setRegion({
          ...region,
          latitude: location.lat,
          longitude: location.lng,
        });
      } catch (error) {
        console.warn(error);
      }
    }
  };

  //----------------adress konum'a çevirmek---------------
  const fetchLocation = async () => {
    const address = unvan;
    const apiKey = "ad3f44663bd2419babe81e5702defe8f";
    const url = `https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(
      address
    )}&apiKey=${apiKey}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.features) {
        const result = data.features[0];
        setRegion({
          // formatted: result.formatted,
          // lat: result.lat,
          //lon: result.lon,
          latitude: result.geometry.coordinates[1],
          longitude: result.geometry.coordinates[0],
        });
        console.log("reagon");
        console.log(region);
      } else {
        console.error("No results found.");
      }
    } catch (error) {
      console.error("Error fetching location:", error);
    }
  };
  useEffect(() => {
    //handleGeocode();
    fetchLocation();
  }, [unvan]);

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
          <Text style={styles.textInfo2}>ad</Text>

          {/* Ad Soyad Input */}
          <TextInput
            placeholder="Adınız ve Soyadınız"
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.Input}
          />

          <Text style={styles.textInfo2}>Uzmanlık</Text>

          {/* Uzmanlık Input */}
          <TextInput
            placeholder="Uzmanlık Alanınız"
            value={uzmanlik}
            onChangeText={setUzmanlik}
            style={styles.Input}
          />
          <Text style={styles.textInfo2}>Hastane/Klinik adı</Text>

          {/* Hastane Input */}
          <TextInput
            placeholder="Çalıştığınız Hastane"
            value={hastane}
            onChangeText={setHastane}
            style={styles.Input}
          />
          <Text style={styles.textInfo2}>Adres</Text>

          {/* Adres Input */}
          <TextInput
            placeholder="Ünvanınız"
            value={unvan}
            onChangeText={setUnvan}
            style={styles.Input}
          />

          {/* Map View  <Marker coordinate={region} title={unvan} />*/}
          {/* Map View */}
          <MapView style={styles.map} region={region}>
            <Marker coordinate={region} title={unvan} />
          </MapView>
          <Text style={styles.modalTitle}>QR Code</Text>
          {qrValue ? <QRCode value={qrValue} size={100} /> : <Text>Loading...</Text>}
          {/* Güncelle Butonu */}
          <Pressable
            style={[styles.button, styles.buttonOpen]}
            color={colors.button}
           
            onPress={handlePress}
            disabled={!displayName || !uzmanlik || !hastane }
          ><Text style={{color:"white"}}>Güncelle</Text></Pressable>
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
    marginTop: 2,
    borderBottomColor: "#92cbdf",
    marginBottom: 20,
    width: 300,
    backgroundColor: "white",
    textAlign: "center",
    borderRadius: 9,
    borderWidth: 2,
    height: 55,
  },
  map: {
    borderRadius: 4,
    width: 300,
    height: 200,
    margin: 20,
    borderWidth: 2,
  },button: {marginTop:4,
    borderRadius: 20,
   padding: 10,
    elevation: 2,   alignItems: 'center',

  },
  buttonOpen: {
    backgroundColor: '#000',
  },
});
