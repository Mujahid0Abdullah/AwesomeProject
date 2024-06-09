import React, { useState, useEffect } from "react";
import { useRoute, useFocusEffect } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,Image,
  TouchableOpacity,
} from "react-native";
import { auth, db } from "../firebase.js";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
} from "firebase/firestore";

const PatientAppointmentsScreen = () => {
  const route = useRoute();
  const patientId = auth.currentUser.uid; // Get current patient ID
  const [appointments, setAppointments] = useState([]);
  /*
  useEffect(() => {
    const fetchAppointments = async () => {
      const q = query(
        collection(db, 'appointments'),
        where('patientId', '==', patientId)
      );
      const querySnapshot = await getDocs(q);
      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ ...doc.data(), id: doc.id }); // Belge verilerini ve belge ID'sini ekleyin
      });
      setAppointments(appointmentsData);
    };
    fetchAppointments();
  }, []);

  const handleDeleteAppointment = async (appointment) => {
    // Get the appointment reference
    console.log("appointmentId")
    console.log(appointment)
    const appointmentRef = doc(db, 'appointments').where('patientId', '==', appointment.patientId);
  
    // Delete the appointment document
    await deleteDoc(appointmentRef);
  
    // Update the appointments state
    const updatedAppointments = appointments.filter((app) => app.id !== appointmentId);
    setAppointments(updatedAppointments);
  };
*/
  useEffect(() => {
    const fetchAppointments = async () => {
      const q = query(
        collection(db, "appointments"),
        where("patientId", "==", patientId)
      );
      const querySnapshot = await getDocs(q);
      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ ...doc.data(), id: doc.id }); // Belge verilerini ve belge ID'sini ekleyin
      });
      setAppointments(appointmentsData);
    };
    fetchAppointments();
  }, [patientId]);
  useFocusEffect(
    React.useCallback(() => {
      const fetchAppointments = async () => {
        const q = query(
          collection(db, "appointments"),
          where("patientId", "==", patientId)
        );
        const querySnapshot = await getDocs(q);
        const appointmentsData = [];
        querySnapshot.forEach((doc) => {
          appointmentsData.push({ ...doc.data(), id: doc.id }); // Belge verilerini ve belge ID'sini ekleyin
        });
        appointmentsData.sort((a, b) => new Date(a.time) - new Date(b.time));
        appointmentsData.reverse();
        setAppointments(appointmentsData);
      };
      fetchAppointments();
    }, [])
  );
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
              // Randevu belgesini silmek için referansı alın
              const appointmentRef = doc(db, "appointments", appointmentId);

              // Randevu belgesini silin
              await deleteDoc(appointmentRef);

              // State'i güncelleyin
              const updatedAppointments = appointments.filter(
                (app) => app.id !== appointmentId
              );

              setAppointments(updatedAppointments);
              console.log("Randevu silindi:", appointmentId);
            } catch (error) {
              console.error("Randevu silme hatası:", error);
              Alert.alert("Hata", "Randevu silinemedi!");
            }
          },
        },
      ]
    );
  };
  const renderAppointmentItem = ({ item }) => {
    const appointmentDate = new Date(item.time).toLocaleDateString("tr-TR", {
      weekday: 'short',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    const appointmentTime = new Date(item.time).toLocaleTimeString("tr-TR", {
      hour: '2-digit',
      minute: '2-digit'
    });
  
    return (
      <TouchableOpacity style={styles.appointmentItem}>
        <Text style={styles.doctorName}>{item.doktordisplayName}</Text>
        <View style={styles.appointmentDetails}>
          <Text style={styles.appointmentDateText}>{appointmentDate}</Text>
          <Text style={styles.appointmentTimeText}>{appointmentTime}</Text>
        </View>
        
        <TouchableOpacity
          onPress={() => handleDeleteAppointment(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Sil</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };/*
  const renderAppointmentItem = ({ item }) => {
    const date = new Date(item.time).toLocaleDateString("tr-TR");
    const time = new Date(item.time).toLocaleTimeString("tr-TR");
    return (
      <TouchableOpacity style={styles.appointmentItem}>
        <Text style={styles.appointmentDate}>{date}</Text>
        <Text style={styles.appointmentTime}>{time.substring(0, 5)}</Text>
        <Text style={styles.dotorname}>{item.doktordisplayName}</Text>
        <TouchableOpacity
          onPress={() => handleDeleteAppointment(item.id)}
          style={styles.deleteButton}
        >
          <Text style={styles.deleteButtonText}>Sil</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };
*/
  return (
    <View style={styles.container}>
      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
          <Image  source={require("../assets/emptyapp.png")}  style={{ resizeMode:'contain',width:234,height:200,  alignItems:'flex-end' ,verticalAlign:"end", alignSelf:'center',alignContent:'flex-end', }} />
          <Text style={styles.emptyListText}>Henüz randevularınız yok.</Text></View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  appointmentItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // For some devices without shadowColor support
  },
  appointmentDetails: {
    marginRight: 10,
  },
  appointmentDateText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  appointmentTimeText: {
    fontSize: 14,
    color: "#999",
  },
  doctorName: {
    fontSize: 16,
    flex: 1, // Allow doctor name to expand within available space
    textAlign: 'left' // Align doctor name to the right
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#f14949",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});


export default PatientAppointmentsScreen;
