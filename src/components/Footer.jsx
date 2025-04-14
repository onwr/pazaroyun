import React, { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const Footer = () => {
  const [campaignConditions, setCampaignConditions] = useState([]);

  useEffect(() => {
    const fetchCampaignConditions = async () => {
      try {
        const docRef = doc(db, 'settings', 'footer');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setCampaignConditions(docSnap.data().conditions || []);
        }
      } catch (error) {
        console.error('Error fetching campaign conditions:', error);
      }
    };

    fetchCampaignConditions();
  }, []);

  return (
    <div className='container pb-10 mx-auto px-4'>
      <a href='https://pazaroyun.com' className='py-5'>
        <a
          href='https://pazaroyun.com'
          className='flex items-center justify-center transition-opacity hover:opacity-90'
        >
          <img src='/logo.webp' alt='' className='w-32 lg:w-[144.22px] h-auto' />
        </a>

        <div className='text-center text-gray-500 text-sm lg:text-base'>Anasayfaya git</div>
      </a>
      <div className='prose prose-stone prose-li:leading-none max-w-none text-xs lg:text-sm text-[#2c403c]'>
        <p className='font-semibold text-sm lg:text-base'>Gaming Gecesi Kampanya Koşulları;</p>
        <ul className='space-y-2 lg:space-y-3'>
          {campaignConditions.map((condition, index) => (
            <li key={index}>{condition}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Footer;