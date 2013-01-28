# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env, create_test_user, const
setup_env()

from main.utils import filter_dict
from investments.models import Investor, Investment
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


class InvestmentModelTest(unittest.TestCase):
    test_user = create_test_user()

    def _create_investor(self):
        inv, creator = Investor.get_or_create(
            investor_type='PER',
            person_name='Dino Da Silva Sauro'
        )
        return inv

    def investment_test(self):
        self.maxDiff = None
        investor = self._create_investor()
        obj = OrganizationModelTestCase._create_organization()

        expected_dict = {
            'name': 'Reconstrução da rampa do poço de pixe',
            'description': 'É necessário a reconstrução para empurar a vovó',
            'creator': self.test_user,
            'investment_type': 'donation',
            'currency': 'USD',
            'value': 250.00,
            'start_date': const.DATETIME_OBJ,
            'end_date': None,
            'investor': investor,
            'invested_object_table': obj.table_ref,
            'invested_object_id': obj.id,
            'extra_data': None,
            'tags': const.EMPTY_TAGS,
        }

        inv = Investment(
            name='Reconstrução da rampa do poço de pixe',
            description='É necessário a reconstrução para empurar a vovó',
            creator=self.test_user,
            investment_type='donation',
            currency='USD',
            value=250.00,
            start_date=const.DATETIME_OBJ,
            investor=investor
        )
        inv.set_invested_object(obj)

        inv_dict = filter_dict(inv.to_dict(),
                ['id', 'last_update', 'last_editor', 'creation_date'])
        self.assertDictEqual(expected_dict, inv_dict)

        inv2 = Investment()
        inv2.from_dict(expected_dict)
        inv2_dict = filter_dict(inv2.to_dict(),
                ['id', 'last_update', 'last_editor', 'creation_date'])
        self.assertDictEqual(inv_dict, inv2_dict)

        self.assertTrue(inv.is_valid())



