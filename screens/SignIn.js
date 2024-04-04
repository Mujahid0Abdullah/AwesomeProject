import React, { Component, useContext, useState } from 'react';
import {StyleSheet, View, Text, Image, TextInput, Button, TouchableOpacity } from 'react-native';
import  Context  from '../context/Context';
import { signIn, signUp } from '../firebase';
export default function SignIn (){
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [mode, setMode] =useState("signUp")
  const{ theme:{colors}} = useContext(Context)
  async function handlePress(){
    if (mode ==="signUp"){
      await signUp(email, password)
    }
    if (mode ==="signIn"){
      await signIn(email,password)
    }
  }
    return (
      <View style={{justifyContent:'center',alignItems:'center'
      ,flex:1
        ,color:"blue" ,backgroundColor:colors.white,
         textAlign : "center", fontFamily:"Roboto"}}>
        <Text style={{color:colors.foreground,fontSize:24, marginBottom:20}}>Merhaba, Buradan Kayıt yapabilirsin... </Text>
      <Image source={require("../assets/kayıtol.jpg")} style={{width:180 , height:180}} resizeMode='cover'></Image>
      <View style={styles.view}>
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
          style={{width:200 }} width={"50%"} color={colors.secondary} title={mode === "signUp"?'       Kayıt Ol       ':"       Giriş      "}/>
        </View>
        <TouchableOpacity style= {{paddingTop:10}} onPress={() => mode === "signUp" ? setMode("signIn"): setMode("signUp")}>
          <Text>
            {mode === "signUp " ? "hesapiniz varsa ,Giriş yapailirsiniz.": "hesapiniz yoksa , Kayıt olun."}
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
      marginTop: 20 ,backgroundColor: "#128c7e",
      width: "100%",
      borderTopLeftRadius:19,
      borderTopRightRadius:19,
      verticalAlign:'bottom'
    },
    view2:{
      alignItems: 'center',
      backgroundColor: "#128c7e",
      width: "100%",
      paddingBottom:10,
      marginBottom:0,
      verticalAlign:'bottom'
    }
  });

