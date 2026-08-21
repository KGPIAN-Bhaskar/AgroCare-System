// Cloud Firestore Service for AgroCare Prediction History

/**
 * Saves prediction result asynchronously to Cloud Firestore.
 * Path: /users/{uid}/predictions/{predictionId}
 * 
 * Requirement 23 Guarantee:
 * Database saving failures will be caught and logged safely so that
 * prediction rendering in the UI is never broken or interrupted.
 */
async function savePredictionToFirestore(uid, predictionResult) {
  if (!uid) {
    console.warn("Save Prediction: User UID is required.");
    return false;
  }

  try {
    const userRef = db.collection("users").doc(uid);
    const predictionsRef = userRef.collection("predictions");

    // Extract product details safely
    const primaryProduct = predictionResult.products && predictionResult.products.length > 0 
      ? predictionResult.products[0] 
      : { name: "N/A", amazon: "#", flipkart: "#" };

    const docData = {
      diseaseName: predictionResult.diseaseDisplayName || predictionResult.diseaseName,
      rawDiseaseKey: predictionResult.diseaseName,
      confidence: predictionResult.confidence,
      confidencePercentage: (predictionResult.confidence * 100).toFixed(2) + "%",
      treatment: {
        description: predictionResult.description || "",
        symptoms: predictionResult.symptoms || [],
        actions: predictionResult.actions || [],
        prevention: predictionResult.prevention || []
      },
      productName: primaryProduct.name,
      productBuyLink: {
        amazon: primaryProduct.amazon || "#",
        flipkart: primaryProduct.flipkart || "#"
      },
      allProducts: predictionResult.products || [],
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await predictionsRef.add(docData);
    console.log("Prediction saved to Firestore successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    // Graceful error recovery: Do NOT crash app or block user
    console.error("Firestore Save Warning (Non-blocking):", error);
    return null;
  }
}
