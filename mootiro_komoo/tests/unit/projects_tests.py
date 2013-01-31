# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env, create_test_user, const
setup_env()

from main.utils import filter_dict
from projects.models import Project, ProjectRelatedObject
from .organizations_tests import OrganizationModelTestCase


class ProjectTestCase(unittest.TestCase):
    test_user = create_test_user()

    @classmethod
    def _create_project(self):
        proj, created = Project.get_or_create(
            name='Test Project',
            description='used for testing purposes',
            public=True,
            public_discussion=True,
            contact={'phone': '12345'},
            creator=self.test_user
        )
        proj.contributors.add(self.test_user)
        return proj

    @property
    def expected(self):
        return {
            'name': 'Test Project',
            'description': 'used for testing purposes',
            'public': True,
            'public_discussion': True,
            'contact': {'phone': '12345'},
            'last_editor': None,
            'tags': const.EMPTY_TAGS,
            'creator': self.test_user,
            'region': None,
            'extra_data': None,
            'contributors': [self.test_user.id, ]
        }

    def to_dict_test(self):
        proj = self._create_project()
        proj_dict = filter_dict(proj.to_dict(),
                ['id', 'creation_date', 'last_update'])
        self.assertDictEqual(self.expected, proj_dict)

    def from_dict_test(self):
        proj = Project()
        proj.from_dict(self.expected)
        proj.save()

        proj_dict = filter_dict(proj.to_dict(),
                ['id', 'creation_date', 'last_update'])
        self.assertDictEqual(self.expected, proj_dict)

        proj.delete()

    def is_valid_test(self):
        proj = self._create_project()
        self.assertTrue(proj.is_valid())


class ProjectRelatedObjectTestCase(unittest.TestCase):
    def add_related_to_project_test(self):
        ProjectRelatedObject.objects.all().delete()
        obj = OrganizationModelTestCase._create_organization()
        project = ProjectTestCase._create_project()

        related = project.add_related_object(obj)
        self.assertEqual(1, ProjectRelatedObject.objects.all().count())

    def to_dict_test(self):
        ProjectRelatedObject.objects.all().delete()
        obj = OrganizationModelTestCase._create_organization()
        project = ProjectTestCase._create_project()

        related = project.add_related_object(obj)
        related_dict = filter_dict(related.to_dict(), ['id'])
        self.assertDictEqual(related_dict, {
            'project': project.id,
            'object_table': obj.table_ref,
            'object_id': obj.id,
        })

    def from_dict_test(self):
        ProjectRelatedObject.objects.all().delete()
        obj = OrganizationModelTestCase._create_organization()
        project = ProjectTestCase._create_project()

        related = ProjectRelatedObject()
        related.from_dict({
            'project': project,
            'object_table': obj.table_ref,
            'object_id': obj.id,
        })
        related.save()
        
        self.assertIn(related, project.related_objects.all())

    def is_valid_test(self):
        ProjectRelatedObject.objects.all().delete()
        obj = OrganizationModelTestCase._create_organization()
        project = ProjectTestCase._create_project()

        related = project.add_related_object(obj)
        self.assertTrue(related.is_valid())


