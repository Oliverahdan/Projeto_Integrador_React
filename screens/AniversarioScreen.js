import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  TouchableWithoutFeedback,
} from "react-native";
import { Grid, Row, Col } from "react-native-easy-grid";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from 'expo-notifications';

const STORAGE_KEY = "aniversarios";

export default function AniversarioScreen() {
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [intervaloNotificacao, setIntervaloNotificacao] = useState("");
  const [aniversarios, setAniversarios] = useState([]);
  const [erroInsercao, setErroInsercao] = useState("");

  useEffect(() => {
    loadAniversarios();
    registerForPushNotificationsAsync();
  }, []);

  const loadAniversarios = async () => {
    try {
      const storedAniversarios = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedAniversarios) {
        setAniversarios(JSON.parse(storedAniversarios));
      }
    } catch (error) {
      console.error("Erro ao carregar aniversários do AsyncStorage:", error);
    }
  };

  const saveAniversario = async () => {
    try {
      const novoAniversario = { nome, dataNascimento, intervaloNotificacao };
      const novosAniversarios = [...aniversarios, novoAniversario];

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(novosAniversarios)
      );
      setAniversarios(novosAniversarios);
      setErroInsercao("");

      sendPushNotification(`Lembrete: ${nome}'s aniversário está chegando!`);
    } catch (error) {
      console.error("Erro ao salvar aniversário no AsyncStorage:", error);
      setErroInsercao(
        "Erro ao adicionar o aniversário. Por favor, tente novamente."
      );
    }
  };

  const registerForPushNotificationsAsync = async () => {
    try {
      const { status } = await Notifications.getPermissionsAsync();
      console.log('Status de permissões:', status);

      if (status !== 'granted') {
        const { status: askStatus } = await Notifications.requestPermissionsAsync();
        console.log('Status de permissões após a solicitação:', askStatus);

        if (askStatus !== 'granted') {
          console.log('Permissão de notificação não concedida');
          return;
        }
      }

      const deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
      console.log('Device Token:', deviceToken);
    } catch (error) {
      console.error('Erro ao obter o token do dispositivo:', error);
    }
  };

  const sendPushNotification = async (message) => {
    await Notifications.presentNotificationAsync({
      title: "Novo Aniversário Adicionado!",
      body: message,
    });
  };

  const handleDateChange = (text) => {
    let formattedText = text;

    if (formattedText.length === 2 && !formattedText.includes("/")) {
      formattedText += "/";
    }

    if (formattedText.length === 5 && formattedText.charAt(4) !== "/") {
      formattedText += "/";
    }

    if (formattedText.length > 10) {
      formattedText = formattedText.slice(0, 10);
    }

    setDataNascimento(formattedText);
  };

  const handleDateSelect = (date) => {
    setCalendarVisible(false);

    const selectedDate = new Date(date.dateString);
    const day = selectedDate.getDate().toString().padStart(2, "0");
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, "0");
    const year = selectedDate.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    setDataNascimento(formattedDate);
  };

  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  const handleIntervaloNotificacaoChange = (value) => {
    setIntervaloNotificacao(value);
  };

  const handleAdicionar = () => {
    if (!nome.trim() || !dataNascimento.trim()) {
      // Verifica se os campos não estão vazios
      setErroInsercao("Preencha todos os campos antes de adicionar.");
      return;
    }
  
    saveAniversario();

    setNome("");
    setDataNascimento("");
    setIntervaloNotificacao("");
  };

  const closeCalendar = () => {
    setCalendarVisible(false);
  };

  return (
    <TouchableWithoutFeedback onPress={closeCalendar}>
      <Grid style={styles.container}>
        <Col style={{ flex: 1 }}>
          <Row style={[styles.titulo, { justifyContent: "center", alignItems: "center", flexDirection: "column" }]}>
            <Text style={styles.titulotext}>Marque um Aniversário</Text>
            <Text style={styles.subtitulotext}>Veja os seus aniversários no icone de menu acima.</Text>
          </Row>

          <Row style={[styles.rowContainer, { alignItems: 'center' }]}>
            <View style={styles.nameContainer}>
              <TextInput style={styles.input}
                placeholder="Digite o nome do aniversariante"
                onChangeText={(text) => setNome(text)}
                value={nome}
              />
            </View>
          </Row>

          <Row style={styles.rowContainer}>
          <View style={styles.nasciContainer}>
              <TouchableOpacity onPress={toggleCalendar} style={styles.calendarIconContainer}>
                <Image
                  source={require("../assets/calendario.png")}
                  style={styles.calendarIcon}
                />
              </TouchableOpacity>
              <View style={styles.dataContainer}>
                <TextInput
                  style={styles.dateInput}
                  placeholder="Digite a data"
                  value={dataNascimento}
                  onChangeText={(text) => handleDateChange(text)}
                  keyboardType="numeric"
                />
              </View>
              {isCalendarVisible && (
                <View style={styles.calendarContainer}>
                  <Calendar
                    onDayPress={handleDateSelect}
                    markedDates={{
                      [dataNascimento]: {
                        selected: true,
                        marked: true,
                        selectedColor: "#EA86BF",
                      },
                    }}
                    theme={{
                      calendarBackground: "white",
                      textSectionTitleColor: "black",
                      selectedDayBackgroundColor: "blue",
                      selectedDayTextColor: "white",
                      todayTextColor: "blue",
                    }}
                  />
                </View>
              )}
            </View>
          </Row>

          <Row style={styles.rowContainer}>
            <View style={styles.notiContainer}>
              <Picker
                style={styles.picker}
                selectedValue={intervaloNotificacao}
                onValueChange={handleIntervaloNotificacaoChange}
              >
                <Picker.Item label="Mês em Mês" value="mes" />
                <Picker.Item label="Ano em Ano" value="ano" />
              </Picker>
            </View>
          </Row>

          <Row style={styles.rowContainer}>
            <TouchableOpacity onPress={handleAdicionar}>
          <View style={styles.botaoAdicionar}>
            <Text style={styles.textoBotaoAdicionar}>Adicionar</Text>
          </View>
        </TouchableOpacity>
          </Row>

        </Col>
      </Grid>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  titulotext:{
    fontSize: 25,
  },
  titulo: {
    textAlign: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  nameContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  rowContainer: {
    justifyContent: 'center',
    flex: 1,
  },
  input: {
    height: 60,
    borderWidth: 2,
    borderRadius: 5,
    paddingHorizontal: 10,
    borderColor: '#CDD0D4',
    width: 220,
  },
  calendarIcon: {
    width: 40,
    height: 40,
    marginTop: -40,
  },
  calendarIconContainer: {
    position: 'absolute',
    right: 10,
    zIndex: 2, // Um valor maior do que o do dataContainer
  },
  nasciContainer: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#CDD0D4',
    borderRadius: 5,
    overflow: 'hidden',
    padding: 10,
    width: 220,
    height: 60,
    position: 'relative',
    marginTop: -40,
    zIndex: 1, // Adiciona um índice de sobreposição
  },
  calendarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    marginTop: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#CDD0D4',
    padding: 10,
    zIndex: 3, // Adiciona um índice de sobreposição
  },
  interContainer: {
    alignItems: "center",
  },
  notiContainer: {
    borderWidth: 2,
    borderRadius: 5,
    width: 220,
    height: 60,
    justifyContent: 'center',
    borderColor: '#CDD0D4', // Adicionado para centralizar o conteúdo na vertical
  },
  adicionar: {
    marginTop: 20,
    width: 200,
  },
  dateInput: {
    flex: 1,
    marginLeft: 10,
  },
  botaoAdicionar: {
    backgroundColor: '#EA86BF',
    borderRadius: 20,
    alignItems: 'center',
    height: 70,
    justifyContent: 'center',
    width: 200,
    marginTop: -30,
  },
  textoBotaoAdicionar: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#822E5E',
  },
});
