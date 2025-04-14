import React, { useState, useEffect } from 'react';
import { db } from '../../config/firebase';
import { doc, updateDoc, getDoc } from 'firebase/firestore';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    image: null,
    order: 0,
    link: '',
    oldPrice: 0,
    campaignPrice: 0,
    categoryId: '',
    isActive: true
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsDoc, categoriesDoc] = await Promise.all([
          getDoc(doc(db, 'settings', 'products')),
          getDoc(doc(db, 'settings', 'categories'))
        ]);

        if (productsDoc.exists()) {
          setProducts(productsDoc.data().list || []);
        }
        if (categoriesDoc.exists()) {
          setCategories(categoriesDoc.data().list || []);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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

  const addProduct = async () => {
    try {
      if (!newProduct.name || !newProduct.image || !newProduct.categoryId) return;

      const imageUrl = await handleImageUpload(newProduct.image);
      if (!imageUrl) return;

      const updatedProducts = [...products, {
        ...newProduct,
        id: Date.now().toString(),
        image: imageUrl
      }].sort((a, b) => a.order - b.order);

      await updateDoc(doc(db, 'settings', 'products'), {
        list: updatedProducts
      });

      setProducts(updatedProducts);
      setNewProduct({
        name: '',
        image: null,
        order: 0,
        link: '',
        oldPrice: 0,
        campaignPrice: 0,
        categoryId: '',
        isActive: true
      });
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const updateProduct = async (productId, updates) => {
    try {
      const updatedProducts = products.map(product =>
        product.id === productId ? { ...product, ...updates } : product
      );

      await updateDoc(doc(db, 'settings', 'products'), {
        list: updatedProducts
      });

      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      const updatedProducts = products.filter(product => product.id !== productId);
      await updateDoc(doc(db, 'settings', 'products'), {
        list: updatedProducts
      });

      setProducts(updatedProducts);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const startEditing = (product) => {
    setEditingProduct({ ...product });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  const saveEdit = async () => {
    try {
      if (!editingProduct.name || !editingProduct.categoryId) return;

      const updatedProducts = products.map(product =>
        product.id === editingProduct.id ? editingProduct : product
      );

      await updateDoc(doc(db, 'settings', 'products'), {
        list: updatedProducts
      });

      setProducts(updatedProducts);
      setEditingProduct(null);
      setError('Ürün başarıyla güncellendi.');
    } catch (error) {
      console.error('Error updating product:', error);
      setError('Ürün güncellenirken bir hata oluştu.');
    }
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const imageUrl = await handleImageUpload(file);
      if (imageUrl) {
        setEditingProduct({ ...editingProduct, image: imageUrl });
      }
    } catch (error) {
      setError('Resim yüklenirken bir hata oluştu.');
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
        <h2 className="text-2xl font-bold mb-6">Ürün Yönetimi</h2>

        {/* Add New Product Form */}
        <div className="mb-8 p-4 border rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Yeni Ürün Ekle</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ürün Adı</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                className="mt-1 block p-2 outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kategori</label>
              <select
                value={newProduct.categoryId}
                onChange={(e) => setNewProduct({ ...newProduct, categoryId: e.target.value })}
                className="mt-1 block p-2 outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Kategori Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Sıra</label>
              <input
                type="number"
                value={newProduct.order}
                onChange={(e) => setNewProduct({ ...newProduct, order: parseInt(e.target.value) })}
                className="mt-1 block p-2 outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Link</label>
              <input
                type="text"
                value={newProduct.link}
                onChange={(e) => setNewProduct({ ...newProduct, link: e.target.value })}
                className="mt-1 block p-2 outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Eski Fiyat</label>
              <input
                type="number"
                value={newProduct.oldPrice}
                onChange={(e) => setNewProduct({ ...newProduct, oldPrice: parseFloat(e.target.value) })}
                className="mt-1 block p-2 outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Kampanya Fiyatı</label>
              <input
                type="number"
                value={newProduct.campaignPrice}
                onChange={(e) => setNewProduct({ ...newProduct, campaignPrice: parseFloat(e.target.value) })}
                className="mt-1 block p-2 outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Görsel</label>
              <input
                type="file"
                onChange={(e) => setNewProduct({ ...newProduct, image: e.target.files[0] })}
                className="mt-1 block p-2 outline-none w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                accept="image/*"
              />
            </div>
          </div>
          <button
            onClick={addProduct}
            disabled={isUploading}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            {isUploading ? 'Yükleniyor...' : 'Ürün Ekle'}
          </button>
        </div>

        {/* Products List */}
        <div className="space-y-4">
          {products.map((product) => (
            <div key={product.id} className="p-4 border rounded-lg">
              {editingProduct?.id === product.id ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Ürün Adı</label>
                      <input
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kategori</label>
                      <select
                        value={editingProduct.categoryId}
                        onChange={(e) => setEditingProduct({ ...editingProduct, categoryId: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      >
                        <option value="">Kategori Seçin</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sıra</label>
                      <input
                        type="number"
                        value={editingProduct.order}
                        onChange={(e) => setEditingProduct({ ...editingProduct, order: parseInt(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Link</label>
                      <input
                        type="text"
                        value={editingProduct.link}
                        onChange={(e) => setEditingProduct({ ...editingProduct, link: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Eski Fiyat</label>
                      <input
                        type="number"
                        value={editingProduct.oldPrice}
                        onChange={(e) => setEditingProduct({ ...editingProduct, oldPrice: parseFloat(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kampanya Fiyatı</label>
                      <input
                        type="number"
                        value={editingProduct.campaignPrice}
                        onChange={(e) => setEditingProduct({ ...editingProduct, campaignPrice: parseFloat(e.target.value) })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Görsel</label>
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="mt-1 block w-full"
                        accept="image/*"
                      />
                      {editingProduct.image && (
                        <img src={editingProduct.image} alt="Preview" className="mt-2 w-32 h-32 object-cover rounded" />
                      )}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={cancelEditing}
                      className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                    >
                      İptal
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Kaydet
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div>
                      <h4 className="font-medium">{product.name}</h4>
                      <p className="text-sm text-gray-500">
                        Kategori: {categories.find(c => c.id === product.categoryId)?.name || 'Belirtilmemiş'}
                      </p>
                      <p className="text-sm text-gray-500">Sıra: {product.order}</p>
                      <p className="text-sm text-gray-500">Eski Fiyat: {product.oldPrice} TL</p>
                      <p className="text-sm text-gray-500">Kampanya Fiyatı: {product.campaignPrice} TL</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(product)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => updateProduct(product.id, { isActive: !product.isActive })}
                      className={`px-3 py-1 rounded ${
                        product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {product.isActive ? 'Aktif' : 'Pasif'}
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products; 