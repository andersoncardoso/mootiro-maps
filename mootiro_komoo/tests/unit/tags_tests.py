# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import unittest
from ..test_utils import setup_env
setup_env()

from tags.models import Tag, TaggedObject, TagsMixin


class TagTest(unittest.TestCase):

    def tag_test(self):
        pass

