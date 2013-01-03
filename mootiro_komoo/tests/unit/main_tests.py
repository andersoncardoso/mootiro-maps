# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
import datetime
from ..test_utils import setup_env, create_test_user
setup_env()

from main.models import CommonDataMixin


class MyClass(CommonDataMixin):
    class Meta:
        abstract = True


class CommonDataMixinTest(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.user = create_test_user()

    def _build_myclass_obj(self):
        obj = MyClass()
        obj.name = 'object test'
        obj.description = 'this is a simple attributes test'
        obj.creator = self.user
        obj.extra_data = {'bla': 'ble', 'some_number': 3}
        obj.id = 1
        obj.tags = ['tag1', 'tag2', 'tag3']
        obj.creation_date = datetime.datetime(2012, 12, 14, 15, 23, 30, 0)
        return obj

    def common_attributes_test(self):
        obj = self._build_myclass_obj()
        self.assertTrue(hasattr(obj, 'name'))
        self.assertTrue(hasattr(obj, 'description'))
        self.assertTrue(hasattr(obj, 'creator'))
        self.assertTrue(hasattr(obj, 'creation_date'))
        self.assertTrue(hasattr(obj, 'last_editor'))
        self.assertTrue(hasattr(obj, 'last_update'))
        self.assertTrue(hasattr(obj, 'extra_data'))
        self.assertTrue(hasattr(obj, 'tags'))

    def to_dict_test(self):
        obj = self._build_myclass_obj()
        expected_dict = {
            'name': 'object test',
            'description': 'this is a simple attributes test',
            'creator': self.user,
            'creation_date': datetime.datetime(2012, 12, 14, 15, 23, 30, 0),
            'last_editor': None,
            'last_update': None,
            'extra_data': {'bla': 'ble', 'some_number': 3},
            'tags': ['tag1', 'tag2', 'tag3'],
        }
        self.assertDictEqual(expected_dict, obj.to_dict())

    def from_dict_test(self):
        data_dict = {
            'name': 'object test',
            'description': 'this is a simple attributes test',
            'creator': self.user,
            'creation_date': datetime.datetime(2012, 12, 14, 15, 23, 30, 0),
            'last_editor': None,
            'last_update': None,
            'extra_data': {'bla': 'ble', 'some_number': 3},
            'tags': ['tag1', 'tag2', 'tag3'],
        }
        obj = MyClass()
        obj.id = 1
        obj.from_dict(data_dict)
        self.assertEqual('object test', obj.name)
        self.assertEqual('this is a simple attributes test', obj.description)
        self.assertEqual(self.user, obj.creator)
        self.assertEqual(datetime.datetime(2012, 12, 14, 15, 23, 30, 0),
                         obj.creation_date)
        self.assertEqual(['tag1', 'tag2', 'tag3'], obj.tags)


