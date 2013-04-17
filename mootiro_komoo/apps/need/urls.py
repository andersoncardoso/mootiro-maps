# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, url

from mootiro_komoo.urls import prepare_regex as pr


urlpatterns = patterns('need.views',
    url(r'^need/new/?$', 'edit', name='new_need'),
    url(r'^need/new/from_map/?$', 'new_need_from_map',
            name='new_need_from_map'),

    url(r'^need/?$', 'list', name='need_list'),

    url(r'^need/get_geojson$', 'needs_geojson', name='needs_geojson'),  # ??

    url(pr(r'^need/ID/edit/?$'), 'edit', name='edit_need'),
    url(pr(r'^need/ID/?$'), 'view', name='view_need'),
)

