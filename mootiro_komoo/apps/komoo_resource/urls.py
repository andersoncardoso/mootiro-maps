# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, url
from mootiro_komoo.urls import prepare_regex as pr
from .api import ResourcesHandler, ResourcesIDHandler


urlpatterns = patterns('komoo_resource.views',
    url(r'^resource/new/?$', 'edit', name='new_resource'),
    url(r'^resource/new/from_map/?$', 'new_resource_from_map',
                name='new_resource_from_map'),
    url(r'^resource/$', 'resource_list', name='resource_list'),

    url(pr(r'^resource/ID/?$'), 'show', name='view_resource'),
    url(pr(r'^resource/ID/edit/?$'), 'edit', name='edit_resource'),
    # url(pr(r'^resource/OID/?$'), 'show', name='view_resource'),
)

# =============================================================================
# API urls
urlpatterns += patterns('komoo_resource.api',
        url(r'^api/resources/?$', ResourcesHandler.dispatch,
                name='api_resources'),

        url(r'^api/resources/(?P<id_>\w+)/?$', ResourcesIDHandler.dispatch,
                name='api_resources_id'),
)
