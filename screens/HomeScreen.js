import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { Grid, Row, Col } from 'react-native-easy-grid';



export default function HomeScreen({ navigation }) {
  
  return (
    
    <Grid style={styles.container}>

      <Row size={4} style={styles.botoes}>
      <Image
                    source={require('../../Projeto_Integrador_React/assets/1.png')}
                    style={styles.background}
                />
      </Row>

        {/* Corpo da página */}
        <Row style={styles.botoes} size={1}>
          
            {/* Retângulo rosa 1 */}
            <TouchableOpacity onPress={() => navigation.navigate('Estudos')}>
            <View style={styles.retangulo}>
            <Image
                    source={require('../../Projeto_Integrador_React/assets/estudos.png')}
                    style={styles.image}
                />
              <Text style={styles.estudos}>Estudos</Text>
             
              </View>
            </TouchableOpacity>
    
        </Row>
        <Row style={styles.botoes} size={1}>
       
            {/* Retângulo rosa 2 */}
            <TouchableOpacity onPress={() => navigation.navigate('Alarmes')}>
            <View style={styles.retangulo}>
            <Image
                   source={require('../../Projeto_Integrador_React/assets/alarmes.png')}
                    style={styles.image}
                />
              <Text style={styles.alarmes}>Alarmes</Text>
              </View>
            </TouchableOpacity>
       
        </Row>
        <Row style={styles.botoes} size={1}>
        
            {/* Retângulo rosa 3 */}
            <TouchableOpacity onPress={() => navigation.navigate('Aniversario')} >
            <View style={styles.retangulo}>
            <Image
                  source={require('../../Projeto_Integrador_React/assets/aniversario.png')}
                    style={styles.image}
                />
              <Text style={styles.aniversario}>Aniversários</Text>
                 </View>
            </TouchableOpacity>
        
        </Row>
  
      </Grid>
    
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FCD166',
      justifyContent: 'center', // Center horizontally
    },
    background: {
      width: 300,
      height: 400,
      marginLeft: 25,
    },
    estudos: {
      textAlignVertical: 'center',
      fontSize: 25,
      marginLeft: 10,
    },
    alarmes: {
      marginLeft: 10,
      textAlignVertical: 'center',
      fontSize: 25,
    },
    aniversario: {
      textAlignVertical: 'center',
      fontSize: 25,
      marginLeft: 10,
    },
    image: {
      width: 60,
      height: 60,
    },
    retangulo: {
      flexDirection: 'row',
      alignItems: 'center',
      height: 70,
      width: 260,
      backgroundColor: '#E6E9ED',
      marginLeft: 50,
      paddingLeft: 20,
      borderRadius: 20,
      textAlign: 'right',
      textAlignVertical: 'center',
      fontSize: 35,
      borderWidth: 2, // Largura da borda
      borderColor: 'black', // Cor da borda
    },
  });