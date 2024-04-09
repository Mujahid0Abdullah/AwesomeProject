import React, { useContext, useEffect } from 'react'
import { QuerySnapshot, collection, doc, onSnapshot, query, where } from 'firebase/firestore'
import { View, Text } from 'react-native'
import { db,auth } from '../firebase'
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
        const parsedChats= QuerySnapshot.docs.filter(
            doc => doc.data().lastMessage).map(
                (doc)=>({
                ...doc.data(), 
        id: doc.id,
    userB: 
    doc.data().participants.find(
        (p)=>p.email !== currentUser.email
     ),}))
    setRooms(parsedChats)
});
return ()=> unsubscribe();
},[])
return (
<View>

<Text>chatpage</Text>
</View>)}