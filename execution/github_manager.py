"""
GitHub Manager - AS Marketers Landing Page
Handles GitHub repository creation and management
"""

import os
import requests
from dotenv import load_dotenv

load_dotenv()

GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
GITHUB_API = "https://api.github.com"

def get_headers():
    """Get GitHub API headers"""
    return {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }

def create_private_repo(name, description=""):
    """Create a private GitHub repository"""
    headers = get_headers()
    
    data = {
        "name": name,
        "description": description,
        "private": True,
        "auto_init": False,
        "has_issues": False,
        "has_projects": False,
        "has_wiki": False
    }
    
    response = requests.post(
        f"{GITHUB_API}/user/repos",
        headers=headers,
        json=data
    )
    
    if response.status_code == 201:
        repo = response.json()
        print(f"[+] Repository created: {repo['full_name']}")
        return repo["owner"]["login"], repo["name"], repo["id"]
    else:
        print(f"[-] Error creating repository: {response.status_code}")
        print(response.json())
        return None

def grant_github_app_access(repo_id, installation_id):
    """Grant GitHub App access to repository"""
    headers = get_headers()
    
    response = requests.put(
        f"{GITHUB_API}/user/installations/{installation_id}/repositories/{repo_id}",
        headers=headers
    )
    
    if response.status_code == 204:
        print(f"[+] GitHub App access granted")
        return True
    else:
        print(f"[-] Error granting access: {response.status_code}")
        return False

def initialize_and_push(repo_name, owner):
    """Initialize git repo and push code"""
    import subprocess
    
    # Initialize git
    subprocess.run(["git", "init"], check=True)
    
    # Add all files
    subprocess.run(["git", "add", "."], check=True)
    
    # Create initial commit
    subprocess.run(
        ["git", "commit", "-m", "Initial commit: Landing page futurista"],
        check=True
    )
    
    # Add remote
    remote_url = f"https://{GITHUB_TOKEN}@github.com/{owner}/{repo_name}.git"
    subprocess.run(["git", "remote", "add", "origin", remote_url], check=True)
    
    # Push
    subprocess.run(["git", "push", "-u", "origin", "main"], check=True)
    
    print(f"[+] Code pushed to {owner}/{repo_name}")

if __name__ == "__main__":
    # Test
    print("GitHub Manager - AS Marketers")
    print("=" * 40)
    print(f"Token configured: {'Yes' if GITHUB_TOKEN else 'No'}")
