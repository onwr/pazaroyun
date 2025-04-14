import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    name: '',
    image: null,
    order: 0,
    link: '',
    isActive: true
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const docRef = doc(db, 'settings', 'categories');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCategories(docSnap.data().list || []);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
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
      setError(error.message);
      return null;
    }
  };

  const addCategory = async () => {
    try {
      if (!newCategory.name || !newCategory.image) return;

      const imageUrl = await handleImageUpload(newCategory.image);
      if (!imageUrl) return;

      const updatedCategories = [...categories, {
        ...newCategory,
        id: Date.now().toString(),
        image: imageUrl
      }].sort((a, b) => a.order - b.order);

      await updateDoc(doc(db, 'settings', 'categories'), {
        list: updatedCategories
      });

      setCategories(updatedCategories);
      setNewCategory({
        name: '',
        image: null,
        order: 0,
        link: '',
        isActive: true
      });
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (categoryId, updates) => {
    try {
      const updatedCategories = categories.map(category =>
        category.id === categoryId ? { ...category, ...updates } : category
      );

      await updateDoc(doc(db, 'settings', 'categories'), {
        list: updatedCategories
      });

      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      const updatedCategories = categories.filter(category => category.id !== categoryId);
      await updateDoc(doc(db, 'settings', 'categories'), {
        list: updatedCategories
      });

      setCategories(updatedCategories);
    } catch (error) {
      console.error('Error deleting category:', error);
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
        <h2 className="text-2xl font-bold mb-6">Kategori Yönetimi</h2>

        {/* Add New Category Form */}
        <div className="mb-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Yeni Kategori Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori Adı</label>
              <input
                type="text"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="mt-1 p-2 outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sıra</label>
              <input
                type="number"
                value={newCategory.order}
                onChange={(e) => setNewCategory({ ...newCategory, order: parseInt(e.target.value) })}
                className="mt-1 p-2 outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input
                type="text"
                value={newCategory.link}
                onChange={(e) => setNewCategory({ ...newCategory, link: e.target.value })}
                className="mt-1 p-2 outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Görsel</label>
              <input
                type="file"
                onChange={(e) => setNewCategory({ ...newCategory, image: e.target.files[0] })}
                className="mt-1 p-2 outline-none block w-full"
                accept="image/*"
              />
            </div>
          </div>
          <button
            onClick={addCategory}
            disabled={isUploading}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {isUploading ? 'Yükleniyor...' : 'Kategori Ekle'}
          </button>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.map((category) => (
            <div key={category.id} className="p-4 border rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img src={category.image} alt={category.name} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h4 className="font-medium">{category.name}</h4>
                  <p className="text-sm text-gray-500">Sıra: {category.order}</p>
                  <p className="text-sm text-gray-500">{category.link}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateCategory(category.id, { isActive: !category.isActive })}
                  className={`px-3 py-1 rounded ${
                    category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}
                >
                  {category.isActive ? 'Aktif' : 'Pasif'}
                </button>
                <button
                  onClick={() => deleteCategory(category.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories; 