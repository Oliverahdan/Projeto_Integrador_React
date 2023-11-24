import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { Grid, Row } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';

export default function AlarmeScreen({ navigation }) {
  const [showMiniDisplay, setShowMiniDisplay] = useState(false);
  const [selectedAlarme, setSelectedAlarme] = useState(null);
  const [showAddAlarmeModal, setShowAddAlarmeModal] = useState(false);
  const [novoAlarme, setNovoAlarme] = useState({
    horario: '',
    descricao: '',
    titulo: '',
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
  const [selectedDate, setSelectedDate] = useState(null);
  const [alarmesData, setAlarmesData] = useState([]);
  const [chooseDaysOfWeek, setChooseDaysOfWeek] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const dadosArmazenados = await AsyncStorage.getItem('alarmesData');
        if (dadosArmazenados) {
          setAlarmesData(JSON.parse(dadosArmazenados));
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };

    carregarDados();
  }, []);

  useEffect(() => {
    const salvarDados = async () => {
      try {
        await AsyncStorage.setItem('alarmesData', JSON.stringify(alarmesData));
      } catch (error) {
        console.error('Erro ao salvar dados:', error);
      }
    };

    salvarDados();
  }, [alarmesData]);

  const CustomButton = ({ onPress, title, marginBottom, selected }) => (
    <TouchableOpacity
      style={[styles.dayButton, { marginBottom, backgroundColor: selected ? '#EA86BF' : '#F5F5F5' }]}
      onPress={onPress}
    >
      <Text style={[styles.dayButtonText, { color: selected ? '#FFF' : '#000' }]}>{title}</Text>
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
      horario: '',
      descricao: '',
      titulo: '',
      selectedDays: { ...novoAlarme.selectedDays },
    });
    setSelectedDate(null);
  };

  const toggleDay = (day) => {
    if (chooseDaysOfWeek) {
      setNovoAlarme((prevAlarme) => ({
        ...prevAlarme,
        selectedDays: {
          ...prevAlarme.selectedDays,
          [day]: !prevAlarme.selectedDays[day],
        },
      }));
    } else {
      setSelectedDate((prevSelectedDate) => ({
        ...prevSelectedDate,
        dateString: '',
      }));
    }
  };

  const adicionarAlarme = () => {
    const horarioParts = novoAlarme.horario.split(':');

    if (
      horarioParts.length !== 2 ||
      isNaN(horarioParts[0]) ||
      isNaN(horarioParts[1]) ||
      parseInt(horarioParts[0]) < 0 ||
      parseInt(horarioParts[0]) > 23 ||
      parseInt(horarioParts[1]) < 0 ||
      parseInt(horarioParts[1]) > 59
    ) {
      alert('Por favor, insira um horário válido no formato HH:mm');
      return;
    }

    if (chooseDaysOfWeek && !selectedDate) {
      alert('Por favor, selecione um dia para o alarme único.');
      return;
    }

    const novoId = String(alarmesData.length + 1);
    const novoAlarmeData = {
      id: novoId,
      horario: novoAlarme.horario,
      descricao: novoAlarme.descricao,
      titulo: novoAlarme.titulo,
      selectedDays: { ...novoAlarme.selectedDays },
      selectedDate: selectedDate ? selectedDate.dateString : '',
      repeatWeekly: chooseDaysOfWeek,
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

      {showMiniDisplay && selectedAlarme && (
        <View style={styles.miniDisplay}>
          <Text style={styles.miniDisplayText}>
            Horário: {selectedAlarme.horario}
          </Text>
          <Text style={styles.miniDisplayText}>
            Título: {selectedAlarme.titulo}
          </Text>
          <Text style={styles.miniDisplayText}>
            Descrição: {selectedAlarme.descricao}
          </Text>
          <TouchableOpacity onPress={closeMiniDisplay}>
            <Text style={styles.fecharMiniDisplay}>Fechar</Text>
          </TouchableOpacity>
        </View>
      )}

      <Row style={styles.botoes} size={1}>
        <TouchableWithoutFeedback onPress={openAddAlarmeModal}>
          <View style={styles.botaoAdicionar}>
            <Text style={styles.textoBotaoAdicionar}>Adicionar Alarme</Text>
          </View>
        </TouchableWithoutFeedback>
      </Row>

      <Modal
        visible={showAddAlarmeModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Adicionar Novo Alarme</Text>
              <TextInput
                style={styles.input}
                placeholder="Horário"
                value={novoAlarme.horario}
                onChangeText={(text) =>
                  setNovoAlarme({ ...novoAlarme, horario: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Título"
                value={novoAlarme.titulo}
                onChangeText={(text) =>
                  setNovoAlarme({ ...novoAlarme, titulo: text })
                }
              />
              <TextInput
                style={styles.input}
                placeholder="Descrição"
                value={novoAlarme.descricao}
                onChangeText={(text) =>
                  setNovoAlarme({ ...novoAlarme, descricao: text })
                }
              />
              {chooseDaysOfWeek ? (
                <View style={styles.daysContainer}>
                  <Text style={styles.label}>Dias da Semana:</Text>
                  <View style={styles.buttonsContainer}>
                    {Object.keys(novoAlarme.selectedDays).map((day) => (
                      <CustomButton
                        key={day}
                        title={day.substring(0, 1)}
                        onPress={() => toggleDay(day)}
                        selected={novoAlarme.selectedDays[day]}
                      />
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.chooseDateContainer}>
                  <Text style={styles.label}>Escolher Data:</Text>
                  <Calendar
                    onDayPress={(day) => setSelectedDate(day)}
                    markedDates={selectedDate ? { [selectedDate.dateString]: { selected: true, selectedColor: '#EA86BF' } } : {}}
                    style={styles.calendarContainer}
                  />
                </View>
              )}
              <TouchableOpacity onPress={() => setChooseDaysOfWeek((prev) => !prev)}>
                <Text style={styles.toggleButtonText}>
                  Escolher {chooseDaysOfWeek ? 'Data' : 'Dias da Semana'}
                </Text>
              </TouchableOpacity>
              <CustomButton
                onPress={adicionarAlarme}
                title="Adicionar"
                marginBottom={10}
              />
              <CustomButton
                onPress={closeAddAlarmeModal}
                title="Cancelar"
                marginBottom={0}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
    </Grid>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EBEE',
    justifyContent: 'center',
    alignContent: 'center',
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9ED',
    padding: 20,
  },
  itemHorario: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#822E5E',
  },
  botaoAdicionar: {
    backgroundColor: '#EA86BF',
    borderRadius: 20,
    padding: 15,
    margin: 10,
    alignItems: 'center',
    marginLeft: '27.5%',
    height: 70,
    justifyContent: 'center',
    marginTop: 30,
  },
  textoBotaoAdicionar: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#822E5E',
  },
  miniDisplay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(180, 180, 180, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  miniDisplayText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  fecharMiniDisplay: {
    marginTop: 30,
    color: '#822E5E',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#E8EBEE',
    padding: 20,
    borderRadius: 10,
    borderWidth: 3, // Adicione esta linha
    borderColor: '#ccc', // Adicione esta linha
    elevation: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#822E5E',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  itemTitulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E3944',
  },
  dayButton: {
    backgroundColor: '#EA86BF',
    borderRadius: 20,
    padding: 10,
    margin: 5,
    alignItems: 'center',
  },
  dayButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 5,
    marginBottom: 10,
    color: '#2E3944',
  },
  buttonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  selectedButton: {
    backgroundColor: '#E8EBEE',
    color: 'white',
  },
  excluirButton: {
    backgroundColor: '#EA86BF',
    borderRadius: 10,
    padding: 10,
  },
  excluirButtonText: {
    color: '#822E5E',
  },
  calendarContainer: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#EA86BF',
    borderRadius: 10,
    overflow: 'hidden',
  },
  chooseDateContainer: {
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  toggleButtonText: {
    color: '#c7aa61',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 10,
  },
});
