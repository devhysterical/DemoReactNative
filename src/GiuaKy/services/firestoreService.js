import firestore from '@react-native-firebase/firestore';

export const createUserProfileDocument = async (
  userAuth,
  additionalData = {},
) => {
  if (!userAuth || !userAuth.uid) {
    return;
  }

  const userRef = firestore().collection('GK').doc(userAuth.uid);
  const snapshot = await userRef.get();

  if (!snapshot.exists) {
    const {displayName, email} = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        uid: userAuth.uid,
        displayName: displayName || null,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.error('Error creating user profile in Firestore: ', error);
      throw error;
    }
  }
  return userRef;
};

export const getCuisines = async () => {
  try {
    const snapshot = await firestore().collection('cuisines').get();
    const cuisines = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return cuisines;
  } catch (error) {
    console.error('Error fetching cuisines: ', error);
    throw error;
  }
};

export const getFoodsByCuisine = async cuisineId => {
  try {
    const snapshot = await firestore()
      .collection('foods')
      .where('cuisineId', '==', cuisineId)
      .get();
    const foods = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
    return foods;
  } catch (error) {
    console.error(`Error fetching foods for cuisine ${cuisineId}: `, error);
    throw error;
  }
};

export const getFoodDetails = async foodId => {
  try {
    const doc = await firestore().collection('foods').doc(foodId).get();
    if (!doc.exists) {
      console.log('No such food document!');
      return null;
    }
    return {id: doc.id, ...doc.data()};
  } catch (error) {
    console.error('Error fetching food details: ', error);
    throw error;
  }
};

export const createOrder = async orderData => {
  if (!orderData || !orderData.userId) {
    console.error('Order data must include a userId.');
    throw new Error('Order data must include a userId.');
  }
  try {
    const orderRef = await firestore()
      .collection('orders')
      .add({
        ...orderData,
        createdAt: firestore.FieldValue.serverTimestamp(),
        status: orderData.status || 'Pending',
      });
    console.log('Order created with ID: ', orderRef.id);
    return orderRef;
  } catch (error) {
    console.error('Error creating order: ', error);
    throw error;
  }
};
