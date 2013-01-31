# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from annoying.decorators import render_to


logger = logging.getLogger(__name__)


@render_to('global.html')
def myapp_root(request, id_=''):
    '''Just to load Backbone.'''
    return {}
