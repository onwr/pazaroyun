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
      <p className='caveat text-center text-4xl'>Şunlara bakmaya ne dersin?</p>

      <div className='container mx-auto mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5'>
        {categories.map((category) => (
          <a
            key={category.id}
            href={category.link}
            className='flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#030508] p-4 transition-colors hover:border-white/20 lg:gap-4 lg:p-8'
          >
            <img
              src={category.image}
              alt={category.name}
              className='h-auto w-auto object-contain lg:h-auto lg:w-auto'
            />
            <p className='text-center text-base text-[#9ca3af] transition-colors hover:text-white lg:text-lg'>
              {category.name}
            </p>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Categories;