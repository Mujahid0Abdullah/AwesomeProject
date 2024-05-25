import { View, Text, TouchableOpacity, Button } from 'react-native'
import React, { useContext } from 'react'
import { useNavigation } from '@react-navigation/native'
import GlobalContext from '../context/Context'
import {Grid, Row,Col} from "react-native-easy-grid"
import Avatar from "./Avatar"
export default function ListItem({
  description
  ,user
  ,time
  ,room
  ,image
  ,type
  ,style
}) {
  const navigation = useNavigation()
  console.log("listitem user")
  console.log(user)
  const {theme: {color}}= useContext(GlobalContext)
    return (
      <View style={{backgroundColor:"#ffffff",marginBottom:9,marginTop:9,borderRadius:19 ,marginBottom:4 , shadowColor: "black",
  shadowOffset: { width: 0, height: 2 }, // Gölge boyutu ve yönü
  shadowOpacity: 0.25, // Gölge opaklığı
  shadowRadius: 4, // Gölge yayılımı
  elevation: 5 }}>
    <TouchableOpacity 
    style={{height:80,...style}}
    onPress={()=>navigation.navigate("chat",{user,room,image})}>
    
      <Grid style={{maxHeight:80}}>
        <Col style={{width:80, alignItems: "center" , justifyContent: "center"}}>
            <Avatar user={user}  size={type === "contacts"? 40:65 }  />
        </Col>
        <Col style={{marginLeft:10}}>
        <Row style={{alignItems:"center"}}>
            <Col>
            <Text>
                {user.contactName || user.displayName }
            </Text>
            </Col>

        </Row>
        </Col>
      </Grid>
    </TouchableOpacity>
    {user.userType === 'doctor' && (
         <TouchableOpacity style={{height:23, width: 100, backgroundColor: "#1B0AE8", borderRadius: 3, alignSelf: "flex-end" ,margin:9}} onPress={()=>navigation.navigate("doktorapp",{user,room,image})}>
         <Text style={{ color: "white", textAlign: "center" }}>Randevu Al</Text>
       </TouchableOpacity> 
      )}
 
     </View>
  )
}