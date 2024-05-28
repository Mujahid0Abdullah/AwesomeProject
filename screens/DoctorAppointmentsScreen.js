
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Alert,
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
  }, []); // Runs only on first render

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
            } catch (error) {
              console.error("Randevu silme hatası:", error);
              Alert.alert("Hata", "Randevu silinemedi!");
            }
          },
        },
      ]
    );
  };

  const renderAppointment = ({ item }) => (
    <View style={styles.appointmentItem}>
      <Text style={styles.appointmentText}>
        Hasta: {item.patientDisplayName}
      </Text>
      <Text style={styles.appointmentText}>Tarih: {item.date}</Text>
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
            <Text style={styles.emptyListText}>Henüz randevunuz yok.</Text>
          )}
        />
      </View>
    </ScrollView>
  );
}

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
    borderRadius: 5,
    marginBottom: 10,
  },
  appointmentText: {
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: "#e03f3f",
    padding: 5,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 14,
  },
  emptyListText: {
    textAlign: "center",
  },
});
