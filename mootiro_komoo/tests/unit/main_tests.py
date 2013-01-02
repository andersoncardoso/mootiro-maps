# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
import datetime
from mock import MagicMock, patch
from ..test_utils import setup_env
setup_env()

from main.models import CommonObject, CommonDataMixin


class CommonDataMixinTest(unittest.TestCase):
    def common_attributes_test(self):
        pass
    
    def to_dict_test(self):
        pass
