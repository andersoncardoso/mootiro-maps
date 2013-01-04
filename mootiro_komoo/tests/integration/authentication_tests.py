# -*- coding: utf-8 -*-
import simplejson
from ..test_utils import IntegrationTest, setup_env
setup_env()
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

