
import React, { useState } from 'react';
import { useRoute } from "@react-navigation/native";
import {
  View,
  Text,
  StyleSheet,
  Button,
  ScrollView,
  Platform,TouchableOpacity
} from 'react-native';

export default function Doctorapp() {
  const route = useRoute();
  const userB = route.params.user;
  console.log(userB)
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedday, setSelectedday] = useState(new Date());
  const renderAppointmentTimes = () => {
    /*
    const currentHour = selectedDate.getHours();
  const times = [];

  for (let i = 8; i < 17; i++) {
    for (let j = 0; j < 2; j++) { // Her adımda 0.5 saat ekleyelim
      const hour = i + Math.floor(j * 0.5); // Saat hesaplama
      const minute = j === 0 ? '00' : '30'; // Dakika hesaplama
      const timeString = `${hour < 10 ? '0' + hour : hour}:${minute}`;
      const isBooked = true; // Bu kısım, saat dolu mu yok mu bilgisini alacak bir değişken olarak düşünüldü.
      const buttonStyle = isBooked ? styles.bookedTime : styles.availableTime;

      times.push(
        <Button 
          key={`${hour}-${minute}`} 
          title={timeString} 
          onPress={() => handleTimeSelect(hour, minute)} 
          color="#007BFF" 
          disabled={isBooked} 
          style={buttonStyle} 
        />
      );
    }
  }

  return times;*/
  const times = [];

    for (let i = 8; i < 17; i++) {
      for (let j = 0; j < 2; j++) { // Her adımda 0.5 saat ekleyelim
        const hour = i + Math.floor(j * 0.5); // Saat hesaplama
        const minute = j === 0 ? '00' : '30'; // Dakika hesaplama
        const timeString = `${hour < 10 ? '0' + hour : hour}:${minute}`;
        const isBooked = false; // Bu kısım, saat dolu mu yok mu bilgisini alacak bir değişken olarak düşünüldü.
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

  const handleTimeSelect = (hour, minute) => {
    console.log('Seçilen saat:',  `${hour}:${minute}`);
    // Randevu seçimi yapıldıktan sonra uygun işlemleri yapın (örn: Randevu Ekleme, Veritabanı Güncelleme)
  };

  //günler---------------------
  const getUpcomingDays = () => {
    const today = new Date();
    const upcomingDays = [];

    for (let i = 0; i < 7; i++) {
      const upcomingDate = new Date(today.getTime() + (i * 24 * 60 * 60 * 1000)); // Add i days to current date
      const dayString = upcomingDate.toLocaleDateString('tr-TR', { weekday: 'short', year: 'numeric', month: 'numeric', day: 'numeric' }); // Format date in Turkish (modify format as needed)

      upcomingDays.push({
        date: upcomingDate,
        dayString, // Store the formatted date string
      });
    }

    return upcomingDays;
  };

  const [upcomingDays, setUpcomingDays] = useState(getUpcomingDays()); // Initialize with upcoming days

  const handleDateSelect = (selectedDay) => {
    
    setSelectedDate(selectedDay.date); // Update selected date state
    console.log(selectedDate)
    console.log(upcomingDays)
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
                key={day.date.toString()} // Use date object as key
                onPress={() => handleDateSelect(day)}
                style={ day.date.toDateString() === selectedDate.toDateString() ? styles.selectedDateButton : styles.disabledDateButton}
                disabled={day.date < new Date()} // Disable past dates
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
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  timeButton: {
    margin: 5,
    padding: 10,
    borderRadius: 5,
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
    marginBottom:19
   // justifyContent: 'space-between',
  },
  dateButton: {
    margin:14,
    width: 45,
    height: 45,
    marginLeft:6,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
    borderWidth: 1,
    borderColor: '#007BFF',
  },

  disabledDateButton: {
    margin: 14,
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#ccc', // Adjust for visual indication of disabled state
    opacity: 0.5, // Adjust opacity for disabled state
  },
  selectedDateButton: {
    margin: 14,
    width: 65,
    height: 65,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    backgroundColor: '#007BFF', // Adjust for visual indication of selected state
    color: '#fff', // Adjust color for selected state
  },
  bookedTime: {
    backgroundColor: '#C0C0C0',margin:5,
  },
  availableTime: {
    backgroundColor: '#FFFFFF',margin:5,
  },
  appointmentTimes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
});