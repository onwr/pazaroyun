import React, { useState } from 'react';
import { useCampaign } from '../../context/CampaignContext';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Dashboard = () => {
  const { isCampaignActive, endTime } = useCampaign();
  const [isUpdating, setIsUpdating] = useState(false);
  const [newEndTime, setNewEndTime] = useState(endTime ? new Date(endTime).toISOString().slice(0, 16) : '');
  const [campaignDuration, setCampaignDuration] = useState('6'); // Varsayılan 6 saat

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
    </div>
  );
};

export default Dashboard; 