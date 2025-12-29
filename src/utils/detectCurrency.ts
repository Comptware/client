// src/utils/detectCurrency.ts

export const detectUserCountry = async (): Promise<{ country: string }> => {
  if (typeof window === 'undefined') {
    return { country: 'US' };
  }

  try {
    const cached = localStorage.getItem('userCountry');
    if (cached && /^[A-Z]{2}$/.test(cached)) {
      return { country: cached };
    }

    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('IP lookup failed');

    const data = await res.json();
    const countryCode = (data.country_code || 'US').toUpperCase();

    // Basic validation: must be 2 uppercase letters
    const validCountry = /^[A-Z]{2}$/.test(countryCode) ? countryCode : 'US';

    localStorage.setItem('userCountry', validCountry);
    return { country: validCountry };
  } catch (err) {
    console.error('detectUserCountry error:', err);
    return { country: 'US' };
  }
};




// import { countries, currencies } from 'country-data';

// type CountryDataItem = {
//   alpha2: string;
//   alpha3?: string;
//   name?: string;
//   currencies?: string[];
//   [key: string]: any;
// };

// export const detectUserLocale = async (): Promise<{
//   currency: string;
//   currencySymbol: string;
//   locale: string;
// }> => {
//   try {
//     const cached = localStorage.getItem('userLocaleInfo');
//     if (cached) return JSON.parse(cached);

//     const res = await fetch('https://ipapi.co/json/');
//     if (!res.ok) throw new Error(`ipapi failed: ${res.status}`);
//     const data = await res.json();

//     const countryCode = data.country_code?.toUpperCase() || 'US';
//     const locale = data.languages?.split(',')[0]?.replace('-', '_') || 'en-US';

//     // 🔹 From country-data package
//     const country = countries[countryCode];
//     const currency = country?.currencies?.[0] || 'USD';
//     const currencyData = currencies[currency];
//     const currencySymbol = currencyData?.symbol || '$';

//     const result = { currency, currencySymbol, locale };
//     localStorage.setItem('userLocaleInfo', JSON.stringify(result));

//     return result;
//   } catch (err) {
//     console.error('Locale detection failed:', err);
//     return { currency: 'USD', currencySymbol: '$', locale: 'en-US' };
//   }
// };

// export const detectUserCountry = async (): Promise<{ country: string }> => {
//   try {
//     // SSR fallback
//     if (typeof window === 'undefined') {
//       return { country: 'US' };
//     }

//     // 1️⃣ Check localStorage cache
//     const cached = localStorage.getItem('userCountry');
//     if (cached && cached.length === 2) {
//       return { country: cached };
//     }

//     // 2️⃣ Fetch from IP API
//     const res = await fetch('https://ipapi.co/json/');
//     if (!res.ok) throw new Error('IP lookup failed');

//     const data = await res.json();
//     console.log(data,'IP country--')
//     const rawCountry = data.country_code?.toUpperCase();

//     // 3️⃣ Validate country code (MUST be ISO alpha-2)
//     console.log(countries,'countries data===')
//     const validCountry = countries.all.find(
//       (c: CountryDataItem) => c.alpha2 === rawCountry
//     );

//     const detectedCountry = validCountry?.alpha2 || 'US';

//     // 4️⃣ Cache result
//     localStorage.setItem('userCountry', detectedCountry);

//     return { country: detectedCountry };
//   } catch (err) {
//     console.error('detectUserCountry error:', err);

//     // 5️⃣ Browser fallback as last resort
//     try {
//       const language = navigator.language || 'en-US';

//       // Extract country part from locale (en-US → US)
//       const fallbackCountry = language.split('-')[1]?.toUpperCase();

//       const validFallback = countries.all.find(
//         (c: CountryDataItem) => c.alpha2 === fallbackCountry
//       );

//       if (validFallback) {
//         localStorage.setItem('userCountry', validFallback.alpha2);
//         return { country: validFallback.alpha2 };
//       }
//     } catch (_) {}

//     // 6️⃣ Final fallback
//     return { country: 'US' };
//   }
// };