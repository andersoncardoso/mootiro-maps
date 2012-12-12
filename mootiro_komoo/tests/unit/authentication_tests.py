# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env
setup_env()

from authentication.models import User, Login


class UserTest(unittest.TestCase):

    @classmethod
    def _create_test_user(self):
        # ensure User table is empty
        User.objects.all().delete()
        user = User()
        user.id = 1
        user.name = 'Test User'
        user.email = 'test@user.com'
        user.set_password('12345')
        user.contact = {'tel': '1234567890', 'skype': 'skype_from_test_user'}
        user.save()
        return user

    @classmethod
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
            'contact': {'tel': '1234567890', 'skype': 'skype_from_test_user'},
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

    def is_valid_test(self):
        user = User()
        self.assertFalse(user.is_valid())
        self.assertIn('name', user.errors)
        self.assertIn('email', user.errors)
        self.assertIn('password', user.errors)

        user = self._create_test_user()
        self.assertTrue(user.is_valid())
        self.assertFalse(user.errors)

        new_user = User()
        new_user.name = 'Novo User'
        new_user.email = user.email
        new_user.set_password('akjsahjksdk')
        self.assertFalse(new_user.is_valid())
        self.assertIn('email', new_user.errors)

    def contact_test(self):
        user = self._create_test_user()
        contact_dict = {'tel': '1234567890', 'skype': 'skype_from_test_user'}
        self.assertDictEqual(user.contact, contact_dict)

        fb_contact = 'http://facebook.com/test_user'
        user.contact['facebook'] = fb_contact
        user.save()
        self.assertEqual(User.get_by_id(user.id).contact['facebook'], 
                         fb_contact)


    # def confirmation_mail_test(self):
    #     # ???
    #     pass


class LoginTest(unittest.TestCase):

    def setUp(self):
        self.user = UserTest._create_test_user()

    def _activate_user(self):
        self.user.is_active = True
        self.user.save()

    def dict_test(self):
        login_dict = {'email': 'test@user.com', 'password': '12345'}
        login = Login()
        login.from_dict(login_dict)
        self.assertDictEqual(login.to_dict(), login_dict)

    def validation_test(self):
        # no email and no pass
        login = Login()
        self.assertFalse(login.is_valid())
        self.assertIn('email', login.errors)
        self.assertIn('password', login.errors)

        # has email, but no pass
        login.email = 'test@user.com'
        self.assertFalse(login.is_valid())
        self.assertNotIn('email', login.errors)
        self.assertIn('password', login.errors)

        # wrong user/passwd combination
        login.password = 'wrong_pass'
        self.assertFalse(login.is_valid())
        self.assertIn('password', login.errors)

        # login correct, inactive user
        login.password = '12345'
        self.assertFalse(login.is_valid())

        # all correct
        self._activate_user()
        self.assertTrue(login.is_valid())
        self.assertFalse(login.errors)

    def user_test(self):
        login_dict = {'email': 'test@user.com', 'password': '12345'}
        login = Login(**login_dict)
        self.assertTrue(login.user)
        self.assertEqual(self.user.id, login.user.id)


