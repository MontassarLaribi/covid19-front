import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import Welcome from "./Welcome"
import ar from "./i18n/ar";
import fr from "./i18n/fr";

i18n.use(initReactI18next)
    .init({
        fallbackLng: 'ar',
        debug: true,

        interpolation: {
            escapeValue: false,
        }
});

i18n.addResourceBundle('ar', 'welcome', ar);
i18n.addResourceBundle('fr', 'welcome', fr);

export const WelcomeConfig = {
    settings: {
        layout: {
            config: {
                navbar        : {
                    display: false
                },
                toolbar       : {
                    display: false
                },
                footer        : {
                    display: false
                },
                leftSidePanel : {
                    display: false
                },
                rightSidePanel: {
                    display: false
                }
            }
        }
    },
    routes  : [
        {
            path     : '/welcome',
            component: Welcome
        }
    ]
};