import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Text,
  Button,
  Card,
  useTheme,
  Appbar,
  IconButton,
} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import {CartContext} from '../../contexts/CartContext';

const FALLBACK_FOODS = {
  1: [
    // cuisineId '1' (Chinese)
    {
      id: 'f1',
      name: 'Spicy Noodles',
      description: 'Classic Chinese noodles with a spicy kick.',
      price: '120',
      imageUrl:
        'https://lindseyeatsla.com/wp-content/uploads/2021/11/LindseyEats_Spicy_Garlic_Noodles-3.jpg',
      cuisineId: '1',
    },
    {
      id: 'f2',
      name: 'Pork Dim Sum',
      description: 'Steamed pork dumplings, a savory delight.',
      price: '160',
      imageUrl:
        'https://homeisakitchen.com/wp-content/uploads/2016/01/man-fuel-food-blog-pork-shumai-dumplings-with-soy-and-tobasco-sauce.jpg',
      cuisineId: '1',
    },
  ],
  2: [
    // cuisineId '2' (South Indian)
    {
      id: 'f3',
      name: 'Chicken Biryani',
      description: 'Aromatic and flavorful chicken rice dish.',
      price: '220',
      imageUrl:
        'https://www.kannammacooks.com/wp-content/uploads/buhari-hotel-chennai-chicken-biryani-recipe-1-4.jpg',
      cuisineId: '2',
    },
    {
      id: 'f4',
      name: 'Masala Dosa',
      description: 'Crispy South Indian pancake with potato filling.',
      price: '130',
      imageUrl:
        'https://www.daringgourmet.com/wp-content/uploads/2023/06/Dosa-Recipe-3.jpg',
      cuisineId: '2',
    },
  ],
  3: [
    // cuisineId '3' (Beverages)
    {
      id: 'f5',
      name: 'Mango Lassi',
      description: 'Refreshing yogurt-based mango smoothie.',
      price: '80',
      imageUrl:
        'https://shivanilovesfood.com/wp-content/uploads/2023/03/Healthy-Mango-Lassi-7.jpg',
      cuisineId: '3',
    },
    {
      id: 'f6',
      name: 'Iced Coffee',
      description: 'Chilled coffee, perfect for a hot day.',
      price: '90',
      imageUrl:
        'https://www.tasteofhome.com/wp-content/uploads/2024/02/Copycat-McDonald-s-Iced-Coffee_EXPS_FT23_273351_ST_3_27_1.jpg',
      cuisineId: '3',
    },
  ],
  4: [
    // cuisineId '4' (North India)
    {
      id: 'f7',
      name: 'Butter Chicken',
      description: 'Creamy and rich chicken curry.',
      price: '250',
      imageUrl:
        'https://niksharmacooks.com/wp-content/uploads/2022/11/ButterChickenDSC_5611.jpg',
      cuisineId: '4',
    },
    {
      id: 'f8',
      name: 'Naan Bread',
      description: 'Soft and fluffy Indian flatbread.',
      price: '40',
      imageUrl:
        'https://www.thespruceeats.com/thmb/MReCj8olqrCsPaGvikesPJie02U=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/naan-leavened-indian-flatbread-1957348-final-08-116a2e523f6e4ee693b1a9655784d9b9.jpg',
      cuisineId: '4',
    },
  ],
  5: [
    // cuisineId '5' (Italian)
    {
      id: 'f9',
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomatoes, mozzarella, and basil.',
      price: '300',
      imageUrl:
        'https://cdn.shopify.com/s/files/1/0274/9503/9079/files/20220211142754-margherita-9920_5a73220e-4a1a-4d33-b38f-26e98e3cd986.jpg?v=1723650067',
      cuisineId: '5',
    },
    {
      id: 'f10',
      name: 'Pasta Carbonara',
      description: 'Creamy pasta with eggs, cheese, and pancetta.',
      price: '280',
      imageUrl:
        'https://www.whats4eats.com/wp-content/uploads/2024/04/pastas-spaghetti-carbonara-pixabay-712664-4x3-1.jpg',
      cuisineId: '5',
    },
  ],
  6: [
    // cuisineId '6' (Fast Food)
    {
      id: 'f11',
      name: 'Classic Burger',
      description: 'Juicy beef patty with lettuce, tomato, and cheese.',
      price: '180',
      imageUrl:
        'https://www.cookhomey.com/wp-content/uploads/2021/02/Classic-homemade-hamburger.jpg',
      cuisineId: '6',
    },
    {
      id: 'f12',
      name: 'French Fries',
      description: 'Crispy golden potato fries.',
      price: '70',
      imageUrl:
        'https://images.themodernproper.com/production/posts/2022/Homemade-French-Fries_8.jpg?w=1200&h=1200&q=60&fm=jpg&fit=crop&dm=1662474181&s=15046582e76b761a200998df2dcad0fd',
      cuisineId: '6',
    },
  ],
  default: [
    // Fallback for any other cuisineId
    {
      id: 'fx1',
      name: 'Default Dish One',
      description: 'A tasty sample dish for fallback.',
      price: '99',
      imageUrl:
        'https://via.placeholder.com/300/9C27B0/FFFFFF?Text=Default+Dish+1',
      cuisineId: 'default',
    },
    {
      id: 'fx2',
      name: 'Default Dish Two',
      description: 'Another delicious sample dish.',
      price: '109',
      imageUrl:
        'https://via.placeholder.com/300/795548/FFFFFF?Text=Default+Dish+2',
      cuisineId: 'default',
    },
  ],
};

const FoodListScreen = ({route, navigation}) => {
  const {cuisineId, cuisineName} = route.params;
  const theme = useTheme();
  const {addToCart, cartItems} = useContext(CartContext);

  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    navigation.setOptions({title: cuisineName || 'Food Menu'});

    const unsubscribe = firestore()
      .collection('foods')
      .where('cuisineId', '==', cuisineId)
      .onSnapshot(
        querySnapshot => {
          const foodsData = [];
          querySnapshot.forEach(documentSnapshot => {
            foodsData.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
          setFoods(
            foodsData.length > 0
              ? foodsData
              : FALLBACK_FOODS[cuisineId] || FALLBACK_FOODS['default'],
          );
          setLoading(false);
        },
        error => {
          console.error(
            `Error fetching foods for cuisine ${cuisineId}: `,
            error,
          );
          setFoods(FALLBACK_FOODS[cuisineId] || FALLBACK_FOODS['default']);
          setLoading(false);
        },
      );
    return () => unsubscribe();
  }, [cuisineId, cuisineName, navigation]);

  const handleAddToCart = foodItem => {
    addToCart(foodItem, 1);
    Alert.alert(
      'Added to Cart',
      `${foodItem.name} has been added to your cart.`,
    );
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0);
  };

  const renderFoodItem = ({item}) => {
    // Kiểm tra xem imageUrl có phải là một chuỗi (URL) hay một số (kết quả từ require())
    const imageSource =
      typeof item.imageUrl === 'string' &&
      (item.imageUrl.startsWith('http') || item.imageUrl.startsWith('https'))
        ? {uri: item.imageUrl}
        : item.imageUrl ||
          require('../../../../assets/images/placeholder-food.png'); // Fallback nếu imageUrl không hợp lệ

    return (
      <Card style={styles.card}>
        <TouchableOpacity
          onPress={() => navigation.navigate('FoodDetail', {foodItem: item})}>
          <Card.Cover source={imageSource} style={styles.cardImage} />
          <Card.Content style={styles.cardContent}>
            <Text variant="titleMedium" style={styles.foodName}>
              {item.name}
            </Text>
            <Text
              variant="bodySmall"
              style={styles.foodDescription}
              numberOfLines={2}>
              {item.description || 'No description available.'}
            </Text>
            <Text variant="headlineSmall" style={styles.foodPrice}>
              ₹{item.price}
            </Text>
          </Card.Content>
        </TouchableOpacity>
        <Card.Actions style={styles.cardActions}>
          <Button
            mode="contained"
            // icon="cart-plus"
            onPress={() => handleAddToCart(item)}
            style={{backgroundColor: theme.colors.primary}}>
            Add to Cart
          </Button>
        </Card.Actions>
      </Card>
    );
  };

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
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={cuisineName || 'Menu'} />
        <View style={styles.cartIconContainer}>
          <IconButton
            size={24}
            onPress={() => navigation.navigate('Cart')}
          />
        </View>
      </Appbar.Header>
      <FlatList
        data={foods}
        renderItem={renderFoodItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            No food items available for this cuisine.
          </Text>
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
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
    elevation: 2,
  },
  cardImage: {
    height: 150,
  },
  cardContent: {
    paddingTop: 12,
    paddingBottom: 0,
  },
  foodName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  foodDescription: {
    color: '#555',
    minHeight: 35,
    marginBottom: 8,
  },
  foodPrice: {
    color: 'green',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingRight: 8,
    paddingBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  cartIconContainer: {
    position: 'relative',
    marginRight: 10,
  },
  cartBadge: {
    position: 'absolute',
    right: -5,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default FoodListScreen;
