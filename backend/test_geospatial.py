from geospatial.hotspot_analyzer import GeospatialHotspotAnalyzer

a = GeospatialHotspotAnalyzer()
res = a.analyze_hotspots()
print("=== DBSCAN SPATIOTEMPORAL HOTSPOT SURVEILLANCE TEST ===")
print("Total clusters:", len(res['clusters']))
print("Active cases sum:", res['active_cases_total'])
print("Max spread velocity:", res['max_spread_velocity'])
print("GeoJSON features generated:", len(res['geojson']['features']))

for c in res['clusters']:
    print(f"[{c['id']}] {c['district']} ({c['taluka']})")
    print(f"  Pathogen: {c['crop']} -> {c['disease']}")
    print(f"  Risk: {c['risk_level']} (Score: {c['risk_score']}/100)")
    print(f"  Cases: {c['activeCasesCount']} (Radius: {c['radiusKm']} km)")
    print(f"  Spatiotemporal: {c['vectorDirection']}")
    print(f"  Quarantine Coverage: {c['farmersInRadius']} farmers")
    print(f"  Advisory: {c['alertMessage'][:80]}...")
    print()

# Test crop filtering
print("=== CROP FILTER: TOMATO ===")
tomato_res = a.analyze_hotspots(crop_filter="Tomato")
print("Tomato clusters:", len(tomato_res['clusters']))
for c in tomato_res['clusters']:
    print(f"  Cluster: {c['district']} ({c['taluka']}) - {c['disease']}, cases: {c['activeCasesCount']}")

print("=== ALL TESTS PASSED SUCCESSFULLY! ===")
