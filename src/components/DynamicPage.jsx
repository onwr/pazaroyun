import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

export const DynamicPage = () => {
  const { slug } = useParams();
  const [pageData, setPageData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPage = async () => {
      try {
        const docRef = doc(db, 'pages', slug);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setPageData(docSnap.data());
        } else {
          setError('Sayfa bulunamadı');
        }
      } catch (error) {
        console.error('Sayfa yüklenirken hata:', error);
        setError('Sayfa yüklenirken bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPage();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600 text-center">
          <h1 className="text-2xl font-bold mb-2">Hata</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!pageData?.isPublished) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600 text-center">
          <h1 className="text-2xl font-bold mb-2">Sayfa Yayında Değil</h1>
          <p>Bu sayfa henüz yayınlanmamış.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#0a0a0a]'>
      <div className='container mx-auto flex items-center justify-center  px-4 py-8'>
        <div
          className='prose prose-lg max-w-none'
          dangerouslySetInnerHTML={{ __html: pageData.content }}
        />
      </div>
    </div>
  );
};

export default DynamicPage; 