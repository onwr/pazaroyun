import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const Content = () => {
  const [homeContent, setHomeContent] = useState({
    videoEmbed: '',
    bannerImage: '',
    isVideoActive: false,
    isBannerActive: true
  });
  const [textContent, setTextContent] = useState({
    subtitle: '',
    title: '',
    subheading: '',
    description: ''
  });
  const [footerContent, setFooterContent] = useState({
    conditions: []
  });
  const [newCondition, setNewCondition] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setIsLoading(true);
        const [homeDoc, textDoc, footerDoc] = await Promise.all([
          getDoc(doc(db, 'settings', 'home')),
          getDoc(doc(db, 'settings', 'text')),
          getDoc(doc(db, 'settings', 'footer'))
        ]);

        if (homeDoc.exists()) {
          setHomeContent(homeDoc.data());
        }
        if (textDoc.exists()) {
          setTextContent(textDoc.data());
        }
        if (footerDoc.exists()) {
          setFooterContent(footerDoc.data());
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        setError('İçerik yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleVideoEmbedUpdate = async () => {
    try {
      setIsLoading(true);
      await updateDoc(doc(db, 'settings', 'home'), {
        ...homeContent,
        isVideoActive: true,
        isBannerActive: false
      });
      setError('Video başarıyla güncellendi ve aktif edildi.');
    } catch (error) {
      console.error('Error updating video embed:', error);
      setError('Video güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBannerUpdate = async () => {
    try {
      setIsLoading(true);
      await updateDoc(doc(db, 'settings', 'home'), {
        ...homeContent,
        isVideoActive: false,
        isBannerActive: true
      });
      setError('Banner başarıyla güncellendi ve aktif edildi.');
    } catch (error) {
      console.error('Error updating banner:', error);
      setError('Banner güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextContentUpdate = async () => {
    try {
      setIsLoading(true);
      await updateDoc(doc(db, 'settings', 'text'), textContent);
      setError('Metin içerikleri başarıyla güncellendi.');
    } catch (error) {
      console.error('Error updating text content:', error);
      setError('Metin içerikleri güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCondition = () => {
    if (!newCondition.trim()) return;
    setFooterContent(prev => ({
      conditions: [...prev.conditions, newCondition.trim()]
    }));
    setNewCondition('');
  };

  const handleRemoveCondition = (index) => {
    setFooterContent(prev => ({
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  const handleFooterContentUpdate = async () => {
    try {
      setIsLoading(true);
      await updateDoc(doc(db, 'settings', 'footer'), {
        conditions: footerContent.conditions
      });
      setError('Kampanya koşulları başarıyla güncellendi.');
    } catch (error) {
      console.error('Error updating footer content:', error);
      setError('Kampanya koşulları güncellenirken bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {error && (
          <div className={`p-4 rounded ${
            error.includes('başarıyla') 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}

        {/* Video & Banner Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Video ve Banner Yönetimi</h2>
          <div className="space-y-6">
            {/* Video Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Video Ayarları</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Video Embed Linki</label>
                  <input
                    type="text"
                    value={homeContent.videoEmbed}
                    onChange={(e) => setHomeContent({ ...homeContent, videoEmbed: e.target.value })}
                    placeholder="YouTube video embed URL"
                    className="mt-1 block w-full p-2 border rounded"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleVideoEmbedUpdate}
                    className={`px-4 py-2 rounded-md text-white ${
                      homeContent.isVideoActive
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {homeContent.isVideoActive ? 'Video Aktif' : 'Videoyu Aktif Et'}
                  </button>
                  <span className="text-sm text-gray-500">
                    {homeContent.isVideoActive ? 'Video şu anda aktif' : 'Video şu anda pasif'}
                  </span>
                </div>
              </div>
            </div>

            {/* Banner Section */}
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">Banner Ayarları</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Banner Görsel Linki</label>
                  <input
                    type="text"
                    value={homeContent.bannerImage}
                    onChange={(e) => setHomeContent({ ...homeContent, bannerImage: e.target.value })}
                    placeholder="Banner görsel URL"
                    className="mt-1 block w-full p-2 border rounded"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleBannerUpdate}
                    className={`px-4 py-2 rounded-md text-white ${
                      homeContent.isBannerActive
                        ? 'bg-green-500 hover:bg-green-600'
                        : 'bg-gray-500 hover:bg-gray-600'
                    }`}
                  >
                    {homeContent.isBannerActive ? 'Banner Aktif' : 'Bannerı Aktif Et'}
                  </button>
                  <span className="text-sm text-gray-500">
                    {homeContent.isBannerActive ? 'Banner şu anda aktif' : 'Banner şu anda pasif'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Metin İçerikleri</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Alt Başlık</label>
              <input
                type="text"
                value={textContent.subtitle}
                onChange={(e) => setTextContent({ ...textContent, subtitle: e.target.value })}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Ana Başlık</label>
              <input
                type="text"
                value={textContent.title}
                onChange={(e) => setTextContent({ ...textContent, title: e.target.value })}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Alt Başlık 2</label>
              <input
                type="text"
                value={textContent.subheading}
                onChange={(e) => setTextContent({ ...textContent, subheading: e.target.value })}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Açıklama</label>
              <input
                type="text"
                value={textContent.description}
                onChange={(e) => setTextContent({ ...textContent, description: e.target.value })}
                className="mt-1 block w-full p-2 border rounded"
              />
            </div>
            <button
              onClick={handleTextContentUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Metin İçeriklerini Güncelle
            </button>
          </div>
        </div>

        {/* Campaign Conditions Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Kampanya Koşulları</h2>
          <div className="space-y-4">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                placeholder="Yeni koşul ekle"
                className="flex-1 p-2 border rounded"
              />
              <button
                onClick={handleAddCondition}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Ekle
              </button>
            </div>
            <ul className="space-y-2">
              {footerContent.conditions.map((condition, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <span className="flex-1">{condition}</span>
                  <button
                    onClick={() => handleRemoveCondition(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Sil
                  </button>
                </li>
              ))}
            </ul>
            <button
              onClick={handleFooterContentUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Koşulları Güncelle
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content; 