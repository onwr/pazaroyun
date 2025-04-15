import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { db } from '../config/firebase';
import { collection, query, getDocs, deleteDoc, doc } from 'firebase/firestore';

export const PageList = () => {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPages = async () => {
    try {
      const q = query(collection(db, 'pages'));
      const querySnapshot = await getDocs(q);
      const pagesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setPages(pagesData);
    } catch (error) {
      console.error('Sayfalar yüklenirken hata:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleDelete = async (pageId) => {
    if (window.confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) {
      try {
        await deleteDoc(doc(db, 'pages', pageId));
        await fetchPages(); // Listeyi yenile
        alert('Sayfa başarıyla silindi!');
      } catch (error) {
        console.error('Sayfa silinirken hata:', error);
        alert('Sayfa silinirken bir hata oluştu!');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Sayfalar</h1>
        <Link
          to="/pazaroyunadmin/pages/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Yeni Sayfa
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Başlık
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                URL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Durum
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Son Güncelleme
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                İşlemler
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{page.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-500">/{page.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    page.isPublished
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {page.isPublished ? 'Yayında' : 'Taslak'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(page.updatedAt).toLocaleDateString('tr-TR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    to={`/pazaroyunadmin/pages/edit/${page.id}`}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    Düzenle
                  </Link>
                  <button
                    onClick={() => handleDelete(page.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PageList; 