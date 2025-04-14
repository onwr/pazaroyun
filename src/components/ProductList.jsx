import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [categories, setCategories] = useState([]);

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

  const filteredProducts = selectedCategory === 'all'
    ? products.filter(product => product.isActive)
    : products.filter(product => product.categoryId === selectedCategory && product.isActive);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category.id
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <div className="relative aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.oldPrice && product.campaignPrice && (
                <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                  %{Math.round((1 - product.campaignPrice / product.oldPrice) * 100)}
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                {product.name}
              </h3>
              <div className="flex items-center justify-between">
                <div>
                  {product.oldPrice && product.campaignPrice ? (
                    <>
                      <span className="text-gray-400 line-through mr-2">
                        {product.oldPrice} TL
                      </span>
                      <span className="text-green-500 font-bold">
                        {product.campaignPrice} TL
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-800 font-bold">
                      {product.oldPrice || product.campaignPrice} TL
                    </span>
                  )}
                </div>
                <a
                  href={product.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  İncele
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Bu kategoride ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList; 