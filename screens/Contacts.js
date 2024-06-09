import { View, Text, FlatList, TextInput,StyleSheet } from 'react-native';
import React, { useEffect, useState, useContext } from 'react';
import GlobalContext from '../context/Context';
import { collection, onSnapshot, query, where, doc, setDoc, getDocs } from 'firebase/firestore';
import ListItem from '../components/ListItem';
import { db } from "../firebase";
import { useRoute } from '@react-navigation/native';

export default function Contacts() {
  const route = useRoute();
  const image = route.params && route.params.image;

  const [filteredData, setFilteredData] = useState([]); // Data for FlatList after filtering
  const [allData, setAllData] = useState([]); // All fetched doctor data

  const { unfilteredRooms, rooms } = useContext(GlobalContext);

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "users"), where("userType", "==", "doctor"));
      const querySnapshot = await getDocs(q);
      const fetchedData = [];
      querySnapshot.forEach((doc) => {
        fetchedData.push(doc.data());
      });
      setAllData(fetchedData);
      setFilteredData(fetchedData); // Set initial filtered data to all doctors
    }
    fetchData();
  }, []);

  const handleSearch = (text) => {
    const filtered = allData.filter((item) =>
      item.displayName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        placeholder="Doktor Ara..."
        style={{ padding: 10, backgroundColor: '#f5f5f5', borderRadius: 5 }}
        onChangeText={handleSearch}
      />
      <FlatList
        style={{ flex: 1 }}
        data={filteredData}
        keyExtractor={(_, i) => i}
        renderItem={({ item }) => (
          <ContactPreview contact={item} image={image} />
        )}
      />
    </View>
  );
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
} /*var d=[]
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

const styles = StyleSheet.create({
  searchBar: {
      height: 40,
      borderColor: '#ccc',
      borderWidth: 1,
      borderRadius: 5,
      paddingLeft: 10,
      marginBottom: 10,
  }
});