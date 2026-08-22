export const cropDiseases = [
  {
    id: 'tomato-late-blight',
    crop: 'Tomato',
    cropMarathi: 'टोमॅटो',
    cropHindi: 'टमाटर',
    name: 'Late Blight',
    marathiName: 'करपा रोग (लेट ब्लाइट)',
    hindiName: 'पछेती झुलसा रोग (लेट ब्लाइट)',
    pathogenType: 'Fungal / Oomycete',
    scientificName: 'Phytophthora infestans',
    severity: 'Moderate',
    severityScore: 2,
    confidence: 94,
    symptoms: 'Water-soaked irregular pale green/brown lesions on leaf tips and margins; white fuzzy fungal growth on leaf undersides under humid conditions.',
    marathiSymptoms: 'पानांच्या कडांवर पाणीदार काळसर तपकिरी डाग, दमट हवेत पानाच्या खालच्या बाजूस पांढरी बुरशी वाढते.',
    hindiSymptoms: 'पत्तियों के किनारों पर जल-सिक्त भूरे-काले धब्बे, नमी के समय पत्तियों के निचले हिस्से में सफेद फफूंद दिखाई देती है।',
    favorableConditions: {
      tempRange: '15°C - 22°C',
      rhMin: '85%',
      leafWetnessHours: '10+ hrs',
      rainfall: 'Moderate to heavy'
    },
    ipm: {
      cultural: [
        'Avoid overhead sprinkler irrigation to reduce leaf wetness.',
        'Maintain 60cm row spacing for optimal air circulation.',
        'Prune lower infected foliage and bury or burn diseased plant debris away from the field.'
      ],
      mechanical: [
        'Install yellow sticky traps (10/acre) to monitor vector populations.',
        'Use plastic mulch to avoid soil-borne spore splashing during rain.'
      ],
      biological: [
        {
          name: 'Trichoderma harzianum 2% WP',
          dosage: '5g / liter of water (75g / 15L tank)',
          costEstimate: '₹220/acre',
          timing: 'Preventive stage before heavy monsoon spells'
        },
        {
          name: 'Pseudomonas fluorescens 1% WP',
          dosage: '5g / liter of water (75g / 15L tank)',
          costEstimate: '₹190/acre',
          timing: 'Seedling drenching & early vegetative spray'
        }
      ],
      chemical: [
        {
          molecule: 'Copper Oxychloride 50% WP (CIBRC Approved)',
          brandExamples: 'Blitox / Blue Copper',
          dosagePerLiter: '2.5g / liter',
          dosagePerTank: '37.5g per 15L knapsack tank',
          dosagePerAcre: '500g in 200L water',
          costEstimate: '₹450/acre',
          phiDays: 3,
          safetyCategory: 'Green (Low toxicity)',
          advisory: 'Spray immediately upon first symptom notice. Ensure full coverage on underside of leaves.'
        },
        {
          molecule: 'Mancozeb 75% WP + Metalaxyl 8% WP (CIBRC Approved)',
          brandExamples: 'Ridomil Gold / Krilaxyl',
          dosagePerLiter: '2.0g / liter',
          dosagePerTank: '30g per 15L knapsack tank',
          dosagePerAcre: '400g in 200L water',
          costEstimate: '₹750/acre',
          phiDays: 7,
          safetyCategory: 'Blue (Moderately toxic)',
          advisory: 'Recommended when disease severity exceeds 20% foliage coverage.'
        }
      ]
    },
    audioAdvisory: {
      mr: 'तुमच्या टोमॅटो पिकावर करपा रोगाची लक्षणे आढळली आहेत. पानांवर काळसर डाग पडले आहेत. तात्काळ कॉपर ऑक्सीक्लोराईड २५ ग्रॅम प्रति १० लिटर पाण्यात मिसळून फवारणी करा. तीन दिवसांनंतर पुन्हा शेताची पाहणी करा.',
      hi: 'आपके टमाटर के पौधे पर लेट ब्लाइट (पछेती झुलसा) का संक्रमण पाया गया है। तुरंत कॉपर ऑक्सीक्लोराइड 2.5 ग्राम प्रति लीटर पानी के हिसाब से छिड़काव करें और खेत में पानी का जमाव न होने दें।'
    },
    sampleImage: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23961?auto=format&fit=crop&w=600&q=80',
    affectedDistricts: ['Nashik', 'Pune', 'Ahmednagar', 'Satara']
  },
  {
    id: 'cotton-pink-bollworm',
    crop: 'Cotton',
    cropMarathi: 'कापूस',
    cropHindi: 'कपास',
    name: 'Pink Bollworm Infestation',
    marathiName: 'गुलाबी बोंडअळी (पिंक बोलवर्म)',
    hindiName: 'गुलाबी सुंडी (पिंक बॉलवर्म)',
    pathogenType: 'Insect Pest (Lepidoptera)',
    scientificName: 'Pectinophora gossypiella',
    severity: 'Severe',
    severityScore: 3,
    confidence: 96,
    symptoms: 'Rosetted flowers (petals twisted into rosette), bored holes in developing bolls with brown frass, premature boll opening, damaged lint & stained seeds.',
    marathiSymptoms: 'फुलांचे रूपांतर गुलाबासारख्या आकाराच्या गुच्छात होते (रोसेट फूल), बोंडांना छिद्रे आणि आतील कापूस काळवंडतो.',
    hindiSymptoms: 'फूल गुलाब की तरह मुड़ जाते हैं (रोसेट फूल), बोंडों में सुराख और अंदर गुलाबी कीड़ा लिंट को नुकसान पहुंचाता है।',
    favorableConditions: {
      tempRange: '25°C - 34°C',
      rhMin: '60%',
      leafWetnessHours: 'N/A',
      rainfall: 'Dry spells with warm nights'
    },
    ipm: {
      cultural: [
        'Strictly adhere to timely sowing (May-June) and avoid extending cotton crop past 150 days.',
        'Collect and destroy dropped squares, dried rosetted flowers, and infested green bolls weekly.',
        'Destroy crop stalks immediately after final picking with shredders or rotavators.'
      ],
      mechanical: [
        'Install Pheromone Traps (Pecti-Lure) @ 5 traps/acre for surveillance, 8-10 traps/acre for mass trapping.',
        'Install 1 Solar Light Trap per 5 acres to capture nocturnal adult moths.'
      ],
      biological: [
        {
          name: 'Trichogramma bactrae (Egg Parasitoid)',
          dosage: '60,000 parasitized eggs (3 Tricho-cards) / acre',
          costEstimate: '₹280/acre',
          timing: 'Release weekly starting from 45 days after sowing (squaring stage)'
        },
        {
          name: 'Beauveria bassiana 1.15% WP',
          dosage: '5g / liter (75g / 15L tank)',
          costEstimate: '₹260/acre',
          timing: 'Evening spray during early larval emergence'
        },
        {
          name: 'Neem Seed Kernel Extract (NSKE 5%) or Azadirachtin 10000 ppm',
          dosage: '2ml / liter (30ml / 15L tank)',
          costEstimate: '₹350/acre',
          timing: 'Preventive ovicidal spray at first trap catch'
        }
      ],
      chemical: [
        {
          molecule: 'Chlorantraniliprole 18.5% SC (CIBRC Approved)',
          brandExamples: 'Coragen / Ampligo',
          dosagePerLiter: '0.3ml / liter',
          dosagePerTank: '4.5ml per 15L knapsack tank',
          dosagePerAcre: '60ml in 200L water',
          costEstimate: '₹950/acre',
          phiDays: 14,
          safetyCategory: 'Green (Target-specific)',
          advisory: 'Spray only when moth catches cross ETL (Economic Threshold: 8 moths/trap/day for 3 consecutive days).'
        },
        {
          molecule: 'Emamectin Benzoate 5% SG (CIBRC Approved)',
          brandExamples: 'Proclaim / EM-1',
          dosagePerLiter: '0.5g / liter',
          dosagePerTank: '7.5g per 15L knapsack tank',
          dosagePerAcre: '100g in 200L water',
          costEstimate: '₹680/acre',
          phiDays: 10,
          safetyCategory: 'Yellow (Targeted)',
          advisory: 'Target small larvae before they enter the internal boll cavity.'
        }
      ]
    },
    audioAdvisory: {
      mr: 'कापूस पिकावर गुलाबी बोंडअळीचा प्रादुर्भाव झाला आहे. शेतात एकरी ५ कामगंध सापळे (फेरोमोन ट्रॅप) लावा. जास्त प्रादुर्भाव असल्यास कोराजन ४.५ मिली प्रति पंप फवारा. संध्याकाळी फवारणी करा.',
      hi: 'कपास की फसल में गुलाबी सुंडी का प्रकोप दर्ज हुआ है। प्रति एकड़ 5 फेरोमोन ट्रैप लगाएं। ईटीएल स्तर पार होने पर अनुशंसित कीटनाशक का शाम के समय छिड़काव करें।'
    },
    sampleImage: 'https://images.unsplash.com/photo-1598880940371-c756e015fea1?auto=format&fit=crop&w=600&q=80',
    affectedDistricts: ['Yavatmal', 'Amravati', 'Jalgaon', 'Wardha', 'Nanded']
  },
  {
    id: 'grape-downy-mildew',
    crop: 'Grapes',
    cropMarathi: 'द्राक्ष',
    cropHindi: 'अंगूर',
    name: 'Downy Mildew',
    marathiName: 'केवडा रोग (डाऊनी मिल्ड्यू)',
    hindiName: 'मृदु रोमिल आसिता (डाउनी मिल्ड्यू)',
    pathogenType: 'Fungal / Oomycete',
    scientificName: 'Plasmopara viticola',
    severity: 'High',
    severityScore: 3,
    confidence: 97,
    symptoms: 'Yellowish oily \'oil-spot\' lesions on the upper leaf surface; dense white, cottony downy growth on the corresponding underside; infected clusters shrivel and turn brown.',
    marathiSymptoms: 'पानांच्या वरच्या बाजूवर तेलासारखे पिवळसर डाग, खालच्या बाजूवर कापसासारखी पांढरी बुरशी, घड काळवंडून सुकतात.',
    hindiSymptoms: 'पत्तियों की ऊपरी सतह पर तेल जैसे पीले धब्बे, नीचे सफेद मखमली फफूंद, अंगूर के गुच्छे सूखकर भूरे हो जाते हैं।',
    favorableConditions: {
      tempRange: '20°C - 26°C',
      rhMin: '90%',
      leafWetnessHours: '8+ hrs (3-10 rule: 10mm rain, 10°C temp, 10cm shoot length)',
      rainfall: 'Frequent drizzle or morning dew'
    },
    ipm: {
      cultural: [
        'Canopy management: Thin out inner leaves to ensure sunlight penetration and rapid foliage drying.',
        'Clean vineyard floor of fallen leaves and pruned cane trimmings.',
        'Avoid high nitrogen fertilization which produces overly succulent foliage.'
      ],
      mechanical: [
        'Prune water shoots and infected cane tips before monsoon showers.'
      ],
      biological: [
        {
          name: 'Ampelomyces quisqualis / Trichoderma viride',
          dosage: '4g / liter',
          costEstimate: '₹320/acre',
          timing: 'Post-pruning protective spray'
        },
        {
          name: 'Potassium Phosphite (Biorational systemic booster)',
          dosage: '3g / liter',
          costEstimate: '₹480/acre',
          timing: 'Foliar application at 5-leaf stage'
        }
      ],
      chemical: [
        {
          molecule: 'Dimethomorph 50% WP (CIBRC Approved)',
          brandExamples: 'Acrobat / Curzate',
          dosagePerLiter: '1.0g / liter',
          dosagePerTank: '15g per 15L knapsack tank',
          dosagePerAcre: '200g in 200L water',
          costEstimate: '₹820/acre',
          phiDays: 21,
          safetyCategory: 'Green/Blue',
          advisory: 'Systemic curative spray; apply within 48 hours of high-risk infection rain event.'
        },
        {
          molecule: 'Bordeaux Mixture (1%) / Copper Hydroxide 53.8% DF',
          brandExamples: 'Kocide / Bordeaux',
          dosagePerLiter: '2.0g / liter',
          dosagePerTank: '30g per 15L knapsack tank',
          dosagePerAcre: '400g in 200L water',
          costEstimate: '₹380/acre',
          phiDays: 7,
          safetyCategory: 'Green (Contact Protectant)',
          advisory: 'Use as preventive shield before anticipated rain.'
        }
      ]
    },
    audioAdvisory: {
      mr: 'द्राक्ष बागेत डाऊनी मिल्ड्यू (केवडा) रोगाची लागण झाली आहे. तेलकट डाग वाढण्याआधी एकरी डिमेथोमॉर्फ किंवा बोर्डो मिश्रणाची फवारणी करा. झाडांचा विस्तार मोकळा ठेवा.',
      hi: 'अंगूर में डाउनी मिल्ड्यू के लक्षण हैं। तुरंत डाइमेथोमोर्फ अथवा बोर्डो मिश्रण का सुरक्षात्मक छिड़काव करें। छंटाई करके धूप आने दें।'
    },
    sampleImage: 'https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=600&q=80',
    affectedDistricts: ['Nashik', 'Sangli', 'Solapur', 'Pune']
  },
  {
    id: 'soybean-rust',
    crop: 'Soybean',
    cropMarathi: 'सोयाबीन',
    cropHindi: 'सोयाबीन',
    name: 'Soybean Rust',
    marathiName: 'सोयाबीन तांबेरा रोग (रस्ट)',
    hindiName: 'सोयाबीन गेरूई / रस्ट रोग',
    pathogenType: 'Fungal',
    scientificName: 'Phakopsora pachyrhizi',
    severity: 'Moderate',
    severityScore: 2,
    confidence: 91,
    symptoms: 'Minute pinhead reddish-brown pustules on the lower leaf surface, yellowing of upper leaf canopy, rapid premature defoliation leading to poorly filled pods.',
    marathiSymptoms: 'पानांच्या खालच्या बाजूवर तांबूस तपकिरी लहान पुरळ/ठिपके, पाने पिवळी पडून गळतात, दाणे भरत नाहीत.',
    hindiSymptoms: 'पत्तियों की निचली सतह पर छोटे लाल-भूरे रंग के दानेदार धब्बे, पत्तियां पीली पड़कर तेजी से गिरती हैं।',
    favorableConditions: {
      tempRange: '18°C - 28°C',
      rhMin: '80%',
      leafWetnessHours: '6+ hrs',
      rainfall: 'Prolonged cloudy weather'
    },
    ipm: {
      cultural: [
        'Use rust-tolerant varieties (e.g. JS 335, Phule Kalyani).',
        'Avoid excessive plant density; adhere to 45cm row-to-row spacing.'
      ],
      mechanical: [
        'Survey fields regularly at flowering and pod development stages.'
      ],
      biological: [
        {
          name: 'Pseudomonas fluorescens 0.5% + Neem Oil 3000 ppm',
          dosage: '3ml / liter',
          costEstimate: '₹240/acre',
          timing: 'Early flowering stage'
        }
      ],
      chemical: [
        {
          molecule: 'Hexaconazole 5% EC (CIBRC Approved)',
          brandExamples: 'Contaf / Sitara',
          dosagePerLiter: '1.0ml / liter',
          dosagePerTank: '15ml per 15L knapsack tank',
          dosagePerAcre: '200ml in 200L water',
          costEstimate: '₹320/acre',
          phiDays: 30,
          safetyCategory: 'Green (Systemic triazole)',
          advisory: 'Spray immediately at first appearance of pustules on bottom leaves.'
        },
        {
          molecule: 'Pyraclostrobin 20% WG (CIBRC Approved)',
          brandExamples: 'Headline / Opera',
          dosagePerLiter: '1.0g / liter',
          dosagePerTank: '15g per 15L knapsack tank',
          dosagePerAcre: '200g in 200L water',
          costEstimate: '₹850/acre',
          phiDays: 20,
          safetyCategory: 'Blue',
          advisory: 'Gives broad-spectrum curative and greening protection.'
        }
      ]
    },
    audioAdvisory: {
      mr: 'सोयाबीन पिकावर तांबेरा रोगाचे ठिपके आढळले आहेत. हेक्साकोनाझोल १५ मिली प्रति पंप घेऊन त्वरित फवारणी करा, जेणेकरून दाणे पोचट होणार नाहीत.',
      hi: 'सोयाबीन में रस्ट (गेरूई) का संक्रमण है। हेक्साकोनाज़ोल का 1 मिली प्रति लीटर के हिसाब से छिड़काव करें।'
    },
    sampleImage: 'https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?auto=format&fit=crop&w=600&q=80',
    affectedDistricts: ['Kolhapur', 'Sangli', 'Latur', 'Amravati', 'Nanded']
  },
  {
    id: 'sugarcane-red-rot',
    crop: 'Sugarcane',
    cropMarathi: 'ऊस',
    cropHindi: 'गन्ना',
    name: 'Red Rot',
    marathiName: 'उसाचा लाल कुजव्या रोग (रेड रॉट)',
    hindiName: 'गन्ने का लाल सड़न रोग (रेड रॉट)',
    pathogenType: 'Fungal',
    scientificName: 'Colletotrichum falcatum',
    severity: 'Severe',
    severityScore: 3,
    confidence: 95,
    symptoms: 'Third or fourth leaf from top shows yellowing and drying along midrib; split cane exhibits red internal pith with diagnostic transverse white patches and alcohol odor.',
    marathiSymptoms: 'वरची पाने पिवळी पडून सुकतात, ऊस उभा कापल्यास आतील गर लाल झालेला दिसतो व आडवे पांढरे पट्टे आढळतात, दारूसारखा वास येतो.',
    hindiSymptoms: 'गन्ने की ऊपरी पत्तियां सूखने लगती हैं, गन्ने को चीरने पर अंदर लाल रंग और सफेद आड़े चकत्ते दिखाई देते हैं तथा गन्ने से खट्टी गंध आती है।',
    favorableConditions: {
      tempRange: '26°C - 32°C',
      rhMin: '80%',
      leafWetnessHours: 'Waterlogged soil',
      rainfall: 'Flooding and ill-drained soils'
    },
    ipm: {
      cultural: [
        'Use certified disease-free setts from registered seed nurseries.',
        'Hot Water Treatment of setts at 52°C for 30 minutes before planting.',
        'Strictly uproot and burn completely affected sugarcane clumps.',
        'Do not ratoon severely infected fields; practice 2-year crop rotation with paddy or sunnhemp.'
      ],
      mechanical: [
        'Provide proper drainage channels to prevent water stagnation in the field.'
      ],
      biological: [
        {
          name: 'Trichoderma viride settled soil application',
          dosage: '2.5 kg mixed with 500 kg well-decomposed FYM per acre',
          costEstimate: '₹450/acre',
          timing: 'Basal application at planting'
        }
      ],
      chemical: [
        {
          molecule: 'Carbendazim 50% WP Sett Treatment (CIBRC Approved)',
          brandExamples: 'Bavistin / Dhanustin',
          dosagePerLiter: '1.0g / liter for 15-minute sett dipping',
          dosagePerTank: 'N/A (Sett Dip)',
          dosagePerAcre: '250g in 250L water',
          costEstimate: '₹280/acre',
          phiDays: 60,
          safetyCategory: 'Blue',
          advisory: 'Foliar sprays are ineffective once internal stalk infection sets in. Sett treatment is mandatory.'
        }
      ]
    },
    audioAdvisory: {
      mr: 'उसावर लाल कुजव्या रोगाची लागण आढळली आहे. बाधित उसाचे बेट मुळासकट उपटून नष्ट करा. पुढील लागवडीसाठी बेणेप्रक्रिया नक्की करा.',
      hi: 'गन्ने में लाल सड़न (रेड रॉट) का संक्रमण है। रोगग्रस्त पौधे को उखाड़कर नष्ट करें और जल निकासी की व्यवस्था करें।'
    },
    sampleImage: 'https://images.unsplash.com/photo-1544078741-7ea0e0cb8007?auto=format&fit=crop&w=600&q=80',
    affectedDistricts: ['Kolhapur', 'Sangli', 'Pune', 'Ahmednagar', 'Solapur']
  },
  {
    id: 'rice-blast',
    crop: 'Rice / Paddy',
    cropMarathi: 'भात / धान',
    cropHindi: 'धान / चावल',
    name: 'Rice Blast',
    marathiName: 'भातावरील करपा (राईस ब्लास्ट)',
    hindiName: 'धान का ब्लास्ट / झोंका रोग',
    pathogenType: 'Fungal',
    scientificName: 'Magnaporthe oryzae',
    severity: 'High',
    severityScore: 3,
    confidence: 93,
    symptoms: 'Spindle/diamond-shaped lesions with grey/whitish centers and dark reddish-brown margins on leaves, neck rot causing panicles to fall over with empty chaffy grains.',
    marathiSymptoms: 'पानांवर डोळ्याच्या आकाराचे करडे मध्यभाग असलेले तपकिरी कडांचे ठिपके (स्पिंडल आकार), मानेचा करपा लागल्यास लोंब्या तुटतात व दाणे पोकळ होतात.',
    hindiSymptoms: 'पत्तियों पर आँख के आकार के धब्बे जिनका केंद्र भूरा-सफेद और किनारे गहरे होते हैं, बाली की गर्दन सड़ने से दाने नहीं भरते।',
    favorableConditions: {
      tempRange: '20°C - 26°C',
      rhMin: '90%',
      leafWetnessHours: '12+ hrs',
      rainfall: 'High humidity, drizzle, excess nitrogen'
    },
    ipm: {
      cultural: [
        'Avoid excess application of nitrogenous fertilizers; split Urea into 3-4 doses.',
        'Use blast-resistant varieties (e.g. Karjat-3, Ratnagiri-4, Phule Radha).',
        'Burn stubbles and weed hosts (Echinochloa crus-galli) along bunds.'
      ],
      mechanical: [
        'Regulate water level; do not allow field to dry out completely during tillering.'
      ],
      biological: [
        {
          name: 'Pseudomonas fluorescens 1.5% WP (Seed & foliar)',
          dosage: '10g / kg seed treat; 5g / liter foliar',
          costEstimate: '₹220/acre',
          timing: 'At tillering and panicle initiation'
        }
      ],
      chemical: [
        {
          molecule: 'Tricyclazole 75% WP (CIBRC Approved)',
          brandExamples: 'Beam / Baan / Sivic',
          dosagePerLiter: '0.6g / liter',
          dosagePerTank: '9g per 15L knapsack tank',
          dosagePerAcre: '120g in 200L water',
          costEstimate: '₹420/acre',
          phiDays: 30,
          safetyCategory: 'Blue (Highly effective systemic blasticide)',
          advisory: 'Apply at early tillering and repeat at 5% heading if weather favors disease.'
        },
        {
          molecule: 'Isoprothiolane 40% EC (CIBRC Approved)',
          brandExamples: 'Fuji-One',
          dosagePerLiter: '1.5ml / liter',
          dosagePerTank: '22.5ml per 15L knapsack tank',
          dosagePerAcre: '300ml in 200L water',
          costEstimate: '₹550/acre',
          phiDays: 25,
          safetyCategory: 'Green',
          advisory: 'Controls both leaf blast and neck blast.'
        }
      ]
    },
    audioAdvisory: {
      mr: 'भाताच्या पिकावर ब्लास्ट (करपा) रोगाचे ठिपके आले आहेत. ट्रायसायक्लॅझोल ९ ग्रॅम प्रति पंप घेऊन फवारणी करा आणि युरिया खताचा अतिवापर टाळा.',
      hi: 'धान में ब्लास्ट रोग के लक्षण हैं। ट्राइसाइक्लाजोल का छिड़काव करें तथा अत्यधिक यूरिया का प्रयोग न करें।'
    },
    sampleImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80',
    affectedDistricts: ['Raigad', 'Ratnagiri', 'Sindhudurg', 'Bhandara', 'Gondia', 'Chandrapur']
  },
  {
    id: 'pomegranate-bacterial-blight',
    crop: 'Pomegranate',
    cropMarathi: 'डाळिंब',
    cropHindi: 'अनार',
    name: 'Bacterial Blight (Telya)',
    marathiName: 'डाळिंबावरील तेल्या रोग (बॅक्टेरियल ब्लाइट)',
    hindiName: 'अनार का जीवाणु झुलसा / तेल्या रोग',
    pathogenType: 'Bacterial',
    scientificName: 'Xanthomonas axonopodis pv. punicae',
    severity: 'Severe',
    severityScore: 3,
    confidence: 96,
    symptoms: 'Water-soaked translucent dark oily spots on leaves, nodal stem cracking with black cankers, distinctive \'Y\' or \'L\' shaped cracks on developing fruit with oily exudates.',
    marathiSymptoms: 'पानांवर तेलकट काळे ठिपके, फांद्यांवर काळ्या गाठी व तडे, फळांवर इंग्रजी \'L\' किंवा \'Y\' आकाराचे तेलकट काळे तडे जातात.',
    hindiSymptoms: 'पत्तियों पर तेल जैसे काले धब्बे, तनों पर गांठें व दरारें, फलों पर \'Y\' अथवा \'L\' आकार की गहरी तेलकट दरारें पड़ती हैं।',
    favorableConditions: {
      tempRange: '25°C - 35°C',
      rhMin: '70%',
      leafWetnessHours: 'Frequent rain splashing & high wind',
      rainfall: 'Heavy monsoon showers'
    },
    ipm: {
      cultural: [
        'Strict orchard sanitation: Cut infected shoots 2 inches below infection and paste with Copper Oxychloride.',
        'Disinfect secateurs with 2.5% Sodium Hypochlorite after every single cut.',
        'Regulate hasta-bahar or mrig-bahar flowering to avoid high disease intensity months.'
      ],
      mechanical: [
        'Collect and bury fallen infected leaves and cracked fruits in deep pits with bleaching powder.'
      ],
      biological: [
        {
          name: 'Bacillus subtilis / Pseudomonas fluorescens',
          dosage: '5g / liter',
          costEstimate: '₹340/acre',
          timing: 'Preventive foliage spray prior to monsoon'
        }
      ],
      chemical: [
        {
          molecule: 'Streptocycline 90:10 (Streptomycin Sulphate + Tetracycline) + Copper Oxychloride (CIBRC Approved)',
          brandExamples: 'Streptocycline + Blitox',
          dosagePerLiter: '0.5g Streptocycline + 2.5g COC / liter',
          dosagePerTank: '7.5g Streptocycline + 37.5g COC per 15L tank',
          dosagePerAcre: '100g Strepto + 500g COC in 200L water',
          costEstimate: '₹750/acre',
          phiDays: 30,
          safetyCategory: 'Yellow (Bactericide + Protectant)',
          advisory: 'Spray at 10-12 day intervals during rainy spells. Alternate with 2-bromo-2-nitropropane-1,3-diol (Bronopol).'
        }
      ]
    },
    audioAdvisory: {
      mr: 'डाळिंबावर तेल्या रोगाचा प्रादुर्भाव आहे. बाधित फळे व फांद्या छाटून नष्ट करा. स्ट्रेप्टोसायक्लिन आणि कॉपर ऑक्सीक्लोराईडची तातडीने फवारणी करा.',
      hi: 'अनार में तेल्या (जीवाणु झुलसा) का संक्रमण है। संक्रमित टहनियों को काटकर कॉपर पेस्ट लगाएं और स्ट्रेप्टोसाइक्लिन का छिड़काव करें।'
    },
    sampleImage: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=600&q=80',
    affectedDistricts: ['Solapur', 'Nashik', 'Sangli', 'Ahmednagar']
  },
  {
    id: 'healthy-crop',
    crop: 'Tomato / Cotton / General',
    cropMarathi: 'निरोगी पीक',
    cropHindi: 'स्वस्थ फसल',
    name: 'Healthy Crop (No Disease Detected)',
    marathiName: 'निरोगी पीक (कोणताही रोग नाही)',
    hindiName: 'स्वस्थ फसल (कोई रोग नहीं मिला)',
    pathogenType: 'None',
    scientificName: 'Healthy Vigorous Specimen',
    severity: 'Healthy',
    severityScore: 0,
    confidence: 99,
    symptoms: 'Vibrant green chlorophyll density, no chlorotic halos, no pathogen lesions, crisp leaf margins, normal turgor pressure.',
    marathiSymptoms: 'पाने निरोगी, गर्द हिरवीगार, कोणतेही डाग किंवा किडीची लक्षणे नाहीत.',
    hindiSymptoms: 'पत्तियां पूर्णतः स्वस्थ, हरी-भरी हैं। कोई कीट अथवा कवक के लक्षण नहीं पाए गए।',
    favorableConditions: {
      tempRange: 'Optimal',
      rhMin: 'Balanced',
      leafWetnessHours: 'Normal',
      rainfall: 'Adequate'
    },
    ipm: {
      cultural: ['Continue regular nutrient and water management as per crop schedule.'],
      mechanical: ['Keep surveillance sticky traps active.'],
      biological: ['Prophylactic spray of Neem oil (3000 ppm) @ 2ml/L to maintain immunity.'],
      chemical: ['No chemical sprays required at this stage. Save input costs!']
    },
    audioAdvisory: {
      mr: 'अभिनंदन! तुमचे पीक पूर्णपणे निरोगी आहे. कोणत्याही रासायनिक फवारणीची गरज नाही. नियमित देखरेख चालू ठेवा.',
      hi: 'बधाई! आपकी फसल पूरी तरह स्वस्थ है। किसी भी रासायनिक छिड़काव की आवश्यकता नहीं है।'
    },
    sampleImage: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    affectedDistricts: []
  }
];