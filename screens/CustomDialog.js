import React from "react";
import { View, Modal, Text, TextInput, Button, StyleSheet } from "react-native";

export default function CustomDialog({ visible, onClose, onSubmit, displayName, setDisplayName, uzmanlik, setUzmanlik, hastane, setHastane, unvan, setUnvan }) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Bilgileri Güncelle</Text>
          <TextInput
            placeholder="Adınız ve Soyadınız"
            value={displayName}
            onChangeText={setDisplayName}
            style={styles.input}
          />
          <TextInput
            placeholder="Uzmanlık Alanınız"
            value={uzmanlik}
            onChangeText={setUzmanlik}
            style={styles.input}
          />
          <TextInput
            placeholder="Çalıştığınız Hastane"
            value={hastane}
            onChangeText={setHastane}
            style={styles.input}
          />
          <TextInput
            placeholder="Adresiniz"
            value={unvan}
            onChangeText={setUnvan}
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <Button title="İptal" onPress={onClose} />
            <Button title="Güncelle" onPress={onSubmit} disabled={!displayName || !uzmanlik || !hastane || !unvan} />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  input: {
    width: 250,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
