import React, { useState, useEffect } from 'react';
import { useCampaign } from '../context/CampaignContext';
import Header from '../components/Header';
import Categories from '../components/Categories';
import ProductList from '../components/ProductList';
import Countdown from '../components/Countdown';
import Footer from '../components/Footer';
import CategorySlider from '../components/CategorySlider';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Home = () => {
  const { theme, isLoading } = useCampaign();
  const [videoEmbed, setVideoEmbed] = useState('');
  const [textContent, setTextContent] = useState({
    subtitle: '',
    title: '',
    subheading: '',
    description: '',
  });
  const [homeContent, setHomeContent] = useState({
    videoEmbed: '',
    bannerImage: '',
    isVideoActive: false,
    isBannerActive: true
  });
  const [campaignInfo, setCampaignInfo] = useState({
    endTime: null,
    campaignDuration: 6,
    isActive: false,
  });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const [homeDoc, textDoc, campaignDoc] = await Promise.all([
          getDoc(doc(db, 'settings', 'home')),
          getDoc(doc(db, 'settings', 'text')),
          getDoc(doc(db, 'settings', 'campaign')),
        ]);

        if (homeDoc.exists()) {
          setHomeContent(homeDoc.data());
        }
        if (textDoc.exists()) {
          setTextContent(textDoc.data());
        }
        if (campaignDoc.exists()) {
          const data = campaignDoc.data();
          let endTimeDate = null;
          if (data.endTime && data.endTime.seconds) {
            endTimeDate = new Date(data.endTime.seconds * 1000);
          }
          setCampaignInfo({
            endTime: endTimeDate,
            campaignDuration: data.campaignDuration || 6,
            isActive: data.isActive || false,
          });
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      }
    };

    fetchContent();
  }, []);

  useEffect(() => {
    const checkCampaignStatus = () => {
      if (!campaignInfo.endTime) {
        return;
      }

      

      if (!campaignInfo.isActive) {
        setIsActive(false);
        return;
      }

      const now = new Date();

      if (!(campaignInfo.endTime instanceof Date) || isNaN(campaignInfo.endTime)) {
        console.error('Invalid end time:', campaignInfo.endTime);
        return;
      }


      const timeUntilEnd = campaignInfo.endTime - now;

      if (timeUntilEnd <= 0) {
        const timeSinceEnd = Math.abs(timeUntilEnd);
        const hoursSinceEnd = timeSinceEnd / (1000 * 60 * 60);

        const shouldBeActive = hoursSinceEnd < campaignInfo.campaignDuration;
        setIsActive(shouldBeActive);
      } else {
        setIsActive(false);
      }
    };

    checkCampaignStatus();

    const interval = setInterval(checkCampaignStatus, 1000);
    return () => clearInterval(interval);
  }, [campaignInfo]);

  if (isLoading) {
    return (
      <div className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-teal-400 to-[#1a1a1a]'>
        <div className='space-y-8 text-center'>
          <img src='/logo.webp' alt='Logo' className='h-auto w-32 animate-pulse lg:w-48' />
          <div className='flex items-center justify-center space-x-2'>
            <div
              className='h-3 w-3 animate-bounce rounded-full bg-green-500'
              style={{ animationDelay: '0ms' }}
            />
            <div
              className='h-3 w-3 animate-bounce rounded-full bg-green-500'
              style={{ animationDelay: '150ms' }}
            />
            <div
              className='h-3 w-3 animate-bounce rounded-full bg-green-500'
              style={{ animationDelay: '300ms' }}
            />
          </div>
          <p className='text-sm text-gray-400 lg:text-base'>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className='min-h-screen bg-gradient-to-b'
      style={{ backgroundColor: theme.backgroundColor, color: theme.textColor }}
    >
      <Header />
      <main className='container mx-auto px-4 py-8'>
        <div className='space-y-4 text-center lg:space-y-4'>
          <p className='teko text-sm lg:mb-2 lg:text-6xl'>
            {textContent.subtitle || "Oyuncular her Cuma incehesap.com'da buluşuyor"}
          </p>
          <h1 className='anton bg-gradient-to-r from-green-500 via-lime-500 to-green-500 bg-clip-text text-3xl text-transparent lg:text-9xl'>
            {textContent.title || 'GAMING GECESi'}
          </h1>
          <h2 className='rowdies text-xl lg:text-5xl'>
            {textContent.subheading || 'Kampanya Başlıyor!'}
          </h2>
          <h3 className='shadows-into-light text-lg lg:text-4xl'>
            {textContent.description || "#GamingGecesi'nin Bomba Ürünlerini Kaçırmadan Al"}
          </h3>
        </div>

        {isActive ? (
          <Countdown targetDate={campaignInfo.endTime} />
        ) : (
          <div className="mt-8">
            <CategorySlider />
          </div>
        )}

        <div className='relative mx-auto mt-5 aspect-video w-full max-w-[1250px]'>
          {homeContent.isVideoActive && homeContent.videoEmbed && (
            <iframe
              src={homeContent.videoEmbed}
              title='pazaroyun.com Bilgisayardan Kullanım Videosu'
              className='h-full w-full rounded-2xl border-2 border-white/40'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share'
              referrerPolicy='strict-origin-when-cross-origin'
              allowFullScreen
            />
          )}
          {homeContent.isBannerActive && homeContent.bannerImage && (
            <img
              src={homeContent.bannerImage}
              alt='Banner'
              className='h-full w-full rounded-2xl border-2 border-white/40 object-cover'
            />
          )}
        </div>

        {isActive ? <ProductList /> : <Categories />}
      </main>
      <Footer />
    </div>
  );
};

export default Home;
