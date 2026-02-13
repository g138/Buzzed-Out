import React, { useEffect } from 'react';

/**
 * Google AdSense Component
 * 
 * Usage:
 * <AdSense 
 *   adSlot="1234567890"  // Your ad slot ID from AdSense
 *   adFormat="auto"      // auto, rectangle, horizontal, vertical
 *   style={{ minHeight: '100px' }}  // Optional styling
 * />
 */
const AdSense = ({ 
  adSlot = '', 
  adFormat = 'auto',
  fullWidthResponsive = true,
  style = {},
  className = ''
}) => {
  useEffect(() => {
    try {
      // Push ad to adsbygoogle array
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  // Don't render if no ad slot provided
  if (!adSlot) {
    return null;
  }

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ 
          display: 'block',
          ...style 
        }}
        data-ad-client="ca-pub-8890071629151424"
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? 'true' : 'false'}
      />
    </div>
  );
};

export default AdSense;
