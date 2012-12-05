# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, url

from mootiro_komoo.urls import prepare_regex as pr
# from need.views import (ListView, AboutView, SearchTagsView,
#         SearchTargetAudienceView, EditView, NewFromMapView, NewView)


urlpatterns = patterns('need.views',
    # url(r'^$', ListView.dispatch, name='need_list'),
    # url(pr(r'^ID/?$'), AboutView.dispatch, name='view_need'),
    # url(pr(r'^ID/edit/?$'), EditView.dispatch, name='edit_need'),

    # url(r'^new/?$', NewView.dispatch, name='new_need'),
    # url(r'^new/from_map/?$', NewFromMapView.dispatch,
    #         name='new_need_from_map'),

    # url(r'^search_tags/?$', SearchTagsView.dispatch,
    #         name='need_tag_search'),
    # url(r'^tag_search$', SearchTagsView.dispatch,
    #         name='need_tag_search'),
    # url(r'^target_audience_search/?$', SearchTargetAudienceView.dispatch,
    #         name='target_audience_search'),
)
