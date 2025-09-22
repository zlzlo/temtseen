import type { Language } from "./language-context";

type LanguageRecord<T> = Record<Language, T>;

type NavigationContent = {
  items: { href: string; label: string }[];
  logoAlt: string;
  logoSr: string;
};

type HeroContent = {
  title: string;
  description: string;
  primaryCta: string;
  secondaryCta: string;
};

type AboutContent = {
  title: string;
  description: string;
  stats: string[];
  imageAlt: string;
  cards: { title: string; description: string }[];
};

type Program = {
  id: string;
  title: string;
  level: string;
  duration: string;
  skills: string[];
};

type ProgramsContent = {
  title: string;
  description: string;
  buttonLabel: string;
  programs: Program[];
};

type AdmissionsStep = {
  step: number;
  title: string;
  description: string;
};

type AdmissionsContent = {
  title: string;
  description: string;
  steps: AdmissionsStep[];
  requirementsTitle: string;
  requirementsDescription: string;
  downloadButton: string;
  registerButton: string;
};

type StudentLifeContent = {
  title: string;
  description: string;
  facilities: { title: string; description: string }[];
};

type NewsItem = {
  id: string;
  date: string;
  title: string;
  description: string;
  image: string;
  alt: string;
};

type NewsContent = {
  title: string;
  description: string;
  viewAll: string;
  readMore: string;
  items: NewsItem[];
};

type TestimonialsContent = {
  title: string;
  description: string;
  testimonials: { name: string; program: string; quote: string; initials: string; color: "primary" | "accent" }[];
};

type PartnershipsContent = {
  title: string;
  description: string;
};

type FaqContent = {
  title: string;
  description: string;
  items: { question: string; answer: string }[];
};

type ContactContent = {
  title: string;
  description: string;
  formTitle: string;
  fields: {
    name: string;
    phone: string;
    email: string;
    message: string;
  };
  submit: {
    idle: string;
    loading: string;
  };
  infoTitle: string;
  infoItems: { title: string; value: string }[];
  map: {
    placeholder: string;
    coordinates: string;
  };
  toast: {
    successTitle: string;
    successDescription: string;
    errorTitle: string;
    requiredFields: string;
    invalidEmail: string;
    submitError: string;
  };
};

type FooterContent = {
  title: string;
  description: string;
  quickLinksTitle: string;
  quickLinks: { href: string; label: string }[];
  contactTitle: string;
  contactInfo: string[];
  copyright: string;
};

type LanguageSwitcherContent = {
  groupLabel: string;
  optionLabels: Record<Language, string>;
  optionShort: Record<Language, string>;
};

type AppTranslations = {
  languageSwitcher: LanguageRecord<LanguageSwitcherContent>;
  navigation: LanguageRecord<NavigationContent>;
  hero: LanguageRecord<HeroContent>;
  about: LanguageRecord<AboutContent>;
  programs: LanguageRecord<ProgramsContent>;
  admissions: LanguageRecord<AdmissionsContent>;
  studentLife: LanguageRecord<StudentLifeContent>;
  news: LanguageRecord<NewsContent>;
  testimonials: LanguageRecord<TestimonialsContent>;
  partnerships: LanguageRecord<PartnershipsContent>;
  faq: LanguageRecord<FaqContent>;
  contact: LanguageRecord<ContactContent>;
  footer: LanguageRecord<FooterContent>;
};

export const translations: AppTranslations = {
  languageSwitcher: {
    mn: {
      groupLabel: "Хэл сонгох",
      optionLabels: {
        mn: "Монгол хэл",
        en: "Англи хэл"
      },
      optionShort: {
        mn: "MN",
        en: "EN"
      }
    },
    en: {
      groupLabel: "Select language",
      optionLabels: {
        mn: "Mongolian",
        en: "English"
      },
      optionShort: {
        mn: "MN",
        en: "EN"
      }
    }
  },
  navigation: {
    mn: {
      items: [
        { href: "#home", label: "Нүүр" },
        { href: "#about", label: "Бидний тухай" },
        { href: "#programs", label: "Хөтөлбөрүүд" },
        { href: "#admissions", label: "Элсэлт" },
        { href: "#student-life", label: "Оюутны амьдрал" },
        { href: "#news", label: "Мэдээ" },
        { href: "#partnerships", label: "Түншлэл" },
        { href: "#faq", label: "Асуулт" },
        { href: "#contact", label: "Холбоо барих" }
      ],
      logoAlt: "Мандах Их Сургууль эмблем",
      logoSr: "Мандах Их Сургууль"
    },
    en: {
      items: [
        { href: "#home", label: "Home" },
        { href: "#about", label: "About" },
        { href: "#programs", label: "Programs" },
        { href: "#admissions", label: "Admissions" },
        { href: "#student-life", label: "Student Life" },
        { href: "#news", label: "News" },
        { href: "#partnerships", label: "Partnerships" },
        { href: "#faq", label: "FAQ" },
        { href: "#contact", label: "Contact" }
      ],
      logoAlt: "Mandakh University emblem",
      logoSr: "Mandakh University"
    }
  },
  hero: {
    mn: {
      title: "Ирээдүйгээ Мандах-аас эхлүүлье.",
      description:
        "Мандах Их Сургууль — санхүү, мэдээллийн технологи, бизнесийн чиглэлийн чанартай боловсролыг олон улсын стандарттай уялдуулан олгоно.",
      primaryCta: "Элсэлтийн мэдээлэл",
      secondaryCta: "Хөтөлбөрүүдийг үзэх"
    },
    en: {
      title: "Start your future at Mandakh.",
      description:
        "Mandakh University delivers high-quality education in finance, information technology, and business aligned with international standards.",
      primaryCta: "Admissions information",
      secondaryCta: "Explore programs"
    }
  },
  about: {
    mn: {
      title: "Бидний тухай",
      description:
        "1992 оноос эхтэй уламжлалт сургалтын арга зүйг дижитал шилжилттэй хослуулж, хөдөлмөрийн зах зээлд бэлэн, ёс зүйтэй, бүтээлч мэргэжилтэн бэлтгэнэ.",
      stats: ["30+ жилийн туршлага", "5000+ төгсөгч"],
      imageAlt: "Их сургуулийн кампус",
      cards: [
        {
          title: "Эрхэм зорилго",
          description: "Чанартай боловсролоор нийгмийн хөгжилд хувь нэмэр оруулах."
        },
        {
          title: "Алсын хараа",
          description: "Судалгаа, инновацаар тэргүүлсэн их сургууль."
        },
        {
          title: "Үнэт зүйлс",
          description: "Оюунлаг байдал • Шударга ёс • Хамтын хөгжил."
        }
      ]
    },
    en: {
      title: "About us",
      description:
        "Since 1992 we have blended time-tested teaching with digital transformation to prepare ethical, creative professionals who are ready for the job market.",
      stats: ["30+ years of experience", "5000+ graduates"],
      imageAlt: "University campus",
      cards: [
        {
          title: "Mission",
          description: "Contribute to society through high-quality education."
        },
        {
          title: "Vision",
          description: "A university leading through research and innovation."
        },
        {
          title: "Values",
          description: "Intellectual curiosity • Integrity • Collective growth."
        }
      ]
    }
  },
  programs: {
    mn: {
      title: "Хөтөлбөрүүд",
      description: "Олон улсын стандарттай нийцсэн хөтөлбөрүүдийг сонгон суралцаарай",
      buttonLabel: "Дэлгэрэнгүй",
      programs: [
        {
          id: "finance",
          title: "Санхүүгийн менежмент",
          level: "Бакалавр",
          duration: "4 жил • Өдрийн",
          skills: ["Санхүүгийн шинжилгээ", "Тайлагнал боловсруулах", "Өгөгдөлд суурилсан шийдвэр"]
        },
        {
          id: "information-systems",
          title: "Мэдээллийн систем",
          level: "Бакалавр",
          duration: "4 жил • Өдрийн/Оройн",
          skills: ["Веб хөгжүүлэлт", "Өгөгдлийн сан", "Автомажуулалт"]
        },
        {
          id: "business-management",
          title: "Бизнесийн удирдлага",
          level: "Магистр",
          duration: "1.5 жил • Оройн",
          skills: ["Стратеги боловсруулах", "Манлайлал", "Аналитик ур чадвар"]
        }
      ]
    },
    en: {
      title: "Academic programs",
      description: "Choose from programs aligned with international standards.",
      buttonLabel: "Learn more",
      programs: [
        {
          id: "finance",
          title: "Financial Management",
          level: "Bachelor",
          duration: "4 years • Daytime",
          skills: ["Financial analysis", "Reporting preparation", "Data-driven decisions"]
        },
        {
          id: "information-systems",
          title: "Information Systems",
          level: "Bachelor",
          duration: "4 years • Daytime/Evening",
          skills: ["Web development", "Databases", "Automation"]
        },
        {
          id: "business-management",
          title: "Business Administration",
          level: "Master",
          duration: "1.5 years • Evening",
          skills: ["Strategy development", "Leadership", "Analytical skills"]
        }
      ]
    }
  },
  admissions: {
    mn: {
      title: "Элсэлт",
      description: "Элсэлтийн үйл явц, шаардлага, хугацаа",
      steps: [
        {
          step: 1,
          title: "Бүртгүүлэх",
          description: "Онлайн бүртгэл хийх, хувийн мэдээлэл оруулах"
        },
        {
          step: 2,
          title: "Бичиг баримт",
          description: "Шаардлагатай баримтуудыг бүрдүүлэх"
        },
        {
          step: 3,
          title: "Шалгалт/Ярилцлага",
          description: "Элсэлтийн шалгалт болон ярилцлага"
        },
        {
          step: 4,
          title: "Элсэлт баталгаажуулах",
          description: "Элсэн орох эрхийг баталгаажуулах"
        }
      ],
      requirementsTitle: "Шаардлагатай баримтууд",
      requirementsDescription:
        "Онлайн бүртгэл нээлттэй. Бүрдүүлэх материал: иргэний үнэмлэх, цээж зураг, ЭЕШ оноо/дунд сургуулийн голч дүн, цахим төлбөрийн баримт.",
      downloadButton: "Элсэлтийн журам (PDF)",
      registerButton: "Онлайн бүртгүүлэх"
    },
    en: {
      title: "Admissions",
      description: "Process, requirements, and deadlines",
      steps: [
        {
          step: 1,
          title: "Register",
          description: "Complete online registration and submit personal details"
        },
        {
          step: 2,
          title: "Documents",
          description: "Prepare the required documents"
        },
        {
          step: 3,
          title: "Exam/Interview",
          description: "Admissions exam and interview"
        },
        {
          step: 4,
          title: "Confirm enrollment",
          description: "Confirm your offer and enrollment"
        }
      ],
      requirementsTitle: "Required documents",
      requirementsDescription:
        "Online registration is open. Prepare these materials: national ID, ID photo, entrance exam scores or high school GPA, and digital payment receipt.",
      downloadButton: "Admissions guidelines (PDF)",
      registerButton: "Register online"
    }
  },
  studentLife: {
    mn: {
      title: "Оюутны амьдрал",
      description:
        "Клуб, клубууд; тэтгэлэг; дотуур байр; номын сан; спортын заал; инновацын лаборатори—оюутны хөгжлийг бүх талаар дэмжинэ.",
      facilities: [
        { title: "Клуб, клубууд", description: "Спорт, урлаг, шинжлэх ухааны 20 гаруй клуб" },
        { title: "Тэтгэлэг", description: "Гүйцэтгэл, нийгмийн байдлаар олгогддог тэтгэлэг" },
        { title: "Дотуур байр", description: "Орчин үеийн дотуур байр, тав тухтай орчин" },
        { title: "Номын сан", description: "100,000 гаруй ном, цахим нөөц, суралцах орчин" },
        { title: "Инновацын лаборатори", description: "Орчин үеийн тоног төхөөрөмж, практик сургалт" },
        { title: "Спортын заал", description: "Орчин үеийн спортын байгууламж, фитнесс төв" }
      ]
    },
    en: {
      title: "Student life",
      description:
        "Clubs, scholarships, dormitories, library, sports hall, and an innovation lab—all supporting student development from every angle.",
      facilities: [
        { title: "Clubs & societies", description: "Over 20 clubs for sports, arts, and science" },
        { title: "Scholarships", description: "Performance- and need-based scholarships" },
        { title: "Dormitory", description: "Modern dormitory with a comfortable environment" },
        { title: "Library", description: "100,000+ books, digital resources, and study areas" },
        { title: "Innovation lab", description: "Hands-on training with modern equipment" },
        { title: "Sports hall", description: "Modern sports facilities and fitness center" }
      ]
    }
  },
  news: {
    mn: {
      title: "Мэдээ ба Үйл явдал",
      description: "Сүүлийн үеийн мэдээ, үйл явдлууд",
      viewAll: "Бүгдийг харах",
      readMore: "Дэлгэрэнгүй унших",
      items: [
        {
          id: "research-conference",
          date: "2025.02.15",
          title: "Эрдэм шинжилгээний хурал 2025",
          description: "Санхүү ба AI чиглэлийн илтгэлүүд, олон улсын судлаачдын оролцоотой...",
          image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          alt: "Эрдэм шинжилгээний хурлын танилцуулга"
        },
        {
          id: "open-house",
          date: "2025.02.20",
          title: "Нээлттэй хаалганы өдөр",
          description: "Кампус танилцуулга, демо хичээл, зөвлөгөө авах боломжтой...",
          image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          alt: "Их сургуулийн нээлттэй хаалганы өдөр"
        },
        {
          id: "graduation",
          date: "2025.01.25",
          title: "2024-2025 оны төгсөлтийн ёслол",
          description: "500 гаруй төгсөгч дипломоо гардуулж авлаа...",
          image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          alt: "Төгсөлтийн ёслол"
        }
      ]
    },
    en: {
      title: "News & events",
      description: "Latest updates and happenings",
      viewAll: "View all",
      readMore: "Read more",
      items: [
        {
          id: "research-conference",
          date: "2025.02.15",
          title: "Research Conference 2025",
          description: "Finance and AI presentations featuring international researchers...",
          image: "https://images.unsplash.com/photo-1591115765373-5207764f72e7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          alt: "Research conference presentation"
        },
        {
          id: "open-house",
          date: "2025.02.20",
          title: "Open House Day",
          description: "Campus tours, demo classes, and advising opportunities...",
          image: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          alt: "University open house day"
        },
        {
          id: "graduation",
          date: "2025.01.25",
          title: "2024–2025 Commencement Ceremony",
          description: "Over 500 graduates proudly received their diplomas...",
          image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=400",
          alt: "Graduation ceremony"
        }
      ]
    }
  },
  testimonials: {
    mn: {
      title: "Төгсөгчдийн сэтгэгдэл",
      description: "Манай төгсөгчид хэлэх үг",
      testimonials: [
        {
          name: "Б.Анударь",
          program: "Санхүү 2023",
          quote: "Ажилд гарах бэлтгэлтэй болгосон практик курсууд надад их тус болсон.",
          initials: "Б.А",
          color: "primary"
        },
        {
          name: "Т.Баярмаа",
          program: "Мэдээллийн систем 2022",
          quote: "Орчин үеийн технологийн мэдлэг, практик туршлага олж авсан.",
          initials: "Т.Б",
          color: "accent"
        },
        {
          name: "Д.Ганбат",
          program: "MBA 2021",
          quote: "Удирдлагын чадварыг хөгжүүлэх боломж олдсон нь миний карьерт чухал үүрэг гүйцэтгэсэн.",
          initials: "Д.Г",
          color: "primary"
        }
      ]
    },
    en: {
      title: "Alumni stories",
      description: "What our graduates say",
      testimonials: [
        {
          name: "B. Anudari",
          program: "Finance, Class of 2023",
          quote: "The practical courses prepared me well for the workforce.",
          initials: "Б.А",
          color: "primary"
        },
        {
          name: "T. Bayarmaa",
          program: "Information Systems, Class of 2022",
          quote: "I gained up-to-date tech knowledge and hands-on experience.",
          initials: "Т.Б",
          color: "accent"
        },
        {
          name: "D. Ganbat",
          program: "MBA, Class of 2021",
          quote: "Opportunities to grow leadership skills made a big difference in my career.",
          initials: "Д.Г",
          color: "primary"
        }
      ]
    }
  },
  partnerships: {
    mn: {
      title: "Түншлэл",
      description: "Олон улсын их сургуулиуд болон компаниудтай хамтран ажилладаг"
    },
    en: {
      title: "Partnerships",
      description: "We collaborate with international universities and companies"
    }
  },
  faq: {
    mn: {
      title: "Түгээмэл асуулт",
      description: "Их асуугддаг асуултууд болон хариултууд",
      items: [
        {
          question: "Сургалтын төлбөрийг хэрхэн төлөх вэ?",
          answer: "Капитал банкны гүйлгээ, картаар болон цахимаар хуваан төлөх боломжтой."
        },
        {
          question: "Тэтгэлэгт хөтөлбөр байдаг уу?",
          answer: "Гүйцэтгэл, нийгмийн идэвх, тусгай шаардлагаар зарлагддаг."
        },
        {
          question: "Дотуур байранд байрлах боломжтой юу?",
          answer: "Тийм ээ, орчин үеийн дотуур байр байгаа бөгөөд хүсэлт гаргаж болно."
        },
        {
          question: "Гадаад улсын оюутан элсэх боломжтой юу?",
          answer:
            "Тийм ээ, олон улсын оюутнуудыг хүлээн авдаг. Тусгай шаардлага хангах шаардлагатай."
        },
        {
          question: "Ажилд ороход туслалцаа үзүүлдэг үү?",
          answer: "Карьер хөгжлийн алба тусгайлан байгуулагдаж, ажлын байртай холбож өгдөг."
        },
        {
          question: "Онлайн сургалт явуулдаг уу?",
          answer: "Гибрид хэлбэрээр онлайн болон танхимын сургалтыг хослуулан явуулдаг."
        }
      ]
    },
    en: {
      title: "Frequently asked questions",
      description: "Answers to the questions we hear most often",
      items: [
        {
          question: "How can I pay tuition fees?",
          answer: "Pay via Capital Bank transfer, card payment, or online installments."
        },
        {
          question: "Are scholarships available?",
          answer: "Yes, based on performance, community involvement, and special criteria."
        },
        {
          question: "Is on-campus housing available?",
          answer: "Yes, we offer a modern dormitory and you can apply for a room."
        },
        {
          question: "Can international students enroll?",
          answer: "Absolutely, we welcome international students who meet the requirements."
        },
        {
          question: "Do you help students find jobs?",
          answer: "Our career center connects students with employment opportunities."
        },
        {
          question: "Do you offer online classes?",
          answer: "We provide hybrid learning that combines online and in-person classes."
        }
      ]
    }
  },
  contact: {
    mn: {
      title: "Холбоо барих",
      description: "Асуулт байвал бидэнтэй холбогдоорой",
      formTitle: "Мессеж илгээх",
      fields: {
        name: "Нэр",
        phone: "Утас",
        email: "Имэйл",
        message: "Зурвас"
      },
      submit: {
        idle: "Илгээх",
        loading: "Илгээж байна..."
      },
      infoTitle: "Холбоо барих мэдээлэл",
      infoItems: [
        { title: "Хаяг", value: "Улаанбаатар, Монгол Улс" },
        { title: "Утас", value: "+976 ..." },
        { title: "Имэйл", value: "info@mandakh.edu.mn" },
        { title: "Ажлын цаг", value: "Даваа–Баасан 09:00–18:00" }
      ],
      map: {
        placeholder: "Google Maps Placeholder",
        coordinates: "Координат: Улаанбаатар хот"
      },
      toast: {
        successTitle: "Амжилттай",
        successDescription: "Таны мессеж амжилттай илгээгдлээ!",
        errorTitle: "Алдаа",
        requiredFields: "Бүх шаардлагатай талбарыг бөглөнө үү",
        invalidEmail: "Зөв имэйл хаяг оруулна уу",
        submitError: "Мессеж илгээхэд алдаа гарлаа"
      }
    },
    en: {
      title: "Contact us",
      description: "Reach out with any questions",
      formTitle: "Send a message",
      fields: {
        name: "Name",
        phone: "Phone",
        email: "Email",
        message: "Message"
      },
      submit: {
        idle: "Send",
        loading: "Sending..."
      },
      infoTitle: "Contact information",
      infoItems: [
        { title: "Address", value: "Ulaanbaatar, Mongolia" },
        { title: "Phone", value: "+976 ..." },
        { title: "Email", value: "info@mandakh.edu.mn" },
        { title: "Office hours", value: "Monday–Friday 09:00–18:00" }
      ],
      map: {
        placeholder: "Google Maps placeholder",
        coordinates: "Coordinates: Ulaanbaatar city"
      },
      toast: {
        successTitle: "Success",
        successDescription: "Your message was sent successfully!",
        errorTitle: "Error",
        requiredFields: "Please fill in all required fields",
        invalidEmail: "Please enter a valid email address",
        submitError: "Something went wrong while sending your message"
      }
    }
  },
  footer: {
    mn: {
      title: "Мандах Их Сургууль",
      description:
        "1992 оноос эхтэй уламжлалт сургалтын арга зүйг дижитал шилжилттэй хослуулж, хөдөлмөрийн зах зээлд бэлэн, ёс зүйтэй, бүтээлч мэргэжилтэн бэлтгэнэ.",
      quickLinksTitle: "Хурдан линкүүд",
      quickLinks: [
        { href: "#about", label: "Бидний тухай" },
        { href: "#programs", label: "Хөтөлбөрүүд" },
        { href: "#admissions", label: "Элсэлт" },
        { href: "#student-life", label: "Оюутны амьдрал" },
        { href: "#contact", label: "Холбоо барих" }
      ],
      contactTitle: "Холбогдох",
      contactInfo: [
        "+976 ...",
        "info@mandakh.edu.mn",
        "Улаанбаатар, Монгол Улс",
        "Даваа–Баасан 09:00–18:00"
      ],
      copyright: "© 2025 Мандах Их Сургууль. Бүх эрх хуулиар хамгаалагдсан."
    },
    en: {
      title: "Mandakh University",
      description:
        "Since 1992 we have blended tradition and digital transformation to graduate ethical, creative professionals who are ready for the job market.",
      quickLinksTitle: "Quick links",
      quickLinks: [
        { href: "#about", label: "About" },
        { href: "#programs", label: "Programs" },
        { href: "#admissions", label: "Admissions" },
        { href: "#student-life", label: "Student Life" },
        { href: "#contact", label: "Contact" }
      ],
      contactTitle: "Get in touch",
      contactInfo: [
        "+976 ...",
        "info@mandakh.edu.mn",
        "Ulaanbaatar, Mongolia",
        "Monday–Friday 09:00–18:00"
      ],
      copyright: "© 2025 Mandakh University. All rights reserved."
    }
  }
};

export type SectionTranslations = typeof translations;
