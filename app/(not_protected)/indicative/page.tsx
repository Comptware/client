'use client';
import React, { useEffect } from 'react';

const IndicativeR = () => {
  useEffect(() => {
    // Dynamically load Flourish embed script on the client only
    const script = document.createElement('script');
    script.src = 'https://public.flourish.studio/resources/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="w-full">

         {/* Cumulative Scatter */}
      <div
         className="flourish-embed flourish-scatter p-5"
         data-src="visualisation/25887588"
      >
        <noscript>
    <img
    src="https://public.flourish.studio/visualisation/25887588/thumbnail"
    width="100%"
    alt="scatter visualization" />

        </noscript>
      </div>

             {/* BTC ROI against SPY, ^RUA, and GLD in Barchart */}
         <div
        className="flourish-embed flourish-chart p-5"
        data-src="visualisation/25884896"
      >
        <noscript>
          <img
            src="https://public.flourish.studio/visualisation/25884896/thumbnail"
            width="100%"
            alt="chart visualization"
          />
        </noscript>
      </div>

               {/* Cumulative Monthly */}
      <div
         className="flourish-embed flourish-scatter p-5"
         data-src="visualisation/25888016"
      >
        <noscript>
    <img
    src="https://public.flourish.studio/visualisation/25888016/thumbnail"
    width="100%"
    alt="scatter visualization" />

        </noscript>
      </div>

               {/* Comprehensive */}
      <div
         className="flourish-embed flourish-chart p-5"
         data-src="visualisation/25898819"
      >
        <noscript>
    <img
    src="https://public.flourish.studio/visualisation/25898819/thumbnail"
    width="100%"
    alt="chart visualization" />

        </noscript>
      </div>


            {/* Fidel */}
      <div
         className="flourish-embed flourish-table p-5"
         data-src="visualisation/25933467"
      >
        <noscript>
    <img
    src="https://public.flourish.studio/visualisation/25933467/thumbnail"
    width="100%"
    alt="table visualization" />

        </noscript>
      </div>

    </div>
  );
};

export default IndicativeR;