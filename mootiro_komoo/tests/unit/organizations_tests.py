# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
import datetime
from ..test_utils import setup_env, create_test_user
setup_env()

from organizations.models import Organization

DATETIME_OBJ = datetime.datetime(2012, 12, 14, 15, 23, 30, 0)


# test_user = create_test_user()
#
# def _create_organization(self):
#     it3s = Organization(
#         name='IT3S',
#         description='Instituto de Fomento a Tec do 3o setor',
#         creator=test_user
#     )
#     it3s.save()
#     it3s.creation_date = DATETIME_OBJ
#     it3s.save()
#     return it3s


class OrganizationModelTestCase(unittest.TestCase):

    def to_dict_test(self):
        pass

    def from_dict_test(self):
        pass

    def is_valid_test(self):
        pass

