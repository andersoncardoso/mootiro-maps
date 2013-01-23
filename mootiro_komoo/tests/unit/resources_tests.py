# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env, create_test_user, const
setup_env()

from main.utils import filter_dict
from resources.models import Resource


class ResourceModelTestCase(unittest.TestCase):

    def _create_resource(self):
        res, created = Resource.objects.get_or_create(
            name='Clube do Cebolinha',
            description='cLiação de planos infalíveis',
        )
        res.creator = self.test_user
        res.creation_date = const.DATETIME_OBJ
        res.resource_type = 'others'
        res.save()
        return res

    test_user = create_test_user()

    @property
    def expected_dict(self):
        return {
            'name': 'Clube do Cebolinha',
            'description': 'cLiação de planos infalíveis',
            'creator': self.test_user,
            'creation_date': const.DATETIME_OBJ,
            'last_editor': None,
            'extra_data': None,
            'tags': const.EMPTY_TAGS,
            'resource_type': 'others',
        }

    def to_dict_test(self):
        res = self._create_resource()
        res_dict = filter_dict(res.to_dict(), ['id', 'last_update'])
        self.assertDictEqual(res_dict, self.expected_dict)

    def from_dict_test(self):
        res = Resource()
        res.from_dict(self.expected_dict)
        res_dict = filter_dict(res.to_dict(), ['id', 'last_update'])
        self.assertDictEqual(res_dict, self.expected_dict)

    def is_valid_test(self):
        res = self._create_resource()
        self.assertTrue(res.is_valid())

