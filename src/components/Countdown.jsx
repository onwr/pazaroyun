import React, { useState, useEffect } from 'react';
import { useCampaign } from '@context/CampaignContext';

const Countdown = () => {
  const { startTime, endTime, isCampaignActive } = useCampaign();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const targetTime = isCampaignActive ? endTime : startTime;
      
      if (!targetTime) return;

      const difference = targetTime.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [startTime, endTime, isCampaignActive]);

  return (
    <div className='font-number text-white mx-auto mt-5 mb-10 grid w-full grid-cols-4 gap-2 lg:w-96 lg:gap-3'>
      <div className='rounded-lg border border-gray-900 bg-gray-900/50 py-3 lg:py-5 text-center'>
        <div className='text-2xl lg:text-7xl'>{timeLeft.days.toString().padStart(2, '0')}</div>
        <div className='text-sm lg:text-base'>gün</div>
      </div>
      <div className='rounded-lg border border-gray-900 bg-gray-900/50 py-3 lg:py-5 text-center'>
        <div className='text-2xl lg:text-7xl'>{timeLeft.hours.toString().padStart(2, '0')}</div>
        <div className='text-sm lg:text-base'>saat</div>
      </div>
      <div className='rounded-lg border border-gray-900 bg-gray-900/50 py-3 lg:py-5 text-center'>
        <div className='text-2xl lg:text-7xl'>{timeLeft.minutes.toString().padStart(2, '0')}</div>
        <div className='text-sm lg:text-base'>dakika</div>
      </div>
      <div className='rounded-lg border border-gray-900 bg-gray-900/50 py-3 lg:py-5 text-center'>
        <div className='text-2xl lg:text-7xl'>{timeLeft.seconds.toString().padStart(2, '0')}</div>
        <div className='text-sm lg:text-base'>saniye</div>
      </div>
    </div>
  );
};

export default Countdown; 