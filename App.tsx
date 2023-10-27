import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';

export default function App() {
  return (
    <Grid style={styles.container}>
      {/* Cabeçalho */}
      <Row style={styles.cabeçalho}>
       <Col>
          <Text style={styles.headerText}>Bem-vindo</Text>
        </Col>
        <Image
        source={require('/Users/949967/Downloads/react/Integrador/assets/2.png')}
        style={styles.image}
      />
      </Row>

      {/* Corpo da página */}
      <Row>
        <Col>
          {/* Retângulo rosa 1 */}
          <TouchableOpacity>
            <Text style={styles.estudos}>Estudos</Text>
          </TouchableOpacity>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Retângulo rosa 2 */}
          <TouchableOpacity>
            <Text style={styles.alarmes}>Estudos</Text>
          </TouchableOpacity>
        </Col>
      </Row>
      <Row>
        <Col>
          {/* Retângulo rosa 3 */}
          <View style={styles.aniversario}></View>
        </Col>
      </Row>

    </Grid>
  
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 35,
  },
  headerText: {
    fontSize: 24,
    textAlign: 'left',
    paddingLeft: 20,
  },
  estudos: {
    height: 90,
    width: 300,
    backgroundColor: 'pink',
    marginTop: 50,
    marginLeft: 30,
    borderRadius: 20,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 40,
    fontFamily: 'Arial',
  },
  alarmes: {
    height: 90,
    width: 300,
    backgroundColor: 'pink',
    marginTop: 50,
    marginLeft: 30,
    borderRadius: 20,
  },
  aniversario: {
    height: 90,
    width: 300,
    backgroundColor: 'pink',
    marginTop: 50,
    marginLeft: 30,
    borderRadius: 20,
  },
  image:{
    width: 37,
    height: 50,
    marginRight: 10,
  },
  cabeçalho:{
    alignItems: 'center',
    height: 75,
    backgroundColor: '#FCD166'
  },

});
