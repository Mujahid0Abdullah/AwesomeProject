
import React, { useState, useEffect } from "react";
import { useRoute,useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert, Image
} from "react-native";
import { auth, db } from "../firebase.js";
import {
  collection,
  query,
  where,doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export default function DoctorAppointmentsScreen() {
  const route = useRoute();
  const userB = auth.currentUser; // Doctor information
  const [appointments, setAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      const fetchAppointments = async () => {
        const q = query(
          collection(db, "appointments"),
          where("doktorEmail", "==", userB.email)
        );
        const querySnapshot = await getDocs(q);
        const appointmentsData = [];
        querySnapshot.forEach((doc) => {
          appointmentsData.push({ ...doc.data(), id: doc.id }); // Belge verilerini ve belge ID'sini ekleyin
        });
        setAppointments(appointmentsData.sort((a, b) => new Date(a.time) - new Date(b.time)).reverse());
      };
      fetchAppointments();
    }, [])
  );/*
  useEffect(() => {
    const fetchAppointments = async () => {
      const q = query(
        collection(db, "appointments"),
        where("doktorEmail", "==", userB.email)
      );
      const querySnapshot = await getDocs(q);
      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ ...doc.data(), id: doc.id }); // Belge verilerini ve belge ID'sini ekleyin
      });
      setAppointments(appointmentsData);
    };
    fetchAppointments();
  }, []); // Runs only on first render*/

  const handleDeleteAppointment = async (appointmentId) => {
    Alert.alert(
      "Randevuyu Sil",
      "Seçili randevuyu silmek istediğinize emin misiniz?",
      [
        {
          text: "İptal",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "Sil",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "appointments", appointmentId));
              const updatedAppointments = appointments.filter(
                (appt) => appt.id !== appointmentId
              );
              setAppointments(updatedAppointments);
              console.log("Randevu silindi:", appointmentId);
              //await sendAppointmentDeletionNotification({ appointmentId });  // Pass appointmentId as an argument

            } catch (error) {
              console.error("Randevu silme hatası:", error);
              Alert.alert("Hata", "Randevu silinemedi!");
            }
          },
        },
      ]
    );
  };
/*
  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.appointmentTextname}>
        Hasta: {item.patientdisplayName}
      </Text>
      
      <Text style={styles.appointmentTextTarih}>Tarih: {item.date}</Text>
      <Text style={styles.appointmentText}>
        Saat: {item.time.split("T")[1].slice(0, 5)}
      </Text>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteAppointment(item.id)}
      >
        <Text style={styles.deleteButtonText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );*/
/*
  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentItem}>
      <View style={styles.appointmentDetails}>
        <Text style={styles.appointmentTextName}>Hasta: {item.patientDisplayName}</Text>
        <Text style={styles.appointmentTextDate}>Tarih: {item.date}</Text>
      </View>
      <Text style={styles.appointmentTextTime}>Saat: {item.time.split('T')[1].slice(0, 5)}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAppointment(item.id)}>
        <Text style={styles.deleteButtonText}>Sil</Text>
      </TouchableOpacity>
    </View>
  );*/
  const renderAppointment = ({ item }) => (
    <TouchableOpacity style={styles.appointmentItem} onPress={() => setModalVisible(false)}>
      <View style={styles.appointmentDetails}>
        <Text style={styles.appointmentTextName}>{item.patientdisplayName}</Text>
        <Text style={styles.appointmentTextDate}>{item.date}</Text>
        <View>
        <Text >Hastanın Bilgileri:</Text>
        <Text style={styles.appointmentTextDate}>{item.patientEmail}</Text>
        </View>
      </View>
      <Text style={styles.appointmentTextTime}>{item.time.split('T')[1].slice(0, 5)}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteAppointment(item.id)}>
        <Text style={styles.deleteButtonText}>Sil</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
  
  

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{userB.displayName}</Text>
        <Text style={styles.subtitle}>{userB.uzmanlik}</Text>
        <FlatList
          data={appointments}
          renderItem={renderAppointment}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
            <Image  source={require("../assets/emptyapp.png")}  style={{ resizeMode:'contain',width:234,height:200,  alignItems:'flex-end' ,verticalAlign:"end", alignSelf:'center',alignContent:'flex-end' }} />
            <Text style={styles.emptyListText}>Henüz randevunuz yok.</Text></View>
          )}
        />
      </View>
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9fafc', // Light background
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333', // Darker text color
    marginBottom: 15,
  },
  subtitle: {
    fontSize: 20,
    color: '#666',
    marginBottom: 25,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff', // White background for each appointment
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    marginBottom: 15,
    marginLeft:3,marginRight:3
  },
  appointmentDetails: {
    flex: 1, // Allow details to expand as needed
  },
  appointmentTextName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  appointmentTextDate: {
    fontSize: 16,
    color: '#666',
  },
  appointmentTextTime: {
    alignSelf:"baseline",

    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  deleteButton: {
    alignSelf:"flex-end",
    backgroundColor: '#dc3545', // Red delete button
    padding: 10,
    borderRadius: 5, margin:6
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
   
  },
  emptyListText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
  },
});

/*
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  appointmentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  appointmentDetails: {
    flexDirection: 'column', // Items stacked vertically
  },
  appointmentTextName: {
    fontSize: 16,
    marginBottom: 5, // Add some spacing between name and date
  },
  appointmentTextDate: {
    fontSize: 16,
  },
  appointmentTextTime: {
    fontSize: 16,
    marginTop:12
  },
  deleteButton: {
    backgroundColor: '#e03f3f',
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 14,
  },
  emptyListText: {
    textAlign: 'center',
  },
});*/
/*
const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
  },
  appointmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    padding: 15,
    margin:5,
    borderRadius: 5,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 16,
    display:"flex",
    position:"absolute",
    top:19
  }, appointmentTextname: {
    fontSize: 16,
    display:"flex",
    position:"absolute",
    top:1
  }, appointmentTextTarih: {
    fontSize: 16,
    display:"flex",
    position:"absolute",
    top:29,
    right:60
  },
  deleteButton: {
    backgroundColor: "#e03f3f",
    padding: 5,
    borderRadius: 5,
    position:"absolute",
    top:4,
    left:290
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  emptyListText: {
    textAlign: "center",
  },
});*/
