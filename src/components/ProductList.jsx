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

  const activeCategories = categories.filter(category => 
    products.some(product => product.categoryId === category.id && product.isActive)
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500" />
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8'>
        <div className='grid grid-cols-2 justify-center gap-2 md:flex md:flex-wrap'>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tümü
          </button>
          {activeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
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

      <div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className='overflow-hidden rounded-xl bg-white/10 shadow-lg transition-shadow duration-300 hover:shadow-xl'
          >
            <div className='relative aspect-square'>
              <img src={product.image} alt={product.name} className='h-full w-full object-cover' />
              {product.oldPrice && product.campaignPrice && (
                <div className='absolute top-4 right-4 rounded-full bg-red-500 px-3 py-1 text-sm font-bold text-white'>
                  -%{Math.round((1 - product.campaignPrice / product.oldPrice) * 100)}
                </div>
              )}
              <div className='absolute right-5 bottom-5 rounded-lg bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm'>
                {product.oldPrice && product.campaignPrice ? (
                  <div className='flex flex-col items-end'>
                    <span className='text-[#eb1219] text-sm line-through'>
                      {product.oldPrice} TL
                    </span>
                    <span className='text-lg font-bold text-green-500'>
                      {product.campaignPrice} TL
                    </span>
                  </div>
                ) : (
                  <span className='text-lg font-bold text-gray-800'>
                    {product.oldPrice || product.campaignPrice} TL
                  </span>
                )}
              </div>
            </div>
            <div className='flex items-center justify-between p-4'>
              <h3 className='mb-2 line-clamp-2 text-lg font-semibold text-gray-50'>
                {product.name}
              </h3>
              <a
                href={product.link}
                target='_blank'
                rel='noopener noreferrer'
                className='rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600'
              >
                İncele
              </a>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className='py-12 text-center'>
          <p className='text-gray-500'>Bu kategoride ürün bulunamadı.</p>
        </div>
      )}
    </div>
  );
};

export default ProductList; 