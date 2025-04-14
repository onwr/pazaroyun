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
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Ayarlar</h1>

      {/* Campaign Settings */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Kampanya Ayarları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kampanya Bitiş Tarihi
            </label>
            <input
              type="datetime-local"
              value={settings.endTime}
              onChange={handleTimeChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Kampanya Süresi (Saat)
            </label>
            <input
              type="number"
              value={settings.campaignDuration}
              onChange={(e) => setSettings({ ...settings, campaignDuration: parseInt(e.target.value) })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="isActive"
            checked={settings.isActive}
            onChange={(e) => setSettings({ ...settings, isActive: e.target.checked })}
            className="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
          />
          <label
            htmlFor="isActive"
            className="ml-2 block text-sm text-gray-700"
          >
            Kampanya Aktif
          </label>
        </div>
      </div>

      {/* Theme Settings */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Tema Ayarları</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Arka Plan Rengi</label>
          <input
            type="color"
            name="backgroundColor"
            value={settings.theme.backgroundColor}
            onChange={handleThemeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Yazı Rengi</label>
          <input
            type="color"
            name="textColor"
            value={settings.theme.textColor}
            onChange={handleThemeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ana Renk</label>
          <input
            type="color"
            name="primaryColor"
            value={settings.theme.primaryColor}
            onChange={handleThemeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">İkincil Renk</label>
          <input
            type="color"
            name="secondaryColor"
            value={settings.theme.secondaryColor}
            onChange={handleThemeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Social Media Settings */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">Sosyal Medya Ayarları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Instagram
            </label>
            <input
              type="text"
              value={settings.socialMedia.instagram}
              onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, instagram: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Facebook
            </label>
            <input
              type="text"
              value={settings.socialMedia.facebook}
              onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, facebook: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Twitter
            </label>
            <input
              type="text"
              value={settings.socialMedia.twitter}
              onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, twitter: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              YouTube
            </label>
            <input
              type="text"
              value={settings.socialMedia.youtube}
              onChange={(e) => setSettings({ ...settings, socialMedia: { ...settings.socialMedia, youtube: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Contact Settings */}
      <div className="bg-white rounded-xl shadow-sm p-4 space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">İletişim Ayarları</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              E-posta
            </label>
            <input
              type="email"
              value={settings.contact.email}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, email: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              value={settings.contact.phone}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, phone: e.target.value } })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adres
            </label>
            <textarea
              value={settings.contact.address}
              onChange={(e) => setSettings({ ...settings, contact: { ...settings.contact, address: e.target.value } })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-auto">
        <button
          onClick={saveSettings}
          className="w-full sm:w-auto px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-lg"
        >
          Değişiklikleri Kaydet
        </button>
      </div>
    </div>
  );
};

export default Settings; 