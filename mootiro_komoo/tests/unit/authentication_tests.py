# -*- coding: utf-8 -*-
import unittest
# from ..test_utils import setup_env
# setup_env()
# import sys
# print sys.path
#
# from authentication.models import User, Login


class UserTest(unittest.TestCase):
    def test_test(self):
        self.assertEqual(1, 1)

    # def password_hash_test(self):
    #     hashed_psswd = User.calc_hash('12345', salt='blablabla')
    #     expected_hash = u'eb5a9887586930f7f2e9c1c42bc937188afa689d'
    #     self.asserEqual(hashed_psswd, expected_hash)


