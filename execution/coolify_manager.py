"""
Coolify Manager - AS Marketers Landing Page
Handles Coolify API interactions for deployment
"""

import os
import requests
import time
from dotenv import load_dotenv

load_dotenv()

COOLIFY_URL = os.getenv("COOLIFY_URL")
COOLIFY_TOKEN = os.getenv("COOLIFY_TOKEN")
COOLIFY_PROJECT_UUID = os.getenv("COOLIFY_PROJECT_UUID")

class CoolifyManager:
    def __init__(self):
        self.base_url = COOLIFY_URL.rstrip("/")
        self.headers = {
            "Authorization": f"Bearer {COOLIFY_TOKEN}",
            "Accept": "application/json",
            "Content-Type": "application/json"
        }
    
    def create_application(self, name, git_repository):
        """Create a new application in Coolify"""
        data = {
            "name": name,
            "git_repository": git_repository,
            "git_branch": "main",
            "project_uuid": COOLIFY_PROJECT_UUID,
            "build_pack": "dockerfile",
            "dockerfile_location": "/Dockerfile"
        }
        
        response = requests.post(
            f"{self.base_url}/api/v1/applications",
            headers=self.headers,
            json=data
        )
        
        if response.status_code in [200, 201]:
            app = response.json()
            print(f"[+] Application created: {app.get('uuid')}")
            return app
        else:
            print(f"[-] Error creating application: {response.status_code}")
            print(response.text)
            return None
    
    def configure_application(self, app_uuid, network_alias):
        """Configure application settings"""
        # Set network alias
        data = {
            "custom_network_aliases": network_alias
        }
        
        response = requests.patch(
            f"{self.base_url}/api/v1/applications/{app_uuid}",
            headers=self.headers,
            json=data
        )
        
        if response.status_code == 200:
            print(f"[+] Network alias configured: {network_alias}")
            return True
        else:
            print(f"[-] Error configuring application: {response.status_code}")
            return False
    
    def deploy_application(self, app_uuid):
        """Deploy the application"""
        response = requests.post(
            f"{self.base_url}/api/v1/applications/{app_uuid}/deploy",
            headers=self.headers
        )
        
        if response.status_code in [200, 201]:
            result = response.json()
            print(f"[+] Deployment started")
            return result
        else:
            print(f"[-] Error starting deployment: {response.status_code}")
            return None
    
    def get_deployment_status(self, deployment_uuid):
        """Get deployment status"""
        response = requests.get(
            f"{self.base_url}/api/v1/deployments/{deployment_uuid}",
            headers=self.headers
        )
        
        if response.status_code == 200:
            return response.json()
        return None
    
    def wait_for_deployment(self, deployment_uuid, timeout=300):
        """Wait for deployment to complete"""
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            status = self.get_deployment_status(deployment_uuid)
            if status:
                current_status = status.get("status")
                print(f"   Deployment status: {current_status}")
                
                if current_status == "finished":
                    print(f"[+] Deployment completed successfully!")
                    return True
                elif current_status == "failed":
                    print(f"[-] Deployment failed!")
                    return False
            
            time.sleep(10)
        
        print(f"[!] Deployment timeout after {timeout} seconds")
        return False

if __name__ == "__main__":
    # Test
    print("Coolify Manager - AS Marketers")
    print("=" * 40)
    print(f"URL configured: {'Yes' if COOLIFY_URL else 'No'}")
    print(f"Token configured: {'Yes' if COOLIFY_TOKEN else 'No'}")
    print(f"Project UUID configured: {'Yes' if COOLIFY_PROJECT_UUID else 'No'}")
