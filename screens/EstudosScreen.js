// EstudosScreen.js
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const competencias = [
  "Linguagens",
  "Matemática",
  "Ciências Humanas",
  "Ciências da Natureza ",
];

export default function EstudosScreen() {
  const navigation = useNavigation();

  const [selectedHourValue, setSelectedHourValue] = useState("1");
  const [selectedSubjectValue, setSelectedSubjectValue] = useState("0");

  const handleHourPickerChange = (itemValue) => {
    setSelectedHourValue(itemValue);
  };

  const handleSubjectPickerChange = (itemValue) => {
    setSelectedSubjectValue(itemValue);
  };

  const handleContinue = () => {
    navigation.navigate("EstudoScreenLembrate", {
      selectedHourValue,
      selectedSubjectValue: competencias[selectedSubjectValue],
    });
  };

  return (
    <View style={styles.container}>
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
              color="black"
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
          {competencias.map((competencia, index) => (
            <Picker.Item
              key={index}
              label={competencia}
              value={index.toString()}
              color="black"
            />
          ))}
        </Picker>
      </View>

      <TouchableOpacity
        style={styles.continueButton}
        onPress={handleContinue}
      >
        <Text style={{ color: 'black', textAlign: "center" }}>Continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EBEE',
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
  pickerBackground2: {
    backgroundColor: '#EA86BF',
  },
  pickerBackground3: {
    backgroundColor: '#EA86BF',
  },
  continueButton: {
    marginTop: 20,
    width: 150,
    height: 60,
    backgroundColor: '#EA86BF',
    justifyContent: "center",
    alignItems: "center",
    color: 'black',
  },
});