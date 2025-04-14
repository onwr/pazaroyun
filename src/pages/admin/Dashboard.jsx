import React, { useState } from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Dashboard = () => {
  const { isCampaignActive, startTime, endTime } = useCampaign();
  const [isUpdating, setIsUpdating] = useState(false);

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

  return (
    <div className='bg-white shadow rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-6'>Kampanya Kontrol Paneli</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        <div className='bg-gray-50 p-4 rounded-lg'>
          <h3 className='text-lg font-semibold mb-2'>Kampanya Durumu</h3>
          <div className='flex items-center justify-between'>
            <span className='text-gray-600'>
              {isCampaignActive ? 'Aktif' : 'Pasif'}
            </span>
            <button
              onClick={toggleCampaign}
              disabled={isUpdating}
              className={`px-4 py-2 rounded-md text-white ${
                isCampaignActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
              }`}
            >
              {isUpdating ? 'Güncelleniyor...' : isCampaignActive ? 'Durdur' : 'Başlat'}
            </button>
          </div>
        </div>

        <div className='bg-gray-50 p-4 rounded-lg'>
          <h3 className='text-lg font-semibold mb-2'>Kampanya Zamanı</h3>
          <div className='space-y-2'>
            <div>
              <span className='text-gray-600'>Başlangıç:</span>{' '}
              <span className='font-medium'>{startTime?.toLocaleString() || 'Belirlenmedi'}</span>
            </div>
            <div>
              <span className='text-gray-600'>Bitiş:</span>{' '}
              <span className='font-medium'>{endTime?.toLocaleString() || 'Belirlenmedi'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 