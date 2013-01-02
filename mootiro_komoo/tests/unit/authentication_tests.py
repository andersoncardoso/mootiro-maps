# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
import datetime
from mock import MagicMock, patch
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
        user.creation_date = datetime.datetime(2012, 12, 14, 15, 23, 30, 0)
        user.save()
        return user

    @classmethod
    def _get_test_user_dict(self):
        return {
            'id': 1,
            'name': 'Test User',
            'email': 'test@user.com',
            'url': '/users/1',
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
            'password': 'eb5a9887586930f7f2e9c1c42bc937188afa689d',
            'creation_date': datetime.datetime(2012, 12, 14, 15, 23, 30, 0),
            'is_admin': False,
            'is_active': False,
            'about_me': '',
            'avatar': None,
        }

    @patch('django.conf.settings.USER_PASSWORD_SALT', 'blablabla')
    def password_hash_test(self):
        hashed_psswd = User.calc_hash('12345')
        expected_hash = u'eb5a9887586930f7f2e9c1c42bc937188afa689d'
        self.assertEqual(expected_hash, hashed_psswd)

    @patch('django.conf.settings.USER_PASSWORD_SALT', 'blablabla')
    def verify_password_test(self):
        u = User()
        u.set_password('12345')
        self.assertEqual('eb5a9887586930f7f2e9c1c42bc937188afa689d',
                         u.password)
        self.assertTrue(u.verify_password('12345'))

    @patch('django.conf.settings.USER_PASSWORD_SALT', 'blablabla')
    def to_dict_test(self):
        user = self._create_test_user()
        expected_dict = self._get_test_user_dict()
        self.assertDictEqual(expected_dict, user.to_dict())

    @patch('django.conf.settings.USER_PASSWORD_SALT', 'blablabla')
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

    @patch('authentication.models.send_mail_async')
    @patch('authentication.models.Locker')
    def confirmation_mail_test(self, MockLocker, mock_send_mail):
        user = self._create_test_user()

        # Create the request mock and set the return value to all methods used
        mock_request = MagicMock()
        verification_url = 'http://absolute_uri/'
        mock_request.build_absolute_uri.return_value = verification_url

        # Set the return value to 'deposit' method from Locker mock
        MockLocker.deposit.return_value = 3

        # Call the method we are testing passing the request mock
        user.send_confirmation_mail(mock_request)

        # Verify if Locker.deposit was called with the correct args
        MockLocker.deposit.assert_called_with(user.id)

        # Verify if the send mail function was called containing the relevant
        # info
        mail_kwargs = mock_send_mail.call_args[1]
        self.assertTrue(user.name in mail_kwargs['message'],
                'The email body should mention the user name')
        self.assertTrue(verification_url in mail_kwargs['message'],
                'The email body should have the verification url')
        self.assertTrue(user.email in  mail_kwargs['receivers'],
                'The user should be an email receiver')
        self.assertTrue('MootiroMaps' in  mail_kwargs['title'],
                'The email subject should mention MootiroMaps')


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
