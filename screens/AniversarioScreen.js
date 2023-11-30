import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Button, FlatList } from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';
import { Picker } from "@react-native-picker/picker";
import { Calendar } from 'react-native-calendars';
import SQLite from 'react-native-sqlite-storage';

// Inicializa o banco de dados SQLite
const db = SQLite.openDatabase({ name: 'aniversarios.db', location: 'default' });

export default function AniversarioScreen() {
  const [nome, setNome] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [intervaloNotificacao, setIntervaloNotificacao] = useState('');
  const [aniversarios, setAniversarios] = useState([]);

  // useEffect para criar a tabela quando o componente é montado
  useEffect(() => {
    // Cria a tabela se não existir
    db.transaction((tx) => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS aniversarios (id INTEGER PRIMARY KEY AUTOINCREMENT, nome TEXT, dataNascimento TEXT, intervaloNotificacao TEXT)',
        [],
        () => console.log('Tabela criada com sucesso'),
        (_, error) => console.error('Erro ao criar a tabela:', error)
      );
    });

    // Carrega os aniversários do banco de dados quando o componente é montado
    loadAniversarios();
  }, []);

  const loadAniversarios = () => {
    // Consulta todos os aniversários na tabela
    db.transaction((tx) => {
      tx.executeSql(
        'SELECT * FROM aniversarios',
        [],
        (_, { rows }) => {
          const aniversariosFromDB = rows.raw();
          setAniversarios(aniversariosFromDB);
        },
        (_, error) => console.error('Erro ao carregar aniversários do banco de dados:', error)
      );
    });
  };

  const saveAniversario = () => {
    // Insere um novo aniversário na tabela
    db.transaction((tx) => {
      tx.executeSql(
        'INSERT INTO aniversarios (nome, dataNascimento, intervaloNotificacao) VALUES (?, ?, ?)',
        [nome, dataNascimento, intervaloNotificacao],
        () => {
          console.log('Aniversário salvo com sucesso');
          // Atualiza a lista de aniversários após salvar
          loadAniversarios();
        },
        (_, error) => console.error('Erro ao salvar aniversário no banco de dados:', error)
      );
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
                renderItem={({ item }) => (
                  <View style={styles.aniversarioItem}>
                    <Text>{`Nome: ${item.nome}, Data de Nascimento: ${item.dataNascimento}, Intervalo de Notificação: ${item.intervaloNotificacao}`}</Text>
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
});
