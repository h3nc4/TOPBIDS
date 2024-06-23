import unittest
import json
import requests
import responses


class TestAuction(unittest.TestCase):

    @responses.activate
    def test_update_auction_success(self):
        url = 'http://localhost:8000/api/auction/update/'
        
        responses.add(
            responses.POST,
            url,
            json={'status': 'success'},
            status=200
        )
        payload = {
            'item': 1,
            'updated_value': '150.0',
            'user': 'test_user'
        }
        headers = {
            'Content-Type': 'application/json',
        }
        response = requests.post(url, headers=headers, data=json.dumps(payload))
        
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'success'})


    @responses.activate
    def test_update_auction_item_not_found(self):
        url = 'http://localhost:8000/api/auction/update/'
        
        responses.add(
            responses.POST,
            url,
            json={'detail': 'Item not found'},
            status=404
        )
        payload = {
            'item': 999,
            'updated_value': '150.0',
            'user': 'test_user'
        }
        headers = {
            'Content-Type': 'application/json',
        }
        response = requests.post(url, headers=headers, data=json.dumps(payload))

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'detail': 'Item not found'})


    @responses.activate
    def test_update_auction_user_not_found(self):
        url = 'http://localhost:8000/api/auction/update/'
        
        responses.add(
            responses.POST,
            url,
            json={'detail': 'User not found'},
            status=404
        )
        payload = {
            'item': 1,
            'updated_value': '150.0',
            'user': 'non_existent_user'
        }
        headers = {
            'Content-Type': 'application/json',
        }
        response = requests.post(url, headers=headers, data=json.dumps(payload))

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'detail': 'User not found'})


    @responses.activate
    def test_update_auction_invalid_data(self):
        url = 'http://localhost:8000/api/auction/update/'
        
        responses.add(
            responses.POST,
            url,
            json={'detail': 'Invalid data'},
            status=400
        )
        payload = {
            'updated_value': '150.0',
            'user': 'test_user'
        }
        headers = {
            'Content-Type': 'application/json',
        }
        response = requests.post(url, headers=headers, data=json.dumps(payload))

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'detail': 'Invalid data'})


if __name__ == '__main__':
    unittest.main()
