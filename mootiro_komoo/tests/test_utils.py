# -*- coding: utf-8 -*-
import os
import sys
import unittest
import requests
from django.core.management import setup_environ

A_POLYGON_GEOMETRY = '''
    {
        "type":"GeometryCollection",
        "geometries":[
            {
                "type":"Polygon",
                "coordinates":[
                        [[0,0],[1,1],[2,2],[0,0]]
                ]
            }
        ]
    }
'''


def setup_django():
    # fix path
    pth = os.path
    PROJ_DIR = pth.abspath(pth.join(pth.dirname(__file__), '..'))
    SITE_ROOT = pth.abspath(pth.join(PROJ_DIR, '..'))
    sys.path.append(PROJ_DIR)
    sys.path.append(SITE_ROOT)

    # config environment
    from settings import testing as environ
    setup_environ(environ)


class Client(object):
    url = 'http://localhost:8001'

    def _proxy_to_requests(self, method, endpoint, *args, **kwargs):
        return getattr(requests, method)(self.url + endpoint, *args, **kwargs)

    def get(self, endpoint, *args, **kwargs):
        return self._proxy_to_requests('get', endpoint, *args, **kwargs)

    def post(self, endpoint, *args, **kwargs):
        return self._proxy_to_requests('post', endpoint, *args, **kwargs)

    def put(self, endpoint, *args, **kwargs):
        return self._proxy_to_requests('put', endpoint, *args, **kwargs)

    def delete(self, endpoint, *args, **kwargs):
        return self._proxy_to_requests('delete', endpoint, *args, **kwargs)

    def patch(self, endpoint, *args, **kwargs):
        return self._proxy_to_requests('patch', endpoint, *args, **kwargs)

class IntegrationTest(unittest.TestCase):
    def __init__(self, *args, **kwargs):
        super(IntegrationTest, self).__init__(*args, **kwargs)
        self.client = Client()
