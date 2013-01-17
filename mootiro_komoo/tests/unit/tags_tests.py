# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env
setup_env()

from django.db import IntegrityError
from tags.models import Tag, TagNamespace, TaggedObject
from tests.models import TestTaggedClass


class TagTest(unittest.TestCase):

    def _clean_all_tags(self):
        Tag.objects.all().delete()
        TagNamespace.objects.all().delete()
        TaggedObject.objects.all().delete()

    def tag_unique_name_test(self):
        self._clean_all_tags()
        Tag(name='A').save()
        with self.assertRaises(IntegrityError):
            Tag(name='A').save()

    def tag_descriptor_test(self):
        self._clean_all_tags()
        obj = TestTaggedClass()
        obj.save()

        # tags start empty
        self.assertEqual({'common': []}, obj.tags)

        # implicitly create and set tags
        obj.tags = {'common': ['A', 'B']}
        self.assertDictEqual({'common': ['A', 'B']}, obj.tags)
        tagA = Tag.get_by_name('A')
        tagB = Tag.get_by_name('B')
        self.assertTrue(tagA)
        self.assertTrue(tagB)

        # check for implicit creation of TaggedObjects
        obj_tags = TaggedObject.get_tags_for_object(obj)
        self.assertIn(tagA, obj_tags)
        self.assertIn(tagB, obj_tags)

        # tag add and tag remove (tag remove should not delete the tag)
        obj.tags.add('C')
        obj.tags.remove('A')
        self.assertEqual(3, Tag.objects.all().count())
        self.assertIn('A', [tag.name for tag in Tag.objects.all()])
        self.assertEqual({'common': ['B', 'C']}, obj.tags)

    def namespaced_tags_test(self):
        self._clean_all_tags()
        tg = TestTaggedClass()
        tg.save()

        self.assertEqual({'common': []}, tg.tags)

        tg.tags = {
            'common': ['A', 'B'],
            'target_audience': ['A', 'C']
        }

        self.assertEqual(set(['A', 'B']),
                         set(tg.tags.by_namespace('common')))
        self.assertEqual(set(['A', 'C']),
                         set(tg.tags.by_namespace('target_audience')))

        A_tags = Tag.objects.filter(name='A')
        self.assertEqual(2, A_tags.count())
        self.assertTrue('common' in [tag.namespace.name for tag in A_tags])
        self.assertTrue('target_audience' in [tag.namespace.name
                                for tag in A_tags])

        tg.tags.remove('A', namespace='target_audience')
        self.assertEqual(set(['C']), set(tg.tags['target_audience']))
        self.assertEqual(set(['A', 'B']), set(tg.tags['common']))


