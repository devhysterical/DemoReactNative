import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import {Text, useTheme, Appbar} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const FALLBACK_CUISINES = [
  {
    id: '1',
    name: 'Chinese',
    imageUrl:
      'https://media.istockphoto.com/id/918501654/vector/chinese-food-chinese-noodles-or-pasta-on-red-background.jpg?s=612x612&w=0&k=20&c=YJ9A9GaF65vO4p-rejaC2Wwr58wjbxHT0BgrZ0WBkSQ=',
  },
  {
    id: '2',
    name: 'South Indian',
    imageUrl:
      'https://static.vecteezy.com/system/resources/previews/043/233/738/non_2x/organic-vegetarian-cuisine-logo-design-concept-vector.jpg',
  },
  {
    id: '3',
    name: 'Beverages',
    imageUrl:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFsS-vu6rNHEmidrja2SfWYXGs2vt6rmMXyTyt1B_8UlOqkNnTFGa6WaXpm4XrFI7ONcs&usqp=CAU',
  },
  {
    id: '4',
    name: 'North Indian',
    imageUrl:
      'https://static.vecteezy.com/system/resources/previews/041/333/156/non_2x/illustration-logo-top-view-paratha-with-indian-chicken-tikka-kebab-or-chicken-tandoori-vector.jpg',
  },
  {
    id: '5',
    name: 'Italian',
    imageUrl:
      'https://img.freepik.com/premium-vector/italian-food-logo-name-icon-symbol-vector-italy_526280-402.jpg',
  },
  {
    id: '6',
    name: 'Fast Food',
    imageUrl:
      'https://static.vecteezy.com/system/resources/previews/036/346/173/non_2x/fast-food-logo-design-vector.jpg',
  },
];

const CuisineScreen = ({navigation}) => {
  const theme = useTheme();
  const [cuisines, setCuisines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('cuisines')
      .onSnapshot(
        querySnapshot => {
          const cuisinesData = [];
          querySnapshot.forEach(documentSnapshot => {
            cuisinesData.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
          setCuisines(
            cuisinesData.length > 0 ? cuisinesData : FALLBACK_CUISINES,
          );
          setLoading(false);
        },
        error => {
          console.error('Error fetching cuisines: ', error);
          setCuisines(FALLBACK_CUISINES);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, []);

  const renderCuisineItem = ({item}) => (
    <TouchableOpacity
      style={styles.cuisineItemContainer}
      onPress={() =>
        navigation.navigate('FoodList', {
          cuisineId: item.id,
          cuisineName: item.name,
        })
      }>
      <ImageBackground
        source={{
          uri:
            item.imageUrl ||
            'https://via.placeholder.com/150/CCCCCC/FFFFFF?Text=NoImage',
        }}
        style={styles.cuisineItem}
        imageStyle={styles.cuisineImageStyle}>
        <View style={styles.overlay}>
          <Text style={styles.cuisineName}>{item.name}</Text>
        </View>
      </ImageBackground>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Appbar.Header>
        <Appbar.Content title="Cuisine" subtitle="Select Cuisine" />
      </Appbar.Header>
      <FlatList
        data={cuisines}
        renderItem={renderCuisineItem}
        keyExtractor={item => item.id}
        numColumns={2}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No cuisines available.</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 8,
  },
  cuisineItemContainer: {
    flex: 1,
    margin: 8,
    height: 150,
    borderRadius: 10,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cuisineItem: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cuisineImageStyle: {
    borderRadius: 10,
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    width: '100%',
    paddingVertical: 10,
  },
  cuisineName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});

export default CuisineScreen;
