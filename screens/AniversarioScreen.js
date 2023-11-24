import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { Picker } from "@react-native-picker/picker";
import { Calendar } from 'react-native-calendars';

export default function AniversarioScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [intervaloNotificacao, setIntervaloNotificacao] = useState('');

  const handleDateSelect = (date) => {
    setDataNascimento(date.dateString);
    setCalendarVisible(false);
  };

  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  const handleIntervaloNotificacaoChange = (value) => {
    setIntervaloNotificacao(value);
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
      <Text style={styles.label}>Data de Nascimento:</Text>
      <View style={styles.dataContainer}>
        <TouchableOpacity onPress={toggleCalendar} style={styles.touch}>
          <Image source={require('../assets/calendario.png')} style={styles.calendarIcon} />
          {dataNascimento !== '' && (
          <Text style={styles.selectedDate}>{formatDate(dataNascimento)}</Text>
        )}
        </TouchableOpacity>
        
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
        </Col>
      </Row>


      </Col>
    </Grid>
  );
}

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  touch: {

    flexDirection: 'row',
  },
  col: {
    margin: 10,
  },
  inputContainer: {
    marginTop: 20,
    width: '100%', // Use 100% to take the full width of the column
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
    marginRight: 10,
  },
  pickerContainer: {
    borderWidth: 1, // Adiciona uma borda ao redor do container do Picker
    borderColor: 'black', // Cor da borda
    borderRadius: 5, // Borda arredondada
    overflow: 'hidden', // Garante que a borda seja visível
    marginTop: 20,
    width: '100%', 
  },
  nasciContainer: {
    marginTop: 20,
    width: '100%', 
  },
  dataContainer: {
    borderWidth: 1, // Adiciona uma borda ao redor do container do Picker
    borderColor: 'black', // Cor da borda
    borderRadius: 5, // Borda arredondada
    overflow: 'hidden',
    padding: 10, // Garante que a borda seja visível
  },
  calendarContainer: {
    padding: 10, // Adiciona espaçamento em todos os lados do componente Calendar
  },
  notiContainer: {
    borderWidth: 1, // Adiciona uma borda ao redor do container do Picker
    borderColor: 'black', // Cor da borda
    borderRadius: 5, // Borda arredondada
    overflow: 'hidden',

  },
});
