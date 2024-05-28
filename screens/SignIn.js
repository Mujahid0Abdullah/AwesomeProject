import React, { Component, useContext, useState } from 'react';
import {StyleSheet,Switch, View, Text, Image, PreviewLayout,TextInput, Button, TouchableOpacity } from 'react-native';
import  Context  from '../context/Context';
import { signIn, signUp } from '../firebase';
import { useNavigation } from "@react-navigation/native";
export default function SignIn (){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] =useState("signUp")
  const{ theme:{colors}} = useContext(Context)
  /*async function handlePress(){
    if (mode ==="signUp"){
      await signUp(email, password)
    }
    if (mode ==="signIn"){
      await signIn(email,password)
    }
  }*/

// Add a new state variable for user type
const [userType, setUserType] = useState("patient");

// Update the handlePress function to include user type in sign up
async function handlePress(){
  if (mode === "signUp"){
    await signUp(email, password, userType)
  }
  if (mode === "signIn"){
    await signIn(email, password)
  }
}

  const navigation = useNavigation();
    return (
      <View style={{justifyContent:'flex-end',alignItems:'center'
      ,flex:1
        ,color:"blue" ,backgroundColor:colors.white, 
         textAlign : "center", fontFamily:"Roboto"}}>

           <TouchableOpacity title="doktor"
      onPress={() => navigation.navigate("Doktor Girişi")}
      style={{
        position: "absolute",
        right: 20,
        top: 10,
        borderRadius: 14,
        color:"white",
        width: 80,
        height: 46,
        backgroundColor: colors.button,
        alignItems: "center",
        padding:3,
        justifyContent: "center",
      }}
    ><Text style={{ textAlign : "center",color:"white"}}>Doktor girişi </Text></TouchableOpacity>
   

   <Image
        style={{ resizeMode:'contain',width:434,height:400, alignItems:'flex-end' ,verticalAlign:"end", alignSelf:'center',alignContent:'flex-end' }} 
        source={require("../assets/kayitolsc.jpg")}
      />
      <View style={styles.view}>
        <View style={{flexDirection:'row' , alignItems:'center',alignSelf:'flex-start'}}>
        <Switch
    style={{alignSelf:"baseline", marginLeft:15}}
      value={userType === "doctor"}
      onValueChange={(newValue) => setUserType(newValue? "doctor" : "patient")}
      thumbColor={colors.primary} // Set the thumb color to the button color
      trackColor={{ true: colors.tertiary, false: colors.tertiary }} // Set the track color to the button color
    />
    <Text>{userType === "patient"? "I am a patient" : "I am a doctor"}</Text>
        </View>
    
        <TextInput style={styles.container} 
        value={email}
        onChangeText={setEmail}
        placeholder='Email'/>

        <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry style={styles.container } placeholder='Password'/>
        </View>
        
        <View style={styles.view2}>
          <Button
          onPress={handlePress}
          disabled={!password || !email}
          style={{width:200 }} width={"50%"} color={colors.button} title={mode === "signUp"?'       Kayıt Ol       ':"       Giriş      "}/>
        </View>

        
        <TouchableOpacity style= {{padding:10, verticalAlign:'bottom'}} onPress={() => mode === "signUp" ? setMode("signIn"): setMode("signUp")}>
          <Text>
            {mode === "signUp" ? "hesapiniz varsa ,Giriş yapailirsiniz.": "hesapiniz yok ise , Kayıt olun."}
          </Text>
        </TouchableOpacity>
      </View>
   
    );
  }
  const styles = StyleSheet.create({
 // const {  theme: {colors}} =useContext(Context)
    
    container: {
      borderBottomColor : "#128c7e",
      marginBottom:20,
      marginTop:10,
      //backgroundColor: URL("../asset/kayıtol.jpg"),
     backgroundColor:"white",
      textAlign: 'center',
      borderRadius:9,
      borderWidth:2,
     width:234
      ,height:55,
      borderColor: "#e5e5e5",
      borderCurve : 'circular'      
    },
    view:{
      alignItems: 'center',
      marginTop: -1 ,backgroundColor: "#34b7f1",
      width: "100%",
      borderTopLeftRadius:1,
      borderTopRightRadius:1,
      borderRadius:19,
      verticalAlign:'bottom'
    },
    view2:{
      alignItems: 'center',
      
      width: "100%",
      padding:10,
      marginBottom:0,
      verticalAlign:'bottom'
    }
  });

