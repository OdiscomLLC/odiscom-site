import type { Metadata, Viewport } from 'next';
import CloudPhotoUpload from './CloudPhotoUpload';
import CloudPhotoGallery from './CloudPhotoGallery';

export const metadata: Metadata = {
  title: 'Scott AFB Site Walk | ODISCOM',
  description: 'FA440726QJC05 Scott AFB Unaccompanied Housing Wi-Fi field walk checklist',
  manifest: '/sitewalk-scott-afb.webmanifest',
  appleWebApp: { capable: true, statusBarStyle: 'black-translucent', title: 'Scott SiteWalk' },
};

export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#0b1f3a' };

export default function Layout({children}:{children:React.ReactNode}){ return <>{children}<CloudPhotoGallery/><CloudPhotoUpload/></>; }
