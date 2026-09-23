/**
 * Client-Side Image Quality & Blur Detection Utility
 * Computes discrete Laplacian variance on a standardized 256x256 offscreen canvas.
 * Flags out-of-focus, motion-blurred, or low-contrast agricultural foliar images
 * before sending to backend inference.
 */

export const calculateLaplacianVariance = (imageData) => {
  const { data, width, height } = imageData;
  // Convert RGB to standard Rec.601 Grayscale luminance
  const gray = new Float32Array(width * height);
  for (let i = 0, j = 0; i < data.length; i += 4, j++) {
    gray[j] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }

  // 3x3 Discrete Laplacian kernel:
  // [ 0,  1,  0 ]
  // [ 1, -4,  1 ]
  // [ 0,  1,  0 ]
  let sum = 0;
  let count = 0;
  const laplacian = new Float32Array((width - 2) * (height - 2));

  for (let y = 1; y < height - 1; y++) {
    const rowOffset = y * width;
    const prevRow = (y - 1) * width;
    const nextRow = (y + 1) * width;
    for (let x = 1; x < width - 1; x++) {
      const val =
        gray[prevRow + x] +
        gray[nextRow + x] +
        gray[rowOffset + x - 1] +
        gray[rowOffset + x + 1] -
        4 * gray[rowOffset + x];
      laplacian[count] = val;
      sum += val;
      count++;
    }
  }

  if (count === 0) return 0;

  const mean = sum / count;
  let varianceSum = 0;
  for (let i = 0; i < count; i++) {
    const diff = laplacian[i] - mean;
    varianceSum += diff * diff;
  }

  return varianceSum / count;
};

/**
 * Validates image sharpness from a File, Blob, or Image URL
 * @param {File|Blob|string} source
 * @param {number} threshold - Laplacian variance threshold (default: 65)
 * @returns {Promise<{ isBlurry: boolean, score: number, threshold: number }>}
 */
export const checkImageSharpness = async (source, threshold = 65) => {
  return new Promise((resolve) => {
    try {
      const img = new Image();
      let objectUrl = null;

      img.onload = () => {
        try {
          // Standardize to 256x256 canvas for uniform variance scale
          const canvas = document.createElement('canvas');
          canvas.width = 256;
          canvas.height = 256;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            if (objectUrl) URL.revokeObjectURL(objectUrl);
            return resolve({ isBlurry: false, score: 999, threshold });
          }

          ctx.drawImage(img, 0, 0, 256, 256);
          const imageData = ctx.getImageData(0, 0, 256, 256);
          const variance = calculateLaplacianVariance(imageData);
          const score = Math.round(variance);

          if (objectUrl) URL.revokeObjectURL(objectUrl);

          resolve({
            isBlurry: score < threshold,
            score,
            threshold
          });
        } catch (canvasErr) {
          console.warn('[checkImageSharpness]: Canvas analysis error, skipping blur check:', canvasErr);
          if (objectUrl) URL.revokeObjectURL(objectUrl);
          resolve({ isBlurry: false, score: 999, threshold });
        }
      };

      img.onerror = () => {
        if (objectUrl) URL.revokeObjectURL(objectUrl);
        resolve({ isBlurry: false, score: 999, threshold });
      };

      if (typeof source === 'string') {
        img.crossOrigin = 'anonymous';
        img.src = source;
      } else if (source instanceof Blob || source instanceof File) {
        objectUrl = URL.createObjectURL(source);
        img.src = objectUrl;
      } else {
        resolve({ isBlurry: false, score: 999, threshold });
      }
    } catch (e) {
      console.warn('[checkImageSharpness]: Exception during sharpness check:', e);
      resolve({ isBlurry: false, score: 999, threshold });
    }
  });
};
