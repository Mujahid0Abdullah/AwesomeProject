import React, { useState, useEffect } from 'react';
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {auth, db} from "../firebase.js"
import { collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';

export default function Doctorapp() {
  const route = useRoute();
  const userB = route.params.user;
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [appointments, setAppointments] = useState([]);
  const [upcomingDays, setUpcomingDays] = useState(getUpcomingDays());

  useEffect(() => {
    const fetchAppointments = async () => {
      const q = query(
        collection(db, "appointments"),
        where("doktorEmail", "==",userB.email),
        where("date", "==", selectedDate.toDateString())
      );
      const querySnapshot = await getDocs(q);
      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push(doc.data());


        console.log(doc.data())
      });
      setAppointments(appointmentsData);
    };
    fetchAppointments();
  }, [selectedDate]);


  console.log("userb doktor")
  console.log(userB)


  const handleTimeSelect = async (hour, minute) => {
    console.log("minute")
    console.log(minute)
    const appointmentTime = new Date(selectedDate);
    appointmentTime.setHours(hour);
    appointmentTime.setMinutes(minute);
    console.log(appointmentTime.toISOString())

    const appointmentData = {
      doktorEmail: userB.email,
      //doctor id nonuseble
      doktordisplayName:userB.displayName,
      doctorId: "xWLtqtFHjqa2Z7LS2e5KtpRH5Vg1",
      patientId: auth.currentUser.uid,
      patientEmail: auth.currentUser.email,
      patientdisplayName: auth.currentUser.displayName,
      date: selectedDate.toDateString(),
      time: appointmentTime.toISOString(),
      bookedAt: Timestamp.now(),
    };

    await addDoc(collection(db, "appointments"), appointmentData);
    
    console.log('Randevu eklendi:', appointmentData);
    
  };
  
  const renderAppointmentTimes = () => {
    const times = [];
    const bookedTimes = appointments.map(app => {
      const date = new Date(app.time);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    });
  
    for (let i = 8; i < 17; i++) {
      for (let j = 0; j < 2; j++) {
        const hour = i + Math.floor(j * 0.5);
        const minute = j === 0 ? '00' : '30';
        const timeString = `${hour < 10 ? '0' + hour : hour}:${minute}`;
        const isBooked = bookedTimes.some(bookedTime => bookedTime === timeString);
        const buttonStyle = isBooked ? styles.bookedTime : styles.availableTime;
  
        times.push(
          <TouchableOpacity
            key={`${hour}-${minute}`}
            onPress={() => handleTimeSelect(hour, minute)}
            style={[styles.timeButton, buttonStyle]}
            disabled={isBooked}
          >
            <Text style={styles.timeText}>{timeString}</Text>
          </TouchableOpacity>
        );
      }
    }
    return times;
  };

 function getUpcomingDays () {
    const today = new Date();
    const upcomingDays = [];

    for (let i = 0; i < 7; i++) {
      const upcomingDate = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000));
      const dayString = upcomingDate.toLocaleDateString('tr-TR', { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' });
      upcomingDays.push({ date: upcomingDate, dayString });
    }
    return upcomingDays;
  };

  const handleDateSelect = (selectedDay) => {
    setSelectedDate(selectedDay.date);
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>{userB.displayName}</Text>
        <Text style={styles.subtitle}>{userB.uzmanlik}</Text>
        <View style={styles.datesContainer}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {upcomingDays.map((day) => (
              <TouchableOpacity
                key={day.date.toString()}
                onPress={() => handleDateSelect(day)}
                style={day.date.toDateString() === selectedDate.toDateString() ? styles.selectedDateButton : styles.dateButton}
                //disabled={day.date < new Date()}
              >
                <Text style={styles.dateText}>{day.dayString}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
        <View style={styles.appointmentTimes}>
          {renderAppointmentTimes()}
        </View>
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
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  datesContainer: {
    flexDirection: 'row',
    marginBottom: 19,
  },
  dateButton: {
    margin: 10,
    width: 55,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#007BFF',

  },
  selectedDateButton: {
    margin: 10,
    width: 75,
    height: 55,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#007BFF',
  
  },
  dateText: {
    color:"#000000"
  },
  timeButton: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
  },
  bookedTime: {
    backgroundColor: '#C0C0C0',
  },
  availableTime: {
    backgroundColor: '#FFFFFF',
  },
  timeText: {
    color: '#000',
  },
  appointmentTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});
