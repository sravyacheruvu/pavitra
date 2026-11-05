# Pavitra — Detailed Pooja Vidhanam (Draft 1)

**What this is:** the step-by-step ritual procedure that replaces terse lines like
*"Worship Ganesha first,"* *"offer the sixteen services,"* or *"recite the 108 names of Lakshmi"*
with the **actual vidhanam** — what to do, what to say (Sanskrit + transliteration), and what to
offer, at every step.

**How it's structured.** Almost every Hindu pooja is built from the same backbone — the
**Shodashopachara** (sixteen honours offered to the deity as to an honoured guest), bookended by a
common **opening** (achamana → pranayama → sankalpam → Ganapati prarthana) and **closing**
(mantrapushpam → pradakshina → kshama prarthana). Each festival then adds only its *specific* steps
(e.g. Lakshmi's dhyana sloka, Kubera puja, the ashtottara). So in the app this becomes:

1. Three new reusable enumerations — **`nitya_opening`**, **`shodashopachara`**, **`panchopachara`** —
   that any pooja's steps reference via `detailsRef` (exactly like the existing 21-leaves / ashtottara lists).
2. Each festival's terse steps rewritten to (a) carry a real `mantra`, and (b) point to the right
   enumeration so the guided view spells the whole thing out.

> ⚠️ **Accuracy note.** Sacred procedure varies by *sampradaya* and family tradition. What follows is
> the standard South-Indian (smarta) vaidika form. **Please have this checked by your purohit or
> against your family's text before it ships** — this is the one part of the app where a wrong line is
> worse than a missing one.

---

## A. The common opening — *Nitya Vidhi* (`nitya_opening`)

Done once at the start of any pooja, before the deity-specific worship.

| # | Step | Say (Devanagari) | Transliteration | What you do |
|---|------|------------------|-----------------|-------------|
| 1 | **Achamana** | ॐ केशवाय स्वाहा · ॐ नारायणाय स्वाहा · ॐ माधवाय स्वाहा | Om Keśavāya svāhā · Om Nārāyaṇāya svāhā · Om Mādhavāya svāhā | Sip a few drops of water from the right palm after each of the three names; then touch water to both eyes. |
| 2 | **Pranayama** | ॐ भूः ॐ भुवः ॐ सुवः … ॐ आपो ज्योती रसोऽमृतं ब्रह्म भूर्भुवस्सुवरोम् | Om bhūḥ … bhūr-bhuvas-suvar-om | One calm round of breath, holding the intention steady. |
| 3 | **Sankalpam** | *(the app already generates this line from the panchangam — samvatsara, ayana, ritu, masa, paksha, tithi, vaara, nakshatra, + your name & gotra)* | — | Hold water + akshata in the right hand, recite the sankalpam naming the pooja you are about to do, and release it into a plate. |
| 4 | **Ganapati Prarthana** | शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम् । प्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये ॥ | Śuklāmbara-dharaṁ viṣṇuṁ śaśi-varṇaṁ catur-bhujam, prasanna-vadanaṁ dhyāyet sarva-vighnopaśāntaye | Fold hands and remember Ganesha so the worship proceeds without obstacle. |
| 5 | **Dīpa Ārādhana** | दीपं ज्योतिः परं ब्रह्म दीपं सर्वतमोपहम् । दीपेन साध्यते सर्वं सन्ध्यादीप नमोऽस्तु ते ॥ | Dīpaṁ jyotiḥ paraṁ brahma … sandhyā-dīpa namo'stu te | Light the deepam and honour the flame. |

---

## B. The sixteen honours — *Shodashopachara* (`shodashopachara`)

The heart of the pooja. Before **each** offering, name the deity — *"Om Śrī [deity]-devatāyai namaḥ"* —
then make the offering with the line below. **If a physical item isn't at hand, offer akshata
(turmeric rice) in its place and name it mentally — bhāva (devotion) completes what dravya (material)
cannot.**

| # | Upachara | Say (Devanagari) | Transliteration | What you offer / do |
|---|----------|------------------|-----------------|---------------------|
| 1 | **Āvāhana** (invocation) | आवाहयामि | Āvāhayāmi | Invite the deity to be present in the idol/kalasha — offer a flower and akshata. |
| 2 | **Āsana** (seat) | आसनं समर्पयामि | Āsanaṁ samarpayāmi | Offer a seat — place flowers/akshata. |
| 3 | **Pādya** (water for the feet) | पादयोः पाद्यं समर्पयामि | Pādayoḥ pādyaṁ samarpayāmi | Sprinkle water at the feet. |
| 4 | **Arghya** (water for the hands) | हस्तयोः अर्घ्यं समर्पयामि | Hastayoḥ arghyaṁ samarpayāmi | Offer water for the hands. |
| 5 | **Āchamanīya** (water to sip) | मुखे आचमनीयं समर्पयामि | Mukhe ācamanīyaṁ samarpayāmi | Offer water to sip. |
| 6 | **Snāna** (bath) | स्नानं समर्पयामि | Snānaṁ samarpayāmi | Bathe the idol — panchamrita (milk, curd, ghee, honey, sugar) then pure water; for a picture or kalasha, sprinkle water. |
| 7 | **Vastra** (garments) | वस्त्रयुग्मं समर्पयामि | Vastra-yugmaṁ samarpayāmi | Offer cloth / a cotton vastra. |
| 8 | **Yajñopavīta** (sacred thread) | यज्ञोपवीतं समर्पयामि | Yajñopavītaṁ samarpayāmi | Offer the sacred thread (for goddesses, offer akshata / mangala-sutra). |
| 9 | **Gandha** (sandal) | गन्धान् धारयामि | Gandhān dhārayāmi | Apply chandanam (sandal paste). |
| 10 | **Akshata & Pushpa** (rice & flowers) | अक्षतान् पुष्पैश्च पूजयामि | Akṣatān puṣpaiśca pūjayāmi | Offer akshata and flowers — **the ashtottara (108 names) is recited here**, a flower/kumkum at each name. |
| 11 | **Dhūpa** (incense) | धूपमाघ्रापयामि | Dhūpam āghrāpayāmi | Show lit agarbatti / sambrani smoke. |
| 12 | **Dīpa** (lamp) | दीपं दर्शयामि | Dīpaṁ darśayāmi | Show the lit lamp. |
| 13 | **Naivedya** (food) | नैवेद्यं समर्पयामि | Naivedyaṁ samarpayāmi | Offer the prepared food; sprinkle water around it and show it with both hands. |
| 14 | **Tāmbūla** (betel) | ताम्बूलं समर्पयामि | Tāmbūlaṁ samarpayāmi | Offer betel leaves, areca nut and a coin. |
| 15 | **Nīrājana** (camphor aarti) | कर्पूर नीराजनं समर्पयामि | Karpūra nīrājanaṁ samarpayāmi | Light camphor and circle it before the deity, ringing the bell. |
| 16 | **Mantrapushpa & Pradakshina-Namaskāra** | मन्त्रपुष्पं समर्पयामि · प्रदक्षिण नमस्कारान् समर्पयामि | Mantra-puṣpaṁ samarpayāmi · Pradakṣiṇa-namaskārān samarpayāmi | Offer flowers with the mantrapushpam, circumambulate, and prostrate. |

**Short form — *Panchopachara* (`panchopachara`)** for the 5-minute daily pooja: Gandha (10 → sandal),
Pushpa (flowers), Dhupa (incense), Dipa (lamp), Naivedya (food) — items 9–13 above, in that order.

---

## C. Worked example — **Diwali Lakshmi Pooja** (full vidhanam)

Below, the app's 9 terse steps are shown **before → after**. Only the *new* detail is written out;
the shared parts simply reference §A and §B.

### Step 1 — Purification & Sankalpam
*Before:* "Clean and decorate the home, draw rangoli, perform achamana, take the sankalpam."
*After:* Clean the house and the puja space; draw the rangoli and light the threshold lamps. Sit facing
east or north. **Do the common opening (§A):** achamana → pranayama → **sankalpam** (the app's generated
line, naming *Mahālakṣmī prītyarthaṁ Lakṣmī-pūjāṁ kariṣye*) → Ganapati prarthana → dipa aradhana.

### Step 2 — Kalasha & Deepa Sthapana
Place a kalasham (pot of water, with a coconut on mango leaves) to the right; light the **akhanda
deepam** (the lamp kept burning through the night). Arrange the idols: **Ganesha on the right**,
**Mahalakshmi in the centre**, coins/jewellery and the account books before Her.
*Kalasha invocation:* कलशस्य मुखे विष्णुः कण्ठे रुद्रः समाश्रितः … *(Kalaśasya mukhe Viṣṇuḥ…)* — invite all
sacred waters into the kalasham, sprinkle that water on yourself and the materials to purify them.

### Step 3 — Ganesha Puja  → *now a full shodashopachara*
*Before:* "Worship Ganesha first with shodashopachara."
*After:* **Dhyana —** वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ । निर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा ॥
(*Vakratuṇḍa mahākāya sūryakoṭi samaprabha, nirvighnaṁ kuru me deva sarva-kāryeṣu sarvadā*).
Then perform the **sixteen upacharas (§B)** to Ganesha, naming each *"Om Śrī Mahāgaṇādhipataye namaḥ,
[upachara] samarpayāmi."* Conclude: *"Om Gaṁ Gaṇapataye Namaḥ."*

### Step 4 — Lakshmi Avahana & Shodashopachara  → *now spelled out*
*Before:* "Invoke Mahalakshmi with the dhyana sloka and offer the sixteen services."
*After:* **Dhyana sloka —**
सर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके । शरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते ॥
(*Sarva-maṅgala-māṅgalye śive sarvārtha-sādhike, śaraṇye tryambake gauri nārāyaṇi namo'stu te*).
Invoke Her into the kalasha/idol, then perform the **sixteen upacharas (§B)**, naming each
*"Om Śrī Mahālakṣmyai namaḥ, [upachara] samarpayāmi."* At **Āvāhana** use the primary mantra
**ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद … महालक्ष्म्यै नमः** (*Om Śrīṁ Hrīṁ Śrīṁ Kamale
Kamalālaye prasīda prasīda … Mahālakṣmyai namaḥ*).

### Step 5 — Kubera & Saraswati Puja  → *now with their mantras*
*After:* Beside Lakshmi, honour **Kubera** (lord of wealth) over the lockers/cash box and **Saraswati**
over the account books and pen.
- **Kubera:** धनदाय नमस्तुभ्यं निधिपद्माधिपाय च । भवन्तु त्वत्प्रसादेन धनधान्यादि सम्पदः ॥ — *"Om Śrī
  Kuberāya Namaḥ"* (offer gandha, akshata, flowers, dhupa, dipa over the wealth you keep).
- **Saraswati:** सरस्वति नमस्तुभ्यं वरदे कामरूपिणि । विद्यारम्भं करिष्यामि सिद्धिर्भवतु मे सदा ॥ — *"Om Śrī
  Sarasvatyai Namaḥ"* (honour the books and pen; in trading families the new *chopda/bahi-khata* is opened here).

### Step 6 — Lakshmi Ashtottara
*Already correct* — recite the **108 names of Lakshmi** (`lakshmi_ashtottara`, already in the app),
offering a lotus petal / kumkum at each name. *(This happens within upachara #10 of §B, drawn out as its own step.)*

### Step 7 — Naivedya
Offer batasha, kheel (puffed rice), sweets, fruit and a whole coconut. Sprinkle water around the
offering and present it: *"Om Śrī Mahālakṣmyai namaḥ, naivedyaṁ samarpayāmi."*

### Step 8 — Mangala Aarti
Karpura nirajana with the bell — **ॐ जय लक्ष्मी माता** — circle the camphor flame before Her, then
share the aarti light with everyone present.

### Step 9 — Deepdaan, Kshama Prarthana & Firecrackers
Offer the **mantrapushpam**, circumambulate (pradakshina) and prostrate (namaskara). Close with the
**kshama prarthana:**
मन्त्रहीनं क्रियाहीनं भक्तिहीनं जनार्दन । यत्पूजितं मया देव परिपूर्णं तदस्तु मे ॥
(*Mantra-hīnaṁ kriyā-hīnaṁ bhakti-hīnaṁ janārdana, yat-pūjitaṁ mayā deva paripūrṇaṁ tad-astu me* —
"whatever was wanting in mantra, in act, or in devotion, Lord, let my worship be made complete").
Then light rows of diyas in every doorway, distribute prasadam, and celebrate.

---

## What I'll do next (on your go-ahead)

1. **Integrate the backbone** — add `nitya_opening`, `shodashopachara`, `panchopachara` to the app's
   enumerations, and a small `kubera` / `saraswati` mantra block, so the guided view can render them.
2. **Rewrite each festival's `sampurna` steps** to carry real mantras + the right `detailsRef`, the way
   Diwali is shown above — rolling across all 14 festivals and the daily pooja.
3. Keep the short (`sankshipta`) mode on **panchopachara** so the 5-minute path stays simple.

**Before I wire it in, please flag anything off in §A/§B and the Diwali flow** — once the backbone is
blessed as accurate, the other festivals reuse it and go quickly.
