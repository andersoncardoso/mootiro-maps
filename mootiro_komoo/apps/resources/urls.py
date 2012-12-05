# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, url
from mootiro_komoo.urls import prepare_regex as pr

# from resources.views import (ListView, AboutView, EditView, NewView,
#         NewFromMapView, SearchTagsView, SearchByKindView)


urlpatterns = patterns('resources.views',
    # url(r'^$', ListView.dispatch, name='resource_list'),
    # url(pr(r'^ID/?$'), AboutView.dispatch, name='view_resource'),
    # url(pr(r'^ID/edit/?$'), EditView.dispatch, name='edit_resource'),
    # url(r'^new/?$', NewView.dispatch, name='new_resource'),
    # url(r'^new/from_map/?$', NewFromMapView.dispatch,
    #             name='new_resource_from_map'),
    # url(r'^search_tags/$', SearchTagsView.dispatch,
    #     name='resource_search_tags'),

    # url(r'^search_by_kind/$', SearchByKindView.dispatch,
    #             name='resource_search_by_kind'),
)
