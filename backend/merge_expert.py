"""
Dataset Merger & Extractor for Plant Disease Expert & PlantDoc
"""
import os
import shutil
from pathlib import Path

def merge_expert(expert_path):
    print(f"📦 Inspecting Plant Disease Expert archive at: {expert_path}")
    train_dest = "dataset/train"
    valid_dest = "dataset/valid"

    # Find root directories in downloaded expert dataset
    for root, dirs, files in os.walk(expert_path):
        if len(files) > 0 and len(dirs) == 0:
            folder_name = os.path.basename(root)
            parent_name = os.path.basename(os.path.dirname(root)).lower()
            
            # Map into unified class format
            std_class = folder_name.replace(" ", "_").strip()
            
            is_valid = "val" in parent_name or "test" in parent_name
            target_base = valid_dest if is_valid else train_dest
            target_dir = os.path.join(target_base, std_class)
            os.makedirs(target_dir, exist_ok=True)
            
            for f in files:
                if f.lower().endswith(('.jpg', '.jpeg', '.png', '.webp')):
                    src = os.path.join(root, f)
                    dst = os.path.join(target_dir, f"exp_{f}")
                    if not os.path.exists(dst):
                        shutil.copy2(src, dst)

    print(f"✅ Merged complete Plant Disease Expert into dataset/train and dataset/valid.")

if __name__ == "__main__":
    import sys
    if len(sys.argv) > 1:
        merge_expert(sys.argv[1])
