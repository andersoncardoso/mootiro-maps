# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env, create_test_user, const
setup_env()

from main.utils import filter_dict
from investments.models import Investor
from .organizations_tests import OrganizationModelTestCase


class InvestorModelTestCase(unittest.TestCase):

    def anonynous_investor_test(self):
        inv, created = Investor.get_or_create(
            investor_type='PER',
            person_name='',
            organization_id=None
        )
        self.assertEqual('Anonymous', inv.name)

        inv_dict = filter_dict(inv.to_dict(), ['id'])
        expected_dict = {
            'investor_type': 'PER',
            'name': 'Anonymous',
            'person_name': '',
            'organization_id': None,
        }
        self.assertDictEqual(expected_dict, inv_dict)

        inv2 = Investor()
        inv2.from_dict(expected_dict)
        inv2_dict = filter_dict(inv2.to_dict(), ['id'])
        self.assertDictEqual(inv_dict, inv2_dict)

        self.assertTrue(inv.is_valid())

    def person_investor_test(self):
        inv, created = Investor.get_or_create(
            investor_type='PER',
            person_name='Donald Duck',
            organization_id=None
        )
        self.assertEqual('Donald Duck', inv.name)

        inv_dict = filter_dict(inv.to_dict(), ['id'])
        expected_dict = {
            'investor_type': 'PER',
            'name': 'Donald Duck',
            'person_name': 'Donald Duck',
            'organization_id': None,
        }
        self.assertDictEqual(expected_dict, inv_dict)

        inv2 = Investor()
        inv2.from_dict(expected_dict)
        inv2_dict = filter_dict(inv2.to_dict(), ['id'])
        self.assertDictEqual(inv_dict, inv2_dict)

        self.assertTrue(inv.is_valid())

    def organization_investor_test(self):
        org = OrganizationModelTestCase._create_organization()

        inv, created = Investor.get_or_create(
            investor_type='ORG',
            person_name=None,
            organization_id=org.id
        )
        self.assertEqual(org.name, inv.name)

        inv_dict = filter_dict(inv.to_dict(), ['id'])
        expected_dict = {
            'investor_type': 'ORG',
            'name': org.name,
            'person_name': None,
            'organization_id': org.id,
        }
        self.assertDictEqual(expected_dict, inv_dict)

        inv2 = Investor()
        inv2.from_dict(expected_dict)
        inv2_dict = filter_dict(inv2.to_dict(), ['id'])
        self.assertDictEqual(inv_dict, inv2_dict)

        self.assertTrue(inv.is_valid())

