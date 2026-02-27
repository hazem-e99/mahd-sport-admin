import React, { useEffect } from 'react';
import SvgCloudicon from '@/components/icons/cloud-icon'
import './date-time-display.component.scss'
import { useLanguage } from '@/context/languageContext';

const dateTimeDisplay: React.FC = () => {
  const now = new Date();
  // eslint-disable-next-line react-hooks/rules-of-hooks
   const [temperature, setTemperature] = React.useState<number | null>(null);
  // eslint-disable-next-line react-hooks/rules-of-hooks
   const { language } = useLanguage();

  const formattedDate = new Intl.DateTimeFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(now);

  const getTemperature = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=ce9d642e471b47b8b5b12a0d8a55db11`)
        .then(response => response.json())
        .then(data => {
          const temperature = data.main.temp;
          setTemperature(temperature);
        })
        .catch(error => console.error("Error fetching weather data:", error));
    });
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {

    getTemperature()

  }, []);


  return (
  <div className='date-time-display d-flex'>
      <p>{formattedDate}</p>
      <div className="date-time-display-d">
        <div className='date-time-display-d-text'>{temperature !== null ? temperature : '--'}</div>
        <span className='date-time-display-d-c'>°C</span>
      </div>
      <span className='date-time-display-icon'>
        <SvgCloudicon />
      </span>
    </div>
  )
}

export default dateTimeDisplay
