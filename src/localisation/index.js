import { getLocales } from "expo-localization";
import { I18n } from "i18n-js";
import { ar, fr, registerTranslation } from "react-native-paper-dates";
registerTranslation("ar", ar)
registerTranslation("fr", fr)
const i18n = new I18n({
    ar: {
    
    },
    fr: {
     
  
    },
  });
  
  i18n.enableFallback = true;
  i18n.defaultLocale = "fr"
  i18n.locale = ['fr', 'ar'].includes(getLocales()[0].languageCode) ? getLocales()[0].languageCode : 'fr';
  
  export default i18n;
  