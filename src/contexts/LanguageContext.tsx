import { createContext, useContext, useState, ReactNode } from "react";

export const LANGUAGES = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "hi", label: "हिन्दी", flag: "🇮🇳" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
  { code: "ru", label: "Русский", flag: "🇷🇺" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "nl", label: "Nederlands", flag: "🇳🇱" },
  { code: "tr", label: "Türkçe", flag: "🇹🇷" },
  { code: "id", label: "Bahasa Indonesia", flag: "🇮🇩" },
] as const;

type LangCode = typeof LANGUAGES[number]["code"];

const translations: Record<string, Record<LangCode, string>> = {
  "nav.dashboard": { en: "Dashboard", es: "Panel", fr: "Tableau de bord", de: "Dashboard", pt: "Painel", hi: "डैशबोर्ड", zh: "仪表板", ja: "ダッシュボード", ko: "대시보드", ar: "لوحة القيادة", ru: "Панель", it: "Pannello", nl: "Dashboard", tr: "Panel", id: "Dasbor" },
  "nav.upload": { en: "Upload", es: "Subir", fr: "Télécharger", de: "Hochladen", pt: "Enviar", hi: "अपलोड", zh: "上传", ja: "アップロード", ko: "업로드", ar: "رفع", ru: "Загрузить", it: "Carica", nl: "Uploaden", tr: "Yükle", id: "Unggah" },
  "nav.logout": { en: "Logout", es: "Salir", fr: "Déconnexion", de: "Abmelden", pt: "Sair", hi: "लॉगआउट", zh: "退出", ja: "ログアウト", ko: "로그아웃", ar: "تسجيل خروج", ru: "Выход", it: "Esci", nl: "Uitloggen", tr: "Çıkış", id: "Keluar" },
  "nav.getStarted": { en: "Get Started", es: "Comenzar", fr: "Commencer", de: "Loslegen", pt: "Começar", hi: "शुरू करें", zh: "开始", ja: "始める", ko: "시작하기", ar: "ابدأ", ru: "Начать", it: "Inizia", nl: "Beginnen", tr: "Başla", id: "Mulai" },
  "upload.title": { en: "Analyze Waste", es: "Analizar Residuos", fr: "Analyser les Déchets", de: "Abfall Analysieren", pt: "Analisar Resíduos", hi: "कचरा विश्लेषण", zh: "分析废物", ja: "廃棄物を分析", ko: "폐기물 분석", ar: "تحليل النفايات", ru: "Анализ отходов", it: "Analizza Rifiuti", nl: "Afval Analyseren", tr: "Atık Analizi", id: "Analisis Sampah" },
  "upload.subtitle": { en: "Upload an image and our AI will classify it instantly", es: "Sube una imagen y nuestra IA la clasificará al instante", fr: "Téléchargez une image et notre IA la classifiera instantanément", de: "Laden Sie ein Bild hoch und unsere KI klassifiziert es sofort", pt: "Envie uma imagem e nossa IA a classificará instantaneamente", hi: "एक छवि अपलोड करें और हमारी AI इसे तुरंत वर्गीकृत करेगी", zh: "上传图片，我们的AI将立即分类", ja: "画像をアップロードすると、AIが即座に分類します", ko: "이미지를 업로드하면 AI가 즉시 분류합니다", ar: "ارفع صورة وسيقوم الذكاء الاصطناعي بتصنيفها فوراً", ru: "Загрузите изображение, и наш ИИ мгновенно классифицирует его", it: "Carica un'immagine e la nostra IA la classificherà istantaneamente", nl: "Upload een afbeelding en onze AI classificeert het direct", tr: "Bir görsel yükleyin, yapay zekamız anında sınıflandırsın", id: "Unggah gambar dan AI kami akan langsung mengklasifikasikannya" },
  "upload.drop": { en: "Drop your image here", es: "Suelta tu imagen aquí", fr: "Déposez votre image ici", de: "Bild hier ablegen", pt: "Solte sua imagem aqui", hi: "अपनी छवि यहाँ छोड़ें", zh: "将图片拖放到此处", ja: "画像をここにドロップ", ko: "여기에 이미지를 놓으세요", ar: "أسقط صورتك هنا", ru: "Перетащите изображение сюда", it: "Trascina l'immagine qui", nl: "Sleep je afbeelding hierheen", tr: "Görselinizi buraya bırakın", id: "Letakkan gambar Anda di sini" },
  "upload.analyze": { en: "Analyze Image", es: "Analizar Imagen", fr: "Analyser l'Image", de: "Bild Analysieren", pt: "Analisar Imagem", hi: "छवि का विश्लेषण करें", zh: "分析图像", ja: "画像を分析", ko: "이미지 분석", ar: "تحليل الصورة", ru: "Анализировать", it: "Analizza Immagine", nl: "Afbeelding Analyseren", tr: "Görsel Analiz Et", id: "Analisis Gambar" },
  "upload.analyzing": { en: "Analyzing...", es: "Analizando...", fr: "Analyse...", de: "Analysiere...", pt: "Analisando...", hi: "विश्लेषण...", zh: "分析中...", ja: "分析中...", ko: "분석 중...", ar: "جاري التحليل...", ru: "Анализ...", it: "Analisi...", nl: "Analyseren...", tr: "Analiz ediliyor...", id: "Menganalisis..." },
  "chat.title": { en: "Ask RecycAI", es: "Pregunta a RecycAI", fr: "Demandez à RecycAI", de: "Frag RecycAI", pt: "Pergunte ao RecycAI", hi: "RecycAI से पूछें", zh: "询问RecycAI", ja: "RecycAIに質問", ko: "RecycAI에게 물어보기", ar: "اسأل RecycAI", ru: "Спросите RecycAI", it: "Chiedi a RecycAI", nl: "Vraag RecycAI", tr: "RecycAI'ye Sor", id: "Tanya RecycAI" },
  "chat.placeholder": { en: "Ask about recycling, sustainability...", es: "Pregunta sobre reciclaje...", fr: "Posez vos questions sur le recyclage...", de: "Fragen Sie zum Recycling...", pt: "Pergunte sobre reciclagem...", hi: "रीसाइक्लिंग के बारे में पूछें...", zh: "询问有关回收的问题...", ja: "リサイクルについて質問...", ko: "재활용에 대해 질문하세요...", ar: "اسأل عن إعادة التدوير...", ru: "Спросите о переработке...", it: "Chiedi sul riciclo...", nl: "Vraag over recycling...", tr: "Geri dönüşüm hakkında sorun...", id: "Tanya tentang daur ulang..." },
  "dashboard.title": { en: "Dashboard", es: "Panel", fr: "Tableau de bord", de: "Dashboard", pt: "Painel", hi: "डैशबोर्ड", zh: "仪表板", ja: "ダッシュボード", ko: "대시보드", ar: "لوحة القيادة", ru: "Панель", it: "Pannello", nl: "Dashboard", tr: "Panel", id: "Dasbor" },
  "dashboard.subtitle": { en: "Your recycling activity overview", es: "Resumen de tu actividad de reciclaje", fr: "Aperçu de votre activité de recyclage", de: "Ihre Recycling-Aktivitätsübersicht", pt: "Visão geral da sua atividade de reciclagem", hi: "आपकी रीसाइक्लिंग गतिविधि का अवलोकन", zh: "您的回收活动概览", ja: "リサイクル活動の概要", ko: "재활용 활동 개요", ar: "نظرة عامة على نشاط إعادة التدوير", ru: "Обзор вашей активности переработки", it: "Panoramica della tua attività di riciclo", nl: "Overzicht van je recyclingactiviteit", tr: "Geri dönüşüm etkinliğinize genel bakış", id: "Ikhtisar aktivitas daur ulang Anda" },
};

interface LanguageContextType {
  language: LangCode;
  setLanguage: (code: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<LangCode>(() => {
    const saved = localStorage.getItem("recycai-lang");
    return (saved as LangCode) || "en";
  });

  const handleSetLanguage = (code: LangCode) => {
    setLanguage(code);
    localStorage.setItem("recycai-lang", code);
  };

  const t = (key: string): string => {
    return translations[key]?.[language] || translations[key]?.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
