import React, { Componenet, useState, useEffect } from 'react';
import { Text, View, StyleSheet, TextInput, Button, TouchableOpacity, FlatList, Alert} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import { DataTable } from 'react-native-paper';


function StartScreen({navigation, route}) {
  const [getOriginalPrice,setOriginalPrice] = useState("");
  const [getDiscountPercentage,setDiscountPercentage] = useState("");
  const [getOriginalPriceArray,setOriginalPriceArray] = useState([]);
  const [getDiscountPercentageArray,setDiscountPercentageArray] = useState([]);

  const discountCalculation =()=> {
    if (isNaN(getDiscountPercentage) || isNaN(getOriginalPrice) || (getOriginalPrice < 0) || (getDiscountPercentage < 0) || (getDiscountPercentage > 100)){
      return "Wrong Input";}
    else {
      return (getOriginalPrice / 100) * getDiscountPercentage;}
  };
  const finalPriceCalculation =()=> {
    if (isNaN(getDiscountPercentage) || isNaN(getOriginalPrice) || (getOriginalPrice < 0) || (getDiscountPercentage < 0) || (getDiscountPercentage > 100)){
      return "Wrong Input";}
    else {
      return (getOriginalPrice - (getOriginalPrice / 100) * getDiscountPercentage);}
  };
  const saveButton =()=> {
    if (!isNaN(getOriginalPrice) && !isNaN(getDiscountPercentage)) {
      if ((getOriginalPrice != "") && (getDiscountPercentage != "")){
        setOriginalPriceArray([...getOriginalPriceArray, getOriginalPrice]);
        setDiscountPercentageArray([...getDiscountPercentageArray, getDiscountPercentage]);
        setOriginalPrice("");
        setDiscountPercentage("");
      }
    }
  };

  useEffect(() => {
    if ((route.params?.returnOriginalPrice) && (route.params?.returnDiscountPercent)) {
      setOriginalPriceArray(route.params.returnOriginalPrice);
      setDiscountPercentageArray(route.params.returnDiscountPercent);
      navigation.setParams({ returnOriginalPrice: undefined });
      navigation.setParams({ returnDiscountPercent: undefined });
    }
  });

  navigation.setOptions({
    headerRight: () => (
      <View style={{ paddingRight: 10 }}>
        <FontAwesome
          name="history"
          size={24}
          color="black"
        onPress={() => navigation.navigate('History', { originalPrice: getOriginalPriceArray, discountPerc: getDiscountPercentageArray })}
        />
      </View>
    ),
  });

  return (
    <View style={styles.container}>
      <View style={{alignItems: 'center'}}>
        <Text style={styles.discountHeader}>Discount App</Text>
      </View>
      <View style={{width: '95%'}}>
        <View style={styles.inputContainersWithText}>
          <Text>Original Price:</Text>
          <TextInput
            style={styles.inputContainers}
            onChangeText={getOriginalPrice => setOriginalPrice(getOriginalPrice)}
            value={getOriginalPrice}
            keyboardType={'number-pad'}
          />
        </View>
        <View style={styles.inputContainersWithText}>
          <Text>Discount Percentage:</Text>
          <TextInput
            style={styles.inputContainers}
            onChangeText={getDiscountPercentage => setDiscountPercentage(getDiscountPercentage)}
            value={getDiscountPercentage}
            keyboardType={'number-pad'}
          />
        </View>
      </View>
      <View>
        <Text style={styles.inputContainersWithText}>
          You Save: {discountCalculation()}
        </Text>
        <Text style={styles.inputContainersWithText}>
          Final Price: {finalPriceCalculation()}
        </Text>
      </View>
      <View>
        <Button 
          onPress={saveButton}
          title="Save Calculations"
        />
      </View>
    </View>
  );
}

function HistoryScreen({navigation, route}) {
  const [getOriginalPrice,setOriginalPrice] = useState(route.params.originalPrice);
  const [getDiscountPerc,setDiscountPerc] = useState(route.params.discountPerc);

  const deleteItem = (index) => {
    setOriginalPrice((getOriginalPrice) => getOriginalPrice.filter((item) => getOriginalPrice.indexOf(item) != index));
    setDiscountPerc((getDiscountPerc) => getDiscountPerc.filter((item) => getDiscountPerc.indexOf(item) != index));
  }
  const deleteList = () => {
    setOriginalPrice([]);
    setDiscountPerc([]);
  }

  navigation.setOptions({
    headerLeft: () => (
      <View style={{ paddingLeft: 10 }}>
        <FontAwesome
          name="long-arrow-left"
          size={25}
          color="black"
          onPress={() =>
            navigation.navigate('Start', { returnOriginalPrice: getOriginalPrice, returnDiscountPercent: getDiscountPerc })
          }
        />
      </View>
    ),
    headerRight: () => (
      <View style={{ paddingRight: 10 }}>
        <FontAwesome
          name="trash"
          size={24}
          color="black"
          onPress={deleteList}
        />
      </View>
    ),
  });
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <DataTable>
        <DataTable.Header>
          <DataTable.Title >Original Price</DataTable.Title>
          <DataTable.Title numeric>Discount</DataTable.Title>
          <DataTable.Title numeric>Final Price</DataTable.Title>
          <DataTable.Title numeric><FontAwesome
            name="times"
            size={18}
            color="grey"
          />
          </DataTable.Title>
        </DataTable.Header>
        {getOriginalPrice.map((item,index) => 
          <DataTable.Row>
              <DataTable.Cell style={{paddingLeft: 25}}>{item}</DataTable.Cell>
              <DataTable.Cell style={{paddingLeft: 30}}>{getDiscountPerc[index]}%</DataTable.Cell>
              <DataTable.Cell>{item - (item / 100) * getDiscountPerc[index]}</DataTable.Cell>
              <DataTable.Cell numeric><FontAwesome
                name="times"
                size={18}
                color="grey"
                onPress = {() => deleteItem(index)}
              />
              </DataTable.Cell>
          </DataTable.Row>  
        )}   
      </DataTable>
    </View>
  );
}

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Start" component={StartScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  discountHeader: {
    marginBottom:'50px',
    fontWeight:'bold',
    fontSize: '25px'
  },
  inputContainersWithText: {
    width: '100%',
    flexDirection:'row',
    justifyContent: 'space-between',
    margin: '10px'
  },
  inputContainers: {
    height: '30px',
    backgroundColor:'#ffffff',
    width:'60%'
  },
});
export default App;