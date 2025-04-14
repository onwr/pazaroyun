import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const Header = () => {
  const [headerContent, setHeaderContent] = useState({
    logo: '',
    backgroundImage: ''
  });
  const [tempContent, setTempContent] = useState({
    logo: null,
    backgroundImage: null
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHeaderContent = async () => {
      try {
        const docRef = doc(db, 'settings', 'header');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setHeaderContent(docSnap.data());
        } else {
          const defaultContent = {
            logo: '/logo.webp',
            backgroundImage: '/images/bg.webp'
          };
          await updateDoc(doc(db, 'settings', 'header'), defaultContent);
          setHeaderContent(defaultContent);
        }
      } catch (error) {
        console.error('Error fetching header content:', error);
        setError('İçerik yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeaderContent();
  }, []);

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('key', import.meta.env.VITE_IMGBB_API_KEY);

      const response = await fetch('https://api.imgbb.com/1/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Resim yüklenemedi');
      }

      const data = await response.json();
      return data.data.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTempContent({ ...tempContent, logo: file });
    setError(null);
  };

  const handleBackgroundChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setTempContent({ ...tempContent, backgroundImage: file });
    setError(null);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      const updatedContent = { ...headerContent };

      if (tempContent.logo) {
        const logoUrl = await handleImageUpload(tempContent.logo);
        updatedContent.logo = logoUrl;
      }

      if (tempContent.backgroundImage) {
        const backgroundUrl = await handleImageUpload(tempContent.backgroundImage);
        updatedContent.backgroundImage = backgroundUrl;
      }

      await updateDoc(doc(db, 'settings', 'header'), updatedContent);
      setHeaderContent(updatedContent);
      setTempContent({ logo: null, backgroundImage: null });
      setError('Değişiklikler başarıyla kaydedildi.');
    } catch (error) {
      console.error('Error saving header content:', error);
      setError(error.message);
    } finally {
      setIsSaving(false);
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
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Header Yönetimi</h2>
          <button
            onClick={handleSave}
            disabled={isSaving || (!tempContent.logo && !tempContent.backgroundImage)}
            className={`px-4 py-2 rounded-md text-white font-medium ${
              isSaving || (!tempContent.logo && !tempContent.backgroundImage)
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </div>

        {error && (
          <div className={`mb-4 p-4 rounded ${
            error.includes('başarıyla') 
              ? 'bg-green-100 border border-green-400 text-green-700'
              : 'bg-red-100 border border-red-400 text-red-700'
          }`}>
            {error}
          </div>
        )}

        <div className="space-y-6">
          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Logo</h3>
            <div className="flex items-center space-x-4">
              <img 
                src={headerContent.logo} 
                alt="Current Logo" 
                className="w-32 h-32 object-contain border rounded"
              />
              <div>
                <input
                  type="file"
                  onChange={handleLogoChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Önerilen boyut: 200x200px
                </p>
                {tempContent.logo && (
                  <p className="mt-2 text-sm text-green-600">
                    Yeni logo seçildi, kaydetmek için "Kaydet" butonuna tıklayın.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold mb-4">Arkaplan Görseli</h3>
            <div className="flex items-center space-x-4">
              <img 
                src={headerContent.backgroundImage} 
                alt="Current Background" 
                className="w-64 h-32 object-cover border rounded"
              />
              <div>
                <input
                  type="file"
                  onChange={handleBackgroundChange}
                  accept="image/*"
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-green-50 file:text-green-700
                    hover:file:bg-green-100"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Önerilen boyut: 1920x1080px
                </p>
                {tempContent.backgroundImage && (
                  <p className="mt-2 text-sm text-green-600">
                    Yeni arkaplan seçildi, kaydetmek için "Kaydet" butonuna tıklayın.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header; 