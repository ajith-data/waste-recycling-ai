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

// Helper to build a translation entry concisely
type T15 = Record<LangCode, string>;
const t15 = (en: string, es: string, fr: string, de: string, pt: string, hi: string, zh: string, ja: string, ko: string, ar: string, ru: string, it: string, nl: string, tr: string, id: string): T15 => ({
  en, es, fr, de, pt, hi, zh, ja, ko, ar, ru, it, nl, tr, id,
});

const translations: Record<string, T15> = {
  // Navbar
  "nav.dashboard": t15("Dashboard","Panel","Tableau de bord","Dashboard","Painel","डैशबोर्ड","仪表板","ダッシュボード","대시보드","لوحة القيادة","Панель","Pannello","Dashboard","Panel","Dasbor"),
  "nav.upload": t15("Upload","Subir","Télécharger","Hochladen","Enviar","अपलोड","上传","アップロード","업로드","رفع","Загрузить","Carica","Uploaden","Yükle","Unggah"),
  "nav.logout": t15("Logout","Salir","Déconnexion","Abmelden","Sair","लॉगआउट","退出","ログアウト","로그아웃","تسجيل خروج","Выход","Esci","Uitloggen","Çıkış","Keluar"),
  "nav.getStarted": t15("Get Started","Comenzar","Commencer","Loslegen","Começar","शुरू करें","开始","始める","시작하기","ابدأ","Начать","Inizia","Beginnen","Başla","Mulai"),

  // Index / Home
  "home.badge": t15("AI-Powered Sustainability","Sustentabilidad con IA","Durabilité par l'IA","KI-gestützte Nachhaltigkeit","Sustentabilidade com IA","AI-संचालित स्थिरता","AI驱动的可持续发展","AI搭載サステナビリティ","AI 기반 지속가능성","الاستدامة بالذكاء الاصطناعي","ИИ для устойчивости","Sostenibilità con IA","AI-Duurzaamheid","Yapay Zeka ile Sürdürülebilirlik","Keberlanjutan Berbasis AI"),
  "home.title": t15("Smart Recycling with","Reciclaje Inteligente con","Recyclage Intelligent avec","Intelligentes Recycling mit","Reciclagem Inteligente com","स्मार्ट रीसाइक्लिंग","智能回收","スマートリサイクル","스마트 재활용","إعادة التدوير الذكية مع","Умная переработка с","Riciclo Intelligente con","Slim Recyclen met","Akıllı Geri Dönüşüm","Daur Ulang Cerdas dengan"),
  "home.subtitle": t15(
    "Upload a photo of any waste item and our AI instantly classifies it, provides recycling guidance, and helps you make a positive environmental impact.",
    "Sube una foto de cualquier residuo y nuestra IA lo clasifica al instante, proporciona guías de reciclaje y te ayuda a generar un impacto ambiental positivo.",
    "Téléchargez une photo de n'importe quel déchet et notre IA le classifie instantanément, fournit des conseils de recyclage et vous aide à avoir un impact environnemental positif.",
    "Laden Sie ein Foto eines beliebigen Abfalls hoch und unsere KI klassifiziert es sofort, bietet Recycling-Anleitungen und hilft Ihnen, einen positiven Umweltbeitrag zu leisten.",
    "Envie uma foto de qualquer resíduo e nossa IA o classifica instantaneamente, fornece orientações de reciclagem e ajuda você a causar um impacto ambiental positivo.",
    "किसी भी कचरे की फोटो अपलोड करें और हमारा AI तुरंत इसे वर्गीकृत करता है, रीसाइक्लिंग मार्गदर्शन प्रदान करता है, और आपको सकारात्मक पर्यावरणीय प्रभाव डालने में मदद करता है।",
    "上传任何废物的照片，我们的AI会立即分类，提供回收指导，帮助您产生积极的环境影响。",
    "廃棄物の写真をアップロードすると、AIが即座に分類し、リサイクルのガイダンスを提供し、環境に良い影響を与える手助けをします。",
    "폐기물 사진을 업로드하면 AI가 즉시 분류하고 재활용 안내를 제공하며 긍정적인 환경 영향을 만드는 데 도움을 줍니다.",
    "قم بتحميل صورة لأي نفاية وسيقوم الذكاء الاصطناعي بتصنيفها فوراً وتقديم إرشادات إعادة التدوير ومساعدتك في إحداث تأثير بيئي إيجابي.",
    "Загрузите фото любого отхода, и наш ИИ мгновенно классифицирует его, предоставит рекомендации по переработке и поможет вам внести положительный вклад в экологию.",
    "Carica una foto di qualsiasi rifiuto e la nostra IA lo classifica istantaneamente, fornisce indicazioni per il riciclo e ti aiuta a fare un impatto ambientale positivo.",
    "Upload een foto van afval en onze AI classificeert het direct, geeft recyclingtips en helpt je een positieve milieu-impact te maken.",
    "Herhangi bir atığın fotoğrafını yükleyin, yapay zekamız anında sınıflandırsın, geri dönüşüm rehberliği sağlasın ve olumlu bir çevresel etki yaratmanıza yardımcı olsun.",
    "Unggah foto sampah apa pun dan AI kami langsung mengklasifikasikannya, memberikan panduan daur ulang, dan membantu Anda memberikan dampak lingkungan yang positif."
  ),
  "home.cta": t15("Start Recycling Smarter","Empieza a Reciclar Mejor","Commencez à Recycler Mieux","Smarter Recyceln","Comece a Reciclar Melhor","स्मार्ट रीसाइक्लिंग शुरू करें","开始智能回收","スマートリサイクル開始","스마트 재활용 시작","ابدأ إعادة التدوير بذكاء","Начните умную переработку","Inizia a Riciclare Meglio","Slimmer Recyclen","Akıllı Geri Dönüşüme Başla","Mulai Daur Ulang Cerdas"),
  "home.signIn": t15("Sign In","Iniciar Sesión","Se Connecter","Anmelden","Entrar","साइन इन","登录","サインイン","로그인","تسجيل الدخول","Войти","Accedi","Inloggen","Giriş Yap","Masuk"),
  "home.categories": t15("Classifies 7 waste categories","Clasifica 7 categorías de residuos","Classe 7 catégories de déchets","Klassifiziert 7 Abfallkategorien","Classifica 7 categorias de resíduos","7 कचरा श्रेणियों को वर्गीकृत करता है","分类7种废物类别","7つの廃棄物カテゴリを分類","7가지 폐기물 카테고리 분류","يصنف 7 فئات من النفايات","Классифицирует 7 категорий отходов","Classifica 7 categorie di rifiuti","Classificeert 7 afvalcategorieën","7 atık kategorisini sınıflandırır","Mengklasifikasikan 7 kategori sampah"),
  "home.howItWorks": t15("How It Works","Cómo Funciona","Comment ça Marche","So funktioniert's","Como Funciona","यह कैसे काम करता है","工作原理","仕組み","작동 방식","كيف يعمل","Как это работает","Come Funziona","Hoe het Werkt","Nasıl Çalışır","Cara Kerja"),
  "home.howItWorksDesc": t15("Three simple steps to smarter recycling","Tres pasos simples para un reciclaje más inteligente","Trois étapes simples vers un recyclage plus intelligent","Drei einfache Schritte für smarteres Recycling","Três passos simples para uma reciclagem mais inteligente","स्मार्ट रीसाइक्लिंग के तीन आसान कदम","智能回收的三个简单步骤","スマートリサイクルへの3ステップ","스마트 재활용을 위한 3단계","ثلاث خطوات بسيطة لإعادة تدوير أذكى","Три простых шага к умной переработке","Tre semplici passi per un riciclo più intelligente","Drie eenvoudige stappen naar slimmer recyclen","Daha akıllı geri dönüşüm için üç basit adım","Tiga langkah sederhana untuk daur ulang cerdas"),
  "home.footer": t15("Making recycling smarter, one image at a time.","Haciendo el reciclaje más inteligente, una imagen a la vez.","Rendre le recyclage plus intelligent, une image à la fois.","Recycling smarter machen, ein Bild nach dem anderen.","Tornando a reciclagem mais inteligente, uma imagem de cada vez.","एक-एक छवि से रीसाइक्लिंग को स्मार्ट बनाना।","一张图片让回收更智能。","画像一枚でリサイクルをスマートに。","이미지 하나로 재활용을 더 스마트하게.","جعل إعادة التدوير أذكى، صورة واحدة في كل مرة.","Делаем переработку умнее, одно изображение за раз.","Rendere il riciclo più intelligente, un'immagine alla volta.","Recyclen slimmer maken, één afbeelding tegelijk.","Her seferinde bir görsel ile geri dönüşümü akıllandırıyoruz.","Menjadikan daur ulang lebih cerdas, satu gambar setiap waktu."),

  // Feature cards
  "feature.aiClassification": t15("AI Classification","Clasificación IA","Classification IA","KI-Klassifikation","Classificação IA","AI वर्गीकरण","AI分类","AI分類","AI 분류","تصنيف الذكاء الاصطناعي","ИИ-классификация","Classificazione IA","AI Classificatie","Yapay Zeka Sınıflandırma","Klasifikasi AI"),
  "feature.aiClassificationDesc": t15("Upload any waste image and our AI identifies the type instantly with confidence scoring.","Sube cualquier imagen de residuos y nuestra IA identifica el tipo al instante con puntuación de confianza.","Téléchargez n'importe quelle image de déchet et notre IA identifie le type instantanément avec un score de confiance.","Laden Sie ein Abfallbild hoch und unsere KI identifiziert den Typ sofort mit Konfidenzwertung.","Envie qualquer imagem de resíduo e nossa IA identifica o tipo instantaneamente com pontuação de confiança.","किसी भी कचरे की छवि अपलोड करें और हमारा AI तुरंत प्रकार की पहचान करता है।","上传任何废物图片，AI立即识别类型。","廃棄物画像をアップロードすると、AIが即座に種類を識別します。","폐기물 이미지를 업로드하면 AI가 즉시 유형을 식별합니다.","قم بتحميل أي صورة نفاية وسيحدد الذكاء الاصطناعي النوع فوراً.","Загрузите изображение отхода, и ИИ мгновенно определит тип.","Carica qualsiasi immagine di rifiuto e la nostra IA identifica il tipo istantaneamente.","Upload een afvalafbeelding en onze AI identificeert het type direct.","Herhangi bir atık görselini yükleyin, yapay zekamız türünü anında belirlesin.","Unggah gambar sampah apa pun dan AI kami langsung mengidentifikasi jenisnya."),
  "feature.recyclingGuidance": t15("Recycling Guidance","Guía de Reciclaje","Guide de Recyclage","Recycling-Anleitung","Guia de Reciclagem","रीसाइक्लिंग मार्गदर्शन","回收指南","リサイクルガイド","재활용 안내","إرشادات إعادة التدوير","Руководство по переработке","Guida al Riciclo","Recyclinggids","Geri Dönüşüm Rehberi","Panduan Daur Ulang"),
  "feature.recyclingGuidanceDesc": t15("Get personalized recycling instructions and learn proper disposal methods.","Obtén instrucciones personalizadas de reciclaje y aprende métodos de eliminación adecuados.","Obtenez des instructions de recyclage personnalisées et apprenez les méthodes d'élimination appropriées.","Erhalten Sie personalisierte Recycling-Anleitungen und lernen Sie richtige Entsorgungsmethoden.","Receba instruções personalizadas de reciclagem e aprenda métodos de descarte adequados.","व्यक्तिगत रीसाइक्लिंग निर्देश प्राप्त करें।","获取个性化回收指导。","パーソナライズされたリサイクル指導を受けましょう。","맞춤 재활용 안내를 받으세요.","احصل على تعليمات إعادة التدوير المخصصة.","Получите персонализированные инструкции по переработке.","Ottieni istruzioni di riciclo personalizzate.","Ontvang gepersonaliseerde recyclinginstructies.","Kişiselleştirilmiş geri dönüşüm talimatları alın.","Dapatkan panduan daur ulang yang dipersonalisasi."),
  "feature.trackImpact": t15("Track Impact","Seguir Impacto","Suivre l'Impact","Wirkung Verfolgen","Acompanhar Impacto","प्रभाव ट्रैक करें","追踪影响","影響を追跡","영향 추적","تتبع التأثير","Отслеживание влияния","Traccia l'Impatto","Impact Volgen","Etkiyi Takip Et","Lacak Dampak"),
  "feature.trackImpactDesc": t15("Monitor your recycling history and see your environmental contribution grow.","Monitorea tu historial de reciclaje y observa cómo crece tu contribución ambiental.","Surveillez votre historique de recyclage et voyez votre contribution environnementale grandir.","Überwachen Sie Ihre Recycling-Geschichte und sehen Sie Ihren Umweltbeitrag wachsen.","Monitore seu histórico de reciclagem e veja sua contribuição ambiental crescer.","अपने रीसाइक्लिंग इतिहास की निगरानी करें।","监控您的回收历史，看到您的环保贡献增长。","リサイクル履歴を監視し、環境貢献の成長を確認しましょう。","재활용 이력을 모니터링하고 환경 기여도를 확인하세요.","راقب سجل إعادة التدوير الخاص بك.","Отслеживайте свою историю переработки.","Monitora la tua cronologia di riciclo.","Volg je recyclinggeschiedenis.","Geri dönüşüm geçmişinizi takip edin.","Pantau riwayat daur ulang Anda."),
  "feature.multilingual": t15("Multilingual","Multilingüe","Multilingue","Mehrsprachig","Multilíngue","बहुभाषी","多语言","多言語","다국어","متعدد اللغات","Мультиязычность","Multilingue","Meertalig","Çok Dilli","Multibahasa"),
  "feature.multilingualDesc": t15("Available in 15+ languages so everyone can contribute to a cleaner planet.","Disponible en más de 15 idiomas para que todos contribuyan a un planeta más limpio.","Disponible en plus de 15 langues pour que chacun contribue à une planète plus propre.","Verfügbar in über 15 Sprachen, damit jeder zu einem saubereren Planeten beitragen kann.","Disponível em mais de 15 idiomas para que todos contribuam para um planeta mais limpo.","15+ भाषाओं में उपलब्ध ताकि सभी स्वच्छ ग्रह में योगदान कर सकें।","支持15+种语言，让每个人都能为更清洁的地球做贡献。","15以上の言語で利用可能で、誰もがクリーンな地球に貢献できます。","15개 이상의 언어로 제공되어 모든 사람이 깨끗한 지구에 기여할 수 있습니다.","متوفر بأكثر من 15 لغة ليساهم الجميع في كوكب أنظف.","Доступно на 15+ языках, чтобы каждый мог внести вклад в чистую планету.","Disponibile in oltre 15 lingue per contribuire a un pianeta più pulito.","Beschikbaar in 15+ talen zodat iedereen kan bijdragen aan een schonere planeet.","Herkesin daha temiz bir gezegene katkıda bulunması için 15+ dilde mevcut.","Tersedia dalam 15+ bahasa agar semua orang dapat berkontribusi untuk planet yang lebih bersih."),

  // Waste types
  "waste.plastic": t15("Plastic","Plástico","Plastique","Plastik","Plástico","प्लास्टिक","塑料","プラスチック","플라스틱","بلاستيك","Пластик","Plastica","Plastic","Plastik","Plastik"),
  "waste.paper": t15("Paper","Papel","Papier","Papier","Papel","कागज","纸","紙","종이","ورق","Бумага","Carta","Papier","Kağıt","Kertas"),
  "waste.glass": t15("Glass","Vidrio","Verre","Glas","Vidro","कांच","玻璃","ガラス","유리","زجاج","Стекло","Vetro","Glas","Cam","Kaca"),
  "waste.metal": t15("Metal","Metal","Métal","Metall","Metal","धातु","金属","金属","금속","معدن","Металл","Metallo","Metaal","Metal","Logam"),
  "waste.organic": t15("Organic","Orgánico","Organique","Organisch","Orgânico","जैविक","有机","有機","유기물","عضوي","Органика","Organico","Organisch","Organik","Organik"),
  "waste.ewaste": t15("E-Waste","Residuos Electrónicos","Déchets Électroniques","Elektroschrott","Lixo Eletrônico","ई-कचरा","电子垃圾","電子廃棄物","전자폐기물","نفايات إلكترونية","Электронные отходы","Rifiuti Elettronici","E-Afval","E-Atık","Sampah Elektronik"),
  "waste.hazardous": t15("Hazardous","Peligroso","Dangereux","Gefährlich","Perigoso","खतरनाक","危险","有害","유해","خطير","Опасные","Pericoloso","Gevaarlijk","Tehlikeli","Berbahaya"),

  // Upload page
  "upload.title": t15("Analyze Waste","Analizar Residuos","Analyser les Déchets","Abfall Analysieren","Analisar Resíduos","कचरा विश्लेषण","分析废物","廃棄物を分析","폐기물 분석","تحليل النفايات","Анализ отходов","Analizza Rifiuti","Afval Analyseren","Atık Analizi","Analisis Sampah"),
  "upload.subtitle": t15("Upload an image and our AI will classify it instantly","Sube una imagen y nuestra IA la clasificará al instante","Téléchargez une image et notre IA la classifiera instantanément","Laden Sie ein Bild hoch und unsere KI klassifiziert es sofort","Envie uma imagem e nossa IA a classificará instantaneamente","एक छवि अपलोड करें और हमारी AI इसे तुरंत वर्गीकृत करेगी","上传图片，AI将立即分类","画像をアップロードするとAIが即座に分類します","이미지를 업로드하면 AI가 즉시 분류합니다","ارفع صورة وسيقوم الذكاء الاصطناعي بتصنيفها فوراً","Загрузите изображение, и ИИ мгновенно классифицирует его","Carica un'immagine e la nostra IA la classificherà istantaneamente","Upload een afbeelding en onze AI classificeert het direct","Bir görsel yükleyin, yapay zekamız anında sınıflandırsın","Unggah gambar dan AI kami akan langsung mengklasifikasikannya"),
  "upload.drop": t15("Drop your image here","Suelta tu imagen aquí","Déposez votre image ici","Bild hier ablegen","Solte sua imagem aqui","अपनी छवि यहाँ छोड़ें","将图片拖放到此处","画像をここにドロップ","여기에 이미지를 놓으세요","أسقط صورتك هنا","Перетащите изображение сюда","Trascina l'immagine qui","Sleep je afbeelding hierheen","Görselinizi buraya bırakın","Letakkan gambar Anda di sini"),
  "upload.analyze": t15("Analyze Image","Analizar Imagen","Analyser l'Image","Bild Analysieren","Analisar Imagem","छवि का विश्लेषण करें","分析图像","画像を分析","이미지 분석","تحليل الصورة","Анализировать","Analizza Immagine","Afbeelding Analyseren","Görsel Analiz Et","Analisis Gambar"),
  "upload.analyzing": t15("Analyzing...","Analizando...","Analyse...","Analysiere...","Analisando...","विश्लेषण...","分析中...","分析中...","분석 중...","جاري التحليل...","Анализ...","Analisi...","Analyseren...","Analiz ediliyor...","Menganalisis..."),
  "upload.uploadedImage": t15("Uploaded Image","Imagen Subida","Image Téléchargée","Hochgeladenes Bild","Imagem Enviada","अपलोड की गई छवि","已上传图片","アップロード画像","업로드된 이미지","الصورة المرفوعة","Загруженное изображение","Immagine Caricata","Geüploade Afbeelding","Yüklenen Görsel","Gambar Diunggah"),
  "upload.clear": t15("Clear","Borrar","Effacer","Löschen","Limpar","हटाएं","清除","クリア","지우기","مسح","Очистить","Cancella","Wissen","Temizle","Hapus"),
  "upload.result": t15("Classification Result","Resultado de Clasificación","Résultat de Classification","Klassifikationsergebnis","Resultado da Classificação","वर्गीकरण परिणाम","分类结果","分類結果","분류 결과","نتيجة التصنيف","Результат классификации","Risultato Classificazione","Classificatieresultaat","Sınıflandırma Sonucu","Hasil Klasifikasi"),
  "upload.confidence": t15("Confidence","Confianza","Confiance","Konfidenz","Confiança","विश्वास","置信度","信頼度","신뢰도","الثقة","Уверенность","Affidabilità","Betrouwbaarheid","Güven","Kepercayaan"),
  "upload.recyclingBin": t15("Recycling Bin","Contenedor","Bac de Recyclage","Recycling-Tonne","Lixeira","रीसाइक्लिंग बिन","回收箱","リサイクルボックス","재활용 통","صندوق إعادة التدوير","Контейнер","Bidone Riciclo","Recyclebak","Geri Dönüşüm Kutusu","Tempat Daur Ulang"),
  "upload.envImpact": t15("Environmental Impact","Impacto Ambiental","Impact Environnemental","Umweltauswirkungen","Impacto Ambiental","पर्यावरणीय प्रभाव","环境影响","環境影響","환경 영향","التأثير البيئي","Экологическое воздействие","Impatto Ambientale","Milieu-impact","Çevresel Etki","Dampak Lingkungan"),
  "upload.sustainTips": t15("Sustainability Tips","Consejos de Sostenibilidad","Conseils Durables","Nachhaltigkeitstipps","Dicas de Sustentabilidade","स्थिरता सुझाव","可持续发展提示","サステナビリティのヒント","지속가능성 팁","نصائح الاستدامة","Советы по устойчивости","Consigli Sostenibili","Duurzaamheidstips","Sürdürülebilirlik İpuçları","Tips Keberlanjutan"),
  "upload.analyzeAnother": t15("Analyze Another Image","Analizar Otra Imagen","Analyser une Autre Image","Weiteres Bild Analysieren","Analisar Outra Imagem","एक और छवि का विश्लेषण करें","分析另一张图片","別の画像を分析","다른 이미지 분석","تحليل صورة أخرى","Анализировать другое","Analizza un'Altra Immagine","Andere Afbeelding Analyseren","Başka Bir Görsel Analiz Et","Analisis Gambar Lain"),
  "upload.imageError": t15("Please upload an image file","Por favor sube un archivo de imagen","Veuillez télécharger un fichier image","Bitte laden Sie eine Bilddatei hoch","Por favor envie um arquivo de imagem","कृपया एक छवि फ़ाइल अपलोड करें","请上传图片文件","画像ファイルをアップロードしてください","이미지 파일을 업로드하세요","يرجى تحميل ملف صورة","Пожалуйста, загрузите файл изображения","Carica un file immagine","Upload een afbeeldingsbestand","Lütfen bir görsel dosyası yükleyin","Silakan unggah file gambar"),
  "upload.sizeError": t15("File too large (max 10MB)","Archivo demasiado grande (máx 10MB)","Fichier trop volumineux (max 10 Mo)","Datei zu groß (max 10MB)","Arquivo muito grande (máx 10MB)","फ़ाइल बहुत बड़ी है (अधिकतम 10MB)","文件过大（最大10MB）","ファイルが大きすぎます（最大10MB）","파일이 너무 큽니다 (최대 10MB)","الملف كبير جداً (الحد الأقصى 10 ميجابايت)","Файл слишком большой (макс. 10МБ)","File troppo grande (max 10MB)","Bestand te groot (max 10MB)","Dosya çok büyük (maks 10MB)","File terlalu besar (maks 10MB)"),
  "upload.analysisFailed": t15("Analysis failed","Análisis fallido","Échec de l'analyse","Analyse fehlgeschlagen","Análise falhou","विश्लेषण विफल","分析失败","分析に失敗","분석 실패","فشل التحليل","Анализ не удался","Analisi fallita","Analyse mislukt","Analiz başarısız","Analisis gagal"),

  // Chat
  "chat.title": t15("Ask RecycAI","Pregunta a RecycAI","Demandez à RecycAI","Frag RecycAI","Pergunte ao RecycAI","RecycAI से पूछें","询问RecycAI","RecycAIに質問","RecycAI에게 물어보기","اسأل RecycAI","Спросите RecycAI","Chiedi a RecycAI","Vraag RecycAI","RecycAI'ye Sor","Tanya RecycAI"),
  "chat.placeholder": t15("Ask about recycling, sustainability...","Pregunta sobre reciclaje...","Posez vos questions sur le recyclage...","Fragen Sie zum Recycling...","Pergunte sobre reciclagem...","रीसाइक्लिंग के बारे में पूछें...","询问有关回收的问题...","リサイクルについて質問...","재활용에 대해 질문하세요...","اسأل عن إعادة التدوير...","Спросите о переработке...","Chiedi sul riciclo...","Vraag over recycling...","Geri dönüşüm hakkında sorun...","Tanya tentang daur ulang..."),

  // Dashboard
  "dashboard.title": t15("Dashboard","Panel","Tableau de bord","Dashboard","Painel","डैशबोर्ड","仪表板","ダッシュボード","대시보드","لوحة القيادة","Панель","Pannello","Dashboard","Panel","Dasbor"),
  "dashboard.subtitle": t15("Your recycling activity overview","Resumen de tu actividad de reciclaje","Aperçu de votre activité de recyclage","Ihre Recycling-Aktivitätsübersicht","Visão geral da sua atividade de reciclagem","आपकी रीसाइक्लिंग गतिविधि का अवलोकन","您的回收活动概览","リサイクル活動の概要","재활용 활동 개요","نظرة عامة على نشاط إعادة التدوير","Обзор вашей активности переработки","Panoramica della tua attività di riciclo","Overzicht van je recyclingactiviteit","Geri dönüşüm etkinliğinize genel bakış","Ikhtisar aktivitas daur ulang Anda"),
  "dashboard.newUpload": t15("New Upload","Nueva Subida","Nouveau Téléchargement","Neuer Upload","Novo Envio","नया अपलोड","新上传","新規アップロード","새 업로드","رفع جديد","Новая загрузка","Nuovo Caricamento","Nieuwe Upload","Yeni Yükleme","Unggahan Baru"),
  "dashboard.totalUploads": t15("Total Uploads","Total de Subidas","Total de Téléchargements","Gesamte Uploads","Total de Envios","कुल अपलोड","总上传数","総アップロード","총 업로드","إجمالي الرفع","Всего загрузок","Caricamenti Totali","Totale Uploads","Toplam Yükleme","Total Unggahan"),
  "dashboard.mostCommon": t15("Most Common","Más Común","Plus Commun","Häufigste","Mais Comum","सबसे सामान्य","最常见","最も一般的","가장 일반적","الأكثر شيوعاً","Самый частый","Più Comune","Meest Voorkomend","En Yaygın","Paling Umum"),
  "dashboard.avgConfidence": t15("Avg Confidence","Confianza Promedio","Confiance Moyenne","Durchschn. Konfidenz","Confiança Média","औसत विश्वास","平均置信度","平均信頼度","평균 신뢰도","متوسط الثقة","Средняя уверенность","Affidabilità Media","Gem. Betrouwbaarheid","Ort. Güven","Rata-rata Kepercayaan"),
  "dashboard.history": t15("Prediction History","Historial de Predicciones","Historique des Prédictions","Vorhersagenverlauf","Histórico de Previsões","पूर्वानुमान इतिहास","预测历史","予測履歴","예측 이력","سجل التنبؤات","История предсказаний","Cronologia Previsioni","Voorspellingsgeschiedenis","Tahmin Geçmişi","Riwayat Prediksi"),
  "dashboard.noHistory": t15("No predictions yet. Upload your first image!","Aún no hay predicciones. ¡Sube tu primera imagen!","Aucune prédiction. Téléchargez votre première image !","Noch keine Vorhersagen. Laden Sie Ihr erstes Bild hoch!","Nenhuma previsão ainda. Envie sua primeira imagem!","अभी तक कोई भविष्यवाणी नहीं। अपनी पहली छवि अपलोड करें!","还没有预测。上传您的第一张图片！","まだ予測がありません。最初の画像をアップロードしてください！","아직 예측이 없습니다. 첫 번째 이미지를 업로드하세요!","لا توجد تنبؤات بعد. ارفع أول صورة!","Пока нет предсказаний. Загрузите первое изображение!","Nessuna previsione. Carica la tua prima immagine!","Nog geen voorspellingen. Upload je eerste afbeelding!","Henüz tahmin yok. İlk görselinizi yükleyin!","Belum ada prediksi. Unggah gambar pertama Anda!"),
  "dashboard.uploadImage": t15("Upload Image","Subir Imagen","Télécharger Image","Bild Hochladen","Enviar Imagem","छवि अपलोड करें","上传图片","画像をアップロード","이미지 업로드","رفع صورة","Загрузить изображение","Carica Immagine","Afbeelding Uploaden","Görsel Yükle","Unggah Gambar"),
  "dashboard.loading": t15("Loading...","Cargando...","Chargement...","Laden...","Carregando...","लोड हो रहा है...","加载中...","読み込み中...","로딩 중...","جاري التحميل...","Загрузка...","Caricamento...","Laden...","Yükleniyor...","Memuat..."),

  // Login
  "login.title": t15("Welcome back","Bienvenido de nuevo","Bon retour","Willkommen zurück","Bem-vindo de volta","वापसी पर स्वागत है","欢迎回来","おかえりなさい","돌아오신 것을 환영합니다","مرحباً بعودتك","С возвращением","Bentornato","Welkom terug","Tekrar hoş geldiniz","Selamat datang kembali"),
  "login.subtitle": t15("Sign in to your RecycAI account","Inicia sesión en tu cuenta RecycAI","Connectez-vous à votre compte RecycAI","Melden Sie sich bei Ihrem RecycAI-Konto an","Entre na sua conta RecycAI","अपने RecycAI खाते में साइन इन करें","登录您的RecycAI账户","RecycAIアカウントにサインイン","RecycAI 계정에 로그인하세요","سجل الدخول إلى حساب RecycAI","Войдите в свой аккаунт RecycAI","Accedi al tuo account RecycAI","Log in op je RecycAI account","RecycAI hesabınıza giriş yapın","Masuk ke akun RecycAI Anda"),
  "login.google": t15("Continue with Google","Continuar con Google","Continuer avec Google","Weiter mit Google","Continuar com Google","Google से जारी रखें","继续使用Google","Googleで続行","Google로 계속","المتابعة مع Google","Продолжить с Google","Continua con Google","Doorgaan met Google","Google ile Devam Et","Lanjutkan dengan Google"),
  "login.or": t15("or","o","ou","oder","ou","या","或","または","또는","أو","или","o","of","veya","atau"),
  "login.email": t15("Email","Correo electrónico","E-mail","E-Mail","E-mail","ईमेल","电子邮件","メール","이메일","البريد الإلكتروني","Электронная почта","Email","E-mail","E-posta","Email"),
  "login.password": t15("Password","Contraseña","Mot de passe","Passwort","Senha","पासवर्ड","密码","パスワード","비밀번호","كلمة المرور","Пароль","Password","Wachtwoord","Şifre","Kata Sandi"),
  "login.signIn": t15("Sign In","Iniciar Sesión","Se Connecter","Anmelden","Entrar","साइन इन","登录","サインイン","로그인","تسجيل الدخول","Войти","Accedi","Inloggen","Giriş Yap","Masuk"),
  "login.noAccount": t15("Don't have an account?","¿No tienes cuenta?","Pas de compte ?","Kein Konto?","Não tem uma conta?","खाता नहीं है?","没有账户？","アカウントをお持ちでないですか？","계정이 없으신가요?","ليس لديك حساب؟","Нет аккаунта?","Non hai un account?","Geen account?","Hesabınız yok mu?","Belum punya akun?"),
  "login.signUp": t15("Sign up","Regístrate","S'inscrire","Registrieren","Cadastre-se","साइन अप","注册","サインアップ","가입하기","سجل","Зарегистрироваться","Registrati","Aanmelden","Kaydol","Daftar"),

  // Register
  "register.title": t15("Create your account","Crea tu cuenta","Créez votre compte","Erstellen Sie Ihr Konto","Crie sua conta","अपना खाता बनाएं","创建您的账户","アカウントを作成","계정 만들기","أنشئ حسابك","Создайте аккаунт","Crea il tuo account","Maak je account","Hesabınızı oluşturun","Buat akun Anda"),
  "register.subtitle": t15("Join RecycAI and start recycling smarter","Únete a RecycAI y empieza a reciclar mejor","Rejoignez RecycAI et recyclez plus intelligemment","Treten Sie RecycAI bei und recyceln Sie smarter","Junte-se ao RecycAI e recicle melhor","RecycAI से जुड़ें और स्मार्ट रीसाइक्लिंग शुरू करें","加入RecycAI，开始智能回收","RecycAIに参加してスマートリサイクルを始めましょう","RecycAI에 가입하고 스마트 재활용을 시작하세요","انضم إلى RecycAI وابدأ بإعادة التدوير الذكية","Присоединяйтесь к RecycAI и перерабатывайте умнее","Unisciti a RecycAI e ricicla in modo più intelligente","Word lid van RecycAI en recycle slimmer","RecycAI'ye katılın ve akıllı geri dönüşüme başlayın","Bergabung dengan RecycAI dan mulai daur ulang cerdas"),
  "register.name": t15("Full Name","Nombre Completo","Nom Complet","Vollständiger Name","Nome Completo","पूरा नाम","全名","フルネーム","성명","الاسم الكامل","Полное имя","Nome Completo","Volledige Naam","Tam Ad","Nama Lengkap"),
  "register.create": t15("Create Account","Crear Cuenta","Créer un Compte","Konto Erstellen","Criar Conta","खाता बनाएं","创建账户","アカウント作成","계정 만들기","إنشاء حساب","Создать аккаунт","Crea Account","Account Aanmaken","Hesap Oluştur","Buat Akun"),
  "register.hasAccount": t15("Already have an account?","¿Ya tienes cuenta?","Déjà un compte ?","Bereits ein Konto?","Já tem uma conta?","पहले से खाता है?","已有账户？","すでにアカウントをお持ちですか？","이미 계정이 있으신가요?","لديك حساب بالفعل؟","Уже есть аккаунт?","Hai già un account?","Al een account?","Zaten hesabınız var mı?","Sudah punya akun?"),
  "register.signIn": t15("Sign in","Inicia sesión","Se connecter","Anmelden","Entrar","साइन इन","登录","サインイン","로그인","سجل الدخول","Войти","Accedi","Inloggen","Giriş yap","Masuk"),
  "register.passwordMin": t15("Password must be at least 6 characters","La contraseña debe tener al menos 6 caracteres","Le mot de passe doit contenir au moins 6 caractères","Passwort muss mindestens 6 Zeichen haben","A senha deve ter pelo menos 6 caracteres","पासवर्ड कम से कम 6 अक्षर का होना चाहिए","密码至少6个字符","パスワードは6文字以上","비밀번호는 6자 이상이어야 합니다","كلمة المرور 6 أحرف على الأقل","Пароль должен содержать минимум 6 символов","La password deve avere almeno 6 caratteri","Wachtwoord moet minimaal 6 tekens zijn","Şifre en az 6 karakter olmalı","Kata sandi minimal 6 karakter"),
  "register.fillAll": t15("Please fill in all fields","Por favor completa todos los campos","Veuillez remplir tous les champs","Bitte füllen Sie alle Felder aus","Por favor preencha todos os campos","कृपया सभी फ़ील्ड भरें","请填写所有字段","すべてのフィールドを入力してください","모든 필드를 입력하세요","يرجى ملء جميع الحقول","Заполните все поля","Compila tutti i campi","Vul alle velden in","Lütfen tüm alanları doldurun","Silakan isi semua kolom"),
  "register.success": t15("Account created!","¡Cuenta creada!","Compte créé !","Konto erstellt!","Conta criada!","खाता बनाया गया!","账户已创建！","アカウント作成完了！","계정이 생성되었습니다!","تم إنشاء الحساب!","Аккаунт создан!","Account creato!","Account aangemaakt!","Hesap oluşturuldu!","Akun dibuat!"),
  "register.canSignIn": t15("You can now sign in.","Ahora puedes iniciar sesión.","Vous pouvez maintenant vous connecter.","Sie können sich jetzt anmelden.","Agora você pode entrar.","अब आप साइन इन कर सकते हैं।","您现在可以登录了。","サインインできます。","이제 로그인할 수 있습니다.","يمكنك الآن تسجيل الدخول.","Теперь вы можете войти.","Ora puoi accedere.","Je kunt nu inloggen.","Artık giriş yapabilirsiniz.","Anda sekarang bisa masuk."),
  "register.failed": t15("Registration failed","Registro fallido","Échec de l'inscription","Registrierung fehlgeschlagen","Registro falhou","पंजीकरण विफल","注册失败","登録に失敗","등록 실패","فشل التسجيل","Регистрация не удалась","Registrazione fallita","Registratie mislukt","Kayıt başarısız","Pendaftaran gagal"),

  // Home logged-in
  "home.welcomeBack": t15("Welcome back","Bienvenido de nuevo","Bon retour","Willkommen zurück","Bem-vindo de volta","वापसी पर स्वागत","欢迎回来","おかえりなさい","돌아오신 것을 환영합니다","مرحباً بعودتك","С возвращением","Bentornato","Welkom terug","Tekrar hoş geldiniz","Selamat datang kembali"),
  "home.scanWaste": t15("Scan Waste Now","Escanear Residuos","Scanner les Déchets","Abfall Scannen","Escanear Resíduos","कचरा स्कैन करें","扫描废物","廃棄物をスキャン","폐기물 스캔","مسح النفايات","Сканировать отходы","Scansiona Rifiuti","Afval Scannen","Atık Tara","Pindai Sampah"),
  "home.viewDashboard": t15("View Dashboard","Ver Panel","Voir le Tableau","Dashboard Ansehen","Ver Painel","डैशबोर्ड देखें","查看仪表板","ダッシュボード","대시보드 보기","عرض اللوحة","Открыть панель","Vedi Pannello","Dashboard Bekijken","Paneli Görüntüle","Lihat Dasbor"),
  "home.tryNow": t15("Try now","Probar ahora","Essayer","Jetzt testen","Experimentar","अभी आज़माएं","立即尝试","今すぐ試す","지금 사용","جرب الآن","Попробовать","Prova ora","Nu proberen","Şimdi dene","Coba sekarang"),

  // Camera
  "upload.useCamera": t15("Use Camera","Usar Cámara","Utiliser la Caméra","Kamera Verwenden","Usar Câmera","कैमरा उपयोग करें","使用相机","カメラを使用","카메라 사용","استخدم الكاميرا","Использовать камеру","Usa Fotocamera","Camera Gebruiken","Kamera Kullan","Gunakan Kamera"),
  "upload.capture": t15("Capture","Capturar","Capturer","Aufnehmen","Capturar","कैप्चर","拍摄","撮影","캡처","التقاط","Снять","Cattura","Vastleggen","Yakala","Tangkap"),
  "upload.cameraError": t15("Camera access denied","Acceso a cámara denegado","Accès caméra refusé","Kamerazugriff verweigert","Acesso à câmera negado","कैमरा एक्सेस अस्वीकृत","相机访问被拒绝","カメラアクセスが拒否されました","카메라 접근 거부","تم رفض الوصول للكاميرا","Доступ к камере запрещён","Accesso fotocamera negato","Camera toegang geweigerd","Kamera erişimi reddedildi","Akses kamera ditolak"),
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
