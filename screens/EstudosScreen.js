// EstudosScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
export default function EstudosScreen() {
  const navigation = useNavigation();

  const [selectedDayValue, setSelectedDayValue] = useState("0");
  const [selectedHourValue, setSelectedHourValue] = useState("1");
  const [selectedSubjectValue, setSelectedSubjectValue] = useState("0");

  const handleDayPickerChange = (itemValue) => {
    setSelectedDayValue(itemValue);
  };

  const handleHourPickerChange = (itemValue) => {
    setSelectedHourValue(itemValue);
  };

  const handleSubjectPickerChange = (itemValue) => {
    setSelectedSubjectValue(itemValue);
  };

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.title}>Quantos dias você irá estudar</Text>
        <Picker
          style={[styles.picker, styles.pickerBackground1]}
          selectedValue={selectedDayValue}
          onValueChange={handleDayPickerChange}
        >
          {[1, 2, 3, 4, 5, 6].map((day, index) => (
            <Picker.Item
              key={index}
              label={day.toString()}
              value={index.toString()}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.column}>
        <Text style={styles.title}>Quantas horas por dia você irá estudar</Text>
        <Picker
          style={[styles.picker, styles.pickerBackground2]}
          selectedValue={selectedHourValue}
          onValueChange={handleHourPickerChange}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8].map((hour, index) => (
            <Picker.Item
              key={index}
              label={hour.toString()}
              value={hour.toString()}
            />
          ))}
        </Picker>
      </View>

      <View style={styles.column}>
        <Text style={styles.title}>Escolha uma matéria para estudar</Text>
        <Picker
          style={[styles.picker, styles.pickerBackground3]}
          selectedValue={selectedSubjectValue}
          onValueChange={handleSubjectPickerChange}
        >
          <Picker.Item
            label="Linguagens, Códigos e suas Tecnologias:"
            value="0"
          />
          <Picker.Item label="Matemática e suas Tecnologias:" value="1" />
          <Picker.Item label="Ciências Humanas e suas Tecnologias:" value="2" />
          <Picker.Item
            label="Ciências da Natureza e suas Tecnologias:"
            value="3"
          />
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={() => navigation.navigate("EstudoScreenLembrate")}
      >
        <Text style={{ color: "#fff", textAlign: "center" }}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ea86bf",
    justifyContent: "center",
    alignItems: "center",
  },
  column: {
    marginBottom: 16,
    alignItems: "center",
  },
  picker: {
    width: 200,
    height: 70,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  pickerBackground1: {
    backgroundColor: "#f9d477",
  },
  pickerBackground2: {
    backgroundColor: "#f9d477",
  },
  pickerBackground3: {
    backgroundColor: "#f9d477",
  },
  continueButton: {
    marginTop: 20,
    width: 150,
    height: 60,
    backgroundColor: "#822e5e",
    justifyContent: "center",
    alignItems: "center",
  },
});
