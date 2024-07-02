#!/usr/bin/env python3

import unittest
import requests
import responses

class TestIndex(unittest.TestCase):

    def setUp(self):
        self.base_url = 'http://localhost:8000/api/guard'


    @responses.activate
    def test_status_endpoint(self):
        url = f'{self.base_url}/status/'
        responses.add(
            responses.GET,
            url,
            json={"status": "ok"},
            status=200
        )
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "ok"})


    @responses.activate
    def test_get_endpoint(self):
        url = f'{self.base_url}/get/'
        responses.add(
            responses.GET,
            url,
            json={"guards": ["127.0.0.1"]},
            status=200
        )
        response = requests.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"guards": ["127.0.0.1"]})


if __name__ == '__main__':
    unittest.main()
