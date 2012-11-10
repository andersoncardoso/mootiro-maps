# -*- coding: utf-8 -*-
from django.conf.urls.defaults import url, patterns

from mootiro_komoo.urls import prepare_regex as pr
from community.views import (AboutView, MapView, NewView, EditView, ListView,
        ProjectsView, SearchTagsView, SearchByNameView)


urlpatterns = patterns('community.views',
    url(r'^new$', NewView.dispatch, name='new_community'),
    url(r'^edit$', EditView.dispatch, name='edit_community'),
    url(r'^$', ListView.dispatch, name='list_communities'),

    url(pr(r'^ID/edit/?$'), EditView.dispatch, name='edit_community'),
    url(pr(r'^ID/about/?$'), AboutView.dispatch, name='view_community'),
    url(pr(r'^ID/projects/?$'), ProjectsView.dispatch,
        name='community_projects'),
    url(pr(r'^ID/?$'), MapView.dispatch, name='community_on_map'),
    url(r'^search_tags/?$', SearchTagsView.dispatch,
        name='community_search_tags'),

    url(r'^search_by_name/?$', SearchByNameView.dispatch,
            name='search_community_by_name'),
    url(r'^get_name_for/(?P<id>\d+)/?$', 'get_name_for', name='get_name_for'),
)
