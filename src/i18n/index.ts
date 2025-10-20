import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { en } from "./locales/en";
import { pt } from "./locales/pt";

const resources = {
	en,
	pt,
};

const savedLanguage = localStorage.getItem("i18nextLng") || "pt";

i18n.use(initReactI18next).init({
	resources,
	lng: savedLanguage,
	fallbackLng: "en",
	interpolation: {
		escapeValue: false,
	},
});

i18n.on("languageChanged", (lng) => {
	localStorage.setItem("i18nextLng", lng);
});

export default i18n;
