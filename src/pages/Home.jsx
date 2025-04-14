import React, { useState, useEffect } from 'react';
import { useCampaign } from '../context/CampaignContext';
import Header from '../components/Header';
import Categories from '../components/Categories';
import Countdown from '../components/Countdown';
import Footer from '../components/Footer';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const { isCampaignActive, theme, isLoading } = useCampaign();
  const [videoEmbed, setVideoEmbed] = useState('');
  const [textContent, setTextContent] = useState({
    subtitle: '',
    title: '',
    subheading: '',
    description: ''
  });

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [homeDoc, textDoc] = await Promise.all([
          getDoc(doc(db, 'settings', 'home')),
          getDoc(doc(db, 'settings', 'text'))
        ]);

        if (homeDoc.exists()) {
          setVideoEmbed(homeDoc.data().videoEmbed || '');
        }
        if (textDoc.exists()) {
          setTextContent(textDoc.data());
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  if (isLoading) {
    return (
      <div className='min-h-screen bg-gradient-to-b from-teal-400 to-[#1a1a1a] flex flex-col items-center justify-center'>
        <div className='text-center space-y-8'>
          <img src='/logo.webp' alt='Logo' className='w-32 lg:w-48 h-auto animate-pulse' />
          <div className='flex items-center justify-center space-x-2'>
            <div className='w-3 h-3 bg-green-500 rounded-full animate-bounce' style={{ animationDelay: '0ms' }} />
            <div className='w-3 h-3 bg-green-500 rounded-full animate-bounce' style={{ animationDelay: '150ms' }} />
            <div className='w-3 h-3 bg-green-500 rounded-full animate-bounce' style={{ animationDelay: '300ms' }} />
          </div>
          <p className='text-gray-400 text-sm lg:text-base'>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gradient-to-b ' style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}>
      <Header />
      <main className='container mx-auto px-4 py-8'>
        <div className='space-y-4 text-center lg:space-y-4'>
          <p className='text-sm lg:mb-2 lg:text-2xl'>
            {textContent.subtitle || "Oyuncular her Cuma incehesap.com'da buluşuyor"}
          </p>
          <h1 className='font-display bg-gradient-to-r from-green-500 via-lime-500 to-green-500 bg-clip-text text-3xl text-transparent lg:text-9xl'>
            {textContent.title || 'GAMING GECESi'}
          </h1>
          <h2 className='font-display text-xl lg:text-5xl'>
            {textContent.subheading || 'Her Cuma Saat 22:00'}
          </h2>
          <h3 className='text-lg lg:text-2xl'>
            {textContent.description || "#GamingGecesi'nin Bomba Ürünlerini Kaçırmadan Al"}
          </h3>
        </div>

        <Countdown />

        <div className='relative mx-auto aspect-video w-full max-w-[1250px]'>
          {videoEmbed && (
            <iframe
              src={videoEmbed}
              title='pazaroyun.com Bilgisayardan Kullanım Videosu'
              className='h-full w-full rounded-2xl border-2 border-white/40'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen
            />
          )}
        </div>

        {isCampaignActive && <Categories />}
      </main>
      <Footer />
    </div>
  );
};

export default Home;