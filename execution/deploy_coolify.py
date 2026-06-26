"""
Deploy to Coolify - AS Marketers Landing Page
"""

import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

COOLIFY_URL = os.getenv("COOLIFY_URL").rstrip("/")
COOLIFY_TOKEN = os.getenv("COOLIFY_TOKEN")
COOLIFY_PROJECT_UUID = os.getenv("COOLIFY_PROJECT_UUID")

headers = {
    "Authorization": f"Bearer {COOLIFY_TOKEN}",
    "Accept": "application/json",
    "Content-Type": "application/json"
}

# Step 1: Create application
print("[1] Creating application in Coolify...")
app_data = {
    "name": "landing-futurista",
    "git_repository": "wilfredoabadmt/landing-futurista",
    "git_branch": "main",
    "project_uuid": COOLIFY_PROJECT_UUID,
    "build_pack": "dockerfile",
    "dockerfile_location": "/Dockerfile"
}

response = requests.post(
    f"{COOLIFY_URL}/api/v1/applications",
    headers=headers,
    json=app_data
)

if response.status_code in [200, 201]:
    app = response.json()
    APP_UUID = app.get("uuid")
    print(f"[+] Application created: {APP_UUID}")
else:
    print(f"[-] Error creating application: {response.status_code}")
    print(response.text)
    exit(1)

# Step 2: Configure network alias
print("\n[2] Configuring network alias...")
config_data = {
    "custom_network_aliases": "landing-asmarketers"
}

response = requests.patch(
    f"{COOLIFY_URL}/api/v1/applications/{APP_UUID}",
    headers=headers,
    json=config_data
)

if response.status_code == 200:
    print("[+] Network alias configured")
else:
    print(f"[-] Error configuring: {response.status_code}")

# Step 3: Deploy
print("\n[3] Starting deployment...")
response = requests.post(
    f"{COOLIFY_URL}/api/v1/applications/{APP_UUID}/deploy",
    headers=headers
)

if response.status_code in [200, 201]:
    result = response.json()
    deployment_uuid = result.get("deployments", [{}])[0].get("deployment_uuid")
    print(f"[+] Deployment started: {deployment_uuid}")
else:
    print(f"[-] Error starting deployment: {response.status_code}")
    exit(1)

# Step 4: Wait for deployment
print("\n[4] Waiting for deployment to complete...")
start_time = time.time()
timeout = 300

while time.time() - start_time < timeout:
    response = requests.get(
        f"{COOLIFY_URL}/api/v1/deployments/{deployment_uuid}",
        headers=headers
    )
    
    if response.status_code == 200:
        status = response.json()
        current_status = status.get("status")
        print(f"   Status: {current_status}")
        
        if current_status == "finished":
            print("\n[+] DEPLOYMENT COMPLETED!")
            print(f"[+] Repository: https://github.com/wilfredoabadmt/landing-futurista")
            print(f"[+] Application UUID: {APP_UUID}")
            
            # Get the application URL
            response = requests.get(
                f"{COOLIFY_URL}/api/v1/applications/{APP_UUID}",
                headers=headers
            )
            if response.status_code == 200:
                app_info = response.json()
                fqdn = app_info.get("fqdn")
                if fqdn:
                    print(f"[+] URL: {fqdn}")
            
            exit(0)
        elif current_status == "failed":
            print("\n[-] Deployment failed!")
            exit(1)
    
    time.sleep(10)

print(f"\n[-] Deployment timeout after {timeout} seconds")
