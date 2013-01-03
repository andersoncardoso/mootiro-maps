# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env
setup_env()

from tags.models import Tag, TaggedObject
from tests.models import TestTaggedClass


class TagTest(unittest.TestCase):

    def _clean_all_tags(self):
        Tag.objects.all().delete()
        TaggedObject.objects.all().delete()

    def tag_test(self):
        self._clean_all_tags()
        obj = TestTaggedClass()
        obj.save()

        # tags start empty
        self.assertEqual([], obj.tags)

        # implicitly create and set tags
        obj.tags = ['A', 'B']
        self.assertEqual(['A', 'B'], obj.tags)
        tagA = Tag.objects.get(name='A')
        tagB = Tag.objects.get(name='B')
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
        self.assertEqual(['B', 'C'], obj.tags)


