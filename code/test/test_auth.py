import json
import unittest
import requests
import responses

class TestAuth(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:8000/api'
        self.token = 'fake_token'


    @responses.activate
    def test_auth_cadastro(self):
        url = f'{self.base_url}/auth/signup/'
        responses.add(
            responses.POST,
            url,
            json={'status': 'success'},
            status=200
        )
        payload = {
            'username': 'test_user',
            'email': 'test@example.com',
            'password': 'password123',
            'cpf': '12345678900',
            'phone': '123456789',
            'address': 'Test Address',
            'city': 'Test City',
            'state': 'TS',
            'zip_code': '12345'
        }
        response = requests.post(url, json={'user': payload})
        self.assertIn(response.status_code, [200, 400])

    @responses.activate
    def test_auth_login(self):
        url = f'{self.base_url}/auth/login/'
        responses.add(
            responses.POST,
            url,
            json={'token': self.token, 'user': 'test_user'},
            status=200
        )
        payload = {
            'username': 'test_user',
            'password': 'password123'
        }
        response = requests.post(url, json={'user': payload})
        self.assertIn(response.status_code, [200, 401])
        if response.status_code == 200:
            self.token = response.json().get('token')

    @responses.activate
    def test_check_token(self):
        url = f'{self.base_url}/auth/check/'
        responses.add(
            responses.POST,
            url,
            json={'user_id': 1, 'status': 'ok'},
            status=200
        )
        payload = {
            'token': self.token,
            'user': 'test_user'
        }
        response = requests.post(url, json=payload)
        self.assertEqual(response.status_code, 200)

    @responses.activate
    def test_deactivate_account(self):
        url = f'{self.base_url}/auth/deactivate/'
        responses.add(
            responses.GET,
            url,
            json={'message': 'Account deactivated'},
            status=200
        )
        headers = {
            'Authorization': f'Bearer {self.token}'
        }
        response = requests.get(url, headers=headers)
        self.assertEqual(response.status_code, 200)

    @responses.activate
    def test_update_account(self):
        url = f'{self.base_url}/auth/update/'
        responses.add(
            responses.POST,
            url,
            json={'message': 'Account updated'},
            status=200
        )
        headers = {
            'Authorization': f'Bearer {self.token}'
        }
        payload = {
            'user': {
                'username': 'newusername',
                'email': 'newemail@example.com',
                'cpf': '12345678901',
                'phone': '1234567890',
                'address': 'New Address',
                'city': 'New City',
                'state': 'New State',
                'zip_code': '12345'
            }
        }
        response = requests.post(url, headers=headers, json=payload)
        self.assertEqual(response.status_code, 200)



def suite():
    loader = unittest.TestLoader()
    suite = loader.loadTestsFromTestCase(TestAuth)
    return suite


if __name__ == '__main__':
    unittest.TextTestRunner().run(suite())
