import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  Platform, // Adicionado para lidar com as plataformas
} from "react-native";
import { Grid, Row } from "react-native-easy-grid";
import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker"; // Alterado para usar o DateTimePicker

export default function EstudoScreenLembrate({ route, navigation }) {
  const { selectedHourValue, selectedSubjectValue } = route.params;

  const [showMiniDisplay, setShowMiniDisplay] = useState(false);
  const [selectedAlarme, setSelectedAlarme] = useState(null);
  const [showAddAlarmeModal, setShowAddAlarmeModal] = useState(false);
  const [novoAlarme, setNovoAlarme] = useState({
    horario: "",
    competencia: Number(selectedSubjectValue) + 1,
    quantidadeHoras: selectedHourValue,
    selectedDays: {
      Sunday: false,
      Monday: false,
      Tuesday: false,
      Wednesday: false,
      Thursday: false,
      Friday: false,
      Saturday: false,
    },
  });
  const [alarmesData, setAlarmesData] = useState([]);
  const [chosenDate, setChosenDate] = useState(new Date());

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosArmazenados = await AsyncStorage.getItem("alarmesData");
        if (dadosArmazenados) {
          setAlarmesData(JSON.parse(dadosArmazenados));
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    const salvarDados = async () => {
      try {
        await AsyncStorage.setItem("alarmesData", JSON.stringify(alarmesData));
      } catch (error) {
        console.error("Erro ao salvar dados:", error);
      }
    };

    salvarDados();
  }, [alarmesData]);

  const CustomButton = ({ onPress, title, marginBottom, selected }) => (
    <TouchableOpacity
      style={[
        styles.dayButton,
        { marginBottom, backgroundColor: selected ? "#EA86BF" : "#F5F5F5" },
      ]}
      onPress={onPress}
    >
      <Text
        style={[styles.dayButtonText, { color: selected ? "#FFF" : "#000" }]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  const renderAlarmeItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <TouchableOpacity
        style={styles.alarmeItem}
        onPress={() => handleAlarmePress(item)}
      >
        <Text style={styles.itemHorario}>{item.horario}</Text>
        <Text style={styles.itemTitulo}>{item.titulo}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.excluirButton}
        onPress={() => excluirAlarme(item.id)}
      >
        <Text style={styles.excluirButtonText}>Excluir</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAlarmePress = (alarme) => {
    setSelectedAlarme(alarme);
    setShowMiniDisplay(true);
  };

  const closeMiniDisplay = () => {
    setShowMiniDisplay(false);
    setSelectedAlarme(null);
  };

  const openAddAlarmeModal = () => {
    setShowAddAlarmeModal(true);
  };

  const closeAddAlarmeModal = () => {
    setShowAddAlarmeModal(false);
    setNovoAlarme({
      horario: "",
      competencia: parseInt(selectedSubjectValue) + 1,
      quantidadeHoras: selectedHourValue,
      selectedDays: { ...novoAlarme.selectedDays },
    });
  };

  const toggleDay = (day) => {
    setNovoAlarme((prevAlarme) => ({
      ...prevAlarme,
      selectedDays: {
        ...prevAlarme.selectedDays,
        [day]: !prevAlarme.selectedDays[day],
      },
    }));
  };

  const adicionarAlarme = () => {
    const horarioParts = novoAlarme.horario.split(":");

    if (
      horarioParts.length !== 2 ||
      isNaN(horarioParts[0]) ||
      isNaN(horarioParts[1]) ||
      parseInt(horarioParts[0]) < 0 ||
      parseInt(horarioParts[0]) > 23 ||
      parseInt(horarioParts[1]) < 0 ||
      parseInt(horarioParts[1]) > 59
    ) {
      alert("Por favor, insira um horário válido no formato HH:mm");
      return;
    }

    const now = new Date();
    const selectedTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      parseInt(horarioParts[0]),
      parseInt(horarioParts[1])
    );

    const novoId = String(alarmesData.length + 1);
    const novoAlarmeData = {
      id: novoId,
      horario: novoAlarme.horario,
      competencia: novoAlarme.competencia,
      quantidadeHoras: novoAlarme.quantidadeHoras,
      selectedDays: { ...novoAlarme.selectedDays },
    };

    setAlarmesData([...alarmesData, novoAlarmeData]);

    closeAddAlarmeModal();
  };

  const excluirAlarme = (alarmeId) => {
    const novosAlarmes = alarmesData.filter((alarme) => alarme.id !== alarmeId);
    setAlarmesData(novosAlarmes);
  };

  return (
    <Grid style={styles.container}>
      <Row style={styles.botoes} size={3}>
        <FlatList
          data={alarmesData}
          keyExtractor={(item) => item.id}
          renderItem={renderAlarmeItem}
        />
      </Row>

      <Row style={styles.botoes} size={1}>
        {Platform.OS === "ios" ? (
          <DateTimePicker
            style={{ width: 200, marginTop: 20 }}
            value={chosenDate}
            mode="time"
            is24Hour={true}
            display="spinner"
            onChange={(event, date) => {
              if (event.type === "set") {
                setChosenDate(date);
              }
            }}
          />
        ) : (
          <DatePicker
            style={{ width: 200, marginTop: 20 }}
            date={novoAlarme.horario}
            placeholder="Selecione o horário"
            format="HH:mm"
            confirmBtnText="Confirmar"
            cancelBtnText="Cancelar"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
            onDateChange={(date) => {
              setNovoAlarme((prevAlarme) => ({ ...prevAlarme, horario: date }));
            }}
            maximumDate={new Date(2023, 11, 31)} // Exemplo de data máxima
            minimumDate={new Date()} // Exemplo de data mínima (hoje)
            minuteInterval={10} // Exemplo de intervalo de minutos
            locale="pt-BR" // Substitua pelo código de idioma desejado
            timeZoneOffsetInMinutes={-7 * 60} // Exemplo de offset de fuso horário (Pacific Standard Time)
            initialDate={new Date()} // Exemplo de data inicial
          />
        )}
      </Row>

      {showMiniDisplay && selectedAlarme && (
        <View style={styles.miniDisplay}>
          <Text style={styles.miniDisplayText}>
            Horário: {selectedAlarme.horario}
          </Text>
          <Text style={styles.miniDisplayText}>
            Competência: {selectedAlarme.competencia}
          </Text>
          <Text style={styles.miniDisplayText}>
            Quantidade de Horas: {selectedAlarme.quantidadeHoras}
          </Text>
          <TouchableOpacity onPress={closeMiniDisplay}>
            <Text style={styles.fecharMiniDisplay}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}
    </Grid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8EBEE",
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: "#E6E9ED",
    padding: 20,
  },
  itemHorario: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#822E5E",
  },
  botaoAdicionar: {
    backgroundColor: "#EA86BF",
    borderRadius: 20,
    padding: 15,
    margin: 10,
    alignItems: "center",
    marginLeft: "0%",
    height: 70,
    justifyContent: "center",
    marginTop: 30,
    width: "45%",
  },
  textoBotaoAdicionar: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#822E5E",
  },
  miniDisplay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(180, 180, 180, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  miniDisplayText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  fecharMiniDisplay: {
    marginTop: 30,
    color: "#822E5E",
    fontSize: 20,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#E8EBEE",
    padding: 20,
    borderRadius: 10,
    elevation: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#822E5E",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2E3944",
  },
  dayButton: {
    backgroundColor: "#EA86BF",
    borderRadius: 20,
    padding: 10,
    margin: 5,
    alignItems: "center",
  },
  dayButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
    color: "#2E3944",
  },
  buttonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  selectedButton: {
    backgroundColor: "#E8EBEE",
    color: "white",
  },
  excluirButton: {
    backgroundColor: "#EA86BF",
    borderRadius: 10,
    padding: 10,
  },
  excluirButtonText: {
    color: "#822E5E",
  },
});
