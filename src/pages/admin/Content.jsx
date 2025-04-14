import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const Content = () => {
  const [homeContent, setHomeContent] = useState({
    videoEmbed: ''
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
        videoEmbed: homeContent.videoEmbed
      });
    } catch (error) {
      console.error('Error updating video embed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextContentUpdate = async () => {
    try {
      setIsLoading(true);
      await updateDoc(doc(db, 'settings', 'text'), textContent);
    } catch (error) {
      console.error('Error updating text content:', error);
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
    } catch (error) {
      console.error('Error updating footer content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Yükleniyor...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
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

        {/* Video Embed Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Video Embed</h2>
          <div className="space-y-4">
            <input
              type="text"
              value={homeContent.videoEmbed}
              onChange={(e) => setHomeContent({ videoEmbed: e.target.value })}
              placeholder="YouTube video embed URL"
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleVideoEmbedUpdate}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Video Embed'i Güncelle
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