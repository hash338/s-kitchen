import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "en" | "ar";

const STORAGE_KEY = "s-kitchen-lang";

/** Titles/headings stay in English on purpose (brand requirement). */
const dict = {
  // header / nav
  "nav.home": { en: "Home", ar: "الرئيسية" },
  "nav.menu": { en: "Menu", ar: "القائمة" },
  "nav.cart": { en: "Cart", ar: "السلة" },
  "nav.order": { en: "Order", ar: "الطلب" },
  "nav.openMenu": { en: "Open menu", ar: "افتح القائمة" },

  // language popup
  "lang.title": { en: "Choose your language", ar: "اختر لغتك" },
  "lang.desc": {
    en: "Pick the language you prefer. You can change it later from the top bar.",
    ar: "اختر اللغة التي تفضلها. يمكنك تغييرها لاحقاً من الشريط العلوي.",
  },
  "lang.english": { en: "English", ar: "English" },
  "lang.arabic": { en: "العربية", ar: "العربية" },

  // home
  "home.eyebrow": { en: "Saksakiyeh · Lebanon", ar: "السكسكية · لبنان" },
  "home.heroSub": {
    en: "Choose your dishes, tell us takeaway or delivery, and we handle the rest.",
    ar: "اختر أطباقك، خبّرنا استلام أو توصيل، ونحن نتولى الباقي.",
  },
  "home.tagline": {
    en: "Lebanese home cooking, made fresh every day",
    ar: "طبخ منزلي لبناني، طازج كل يوم",
  },
  "home.seeMenu": { en: "See the menu", ar: "شاهد القائمة" },
  "home.whatsapp": { en: "WhatsApp us", ar: "راسلنا على واتساب" },
  "home.card1.title": { en: "Delivery or takeaway", ar: "توصيل أو استلام" },
  "home.card1.text": {
    en: "Pick what suits you at checkout.",
    ar: "اختر ما يناسبك عند إتمام الطلب.",
  },
  "home.card2.title": { en: "Cooked to order", ar: "يُطبخ عند الطلب" },
  "home.card2.text": { en: "Everything is made fresh, daily.", ar: "كل شيء يُحضّر طازجاً يومياً." },
  "home.card3.text": { en: "Find us on the map.", ar: "جدنا على الخريطة." },
  "home.fullMenu": { en: "Full menu", ar: "كل القائمة" },
  "common.soldOut": { en: "Sold out", ar: "نفذت الكمية" },

  // menu
  "menu.sub": {
    en: "Everything is cooked fresh. Add what you like, then head to your cart.",
    ar: "كل شيء يُطبخ طازجاً. أضف ما يعجبك، ثم انتقل إلى سلتك.",
  },
  "menu.all": { en: "All", ar: "الكل" },
  "menu.empty": {
    en: "The menu is being updated. Please check back soon.",
    ar: "القائمة قيد التحديث. يرجى العودة قريباً.",
  },
  "menu.add": { en: "Add", ar: "أضف" },
  "menu.added": { en: "added to your cart", ar: "أضيف إلى سلتك" },

  // cart
  "cart.empty": { en: "Your cart is empty.", ar: "سلتك فارغة." },
  "cart.browse": { en: "Browse the menu", ar: "تصفّح القائمة" },
  "cart.each": { en: "each", ar: "للواحدة" },
  "cart.total": { en: "Total", ar: "المجموع" },
  "cart.clear": { en: "Clear cart", ar: "إفراغ السلة" },
  "cart.continue": { en: "Continue to order", ar: "متابعة إلى الطلب" },

  // order
  "order.sub": {
    en: "Tell us who you are and how you want your food.",
    ar: "خبّرنا مين انت وكيف بتحب توصلك الأكلة.",
  },
  "order.summary": { en: "Order summary", ar: "ملخص الطلب" },
  "order.addDishes": { en: "Add some dishes", ar: "أضف بعض الأطباق" },
  "order.name": { en: "Your name", ar: "اسمك" },
  "order.phone": { en: "Phone number", ar: "رقم الهاتف" },
  "order.how": { en: "How do you want it?", ar: "كيف بتحبها؟" },
  "order.takeaway": { en: "Takeaway", ar: "استلام" },
  "order.delivery": { en: "Delivery", ar: "توصيل" },
  "order.deliveryDetails": { en: "Delivery details", ar: "تفاصيل التوصيل" },
  "order.locationLabel": { en: "Your location on the map", ar: "موقعك على الخريطة" },
  "order.useLocation": { en: "Use my current location", ar: "استخدم موقعي الحالي" },
  "order.updateLocation": { en: "Update my location", ar: "حدّث موقعي" },
  "order.locationHint": {
    en: "Optional, but it helps the driver find you faster.",
    ar: "اختياري، لكنه يساعد الموصّل يوصل إليك أسرع.",
  },
  "order.openMaps": { en: "Open in Google Maps", ar: "افتح في خرائط جوجل" },
  "order.building": { en: "Building name", ar: "اسم البناية" },
  "order.floor": { en: "Floor", ar: "الطابق" },
  "order.side": { en: "Which side of the floor?", ar: "أي جهة من الطابق؟" },
  "order.choose": { en: "Choose…", ar: "اختر…" },
  "order.right": { en: "Right", ar: "يمين" },
  "order.left": { en: "Left", ar: "شمال" },
  "order.notes": { en: "Notes (optional)", ar: "ملاحظات (اختياري)" },
  "order.submit": { en: "Submit order", ar: "إرسال الطلب" },
  "order.err.name": { en: "Please enter your name", ar: "يرجى إدخال اسمك" },
  "order.err.phone": { en: "Please enter a valid phone number", ar: "يرجى إدخال رقم هاتف صحيح" },
  "order.err.phoneChars": {
    en: "Phone can only contain numbers and + - ( )",
    ar: "رقم الهاتف يقبل أرقام و + - ( ) فقط",
  },
  "order.err.building": { en: "Building name is required", ar: "اسم البناية مطلوب" },
  "order.err.floor": { en: "Floor is required", ar: "الطابق مطلوب" },
  "order.err.side": { en: "Please choose right or left", ar: "يرجى اختيار يمين أو شمال" },
  "order.err.cart": { en: "Your cart is empty", ar: "سلتك فارغة" },
  "order.err.geoUnsupported": {
    en: "Your browser does not support location sharing",
    ar: "متصفحك لا يدعم مشاركة الموقع",
  },
  "order.geoOk": { en: "Location captured", ar: "تم تحديد الموقع" },
  "order.geoFail": {
    en: "Could not get your location. Please allow location access.",
    ar: "لم نتمكن من تحديد موقعك. يرجى السماح بالوصول إلى الموقع.",
  },
  "order.sendFail": {
    en: "We couldn't send your order. Please try again.",
    ar: "لم نتمكن من إرسال طلبك. يرجى المحاولة مرة أخرى.",
  },
  "order.sent": {
    en: "Order sent! We will call you to confirm.",
    ar: "تم إرسال الطلب! رح نتصل بك للتأكيد.",
  },

  // footer
  "footer.contact": { en: "Contact", ar: "تواصل" },
  "footer.follow": { en: "Follow", ar: "تابعنا" },
  "footer.rights": { en: "HASAN YOUNES", ar: "HASAN YOUNES" },
  "footer.call": { en: "Call", ar: "اتصال" },
  "footer.callPrompt": { en: "Call or WhatsApp", ar: "اتصال أو واتساب" },
  "footer.whatsapp": { en: "Open with WhatsApp", ar: "افتح بواتساب" },
} satisfies Record<string, { en: string; ar: string }>;

export type TKey = keyof typeof dict;

type Ctx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (key: TKey) => string;
  ready: boolean;
};

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "ar" || stored === "en") setLangState(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  const t = useCallback((key: TKey) => dict[key][lang], [lang]);

  const value = useMemo(() => ({ lang, setLang, t, ready }), [lang, setLang, t, ready]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLang must be used inside LanguageProvider");
  return ctx;
}

export function hasChosenLanguage() {
  try {
    return Boolean(window.localStorage.getItem(STORAGE_KEY));
  } catch {
    return true;
  }
}
