import type { LangText } from "../i18n";

/**
 * On-device assistant knowledge base ("Ask Pavitra").
 *
 * Trust-safe by design: it answers item substitutions and ritual significance
 * from a curated KB and never invents ritual steps. When an answer isn't in the
 * KB it returns a gentle "bhava over dravya" message. An optional server backend
 * (a Supabase Edge Function holding the LLM key) can be wired via
 * EXPO_PUBLIC_ASSISTANT_URL for open-ended questions; the app never holds a key.
 */
export type Answer = LangText;
export type KBItem = { id: string; keys: string[]; sub?: Answer; sig?: Answer };

export const ITEMS: KBItem[] = [
  {
    "id": "flowers",
    "keys": [
      "flower",
      "flowers",
      "pushpam",
      "pushpa",
      "poolu",
      "puvvu",
      "puvvulu"
    ],
    "sub": {
      "en": "No flowers? Offer akshata (turmeric rice), a tulsi or any clean leaf, or a single available flower. Even one flower offered with devotion is enough; or offer flowers mentally.",
      "te": "పువ్వులు లేవా? అక్షతలు, తులసి లేదా ఏదైనా శుభ్రమైన ఆకు, లేదా ఒక్క పువ్వు సమర్పించండి. భక్తితో ఒక్క పువ్వు చాలు; లేదా మనసా సమర్పించండి."
    },
    "sig": {
      "en": "Flowers offer beauty and the heart's blooming — each flower is a surrendered thought laid at the deity's feet.",
      "te": "పువ్వులు అందాన్ని, హృదయ వికాసాన్ని సూచిస్తాయి — ప్రతి పువ్వు దేవుని పాదాల వద్ద సమర్పించిన ఆలోచన."
    }
  },
  {
    "id": "tulsi",
    "keys": [
      "tulsi",
      "tulasi",
      "holy basil"
    ],
    "sub": {
      "en": "No tulsi? For Vishnu/Krishna it's dear, but akshata or a clean bilva/other leaf is accepted. A tulsi leaf from a neighbour's plant is also fine.",
      "te": "తులసి లేదా? విష్ణువుకు ప్రియమైనది, కానీ అక్షతలు లేదా శుభ్రమైన మారేడు/ఇతర ఆకు సరిపోతుంది. పక్కింటి తులసి ఆకు కూడా మంచిదే."
    },
    "sig": {
      "en": "Tulsi is beloved of Vishnu — a symbol of purity and unwavering devotion.",
      "te": "తులసి విష్ణువుకు ప్రియమైనది — పవిత్రత, అచంచల భక్తికి సంకేతం."
    }
  },
  {
    "id": "bilva",
    "keys": [
      "bilva",
      "bilva patra",
      "bael",
      "maredu",
      "bilvam"
    ],
    "sub": {
      "en": "No bilva (maredu) for Shiva? A simple water abhishekam alone pleases Shiva. Otherwise offer akshata, flowers, or even a single leaf of any tree with devotion.",
      "te": "శివునికి మారేడు లేదా? కేవలం నీటి అభిషేకమే శివునికి ప్రీతికరం. లేదా అక్షతలు, పువ్వులు, లేదా భక్తితో ఏదైనా ఒక ఆకు సమర్పించండి."
    },
    "sig": {
      "en": "Bilva is sacred to Shiva; its three leaflets represent the three gunas and Shiva's trishul.",
      "te": "మారేడు శివునికి పవిత్రం; దాని మూడు ఆకులు మూడు గుణాలను, శివుని త్రిశూలాన్ని సూచిస్తాయి."
    }
  },
  {
    "id": "camphor",
    "keys": [
      "camphor",
      "karpuram",
      "karpooram",
      "karpura",
      "harati",
      "aarti",
      "arati"
    ],
    "sub": {
      "en": "No camphor for harati? Wave a ghee or oil lamp, or a cotton wick dipped in ghee, before the deity. A lit agarbatti can also serve for the light offering.",
      "te": "హారతికి కర్పూరం లేదా? నేతి/నూనె దీపం, లేదా నేతిలో ముంచిన వత్తి దేవుని ముందు చూపించండి. వెలిగించిన అగరుబత్తి కూడా సరిపోతుంది."
    },
    "sig": {
      "en": "Camphor burns completely, leaving no residue — the ego dissolves and the self merges with the divine. We touch the warmth to our eyes to receive grace.",
      "te": "కర్పూరం పూర్తిగా కాలి ఏమీ మిగలదు — అహం కరిగి ఆత్మ దైవంలో లీనమవుతుంది. ఆ వెచ్చదనాన్ని కళ్ళకు తాకించి అనుగ్రహం స్వీకరిస్తాం."
    }
  },
  {
    "id": "incense",
    "keys": [
      "agarbatti",
      "incense",
      "dhoop",
      "dhoopam",
      "dhupa",
      "sambrani",
      "loban",
      "agarabatti"
    ],
    "sub": {
      "en": "No agarbatti/sambrani? Offer camphor or a ghee lamp as the fragrance-and-light offering, or a pinch of sambrani/loban on a hot coal. Even a fragrant flower can stand in.",
      "te": "అగరుబత్తి/సాంబ్రాణి లేదా? కర్పూరం లేదా నేతి దీపం చూపించండి, లేదా నిప్పు మీద కొంచెం సాంబ్రాణి వేయండి. సువాసన గల పువ్వు కూడా సరిపోతుంది."
    },
    "sig": {
      "en": "Dhoopam offers fragrance to the divine; the rising smoke reminds us to let attachments dissolve and rise beyond them.",
      "te": "ధూపం దేవునికి సువాసన సమర్పణ; పైకి లేచే పొగ మమకారాలను విడిచి పైకి ఎదగమని గుర్తు చేస్తుంది."
    }
  },
  {
    "id": "kumkum",
    "keys": [
      "kumkum",
      "kumkuma",
      "sindoor",
      "bottu"
    ],
    "sub": {
      "en": "No kumkum? Use turmeric (pasupu), sandal paste (chandanam), or a red flower in its place.",
      "te": "కుంకుమ లేదా? పసుపు, చందనం, లేదా ఎర్రని పువ్వు వాడండి."
    },
    "sig": {
      "en": "Kumkum marks auspiciousness and Shakti, and the ajna (the point between the brows).",
      "te": "కుంకుమ శుభాన్ని, శక్తిని, ఆజ్ఞా స్థానాన్ని సూచిస్తుంది."
    }
  },
  {
    "id": "turmeric",
    "keys": [
      "turmeric",
      "haldi",
      "pasupu",
      "pasupu kumkuma"
    ],
    "sub": {
      "en": "No turmeric? Kumkum or sandal paste works in its place.",
      "te": "పసుపు లేదా? కుంకుమ లేదా చందనం వాడవచ్చు."
    },
    "sig": {
      "en": "Turmeric is purity and auspiciousness itself — protective and sacred in every Hindu rite.",
      "te": "పసుపు పవిత్రతకు, శుభానికి ప్రతీక — ప్రతి పూజలో రక్షణ, మంగళకరం."
    }
  },
  {
    "id": "akshata",
    "keys": [
      "akshata",
      "akshatalu",
      "rice",
      "biyyam",
      "unbroken rice"
    ],
    "sub": {
      "en": "No akshata ready? Mix a spoon of raw rice with a pinch of turmeric (and a few drops of water) — that is akshata. Plain raw rice also works.",
      "te": "అక్షతలు లేవా? ఒక చెంచా బియ్యంలో కొంచెం పసుపు (కొన్ని నీటి చుక్కలు) కలపండి — అదే అక్షతలు. సాధారణ పచ్చి బియ్యం కూడా సరిపోతాయి."
    },
    "sig": {
      "en": "Akshata (unbroken rice) stands for wholeness and prosperity; turmeric makes it auspicious.",
      "te": "అక్షతలు (విరగని బియ్యం) సంపూర్ణత్వాన్ని, సమృద్ధిని సూచిస్తాయి; పసుపు వాటిని శుభప్రదం చేస్తుంది."
    }
  },
  {
    "id": "coconut",
    "keys": [
      "coconut",
      "kobbari",
      "kobari",
      "narikela",
      "tengai"
    ],
    "sub": {
      "en": "No coconut? Offer any whole fruit (a banana is ideal), or betel nut with a betel leaf, or akshata. The offering is the whole, pure gift — any whole fruit carries that.",
      "te": "కొబ్బరికాయ లేదా? ఏదైనా పూర్తి పండు (అరటిపండు మంచిది), లేదా తమలపాకుతో వక్క, లేదా అక్షతలు సమర్పించండి."
    },
    "sig": {
      "en": "Breaking the coconut is breaking the ego's hard shell to offer the pure white self within; its three eyes echo Shiva's three eyes.",
      "te": "కొబ్బరికాయ కొట్టడం అహంకారపు పెంకును బద్దలు చేసి లోపలి స్వచ్ఛమైన ఆత్మను సమర్పించడం; దాని మూడు కళ్ళు శివుని మూడు కళ్ళను సూచిస్తాయి."
    }
  },
  {
    "id": "tambulam",
    "keys": [
      "betel",
      "tambulam",
      "tamalapaku",
      "vakka",
      "paan",
      "betel leaf",
      "betel nut"
    ],
    "sub": {
      "en": "No tambulam (betel leaf & nut)? Offer a fruit with a small dakshina (a coin), or akshata. It's a gesture of respect and completion.",
      "te": "తాంబూలం లేదా? ఒక పండు, చిన్న దక్షిణ (నాణెం), లేదా అక్షతలు సమర్పించండి. ఇది గౌరవానికి, పరిపూర్తికి సంకేతం."
    }
  },
  {
    "id": "ghee",
    "keys": [
      "ghee",
      "neyyi",
      "ghrita",
      "lamp oil",
      "oil for lamp"
    ],
    "sub": {
      "en": "No ghee for the lamp? Any edible oil works — sesame (nuvvula nune) is traditional, coconut or groundnut oil are fine too.",
      "te": "దీపానికి నెయ్యి లేదా? ఏదైనా నూనె సరిపోతుంది — నువ్వుల నూనె సాంప్రదాయం, కొబ్బరి/వేరుశనగ నూనె కూడా మంచిదే."
    }
  },
  {
    "id": "panchamrutam",
    "keys": [
      "panchamrutam",
      "panchamrita",
      "panchamritam",
      "abhishekam liquids"
    ],
    "sub": {
      "en": "Can't make full panchamrutam? Milk alone, or milk with honey, is enough. If even that's unavailable, clean water (shuddhodakam) offered with a mantra is fully accepted.",
      "te": "పూర్తి పంచామృతం కుదరలేదా? కేవలం పాలు, లేదా పాలు-తేనె సరిపోతుంది. అది కూడా లేకపోతే, మంత్రంతో సమర్పించిన శుభ్రమైన నీరు (శుద్ధోదకం) సంపూర్ణంగా స్వీకరించబడుతుంది."
    },
    "sig": {
      "en": "The five nectars (milk, curd, ghee, honey, sugar) bathe the deity in love and purify the heart.",
      "te": "పంచామృతం (పాలు, పెరుగు, నెయ్యి, తేనె, చక్కెర) దేవుని ప్రేమతో అభిషేకించి హృదయాన్ని శుద్ధి చేస్తుంది."
    }
  },
  {
    "id": "naivedyam",
    "keys": [
      "naivedyam",
      "prasadam",
      "prasad",
      "sweet",
      "modak",
      "modakam",
      "bhog",
      "offering food"
    ],
    "sub": {
      "en": "No special naivedyam? Offer any fruit, a sweet, or even a little jaggery or sugar — or a small portion of whatever is cooked at home today. What's offered with love becomes prasadam.",
      "te": "ప్రత్యేక నైవేద్యం లేదా? ఏదైనా పండు, మిఠాయి, లేదా కొంచెం బెల్లం/చక్కెర — లేదా ఇంట్లో వండిన దానిలో కొంచెం సమర్పించండి. ప్రేమతో సమర్పించినదే ప్రసాదం."
    },
    "sig": {
      "en": "Naivedyam is gratitude — we offer food to the divine first, and it returns to us as prasadam, grace.",
      "te": "నైవేద్యం కృతజ్ఞత — ముందు దేవునికి సమర్పించి, అది ప్రసాదంగా అనుగ్రహంగా తిరిగి మనకు వస్తుంది."
    }
  },
  {
    "id": "mangoleaves",
    "keys": [
      "mango leaves",
      "toran",
      "torana",
      "mamidi aku",
      "mango leaf",
      "door decoration"
    ],
    "sub": {
      "en": "No mango leaves for the toranam? Any fresh green leaves (neem, ashoka) work, or you can simply skip it — it's an auspicious decoration, not essential to the puja.",
      "te": "తోరణానికి మామిడి ఆకులు లేవా? ఏదైనా పచ్చి ఆకులు (వేప, అశోక) సరిపోతాయి, లేదా వదిలేయవచ్చు — ఇది శుభసూచక అలంకరణ, పూజకు తప్పనిసరి కాదు."
    }
  },
  {
    "id": "water",
    "keys": [
      "ganga",
      "gangajal",
      "holy water",
      "tirtham",
      "water",
      "jalam",
      "jal"
    ],
    "sub": {
      "en": "No Ganga jal? Clean water with a tulsi leaf, or any clean water offered with a mantra, becomes tirtham. Intention makes it holy.",
      "te": "గంగాజలం లేదా? తులసి ఆకుతో శుభ్రమైన నీరు, లేదా మంత్రంతో సమర్పించిన ఏ శుభ్రమైన నీరైనా తీర్థమవుతుంది. సంకల్పమే దాన్ని పవిత్రం చేస్తుంది."
    }
  },
  {
    "id": "sandal",
    "keys": [
      "sandal",
      "sandalwood",
      "chandan",
      "chandanam",
      "gandham"
    ],
    "sub": {
      "en": "No sandal paste? Kumkum or turmeric can take its place for the tilak and offering.",
      "te": "చందనం లేదా? తిలకానికి, సమర్పణకు కుంకుమ లేదా పసుపు వాడవచ్చు."
    },
    "sig": {
      "en": "Sandal cools and calms — it represents a serene, fragrant mind offered to the divine.",
      "te": "చందనం చల్లదనాన్ని, ప్రశాంతతను ఇస్తుంది — దైవానికి సమర్పించిన ప్రశాంత మనసుకు ప్రతీక."
    }
  },
  {
    "id": "bell",
    "keys": [
      "bell",
      "ghanta",
      "conch",
      "shankh",
      "shankham",
      "ganta"
    ],
    "sub": {
      "en": "No bell or conch? Clap your hands gently or ring any small bell at home, and chant \"Om\" — the sound itself is the offering that invokes the divine.",
      "te": "గంట లేదా శంఖం లేదా? చేతులతో చప్పట్లు కొట్టండి లేదా ఇంట్లో ఏ చిన్న గంటైనా మోగించి \"ఓం\" అనండి — ఆ నాదమే దైవాన్ని ఆహ్వానించే సమర్పణ."
    },
    "sig": {
      "en": "The bell and conch carry the primordial sound Om; their vibration purifies the space and invites the divine presence.",
      "te": "గంట, శంఖం ఆది నాదం ఓంకారాన్ని మోస్తాయి; వాటి నాదం స్థలాన్ని శుద్ధి చేసి దైవ సాన్నిధ్యాన్ని ఆహ్వానిస్తుంది."
    }
  },
  {
    "id": "deepam",
    "keys": [
      "deepam",
      "lamp",
      "diya",
      "deepa",
      "jyothi",
      "wick",
      "vatti"
    ],
    "sub": {
      "en": "No lamp? A candle works, or a cotton wick in a little oil in any small steel cup. In an emergency even a phone light can represent the jyoti — but a wick in oil is best.",
      "te": "దీపం లేదా? కొవ్వొత్తి సరిపోతుంది, లేదా ఏదైనా చిన్న గిన్నెలో కొంచెం నూనెలో వత్తి వేయండి. అత్యవసరంలో ఫోన్ లైట్ కూడా జ్యోతిని సూచించవచ్చు — కానీ నూనె వత్తి ఉత్తమం."
    },
    "sig": {
      "en": "The deepam's flame is knowledge dispelling darkness and ignorance, and it invites the divine presence into your home.",
      "te": "దీపజ్యోతి చీకటిని, అజ్ఞానాన్ని తొలగించే జ్ఞానం; ఇది దైవ సాన్నిధ్యాన్ని ఇంటికి ఆహ్వానిస్తుంది."
    }
  },
  {
    "id": "pradakshina",
    "keys": [
      "pradakshina",
      "pradakshinam",
      "circumambulation",
      "going around"
    ],
    "sig": {
      "en": "Pradakshina — circling the deity — keeps the divine at the centre of our life, every step a reminder that everything revolves around that source.",
      "te": "ప్రదక్షిణ — దేవుని చుట్టూ తిరగడం — దైవాన్ని మన జీవితానికి కేంద్రంగా ఉంచుతుంది; ప్రతి అడుగు అన్నీ ఆ మూలం చుట్టూ తిరుగుతాయని గుర్తు చేస్తుంది."
    }
  },
  {
    "id": "sankalpam",
    "keys": [
      "sankalpam",
      "sankalpa",
      "intention",
      "resolve"
    ],
    "sig": {
      "en": "Sankalpam states the time, place and purpose of your worship — it aligns your small act with the vast order of cosmic time and makes it intentional.",
      "te": "సంకల్పం మీ పూజ యొక్క కాలం, స్థలం, ఉద్దేశాన్ని చెబుతుంది — ఇది మీ చిన్న కార్యాన్ని విశ్వకాల క్రమంతో అనుసంధానించి సంకల్పపూర్వకం చేస్తుంది."
    }
  },
  {
    "id": "abhishekam",
    "keys": [
      "abhishekam",
      "abhisheka",
      "bathing deity"
    ],
    "sig": {
      "en": "Abhishekam is the loving ceremonial bath of the deity — an act of care and purification, pouring our love over the divine form.",
      "te": "అభిషేకం దేవునికి ప్రేమపూర్వక స్నానం — శ్రద్ధ, శుద్ధి; దైవ రూపంపై మన ప్రేమను కురిపించడం."
    }
  },
  {
    "id": "pooja",
    "keys": [
      "pooja",
      "puja",
      "pooja vidhanam",
      "worship",
      "how to do pooja"
    ],
    "sig": {
      "en": "A pooja is the ceremony of inviting, honouring and communing with the divine — through light, water, flowers, food, fragrance, sound and mantra (the shodasha upacharas, sixteen offerings). Each step gives one of the senses back to the source with love.",
      "te": "పూజ అంటే దైవాన్ని ఆహ్వానించి, గౌరవించి, సన్నిధిలో మెలగడం — దీపం, నీరు, పువ్వులు, నైవేద్యం, ధూపం, నాదం, మంత్రం (షోడశోపచారాలు) ద్వారా. ప్రతి అడుగు ఒక ఇంద్రియాన్ని ప్రేమతో దైవానికి సమర్పిస్తుంది."
    }
  },
  {
    "id": "kanyapooja",
    "keys": [
      "kanya pooja",
      "kanyaka pooja",
      "kumari pooja",
      "kanya puja",
      "kanjak",
      "kanya"
    ],
    "sig": {
      "en": "Kanya Pooja honours young girls as living embodiments of the Goddess, especially on Durga Ashtami / Navami during Navratri. Their feet are washed, they're given new clothes or bangles, fed, and offered dakshina — a reminder to see the Divine Mother in every girl child, and to cultivate reverence and purity.",
      "te": "కన్యా పూజ నవరాత్రుల్లో (ముఖ్యంగా దుర్గాష్టమి/నవమి) చిన్న బాలికలను సాక్షాత్తు దేవీ స్వరూపాలుగా పూజించడం. వారి పాదాలు కడిగి, కొత్త బట్టలు/గాజులు ఇచ్చి, భోజనం పెట్టి, దక్షిణ సమర్పిస్తారు — ప్రతి ఆడపిల్లలో అమ్మవారిని చూడమని, భక్తి-పవిత్రతను పెంచుకోమని గుర్తు."
    }
  },
  {
    "id": "satyanarayana",
    "keys": [
      "satyanarayana",
      "satyanarayan",
      "satya narayana",
      "satyanarayana vratam"
    ],
    "sig": {
      "en": "Worship of Vishnu as Satyanarayana — 'the Lord who is Truth' — usually on Pournami, a vowed occasion or a new beginning. The vratam centres on the five-chapter katha and a simple prasadam (often rava kesari), offered in gratitude and to seek the family's wellbeing.",
      "te": "సత్యనారాయణ స్వామి (సత్యమే దైవం) పూజ — సాధారణంగా పౌర్ణమి, మొక్కు లేదా శుభారంభం నాడు. ఐదు అధ్యాయాల కథ, రవ్వ కేసరి వంటి ప్రసాదం — కృతజ్ఞతతో, కుటుంబ క్షేమం కోరుతూ."
    }
  },
  {
    "id": "homam",
    "keys": [
      "homam",
      "havan",
      "homa",
      "yagna",
      "yagnam",
      "yagya",
      "fire ritual"
    ],
    "sig": {
      "en": "In a homam, offerings are placed into the sacred fire (Agni), who carries them to the devas. Fire purifies, and the rising flame lifts our prayers and intentions upward.",
      "te": "హోమంలో సమర్పణలు పవిత్రాగ్నిలో వేస్తారు; అగ్ని వాటిని దేవతలకు చేరుస్తుంది. అగ్ని శుద్ధి చేస్తుంది, జ్వాల మన ప్రార్థనలను పైకి తీసుకెళ్తుంది."
    }
  },
  {
    "id": "archana",
    "keys": [
      "archana",
      "archna",
      "ashtottara",
      "sahasranama",
      "ashtottaram"
    ],
    "sig": {
      "en": "Archana is offering the deity's names — often 108 (ashtottara) or 1000 (sahasranama) — with a flower or akshata at each name. Every name is a quality of the divine we invoke and take into ourselves.",
      "te": "అర్చన అంటే దేవుని నామాలను (అష్టోత్తరం 108, సహస్రనామం 1000) ఒక్కో నామానికి పువ్వు/అక్షతలతో సమర్పించడం. ప్రతి నామం ఒక దైవ గుణాన్ని ఆవాహన చేస్తుంది."
    }
  },
  {
    "id": "namaskaram",
    "keys": [
      "namaskaram",
      "namaskar",
      "sashtanga",
      "prostration",
      "pranama",
      "pranam"
    ],
    "sig": {
      "en": "Namaskaram is bowing to the divine; the full sashtanga namaskaram touches eight limbs to the ground — a total surrender of body, mind and ego, acknowledging the Divine as greater than the self.",
      "te": "నమస్కారం దైవానికి వినయంగా వంగడం; సాష్టాంగ నమస్కారంలో ఎనిమిది అంగాలు నేలను తాకుతాయి — శరీరం, మనసు, అహంకారం పూర్తిగా సమర్పణ."
    }
  },
  {
    "id": "kalasham",
    "keys": [
      "kalasham",
      "kalasha",
      "kalash",
      "purna kumbha",
      "kumbham"
    ],
    "sig": {
      "en": "The kalasham — a pot of water topped with mango leaves and a coconut — represents the deity, the cosmos and abundance. It is consecrated so the divine presence is invited to dwell in it during worship.",
      "te": "కలశం (నీటి కలశంపై మామిడాకులు, కొబ్బరికాయ) దేవుని, విశ్వాన్ని, సమృద్ధిని సూచిస్తుంది. పూజలో దైవ సాన్నిధ్యాన్ని ఆవాహన చేయడానికి దీన్ని ప్రతిష్ఠిస్తారు."
    }
  },
  {
    "id": "annadanam",
    "keys": [
      "annadanam",
      "anna danam",
      "annadana",
      "food donation"
    ],
    "sig": {
      "en": "Annadanam — the giving of food — is held as the highest dana (charity), because it sustains life itself. Feeding others, especially after worship, completes the puja with compassion.",
      "te": "అన్నదానం అత్యుత్తమ దానం, ఎందుకంటే అది ప్రాణాధారం. పూజ తర్వాత ఇతరులకు అన్నం పెట్టడం కరుణతో పూజను పరిపూర్ణం చేస్తుంది."
    }
  },
  {
    "id": "shraddha",
    "keys": [
      "shraddha",
      "shraaddha",
      "tarpanam",
      "pitru",
      "ancestor rite"
    ],
    "sig": {
      "en": "Shraddha honours departed ancestors with offerings of water, food and prayer, usually on their tithi or on Amavasya. It expresses gratitude and seeks their blessings (pitru anugraham).",
      "te": "శ్రాద్ధం పితృదేవతలను నీరు, అన్నం, ప్రార్థనతో స్మరించే కర్మ — సాధారణంగా వారి తిథి లేదా అమావాస్య నాడు. కృతజ్ఞత, పితృ అనుగ్రహం కోసం."
    }
  },
  {
    "id": "vratam",
    "keys": [
      "vratam",
      "vrata",
      "vrath",
      "vow",
      "observance"
    ],
    "sig": {
      "en": "A vratam is a vow — a period of disciplined worship, fasting or restraint undertaken with a sankalpam, often for a deity or a heartfelt wish. The discipline itself is the offering.",
      "te": "వ్రతం అంటే మొక్కు — సంకల్పంతో చేసే నియమబద్ధ పూజ, ఉపవాసం లేదా నిగ్రహం, తరచూ ఒక దేవునికి లేదా కోరికకు. ఆ నిష్ఠే సమర్పణ."
    }
  },
  {
    "id": "upavasam",
    "keys": [
      "upavasam",
      "fasting",
      "upavaas",
      "upwas",
      "fast"
    ],
    "sig": {
      "en": "Upavasam (fasting) literally means 'to stay near' the divine — lightening the body so the mind turns inward. Observed on Ekadasi, festival days and vratams, it is a gentle tapas that purifies.",
      "te": "ఉపవాసం అంటే దైవానికి 'దగ్గరగా ఉండటం' — శరీరాన్ని తేలిక చేసి మనసును అంతర్ముఖం చేయడం. ఏకాదశి, పండుగలు, వ్రతాల్లో ఆచరించే శుద్ధికర తపస్సు."
    }
  },
  {
    "id": "tilakam",
    "keys": [
      "tilakam",
      "tilak",
      "vibhuti",
      "bhasma",
      "nama bottu",
      "forehead mark"
    ],
    "sig": {
      "en": "The tilakam marks the ajna (the seat of inner vision) and the body as a temple. Vibhuti (sacred ash) recalls impermanence, kumkum invokes Shakti, and sandal cools and calms the mind.",
      "te": "నుదుటిపై తిలకం ఆజ్ఞా స్థానాన్ని, శరీరం ఒక ఆలయమని సూచిస్తుంది. విభూతి అశాశ్వతతను, కుంకుమ శక్తిని, చందనం ప్రశాంతతను తెలుపుతుంది."
    }
  },
  {
    "id": "gotra",
    "keys": [
      "gotra",
      "gothram",
      "gotram"
    ],
    "sig": {
      "en": "Your gotra is your spiritual lineage, traced to an ancient rishi ancestor. Naming it in the sankalpam places you within that unbroken line of seers as you offer worship.",
      "te": "గోత్రం మీ ఆధ్యాత్మిక వంశం, ఒక ప్రాచీన ఋషి నుండి వస్తుంది. సంకల్పంలో గోత్రం చెప్పడం మిమ్మల్ని ఆ ఋషి పరంపరలో నిలుపుతుంది."
    }
  },
  {
    "id": "rahukalam",
    "keys": [
      "rahu kalam",
      "rahu kaalam",
      "rahukalam",
      "rahu kala",
      "rahu"
    ],
    "sig": {
      "en": "Rahu Kalam is a roughly 1.5-hour window each day considered inauspicious for starting new or important work. Routine worship and chanting are fine; it's simply a time to avoid launching ventures, journeys or purchases.",
      "te": "రాహు కాలం రోజూ ~1.5 గంటల అశుభ సమయం — కొత్త/ముఖ్య పనులు మొదలుపెట్టరాదు. నిత్య పూజ, జపం చేయవచ్చు; కేవలం కొత్త పనులు, ప్రయాణాలు, కొనుగోళ్లు వాయిదా వేస్తారు."
    }
  },
  {
    "id": "muhurtam",
    "keys": [
      "muhurtam",
      "muhurtham",
      "muhurat",
      "auspicious time",
      "good time"
    ],
    "sig": {
      "en": "A muhurtam is an auspicious time window chosen so an act begins in harmony with the cosmic rhythm — the tithi, nakshatra, day and planets all favourable. It gives an undertaking the best possible start.",
      "te": "ముహూర్తం అంటే శుభ సమయం — తిథి, నక్షత్రం, వారం, గ్రహాలు అనుకూలంగా ఉన్నప్పుడు పని మొదలుపెడితే విశ్వ లయతో సమన్వయం. శుభారంభానికి ఉత్తమం."
    }
  },
  {
    "id": "tithi",
    "keys": [
      "tithi",
      "thithi",
      "lunar day"
    ],
    "sig": {
      "en": "A tithi is a lunar day — the time the Moon takes to gain 12° on the Sun. The 30 tithis of a lunar month shape fasts, festivals and auspicious timings; your 'janma tithi' is your lunar birthday.",
      "te": "తిథి అంటే చాంద్రమాన దినం — చంద్రుడు సూర్యునిపై 12° సాధించే కాలం. నెలలోని 30 తిథులు ఉపవాసాలు, పండుగలు, శుభ సమయాలను నిర్ణయిస్తాయి; మీ 'జన్మ తిథి' మీ చాంద్రమాన పుట్టినరోజు."
    }
  },
  {
    "id": "nakshatra",
    "keys": [
      "nakshatra",
      "nakshatram",
      "janma nakshatra",
      "birth star",
      "star"
    ],
    "sig": {
      "en": "A nakshatra is one of the 27 lunar mansions the Moon travels through. Your janma nakshatra — the one the Moon occupied at your birth — shapes your star-birthday, Tarabalam and many personal muhurtams.",
      "te": "నక్షత్రం అంటే చంద్రుడు ప్రయాణించే 27 నక్షత్రాల్లో ఒకటి. మీ జన్మ నక్షత్రం (పుట్టినప్పుడు చంద్రుడు ఉన్నది) మీ నక్షత్ర పుట్టినరోజు, తారాబలం, వ్యక్తిగత ముహూర్తాలను నిర్ణయిస్తుంది."
    }
  },
  {
    "id": "ekadasi",
    "keys": [
      "ekadasi",
      "ekadashi"
    ],
    "sig": {
      "en": "Ekadasi, the 11th tithi of each paksha, is dedicated to Vishnu and traditionally observed with fasting and extra prayer. Light eating and remembrance are said to purify body and mind.",
      "te": "ఏకాదశి (ప్రతి పక్షంలో 11వ తిథి) విష్ణువుకు అంకితం; ఉపవాసం, అదనపు ప్రార్థనతో ఆచరిస్తారు. లఘు ఆహారం, స్మరణ శరీర-మనసులను శుద్ధి చేస్తాయి."
    }
  },
  {
    "id": "pournami",
    "keys": [
      "pournami",
      "purnima",
      "pournima",
      "full moon"
    ],
    "sig": {
      "en": "Pournami, the full-moon day, is highly auspicious for worship, vratams (like Satyanarayana) and charity. The full moon is linked to fullness, calm and devotion.",
      "te": "పౌర్ణమి (నిండు చంద్రుడు) పూజకు, వ్రతాలకు (సత్యనారాయణ), దానానికి అత్యంత శుభప్రదం. నిండు చంద్రుడు పరిపూర్ణత, ప్రశాంతత, భక్తికి సంకేతం."
    }
  },
  {
    "id": "amavasya",
    "keys": [
      "amavasya",
      "amavasa",
      "new moon"
    ],
    "sig": {
      "en": "Amavasya, the new-moon day, is traditionally for honouring ancestors (tarpanam / shraddha) and inward practices. The dark moon turns the mind reflective and devotional.",
      "te": "అమావాస్య (కొత్త చంద్రుడు) పితృదేవతలకు (తర్పణం/శ్రాద్ధం), అంతర్ముఖ సాధనకు. చీకటి చంద్రుడు మనసును ఆత్మపరిశీలనకు, భక్తికి మళ్లిస్తుంది."
    }
  }
];

/** Gentle fallback when a question isn't in the KB. */
export const BHAVA: Answer = {
  "en": "In pooja, your bhava (devotion) matters far more than the dravya (material). If something isn't at home, offer a clean substitute — or even offer it mentally (manasika) with akshata (turmeric rice) — and the puja is complete.",
  "te": "పూజలో ద్రవ్యం కన్నా భావం (భక్తి) ముఖ్యం. ఇంట్లో ఏదైనా లేకపోతే, శుభ్రమైన ప్రత్యామ్నాయం వాడండి — లేదా అక్షతలతో మనసా సమర్పించండి — పూజ పూర్తవుతుంది."
};

export const SUGGESTIONS: { q: string }[] = [
  {
    "q": "I don't have flowers, what can I use instead?"
  },
  {
    "q": "I don't have camphor for harati, alternative?"
  },
  {
    "q": "What is the significance of the deepam?"
  },
  {
    "q": "What is the significance of breaking a coconut?"
  }
];

const SIG_HINTS = ["significance", "meaning", "why", "importance", "purpose", "signify", "symbolise", "symbolize"];
const SUB_HINTS = ["instead", "alternative", "substitute", "replace", "don't have", "dont have", "no ", "without", "can i use", "at home"];

function norm(s: string): string { return s.toLowerCase().replace(/[^a-z0-9\s]/g, " "); }

/** Answer a question from the on-device KB (returns a localized Answer). */
export function answerLocally(question: string, _context?: string): Answer {
  const q = norm(question);
  const wantSig = SIG_HINTS.some((h) => q.includes(h));
  const wantSub = SUB_HINTS.some((h) => q.includes(h));
  let best: KBItem | undefined;
  let bestScore = 0;
  for (const item of ITEMS) {
    let score = 0;
    for (const k of item.keys) { if (q.includes(norm(k))) score += k.length; }
    if (score > bestScore) { bestScore = score; best = item; }
  }
  if (best) {
    if (wantSig && best.sig) return best.sig;
    if (wantSub && best.sub) return best.sub;
    return best.sig ?? best.sub ?? BHAVA;
  }
  return BHAVA;
}

/** Optional server backend for open-ended questions (never holds a key client-side). */
export async function askBackend(question: string, context?: string): Promise<string | null> {
  const url =
    typeof process !== "undefined" && process.env
      ? (process.env.EXPO_PUBLIC_ASSISTANT_URL as string | undefined)
      : undefined;
  if (!url) return null;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, context }),
    });
    if (!res.ok) return null;
    const j = await res.json();
    return (j && (j.answer as string)) || null;
  } catch {
    return null;
  }
}
