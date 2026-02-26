import React, { createContext, useState, useContext, useEffect } from 'react';

interface SettingsContextType {
  logoUrl: string;
  banner: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
  contactInfo: {
    phone: string;
    footerText: string;
  };
  updateLogoUrl: (url: string) => Promise<void>;
  updateBanner: (banner: { title?: string; subtitle?: string; imageUrl?: string }) => Promise<void>;
  updateContactInfo: (info: { phone?: string; footerText?: string }) => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [banner, setBanner] = useState({
    title: '',
    subtitle: '',
    imageUrl: ''
  });
  const [contactInfo, setContactInfo] = useState({
    phone: '+58 414-1234567',
    footerText: 'ALLPROSUM 33, C.A. J-12345678-9'
  });

  useEffect(() => {
    // Fetch logo
    fetch('/api/settings/logo')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then(data => {
        if (data.logo_url) setLogoUrl(data.logo_url);
      })
      .catch(err => console.error('Error fetching logo:', err.message));

    // Fetch banner
    fetch('/api/settings/banner')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then(data => {
        setBanner({
          title: data.title || '',
          subtitle: data.subtitle || '',
          imageUrl: data.image_url || ''
        });
      })
      .catch(err => console.error('Error fetching banner:', err));

    // Fetch contact info
    fetch('/api/settings/contact')
      .then(res => {
        if (!res.ok) throw new Error(res.statusText || 'Error fetching contact info');
        return res.json();
      })
      .then(data => {
        setContactInfo({
          phone: data.phone || '+58 414-1234567',
          footerText: data.footerText || 'ALLPROSUM 33, C.A. J-12345678-9'
        });
      })
      .catch(err => {
        console.error('Error fetching contact info:', err.message);
        // Fallback to defaults is already handled by initial state
      });
  }, []);

  const updateLogoUrl = async (url: string) => {
    try {
      const res = await fetch('/api/settings/logo', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logo_url: url })
      });
      if (res.ok) {
        setLogoUrl(url);
      }
    } catch (err) {
      console.error('Error updating logo:', err);
    }
  };

  const updateBanner = async (newBanner: { title?: string; subtitle?: string; imageUrl?: string }) => {
    try {
      const res = await fetch('/api/settings/banner', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newBanner.title,
          subtitle: newBanner.subtitle,
          image_url: newBanner.imageUrl
        })
      });
      if (res.ok) {
        setBanner(prev => ({
          title: newBanner.title !== undefined ? newBanner.title : prev.title,
          subtitle: newBanner.subtitle !== undefined ? newBanner.subtitle : prev.subtitle,
          imageUrl: newBanner.imageUrl !== undefined ? newBanner.imageUrl : prev.imageUrl
        }));
      }
    } catch (err) {
      console.error('Error updating banner:', err);
    }
  };

  const updateContactInfo = async (newInfo: { phone?: string; footerText?: string }) => {
    try {
      const res = await fetch('/api/settings/contact', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newInfo)
      });
      if (res.ok) {
        setContactInfo(prev => ({
          phone: newInfo.phone !== undefined ? newInfo.phone : prev.phone,
          footerText: newInfo.footerText !== undefined ? newInfo.footerText : prev.footerText
        }));
      }
    } catch (err) {
      console.error('Error updating contact info:', err);
    }
  };

  return (
    <SettingsContext.Provider value={{ logoUrl, banner, contactInfo, updateLogoUrl, updateBanner, updateContactInfo }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
