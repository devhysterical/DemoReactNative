import React, {useContext, useState} from 'react';
import {View, StyleSheet, Image, ScrollView, Alert} from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Appbar,
  TextInput,
  IconButton,
} from 'react-native-paper';
import {CartContext} from '../../contexts/CartContext';

const FoodDetailScreen = ({route, navigation}) => {
  const {foodItem} = route.params;
  const theme = useTheme();
  const {addToCart} = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  if (!foodItem) {
    return (
      <View style={styles.loaderContainer}>
        <Text>Food item not found.</Text>
      </View>
    );
  }

  const handleAddToCart = () => {
    if (quantity > 0) {
      addToCart(foodItem, quantity);
      Alert.alert(
        'Added to Cart',
        `${quantity} x ${foodItem.name} has been added to your cart.`,
      );
      navigation.goBack();
    } else {
      Alert.alert(
        'Invalid Quantity',
        'Please enter a quantity greater than 0.',
      );
    }
  };

  const incrementQuantity = () => setQuantity(q => q + 1);
  const decrementQuantity = () => setQuantity(q => (q > 1 ? q - 1 : 1));

  // Xử lý imageSource tương tự như trong FoodListScreen
  const imageSource =
    typeof foodItem.imageUrl === 'string' &&
    (foodItem.imageUrl.startsWith('http') ||
      foodItem.imageUrl.startsWith('https'))
      ? {uri: foodItem.imageUrl}
      : foodItem.imageUrl ||
        require('../../../../assets/images/placeholder-food.png');

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={foodItem.name || 'Food Detail'} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image
          source={imageSource}
          style={styles.foodImage}
        />
        <View style={styles.detailsContainer}>
          <Text variant="headlineMedium" style={styles.foodName}>
            {foodItem.name}
          </Text>
          <Text
            variant="titleLarge"
            style={[styles.foodPrice, {color: theme.colors.primary}]}>
            ₹{foodItem.price}
          </Text>
          <Text variant="bodyMedium" style={styles.foodDescription}>
            {foodItem.description ||
              'No detailed description available for this item.'}
          </Text>

          <View style={styles.quantityContainer}>
            <Text variant="titleMedium">Quantity:</Text>
            <View style={styles.quantityControls}>
              <IconButton
                icon="minus-circle-outline"
                onPress={decrementQuantity}
                size={30}
              />
              <Text style={styles.quantityText}>{quantity}</Text>
              <IconButton
                icon="plus-circle-outline"
                onPress={incrementQuantity}
                size={30}
              />
            </View>
          </View>

          <Button
            mode="contained"
            icon="cart-plus"
            onPress={handleAddToCart}
            style={styles.addToCartButton}
            labelStyle={{fontSize: 16}}>
            Add {quantity} to Cart
          </Button>
        </View>
      </ScrollView>
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
  scrollContainer: {
    paddingBottom: 20,
  },
  foodImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  detailsContainer: {
    padding: 20,
  },
  foodName: {
    fontWeight: 'bold',
    marginBottom: 10,
  },
  foodPrice: {
    fontWeight: 'bold',
    marginBottom: 15,
    fontSize: 22,
  },
  foodDescription: {
    lineHeight: 22,
    marginBottom: 20,
    color: '#444',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 20,
    marginHorizontal: 15,
    fontWeight: 'bold',
    minWidth: 30,
    textAlign: 'center',
  },
  addToCartButton: {
    paddingVertical: 10,
  },
});

export default FoodDetailScreen;
