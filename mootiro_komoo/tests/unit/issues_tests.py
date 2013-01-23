# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env, create_test_user, const
setup_env()

from main.utils import filter_dict
from issues.models import Issue


class IssueModelTestCase(unittest.TestCase):

    def _create_issue(self):
        issue, created = Issue.objects.get_or_create(
            name='Lixo na Rua',
            description='Ta fidido!',
        )
        issue.creator = self.test_user
        issue.creation_date = const.DATETIME_OBJ
        issue.issue_type = 'problem'
        issue.population = 120
        issue.save()
        return issue

    test_user = create_test_user()

    @property
    def expected_dict(self):
        return {
            'name': 'Lixo na Rua',
            'description': 'Ta fidido!',
            'creator': self.test_user,
            'creation_date': const.DATETIME_OBJ,
            'last_editor': None,
            'extra_data': None,
            'tags': const.EMPTY_TAGS,
            'issue_type': 'problem',
        }

    def to_dict_test(self):
        issue = self._create_issue()
        issue_dict = filter_dict(issue.to_dict(), ['id', 'last_update'])
        self.assertDictEqual(issue_dict, self.expected_dict)

    def from_dict_test(self):
        issue = Issue()
        issue.from_dict(self.expected_dict)
        issue_dict = filter_dict(issue.to_dict(), ['id', 'last_update'])
        self.assertDictEqual(issue_dict, self.expected_dict)

    def is_valid_test(self):
        issue = self._create_issue()
        self.assertTrue(issue.is_valid())

