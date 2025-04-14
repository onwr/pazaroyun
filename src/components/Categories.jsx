import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const docRef = doc(db, 'settings', 'categories');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const activeCategories = (docSnap.data().list || [])
            .filter(category => category.isActive)
            .sort((a, b) => a.order - b.order);
          setCategories(activeCategories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <div className='my-10 px-4'>
        <div className='flex justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500' />
        </div>
      </div>
    );
  }

  return (
    <div className='my-10 px-4'>
      <p className='text-center text-xl lg:text-3xl font-light'>Şunlara bakmaya ne dersin?</p>

      <div className='container mx-auto mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5'>
        {categories.map((category) => (
          <a
            key={category.id}
            href={category.link}
            className='bg-[#030508] p-4 lg:p-8 rounded-2xl flex flex-col items-center justify-center gap-2 lg:gap-4 border border-white/10 hover:border-white/20 transition-colors'
          >
            <img
              src={category.image}
              alt={category.name}
              className='w-16 h-16 lg:w-auto lg:h-auto object-contain'
            />
            <p className='text-base lg:text-lg text-[#9ca3af] hover:text-white transition-colors'>
              {category.name}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Categories;