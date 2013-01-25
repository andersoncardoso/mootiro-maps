# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env, create_test_user, const
setup_env()

from main.utils import filter_dict
from investments.models import Investor


class InvestorModelTestCase(unittest.TestCase):

    def anonynous_investor_test(self):
        inv, created = Investor.get_or_create(
            investor_type='PER',
            person_name='',
            organization_id=None
        )
        self.assertEqual('Anonymous', inv.name)

        inv_dict = filter_dict(inv.to_dict(), ['id'])

        self.assertDictEqual(inv_dict, {
            'investor_type': 'PER',
            'name': 'Anonymous',
            'person_name': '',
            'organization_id': None,
        })

    def person_investor_test(self):
        inv, created = Investor.get_or_create(
            investor_type='PER',
            person_name='Donald Duck',
            organization_id=None
        )
        self.assertEqual('Donald Duck', inv.name)

        inv_dict = filter_dict(inv.to_dict(), ['id'])

        self.assertDictEqual(inv_dict, {
            'investor_type': 'PER',
            'name': 'Donald Duck',
            'person_name': 'Donald Duck',
            'organization_id': None,
        })

    def organization_investor_test(self):
        pass

