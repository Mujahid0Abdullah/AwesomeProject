import React, { useContext, useEffect } from 'react'
import { QuerySnapshot, collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { View, Text } from 'react-native'
import { db,auth } from '../firebase'
import ContactsFloatingIcon from '../components/ContactsFloatingIcon'
import GlobalContext from '../context/Context'
export default function Chats() {
    const {currentUser} = auth
    const {rooms,setRooms} = useContext(GlobalContext)
const chatsQuery = query(
    collection(db, "rooms") ,
    where("participantsArray","array-contains",currentUser.email)

) 
useEffect(()=> {
    const unsubscribe = onSnapshot(
        chatsQuery,(QuerySnapshot)=>{
            const parsedChats = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
              userB: doc
                .data()
                .participants.find((p) => p.email !== currentUser.email),
            }));
    setUnfilteredRooms(parsedChats);
    setRooms(parsedChats.filter((doc) => doc.lastMessage));
});
return ()=> unsubscribe();
},[])
return (
<View style={{flex:1, padding: 5, paddingRight:10}}>

<Text>chatpage</Text>
<ContactsFloatingIcon/>

</View>)}