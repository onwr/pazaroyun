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
    <div className='container mx-auto px-4 pb-10'>
      <a href='https://pazaroyun.com' className='py-5'>
        <a
          href='https://pazaroyun.com'
          className='flex items-center justify-center transition-opacity hover:opacity-90'
        >
          <img src='/logo.webp' alt='' className='h-auto w-32 lg:w-[144.22px]' />
        </a>

        <div className='text-center text-sm text-gray-500 lg:text-base'>Anasayfaya git</div>
      </a>
      <div className='prose prose-stone prose-li:leading-none text-[#3c8352] max-w-none text-xs lg:text-sm'>
        <p className='text-sm font-semibold lg:text-base'>Gaming Gecesi Kampanya Koşulları;</p>
        <ul className='space-y-2 lg:space-y-3 mt-2 list-disc pl-5'>
          {campaignConditions.map((condition, index) => (
            <li key={index} className='before:mr-2'>{condition}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Footer;