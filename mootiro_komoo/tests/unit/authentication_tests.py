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


    def password_hash_test(self):
        hashed_psswd = User.calc_hash('12345', salt='blablabla')
        expected_hash = u'eb5a9887586930f7f2e9c1c42bc937188afa689d'
        self.assertEqual(expected_hash, hashed_psswd)

    def verify_password_test(self):
        u = User()
        u.set_password('12345', salt='blablabla')
        self.assertEqual('eb5a9887586930f7f2e9c1c42bc937188afa689d',
                         u.password)
        self.assertTrue(u.verify_password('12345', salt='blablabla'))

    def to_dict_test(self):
        user = self._create_test_user()
        expected_dict = {
            'id': 1,
            'name': 'Test User',
            'email': 'test@user.com',
            'url': '/user/1 <FIXME>',
            'geometry': {
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
        }
        self.assertItemsEqual(expected_dict, user.to_dict())

    def from_dict_test(self):
        pass





