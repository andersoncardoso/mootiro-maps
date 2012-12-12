# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env
setup_env()

from authentication.models import User, Login


class UserTest(unittest.TestCase):

    def _create_test_user(self):
        # ensure User table is empty
        User.objects.all().delete()
        user = User()
        user.id = 1
        user.name = 'Test User'
        user.email = 'test@user.com'
        user.set_password('12345')
        user.contact = 'contact info'
        user.save()
        return user

    def _get_test_user_dict(self):
        return {
            'id': 1,
            'name': 'Test User',
            'email': 'test@user.com',
            'url': '/user/1 <FIXME>',
            'geojson': {
                'type': 'FeatureCollection',
                'features': [
                    {
                        'geometry': None,
                        'type': 'Feature',
                        'properties': {
                            'lastUpdate': '',
                            'type': 'User',
                            'name': 'Test User',
                            'id': 1
                        }
                    }
                ]},
            'contact': 'contact info',
            'password': '9e80d19abef09197aa1e095b77534786c9ba08c0',
            'is_admin': False,
            'is_active': False
        }

    def password_hash_test(self):
        hashed_psswd = User.calc_hash('12345', salt='blablabla')
        expected_hash = u'eb5a9887586930f7f2e9c1c42bc937188afa689d'
        self.assertEqual(expected_hash, hashed_psswd)

    def verify_password_test(self):
        u = User()
        u.set_password('12345')
        self.assertEqual('9e80d19abef09197aa1e095b77534786c9ba08c0',
                         u.password)
        self.assertTrue(u.verify_password('12345'))

    def to_dict_test(self):
        user = self._create_test_user()
        expected_dict = self._get_test_user_dict()
        self.assertDictEqual(expected_dict, user.to_dict())

    def from_dict_test(self):
        data_dict = self._get_test_user_dict()
        geojson = {
            'type': 'FeatureCollection',
            'features': [
                {
                    'geometry': None,
                    'type': 'Feature',
                    'properties': {
                        'lastUpdate': '',
                        'type': 'User',
                        'name': 'Test User',
                        'id': 1
                    }
                }
            ]}
        user = User()
        user.from_dict(data_dict)
        self.assertEqual('test@user.com', user.email)
        self.assertEqual(1, user.id)
        self.assertEqual('Test User', user.name)
        self.assertDictEqual(geojson, user.geojson)
        self.assertFalse(user.is_admin)
        self.assertFalse(user.is_active)
        self.assertTrue(user.verify_password('12345'))




