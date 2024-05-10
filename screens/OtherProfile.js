import React, { Component,useEffect, useContext, useState } from 'react';
import { Image,Button,TextInput,View, Text, Touchable ,TouchableOpacity} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Constants from "expo-constants";
import { StyleSheet } from 'react-native';
import {auth, db} from "../firebase.js"
import {pickImage,askForPermission, uploadImage} from "../utils.js"
 import { MaterialCommunityIcons } from "@expo/vector-icons"

import Context from "../context/Context"
import { updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';




export default function OtherProfile (){
    const  { theme : {colors}}= useContext(Context)
    const [displayName ,setDisplayName]= useState(""
    );
    const [use , setuse]=useState(auth.currentUser)
    const [selectedImage , setSelectedImage]= useState(null)
    const [permissionStatus, setPermissionStatus] = useState(null);
    const navigation = useNavigation()
  useEffect(() => {
    (async () => {
      const status = await askForPermission();
      setPermissionStatus(status);
    })();
  }, []);
  async function handlePress (){
    const user= auth.currentUser
    let photoURL
    if(selectedImage){
      const {url}= await uploadImage(
        selectedImage,
        `images/${user.uid}`,
        "profilePicture");
    photoURL=url;
    }
    const userData = { displayName,
      email: user.email
    }
    if (photoURL){
      userData.photoURL= photoURL
    }
    await Promise.all([
      updateProfile(user, userData)
    , setDoc(doc(db,"users",user.uid),{...userData,uid:user.uid})
    ])
    navigation.navigate("home")

  }
    async function handleProfilePicture() {
        const result = await pickImage();
        
        console.log("ddd"+ result.assets.uri)
        if (!result.cancelled) {
          setSelectedImage(result.assets[0].uri);
        }
      }

      const user1= auth.currentUser
      const img1 =user1.photoURL
      console.log(user1 +"   "+ img1)
    return (
        <React.Fragment>
            <StatusBar style="auto"/>
<View style={{
    alignItems:'center',
    justifyContent:'center',
    flex:1,
    padding: Constants.statusBarHeight +20,
    padding:20
}}>
          <Text style={styles.textInfo}> Profile Info </Text>
          <Text style={styles.textInfo2}>  resim ve isim ekle </Text>
        <TouchableOpacity 
        onPress={handleProfilePicture}
        style={styles.img}>
             {!selectedImage ? (
    !img1 ? (
      <MaterialCommunityIcons size={45} name='camera-plus' color={colors.iconGray} />
    ) : (
      <Image source={{ uri: img1 }} style={{ width: "100%", height: "100%", borderRadius: 120 }} />
    )
  ) : (
    <Image source={{ uri: selectedImage }} style={{ width: "100%", height: "100%", borderRadius: 120 }} />
  )}
        </TouchableOpacity >
       
        <View style={{ marginTop: "auto"}}>
        <TextInput
          placeholder="Adınız yazın"
          value={!displayName ? (user1.displayName):(displayName)}
          onChangeText={setDisplayName}
          style={{
            
                borderBottomColor : "#128c7e",
                marginBottom:20,
                width:300,
                //backgroundColor: URL("../asset/kayıtol.jpg"),
                backgroundColor:"white",
                textAlign: 'center',
                borderRadius:9,
                borderWidth:2,
            
                height:55,
                borderColor: "#e5e5e5",
                borderCurve : 'circular'      
              ,
            
            marginTop: "40",
          
        
          }}
        />
          <Button
            title= {(user1.displayName)?"Update" :"Next"}
            color={colors.secondary}
            style={{width: 40}}
            onPress={handlePress}
            disabled={!displayName}
          />
        </View>

        </View>
        </React.Fragment>
        
      )
    };

  
styles = StyleSheet.create ({
    img:{
        marginTop: 30,
    borderRadius : 120 ,
    width: 120,
    height: 120,
    justifyContent:"center",
    alignItems: 'center',
    backgroundColor: "#fefefe"
    }
    ,
    textInfo:
    {
    fontSize:22,
    color: "#04cbb8"
    }
   
,
textInfo2:
{
fontSize:14,
marginTop:20,
color: "#000000"
}

})
