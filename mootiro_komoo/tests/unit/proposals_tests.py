# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env, create_test_user, const
setup_env()

from main.utils import filter_dict
from proposals.models import Proposal


class ProposalModelTestCase(unittest.TestCase):

    def _create_proposal(self):
        prop, created = Proposal.objects.get_or_create(
            name='Limpeza Colaborativa do Bairro',
            description='Vamos marcar um multirão de limpeza',
        )
        prop.creator = self.test_user
        prop.creation_date = const.DATETIME_OBJ
        prop.cost = 200.00
        prop.report = 'os 200.00 de custo vão para os produtos de limpeza'
        prop.save()
        return prop

    test_user = create_test_user()

    @property
    def expected_dict(self):
        return {
            'name': 'Limpeza Colaborativa do Bairro',
            'description': 'Vamos marcar um multirão de limpeza',
            'creator': self.test_user,
            'creation_date': const.DATETIME_OBJ,
            'last_editor': None,
            'extra_data': None,
            'tags': const.EMPTY_TAGS,
            'cost': 200.00,
            'report': 'os 200.00 de custo vão para os produtos de limpeza'
        }

    def to_dict_test(self):
        prop = self._create_proposal()
        prop_dict = filter_dict(prop.to_dict(), ['id', 'last_update'])
        self.assertDictEqual(prop_dict, self.expected_dict)

    def from_dict_test(self):
        prop = Proposal()
        prop.from_dict(self.expected_dict)
        prop_dict = filter_dict(prop.to_dict(), ['id', 'last_update'])
        self.assertDictEqual(prop_dict, self.expected_dict)

    def is_valid_test(self):
        prop = self._create_proposal()
        self.assertTrue(prop.is_valid())

