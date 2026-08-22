# 🌾 KrushiRaksha (कृषीरक्षा)
### AI-Powered Early Crop Disease & Pest Management Platform
**Smart India Hackathon (SIH) Problem Statement ID 26131**  
*Submitted to: Government of Maharashtra — Department of Skills, Employment, Entrepreneurship & Innovation & Maharashtra State Innovation Society*

---

## 📌 Executive Summary
**KrushiRaksha** is an intelligent agritech platform engineered for the early detection, spatial forecasting, and regulatory-compliant management of crop diseases and insect pest infestations across agricultural belts in Maharashtra.

It integrates computer vision, epidemiological agrometeorology, open GIS hotspot clustering, and CIBRC (Central Insecticides Board & Registration Committee) precision IPM dosage schedules into a seamless multi-stakeholder ecosystem for **Farmers**, **Extension Officers**, and **Agriculture Officials**.

---

## 🏛️ The 5 Functional Pillars

1. **Multi-Input Symptom & Pest Identification**: PlantVillage-grounded Leaf Photo Vision AI with Grad-CAM saliency heatmaps, IP102 Pheromone trap counter with ETL thresholds, and Marathi/Hindi audio advisories.
2. **Weather & Context-Based Risk Forecasting**: Hyperlocal Open-Meteo integration, Blitecast protocol, Downy Mildew 3-10 rule, 7-day risk trajectory, and safe spray window indicator.
3. **Geospatial Hotspot Surveillance & Containment**: Maharashtra state GIS with DBSCAN 3km quarantine circles, contagion velocity vectors, and 1-Click Mass Broadcast Emergency SMS.
4. **CIBRC & ICAR Integrated Pest Management (IPM)**: Acreage-to-knapsack tank dilution calculator, Pre-Harvest Interval (PHI) statutory safety countdown, and chemical compatibility matrix.
5. **Multi-Persona Governance & Continuous Learning**: Farmer Plot Diary, Extension Officer field verification queue, State Command Center, and 2G SMS/IVR simulator.

---

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, Canvas Confetti
- **Geospatial & Mapping**: Leaflet, OpenStreetMap, CartoDB Voyager
- **Audio & Accessibility**: Web Speech Synthesis API (mr-IN, hi-IN, en-IN)
- **Styling**: Figma Design System tokens (Deep Forest #0F382A, Gold #E6A122, Parchment #F8F9F5)

---

## 🚀 Quick Start
`ash
# Clone repository
git clone https://github.com/officialsaryangupta-rgb/krushiraksha.git
cd krushiraksha

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
`
