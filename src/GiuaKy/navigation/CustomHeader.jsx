/* eslint-disable react-native/no-inline-styles */
import React, {useContext} from 'react';
import {View} from 'react-native';
import {Appbar, Badge, useTheme} from 'react-native-paper';
import {AuthContext} from '../contexts/AuthContext';
import {CartContext} from '../contexts/CartContext';
import auth from '@react-native-firebase/auth';

const CustomHeader = ({navigation: drawerNavigationProp, route, options}) => {
  const theme = useTheme();
  const {user} = useContext(AuthContext);
  const {cartItems} = useContext(CartContext);

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  let titleToDisplay = options.title || 'Restaurant App';
  if (route.name === 'Home') {
    const stackRoute = route.state
      ? route.state.routes[route.state.index]
      : null;
    if (stackRoute) {
      switch (stackRoute.name) {
        case 'CuisineHome':
          titleToDisplay = 'Restaurant App';
          break;
        case 'FoodList':
          titleToDisplay = stackRoute.params?.cuisineName || 'Menu';
          break;
        case 'FoodDetail':
          titleToDisplay = stackRoute.params?.foodItem?.name || 'Details';
          break;
        case 'Cart':
          titleToDisplay = 'My Cart';
          break;
        case 'PaymentSuccess':
          titleToDisplay = 'Order Confirmed';
          break;
        default:
          titleToDisplay = options.title || 'Restaurant App';
      }
    } else {
      titleToDisplay = options.title || 'Restaurant App';
    }
  }

  return (
    <Appbar.Header>
      <Appbar.Action
        icon="menu"
        onPress={() => drawerNavigationProp.toggleDrawer()}
      />
      <Appbar.Content
        title={titleToDisplay}
        titleStyle={{
          fontSize: 18,
          fontWeight: 'bold',
          color: theme.colors.error,
          textAlign: 'center',
        }}
      />
      <View style={{position: 'relative', marginRight: 0}}>
        <Appbar.Action
          icon="cart"
          onPress={() => {
            drawerNavigationProp.navigate('Home', {screen: 'Cart'});
          }}
        />
        {cartItemCount > 0 && (
          <Badge style={{position: 'absolute', top: 5, right: 5}} size={18}>
            {cartItemCount}
          </Badge>
        )}
      </View>
      {user && (
        <Appbar.Action
          icon="logout"
          onPress={handleLogout}
          style={{marginLeft: 0}}
        />
      )}
    </Appbar.Header>
  );
};

export default CustomHeader;
