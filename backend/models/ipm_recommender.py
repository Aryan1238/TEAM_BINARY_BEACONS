"""
Integrated Pest Management (IPM) & Advisory Generator
Lead Developer: Aryan Mishra (ML + Advisory Lead)
"""

from config import IPM_DATABASE


class IPMRecommender:
    """Generates structured, safe Integrated Pest & Disease Management advisories."""

    def __init__(self):
        self.db = IPM_DATABASE

    def generate_advisory(self, disease_class, severity_rating=None, language="en"):
        """
        Retrieves or generates IPM advice for the detected disease/pest.
        Supports English and Marathi advisory notes.
        """
        disease_entry = self.db.get(disease_class)

        if not disease_entry:
            # Generic safe advisory template if unknown disease
            disease_name = disease_class.replace("_", " ").title()
            disease_entry = {
                "disease_name": disease_name,
                "symptoms": "Unusual spots, discoloration, or leaf wilting observed.",
                "biological_control": "Apply Neem oil 10,000 PPM @ 3-5 ml/L of water.",
                "chemical_control": "Consult local Krishi Vigyan Kendra (KVK) or extension officer before chemical spray.",
                "cultural_practices": "Ensure proper field drainage, avoid overhead irrigation, remove infected plants.",
                "severity_level": severity_rating or "MODERATE",
                "safe_input_usage": "Use recommended personal protective equipment (gloves, mask) during application.",
                "referral_needed": True
            }

        # Override severity if supplied
        effective_severity = severity_rating or disease_entry.get("severity_level", "MODERATE")

        advisory = {
            "disease_key": disease_class,
            "disease_name": disease_entry["disease_name"],
            "severity_level": effective_severity,
            "integrated_management_steps": {
                "step1_cultural": disease_entry["cultural_practices"],
                "step2_biological": disease_entry["biological_control"],
                "step3_chemical": disease_entry["chemical_control"]
            },
            "safety_guidelines": disease_entry["safe_input_usage"],
            "extension_referral_required": disease_entry["referral_needed"] or (effective_severity in ["HIGH", "SEVERE"]),
            "follow_up_schedule_days": 3 if effective_severity in ["HIGH", "SEVERE"] else 7,
            "multilingual_advisory": {
                "en": f"Diagnosed: {disease_entry['disease_name']}. Biological: {disease_entry['biological_control']} Chemical: {disease_entry['chemical_control']}",
                "mr": f"निदान: {disease_entry['disease_name']}. सेंद्रिय उपाय: {disease_entry['biological_control']} रासायनिक उपाय: {disease_entry['chemical_control']}"
            }
        }

        return advisory
