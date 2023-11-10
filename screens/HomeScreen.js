import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';



export default function HomeScreen({ navigation }) {
  
  return (
    
    <Grid style={styles.container}>
        <Row>
            <Text>oi</Text>
        </Row>
        <Row>
        <Text>oi</Text>
        </Row>
        <Row>
        <Text>oi</Text>
        </Row>
        {/* Corpo da página */}
        <Row style={styles.botoes}>
          <Col>
            {/* Retângulo rosa 1 */}
            <TouchableOpacity>
            <View style={styles.retangulo}>
              <Text style={styles.estudos}>Estudos</Text>
              <Image
                    source={require('/Users/Daniel/Desktop/Projeto Integrador/Lembrapp/assets/estudos.png')}
                    style={styles.image}
                />
              </View>
            </TouchableOpacity>
          </Col>
        </Row>
        <Row style={styles.botoes}>
          <Col>
            {/* Retângulo rosa 2 */}
            <TouchableOpacity >
            <View style={styles.retangulo}>
              <Text style={styles.alarmes}>Alarmes</Text>
              <Image
                    source={require('/Users/Daniel/Desktop/Projeto Integrador/Lembrapp/assets/alarmes.png')}
                    style={styles.image}
                />
              </View>
            </TouchableOpacity>
          </Col>
        </Row>
        <Row style={styles.botoes}>
          <Col>
            {/* Retângulo rosa 3 */}
            <TouchableOpacity onPress={() => navigation.navigate('Aniversario')} >
            <View style={styles.retangulo}>
              <Text style={styles.aniversario}>Aniversários</Text>
            <Image
                    source={require('/Users/Daniel/Desktop/Projeto Integrador/Lembrapp/assets/aniversario.png')}
                    style={styles.image}
                />
                 </View>
            </TouchableOpacity>
          </Col>
        </Row>
  
      </Grid>
    
    );
  }
  
  const styles = StyleSheet.create({

    headerText: {
      fontSize: 24,
      textAlign: 'left',
      paddingLeft: 20,
    },
    estudos: {
        height: 90,
        width: 240,
        backgroundColor: '#EC87C0',
        marginLeft: 30,
        paddingLeft: 20,
        borderRadius: 20,
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 35,
    },
    alarmes: {
        height: 90,
        width: 240,
        backgroundColor: '#EC87C0',
        marginLeft: 30,
        paddingLeft: 20,
        borderRadius: 20,
        textAlign: 'left',
        textAlignVertical: 'center',
        fontSize: 35,
    },
    aniversario: {
      height: 90,
      width: 300,
      backgroundColor: '#EC87C0',
      marginLeft: 30,
      paddingLeft: 20,
      borderRadius: 20,
      textAlign: 'left',
      textAlignVertical: 'center',
      fontSize: 35,
    },
    image:{
      width: 60,
      height: 60,
      marginLeft: -70,
    },
    retangulo: {
        flexDirection: 'row',
        alignItems: 'center',
      },
    }
  );
