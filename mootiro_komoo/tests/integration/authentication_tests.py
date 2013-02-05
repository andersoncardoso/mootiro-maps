# -*- coding: utf-8 -*-
import simplejson
from ..test_utils import IntegrationTest, setup_env
setup_env()

from authentication.models import User
from ..unit.authentication_tests import UserTest as UserUnitTest


class LoginTestCase(IntegrationTest):
    def _create_user(self):
        user = UserUnitTest._create_test_user()
        user.is_active = True
        user.save()

    def test_email_is_case_insensitive(self):
        self._create_user()
        r = self.client.post('/api/users/login',
                simplejson.dumps(
                    {'email': 'test@user.com', 'password': '12345'}
                ))
        self.assertEqual(200, r.status_code)

        r = self.client.post('/api/users/login',
                simplejson.dumps(
                    {'email': 'TeSt@UsER.COM', 'password': '12345'}
                ))
        self.assertEqual(200, r.status_code)


class UserCreationTestCase(IntegrationTest):
    def _clean_all_users(self):
        User.objects.all().delete()

    def create_user_test(self):
        self._clean_all_users()
        r = self.client.post('/api/users',
            simplejson.dumps({
                'name': 'Test User',
                'email': 'it3sdev@gmail.com',
                'password': '12345',
                'password_confirm': '12345',
                'license': 'agree',
            })
        )
        self.assertEqual(200, r.status_code)

        u = User.objects.all()[0]
        self.assertEqual('Test User', u.name)
        self.assertEqual('it3sdev@gmail.com', u.email)
        self.assertTrue(u.verify_password('12345'))
        self.assertFalse(u.is_active)

    def user_validation_test(self):
        self._clean_all_users()
        r = self.client.post('/api/users',
            simplejson.dumps({
                'name': '',
                'email': '',
                'password': '',
                'password_confirm': '',
                'license': '',
            })
        )
        self.assertEqual(400, r.status_code)

        returned_json = simplejson.loads(r.text)
        self.assertIn('errors', returned_json)
        self.assertIn('name', returned_json['errors'])
        self.assertIn('email', returned_json['errors'])
        self.assertIn('password', returned_json['errors'])
        self.assertIn('license', returned_json['errors'])


