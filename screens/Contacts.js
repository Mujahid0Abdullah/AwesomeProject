import { View, Text,FlatList } from 'react-native'

import React, { useEffect, useState,useContext } from 'react'
import useContacts from '../hooks/useHooks'
import GlobalContext from '../context/Context'
import { collection, onSnapshot, query, where, doc, setDoc,getDocs } from 'firebase/firestore'
import ListItem from '../components/ListItem'
import { db } from "../firebase";

import { useRoute } from '@react-navigation/native'


export default function Contacts() {
    const contacts= useContacts()
    //console.log(contacts)
    const route= useRoute()
    const [data, setData] = useState([]);
    const image = route.params && route.params.image
    /*var d=[]
    async function dataget(){
        const q = query(collection(db, "users"), where("userType", "==", "doctor"));

const querySnapshot = await getDocs(q);
var data=[]
querySnapshot.forEach((doc) => {
  // doc.data() is never undefined for query doc snapshots
  console.log(doc.id, "  => ", doc.data());
  data.push(doc.data());
  d.push(doc.data())
  console.log("data ="+data[0].email)
}); return data
    }
   const data=  dataget()
    console.log(d+"data ==="+data[0])*/

    useEffect(() => {
        async function fetchData() {
          const q = query(collection(db, "users"), where("userType", "==", "doctor"));
          const querySnapshot = await getDocs(q);
          const fetchedData = [];
          querySnapshot.forEach((doc) => {
            fetchedData.push(doc.data());
          });
          setData(fetchedData);
        }
    
        fetchData();
      }, []); // Bu boş bağımlılık dizisi, yalnızca bileşen yüklendiğinde bir kez çalışmasını sağlar
    console.log(data)
  return (
    <FlatList style={{flex:1, padding:10}} 
    data={data}
    keyExtractor={(_,i)=> i}
    renderItem={({item})=> <ContactPreview contact={item} image={image} />}
    
    />
     
   
  )
}

function ContactPreview({contact,image}){
    const {unfilteredRooms, rooms}=  useContext(GlobalContext)

    const [user,setUser]= useState(contact)
    useEffect(()=>{
        const q= query(
            collection(db,"users"),
            where("email","==",contact.email)
        )
        
        const unsubscribe = onSnapshot(q,(snapshot)=> {
            if(snapshot.docs.length){
                const userDoc = snapshot.docs[0].data()
                setUser((prevUser)=> ({...prevUser,userDoc}))
                console.log("userdoc ")
                console.log(userDoc)
                console.log("userdoc ")
            }
        })
        console.log(unsubscribe)
        return ()=> unsubscribe()

    },[])
    return(
        <ListItem style={{marginTop:7}} 
        type="contacts" user={user} 
        image={image}
         room={
            unfilteredRooms.find((room) => room.participantsArray.includes(contact.email)
        )} />
    )
}