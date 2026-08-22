"""
Unified Crop Health Diagnosis & Risk Intelligence Pipeline
Lead Developer: Aryan Mishra (ML + Integration Lead)
"""

from models.image_classifier import CropDiseaseClassifier
from models.pest_detector import PestDetector
from models.risk_forecaster import WeatherRiskForecaster
from models.ipm_recommender import IPMRecommender
from geospatial.hotspot_analyzer import GeospatialHotspotAnalyzer


class UnifiedCropHealthPipeline:
    """Orchestrates image classification, weather risk forecasting, geospatial alerts, and IPM advisories into a single JSON result."""

    def __init__(self):
        self.image_classifier = CropDiseaseClassifier()
        self.pest_detector = PestDetector()
        self.risk_forecaster = WeatherRiskForecaster()
        self.ipm_recommender = IPMRecommender()
        self.hotspot_analyzer = GeospatialHotspotAnalyzer()

    def process_full_diagnosis(self, image_input=None, crop_name="cotton", growth_stage="vegetative",
                               temperature=28.5, humidity=82.0, rainfall=18.0, leaf_wetness_hours=9.0,
                               latitude=20.9374, longitude=77.7796, pest_trap_image=None):
        """
        Executes end-to-end diagnosis and returns unified multi-modal crop health report.
        """
        # Step 1: Image Disease Classification
        image_result = None
        if image_input:
            image_result = self.image_classifier.predict(image_input, crop_hint=crop_name)

        # Step 2: Pest Trap Detection if trap image provided
        pest_result = None
        if pest_trap_image:
            pest_result = self.pest_detector.detect_and_count(pest_trap_image)

        # Step 3: Weather-based Outbreak Risk Forecast
        risk_result = self.risk_forecaster.predict_risk(
            temperature=temperature,
            humidity=humidity,
            rainfall=rainfall,
            leaf_wetness_hours=leaf_wetness_hours,
            crop_name=crop_name,
            growth_stage=growth_stage
        )

        # Determine primary diagnosed condition
        if image_result:
            detected_condition = image_result["predicted_class"]
            confidence = image_result["confidence"]
        else:
            detected_condition = f"{crop_name}_healthy"
            confidence = 0.90

        # Step 4: IPM Advisory Generation
        advisory_result = self.ipm_recommender.generate_advisory(
            disease_class=detected_condition,
            severity_rating=risk_result["risk_level"]
        )

        # Step 5: Geospatial Hotspot Check
        spatial_analysis = self.hotspot_analyzer.analyze_hotspots()
        nearby_cluster_alert = None
        for cluster in spatial_analysis["clusters"]:
            # Simple distance approximation
            dlat = abs(cluster["center_lat"] - latitude)
            dlon = abs(cluster["center_lon"] - longitude)
            if dlat < 0.3 and dlon < 0.3:
                nearby_cluster_alert = cluster
                break

        return {
            "status": "success",
            "crop_metadata": {
                "crop_name": crop_name,
                "growth_stage": growth_stage,
                "location": {"latitude": latitude, "longitude": longitude}
            },
            "visual_diagnosis": image_result,
            "pest_trap_analysis": pest_result,
            "weather_risk_forecasting": risk_result,
            "nearby_hotspot_alert": nearby_cluster_alert,
            "integrated_pest_management_advisory": advisory_result
        }
