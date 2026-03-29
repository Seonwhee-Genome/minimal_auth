from rest_framework.test import APITestCase


class AuthTests(APITestCase):

    def test_signup_success(self):
        url = "/api/auth/signup"
        data = {"username": "testuser", "password": "Pass123!"}

        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.data)
        

    def test_signup_duplicate_username(self):
        url = "/api/auth/signup"
        data = {"username": "testuser100", "password": "Pass123!"}

        self.client.post(url, data, format='json')
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data["error"], "A user with that username already exists.")


    def test_signin_success(self):
        signup_url = "/api/auth/signup"
        signin_url = "/api/auth/signin"

        data = {"username": "testuser", "password": "Pass123!"}
        self.client.post(signup_url, data, format='json')

        response = self.client.post(signin_url, data, format='json')

        self.assertEqual(response.status_code, 200)
        self.assertIn("token", response.data)


    def test_me_requires_auth(self):
        url = "/api/me"

        response = self.client.get(url)

        self.assertEqual(response.status_code, 401)


    def test_me_success(self):
        signup_url = "/api/auth/signup"
        me_url = "/api/me"

        data = {"username": "testuser", "password": "Pass123!"}
        res = self.client.post(signup_url, data, format='json')

        token = res.data["token"]

        response = self.client.get(
            me_url,
            HTTP_AUTHORIZATION=f"Bearer {token}"
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["username"], "testuser")