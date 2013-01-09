# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
import datetime
from ..test_utils import setup_env, create_test_user
setup_env()

from main.models import CommonDataMixin, GenericRelation, GenericRef
from tests.models import TestModelA, TestModelB


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


class GenericRelationsTest(unittest.TestCase):
    def _clean_all(self):
        GenericRelation.objects.all().delete()
        GenericRef.objects.all().delete()

    def setUp(self):
        self._clean_all()

    def empty_relations_test(self):
        obj_A = TestModelA(name='A')
        obj_A.save()
        self.assertEqual([], obj_A.relations)

    def load_relations_array_test(self):
        a1 = TestModelA.objects.create(name='A1')
        a2 = TestModelA.objects.create(name='A2')
        b = TestModelB.objects.create(name='B')

        # a relation represtations is a tuple (object, relation_type)
        new_relations = [(a2, ''), (b, '')]
        a1.relations = new_relations

        self.assertEqual(new_relations, a1.relations)

    def add_relation_test(self):
        a1 = TestModelA.objects.create(name='A1')
        a2 = TestModelB.objects.create(name='A2')

        self.assertEqual([], a1.relations)
        a1.relations.add(a2)

        self.assertEqual([(a2, ''), ], a1.relations)
        self.assertTrue(GenericRelation.has_relation(a1, a2))

    def remove_relation_test(self):
        a1 = TestModelA.objects.create(name='A1')
        a2 = TestModelA.objects.create(name='A2')
        b = TestModelB.objects.create(name='B')

        # a relation represtations is a tuple (object, relation_type)
        new_relations = [(a2, ''), (b, '')]
        a1.relations = new_relations
        self.assertTrue(GenericRelation.has_relation(a1, b))

        a1.relations.remove(b)

        self.assertEqual([(a2, ''), ], a1.relations)
        self.assertFalse(GenericRelation.has_relation(a1, b))

    def filter_by_model_test(self):
        a1 = TestModelA.objects.create(name='A1')
        a2 = TestModelA.objects.create(name='A2')
        a3 = TestModelA.objects.create(name='A3')
        b = TestModelB.objects.create(name='B')

        self.assertEqual([], a1.relations)

        a1.relations.add(a2)
        a1.relations.add(a3)
        a1.relations.add(b)

        relations_with_TestModelA = a1.relations.filter_by_model(TestModelA)
        self.assertEquals([(a2, ''), (a3, ''), ], relations_with_TestModelA)

        relations_with_TestModelB = a1.relations.filter_by_model(TestModelB)
        self.assertEquals([(b, ''), ], relations_with_TestModelB)

    def paginated_test(self):
        a1 = TestModelA.objects.create(name='A1')
        a2 = TestModelA.objects.create(name='A2')
        a3 = TestModelA.objects.create(name='A3')
        b = TestModelB.objects.create(name='B')

        self.assertEqual([], a1.relations)

        a1.relations.add(a2)
        a1.relations.add(a3)
        a1.relations.add(b)

        self.assertEqual([(a2, ''), (a3, ''), ],
                         a1.relations.paginated(per_page=2))
        self.assertEqual([(b, ''), ],
                         a1.relations.paginated(page=2, per_page=2))

        self.assertEqual([(a2, ''), ],
                         a1.relations.filter_by_model(TestModelA
                             ).paginated(per_page=1))
        self.assertEqual([(a3, ''), ],
                         a1.relations.filter_by_model(TestModelA
                             ).paginated(page=2, per_page=1))


