# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env, create_test_user, const
setup_env()

from main.utils import filter_dict
from organizations.models import Organization


class OrganizationModelTestCase(unittest.TestCase):

    def _create_organization(self):
        it3s, created = Organization.objects.get_or_create(
            name='IT3S',
            description='Instituto de Fomento a Tec do 3o setor',
        )
        it3s.creator = self.test_user
        it3s.creation_date = const.DATETIME_OBJ
        it3s.organization_type = 'ong'
        it3s.save()
        return it3s

    test_user = create_test_user()

    @property
    def expected_dict(self):
        return {
            'name': 'IT3S',
            'description': 'Instituto de Fomento a Tec do 3o setor',
            'creator': self.test_user,
            'creation_date': const.DATETIME_OBJ,
            'last_editor': None,
            'extra_data': None,
            'tags': const.EMPTY_TAGS,
            'organization_type': 'ong',
        }

    def to_dict_test(self):
        org = self._create_organization()
        org_dict = filter_dict(org.to_dict(), ['id', 'last_update'])
        self.assertDictEqual(org_dict, self.expected_dict)

    def from_dict_test(self):
        org = Organization()
        org.from_dict(self.expected_dict)
        org_dict = filter_dict(org.to_dict(), ['id', 'last_update'])
        self.assertDictEqual(org_dict, self.expected_dict)

    def is_valid_test(self):
        pass

