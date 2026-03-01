#!/usr/bin/env python3
"""
NEXORA Backend API Test Suite
Tests all backend endpoints for the corporate website with lead management system.
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "https://nexora-premium-2.preview.emergentagent.com/api"
ADMIN_PASSWORD = "nexora2024admin"

class NEXORAAPITester:
    def __init__(self):
        self.base_url = BASE_URL
        self.session = requests.Session()
        self.test_results = []
        self.created_leads = []
        self.created_articles = []
        
    def log_result(self, test_name, success, message, details=None):
        """Log test result"""
        result = {
            'test': test_name,
            'success': success,
            'message': message,
            'timestamp': datetime.now().isoformat(),
            'details': details
        }
        self.test_results.append(result)
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} - {test_name}: {message}")
        if details and not success:
            print(f"   Details: {details}")
    
    def test_health_check(self):
        """Test GET /api/health endpoint"""
        try:
            response = self.session.get(f"{self.base_url}/health", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('status') == 'ok':
                    self.log_result("Health Check", True, "Health endpoint working correctly")
                    return True
                else:
                    self.log_result("Health Check", False, "Health endpoint returned incorrect status", data)
                    return False
            else:
                self.log_result("Health Check", False, f"Health endpoint returned status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Health Check", False, f"Health endpoint failed with exception: {str(e)}")
            return False
    
    def test_auth_login_success(self):
        """Test POST /api/auth/login with correct password"""
        try:
            payload = {"password": ADMIN_PASSWORD}
            response = self.session.post(f"{self.base_url}/auth/login", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('token'):
                    self.log_result("Auth Login Success", True, "Login successful with correct password")
                    return True
                else:
                    self.log_result("Auth Login Success", False, "Login response missing success or token", data)
                    return False
            else:
                self.log_result("Auth Login Success", False, f"Login failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Auth Login Success", False, f"Login failed with exception: {str(e)}")
            return False
    
    def test_auth_login_failure(self):
        """Test POST /api/auth/login with incorrect password"""
        try:
            payload = {"password": "wrongpassword"}
            response = self.session.post(f"{self.base_url}/auth/login", json=payload, timeout=10)
            
            if response.status_code == 401:
                data = response.json()
                if not data.get('success'):
                    self.log_result("Auth Login Failure", True, "Login correctly rejected with wrong password")
                    return True
                else:
                    self.log_result("Auth Login Failure", False, "Login should have failed with wrong password", data)
                    return False
            else:
                self.log_result("Auth Login Failure", False, f"Expected 401 status, got {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Auth Login Failure", False, f"Login test failed with exception: {str(e)}")
            return False
    
    def test_create_lead(self, lead_type, lead_data):
        """Test POST /api/leads - Create a new lead"""
        try:
            response = self.session.post(f"{self.base_url}/leads", json=lead_data, timeout=10)
            
            if response.status_code == 201:
                data = response.json()
                if data.get('success') and data.get('data'):
                    lead = data['data']
                    if lead.get('id') and lead.get('status') == 'NEW':
                        self.created_leads.append(lead['id'])
                        self.log_result(f"Create Lead ({lead_type})", True, f"Lead created successfully with ID: {lead['id']}")
                        return lead
                    else:
                        self.log_result(f"Create Lead ({lead_type})", False, "Lead missing required fields", data)
                        return None
                else:
                    self.log_result(f"Create Lead ({lead_type})", False, "Create lead response missing success or data", data)
                    return None
            else:
                self.log_result(f"Create Lead ({lead_type})", False, f"Create lead failed with status {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result(f"Create Lead ({lead_type})", False, f"Create lead failed with exception: {str(e)}")
            return None
    
    def test_get_leads(self):
        """Test GET /api/leads - Get all leads"""
        try:
            response = self.session.get(f"{self.base_url}/leads", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    leads = data['data']
                    self.log_result("Get All Leads", True, f"Retrieved {len(leads)} leads successfully")
                    return leads
                else:
                    self.log_result("Get All Leads", False, "Get leads response missing success or data", data)
                    return None
            else:
                self.log_result("Get All Leads", False, f"Get leads failed with status {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result("Get All Leads", False, f"Get leads failed with exception: {str(e)}")
            return None
    
    def test_get_leads_by_type(self, lead_type):
        """Test GET /api/leads?type=X - Filter leads by type"""
        try:
            response = self.session.get(f"{self.base_url}/leads?type={lead_type}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    leads = data['data']
                    # Verify all leads have the correct type
                    correct_type = all(lead.get('type') == lead_type for lead in leads)
                    if correct_type:
                        self.log_result(f"Get Leads by Type ({lead_type})", True, f"Retrieved {len(leads)} leads of type {lead_type}")
                        return leads
                    else:
                        self.log_result(f"Get Leads by Type ({lead_type})", False, f"Some leads have incorrect type", leads)
                        return None
                else:
                    self.log_result(f"Get Leads by Type ({lead_type})", False, "Get leads by type response missing success or data", data)
                    return None
            else:
                self.log_result(f"Get Leads by Type ({lead_type})", False, f"Get leads by type failed with status {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result(f"Get Leads by Type ({lead_type})", False, f"Get leads by type failed with exception: {str(e)}")
            return None
    
    def test_get_leads_by_status(self, status):
        """Test GET /api/leads?status=X - Filter leads by status"""
        try:
            response = self.session.get(f"{self.base_url}/leads?status={status}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    leads = data['data']
                    # Verify all leads have the correct status
                    correct_status = all(lead.get('status') == status for lead in leads)
                    if correct_status:
                        self.log_result(f"Get Leads by Status ({status})", True, f"Retrieved {len(leads)} leads with status {status}")
                        return leads
                    else:
                        self.log_result(f"Get Leads by Status ({status})", False, f"Some leads have incorrect status", leads)
                        return None
                else:
                    self.log_result(f"Get Leads by Status ({status})", False, "Get leads by status response missing success or data", data)
                    return None
            else:
                self.log_result(f"Get Leads by Status ({status})", False, f"Get leads by status failed with status {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result(f"Get Leads by Status ({status})", False, f"Get leads by status failed with exception: {str(e)}")
            return None
    
    def test_update_lead_status(self, lead_id, new_status):
        """Test PUT /api/leads/{id} - Update lead status"""
        try:
            payload = {"status": new_status}
            response = self.session.put(f"{self.base_url}/leads/{lead_id}", json=payload, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('data'):
                    updated_lead = data['data']
                    if updated_lead.get('status') == new_status:
                        self.log_result(f"Update Lead Status to {new_status}", True, f"Lead {lead_id} status updated successfully")
                        return updated_lead
                    else:
                        self.log_result(f"Update Lead Status to {new_status}", False, f"Lead status not updated correctly", updated_lead)
                        return None
                else:
                    self.log_result(f"Update Lead Status to {new_status}", False, "Update lead response missing success or data", data)
                    return None
            else:
                self.log_result(f"Update Lead Status to {new_status}", False, f"Update lead failed with status {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result(f"Update Lead Status to {new_status}", False, f"Update lead failed with exception: {str(e)}")
            return None
    
    def test_delete_lead(self, lead_id):
        """Test DELETE /api/leads/{id} - Delete a lead"""
        try:
            response = self.session.delete(f"{self.base_url}/leads/{lead_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_result("Delete Lead", True, f"Lead {lead_id} deleted successfully")
                    return True
                else:
                    self.log_result("Delete Lead", False, "Delete lead response missing success", data)
                    return False
            else:
                self.log_result("Delete Lead", False, f"Delete lead failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Delete Lead", False, f"Delete lead failed with exception: {str(e)}")
            return False
    
    def test_create_article(self, article_data):
        """Test POST /api/articles - Create a new article"""
        try:
            response = self.session.post(f"{self.base_url}/articles", json=article_data, timeout=10)
            
            if response.status_code == 201:
                data = response.json()
                if data.get('success') and data.get('data'):
                    article = data['data']
                    if article.get('id') and article.get('slug'):
                        self.created_articles.append(article['id'])
                        self.log_result("Create Article", True, f"Article created successfully with ID: {article['id']}")
                        return article
                    else:
                        self.log_result("Create Article", False, "Article missing required fields", data)
                        return None
                else:
                    self.log_result("Create Article", False, "Create article response missing success or data", data)
                    return None
            else:
                self.log_result("Create Article", False, f"Create article failed with status {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result("Create Article", False, f"Create article failed with exception: {str(e)}")
            return None
    
    def test_get_articles(self):
        """Test GET /api/articles - Get all articles"""
        try:
            response = self.session.get(f"{self.base_url}/articles", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    articles = data['data']
                    self.log_result("Get All Articles", True, f"Retrieved {len(articles)} articles successfully")
                    return articles
                else:
                    self.log_result("Get All Articles", False, "Get articles response missing success or data", data)
                    return None
            else:
                self.log_result("Get All Articles", False, f"Get articles failed with status {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result("Get All Articles", False, f"Get articles failed with exception: {str(e)}")
            return None
    
    def test_get_published_articles(self):
        """Test GET /api/articles?published=true - Get only published articles"""
        try:
            response = self.session.get(f"{self.base_url}/articles?published=true", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and 'data' in data:
                    articles = data['data']
                    # Verify all articles are published
                    all_published = all(article.get('published') == True for article in articles)
                    if all_published:
                        self.log_result("Get Published Articles", True, f"Retrieved {len(articles)} published articles")
                        return articles
                    else:
                        self.log_result("Get Published Articles", False, "Some articles are not published", articles)
                        return None
                else:
                    self.log_result("Get Published Articles", False, "Get published articles response missing success or data", data)
                    return None
            else:
                self.log_result("Get Published Articles", False, f"Get published articles failed with status {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result("Get Published Articles", False, f"Get published articles failed with exception: {str(e)}")
            return None
    
    def test_update_article(self, article_id, update_data):
        """Test PUT /api/articles/{id} - Update an article"""
        try:
            response = self.session.put(f"{self.base_url}/articles/{article_id}", json=update_data, timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('data'):
                    updated_article = data['data']
                    self.log_result("Update Article", True, f"Article {article_id} updated successfully")
                    return updated_article
                else:
                    self.log_result("Update Article", False, "Update article response missing success or data", data)
                    return None
            else:
                self.log_result("Update Article", False, f"Update article failed with status {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result("Update Article", False, f"Update article failed with exception: {str(e)}")
            return None
    
    def test_delete_article(self, article_id):
        """Test DELETE /api/articles/{id} - Delete an article"""
        try:
            response = self.session.delete(f"{self.base_url}/articles/{article_id}", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success'):
                    self.log_result("Delete Article", True, f"Article {article_id} deleted successfully")
                    return True
                else:
                    self.log_result("Delete Article", False, "Delete article response missing success", data)
                    return False
            else:
                self.log_result("Delete Article", False, f"Delete article failed with status {response.status_code}", response.text)
                return False
                
        except Exception as e:
            self.log_result("Delete Article", False, f"Delete article failed with exception: {str(e)}")
            return False
    
    def test_get_stats(self):
        """Test GET /api/stats - Get dashboard statistics"""
        try:
            response = self.session.get(f"{self.base_url}/stats", timeout=10)
            
            if response.status_code == 200:
                data = response.json()
                if data.get('success') and data.get('data'):
                    stats = data['data']
                    # Verify stats structure
                    has_leads_stats = 'leads' in stats and 'total' in stats['leads']
                    has_articles_stats = 'articles' in stats and 'total' in stats['articles']
                    
                    if has_leads_stats and has_articles_stats:
                        self.log_result("Get Stats", True, f"Stats retrieved successfully - {stats['leads']['total']} leads, {stats['articles']['total']} articles")
                        return stats
                    else:
                        self.log_result("Get Stats", False, "Stats missing required structure", stats)
                        return None
                else:
                    self.log_result("Get Stats", False, "Get stats response missing success or data", data)
                    return None
            else:
                self.log_result("Get Stats", False, f"Get stats failed with status {response.status_code}", response.text)
                return None
                
        except Exception as e:
            self.log_result("Get Stats", False, f"Get stats failed with exception: {str(e)}")
            return None
    
    def run_comprehensive_test(self):
        """Run all tests in a comprehensive workflow"""
        print("🚀 Starting NEXORA Backend API Test Suite")
        print("=" * 60)
        
        # 1. Health Check
        print("\n📋 Testing Health Check...")
        self.test_health_check()
        
        # 2. Authentication Tests
        print("\n🔐 Testing Authentication...")
        self.test_auth_login_success()
        self.test_auth_login_failure()
        
        # 3. Lead Management Tests
        print("\n👥 Testing Lead Management...")
        
        # Create different types of leads
        lead_data_samples = [
            {
                "name": "John Smith",
                "phone": "+1-555-0123",
                "email": "john.smith@techcorp.com",
                "company": "TechCorp Solutions",
                "country": "United States",
                "city": "San Francisco",
                "message": "Interested in Starlink installation for our office",
                "pack": "Business Premium",
                "service": "Installation",
                "type": "starlink"
            },
            {
                "name": "Maria Garcia",
                "phone": "+1-555-0456",
                "email": "maria.garcia@globalnet.com",
                "company": "GlobalNet Industries",
                "country": "Mexico",
                "city": "Mexico City",
                "message": "Need a quote for enterprise connectivity solution",
                "pack": "Enterprise",
                "service": "Consultation",
                "type": "quote"
            },
            {
                "name": "David Chen",
                "phone": "+1-555-0789",
                "email": "david.chen@partnertech.com",
                "company": "PartnerTech Ltd",
                "country": "Canada",
                "city": "Toronto",
                "message": "Interested in becoming a distribution partner",
                "pack": "Partnership",
                "service": "Partnership",
                "type": "partner"
            },
            {
                "name": "Sarah Johnson",
                "phone": "+1-555-0321",
                "email": "sarah.johnson@email.com",
                "company": "Personal",
                "country": "United States",
                "city": "Austin",
                "message": "General inquiry about services",
                "pack": "Standard",
                "service": "Information",
                "type": "contact"
            }
        ]
        
        created_leads = []
        for i, lead_data in enumerate(lead_data_samples):
            lead = self.test_create_lead(lead_data['type'], lead_data)
            if lead:
                created_leads.append(lead)
        
        # Test getting all leads
        self.test_get_leads()
        
        # Test filtering by type
        for lead_type in ['starlink', 'quote', 'partner', 'contact']:
            self.test_get_leads_by_type(lead_type)
        
        # Test filtering by status
        self.test_get_leads_by_status('NEW')
        
        # Test lead status workflow if we have created leads
        if created_leads:
            test_lead = created_leads[0]
            lead_id = test_lead['id']
            
            # Test status progression: NEW -> CONTACTED -> CONFIRMED -> INSTALLED
            statuses = ['CONTACTED', 'CONFIRMED', 'INSTALLED']
            for status in statuses:
                self.test_update_lead_status(lead_id, status)
                time.sleep(0.5)  # Small delay between updates
            
            # Test filtering by updated status
            self.test_get_leads_by_status('INSTALLED')
        
        # 4. Article Management Tests
        print("\n📝 Testing Article Management...")
        
        # Create test articles
        article_data_samples = [
            {
                "title": "The Future of Satellite Internet",
                "content": "Satellite internet technology is revolutionizing global connectivity...",
                "excerpt": "Exploring how satellite internet is changing the world",
                "category": "Technology",
                "image": "https://example.com/satellite-image.jpg",
                "published": True
            },
            {
                "title": "NEXORA Partnership Program",
                "content": "Join our growing network of partners and expand your business...",
                "excerpt": "Learn about our partnership opportunities",
                "category": "Business",
                "image": "https://example.com/partnership-image.jpg",
                "published": False
            }
        ]
        
        created_articles = []
        for article_data in article_data_samples:
            article = self.test_create_article(article_data)
            if article:
                created_articles.append(article)
        
        # Test getting all articles
        self.test_get_articles()
        
        # Test getting only published articles
        self.test_get_published_articles()
        
        # Test updating an article if we have created ones
        if created_articles:
            test_article = created_articles[0]
            article_id = test_article['id']
            
            update_data = {
                "title": "Updated: The Future of Satellite Internet",
                "published": True
            }
            self.test_update_article(article_id, update_data)
        
        # 5. Stats Test
        print("\n📊 Testing Statistics...")
        self.test_get_stats()
        
        # 6. Cleanup - Delete test data
        print("\n🧹 Cleaning up test data...")
        
        # Delete created articles
        for article_id in self.created_articles:
            self.test_delete_article(article_id)
        
        # Delete created leads (except the one we used for status testing)
        for lead_id in self.created_leads[1:]:  # Keep first lead for final verification
            self.test_delete_lead(lead_id)
        
        # Final stats check after cleanup
        print("\n📊 Final Statistics Check...")
        self.test_get_stats()
        
        # Generate summary
        self.generate_summary()
    
    def generate_summary(self):
        """Generate test summary"""
        print("\n" + "=" * 60)
        print("📋 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = sum(1 for result in self.test_results if result['success'])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  - {result['test']}: {result['message']}")
        
        print("\n🎯 CRITICAL FUNCTIONALITY STATUS:")
        
        # Check critical endpoints
        critical_tests = {
            'Health Check': False,
            'Auth Login Success': False,
            'Create Lead (starlink)': False,
            'Get All Leads': False,
            'Update Lead Status to CONTACTED': False,
            'Create Article': False,
            'Get All Articles': False,
            'Get Stats': False
        }
        
        for result in self.test_results:
            if result['test'] in critical_tests:
                critical_tests[result['test']] = result['success']
        
        for test_name, passed in critical_tests.items():
            status = "✅" if passed else "❌"
            print(f"  {status} {test_name}")
        
        # Overall assessment
        critical_passed = sum(critical_tests.values())
        critical_total = len(critical_tests)
        
        if critical_passed == critical_total:
            print(f"\n🎉 ALL CRITICAL FUNCTIONALITY WORKING! ({critical_passed}/{critical_total})")
        elif critical_passed >= critical_total * 0.8:
            print(f"\n⚠️  MOST CRITICAL FUNCTIONALITY WORKING ({critical_passed}/{critical_total})")
        else:
            print(f"\n🚨 CRITICAL ISSUES DETECTED ({critical_passed}/{critical_total})")
        
        return {
            'total_tests': total_tests,
            'passed_tests': passed_tests,
            'failed_tests': failed_tests,
            'success_rate': (passed_tests/total_tests)*100,
            'critical_passed': critical_passed,
            'critical_total': critical_total,
            'all_critical_working': critical_passed == critical_total
        }

if __name__ == "__main__":
    tester = NEXORAAPITester()
    tester.run_comprehensive_test()