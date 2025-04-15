import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Editor } from '@tinymce/tinymce-react';
import { db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export const PageEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pageData, setPageData] = useState({
    title: '',
    slug: '',
    content: '',
    isPublished: false
  });
  
  const editorRef = useRef(null);
  
  useEffect(() => {
    const fetchPage = async () => {
      if (id) {
        try {
          const docRef = doc(db, 'pages', id);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            setPageData(docSnap.data());
          } else {
            console.error('Sayfa bulunamadı');
            navigate('/pazaroyunadmin/pages');
          }
        } catch (error) {
          console.error('Sayfa yüklenirken hata:', error);
          navigate('/pazaroyunadmin/pages');
        }
      }
    };

    fetchPage();
  }, [id, navigate]);
  
  const handleSave = async () => {
    try {
      const docRef = doc(db, 'pages', id || pageData.slug);
      await setDoc(docRef, {
        ...pageData,
        updatedAt: new Date().toISOString(),
      });
      alert('Sayfa başarıyla kaydedildi!');
      navigate('/pazaroyunadmin/pages');
    } catch (error) {
      console.error('Sayfa kaydedilirken hata:', error);
      alert('Sayfa kaydedilirken bir hata oluştu!');
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <img src="/logo.webp" alt="" className='w-60 bg-black p-4 rounded-2xl h-auto' />
      <div className="flex flex-col space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Sayfa Başlığı</label>
          <input
            type="text"
            value={pageData.title}
            onChange={(e) => setPageData({ ...pageData, title: e.target.value })}
            className="mt-1 p-2 outline-none block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Sayfa başlığını girin"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Sayfa URL'si</label>
          <div className="mt-1 flex rounded-md shadow-sm">
            <span className="inline-flex p-2 items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
              /
            </span>
            <input
              type="text"
              value={pageData.slug}
              onChange={(e) => setPageData({ ...pageData, slug: e.target.value })}
              className="block w-full p-2 outline-none flex-1 rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="sayfa-url"
              disabled={!!id}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sayfa İçeriği</label>
          <Editor
            apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
            onInit={(evt, editor) => editorRef.current = editor}
            value={pageData.content}
            onEditorChange={(content) => setPageData({ ...pageData, content })}
            init={{
              height: 500,
              menubar: true,
              plugins: [
                'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount',
                'emoticons', 'template'
              ],
              toolbar: 'undo redo | blocks | ' +
                'bold italic forecolor | alignleft aligncenter ' +
                'alignright alignjustify | bullist numlist outdent indent | ' +
                'removeformat | image media link emoticons | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={pageData.isPublished}
              onChange={(e) => setPageData({ ...pageData, isPublished: e.target.checked })}
              className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-600">Yayınla</span>
          </label>
          
          <button
            onClick={handleSave}
            className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            {id ? 'Güncelle' : 'Kaydet'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PageEditor; 