import React, { useState } from 'react';
import { db } from '../../config/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const Settings = () => {
  const [settings, setSettings] = useState({
    startTime: '',
    endTime: '',
    theme: {
      backgroundColor: '#000000',
      textColor: '#ffffff',
      primaryColor: '#10B981',
      secondaryColor: '#059669'
    }
  });

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleThemeChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        [name]: value
      }
    }));
  };

  const saveSettings = async () => {
    try {
      const [startHours, startMinutes] = settings.startTime.split(':');
      const [endHours, endMinutes] = settings.endTime.split(':');

      const now = new Date();
      const startTime = new Date(now);
      startTime.setHours(parseInt(startHours), parseInt(startMinutes), 0, 0);

      const endTime = new Date(now);
      endTime.setHours(parseInt(endHours), parseInt(endMinutes), 0, 0);

      if (endTime < startTime) {
        endTime.setDate(endTime.getDate() + 1);
      }

      await updateDoc(doc(db, 'settings', 'campaign'), {
        startTime,
        endTime,
        theme: settings.theme
      });

      alert('Ayarlar başarıyla kaydedildi!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Ayarlar kaydedilirken bir hata oluştu!');
    }
  };

  return (
    <div className='bg-white shadow rounded-lg p-6'>
      <h2 className='text-2xl font-bold mb-6'>Kampanya Ayarları</h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
        {/* Time Settings */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Zaman Ayarları</h3>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Başlangıç Saati</label>
            <input
              type='time'
              name='startTime'
              value={settings.startTime}
              onChange={handleTimeChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Bitiş Saati</label>
            <input
              type='time'
              name='endTime'
              value={settings.endTime}
              onChange={handleTimeChange}
              className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            />
          </div>
        </div>

        {/* Theme Settings */}
        <div className='space-y-4'>
          <h3 className='text-lg font-semibold'>Tema Ayarları</h3>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Arka Plan Rengi</label>
            <input
              type='color'
              name='backgroundColor'
              value={settings.theme.backgroundColor}
              onChange={handleThemeChange}
              className='mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Yazı Rengi</label>
            <input
              type='color'
              name='textColor'
              value={settings.theme.textColor}
              onChange={handleThemeChange}
              className='mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>Ana Renk</label>
            <input
              type='color'
              name='primaryColor'
              value={settings.theme.primaryColor}
              onChange={handleThemeChange}
              className='mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            />
          </div>
          <div>
            <label className='block text-sm font-medium text-gray-700'>İkincil Renk</label>
            <input
              type='color'
              name='secondaryColor'
              value={settings.theme.secondaryColor}
              onChange={handleThemeChange}
              className='mt-1 block w-full h-10 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500'
            />
          </div>
        </div>
      </div>

      <div className='mt-6'>
        <button
          onClick={saveSettings}
          className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
        >
          Ayarları Kaydet
        </button>
      </div>
    </div>
  );
};

export default Settings; 