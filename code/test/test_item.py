#!/usr/bin/env python3

import unittest
import responses
import requests
from datetime import datetime, timedelta

class TestItemEndpoints(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:8000/api/items'
        self.now = datetime.now()
        self.fifteen_minutes_ago = self.now - timedelta(minutes=15)
        
        
    @responses.activate
    def test_get_items(self):
        url = f'{self.base_url}/'
        items_response = [
            {
                "id": 1,
                "name": "Item 1",
                "description": "Description 1",
                "price": 100.0,
                "vendor": "vendor1",
                "date": self.now.strftime('%Y-%m-%d %H:%M'),
                "image": "base64encodedimage1"
            }
        ]
        responses.add(
            responses.GET,
            url,
            json=items_response,
            status=200
        )
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), items_response)
        
        
    @responses.activate
    def test_update_items(self):
        url = f'{self.base_url}/update/'
        request_payload = {
            "localItems": [
                {
                    "id": 1,
                    "date": self.fifteen_minutes_ago.strftime('%Y-%m-%d %H:%M')
                }
            ]
        }
        response_payload = {
            "delete": [1],
            "update": [],
            "add": [
                {
                    "id": 2,
                    "name": "Item 2",
                    "description": "Description 2",
                    "price": 200.0,
                    "vendor": "vendor2",
                    "date": self.now.strftime('%Y-%m-%d %H:%M'),
                    "image": "base64encodedimage2"
                }
            ]
        }
        responses.add(
            responses.POST,
            url,
            json=response_payload,
            status=200
        )
        response = requests.post(url, json=request_payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), response_payload)
        
        
    @responses.activate
    def test_my_items(self):
        url = f'{self.base_url}/my_items/'
        request_payload = {
            "token": "fake_jwt_token"
        }
        response_payload = [1, 2, 3]
        responses.add(
            responses.POST,
            url,
            json=response_payload,
            status=200
        )
        response = requests.post(url, json=request_payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), response_payload)
        
        
    @responses.activate
    def test_get_items_by_ids(self):
        url = f'{self.base_url}/get_items/'
        request_payload = {
            "ids": [1, 2, 3]
        }
        items_response = [
            {
                "id": 1,
                "name": "Item 1",
                "description": "Description 1",
                "price": 100.0,
                "vendor": "vendor1",
                "date": self.now.strftime('%Y-%m-%d %H:%M'),
                "image": "base64encodedimage1"
            },
            {
                "id": 2,
                "name": "Item 2",
                "description": "Description 2",
                "price": 200.0,
                "vendor": "vendor2",
                "date": self.now.strftime('%Y-%m-%d %H:%M'),
                "image": "base64encodedimage2"
            }
        ]
        responses.add(
            responses.POST,
            url,
            json=items_response,
            status=200
        )
        response = requests.post(url, json=request_payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), items_response)
        
        
    @responses.activate
    def test_finished_item(self):
        url = f'{self.base_url}/finished_item/'
        request_payload = {
            "id": 1
        }
        item_response = {
            "price": 150.0,
            "sold": True,
            "pix": "vendor_pix_key"
        }
        responses.add(
            responses.POST,
            url,
            json=item_response,
            status=200
        )
        response = requests.post(url, json=request_payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), item_response)


if __name__ == '__main__':
    unittest.main()
