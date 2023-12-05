import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Button, FlatList } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { Picker } from "@react-native-picker/picker";
import { Calendar } from 'react-native-calendars';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PushNotification from 'react-native-push-notification';

const STORAGE_KEY = 'aniversarios';

export default function AniversarioScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [intervaloNotificacao, setIntervaloNotificacao] = useState('');
  const [aniversarios, setAniversarios] = useState([]);
  const [erroInsercao, setErroInsercao] = useState('');

  useEffect(() => {
    loadAniversarios();
  }, []);

  const loadAniversarios = async () => {
    try {
      const storedAniversarios = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedAniversarios) {
        setAniversarios(JSON.parse(storedAniversarios));
      }
    } catch (error) {
      console.error('Erro ao carregar aniversários do AsyncStorage:', error);
    }
  };

  const saveAniversario = async () => {
    try {
      const novoAniversario = { nome, dataNascimento, intervaloNotificacao };
      const novosAniversarios = [...aniversarios, novoAniversario];

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosAniversarios));
      setAniversarios(novosAniversarios);
      setErroInsercao('');

      // Criar canal de notificação (deve ser chamado apenas uma vez)
      PushNotification.createChannel({
        channelId: 'default-channel-id',
        channelName: 'Default Channel',
        channelDescription: 'A default channel for my app',
      });

      // Enviar notificação
      PushNotification.localNotification({
        channelId: 'default-channel-id', // O ID do canal de notificação (deve ser criado)
        title: 'Novo Aniversário Adicionado!',
        message: `Lembrete: ${nome}'s aniversário está chegando!`,
      });
    } catch (error) {
      console.error('Erro ao salvar aniversário no AsyncStorage:', error);
      setErroInsercao('Erro ao adicionar o aniversário. Por favor, tente novamente.');
    }
  };

  const handleExcluir = (index) => {
    const novosAniversarios = [...aniversarios];
    novosAniversarios.splice(index, 1);

    // Salva a lista atualizada no AsyncStorage
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosAniversarios))
      .then(() => {
        setAniversarios(novosAniversarios);
      })
      .catch((error) => {
        console.error('Erro ao excluir aniversário do AsyncStorage:', error);
      });
  };

  const handleDateChange = (text) => {
    let formattedText = text;

    // Adiciona uma barra após os dois primeiros caracteres (dia)
    if (formattedText.length === 2 && !formattedText.includes('/')) {
      formattedText += '/';
    }

    // Adiciona uma barra após mais dois caracteres (mês)
    if (formattedText.length === 5 && formattedText.charAt(4) !== '/') {
      formattedText += '/';
    }

    // Limita a entrada a 10 caracteres (DD/MM/YYYY)
    if (formattedText.length > 10) {
      formattedText = formattedText.slice(0, 10);
    }

    // Atualiza o estado da data de nascimento
    setDataNascimento(formattedText);
  };

  const handleDateSelect = (date) => {
    setCalendarVisible(false);

    const selectedDate = new Date(date.dateString);
    const day = selectedDate.getDate().toString().padStart(2, '0');
    const month = (selectedDate.getMonth() + 1).toString().padStart(2, '0');
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
    // Salva o aniversário no banco de dados
    saveAniversario();

    setNome('');
    setDataNascimento('');
    setIntervaloNotificacao('');
  };

  return (
    <Grid style={styles.container}>
      <Col>
        <Row>
          <Col style={styles.col}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Nome:</Text>
              <TextInput
                style={styles.input}
                placeholder="Digite o nome do aniversariante"
                onChangeText={text => setNome(text)}
                value={nome}
              />
            </View>

            <View style={styles.nasciContainer}>
              <Text style={styles.label}>Data de Nascimento/Inicio:</Text>
              <View style={styles.dataContainer}>
                <TouchableOpacity onPress={toggleCalendar}>
                  <Image source={require('../assets/calendario.png')} style={styles.calendarIcon} />
                </TouchableOpacity>
                <TextInput
                  style={styles.dateInput}
                  placeholder="DD/MM/YYYY"
                  value={dataNascimento}
                  onChangeText={text => handleDateChange(text)}
                />
                {isCalendarVisible && (
                  <View style={styles.calendarContainer}>
                    <Calendar
                      onDayPress={handleDateSelect}
                      markedDates={{
                        [dataNascimento]: {
                          selected: true,
                          marked: true,
                          selectedColor: '#EA86BF',
                        },
                      }}
                      theme={{
                        calendarBackground: 'white',
                        textSectionTitleColor: 'black',
                        selectedDayBackgroundColor: 'blue',
                        selectedDayTextColor: 'white',
                        todayTextColor: 'blue',
                      }}
                    />
                  </View>
                )}
              </View>
            </View>

            <View style={styles.nasciContainer}>
              <Text style={styles.label}>Intervalo de Notificação:</Text>
              <View style={styles.notiContainer}>
                <Picker
                  style={styles.picker}
                  selectedValue={intervaloNotificacao}
                  onValueChange={handleIntervaloNotificacaoChange}>
                  <Picker.Item label="Mês em Mês" value="mes" />
                  <Picker.Item label="Ano em Ano" value="ano" />
                </Picker>
              </View>
            </View>

            <View style={styles.adicionar}>
              <Button title="Adicionar" onPress={handleAdicionar} />
            </View>

            {/* Exibir os aniversários abaixo do botão Adicionar */}
            <View style={styles.aniversarioListContainer}>
              <Text style={styles.aniversarioListTitle}>Aniversários Marcados</Text>
              <FlatList
                data={aniversarios}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item, index }) => (
                  <View style={styles.aniversarioItem}>
                    <Text style={styles.nome}>{`Nome: ${item.nome}`}</Text>
                    <Text>{`Data de Nascimento: ${item.dataNascimento}`}</Text>
                    <Text>{`Intervalo de Notificação: ${item.intervaloNotificacao}`}</Text>

                    {/* Botão para excluir o aniversário */}
                    <TouchableOpacity
                      style={styles.excluirButton}
                      onPress={() => handleExcluir(index)}
                    >
                      <Text style={styles.buttonText}>Excluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              />
            </View>
          </Col>
        </Row>
      </Col>
    </Grid>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  col: {
    margin: 10,
  },
  inputContainer: {
    marginTop: 20,
    width: '100%',
  },
  label: {
    marginBottom: 5,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  calendarIcon: {
    width: 24,
    height: 24,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 20,
    width: '100%',
  },
  nasciContainer: {
    marginTop: 20,
    width: '100%',
  },
  dataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    overflow: 'hidden',
    padding: 10,
  },
  calendarContainer: {
    padding: 10,
  },
  notiContainer: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 5,
    overflow: 'hidden',
  },
  adicionar: {
    marginTop: 20,
    width: '100%',
  },
  dateInput: {
    flex: 1,
    marginLeft: 10,
  },
  selectedDate: {
    marginTop: 10,
  },
  aniversarioListContainer: {
    marginTop: 20,
    width: '100%',
  },
  aniversarioListTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aniversarioItem: {
    marginTop: 10,
  },
  excluirButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  editarButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
});
