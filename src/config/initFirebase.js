import { db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';

const initializeFirebase = async () => {
  try {
    // Campaign Settings
    await setDoc(doc(db, 'settings', 'campaign'), {
      isActive: false,
      startTime: null,
      endTime: null,
      theme: {
        backgroundColor: '#000000',
        textColor: '#ffffff',
        primaryColor: '#10B981',
        secondaryColor: '#059669'
      }
    });

    // Categories
    await setDoc(doc(db, 'settings', 'categories'), {
      list: []
    });

    // Products
    await setDoc(doc(db, 'settings', 'products'), {
      list: []
    });

    console.log('Firebase collections initialized successfully!');
  } catch (error) {
    console.error('Error initializing Firebase collections:', error);
  }
};

export default initializeFirebase; 