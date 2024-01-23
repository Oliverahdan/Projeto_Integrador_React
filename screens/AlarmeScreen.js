import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  ScrollView,
} from 'react-native';
import { Grid, Row } from 'react-native-easy-grid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import moment from 'moment-timezone';
import * as Notifications from 'expo-notifications';
import Icon from "react-native-vector-icons/MaterialIcons";

const CustomButton = ({ onPress, title, marginBottom, selected }) => (
  <TouchableOpacity
    style={[
      styles.dayButton,
      { elevation: 4, marginBottom, backgroundColor: selected ? '#EA86BF' : '#F5F5F5' },
    ]}
    onPress={onPress}
  >
    <Text style={[styles.dayButtonText, { color: selected ? '#FFF' : '#000' }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

export default function AlarmeScreen({ navigation }) {
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAlarmDetails, setSelectedAlarmDetails] = useState(null);

  const [showAddAlarmeModal, setShowAddAlarmeModal] = useState(false);
  const [novoAlarme, setNovoAlarme] = useState({
    horario: '',
    descricao: '',
    titulo: '',
    selectedDays: {
      'Domingo': false,
      'Segunda-feira': false,
      'Terça-feira': false,
      'Quarta-feira': false,
      'Quinta-feira': false,
      'Sexta-feira': false,
      'Sábado': false,
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
  const validarDiasSemana = (novoAlarmeData) => {
    const mesmoHorarioDiasSemana = alarmesData.find((alarme) => {
      const diasIguais = Object.keys(alarme.selectedDays).some(
        (day) => alarme.selectedDays[day] && novoAlarmeData.selectedDays[day]
      );
  
      return (
        alarme.horario === novoAlarmeData.horario &&
        alarme.repeatWeekly &&
        diasIguais
      );
    });
  
    if (mesmoHorarioDiasSemana) {
      Alert.alert(
        'Erro',
        'Já existe um alarme com o mesmo horário e pelo menos um dia da semana idêntico.'
      );
      return false;
    }
  
    return true;
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

    if (chooseDaysOfWeek && !Object.values(novoAlarme.selectedDays).some((day) => day)) {
      alert('Por favor, selecione pelo menos um dia para o alarme semanal.');
      return;
    }

    if (!chooseDaysOfWeek && !selectedDate) {
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

    if (chooseDaysOfWeek && !validarDiasSemana(novoAlarmeData)) {
      return;
    }
  
    setAlarmesData([...alarmesData, novoAlarmeData]);
    scheduleLocalNotification(novoAlarmeData); // Add this line to schedule the notification
  
    closeAddAlarmeModal();
  };

  const excluirAlarme = (alarmeId) => {
    const novosAlarmes = alarmesData.filter((alarme) => alarme.id !== alarmeId);
    setAlarmesData(novosAlarmes);
  };

  const renderAlarmeItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.alarmeItemContainer}>
        <TouchableOpacity
          style={styles.alarmeItem}
          onPress={() => handleAlarmePress(item)}
        >
          <Text style={styles.itemHorario}>{item.horario}</Text>
          <Text style={styles.itemTitulo} numberOfLines={1}>
            {item.titulo.length > 15
              ? `${item.titulo.substring(0, 15)}...`
              : item.titulo}
          </Text>
        </TouchableOpacity>
      </View>


      <TouchableOpacity
      style={styles.excluirButtonFixed}
      onPress={() => excluirAlarme(item.id)}>
       <Icon name="delete" size={24} color="black" />
              </TouchableOpacity>
    </View>
  );

  const handleAlarmePress = (alarme) => {
    setSelectedAlarmDetails(alarme);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedAlarmDetails(null);
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

  const formatarHorario = (text) => {
    // Remover caracteres não numéricos
    const numericText = text.replace(/[^\d]/g, '');
  
    // Adicionar ":" após os dois primeiros dígitos
    const formattedText = numericText.replace(/(\d{2})(\d{0,2})/, '$1:$2');
  
    return formattedText;
  };

const checkNotificationPermissions = async () => {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    console.log('Status de permissões de notificação:', status);

    if (status !== 'granted') {
      const { status: askStatus } = await Notifications.requestPermissionsAsync();
      console.log('Status de permissões após a solicitação:', askStatus);

      if (askStatus !== 'granted') {
        console.log('Permissão de notificação não concedida');
      }
    }
  } catch (error) {
    console.error('Erro ao verificar as permissões de notificação:', error);
  }
};

// Call the function somewhere in your code, perhaps at the beginning or during initialization
checkNotificationPermissions();


const scheduleLocalNotification = async (alarme) => {
  try {
    console.log('Chamando scheduleLocalNotification para o alarme:', alarme);

    const { horario, repeatWeekly, selectedDays, selectedDate, titulo } = alarme;

    // Obter a data atual no fuso horário do Brasil
    const currentDate = moment().tz('America/Sao_Paulo');
    console.log('Tempo atual:', currentDate.format());

    // Configurar a data da notificação
    let notificationDate;

    if (repeatWeekly) {
      // Caso o alarme seja repetitivo, encontrar o próximo dia da semana selecionado
      const selectedDay = moment().isoWeekday(selectedDay); // inicializando selectedDay
      notificationDate = moment().isoWeekday(selectedDay);
      while (notificationDate.isBefore(currentDate)) {
        notificationDate.add(7, 'days');
      }
    } else {
      // Caso o alarme seja único, usar a data selecionada
      notificationDate = moment(selectedDate);
    }
    
    // Configurar a hora da notificação
    const [hour, minute] = horario.split(':');
    notificationDate.set('hour', hour);
    notificationDate.set('minute', minute);
    notificationDate.set('second', 0); // Definir segundos como 0

    // Converter a hora da notificação para o fuso horário do Brasil
    notificationDate = notificationDate.tz('America/Sao_Paulo');
    console.log('Data da notificação:', notificationDate.format());

    // Verificar se a data já passou, se sim, configurar para o próximo ano ou semana
    if (notificationDate.isBefore(currentDate)) {
      repeatWeekly ? notificationDate.add(1, 'week') : notificationDate.add(1, 'year');
    }

    // Calcular o tempo restante até a data da notificação
    const timeUntilNotification = notificationDate.diff(currentDate, 'seconds');
    console.log('Tempo até a notificação (segundos):', timeUntilNotification);

    // Agendar a notificação
    const schedulingOptions = {
      content: {
        title: 'Alarme!',
        body: `Alarme: ${titulo}`,
      },
      trigger: {
        seconds: timeUntilNotification,
      },
    };

    const identifier = await Notifications.scheduleNotificationAsync(schedulingOptions);
    console.log('Notificação agendada:', identifier);
  } catch (error) {
    console.error('Erro ao agendar notificação:', error);
  }
};

  return (
    <Grid style={styles.container}>
      <Row style={styles.botoes} size={3}>
        {alarmesData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text>Você não tem alarmes marcados</Text>
          </View>
        ) : (
          <FlatList
            data={alarmesData}
            keyExtractor={(item) => item.id}
            renderItem={renderAlarmeItem}
          />
        )}
      </Row>

      {showDetailsModal && selectedAlarmDetails && (
        <Modal
          isVisible={showDetailsModal}
          backdropOpacity={0.5}
          onBackdropPress={closeDetailsModal}
          style={styles.modal}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedAlarmDetails.titulo}</Text>
            <Text style={styles.detailsText}>
              {selectedAlarmDetails.repeatWeekly
                ? `Repetição: ${Object.keys(selectedAlarmDetails.selectedDays).filter(day => selectedAlarmDetails.selectedDays[day]).join(', ')}`
                : `Data: ${selectedAlarmDetails.selectedDate}, Horário: ${selectedAlarmDetails.horario}`
              }
            </Text>
            <Text style={styles.detailsText}>Descrição: {selectedAlarmDetails.descricao}</Text>
            <TouchableOpacity onPress={closeDetailsModal}>
              <Text style={styles.fecharDetails}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )}

    <Row style={styles.botoes} size={1}>
        <TouchableOpacity onPress={openAddAlarmeModal}>
          <View style={styles.botaoAdicionar}>
            <Text style={styles.textoBotaoAdicionar}>Adicionar Alarme</Text>
          </View>
        </TouchableOpacity>
      </Row>

      <Modal
        isVisible={showAddAlarmeModal}
        backdropOpacity={0.5}
        onBackdropPress={closeAddAlarmeModal}
        style={styles.modal}
      >
        <ScrollView>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Adicionar Novo Alarme</Text>
            <TextInput
              style={styles.input}
              placeholder="Horário"
              keyboardType='numeric'
              value={novoAlarme.horario}
              onChangeText={(text) =>
                setNovoAlarme({ ...novoAlarme, horario: formatarHorario(text) })
              }
              maxLength={5}
            />
            <TextInput
              style={styles.input}
              placeholder="Título"
              value={novoAlarme.titulo}
              onChangeText={(text) =>
                setNovoAlarme({ ...novoAlarme, titulo: text.slice(0, 20) })
              }
              maxLength={20}
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
                  markedDates={
                    selectedDate
                      ? { [selectedDate.dateString]: { selected: true, selectedColor: '#EA86BF' } }
                      : {}
                  }
                  style={styles.calendarContainer}
                />
              </View>
            )}
            <TouchableOpacity onPress={() => setChooseDaysOfWeek((prev) => !prev)}>
              <Text style={styles.toggleButtonText}>
                Escolher {chooseDaysOfWeek ? 'Data' : 'Dias da Semana'}
              </Text>
            </TouchableOpacity>
            <View>
            <CustomButton
              onPress={adicionarAlarme}
              title="Adicionar"
              marginBottom={10}
            />
            </View>
            <CustomButton
              onPress={closeAddAlarmeModal}
              title="Cancelar"
              marginBottom={0}
            />
          </View>
        </ScrollView>
      </Modal>
    </Grid>
  );
}


const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#E8EBEE',
    justifyContent: 'center',
    alignContent: 'center',
  },
  alarmeItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CDD0D4',
    borderRadius: 5,
    padding: 10,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#E6E9ED',
  },
  itemContent: {
    flex: 1,
  },
  actionContainer: {
    marginLeft: 10, // Ajuste a margem conforme necessário
  },
  lixeiraButton: {
    backgroundColor: '#EA86BF',
    borderRadius: 10,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lixeiraButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
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
    color: 'black',
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
    borderColor: '#CDD0D4',
    borderWidth: 2,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 20.
  },
  itemTitulo: {
    flex: 1,
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
  excluirButtonFixed: {
    position: 'absolute',
    right: 10, // ou a posição desejada
    top: 15, // ou a posição desejada
    borderRadius: 10,
    padding: 10,
  },
  excluirButtonText: {
    color: '#822E5E',
  },
  calendarContainer: {
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#CDD0D4',
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
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#822E5E',
  },
  detailsText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#2E3944',
  },
  fecharDetails: {
    marginTop: 30,
    color: '#822E5E',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
