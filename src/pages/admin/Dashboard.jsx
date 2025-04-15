import React, { useState, useEffect } from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore';

const Dashboard = () => {
  const { isCampaignActive, endTime } = useCampaign();
  const [isUpdating, setIsUpdating] = useState(false);
  const [newEndTime, setNewEndTime] = useState(endTime ? new Date(endTime).toISOString().slice(0, 16) : '');
  const [campaignDuration, setCampaignDuration] = useState('6'); // Varsayılan 6 saat
  const [dailyCategories, setDailyCategories] = useState([]);
  const [allCategories, setAllCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ categoryId: '', day: '0' });

  const days = [
    { value: '0', label: 'Pazar' },
    { value: '1', label: 'Pazartesi' },
    { value: '2', label: 'Salı' },
    { value: '3', label: 'Çarşamba' },
    { value: '4', label: 'Perşembe' },
    { value: '5', label: 'Cuma' },
    { value: '6', label: 'Cumartesi' },
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const [dailyDoc, categoriesDoc] = await Promise.all([
          getDoc(doc(db, 'settings', 'dailyCategories')),
          getDoc(doc(db, 'settings', 'categories'))
        ]);
        
        if (dailyDoc.exists()) {
          setDailyCategories(dailyDoc.data().categories || []);
        }
        if (categoriesDoc.exists()) {
          setAllCategories(categoriesDoc.data().list || []);
        }
      } catch (error) {
        console.error('Kategoriler yüklenirken hata:', error);
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategory.categoryId) return;

    try {
      setIsUpdating(true);
      const updatedCategories = [...dailyCategories, newCategory];
      
      await setDoc(doc(db, 'settings', 'dailyCategories'), {
        categories: updatedCategories
      }, { merge: true });
      
      setDailyCategories(updatedCategories);
      setNewCategory({ categoryId: '', day: '0' });
    } catch (error) {
      console.error('Kategori eklenirken hata:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCategory = async (index) => {
    try {
      setIsUpdating(true);
      const updatedCategories = dailyCategories.filter((_, i) => i !== index);
      
      // dailyCategories dökümanını güncelle
      await setDoc(doc(db, 'settings', 'dailyCategories'), {
        categories: updatedCategories
      }, { merge: true });
      
      setDailyCategories(updatedCategories);
    } catch (error) {
      console.error('Kategori silinirken hata:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleCampaign = async () => {
    try {
      setIsUpdating(true);
      await updateDoc(doc(db, 'settings', 'campaign'), {
        isActive: !isCampaignActive
      });
    } catch (error) {
      console.error('Error updating campaign status:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const updateCampaignTimes = async () => {
    try {
      setIsUpdating(true);
      const endDate = newEndTime ? new Date(newEndTime) : null;

      await updateDoc(doc(db, 'settings', 'campaign'), {
        endTime: endDate,
        campaignDuration: parseInt(campaignDuration)
      });
    } catch (error) {
      console.error('Error updating campaign times:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className='bg-white shadow rounded-lg p-4 sm:p-6'>
      <h2 className='text-xl sm:text-2xl font-bold mb-6'>Kampanya Kontrol Paneli</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h3 className='text-lg font-semibold mb-2'>Kampanya Durumu</h3>
          <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0'>
            <span className='text-gray-600'>
              {isCampaignActive ? 'Aktif' : 'Pasif'}
            </span>
            <button
              onClick={toggleCampaign}
              disabled={isUpdating}
              className={`w-full sm:w-auto px-4 py-2 rounded-md text-white ${
                isCampaignActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isUpdating ? 'Güncelleniyor...' : isCampaignActive ? 'Durdur' : 'Başlat'}
            </button>
          </div>
        </div>

        <div className='bg-gray-50 p-4 rounded-lg'>
          <h3 className='text-lg font-semibold mb-4'>Kampanya Zamanı</h3>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kampanya Bitiş Zamanı
              </label>
              <input
                type='datetime-local'
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              />
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kampanya Süresi (Saat)
              </label>
              <select
                value={campaignDuration}
                onChange={(e) => setCampaignDuration(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                <option value="1">1 Saat</option>
                <option value="2">2 Saat</option>
                <option value="3">3 Saat</option>
                <option value="4">4 Saat</option>
                <option value="5">5 Saat</option>
                <option value="6">6 Saat</option>
                <option value="12">12 Saat</option>
                <option value="24">24 Saat</option>
              </select>
            </div>
            <button
              onClick={updateCampaignTimes}
              disabled={isUpdating}
              className='w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500'
            >
              {isUpdating ? 'Güncelleniyor...' : 'Zamanları Güncelle'}
            </button>
          </div>
        </div>
      </div>

      <div className='mt-8'>
        <h2 className='text-xl sm:text-2xl font-bold mb-6'>Günlük Kategoriler</h2>
        
        <div className='bg-gray-50 p-4 rounded-lg space-y-4'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Kategori
              </label>
              <select
                value={newCategory.categoryId}
                onChange={(e) => setNewCategory({ ...newCategory, categoryId: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                <option value="">Kategori Seçin</option>
                {allCategories.map(category => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className='block text-sm font-medium text-gray-700 mb-1'>
                Gün
              </label>
              <select
                value={newCategory.day}
                onChange={(e) => setNewCategory({ ...newCategory, day: e.target.value })}
                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500'
              >
                {days.map(day => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleAddCategory}
            disabled={isUpdating || !newCategory.categoryId}
            className='w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50'
          >
            {isUpdating ? 'Ekleniyor...' : 'Kategori Ekle'}
          </button>
        </div>

        <div className='mt-6 space-y-4'>
          {days.map(day => {
            const dayCategories = dailyCategories
              .filter(cat => cat.day === day.value)
              .map(dailyCat => {
                const category = allCategories.find(c => c.id === dailyCat.categoryId);
                return category ? { ...category, ...dailyCat } : null;
              })
              .filter(Boolean);

            if (dayCategories.length === 0) return null;
            
            return (
              <div key={day.value} className='bg-gray-50 p-4 rounded-lg'>
                <h3 className='text-lg font-semibold mb-3'>{day.label}</h3>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                  {dayCategories.map((category, index) => (
                    <div key={index} className='bg-white p-4 rounded-lg shadow-sm'>
                      <div className='flex items-center gap-4'>
                        <img
                          src={category.image}
                          alt={category.name}
                          className='w-16 h-16 object-contain'
                        />
                        <div className='flex-1'>
                          <h4 className='font-medium'>{category.name}</h4>
                          <p className='text-sm text-gray-500'>{category.link}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteCategory(dailyCategories.findIndex(c => c.categoryId === category.id))}
                          className='text-red-500 hover:text-red-700'
                        >
                          Sil
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 