/**
 * Comprehensive Knowledge Base & IPM Prescriptions for all 38 PlantVillage Classes
 * Fully aligns headline names, scientific taxonomy, symptoms, and CIBRC IPM regimens
 * with the 38 PlantVillage Softmax Class Probabilities.
 */

export const PLANTVILLAGE_DISEASE_REGISTRY = {
  // --- APPLE ---
  'Apple___Apple_scab': {
    crop: 'Apple',
    name: 'Apple Scab',
    scientificName: 'Venturia inaequalis',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Olive-green to black velvety spots on leaves, becoming brown and corky with premature leaf drop.',
    ipm: {
      cultural: ['Rake and destroy fallen leaves in autumn to reduce overwintering ascospores.'],
      biological: [{ name: 'Bacillus subtilis (Serenade ASO)', dosage: '3ml / liter' }],
      chemical: [{
        molecule: 'Difenoconazole 25% EC (CIBRC Approved)',
        dosagePerLiter: '0.5ml / liter',
        brandExamples: 'Score / Karathane',
        phiDays: 14
      }]
    }
  },
  'Apple___Black_rot': {
    crop: 'Apple',
    name: 'Apple Black Rot / Frog-eye Leaf Spot',
    scientificName: 'Botryosphaeria obtusa',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Small purple leaf spots enlarging into circular "frog-eye" lesions with brown centers and purple borders.',
    ipm: {
      cultural: ['Prune out dead wood, mummified fruits, and cankered branches during dormancy.'],
      biological: [{ name: 'Trichoderma harzianum', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Captan 50% WP (CIBRC Approved)',
        dosagePerLiter: '2.5g / liter',
        brandExamples: 'Captaf / Deltan',
        phiDays: 10
      }]
    }
  },
  'Apple___Cedar_apple_rust': {
    crop: 'Apple',
    name: 'Cedar Apple Rust',
    scientificName: 'Gymnosporangium juniperi-virginianae',
    pathogenType: 'Fungal (Heteroecious Rust)',
    severity: 'Moderate',
    symptoms: 'Bright yellow-orange circular lesions on upper leaf surface; cup-shaped spore-bearing structures (aecia) on underside.',
    ipm: {
      cultural: ['Remove nearby alternate hosts (eastern red cedar/juniper galls) within 1-2 miles.'],
      biological: [{ name: 'Pseudomonas fluorescens 1% WP', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Myclobutanil 10% WP (CIBRC Approved)',
        dosagePerLiter: '1.0g / liter',
        brandExamples: 'Systhane / Rally',
        phiDays: 14
      }]
    }
  },
  'Apple___healthy': {
    crop: 'Apple',
    name: 'Healthy Apple Foliage',
    scientificName: 'Malus domestica (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Vibrant green chlorophyll density, crisp leaf margins, no fungal lesions or chlorosis.',
    ipm: {
      cultural: ['Maintain balanced irrigation and balanced NPK nutrition.'],
      biological: [{ name: 'Neem oil prophylactic spray', dosage: '3ml / liter' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- BLUEBERRY ---
  'Blueberry___healthy': {
    crop: 'Blueberry',
    name: 'Healthy Blueberry Foliage',
    scientificName: 'Vaccinium corymbosum (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Uniform dark green leaves with no spotting or marginal necroses.',
    ipm: {
      cultural: ['Ensure soil pH remains between 4.5 and 5.2.'],
      biological: [{ name: 'Mycorrhizal root inoculant', dosage: '10g / plant' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- CHERRY ---
  'Cherry_(including_sour)___Powdery_mildew': {
    crop: 'Cherry',
    name: 'Cherry Powdery Mildew',
    scientificName: 'Podosphaera clandestina',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'White powdery patches on new leaves and shoot tips, causing leaf curling and upward puckering.',
    ipm: {
      cultural: ['Prune dense canopies to promote maximum sunlight and airflow.'],
      biological: [{ name: 'Ampelomyces quisqualis (Bio-fungicide)', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Wettable Sulphur 80% WDG (CIBRC Approved)',
        dosagePerLiter: '2.5g / liter',
        brandExamples: 'Sulfex / Thiovit',
        phiDays: 5
      }]
    }
  },
  'Cherry_(including_sour)___healthy': {
    crop: 'Cherry',
    name: 'Healthy Cherry Foliage',
    scientificName: 'Prunus avium (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Smooth green lamina with normal turgor and no fungal sporulation.',
    ipm: {
      cultural: ['Standard orchard hygiene and drip irrigation.'],
      biological: [{ name: 'Neem seed kernel extract 5%', dosage: '5ml / liter' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- CORN ---
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot': {
    crop: 'Corn (Maize)',
    name: 'Gray Leaf Spot (Cercospora)',
    scientificName: 'Cercospora zeae-maydis',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Rectangular blocky lesions restricted by leaf veins; lesions turn grayish-brown with yellow margins.',
    ipm: {
      cultural: ['Practice crop rotation with non-host crops (soybean/pulses); till under crop debris.'],
      biological: [{ name: 'Trichoderma viride', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Azoxystrobin 18.2% + Difenoconazole 11.4% SC (CIBRC Approved)',
        dosagePerLiter: '1.0ml / liter',
        brandExamples: 'Amistar Top',
        phiDays: 21
      }]
    }
  },
  'Corn_(maize)___Common_rust_': {
    crop: 'Corn (Maize)',
    name: 'Corn Common Rust',
    scientificName: 'Puccinia sorghi',
    pathogenType: 'Fungal (Rust)',
    severity: 'Moderate',
    symptoms: 'Cinnamon-brown to reddish-orange powdery pustules (uredinia) scattered across both upper and lower leaf surfaces.',
    ipm: {
      cultural: ['Plant rust-resistant hybrid varieties; avoid late planting dates.'],
      biological: [{ name: 'Pseudomonas fluorescens 1.5% WP', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Mancozeb 75% WP (CIBRC Approved)',
        dosagePerLiter: '2.5g / liter',
        brandExamples: 'Dithane M-45 / Indofil M-45',
        phiDays: 14
      }]
    }
  },
  'Corn_(maize)___Northern_Leaf_Blight': {
    crop: 'Corn (Maize)',
    name: 'Northern Corn Leaf Blight',
    scientificName: 'Exserohilum turcicum',
    pathogenType: 'Fungal',
    severity: 'Severe',
    symptoms: 'Large, elongated, cigar-shaped grayish-green to tan lesions (2.5 to 15 cm long) on foliage.',
    ipm: {
      cultural: ['Deep plow infected residues; practice 1-2 year rotation.'],
      biological: [{ name: 'Bacillus subtilis', dosage: '4g / liter' }],
      chemical: [{
        molecule: 'Propiconazole 25% EC (CIBRC Approved)',
        dosagePerLiter: '1.0ml / liter',
        brandExamples: 'Tilt / Bumper',
        phiDays: 21
      }]
    }
  },
  'Corn_(maize)___healthy': {
    crop: 'Corn (Maize)',
    name: 'Healthy Corn Foliage',
    scientificName: 'Zea mays (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Robust parallel-veined green lamina with no necrotic spotting or pustules.',
    ipm: {
      cultural: ['Balanced NPK application with zinc micronutrient supplementation.'],
      biological: [{ name: 'Azotobacter bio-fertilizer foliar spray', dosage: '5ml / liter' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- GRAPE ---
  'Grape___Black_rot': {
    crop: 'Grape',
    name: 'Grape Black Rot',
    scientificName: 'Guignardia bidwellii',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Small, circular reddish-brown leaf spots with tiny black pycnidia pimples in the lesion center.',
    ipm: {
      cultural: ['Canopy pruning to maximize ventilation and rapid leaf drying.'],
      biological: [{ name: 'Trichoderma harzianum 2% WP', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Mancozeb 75% WP (CIBRC Approved)',
        dosagePerLiter: '2.5g / liter',
        brandExamples: 'Dithane M-45',
        phiDays: 14
      }]
    }
  },
  'Grape___Esca_(Black_Measles)': {
    crop: 'Grape',
    name: 'Grape Esca (Black Measles)',
    scientificName: 'Phaeomoniella chlamydospora',
    pathogenType: 'Fungal (Vascular Wood Canker)',
    severity: 'Severe',
    symptoms: '"Tiger-stripe" interveinal necrosis on leaves with dark brown necrotic margins and yellow halos.',
    ipm: {
      cultural: ['Disinfect pruning shears with 70% alcohol; seal large pruning wounds with copper paste.'],
      biological: [{ name: 'Trichoderma atroviride wound protectant', dosage: '10g / paste' }],
      chemical: [{
        molecule: 'Copper Hydroxide 53.8% DF (CIBRC Approved)',
        dosagePerLiter: '2.0g / liter',
        brandExamples: 'Kocide 3000',
        phiDays: 7
      }]
    }
  },
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)': {
    crop: 'Grape',
    name: 'Grape Leaf Blight (Isariopsis)',
    scientificName: 'Pseudocercospora cladosporioides',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Irregular dull brown lesions with yellow chlorotic margins on older leaves, leading to defoliation.',
    ipm: {
      cultural: ['Remove lower senescent leaves after fruit set.'],
      biological: [{ name: 'Pseudomonas fluorescens', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Hexaconazole 5% EC (CIBRC Approved)',
        dosagePerLiter: '1.0ml / liter',
        brandExamples: 'Contaf 5E',
        phiDays: 20
      }]
    }
  },
  'Grape___healthy': {
    crop: 'Grape',
    name: 'Healthy Grape Foliage',
    scientificName: 'Vitis vinifera (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Uniform dark green leaves with intact lobed margins and no downy or powdery sporulation.',
    ipm: {
      cultural: ['Manage drip fertigation and maintain open canopy structure.'],
      biological: [{ name: 'Neem oil prophylactic spray', dosage: '2ml / liter' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- ORANGE ---
  'Orange___Haunglongbing_(Citrus_greening)': {
    crop: 'Orange (Citrus)',
    name: 'Citrus Greening (Huanglongbing)',
    scientificName: 'Candidatus Liberibacter asiaticus',
    pathogenType: 'Bacterial (Vector-Borne via Psyllids)',
    severity: 'Severe',
    symptoms: 'Asymmetric blotchy mottle yellowing across leaf veins, small upright leaves, and vein corking.',
    ipm: {
      cultural: ['Remove and destroy infected trees; plant certified disease-free nursery rootstocks.'],
      biological: [{ name: 'Tamarixia radiata (Parasitoid of citrus psyllid vector)', dosage: '200 adults / acre' }],
      chemical: [{
        molecule: 'Imidacloprid 17.8% SL (Vector Control - CIBRC Approved)',
        dosagePerLiter: '0.4ml / liter',
        brandExamples: 'Confidor / Victor',
        phiDays: 15
      }]
    }
  },

  // --- PEACH ---
  'Peach___Bacterial_spot': {
    crop: 'Peach',
    name: 'Peach Bacterial Spot',
    scientificName: 'Xanthomonas arboricola pv. pruni',
    pathogenType: 'Bacterial',
    severity: 'Moderate',
    symptoms: 'Angular water-soaked spots on leaves that turn reddish-purple and drop out, creating a "shot-hole" appearance.',
    ipm: {
      cultural: ['Avoid high-velocity overhead irrigation; plant resistant cultivars.'],
      biological: [{ name: 'Bacillus amyloliquefaciens', dosage: '3ml / liter' }],
      chemical: [{
        molecule: 'Copper Oxychloride 50% WP + Streptocycline (CIBRC Approved)',
        dosagePerLiter: '2.5g COC + 0.1g Strepto / liter',
        brandExamples: 'Blitox + Streptocycline',
        phiDays: 14
      }]
    }
  },
  'Peach___healthy': {
    crop: 'Peach',
    name: 'Healthy Peach Foliage',
    scientificName: 'Prunus persica (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Glossy lanceolate green leaves without shot-holes or bacterial spots.',
    ipm: {
      cultural: ['Regular pruning and balanced nitrogen fertigation.'],
      biological: [{ name: 'Neem oil prophylactic shield', dosage: '3ml / liter' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- PEPPER BELL ---
  'Pepper,_bell___Bacterial_spot': {
    crop: 'Pepper (Capsicum)',
    name: 'Pepper Bacterial Spot',
    scientificName: 'Xanthomonas campestris pv. vesicatoria',
    pathogenType: 'Bacterial',
    severity: 'Moderate',
    symptoms: 'Small, dark brown, circular to irregular water-soaked spots with yellow halos, causing heavy blossom and leaf drop.',
    ipm: {
      cultural: ['Use certified disease-free treated seed; practice 2-year crop rotation with non-solanaceous crops.'],
      biological: [{ name: 'Pseudomonas fluorescens 1% WP', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Copper Oxychloride 50% WP + Streptocycline (CIBRC Approved)',
        dosagePerLiter: '2.5g COC + 0.1g Strepto / liter',
        brandExamples: 'Blitox + Streptocycline',
        phiDays: 3
      }]
    }
  },
  'Pepper,_bell___healthy': {
    crop: 'Pepper (Capsicum)',
    name: 'Healthy Pepper Foliage',
    scientificName: 'Capsicum annuum (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Uniform vibrant green leaves with crisp margins and no chlorotic spotting.',
    ipm: {
      cultural: ['Maintain drip moisture and balanced micronutrient spray.'],
      biological: [{ name: 'Neem oil 1500 ppm', dosage: '3ml / liter' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- POTATO ---
  'Potato___Early_blight': {
    crop: 'Potato',
    name: 'Potato Early Blight',
    scientificName: 'Alternaria solani',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Dark brown circular lesions with distinctive concentric rings (target-board appearance) on older lower leaves.',
    ipm: {
      cultural: ['Avoid sprinkler irrigation in the late afternoon; maintain adequate soil potassium.'],
      biological: [{ name: 'Trichoderma harzianum 2% WP', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Mancozeb 75% WP (CIBRC Approved)',
        dosagePerLiter: '2.5g / liter',
        brandExamples: 'Dithane M-45',
        phiDays: 7
      }]
    }
  },
  'Potato___Late_blight': {
    crop: 'Potato',
    name: 'Potato Late Blight',
    scientificName: 'Phytophthora infestans',
    pathogenType: 'Fungal / Oomycete',
    severity: 'Severe',
    symptoms: 'Large, water-soaked dark necrotic lesions on leaf tips and margins; white downy sporulation on leaf underside in humid weather.',
    ipm: {
      cultural: ['Hill up soil over tubers; destroy infected cull piles.'],
      biological: [{ name: 'Trichoderma viride settled soil application', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Dimethomorph 50% WP + Mancozeb (CIBRC Approved)',
        dosagePerLiter: '1.5g / liter',
        brandExamples: 'Acrobat / Ridomil Gold',
        phiDays: 7
      }]
    }
  },
  'Potato___healthy': {
    crop: 'Potato',
    name: 'Healthy Potato Foliage',
    scientificName: 'Solanum tuberosum (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Vigorous compound dark-green leaves with normal cell turgor and zero foliar blight.',
    ipm: {
      cultural: ['Ensure optimal furrow drainage and hilling.'],
      biological: [{ name: 'Prophylactic Trichoderma seed tuber dip', dosage: '10g / kg' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- RASPBERRY ---
  'Raspberry___healthy': {
    crop: 'Raspberry',
    name: 'Healthy Raspberry Foliage',
    scientificName: 'Rubus idaeus (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Compound serrated leaves with rich chlorophyll density and no cane spot lesions.',
    ipm: {
      cultural: ['Prune old floricanes after harvest.'],
      biological: [{ name: 'Neem cake soil application', dosage: '100g / plant' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- SOYBEAN ---
  'Soybean___healthy': {
    crop: 'Soybean',
    name: 'Healthy Soybean Foliage',
    scientificName: 'Glycine max (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Trifoliate leaves with uniform green color, no rust pustules, and no mosaic mottle.',
    ipm: {
      cultural: ['Ensure 45cm row spacing and balanced phosphorus nutrition.'],
      biological: [{ name: 'Rhizobium japonicum seed inoculation', dosage: '250g / 10kg seed' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- SQUASH ---
  'Squash___Powdery_mildew': {
    crop: 'Squash (Cucurbits)',
    name: 'Squash Powdery Mildew',
    scientificName: 'Podosphaera xanthii',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'White talcum-powder-like fungal patches covering both leaf surfaces, leading to early leaf senescence and sun-scalded fruit.',
    ipm: {
      cultural: ['Avoid overhead irrigation; space plants for maximum air circulation.'],
      biological: [{ name: 'Potassium Bicarbonate @ 3g/L + Neem Oil 3000ppm @ 2ml/L', dosage: '3g + 2ml / liter' }],
      chemical: [{
        molecule: 'Azoxystrobin 23% SC (CIBRC Approved)',
        dosagePerLiter: '1.0ml / liter',
        brandExamples: 'Amistar',
        phiDays: 3
      }]
    }
  },

  // --- STRAWBERRY ---
  'Strawberry___Leaf_scorch': {
    crop: 'Strawberry',
    name: 'Strawberry Leaf Scorch',
    scientificName: 'Diplocarpon earlianum',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Irregular dark purple to brown blotches on leaves that coalesce, causing the leaf margins to curl up and appear burned or scorched.',
    ipm: {
      cultural: ['Remove dead scorched foliage after harvest; maintain plastic mulch to prevent soil splashing.'],
      biological: [{ name: 'Bacillus subtilis', dosage: '3ml / liter' }],
      chemical: [{
        molecule: 'Captan 50% WP (CIBRC Approved)',
        dosagePerLiter: '2.0g / liter',
        brandExamples: 'Captaf',
        phiDays: 3
      }]
    }
  },
  'Strawberry___healthy': {
    crop: 'Strawberry',
    name: 'Healthy Strawberry Foliage',
    scientificName: 'Fragaria ananassa (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Trifoliate dark green leaves with intact serrated margins and robust crowns.',
    ipm: {
      cultural: ['Drip irrigation and clean straw mulching.'],
      biological: [{ name: 'Neem oil prophylactic shield', dosage: '2ml / liter' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },

  // --- TOMATO ---
  'Tomato___Bacterial_spot': {
    crop: 'Tomato',
    name: 'Tomato Bacterial Spot',
    scientificName: 'Xanthomonas vesicatoria',
    pathogenType: 'Bacterial',
    severity: 'Moderate',
    symptoms: 'Small, dark brown water-soaked angular spots on leaves, surrounded by yellow halos; leaves turn yellow and drop prematurely.',
    ipm: {
      cultural: ['Avoid working in wet fields; use disease-free certified seeds.'],
      biological: [{ name: 'Pseudomonas fluorescens 1% WP', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Copper Oxychloride 50% WP + Streptocycline (CIBRC Approved)',
        dosagePerLiter: '2.5g COC + 0.1g Strepto / liter',
        brandExamples: 'Blitox + Streptocycline',
        phiDays: 3
      }]
    }
  },
  'Tomato___Early_blight': {
    crop: 'Tomato',
    name: 'Tomato Early Blight',
    scientificName: 'Alternaria solani',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Circular dark brown to black spots with concentric rings (target-like pattern) on older leaves, progressing upward.',
    ipm: {
      cultural: ['Prune bottom 12 inches of foliage to avoid soil spore contact; practice 3-year crop rotation.'],
      biological: [{ name: 'Trichoderma harzianum 2% WP', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Chlorothalonil 75% WP (CIBRC Approved)',
        dosagePerLiter: '2.0g / liter',
        brandExamples: 'Kavach / Bravo',
        phiDays: 5
      }]
    }
  },
  'Tomato___Late_blight': {
    crop: 'Tomato',
    name: 'Tomato Late Blight',
    scientificName: 'Phytophthora infestans',
    pathogenType: 'Fungal / Oomycete',
    severity: 'Severe',
    symptoms: 'Large, dark water-soaked greasy lesions on leaves and stems; white fuzzy mildew under the leaves in damp cool weather.',
    ipm: {
      cultural: ['Avoid sprinkler irrigation; destroy volunteer tomato and potato plants.'],
      biological: [{ name: 'Trichoderma viride foliar spray', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Metalaxyl 8% + Mancozeb 64% WP (CIBRC Approved)',
        dosagePerLiter: '2.0g / liter',
        brandExamples: 'Ridomil Gold / Krilaxyl',
        phiDays: 7
      }]
    }
  },
  'Tomato___Leaf_Mold': {
    crop: 'Tomato',
    name: 'Tomato Leaf Mold',
    scientificName: 'Passalora fulva (Cladosporium)',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Pale green or yellow spots on the upper leaf surface with corresponding olive-green to brown velvety fungal mold on the lower surface.',
    ipm: {
      cultural: ['Increase greenhouse ventilation to keep relative humidity below 85%.'],
      biological: [{ name: 'Bacillus subtilis (Bio-fungicide)', dosage: '3ml / liter' }],
      chemical: [{
        molecule: 'Azoxystrobin 23% SC (CIBRC Approved)',
        dosagePerLiter: '1.0ml / liter',
        brandExamples: 'Amistar',
        phiDays: 3
      }]
    }
  },
  'Tomato___Septoria_leaf_spot': {
    crop: 'Tomato',
    name: 'Tomato Septoria Leaf Spot',
    scientificName: 'Septoria lycopersici',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Numerous small circular spots (2-3 mm) with gray or tan centers and dark brown margins, dotted with tiny black pycnidia speckles.',
    ipm: {
      cultural: ['Mulch around base to prevent rain splashing; remove lower infected leaves immediately.'],
      biological: [{ name: 'Trichoderma harzianum', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Mancozeb 75% WP (CIBRC Approved)',
        dosagePerLiter: '2.5g / liter',
        brandExamples: 'Dithane M-45',
        phiDays: 5
      }]
    }
  },
  'Tomato___Spider_mites Two-spotted_spider_mite': {
    crop: 'Tomato',
    name: 'Tomato Spider Mites (Two-Spotted)',
    scientificName: 'Tetranychus urticae',
    pathogenType: 'Acarine Pest (Mite)',
    severity: 'Moderate',
    symptoms: 'Fine yellow-white stippling (speckling) on upper leaf surface, fine silk webbing under leaves, leaves turning bronze and dry.',
    ipm: {
      cultural: ['Maintain adequate crop hydration; wash foliage with high-pressure water jets.'],
      biological: [{ name: 'Phytoseiulus persimilis (Predatory Mite)', dosage: '2-5 mites / sq. meter' }],
      chemical: [{
        molecule: 'Spiromesifen 22.9% SC (CIBRC Approved)',
        dosagePerLiter: '1.0ml / liter',
        brandExamples: 'Oberon / Volt',
        phiDays: 3
      }]
    }
  },
  'Tomato___Target_Spot': {
    crop: 'Tomato',
    name: 'Tomato Target Spot',
    scientificName: 'Corynespora cassiicola',
    pathogenType: 'Fungal',
    severity: 'Moderate',
    symptoms: 'Small, pinpoint brown spots enlarging into circular lesions with light brown centers and dark concentric rings.',
    ipm: {
      cultural: ['Improve plant spacing for canopy aeration; avoid overhead watering.'],
      biological: [{ name: 'Pseudomonas fluorescens 1% WP', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Pyraclostrobin 20% WG (CIBRC Approved)',
        dosagePerLiter: '1.0g / liter',
        brandExamples: 'Headline / Opera',
        phiDays: 5
      }]
    }
  },
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus': {
    crop: 'Tomato',
    name: 'Tomato Yellow Leaf Curl Virus (TYLCV)',
    scientificName: 'Begomovirus (Whitefly-Transmitted)',
    pathogenType: 'Viral',
    severity: 'Severe',
    symptoms: 'Severe upward curling and cupping of leaf margins, severe interveinal chlorosis, stunted bushy growth, and flower drop.',
    ipm: {
      cultural: ['Install 40-mesh insect-proof netting in nurseries; rogue out infected plants immediately.'],
      biological: [{ name: 'Yellow sticky traps @ 15 traps/acre + Beauveria bassiana for whitefly control', dosage: '5g / liter' }],
      chemical: [{
        molecule: 'Diafenthiuron 50% WP (Vector Control - CIBRC Approved)',
        dosagePerLiter: '1.2g / liter',
        brandExamples: 'Pegasus / Polo',
        phiDays: 7
      }]
    }
  },
  'Tomato___Tomato_mosaic_virus': {
    crop: 'Tomato',
    name: 'Tomato Mosaic Virus (ToMV)',
    scientificName: 'Tobamovirus (Mechanically Transmitted)',
    pathogenType: 'Viral',
    severity: 'Severe',
    symptoms: 'Mottled light and dark green mosaic patterns on leaves, distortion ("fern-leaf" or "shoestring" narrowing), and internal brown fruit browning.',
    ipm: {
      cultural: ['Wash hands with soap/skim milk before handling plants; do not smoke near tomato crops.'],
      biological: [{ name: 'Prophylactic spray of raw milk (10% solution) to inactivate mechanical transmission', dosage: '100ml / liter' }],
      chemical: [{ molecule: 'No direct viricide available. Practice strict vector and sanitation control.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  },
  'Tomato___healthy': {
    crop: 'Tomato',
    name: 'Healthy Tomato Foliage',
    scientificName: 'Solanum lycopersicum (Healthy)',
    pathogenType: 'None',
    severity: 'Healthy',
    symptoms: 'Deep green, turgid compound foliage with no yellowing, lesions, or virus mosaic curling.',
    ipm: {
      cultural: ['Balanced drip fertigation and timely staking.'],
      biological: [{ name: 'Prophylactic Neem oil 1500ppm spray', dosage: '2ml / liter' }],
      chemical: [{ molecule: 'No chemical intervention required.', dosagePerLiter: 'N/A', brandExamples: 'N/A', phiDays: 0 }]
    }
  }
};

/**
 * Returns complete, synchronized structured record matching exact PlantVillage class key.
 */
export const getPlantVillageDiagnosisRecord = (classKey, confidencePct = 95.0) => {
  const reg = PLANTVILLAGE_DISEASE_REGISTRY[classKey];
  if (reg) {
    return {
      id: 'pv-' + classKey.toLowerCase().replace(/[^a-z0-9]/g, '-'),
      crop: reg.crop,
      name: reg.name,
      marathiName: reg.name,
      hindiName: reg.name,
      scientificName: reg.scientificName,
      pathogenType: reg.pathogenType,
      severity: reg.severity === 'Healthy' ? 'Healthy (Grade S0)' : reg.severity === 'Severe' ? 'Severe (Grade S3)' : 'Moderate (Grade S2)',
      confidence: confidencePct,
      symptoms: reg.symptoms,
      marathiSymptoms: reg.symptoms,
      hindiSymptoms: reg.symptoms,
      ipm: reg.ipm
    };
  }

  // Fallback if generic
  return {
    id: 'pv-generic',
    crop: 'Crop Leaf',
    name: classKey.replace(/___/g, ' - ').replace(/_/g, ' '),
    scientificName: 'Agricultural Foliar Specimen',
    pathogenType: 'Pathology',
    severity: 'Moderate (Grade S2)',
    confidence: confidencePct,
    symptoms: 'Foliar condition diagnosed via trained PlantVillage neural model.',
    ipm: {
      cultural: ['Ensure optimal air circulation and remove infected debris.'],
      biological: [{ name: 'Trichoderma harzianum 2% WP', dosage: '5g / liter' }],
      chemical: [{ molecule: 'Copper Oxychloride 50% WP (CIBRC Approved)', dosagePerLiter: '2.5g / liter', brandExamples: 'Blitox', phiDays: 7 }]
    }
  };
};

/**
 * Parse standard PlantVillage class name into Clean Crop Name and Disease Name
 */
export const parsePlantVillageClass = (classKey) => {
  if (!classKey) return { crop: 'Crop Leaf', disease: 'Leaf Disease', isHealthy: false };

  if (PLANTVILLAGE_DISEASE_REGISTRY[classKey]) {
    const reg = PLANTVILLAGE_DISEASE_REGISTRY[classKey];
    return {
      crop: reg.crop,
      disease: reg.name,
      isHealthy: reg.severity === 'Healthy' || reg.name.toLowerCase().includes('healthy')
    };
  }

  if (classKey.includes('___')) {
    const parts = classKey.split('___');
    const rawCrop = parts[0].replace(/_/g, ' ').replace('(maize)', '').trim();
    const rawDisease = parts[1].replace(/_/g, ' ').trim();

    const isHealthy = rawDisease.toLowerCase().includes('healthy');
    const diseaseTitle = isHealthy ? `Healthy ${rawCrop}` : rawDisease;
    return {
      crop: rawCrop.charAt(0).toUpperCase() + rawCrop.slice(1),
      disease: diseaseTitle.charAt(0).toUpperCase() + diseaseTitle.slice(1),
      isHealthy
    };
  }

  return {
    crop: 'Crop Leaf',
    disease: classKey.replace(/_/g, ' '),
    isHealthy: classKey.toLowerCase().includes('healthy')
  };
};
