# -*- coding: utf-8 -*-
import os
import sys
import unittest
import requests
import datetime
from copy import deepcopy
# from django.core.management import setup_environ


def setup_env():
    # fix path
    pth = os.path
    PROJ_DIR = pth.abspath(pth.join(pth.dirname(__file__), '..'))
    SITE_ROOT = pth.abspath(pth.join(PROJ_DIR, '..'))
    sys.path.append(PROJ_DIR)
    sys.path.append(SITE_ROOT)

    APPS_DIR = pth.abspath(pth.join(PROJ_DIR, 'apps'))
    LIB_DIR = pth.abspath(pth.join(PROJ_DIR, 'lib'))
    sys.path.append(APPS_DIR)
    sys.path.append(LIB_DIR)
    os.environ['DJANGO_SETTINGS_MODULE'] = 'settings.testing'

    # config environment
    # from settings import testing as environ
    # setup_environ(environ)

setup_env()
from authentication.models import User


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


def ensure_empty_db():
    # TODO
    pass


def create_test_user():
    """utility function for creating a test user"""
    # User.objects.all().delete()
    user = User()
    user.id = 1
    user.name = 'Test User'
    user.email = 'test@user.com'
    user.set_password('12345')
    user.contact = [
        {'type': 'phone', 'value':'1234567890'},
        {'type': 'skype', 'value': 'skype_from_test_user'},
    ]
    user.creation_date = datetime.datetime(2012, 12, 14, 15, 23, 30, 0)
    user.save()
    return user

const = type('Const', (), {})
const.DATETIME_OBJ = datetime.datetime(2012, 12, 14, 15, 23, 30, 0)
const.EMPTY_TAGS = {'common': [], }


def filter_dict(data, keys):
    data = deepcopy(data)
    for k in keys:
        if k in data:
            del data[k]
    return data


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
