# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, url
from mootiro_komoo.urls import prepare_regex as pr


urlpatterns = patterns('komoo_resource.views',
    url(r'^resource/new/?$', 'edit', name='new_resource'),
    url(r'^resource/new/from_map/?$', 'new_resource_from_map',
                name='new_resource_from_map'),
    url(r'^resource/$', 'resource_list', name='resource_list'),

    url(pr(r'^resource/ID/?$'), 'show', name='view_resource'),
    url(pr(r'^resource/ID/edit/?$'), 'edit', name='edit_resource'),
)

