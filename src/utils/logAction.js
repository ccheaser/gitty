import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { auth } from '../firebase';

export const logAction = async (actionType, details) => {
  try {
    const user = auth.currentUser;
    const userId = user ? user.uid : 'anonymous';
    const userEmail = user ? user.email : 'unknown';

    await addDoc(collection(db, 'logs'), {
      actionType,
      userId,
      userEmail,
      details,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Loglama hatası:', error);
  }
};