"""
Spatiotemporal Outbreak Hotspot Analyzer
Lead Developer: Arjun (ML Specialist)
"""

import math

try:
    import numpy as np
    HAS_NUMPY = True
except ImportError:
    HAS_NUMPY = False

try:
    from sklearn.cluster import DBSCAN
    HAS_SKLEARN = True
except ImportError:
    HAS_SKLEARN = False


class GeospatialHotspotAnalyzer:
    """Clustering engine for identifying geographic crop disease outbreak clusters across districts."""

    def __init__(self, eps_km=25.0, min_samples=3):
        """
        eps_km: Radius distance threshold in kilometers.
        min_samples: Minimum disease reports required to classify as an active outbreak cluster.
        """
        self.eps_km = eps_km
        self.min_samples = min_samples
        self.kms_per_radian = 6371.0088

    def analyze_hotspots(self, detection_events=None):
        """
        Takes list of geotagged disease detection events and returns cluster IDs & outbreak alerts.
        """
        if not detection_events:
            detection_events = self._get_sample_maharashtra_events()

        coords = [[e['lat'], e['lon']] for e in detection_events]

        if HAS_SKLEARN and HAS_NUMPY and len(coords) >= self.min_samples:
            coords_np = np.array(coords)
            coords_rad = np.radians(coords_np)
            eps_rad = self.eps_km / self.kms_per_radian

            db = DBSCAN(eps=eps_rad, min_samples=self.min_samples, metric='haversine')
            cluster_labels = db.fit_predict(coords_rad).tolist()
        else:
            # Grid / Haversine fallback clustering in pure Python
            cluster_labels = []
            for i, c1 in enumerate(coords):
                nearby = 0
                for j, c2 in enumerate(coords):
                    d = math.sqrt((c1[0]-c2[0])**2 + (c1[1]-c2[1])**2) * 111.0
                    if d <= self.eps_km:
                        nearby += 1
                cluster_labels.append(0 if nearby >= self.min_samples else -1)

        clusters = {}
        outbreak_alerts = []

        for idx, label in enumerate(cluster_labels):
            event = detection_events[idx]
            event['cluster_id'] = int(label)
            
            if label != -1:
                if label not in clusters:
                    clusters[label] = {
                        "cluster_id": int(label),
                        "event_count": 0,
                        "lats": [],
                        "lons": [],
                        "diseases": []
                    }
                clusters[label]["event_count"] += 1
                clusters[label]["lats"].append(event["lat"])
                clusters[label]["lons"].append(event["lon"])
                clusters[label]["diseases"].append(event["disease"])

        for cid, data in clusters.items():
            avg_lat = round(sum(data["lats"]) / len(data["lats"]), 4)
            avg_lon = round(sum(data["lons"]) / len(data["lons"]), 4)
            most_common_disease = max(set(data["diseases"]), key=data["diseases"].count)

            if data["event_count"] >= 10:
                alert_level = "CRITICAL OUTBREAK"
            elif data["event_count"] >= 5:
                alert_level = "HIGH RISK CLUSTER"
            else:
                alert_level = "EMERGING HOTSPOT"

            outbreak_alerts.append({
                "cluster_id": cid,
                "center_lat": avg_lat,
                "center_lon": avg_lon,
                "radius_km": self.eps_km,
                "affected_reports": data["event_count"],
                "dominant_disease": most_common_disease,
                "alert_level": alert_level,
                "recommended_action": f"Dispatch mobile extension unit to area around ({avg_lat}, {avg_lon})."
            })

        return {
            "total_reports_analyzed": len(detection_events),
            "active_hotspot_clusters": len(outbreak_alerts),
            "clusters": outbreak_alerts,
            "processed_events": detection_events
        }

    def _get_sample_maharashtra_events(self):
        return [
            {"id": "EVT001", "lat": 19.9975, "lon": 73.7898, "disease": "tomato_early_blight", "district": "Nashik"},
            {"id": "EVT002", "lat": 20.0050, "lon": 73.7920, "disease": "tomato_early_blight", "district": "Nashik"},
            {"id": "EVT003", "lat": 19.9910, "lon": 73.7850, "disease": "tomato_early_blight", "district": "Nashik"},
            {"id": "EVT004", "lat": 20.0120, "lon": 73.8010, "disease": "sugarcane_red_rot", "district": "Nashik"},
            {"id": "EVT005", "lat": 20.9374, "lon": 77.7796, "disease": "cotton_pink_bollworm_damage", "district": "Amravati"},
            {"id": "EVT006", "lat": 20.9410, "lon": 77.7850, "disease": "cotton_pink_bollworm_damage", "district": "Amravati"},
            {"id": "EVT007", "lat": 20.9320, "lon": 77.7710, "disease": "cotton_bacterial_blight", "district": "Amravati"},
            {"id": "EVT008", "lat": 20.9500, "lon": 77.7900, "disease": "cotton_pink_bollworm_damage", "district": "Amravati"},
            {"id": "EVT009", "lat": 18.5204, "lon": 73.8567, "disease": "rice_blast", "district": "Pune"}
        ]
