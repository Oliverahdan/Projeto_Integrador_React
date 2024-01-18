import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const competencias = [
  "Linguagens",
  "Matemática",
  "Ciências Humanas",
  "Ciências da Natureza",
];

export default function EstudoScreenLembrate() {
  const navigation = useNavigation();
  const route = useRoute();

  const { selectedHourValue, selectedSubjectValue } = route.params;
  const [selectedDate, setSelectedDate] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [reminderInfo, setReminderInfo] = useState(null);

  const handleDateSelect = (date) => {
    setSelectedDate(date.dateString);
  };

  const handleSave = async () => {
    try {
      const existingData = (await AsyncStorage.getItem("estudos")) || "[]";
      const existingDataArray = JSON.parse(existingData);

      existingDataArray.push({
        selectedHourValue,
        selectedSubjectValue: competencias[selectedSubjectValue],
        selectedDate,
      });

      await AsyncStorage.setItem("estudos", JSON.stringify(existingDataArray));

      console.log("Informações salvas com sucesso!");

      // Definir as informações do lembrete para mostrar
      setReminderInfo({
        selectedHourValue,
        selectedSubjectValue: competencias[selectedSubjectValue],
        selectedDate,
      });

      // Ativar o estado para mostrar o lembrete
      setShowMessage(true);

      // Redirecionar para a tela de ListaLembretesScreen após salvar
      setTimeout(() => {
        setShowMessage(false);
        setReminderInfo(null);
        navigation.navigate("ListaLembretesScreen");
      }, 3000);
    } catch (error) {
      console.error("Erro ao salvar informações:", error);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 18, marginBottom: 16 }}>
        Você irá estudar {selectedHourValue} horas de{" "}
        {competencias[selectedSubjectValue]} no dia:
      </Text>

      {selectedDate && (
        <Text style={{ fontSize: 18, marginBottom: 16 }}>
          Data selecionada: {selectedDate}
        </Text>
      )}

      <Calendar onDayPress={handleDateSelect} />

      <TouchableOpacity
        style={{
          marginTop: 20,
          width: 150,
          height: 60,
          backgroundColor: "#EA86BF",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: 10,
        }}
        onPress={handleSave}
      >
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            color: "#822E5E",
          }}
        >
          Estudar
        </Text>
      </TouchableOpacity>
      {/* Modal para mostrar o lembrete */}
      <Modal
        visible={showMessage}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowMessage(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, marginBottom: 16 }}>
              Lembrete: Você deverá estudar {reminderInfo?.selectedHourValue}{" "}
              horas de {reminderInfo?.selectedSubjectValue} no dia{" "}
              {reminderInfo?.selectedDate}.
            </Text>
            <TouchableOpacity
              style={{
                marginTop: 20,
                width: 150,
                height: 60,
                backgroundColor: "#EA86BF",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 10,
              }}
              onPress={() => setShowMessage(false)}
            >
              <Text
                style={{ fontSize: 18, fontWeight: "bold", color: "#822E5E" }}
              >
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
});
