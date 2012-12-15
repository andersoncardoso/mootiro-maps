# -*- coding: utf-8 -*-
from ..test_utils import IntegrationTest


class UtilsTestCase(IntegrationTest):
    def test_rest_resource_get(self):
        # this url only exists on TESTING mode
        r = self.client.get('/test_resource/')
        self.assertTrue(r.status_code, 200)
        self.assertIn(r.text, 'Resource::GET')

    def test_rest_resource_post(self):
        r = self.client.post('/test_resource/')
        self.assertTrue(r.status_code, 200)
        self.assertIn(r.text, 'Resource::POST')

    def test_rest_resource_put(self):
        r = self.client.put('/test_resource/')
        self.assertTrue(r.status_code, 200)
        self.assertIn(r.text, 'Resource::PUT')

    def test_rest_resource_delete(self):
        r = self.client.delete('/test_resource/')
        self.assertTrue(r.status_code, 200)
        self.assertIn(r.text, 'Resource::DELETE')

    def test_rest_resource_method_not_allowed(self):
        r = self.client.patch('/test_resource/')
        # assert method is not allowed
        self.assertTrue(r.status_code, 405)

