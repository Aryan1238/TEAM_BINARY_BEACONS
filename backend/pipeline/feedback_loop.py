"""
Active Learning Feedback Loop for Field Confirmations
Lead Developer: Aryan Mishra (ML Lead)
"""

import os
import json
import time
from config import LOGS_DIR


class ActiveLearningFeedbackLoop:
    """Logs farmer and extension worker field validations for continuous model retraining."""

    def __init__(self):
        self.log_file = os.path.join(LOGS_DIR, "field_confirmations.jsonl")

    def submit_feedback(self, sample_id, predicted_class, expert_confirmed_class,
                        extension_worker_id=None, notes=""):
        """
        Stores field feedback entries for active learning queues.
        """
        entry = {
            "timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            "sample_id": sample_id,
            "predicted_class": predicted_class,
            "expert_confirmed_class": expert_confirmed_class,
            "is_correct": (predicted_class == expert_confirmed_class),
            "extension_worker_id": extension_worker_id or "FARMER_SELF",
            "notes": notes
        }

        with open(self.log_file, "a") as f:
            f.write(json.dumps(entry) + "\n")

        return {
            "status": "recorded",
            "entry": entry,
            "retrain_queued": not entry["is_correct"]
        }

    def get_feedback_stats(self):
        """Calculates accuracy and total feedback counts recorded in field."""
        if not os.path.exists(self.log_file):
            return {"total_confirmations": 0, "verified_accuracy": 1.0}

        total = 0
        correct = 0
        with open(self.log_file, "r") as f:
            for line in f:
                if line.strip():
                    total += 1
                    data = json.loads(line)
                    if data.get("is_correct"):
                        correct += 1

        accuracy = round(correct / total, 4) if total > 0 else 1.0
        return {
            "total_confirmations": total,
            "field_verified_accuracy": accuracy,
            "misclassifications_logged": total - correct
        }
