import Sanscript from "@indic-transliteration/sanscript";
import type { UILang, LangText } from "../i18n";

/** Nitya Shloka — a Bhagavad Gita verse per day. Stored once in IAST and
 * transliterated into the selected language's script at render. */
export type Shloka = { ref: string; iast: string; meaning: LangText };

const LANG_SCRIPT: Record<UILang, string> = {
  en: "iast", hi: "devanagari", te: "telugu", ta: "tamil", kn: "kannada",
  ml: "malayalam", gu: "gujarati", bn: "bengali", pa: "devanagari", mr: "devanagari",
};

export function verseInScript(iast: string, lang: UILang): string {
  const to = LANG_SCRIPT[lang] ?? "devanagari";
  if (to === "iast") return iast;
  try { return Sanscript.t(iast, "iast", to); } catch { return iast; }
}

export const SHLOKAS: Shloka[] = [
  {
    "ref": "2.47",
    "iast": "karmaṇyevādhikāraste mā phaleṣu kadācana",
    "meaning": {
      "en": "You have a right to your action alone, never to its fruits. Let not the fruit be your motive, nor cling to inaction.",
      "te": "నీకు కర్మపై మాత్రమే అధికారం, ఫలితంపై కాదు. ఫలితమే ప్రేరణ కావద్దు, కర్మను విడువవద్దు."
    }
  },
  {
    "ref": "2.48",
    "iast": "yogasthaḥ kuru karmāṇi saṅgaṃ tyaktvā dhanañjaya",
    "meaning": {
      "en": "Established in yoga, do your work, letting go of attachment — even-minded in success and failure. That equanimity is yoga.",
      "te": "యోగంలో నిలిచి, ఆసక్తిని వదిలి కర్మ చేయి; జయాపజయాల్లో సమంగా ఉండటమే యోగం."
    }
  },
  {
    "ref": "4.7",
    "iast": "yadā yadā hi dharmasya glānir bhavati bhārata",
    "meaning": {
      "en": "Whenever dharma declines and adharma rises, O Bharata, I manifest Myself.",
      "te": "ధర్మం క్షీణించి అధర్మం పెరిగినప్పుడల్లా, ఓ భారతా, నేను అవతరిస్తాను."
    }
  },
  {
    "ref": "4.8",
    "iast": "paritrāṇāya sādhūnāṃ vināśāya ca duṣkṛtām",
    "meaning": {
      "en": "To protect the good, to end the wicked, and to re-establish dharma, I am born in every age.",
      "te": "సాధువులను రక్షించి, దుష్టులను నశింపజేసి, ధర్మాన్ని స్థాపించడానికి యుగయుగాన అవతరిస్తాను."
    }
  },
  {
    "ref": "2.20",
    "iast": "na jāyate mriyate vā kadācin nāyaṃ bhūtvā bhavitā na bhūyaḥ",
    "meaning": {
      "en": "The soul is never born and never dies; unborn and eternal, it is not slain when the body is slain.",
      "te": "ఆత్మ ఎప్పుడూ పుట్టదు, చావదు; శరీరం నశించినా ఆత్మ నశించదు."
    }
  },
  {
    "ref": "2.23",
    "iast": "nainaṃ chindanti śastrāṇi nainaṃ dahati pāvakaḥ",
    "meaning": {
      "en": "Weapons cannot cut the soul, fire cannot burn it, water cannot wet it, wind cannot dry it.",
      "te": "ఆత్మను ఆయుధాలు ఛేదించలేవు, అగ్ని కాల్చలేదు, నీరు తడపలేదు, గాలి ఆర్పలేదు."
    }
  },
  {
    "ref": "2.13",
    "iast": "dehino'smin yathā dehe kaumāraṃ yauvanaṃ jarā",
    "meaning": {
      "en": "As the embodied soul passes through childhood, youth and age in this body, so it passes to another body — the wise are not deluded.",
      "te": "దేహధారికి ఈ శరీరంలో బాల్యం, యౌవనం, వృద్ధాప్యం ఎలా వస్తాయో, అలాగే మరో దేహం లభిస్తుంది — ధీరులు మోహపడరు."
    }
  },
  {
    "ref": "2.22",
    "iast": "vāsāṃsi jīrṇāni yathā vihāya navāni gṛhṇāti naro'parāṇi",
    "meaning": {
      "en": "As a person casts off worn-out clothes and puts on new ones, so the soul casts off worn-out bodies and takes on new.",
      "te": "చిరిగిన వస్త్రాలను విడిచి కొత్తవి ధరించినట్లు, ఆత్మ జీర్ణమైన దేహాలను విడిచి కొత్త దేహాలను ధరిస్తుంది."
    }
  },
  {
    "ref": "2.27",
    "iast": "jātasya hi dhruvo mṛtyur dhruvaṃ janma mṛtasya ca",
    "meaning": {
      "en": "For the born, death is certain; for the dead, birth is certain. So you should not grieve over the inevitable.",
      "te": "పుట్టినవాడికి మరణం నిశ్చయం, చనిపోయినవాడికి జన్మ నిశ్చయం. కనుక తప్పనిదానికి దుఃఖించకూడదు."
    }
  },
  {
    "ref": "2.40",
    "iast": "nehābhikramanāśo'sti pratyavāyo na vidyate",
    "meaning": {
      "en": "On this path no effort is ever lost and no harm is done; even a little of this dharma protects from great fear.",
      "te": "ఈ మార్గంలో చేసిన ప్రయత్నం వృథా కాదు, హాని ఉండదు; ఈ ధర్మం కొంచెమైనా గొప్ప భయం నుండి కాపాడుతుంది."
    }
  },
  {
    "ref": "2.56",
    "iast": "duḥkheṣvanudvignamanāḥ sukheṣu vigataspṛhaḥ",
    "meaning": {
      "en": "One unshaken in sorrow and without craving in joy, free of attachment, fear and anger, is called a sage of steady wisdom.",
      "te": "దుఃఖంలో కలత చెందని, సుఖంలో ఆశ లేని, రాగ-భయ-క్రోధాలు లేనివాడే స్థితప్రజ్ఞుడు."
    }
  },
  {
    "ref": "2.62–63",
    "iast": "dhyāyato viṣayān puṃsaḥ saṅgasteṣūpajāyate",
    "meaning": {
      "en": "Brooding on objects breeds attachment; attachment breeds desire; desire breeds anger; anger clouds judgment.",
      "te": "విషయాలపై ధ్యానం ఆసక్తిని, ఆసక్తి కోరికను, కోరిక క్రోధాన్ని పుట్టిస్తుంది; క్రోధం వివేకాన్ని కప్పుతుంది."
    }
  },
  {
    "ref": "2.69",
    "iast": "yā niśā sarvabhūtānāṃ tasyāṃ jāgarti saṃyamī",
    "meaning": {
      "en": "What is night for all beings is the waking time of the self-controlled; what beings wake to is night for the seer.",
      "te": "సర్వ ప్రాణులకు రాత్రి అయినదానిలో ఆత్మనిగ్రహి మేల్కొని ఉంటాడు; ప్రాణులు మేల్కొనేది మునికి రాత్రి."
    }
  },
  {
    "ref": "2.70",
    "iast": "āpūryamāṇamacalapratiṣṭhaṃ samudramāpaḥ praviśanti yadvat",
    "meaning": {
      "en": "As rivers enter the ocean, ever full and unmoved, so desires enter the peaceful one — and he, not the desirer, finds peace.",
      "te": "నిండి నిశ్చలంగా ఉన్న సముద్రంలో నదులు కలిసినట్లు, కోరికలు శాంతుని చేరతాయి — అతడే శాంతి పొందుతాడు."
    }
  },
  {
    "ref": "2.50",
    "iast": "buddhiyukto jahātīha ubhe sukṛtaduṣkṛte",
    "meaning": {
      "en": "The wise, united in intellect, cast off both good and bad here. Strive for yoga — yoga is skill in action.",
      "te": "బుద్ధియుక్తుడు పుణ్యపాపాలను ఇక్కడే వదులుతాడు. యోగానికి పూనుకో — కర్మలో నైపుణ్యమే యోగం."
    }
  },
  {
    "ref": "3.21",
    "iast": "yadyadācarati śreṣṭhastattadevetaro janaḥ",
    "meaning": {
      "en": "Whatever a great person does, others follow; the standard they set, the world pursues.",
      "te": "శ్రేష్ఠుడు ఏది ఆచరిస్తాడో, ఇతరులు దాన్నే అనుసరిస్తారు; అతడు చూపిన మార్గాన్నే లోకం అనుసరిస్తుంది."
    }
  },
  {
    "ref": "3.35",
    "iast": "śreyānsvadharmo viguṇaḥ paradharmātsvanuṣṭhitāt",
    "meaning": {
      "en": "Better one's own dharma, though imperfect, than another's dharma well performed.",
      "te": "పరధర్మం బాగా చేసినా, లోపమున్నా స్వధర్మమే శ్రేష్ఠం."
    }
  },
  {
    "ref": "4.38",
    "iast": "na hi jñānena sadṛśaṃ pavitramiha vidyate",
    "meaning": {
      "en": "Nothing in this world purifies like knowledge; in time, one perfected in yoga finds it within.",
      "te": "జ్ఞానమంత పవిత్రమైనది ఈ లోకంలో లేదు; యోగంలో సిద్ధి పొందినవాడు దాన్ని తనలో పొందుతాడు."
    }
  },
  {
    "ref": "4.39",
    "iast": "śraddhāvāṃllabhate jñānaṃ tatparaḥ saṃyatendriyaḥ",
    "meaning": {
      "en": "One with faith, devoted and master of the senses gains knowledge; gaining it, soon attains supreme peace.",
      "te": "శ్రద్ధ కలిగి, నిష్ఠతో, ఇంద్రియాలను జయించినవాడు జ్ఞానం పొందుతాడు; పొందాక శీఘ్రమే పరమ శాంతి పొందుతాడు."
    }
  },
  {
    "ref": "6.5",
    "iast": "uddharedātmanātmānaṃ nātmānamavasādayet",
    "meaning": {
      "en": "Lift yourself by your own self; never degrade yourself. The self alone is one's friend, and one's enemy.",
      "te": "నిన్ను నీవే ఉద్ధరించుకో, అధోగతికి దిగవద్దు. మనసే తనకు మిత్రుడు, శత్రువు."
    }
  },
  {
    "ref": "6.6",
    "iast": "bandhurātmātmanastasya yenātmaivātmanā jitaḥ",
    "meaning": {
      "en": "For one who has conquered the self, the self is a friend; for one who has not, it remains an enemy.",
      "te": "తనను తాను జయించినవాడికి మనసే మిత్రుడు; జయించనివాడికి శత్రువు."
    }
  },
  {
    "ref": "6.19",
    "iast": "yathā dīpo nivātastho neṅgate sopamā smṛtā",
    "meaning": {
      "en": "As a lamp in a windless place does not flicker, so is the disciplined mind of a yogi absorbed in the Self.",
      "te": "గాలి లేని చోట దీపం చలించనట్లు, ఆత్మలో లీనమైన యోగి మనసు స్థిరంగా ఉంటుంది."
    }
  },
  {
    "ref": "6.30",
    "iast": "yo māṃ paśyati sarvatra sarvaṃ ca mayi paśyati",
    "meaning": {
      "en": "One who sees Me everywhere and everything in Me — to that one I am never lost, nor is that one ever lost to Me.",
      "te": "నన్ను అంతటా చూసి, అన్నిటినీ నాలో చూసేవాడికి నేను ఎప్పటికీ దూరం కాను, అతడూ నాకు దూరం కాడు."
    }
  },
  {
    "ref": "7.7",
    "iast": "mattaḥ parataraṃ nānyat kiñcidasti dhanañjaya",
    "meaning": {
      "en": "There is nothing higher than Me, O Dhananjaya; all this is strung on Me like pearls on a thread.",
      "te": "నాకంటే ఉన్నతమైనది మరేదీ లేదు, ఓ ధనంజయా; ఈ సర్వం నాలో దారంలో మణులవలె గుచ్చబడి ఉంది."
    }
  },
  {
    "ref": "8.7",
    "iast": "tasmātsarveṣu kāleṣu māmanusmara yudhya ca",
    "meaning": {
      "en": "At all times remember Me, and do your duty; with mind and intellect fixed on Me, you shall surely come to Me.",
      "te": "అన్ని వేళలా నన్ను స్మరిస్తూ నీ కర్తవ్యం చేయి; మనసు-బుద్ధి నాయందు నిలిపితే నన్నే చేరుతావు."
    }
  },
  {
    "ref": "9.22",
    "iast": "ananyāścintayanto māṃ ye janāḥ paryupāsate",
    "meaning": {
      "en": "To those who worship Me with single-minded devotion, I bring what they lack and preserve what they have.",
      "te": "అనన్య భక్తితో నన్ను ఆరాధించే వారి యోగక్షేమాలను నేనే వహిస్తాను."
    }
  },
  {
    "ref": "9.26",
    "iast": "patraṃ puṣpaṃ phalaṃ toyaṃ yo me bhaktyā prayacchati",
    "meaning": {
      "en": "Whoever offers Me a leaf, a flower, a fruit or water with devotion — that loving offering I accept.",
      "te": "ఒక ఆకు, పువ్వు, పండు లేదా నీరు భక్తితో సమర్పిస్తే, ఆ ప్రేమ సమర్పణను నేను స్వీకరిస్తాను."
    }
  },
  {
    "ref": "9.27",
    "iast": "yatkaroṣi yadaśnāsi yajjuhoṣi dadāsi yat",
    "meaning": {
      "en": "Whatever you do, eat, offer or give, and whatever austerity you practise — do it as an offering to Me.",
      "te": "నీవు ఏది చేసినా, తిన్నా, హోమం చేసినా, దానం ఇచ్చినా, తపస్సు చేసినా — దాన్ని నాకు సమర్పణగా చేయి."
    }
  },
  {
    "ref": "9.34",
    "iast": "manmanā bhava madbhakto madyājī māṃ namaskuru",
    "meaning": {
      "en": "Fix your mind on Me, be devoted to Me, worship Me, bow to Me; so shall you come to Me.",
      "te": "మనసును నాయందు నిలుపు, నా భక్తుడవై, నన్ను పూజించి, నాకు నమస్కరించు; అలా నన్నే చేరుతావు."
    }
  },
  {
    "ref": "10.10",
    "iast": "teṣāṃ satatayuktānāṃ bhajatāṃ prītipūrvakam",
    "meaning": {
      "en": "To those ever-devoted who worship Me with love, I give the yoga of discernment by which they come to Me.",
      "te": "ప్రేమతో నిరంతరం నన్ను ఆరాధించే వారికి, నన్ను చేరే బుద్ధియోగాన్ని నేను ప్రసాదిస్తాను."
    }
  },
  {
    "ref": "12.13",
    "iast": "adveṣṭā sarvabhūtānāṃ maitraḥ karuṇa eva ca",
    "meaning": {
      "en": "One who hates no being, is friendly and compassionate, free of ego and 'mine', even in pain and joy, patient — is dear to Me.",
      "te": "ఏ ప్రాణినీ ద్వేషించక, మైత్రి-కరుణ కలిగి, అహంకార-మమకారాలు లేక, సుఖదుఃఖాల్లో సమంగా ఉండే భక్తుడు నాకు ప్రియుడు."
    }
  },
  {
    "ref": "12.15",
    "iast": "yasmānnodvijate loko lokānnodvijate ca yaḥ",
    "meaning": {
      "en": "One by whom the world is not troubled, and who is not troubled by the world — that one is dear to Me.",
      "te": "ఎవరి వల్ల లోకం కలత చెందదో, లోకం వల్ల ఎవరు కలత చెందరో — వారు నాకు ప్రియులు."
    }
  },
  {
    "ref": "14.27",
    "iast": "brahmaṇo hi pratiṣṭhāhamamṛtasyāvyayasya ca",
    "meaning": {
      "en": "For I am the ground of Brahman — of the immortal and imperishable, of eternal dharma, and of absolute bliss.",
      "te": "అమృతమైన, అవ్యయమైన బ్రహ్మకు, శాశ్వత ధర్మానికి, పరమానందానికి నేనే ఆధారం."
    }
  },
  {
    "ref": "15.1",
    "iast": "ūrdhvamūlamadhaḥśākhamaśvatthaṃ prāhuravyayam",
    "meaning": {
      "en": "They speak of an eternal ashvattha tree, roots above and branches below, whose leaves are the Vedas; who knows it knows the Vedas.",
      "te": "వేళ్ళు పైకి, కొమ్మలు కిందికి ఉన్న శాశ్వత అశ్వత్థ వృక్షం గురించి చెబుతారు; దాని ఆకులే వేదాలు; దాన్ని తెలిసినవాడే వేదవేత్త."
    }
  },
  {
    "ref": "15.7",
    "iast": "mamaivāṃśo jīvaloke jīvabhūtaḥ sanātanaḥ",
    "meaning": {
      "en": "An eternal fragment of My own Self becomes the living soul in this world of life.",
      "te": "నా శాశ్వత అంశమే జీవలోకంలో సనాతన జీవాత్మగా అవుతుంది."
    }
  },
  {
    "ref": "15.15",
    "iast": "sarvasya cāhaṃ hṛdi sanniviṣṭo",
    "meaning": {
      "en": "I am seated in the hearts of all; from Me come memory, knowledge and their loss. By all the Vedas I alone am to be known.",
      "te": "నేను అందరి హృదయాల్లో నిలిచి ఉన్నాను; స్మృతి, జ్ఞానం, వాటి నష్టం నా నుండే. వేదాల ద్వారా తెలియదగినవాడను నేనే."
    }
  },
  {
    "ref": "16.21",
    "iast": "trividhaṃ narakasyedaṃ dvāraṃ nāśanamātmanaḥ",
    "meaning": {
      "en": "Three gates of hell destroy the self — desire, anger and greed; therefore one should abandon these three.",
      "te": "ఆత్మను నశింపజేసే నరక ద్వారాలు మూడు — కామం, క్రోధం, లోభం; కనుక ఈ మూడింటిని విడిచిపెట్టాలి."
    }
  },
  {
    "ref": "18.66",
    "iast": "sarvadharmānparityajya māmekaṃ śaraṇaṃ vraja",
    "meaning": {
      "en": "Abandon all dharmas and take refuge in Me alone; I shall free you from all sins — grieve not.",
      "te": "సమస్త ధర్మాలను విడిచి నన్నే శరణు పొందు; నిన్ను సర్వ పాపాల నుండి విముక్తుని చేస్తాను — దుఃఖించకు."
    }
  },
  {
    "ref": "18.78",
    "iast": "yatra yogeśvaraḥ kṛṣṇo yatra pārtho dhanurdharaḥ",
    "meaning": {
      "en": "Where there is Krishna, Lord of yoga, and Arjuna the archer, there are fortune, victory, prosperity and righteousness.",
      "te": "ఎక్కడ యోగేశ్వరుడు కృష్ణుడు, ధనుర్ధారి అర్జునుడు ఉంటారో, అక్కడ సంపద, విజయం, శ్రేయస్సు, నీతి ఉంటాయి."
    }
  }
];

function dayOrdinal(date: Date, timeZone: string): number {
  try {
    const f = new Intl.DateTimeFormat("en-CA", { timeZone, year: "numeric", month: "2-digit", day: "2-digit" });
    const [y, m, d] = f.format(date).split("-").map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  } catch { return Math.floor(date.getTime() / 86400000); }
}

export function getDailyShloka(date: Date = new Date(), timeZone = "Asia/Kolkata"): Shloka {
  const n = SHLOKAS.length;
  const idx = ((dayOrdinal(date, timeZone) % n) + n) % n;
  return SHLOKAS[idx];
}
