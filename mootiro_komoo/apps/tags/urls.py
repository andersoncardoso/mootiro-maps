# -*- coding: utf-8 -*-
from django.conf.urls.defaults import patterns, url
from .views import *


urlpatterns = patterns('tags.views',
    url(r'^tags/search_namespace/?$', 'search_namespace',
            name='tags_search_namespace'),
    url(r'^tags/search_tags/?$', 'search_tags',
            name='tags_search_tags'),
)

