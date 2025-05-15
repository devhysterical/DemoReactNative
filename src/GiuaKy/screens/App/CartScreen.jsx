import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Button,
  useTheme,
  Appbar,
  Divider,
  IconButton,
  Card,
} from 'react-native-paper';
import {CartContext} from '../../contexts/CartContext';

const CartScreen = ({navigation}) => {
  const theme = useTheme();
  const {cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart} =
    useContext(CartContext);

  const renderCartItem = ({item}) => {
    const imageSource =
      typeof item.imageUrl === 'string' &&
      (item.imageUrl.startsWith('http') || item.imageUrl.startsWith('https'))
        ? {uri: item.imageUrl}
        : item.imageUrl ||
          require('../../../../assets/images/placeholder-food.png');

    return (
      <Card style={styles.itemCard}>
        <View style={styles.itemContainer}>
          <Image source={imageSource} style={styles.itemImage} />
          <View style={styles.itemDetails}>
            <Text variant="titleMedium" style={styles.itemName}>
              {item.name}
            </Text>
            <Text variant="bodyMedium" style={styles.itemPrice}>
              ₹{item.price}
            </Text>
            <View style={styles.quantityControls}>
              <IconButton
                icon="minus-circle"
                size={24}
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
              />
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <IconButton
                icon="plus-circle"
                size={24}
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
              />
            </View>
          </View>
          <IconButton
            icon="trash-can-outline"
            size={24}
            onPress={() => removeFromCart(item.id)}
            color={theme.colors.error}
            style={styles.deleteButton}
          />
        </View>
      </Card>
    );
  };

  const subtotal = getCartTotal();
  const taxes = subtotal * 0.08;
  const deliveryCharge = cartItems.length > 0 ? 30 : 0;
  const totalPay = subtotal + taxes + deliveryCharge;

  const handleProceedToPay = () => {
    navigation.navigate('PaymentSuccess', {
      totalAmount: totalPay.toFixed(2),
      orderItems: cartItems,
    });
    // clearCart();
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Your Cart" />
        {cartItems.length > 0 && (
          <Appbar.Action
            icon="delete-sweep"
            onPress={() => {
              clearCart();
            }}
          />
        )}
      </Appbar.Header>

      {cartItems.length === 0 ? (
        <View style={styles.emptyCartContainer}>
          <Text variant="headlineSmall" style={styles.emptyCartText}>
            Your cart is empty!
          </Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('CuisineHome')}>
            Browse Foods
          </Button>
        </View>
      ) : (
        <>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContainer}
            ItemSeparatorComponent={() => <View style={{height: 0}} />}
          />
          <View style={styles.summaryContainer}>
            <Text variant="titleLarge" style={styles.summaryTitle}>
              Bill Receipt
            </Text>
            <View style={styles.summaryRow}>
              <Text>Items Total:</Text>
              <Text>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Taxes (8%):</Text>
              <Text>₹{taxes.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text>Delivery Charges:</Text>
              <Text>₹{deliveryCharge.toFixed(2)}</Text>
            </View>
            <Divider style={styles.divider} />
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text variant="titleMedium">Total Pay:</Text>
              <Text variant="titleMedium" style={{color: theme.colors.primary}}>
                ₹{totalPay.toFixed(2)}
              </Text>
            </View>
            <Button
              mode="contained"
              onPress={handleProceedToPay}
              style={styles.payButton}
              labelStyle={{fontSize: 18}}
              icon="credit-card-check-outline">
              Proceed to Pay
            </Button>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyCartContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyCartText: {
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  itemCard: {
    marginVertical: 6,
    elevation: 2,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemPrice: {
    color: '#555',
    marginBottom: 6,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityText: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
    minWidth: 20,
    textAlign: 'center',
  },
  deleteButton: {
    marginLeft: 'auto',
  },
  summaryContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  summaryTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRow: {
    marginTop: 10,
  },
  divider: {
    marginVertical: 10,
  },
  payButton: {
    marginTop: 20,
    paddingVertical: 10,
  },
});

export default CartScreen;
