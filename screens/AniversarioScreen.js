import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Button, FlatList } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { Picker } from "@react-native-picker/picker";
import { Calendar } from 'react-native-calendars';

export default function AniversarioScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [intervaloNotificacao, setIntervaloNotificacao] = useState('');
  const [aniversarios, setAniversarios] = useState([]);

  const handleDateSelect = (date) => {
    setCalendarVisible(false);
    setDataNascimento(date.dateString);
  };


  const toggleCalendar = () => {
    setCalendarVisible(!isCalendarVisible);
  };

  const handleIntervaloNotificacaoChange = (value) => {
    setIntervaloNotificacao(value);
  };

  const handleAdicionar = () => {
    // Lógica para adicionar o aniversário à lista
    const novoAniversario = {
      nome: nome,
      dataNascimento: dataNascimento,
      intervaloNotificacao: intervaloNotificacao,
    };

    setAniversarios([...aniversarios, novoAniversario]);

    // Limpar os campos após adicionar
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


            <FlatList
          data={aniversarios}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.aniversarioItem}>
              <Text>{`Nome: ${item.nome}, Data de Nascimento: ${item.dataNascimento}, Intervalo de Notificação: ${item.intervaloNotificacao}`}</Text>
            </View>
          )}
        />

        </Col>
      </Row>


      </Col>
    </Grid>
  );
}

const formatDate = (dateString) => {
  const date = new Date(dateString + 'T00:00:00Z'); // Adiciona a hora UTC 00:00:00
  const day = date.getUTCDate(); // Obtém o dia em UTC
  const month = date.getUTCMonth() + 1; // Obtém o mês em UTC (lembrando que janeiro é 0)
  const year = date.getUTCFullYear(); // Obtém o ano em UTC

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
  adicionar:{
    marginTop: 20,
    width: '100%', 
  },
});
