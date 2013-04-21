# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf.urls.defaults import patterns, url

from mootiro_komoo.urls import prepare_regex as pr


urlpatterns = patterns('investment.views',
    url(r'^investment/?$', 'list', name='investment_list'),
    url(r'^investment/new/?$', 'edit', name='new_investment'),
    url(pr(r'^investment/ID/?$'), 'show', name='view_investment'),
    url(pr(r'^investment/ID/edit/?$'), 'edit', name='edit_investment'),
)
