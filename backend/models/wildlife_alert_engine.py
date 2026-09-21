"""
Wildlife Alert Engine & IoT Hooter Integration Abstraction
Features:
- Configured threat animals (deer, wild boar, bull, nilgai, monkey, elephant)
- Cooldown / debounce manager (prevents alert flooding / hooter thrashing)
- Authenticated server-to-device ESP32 hooter abstraction (secure secret verification)
- Browser alarm fallback when hardware is unavailable
"""

import os
import time
import hmac
from typing import Dict, Any, List, Optional

# Configuration
DEFAULT_COOLDOWN_SECONDS = float(os.environ.get("ALERT_COOLDOWN_SECONDS", "30.0"))
HOOTER_AUTH_TOKEN = os.environ.get("HOOTER_AUTH_TOKEN", "krushi-sec-hooter-auth-token-2026")
ESP32_HOOTER_URL = os.environ.get("ESP32_HOOTER_URL", "")
ESP32_DEVICE_SECRET = os.environ.get("ESP32_DEVICE_SECRET", "")

CONFIGURED_THREAT_ANIMALS = [
    "deer",
    "wild_boar",
    "bull",
    "nilgai",
    "monkey",
    "elephant"
]


class WildlifeAlertEngine:
    """Manages wildlife threat alerts, debounce timing, and hooter dispatch."""

    def __init__(self, cooldown_seconds: float = DEFAULT_COOLDOWN_SECONDS):
        self.cooldown_seconds = cooldown_seconds
        self.last_trigger_time: float = 0.0
        self.alert_history: List[Dict[str, Any]] = []
        self.threat_animals = list(CONFIGURED_THREAT_ANIMALS)

    def verify_auth_token(self, token: Optional[str]) -> bool:
        """Verifies caller authentication using constant-time string comparison."""
        if not token:
            return False
        # Strip optional "Bearer " prefix
        clean_token = token.replace("Bearer ", "").strip()
        expected_token = HOOTER_AUTH_TOKEN.strip()
        return hmac.compare_digest(clean_token.encode("utf-8"), expected_token.encode("utf-8"))

    def check_cooldown(self) -> Dict[str, Any]:
        """Checks whether the system is currently in a cooldown state."""
        now = time.time()
        elapsed = now - self.last_trigger_time
        in_cooldown = elapsed < self.cooldown_seconds
        remaining = max(0.0, round(self.cooldown_seconds - elapsed, 2)) if in_cooldown else 0.0

        return {
            "in_cooldown": in_cooldown,
            "cooldown_remaining_seconds": remaining,
            "cooldown_window_seconds": self.cooldown_seconds,
            "last_trigger_timestamp": self.last_trigger_time if self.last_trigger_time > 0 else None
        }

    def trigger_hooter(
        self,
        auth_token: Optional[str],
        threat_type: str = "manual_trigger",
        source: str = "farm_sensor",
        custom_duration_s: int = 5
    ) -> Dict[str, Any]:
        """
        Triggers acoustic deterrent / hooter with authentication and debounce gate.
        Dispatches to ESP32 device if configured; falls back to browser alarm if hardware unavailable.
        """
        # 1. Authenticate Request
        if not self.verify_auth_token(auth_token):
            return {
                "success": False,
                "error": "UNAUTHORIZED",
                "message": "Invalid or missing hooter authentication token.",
                "status_code": 401
            }

        # 2. Check Cooldown / Debounce
        cd = self.check_cooldown()
        if cd["in_cooldown"]:
            return {
                "success": False,
                "debounced": True,
                "message": f"Alert ignored due to active cooldown window ({cd['cooldown_remaining_seconds']}s remaining).",
                "cooldown_remaining_seconds": cd["cooldown_remaining_seconds"],
                "last_trigger_timestamp": cd["last_trigger_timestamp"],
                "browser_alarm_required": False
            }

        # 3. Register Trigger Time
        now = time.time()
        self.last_trigger_time = now

        # 4. Attempt Hardware Dispatch (ESP32 IoT Hooter)
        hardware_status = "hardware_unavailable"
        hardware_message = "No ESP32 hooter URL configured on server."
        dispatched_to_hardware = False

        if ESP32_HOOTER_URL:
            try:
                import urllib.request
                import json
                payload = json.dumps({
                    "action": "trigger",
                    "duration_seconds": custom_duration_s,
                    "threat": threat_type,
                    "secret": ESP32_DEVICE_SECRET
                }).encode("utf-8")

                req = urllib.request.Request(
                    ESP32_HOOTER_URL,
                    data=payload,
                    headers={
                        "Content-Type": "application/json",
                        "X-Device-Secret": ESP32_DEVICE_SECRET
                    },
                    method="POST"
                )
                with urllib.request.urlopen(req, timeout=3.0) as resp:
                    if resp.status in (200, 202):
                        hardware_status = "dispatched_to_esp32"
                        hardware_message = f"ESP32 hooter triggered successfully at {ESP32_HOOTER_URL}."
                        dispatched_to_hardware = True
                    else:
                        hardware_status = "hardware_error"
                        hardware_message = f"ESP32 returned HTTP status {resp.status}."
            except Exception as e:
                hardware_status = "hardware_unavailable"
                hardware_message = f"Failed connecting to ESP32 ({str(e)})."
                print(f"⚠️ [IoT Hooter Notice] Hardware connection failed: {e}")

        # 5. Determine Browser Alarm Fallback
        browser_alarm_required = not dispatched_to_hardware

        event_record = {
            "timestamp": now,
            "threat_type": threat_type,
            "source": source,
            "hardware_status": hardware_status,
            "browser_alarm_required": browser_alarm_required
        }
        self.alert_history.append(event_record)
        if len(self.alert_history) > 50:
            self.alert_history.pop(0)

        return {
            "success": True,
            "debounced": False,
            "threat_type": threat_type,
            "hardware_status": hardware_status,
            "hardware_message": hardware_message,
            "browser_alarm_required": browser_alarm_required,
            "browser_alarm_config": {
                "sound": "siren_pulse",
                "frequency_hz": 950,
                "pulse_rate_ms": 250,
                "duration_seconds": custom_duration_s
            } if browser_alarm_required else None,
            "cooldown_seconds": self.cooldown_seconds
        }

    def get_status(self) -> Dict[str, Any]:
        """Returns overall status of wildlife alert engine."""
        cd = self.check_cooldown()
        return {
            "engine_status": "active",
            "cooldown": cd,
            "configured_threat_animals": self.threat_animals,
            "esp32_configured": bool(ESP32_HOOTER_URL),
            "recent_alerts_count": len(self.alert_history),
            "last_alert": self.alert_history[-1] if self.alert_history else None
        }
