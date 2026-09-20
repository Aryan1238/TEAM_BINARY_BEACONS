import * as ort from 'onnxruntime-web';
import { getPlantVillageDiagnosisRecord, PLANTVILLAGE_DISEASE_REGISTRY } from '../data/plantVillageRegistry';

// Full 38 PlantVillage Class Taxonomy
export const PLANTVILLAGE_38_CLASSES = [
  'Apple___Apple_scab',
  'Apple___Black_rot',
  'Apple___Cedar_apple_rust',
  'Apple___healthy',
  'Blueberry___healthy',
  'Cherry_(including_sour)___Powdery_mildew',
  'Cherry_(including_sour)___healthy',
  'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn_(maize)___Common_rust_',
  'Corn_(maize)___Northern_Leaf_Blight',
  'Corn_(maize)___healthy',
  'Grape___Black_rot',
  'Grape___Esca_(Black_Measles)',
  'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape___healthy',
  'Orange___Haunglongbing_(Citrus_greening)',
  'Peach___Bacterial_spot',
  'Peach___healthy',
  'Pepper,_bell___Bacterial_spot',
  'Pepper,_bell___healthy',
  'Potato___Early_blight',
  'Potato___Late_blight',
  'Potato___healthy',
  'Raspberry___healthy',
  'Soybean___healthy',
  'Squash___Powdery_mildew',
  'Strawberry___Leaf_scorch',
  'Strawberry___healthy',
  'Tomato___Bacterial_spot',
  'Tomato___Early_blight',
  'Tomato___Late_blight',
  'Tomato___Leaf_Mold',
  'Tomato___Septoria_leaf_spot',
  'Tomato___Spider_mites Two-spotted_spider_mite',
  'Tomato___Target_Spot',
  'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'Tomato___Tomato_mosaic_virus',
  'Tomato___healthy'
];

let onnxSession = null;
let sessionLoadingPromise = null;

/**
 * Load the PlantVillage ResNet9 ONNX Model
 */
export const getOnnxSession = async () => {
  if (onnxSession) return onnxSession;
  if (sessionLoadingPromise) return sessionLoadingPromise;

  sessionLoadingPromise = (async () => {
    try {
      ort.env.wasm.numThreads = 2;
      const session = await ort.InferenceSession.create('./models/plant_disease_resnet9.onnx', {
        executionProviders: ['wasm']
      });
      onnxSession = session;
      console.log('✅ PlantVillage ResNet9 ONNX Model initialized in ONNX Runtime Web');
      return session;
    } catch (err) {
      console.warn('Could not load ONNX session directly:', err);
      sessionLoadingPromise = null;
      return null;
    }
  })();

  return sessionLoadingPromise;
};

/**
 * Check if the image/canvas contains genuine agricultural foliar content
 * Rejects non-leaf objects, human faces/skin, blank walls, and furniture.
 */
export const checkFoliarPresence = (canvas) => {
  const ctx = canvas.getContext('2d');
  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imgData.data;

  let leafPixels = 0;
  let skinPixels = 0;
  let totalSampled = 0;

  for (let i = 0; i < data.length; i += 16) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    totalSampled++;

    // Human skin-tone color filter
    const isSkin = (r > 95) && (g > 40) && (b > 20) && ((r - g) > 15) && (r > b) && ((r - b) > 15);
    if (isSkin) {
      skinPixels++;
    }

    // Plant foliage color filter (Green foliar, yellow chlorosis, necrotic foliar brown)
    const isGreenFoliage = (g > r * 1.12) && (g > b * 1.12) && (g > 40);
    const isYellowChlorosis = (r > 110) && (g > 110) && (b < 90) && (Math.abs(r - g) < 45) && !isSkin;
    const isNecroticBrown = (r > 50) && (r < 160) && (g > 30) && (g < 120) && (b < 65) && (r > g) && (g > b) && !isSkin;

    if (isGreenFoliage || isYellowChlorosis || isNecroticBrown) {
      leafPixels++;
    }
  }

  const foliarRatio = leafPixels / totalSampled;
  const skinRatio = skinPixels / totalSampled;

  // Strict leaf validation: Must have >= 14% foliar pixels and skin must not dominate
  const isLeaf = (foliarRatio >= 0.14) && (skinRatio < 0.18);

  return {
    isLeaf,
    foliarRatio,
    skinRatio
  };
};

/**
 * Preprocess HTMLImageElement / Canvas into (1, 3, 256, 256) Float32 Tensor
 */
export const imageToTensor = (imageSource) => {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(imageSource, 0, 0, 256, 256);

  const { isLeaf, foliarRatio, skinRatio } = checkFoliarPresence(canvas);

  const imgData = ctx.getImageData(0, 0, 256, 256);
  const { data } = imgData;

  const float32Data = new Float32Array(3 * 256 * 256);
  const planeSize = 256 * 256;

  // PyTorch ToTensor(): divide by 255.0 (range [0.0, 1.0])
  for (let i = 0; i < planeSize; i++) {
    const r = data[i * 4] / 255.0;
    const g = data[i * 4 + 1] / 255.0;
    const b = data[i * 4 + 2] / 255.0;

    float32Data[i] = r;                  // R plane
    float32Data[planeSize + i] = g;      // G plane
    float32Data[planeSize * 2 + i] = b;  // B plane
  }

  return {
    tensor: new ort.Tensor('float32', float32Data, [1, 3, 256, 256]),
    isLeaf,
    foliarRatio,
    skinRatio
  };
};

/**
 * Compute Softmax over raw model logits
 */
const softmax = (logits) => {
  let maxLogit = -Infinity;
  for (let i = 0; i < logits.length; i++) {
    if (logits[i] > maxLogit) maxLogit = logits[i];
  }

  const exps = new Float32Array(logits.length);
  let sumExps = 0;
  for (let i = 0; i < logits.length; i++) {
    exps[i] = Math.exp(logits[i] - maxLogit);
    sumExps += exps[i];
  }

  const probs = new Float32Array(logits.length);
  for (let i = 0; i < logits.length; i++) {
    probs[i] = exps[i] / sumExps;
  }
  return probs;
};

/**
 * Parse standard PlantVillage class name into Clean Crop Name and Disease Name
 */
export const parsePlantVillageClass = (classKey) => {
  if (!classKey) return { crop: 'Crop Leaf', disease: 'Leaf Disease' };

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

/**
 * Run real forward pass inference on an image using ONNX Runtime Web
 * Includes Out-Of-Distribution (OOD), Entropy, and Margin Rejection Checks.
 */
export const runOnnxInference = async (imageSource) => {
  const { tensor, isLeaf } = imageToTensor(imageSource);

  if (!isLeaf) {
    return {
      isLeaf: false,
      status: 'NO_LEAF_DETECTED',
      className: 'Unrecognized / Non-Plant Image',
      crop: 'Non-Plant Object',
      diseaseName: 'No leaf detected / low confidence',
      confidence: 0.0,
      isHealthy: false,
      probabilities: [
        { className: 'No Foliar Content Detected', probability: 0.0, color: '#94A3B8' }
      ]
    };
  }

  const session = await getOnnxSession();
  if (!session) {
    throw new Error('ONNX model session not initialized');
  }

  const feeds = { input: tensor };
  const results = await session.run(feeds);
  
  const outputTensor = results.output || Object.values(results)[0];
  const logits = outputTensor.data;
  const probs = softmax(logits);

  // Log raw 38-value softmax probabilities right after inference
  console.log('[ONNX Raw 38 Softmax Output]:', Array.from(probs).map(p => Number(p.toFixed(6))));

  // Sort Predictions by probability
  const indexed = [];
  for (let i = 0; i < probs.length; i++) {
    indexed.push({ index: i, prob: probs[i], className: PLANTVILLAGE_38_CLASSES[i] || `Class ${i}` });
  }
  indexed.sort((a, b) => b.prob - a.prob);

  const top1 = indexed[0];
  const top2 = indexed[1] || { prob: 0 };
  const top1Pct = top1.prob * 100;
  const top2Pct = top2.prob * 100;
  const margin = top1Pct - top2Pct;

  // Minimum Confidence + Entropy / Margin Check:
  // If top class < 60% OR (top class < 75% AND second class within 15% of it) -> Ambiguous / Out-of-Distribution
  if (top1Pct < 55 || (top1Pct < 75 && margin < 15)) {
    console.warn(`[OOD Rejection]: Ambiguous softmax distribution (Top1: ${top1Pct.toFixed(1)}%, Top2: ${top2Pct.toFixed(1)}%, Margin: ${margin.toFixed(1)}%)`);
    return {
      isLeaf: false,
      status: 'AMBIGUOUS_OOD',
      className: 'Low Confidence / Out of Distribution',
      crop: 'Unrecognized Object',
      diseaseName: 'No leaf detected / low confidence',
      confidence: Number(top1Pct.toFixed(1)),
      isHealthy: false,
      probabilities: indexed.slice(0, 4).map((item, idx) => {
        const p = parsePlantVillageClass(item.className);
        return {
          className: `${p.crop} — ${p.disease}`,
          probability: Number((item.prob * 100).toFixed(1)),
          color: idx === 0 ? '#EF4444' : '#94A3B8'
        };
      })
    };
  }

  const parsed = parsePlantVillageClass(top1.className);
  const confidencePct = Number(top1Pct.toFixed(1));

  // Match with synchronized registry so headline ALWAYS matches top1 class #1 exactly
  const match = getPlantVillageDiagnosisRecord(top1.className, confidencePct);

  const colors = ['#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#3B82F6'];
  const probabilities = indexed.slice(0, 4).map((item, idx) => {
    const p = parsePlantVillageClass(item.className);
    return {
      className: `${p.crop} — ${p.disease}`,
      probability: Number((item.prob * 100).toFixed(1)),
      color: colors[idx % colors.length]
    };
  });

  return {
    isLeaf: true,
    className: top1.className,
    crop: parsed.crop,
    diseaseName: parsed.disease,
    isHealthy: parsed.isHealthy,
    confidence: confidencePct,
    diseaseObject: match,
    probabilities
  };
};
