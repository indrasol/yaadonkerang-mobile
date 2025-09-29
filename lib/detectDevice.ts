// lib/detectDevice.ts
import { Platform } from 'react-native';

export const detectDevice = (): string => {
    if (Platform.OS === 'ios') return 'ios';
    if (Platform.OS === 'android') return 'android';
    return 'web';
};


// export function detectDevice(): string {
//     // Prefer modern UA-Client-Hints if available
//     // @ts-ignore browser-only property
//     const uaData = navigator.userAgentData as undefined | { platform?: string; mobile?: boolean };
//     if (uaData?.platform) {
//       const p = uaData.platform.toLowerCase();
//       if (p.includes('android')) return 'android';
//       if (p.includes('iphone') || p.includes('ipad') || p.includes('ios')) return 'ios';
//       if (p.includes('mac')) return 'macos';
//       if (p.includes('win')) return 'windows';
//       return uaData.mobile ? 'mobile' : 'desktop';
//     }
  
//     // Fallback to legacy UA string
//     const ua = navigator.userAgent.toLowerCase();
//     if (/android/.test(ua)) return 'android';
//     if (/iphone|ipad|ipod/.test(ua)) return 'ios';
//     if (/macintosh/.test(ua)) return 'macos';
//     if (/windows/.test(ua)) return 'windows';
//     return /mobile|tablet/.test(ua) ? 'mobile' : 'desktop';
//   }
  