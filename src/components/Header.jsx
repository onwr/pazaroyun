import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Header = () => {
  const [headerContent, setHeaderContent] = useState({
    logo: '/logo.webp',
    backgroundImage: '/images/bg.webp'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHeaderContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'header');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeaderContent(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching header content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeaderContent();
  }, []);

  if (isLoading) {
    return (
      <div className="h-[300px] md:h-[560px] lg:h-[460px] xl:h-[700px] 2xl:h-[780px] bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div>
      <header 
        className="h-[300px] md:h-[560px] lg:h-[460px] xl:h-[700px] 2xl:h-[780px] bg-no-repeat bg-top bg-cover relative" 
        style={{ backgroundImage: `url(${headerContent.backgroundImage})` }}
      >
        <div className="absolute inset-0">
          <div className="container max-w-screen-xl flex justify-end">
            <a href="/" className="flex items-center justify-center space-x-2 py-5">
              <img 
                className="h-6 lg:h-10 hover:opacity-90 transition-opacity" 
                src={headerContent.logo} 
                alt="incehesap logo" 
              />
            </a>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;