
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './AuthContext';
import { useToast } from '@/components/ui/use-toast';

interface LanguageContextType {
  currentLanguage: string;
  changeLanguage: (lang: string) => Promise<void>;
  isLanguageLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: 'en',
  changeLanguage: async () => {},
  isLanguageLoading: false,
});

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentLanguage, setCurrentLanguage] = useState<string>(i18n.language || 'en');
  const [isLanguageLoading, setIsLanguageLoading] = useState<boolean>(true);

  // Load user's language preference from Supabase
  useEffect(() => {
    const loadLanguagePreference = async () => {
      if (!user) {
        console.log('No user, using default language:', i18n.language);
        setIsLanguageLoading(false);
        return;
      }

      try {
        console.log('Fetching language preference for user:', user.id);
        const { data, error } = await supabase
          .from('user_profiles')
          .select('language')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching language preference:', error);
          setIsLanguageLoading(false);
          return;
        }

        if (data && data.language) {
          console.log('Setting language from DB:', data.language);
          await i18n.changeLanguage(data.language);
          setCurrentLanguage(data.language);
        } else {
          console.log('No language preference found, using default:', i18n.language);
        }
      } catch (error) {
        console.error('Error in language loading:', error);
      } finally {
        setIsLanguageLoading(false);
      }
    };

    loadLanguagePreference();
  }, [user, i18n]);

  // Function to change language and save preference
  const changeLanguage = async (lang: string) => {
    setIsLanguageLoading(true);
    
    try {
      console.log('Changing language to:', lang);
      // Update language in i18n
      await i18n.changeLanguage(lang);
      setCurrentLanguage(lang);
      
      // Save to Supabase if user is logged in
      if (user) {
        const { error } = await supabase
          .from('user_profiles')
          .update({ language: lang })
          .eq('id', user.id);
          
        if (error) {
          console.error('Error saving language preference:', error);
          toast({
            title: "Error",
            description: "Could not save language preference",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Language updated",
            description: `Language changed to ${lang === 'en' ? 'English' : lang === 'fr' ? 'French' : 'Arabic'}`,
          });
        }
      }
    } catch (error) {
      console.error('Error changing language:', error);
      toast({
        title: "Error",
        description: "Could not change language",
        variant: "destructive",
      });
    } finally {
      setIsLanguageLoading(false);
    }
  };

  const value = {
    currentLanguage,
    changeLanguage,
    isLanguageLoading,
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export default LanguageContext;
