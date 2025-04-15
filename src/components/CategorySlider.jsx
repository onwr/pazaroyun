import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const CategorySlider = () => {
  const [categories, setCategories] = useState([]);
  const [futureCategories, setFutureCategories] = useState([]);
  const [currentDay, setCurrentDay] = useState(new Date().getDay());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [dailyDoc, categoriesDoc] = await Promise.all([
          getDoc(doc(db, 'settings', 'dailyCategories')),
          getDoc(doc(db, 'settings', 'categories'))
        ]);
        
        if (dailyDoc.exists() && categoriesDoc.exists()) {
          const dailyCategories = dailyDoc.data().categories || [];
          const allCategories = categoriesDoc.data().list || [];
          
          // Bugünün kategorileri
          const todayCategories = dailyCategories
            .filter(cat => cat.day === currentDay.toString())
            .map(dailyCat => {
              const category = allCategories.find(c => c.id === dailyCat.categoryId);
              return category ? { ...category, ...dailyCat, day: currentDay } : null;
            })
            .filter(Boolean);
          
          // Gelecek günlerin kategorileri
          const futureDaysCategories = [];
          for (let i = 1; i < 7; i++) {
            const nextDay = (currentDay + i) % 7;
            const nextDayCategories = dailyCategories
              .filter(cat => cat.day === nextDay.toString())
              .map(dailyCat => {
                const category = allCategories.find(c => c.id === dailyCat.categoryId);
                return category ? { ...category, ...dailyCat, day: nextDay } : null;
              })
              .filter(Boolean);
            
            if (nextDayCategories.length > 0) {
              futureDaysCategories.push(...nextDayCategories);
            }
          }
          
          setCategories(todayCategories);
          setFutureCategories(futureDaysCategories);
        }
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [currentDay]);

  if (isLoading) {
    return (
      <div className='my-10 px-4'>
        <div className='flex justify-center'>
          <div className='animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500' />
        </div>
      </div>
    );
  }

  const allCategories = [...categories, ...futureCategories];

  if (allCategories.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Belirlenmiş kategori bulunmamaktadır.</p>
      </div>
    );
  }

  const days = [
    'Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'
  ];

  return (
    <div className='my-10 px-4'>
      <p className='caveat text-center text-4xl'>Günün Kategorileri</p>
      <div className="relative mt-5 w-full overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {allCategories.map((category) => (
            <a
              key={`${category.id}-${category.day}`}
              href={category.link}
              className='flex flex-col items-center justify-center gap-2 rounded-2xl border border-white/10 bg-[#030508] p-4 transition-colors hover:border-white/20 lg:gap-4 lg:p-8 lg:w-80'
            >
              <img
                src={category.image}
                alt={category.name}
                className='h-auto w-auto object-contain lg:h-auto lg:w-auto'
              />
              <div className='text-center'>
                <p className='text-base text-[#9ca3af] transition-colors hover:text-white lg:text-lg'>
                  {category.name}
                </p>
                {category.day !== currentDay && (
                  <p className='text-sm text-green-500 mt-1'>
                    {days[category.day]} için
                  </p>
                )}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategorySlider; 