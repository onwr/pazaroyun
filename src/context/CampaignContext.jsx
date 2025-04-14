import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '@config/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

const CampaignContext = createContext();

export const useCampaign = () => useContext(CampaignContext);

export const CampaignProvider = ({ children }) => {
  const [isCampaignActive, setIsCampaignActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [theme, setTheme] = useState({
    backgroundColor: '#000000',
    textColor: '#ffffff'
  });
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'campaign'), (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setIsCampaignActive(data.isActive);
        setStartTime(data.startTime?.toDate());
        setEndTime(data.endTime?.toDate());
        setTheme(data.theme || theme);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'categories'), (doc) => {
      if (doc.exists()) {
        setCategories(doc.data().list || []);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, 'settings', 'products'), (doc) => {
      if (doc.exists()) {
        setProducts(doc.data().list || []);
      }
    });

    return () => unsubscribe();
  }, []);

  const value = {
    isCampaignActive,
    startTime,
    endTime,
    theme,
    categories,
    products,
    isLoading
  };

  return (
    <CampaignContext.Provider value={value}>
      {children}
    </CampaignContext.Provider>
  );
}; 