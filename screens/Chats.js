import { collection, onSnapshot, query, where,getDocs } from "@firebase/firestore";
import React, { useContext, useEffect,useState } from "react";
import { View, Text,FlatList,StyleSheet } from "react-native";
import GlobalContext from "../context/Context";
import { auth, db } from "../firebase";
import ContactsFloatingIcon from "../components/ContactsFloatingIcon";
import ListItem from "../components/ListItem";
import useContacts from "../hooks/useHooks";
export default function Chats() {
  const { currentUser } = auth;
  const { rooms, setRooms, setUnfilteredRooms } = useContext(GlobalContext);
  const contacts = useContacts();
  const [data, setData] = useState([]);
  const chatsQuery = query(
    collection(db, "rooms"),
    where("participantsArray", "array-contains", currentUser.email)
  );

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
  console.log("data")
  console.log(data)

  useEffect(() => {
    const unsubscribe = onSnapshot(chatsQuery, (querySnapshot) => {
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
    return () => unsubscribe();
  }, []);

  function getUserB(user, contacts) {
    const userContact = contacts.find((c) => c.email === user.email);
    if (userContact && userContact.displayName) {
      return { ...user, contactName: userContact.displayName ,uzmanlik :userContact.uzmanlik , userType:userContact.userType};
    }
    console.log(" user ")
    console.log(user)
    return user;
  }
  return(

    <View style={styles.container}>
    <FlatList style={{paddingBottom: 80}} 
    ListEmptyComponent={() => (
            <Text style={styles.emptyListText}>Henüz Chat'larınız yok.</Text>
          )}
      data={rooms}
      keyExtractor={(item) => item.id.toString()} // Ensure unique key for each item
      renderItem={({ item }) => (
        <ListItem
          type="chat"
          description={item.lastMessage.text}
          key={item.id}
          room={item}
          time={item.lastMessage.createdAt}
          user={getUserB(item.userB, data)}
        />
      )}
    />
    <ContactsFloatingIcon />
  </View>
  );

 /* return (
    <View style={{ flex: 1, padding: 5, paddingRight: 10 ,paddingBottom:80,}} >
      {rooms.map((room) => (
        <ListItem
          type="chat"
          description={room.lastMessage.text}
          key={room.id}
          room={room}
          time={room.lastMessage.createdAt}
          user={getUserB(room.userB, data)}
        
        
        />
      ))}
      <ContactsFloatingIcon />
    </View>
  );*/
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    paddingRight: 10,
    
  }, emptyListText: {
    textAlign: "center",
    alignContent:"center",
    textAlignVertical:"center"
  },
});
