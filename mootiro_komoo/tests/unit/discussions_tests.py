# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env, create_test_user
setup_env()

from main.utils import filter_dict, randstr
from .organizations_tests import OrganizationModelTestCase
from discussions.models import Comment


class DiscussionTestCase(unittest.TestCase):
    test_user = create_test_user()

    def _create_comment(self, obj, comment=None, parent=None):
        if not comment:
            comment = randstr()
        comment = Comment(
            author=self.test_user,
            comment=comment,
            parent=parent,
        )
        comment.object = obj
        comment.save()
        return comment

    def _compare_nested(self, expected, nested):
        # evil nested comparison
        for idx, comm in enumerate(nested):
            expected_dict = filter_dict(expected[idx], ['nested_comments'])
            comm_dict = filter_dict(comm,
                    ['id', 'creation_date', 'nested_comments'])
            self.assertDictEqual(expected_dict, comm_dict)
            if len(comm['nested_comments']):
                self._compare_nested(
                        expected[idx]['nested_comments'],
                        comm['nested_comments'])

    def discussion_test(self):
        obj = OrganizationModelTestCase._create_organization()
        comm = self._create_comment(obj, comment='A')

        expected = {
            'author': self.test_user,
            'comment': 'A',
            'parent_id': None,
            'object_table': obj.table_ref,
            'object_id': obj.id,
        }
        comm_dict = filter_dict(comm.to_dict(), ['id', 'creation_date', ])
        self.assertDictEqual(expected, comm_dict)

    def nested_discussion_test(self):
        Comment.objects.all().delete()
        obj = OrganizationModelTestCase._create_organization()
        c = self._create_comment(obj, comment='A')
        self._create_comment(obj, comment='B', parent=c)
        self._create_comment(obj, comment='C', parent=c)
        self._create_comment(obj, comment='D')

        expected = [
            {
                'author': self.test_user,
                'comment': 'A',
                'parent_id': None,
                'object_table': obj.table_ref,
                'object_id': obj.id,
                'nested_comments': [
                    {
                        'author': self.test_user,
                        'comment': 'B',
                        'parent_id': c.id,
                        'object_table': obj.table_ref,
                        'object_id': obj.id,
                        'nested_comments': []
                    },
                    {
                        'author': self.test_user,
                        'comment': 'C',
                        'parent_id': c.id,
                        'object_table': obj.table_ref,
                        'object_id': obj.id,
                        'nested_comments': []
                    }
                ]
            },
            {
                'author': self.test_user,
                'comment': 'D',
                'parent_id': None,
                'object_table': obj.table_ref,
                'object_id': obj.id,
                'nested_comments': []
            }
        ]
        nested_discussion = Comment.nested_discussion_for_object(obj)
        self.assertEqual(len(expected), len(nested_discussion))

        self._compare_nested(expected, nested_discussion)


