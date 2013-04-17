# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf.urls.defaults import patterns, url
from mootiro_komoo.urls import prepare_regex as pr


urlpatterns = patterns('organization.views',
    url(r'^organization/?$', 'organization_list', name='organization_list'),
    url(r'^organization/new/?$', 'edit', name='new_organization'),
    url(r'^organization/new/from_map/?$', 'new_organization_from_map',
                name='new_organization_from_map'),
    url(r'^organization/search_by_name/$', 'search_by_name',
            name='organization_search_by_name'),

    url(pr(r'^organization/ID/?$'), 'show', name='view_organization'),
    url(pr(r'^organization/ID/edit/?$'), 'edit',
            name='edit_organization'),
    url(pr(r'^organization/ID/related/?$'), 'related_items',
                name='view_organization_related_items'),
)

