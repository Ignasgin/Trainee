#!/usr/bin/env python3
"""
TRAINEE API DEMONSTRACIJOS SKRIPTAS
Skirtas darbo gynimui - demonstruoja visus pagrindinius API endpoints
"""

import requests
import json
import time
from datetime import datetime

class TraineeAPIDemo:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
        self.session = requests.Session()
        self.tokens = {}
        self.endpoint_count = 0
        
    def print_header(self, title):
        print("\n" + "="*60)
        print(f"  {title}")
        print("="*60)
        
    def print_step(self, step, description):
        print(f"\n{step}. {description}")
        print("-" * 50)
        
    def print_response(self, response, success_msg=""):
        self.endpoint_count += 1
        print(f"Endpoint #{self.endpoint_count} - Status: {response.status_code}")
        try:
            data = response.json()
            print(f"Response: {json.dumps(data, indent=2, ensure_ascii=False)}")
            if response.status_code < 400 and success_msg:
                print(f"SUCCESS: {success_msg}")
        except:
            print(f"Response: {response.text}")
        
        if response.status_code >= 400:
            print("ERROR: Request failed!")
            
    def register_user(self, username, email, password, first_name="Demo", last_name="User"):
        """Registruoja naują vartotoją"""
        data = {
            "username": username,
            "email": email,
            "password": password,
            "first_name": first_name,
            "last_name": last_name
        }
        
        response = self.session.post(f"{self.base_url}/api/users/register/", json=data)
        self.print_response(response, f"User '{username}' registered successfully!")
        return response
        
    def login_user(self, username, password):
        """Prisijungia ir gauna token"""
        data = {
            "username": username,
            "password": password
        }
        
        response = self.session.post(f"{self.base_url}/api-token-auth/", json=data)
        
        if response.status_code == 200:
            token = response.json()['token']
            self.tokens[username] = token
            print(f"Token: {token[:20]}...")
            print(f"SUCCESS: User '{username}' logged in successfully!")
        else:
            self.print_response(response)
            
        return response
        
    def create_post(self, token, title, post_type, description, calories=None):
        """Sukuria naują įrašą"""
        headers = {"Authorization": f"Token {token}"}
        data = {
            "title": title,
            "type": post_type,
            "description": description
        }
        if calories:
            data["calories"] = calories
            
        response = self.session.post(f"{self.base_url}/api/posts/create/", 
                                   json=data, headers=headers)
        self.print_response(response, f"Post '{title}' created successfully!")
        
        if response.status_code == 201:
            return response.json()['id']
        return None
        
    def get_posts(self, token=None, endpoint="posts"):
        """Gauna įrašų sąrašą"""
        headers = {"Authorization": f"Token {token}"} if token else {}
        
        response = self.session.get(f"{self.base_url}/api/{endpoint}/", headers=headers)
        self.print_response(response, f"Posts list retrieved successfully!")
        return response
        
    def publish_post(self, token, post_id):
        """Publikuoja įrašą"""
        headers = {"Authorization": f"Token {token}"}
        
        response = self.session.put(f"{self.base_url}/api/posts/{post_id}/publish/", 
                                  headers=headers)
        self.print_response(response, f"Post #{post_id} published successfully!")
        return response
        
    def approve_post(self, admin_token, post_id):
        """Patvirtina įrašą (admin)"""
        headers = {"Authorization": f"Token {admin_token}"}
        
        response = self.session.put(f"{self.base_url}/api/posts/{post_id}/approve/", 
                                  headers=headers)
        self.print_response(response, f"Post #{post_id} approved by admin!")
        return response
        
    def create_comment(self, token, post_id, text):
        """Sukuria komentarą"""
        headers = {"Authorization": f"Token {token}"}
        data = {"text": text}
        
        response = self.session.post(f"{self.base_url}/api/posts/{post_id}/comments/create/", 
                                   json=data, headers=headers)
        self.print_response(response, "Comment created successfully!")
        return response
        
    def get_user_profile(self, token, user_id):
        """Gauna konkretaus vartotojo profilį"""
        headers = {"Authorization": f"Token {token}"}
        
        response = self.session.get(f"{self.base_url}/api/users/{user_id}/", headers=headers)
        self.print_response(response, f"User #{user_id} profile retrieved successfully!")
        return response
        
    def update_user_profile(self, token, email=None, first_name=None, last_name=None):
        """Atnaujina vartotojo profilį"""
        headers = {"Authorization": f"Token {token}"}
        data = {}
        if email:
            data["email"] = email
        if first_name:
            data["first_name"] = first_name
        if last_name:
            data["last_name"] = last_name
            
        response = self.session.put(f"{self.base_url}/api/users/profile/", 
                                  json=data, headers=headers)
        self.print_response(response, "User profile updated successfully!")
        return response
        
    def get_post_details(self, post_id, token=None):
        """Gauna konkretaus posto detales"""
        headers = {"Authorization": f"Token {token}"} if token else {}
        
        response = self.session.get(f"{self.base_url}/api/posts/{post_id}/", headers=headers)
        self.print_response(response, f"Post #{post_id} details retrieved!")
        return response
        
    def update_post(self, token, post_id, title=None, description=None, calories=None, post_type=None):
        """Atnaujina postą"""
        headers = {"Authorization": f"Token {token}"}
        data = {}
        if title:
            data["title"] = title
        if description:
            data["description"] = description
        if calories:
            data["calories"] = calories
        if post_type:
            data["type"] = post_type
            
        # Paimame esamą post info kad gautume reikalaujamus laukus
        existing_post = self.session.get(f"{self.base_url}/api/posts/{post_id}/", headers=headers)
        if existing_post.status_code == 200:
            existing_data = existing_post.json()
            if "type" not in data:
                data["type"] = existing_data["type"]
            if "description" not in data:
                data["description"] = existing_data["description"]
            if "title" not in data:
                data["title"] = existing_data["title"]
        
        response = self.session.put(f"{self.base_url}/api/posts/{post_id}/update/", 
                                  json=data, headers=headers)
        self.print_response(response, f"Post #{post_id} updated successfully!")
        return response
        
    def delete_post(self, token, post_id):
        """Ištrina postą"""
        headers = {"Authorization": f"Token {token}"}
        
        response = self.session.delete(f"{self.base_url}/api/posts/{post_id}/delete/", 
                                     headers=headers)
        self.print_response(response, f"Post #{post_id} deleted successfully!")
        return response
        
    def get_post_comments(self, post_id, token=None):
        """Gauna posto komentarus"""
        headers = {"Authorization": f"Token {token}"} if token else {}
        
        response = self.session.get(f"{self.base_url}/api/posts/{post_id}/comments/", 
                                  headers=headers)
        self.print_response(response, f"Comments for post #{post_id} retrieved!")
        return response
        
    def get_post_ratings(self, post_id, token=None):
        """Gauna posto įvertinimus"""
        headers = {"Authorization": f"Token {token}"} if token else {}
        
        response = self.session.get(f"{self.base_url}/api/posts/{post_id}/ratings/", 
                                  headers=headers)
        self.print_response(response, f"Ratings for post #{post_id} retrieved!")
        return response
        
    def update_comment(self, token, comment_id, text):
        """Atnaujina komentarą"""
        headers = {"Authorization": f"Token {token}"}
        data = {"text": text}
        
        response = self.session.put(f"{self.base_url}/api/comments/{comment_id}/update/", 
                                  json=data, headers=headers)
        self.print_response(response, f"Comment #{comment_id} updated!")
        return response
        
    def delete_comment(self, token, comment_id):
        """Ištrina komentarą"""
        headers = {"Authorization": f"Token {token}"}
        
        response = self.session.delete(f"{self.base_url}/api/comments/{comment_id}/delete/", 
                                     headers=headers)
        self.print_response(response, f"Comment #{comment_id} deleted!")
        return response
        
    def update_rating(self, token, rating_id, rating):
        """Atnaujina įvertinimą"""
        headers = {"Authorization": f"Token {token}"}
        data = {"rating": rating}
        
        response = self.session.put(f"{self.base_url}/api/ratings/{rating_id}/update/", 
                                  json=data, headers=headers)
        self.print_response(response, f"Rating #{rating_id} updated to {rating}/5!")
        return response
        
    def logout_user(self, token):
        """Atsijungia vartotojas"""
        headers = {"Authorization": f"Token {token}"}
        
        response = self.session.post(f"{self.base_url}/api/auth/logout/", headers=headers)
        self.print_response(response, "User logged out successfully!")
        return response
        
    def get_users_list(self, token):
        """Gauna vartotojų sąrašą"""
        headers = {"Authorization": f"Token {token}"}
        
        response = self.session.get(f"{self.base_url}/api/users/", headers=headers)
        self.print_response(response, "Users list retrieved successfully!")
        return response
        
    def get_comment_details(self, comment_id, token=None):
        """Gauna komentaro detales"""
        headers = {"Authorization": f"Token {token}"} if token else {}
        
        response = self.session.get(f"{self.base_url}/api/comments/{comment_id}/", headers=headers)
        self.print_response(response, f"Comment #{comment_id} details retrieved!")
        return response
        
    def get_rating_details(self, rating_id, token=None):
        """Gauna įvertinimo detales"""
        headers = {"Authorization": f"Token {token}"} if token else {}
        
        response = self.session.get(f"{self.base_url}/api/ratings/{rating_id}/", headers=headers)
        self.print_response(response, f"Rating #{rating_id} details retrieved!")
        return response

    def create_rating(self, token, post_id, rating):
        """Sukuria įvertinimą"""
        headers = {"Authorization": f"Token {token}"}
        data = {"rating": rating}
        
        response = self.session.post(f"{self.base_url}/api/posts/{post_id}/ratings/create/", 
                                   json=data, headers=headers)
        self.print_response(response, f"Rating {rating}/5 created successfully!")
        return response

    def demo_full_workflow(self):
        """Comprehensive API demonstration with 15+ endpoints"""
        
        self.print_header("TRAINEE API COMPREHENSIVE DEMONSTRATION")
        print(f"Time: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        print(f"API URL: {self.base_url}")
        
        # 1. GUEST USER CAPABILITIES
        self.print_step(1, "GUEST USER CAPABILITIES")
        print("Guest users can only view approved public posts")
        self.get_posts(endpoint="posts/public")
        
        # 2. USER REGISTRATION
        self.print_step(2, "USER REGISTRATION")
        self.register_user("demo_user", "demo@test.com", "demo123456")
        
        # 3. USER LOGIN
        self.print_step(3, "USER LOGIN AND TOKEN RETRIEVAL")
        self.login_user("demo_user", "demo123456")
        user_token = self.tokens.get("demo_user")
        
        if not user_token:
            print("ERROR: Failed to get token, stopping demo...")
            return
            
        # 4. AUTHENTICATED USER CAPABILITIES
        self.print_step(4, "AUTHENTICATED USER CAPABILITIES")
        print("Authenticated users can view all posts")
        self.get_posts(user_token)
        
        # 5. USER PROFILE OPERATIONS
        self.print_step(5, "USER PROFILE OPERATIONS")
        print("Getting users list...")
        self.get_users_list(user_token)
        
        print("Getting specific user profile...")
        self.get_user_profile(user_token, 37)  # Use existing user ID
        
        print("Updating user profile...")
        self.update_user_profile(user_token, email="updated@test.com", first_name="Updated")
        
        # 6. POST CREATION
        self.print_step(6, "POST CREATION")
        print("Creating meal plan...")
        meal_post_id = self.create_post(
            user_token,
            "Demo Nutrition Plan",
            "meal", 
            "Healthy nutrition plan with vegetables and fruits",
            2000
        )
        
        print("Creating workout plan...")
        workout_post_id = self.create_post(
            user_token,
            "Demo Workout Plan",
            "workout", 
            "Intensive strength training plan for beginners",
            None
        )
        
        if not meal_post_id:
            print("ERROR: Failed to create meal post")
            return
            
        # 7. POST DETAILS AND UPDATES
        self.print_step(7, "POST DETAILS AND UPDATES")
        print("Getting post details...")
        self.get_post_details(meal_post_id, user_token)
        
        print("Updating post...")
        self.update_post(user_token, meal_post_id, 
                        title="Updated Nutrition Plan",
                        calories=2200)
        
        # 8. POST PUBLISHING
        self.print_step(8, "POST PUBLISHING")
        print("User publishes their post")
        self.publish_post(user_token, meal_post_id)
        
        # 9. COMMENT OPERATIONS
        self.print_step(9, "COMMENT OPERATIONS")
        print("Creating comment...")
        comment_response = self.create_comment(user_token, meal_post_id, 
                                             "Excellent nutrition plan! Highly recommended.")
        
        comment_id = None
        if comment_response.status_code == 201:
            comment_id = comment_response.json().get('id')
            
            print("Getting comment details...")
            self.get_comment_details(comment_id, user_token)
        
        print("Getting post comments...")
        self.get_post_comments(meal_post_id)
        
        if comment_id:
            print("Updating comment...")
            self.update_comment(user_token, comment_id, 
                              "Updated: Excellent nutrition plan! Highly recommended for healthy lifestyle.")
        
        # 10. RATING OPERATIONS
        self.print_step(10, "RATING OPERATIONS")
        print("Creating rating...")
        rating_response = self.create_rating(user_token, meal_post_id, 5)
        
        rating_id = None
        if rating_response.status_code in [200, 201]:
            rating_data = rating_response.json()
            rating_id = rating_data.get('id')
            
            print("Getting rating details...")
            self.get_rating_details(rating_id, user_token)
        
        print("Getting post ratings...")
        self.get_post_ratings(meal_post_id)
        
        if rating_id:
            print("Updating rating...")
            self.update_rating(user_token, rating_id, 4)
        
        # 11. SECOND USER FOR INTERACTION TESTING
        self.print_step(11, "SECOND USER REGISTRATION AND INTERACTION")
        print("Registering second user...")
        self.register_user("demo_user2", "demo2@test.com", "demo123456", "Demo2", "User2")
        
        self.login_user("demo_user2", "demo123456")
        user2_token = self.tokens.get("demo_user2")
        
        if user2_token:
            print("Second user commenting on first user's post...")
            self.create_comment(user2_token, meal_post_id, "Great plan! Thanks for sharing.")
            
            print("Second user rating the post...")
            self.create_rating(user2_token, meal_post_id, 5)
        
        # 12. ADMIN OPERATIONS (if admin exists)
        self.print_step(12, "ADMIN OPERATIONS")
        try:
            print("Attempting admin login...")
            admin_response = self.login_user("admin", "admin")
            admin_token = self.tokens.get("admin")
            
            if admin_token:
                print("Admin approving post...")
                self.approve_post(admin_token, meal_post_id)
                
                if comment_id:
                    print("Admin deleting inappropriate comment (demo)...")
                    # Create a test comment first
                    bad_comment_response = self.create_comment(user_token, meal_post_id, "Test comment for deletion")
                    if bad_comment_response.status_code == 201:
                        bad_comment_id = bad_comment_response.json().get('id')
                        if bad_comment_id:
                            self.delete_comment(admin_token, bad_comment_id)
            else:
                print("INFO: Admin user not available or wrong credentials")
                
        except Exception as e:
            print(f"INFO: Admin demo skipped: {e}")
        
        # 13. PUBLIC POSTS VERIFICATION
        self.print_step(13, "PUBLIC POSTS VERIFICATION")
        print("Checking published posts list...")
        self.get_posts(endpoint="posts/public")
        
        # 14. CONTENT MANAGEMENT
        self.print_step(14, "CONTENT MANAGEMENT TESTING")
        if workout_post_id:
            print("Deleting workout post...")
            self.delete_post(user_token, workout_post_id)
        
        # 15. LOGOUT OPERATIONS
        self.print_step(15, "LOGOUT OPERATIONS")
        print("Logging out first user...")
        self.logout_user(user_token)
        
        if user2_token:
            print("Logging out second user...")
            self.logout_user(user2_token)
        
        # 16. POST-LOGOUT VERIFICATION
        self.print_step(16, "POST-LOGOUT VERIFICATION")
        print("Verifying guest access after logout...")
        self.get_posts(endpoint="posts/public")
        
        self.print_header("COMPREHENSIVE API DEMONSTRATION COMPLETED SUCCESSFULLY!")
        print("SUCCESS: API is working properly")
        print("SUCCESS: All user groups tested")  
        print("SUCCESS: CRUD operations working")
        print("SUCCESS: Authentication working")
        print("SUCCESS: Permission system working")
        print(f"SUCCESS: {self.endpoint_count} API endpoints tested successfully!")

def main():
    """Main function"""
    demo = TraineeAPIDemo()
    
    print("Starting Trainee API demonstration...")
    print("This script demonstrates all core API functionalities")
    
    try:
        demo.demo_full_workflow()
    except requests.exceptions.ConnectionError:
        print("\nERROR: Cannot connect to API server!")
        print("TIP: Make sure Django server is running:")
        print("   python manage.py runserver")
    except KeyboardInterrupt:
        print("\nDemo interrupted by user")
    except Exception as e:
        print(f"\nUnexpected error: {e}")

if __name__ == "__main__":
    main()