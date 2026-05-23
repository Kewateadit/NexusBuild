import requests
import os

def test_reconstruct():
    url = "http://localhost:8000/reconstruct"
    image_path = r"C:\Users\HP\.gemini\antigravity\brain\ec7dec74-331c-4b19-8003-5ed2e7c9ceac\sample_floorplan_1778268292872.png"
    
    if not os.path.exists(image_path):
        print(f"Error: Image not found at {image_path}")
        return

    with open(image_path, "rb") as f:
        files = {"file": ("floorplan.png", f, "image/png")}
        response = requests.post(url, files=files)
    
    if response.status_code == 200:
        result = response.json()
        print(f"Success!")
        print(f"Number of walls detected: {len(result['walls'])}")
        print(f"Image dimensions: {result['width']}x{result['height']}")
        print(f"Debug images available: {list(result['debug'].keys())}")
    else:
        print(f"Error: {response.status_code}")
        print(response.text)

if __name__ == "__main__":
    test_reconstruct()
