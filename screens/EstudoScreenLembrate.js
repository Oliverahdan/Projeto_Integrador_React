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

  const formatarDataBrasileira = (data) => {
    const partesData = data.split("-");
    return `${partesData[2]}/${partesData[1]}/${partesData[0]}`;
  };

  const handleDateSelect = (date) => {
    setSelectedDate(formatarDataBrasileira(date.dateString));
  };

  const handleSave = async () => {
    try {
      const existingData = (await AsyncStorage.getItem("estudos")) || "[]";
      const existingDataArray = JSON.parse(existingData);

      existingDataArray.push({
        selectedHourValue,
        selectedSubjectValue: competencias[selectedSubjectValue],
        selectedDate: formatarDataBrasileira(selectedDate),
      });

      await AsyncStorage.setItem("estudos", JSON.stringify(existingDataArray));


      console.log("Informações salvas com sucesso!");

      setReminderInfo({
        selectedHourValue,
        selectedSubjectValue: competencias[selectedSubjectValue],
        selectedDate,
      });

      setShowMessage(true);

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
      <Text style={{ fontSize: 24, marginBottom: 16 }}>
        Marque o dia no calendário
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
  disabled={!selectedDate} // Desabilita o botão se não houver uma data selecionada
>
  <Text
    style={{
      fontSize: 18,
      fontWeight: "bold",
      color: selectedDate ? "black" : "#888", // Altera a cor do texto conforme o estado do botão
    }}
  >
    Marcar
  </Text>
</TouchableOpacity>
      {}
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
