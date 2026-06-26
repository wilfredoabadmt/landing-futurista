"""
Deploy Script - AS Marketers Landing Page
Automates the full deployment process
"""

import os
import sys
import subprocess
from dotenv import load_dotenv

# Add execution directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from github_manager import create_private_repo, initialize_and_push
from coolify_manager import CoolifyManager

load_dotenv()

def main():
    print("[*] AS Marketers - Landing Page Deployment")
    print("=" * 50)
    
    # Configuration
    REPO_NAME = "landing-futurista"
    DESCRIPTION = "Landing page futurista AS Marketers - Ingenieria de Sistemas & Marketing Digital con IA"
    NETWORK_ALIAS = "landing-asmarketers"
    
    # Step 1: Create GitHub repository
    print("\n[1] Creating GitHub repository...")
    result = create_private_repo(REPO_NAME, DESCRIPTION)
    
    if not result:
        print("[-] Failed to create repository. Aborting.")
        return False
    
    owner, repo_name, repo_id = result
    
    # Step 2: Initialize and push code
    print("\n[2] Pushing code to GitHub...")
    try:
        initialize_and_push(repo_name, owner)
    except Exception as e:
        print(f"[-] Failed to push code: {e}")
        return False
    
    # Step 3: Create application in Coolify
    print("\n[3] Creating application in Coolify...")
    manager = CoolifyManager()
    app = manager.create_application(REPO_NAME, f"{owner}/{repo_name}")
    
    if not app:
        print("[-] Failed to create application in Coolify. Aborting.")
        return False
    
    APP_UUID = app.get("uuid")
    
    # Step 4: Configure application
    print("\n[4] Configuring application...")
    manager.configure_application(APP_UUID, NETWORK_ALIAS)
    
    # Step 5: Deploy
    print("\n[5] Deploying application...")
    deploy_result = manager.deploy_application(APP_UUID)
    
    if not deploy_result:
        print("[-] Failed to start deployment. Aborting.")
        return False
    
    deployment_uuid = deploy_result.get("deployments", [{}])[0].get("deployment_uuid")
    
    # Step 6: Wait for deployment
    print("\n[6] Waiting for deployment to complete...")
    success = manager.wait_for_deployment(deployment_uuid, timeout=300)
    
    if success:
        print("\n" + "=" * 50)
        print("[+] DEPLOYMENT COMPLETED SUCCESSFULLY!")
        print("=" * 50)
        print(f"\n[+] Repository: https://github.com/{owner}/{repo_name}")
        print(f"[+] Application UUID: {APP_UUID}")
        print(f"[+] Network Alias: {NETWORK_ALIAS}")
        print(f"\n[+] Your landing page is now live!")
        print(f"    URL: https://{NETWORK_ALIAS}.your-coolify-domain.com")
        return True
    else:
        print("\n[-] Deployment failed or timed out.")
        return False

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
