# -*- coding: utf-8 -*-
from django.conf.urls.defaults import url, patterns

from mootiro_komoo.urls import prepare_regex as pr
from .api import CommunitiesIDHandler, CommunitiesHandler


urlpatterns = patterns('community.views',
    url(r'^community/new$', 'edit', name='new_community'),
    url(r'^community/$', 'list', name='list_communities'),
    url(r'^community/search_by_name/?$', 'search_by_name',
            name='search_community_by_name'),
    url(r'^community/get_geojson/?$', 'communities_geojson', name='communities_geojson'),
    url(r'^community/get_name_for/(?P<id>\d+)/?$', 'get_name_for', name='get_name_for'),

    url(pr(r'^community/ID/edit/?$'), 'edit', name='edit_community'),
    url(pr(r'^community/ID/?$'), 'view', name='view_community'),
    url(pr(r'^community/ID/map/?$'), 'on_map', name='community_on_map'),
)

# =============================================================================
# API urls
urlpatterns += patterns('community.api',
        url(r'^api/communities/?$', CommunitiesHandler.dispatch,
                name='api_communities'),

        url(r'^api/communities/(?P<id_>\w+)/?$', CommunitiesIDHandler.dispatch,
                name='api_communities_id'),
)
