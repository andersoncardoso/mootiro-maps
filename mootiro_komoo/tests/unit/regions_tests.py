# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env, create_test_user, const
setup_env()

from main.utils import filter_dict
from regions.models import Region


class RegionModelTestCase(unittest.TestCase):

    def _create_region(self):
        reg, created = Region.objects.get_or_create(
            name='Bairro do Limoeiro',
            description='Casa da Turma da Monica',
        )
        reg.creator = self.test_user
        reg.creation_date = const.DATETIME_OBJ
        reg.region_type = 'rural'
        reg.population = 120
        reg.save()
        return reg

    test_user = create_test_user()

    @property
    def expected_dict(self):
        return {
            'name': 'Bairro do Limoeiro',
            'description': 'Casa da Turma da Monica',
            'creator': self.test_user,
            'creation_date': const.DATETIME_OBJ,
            'last_editor': None,
            'extra_data': None,
            'tags': const.EMPTY_TAGS,
            'region_type': 'rural',
            'population': 120,
        }

    def to_dict_test(self):
        reg = self._create_region()
        reg_dict = filter_dict(reg.to_dict(), ['id', 'last_update'])
        self.assertDictEqual(reg_dict, self.expected_dict)

    def from_dict_test(self):
        reg = Region()
        reg.from_dict(self.expected_dict)
        reg_dict = filter_dict(reg.to_dict(), ['id', 'last_update'])
        self.assertDictEqual(reg_dict, self.expected_dict)

    def is_valid_test(self):
        reg = self._create_region()
        self.assertTrue(reg.is_valid())

