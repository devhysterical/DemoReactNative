import React, {useContext, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {Text, Button, useTheme, Appbar, Icon} from 'react-native-paper';
import {CartContext} from '../../contexts/CartContext';

const PaymentSuccessScreen = ({route, navigation}) => {
  const theme = useTheme();
  const {totalAmount} = route.params || {totalAmount: '0.00'};
  const {clearCart} = useContext(CartContext);

  useEffect(() => {
    clearCart();
    const backHandler = navigation.addListener('beforeRemove', e => {
      if (e.data.action.type === 'GO_BACK') {
        e.preventDefault();
        navigation.replace('CuisineHome');
      }
    });

    return backHandler;
  }, [navigation, clearCart]);

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Appbar.Header>
        <Appbar.Content title="Payment Complete" />
      </Appbar.Header>
      <View style={styles.content}>
        <Icon source="check-circle" size={100} color={theme.colors.primary} />
        <Text variant="headlineMedium" style={styles.successText}>
          Payment Successful!
        </Text>
        <Text variant="titleMedium" style={styles.messageText}>
          Your payment has been approved.
        </Text>
        <Text
          variant="headlineSmall"
          style={[styles.amountText, {color: theme.colors.primary}]}>
          Total Paid: ₹{totalAmount}
        </Text>
        <Button
          mode="contained"
          onPress={() => navigation.replace('CuisineHome')}
          style={styles.homeButton}
          labelStyle={{fontSize: 16}}>
          Back to Home
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  successText: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  messageText: {
    textAlign: 'center',
    marginBottom: 25,
    color: '#444',
  },
  amountText: {
    fontWeight: 'bold',
    marginBottom: 40,
  },
  homeButton: {
    paddingHorizontal: 30,
    paddingVertical: 10,
  },
});

export default PaymentSuccessScreen;
