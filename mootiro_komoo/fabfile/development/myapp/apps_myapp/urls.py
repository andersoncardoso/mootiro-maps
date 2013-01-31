# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf.urls.defaults import url, patterns

from .api import MyappHandler, MyappIdHandler


# views urls
urlpatterns = patterns('myapp.views',
    url(r'^myapp/new/?$', 'myapp_root',
            name='myapp_root'),
    url(r'^myapp/(?P<id_>\d+)/?$', 'myapp_root',
            name='myapp_root'),
    url(r'^myapp/(?P<id_>\d+)/edit/?$', 'myapp_root',
            name='myapp_root'),
)

# API urls
urlpatterns += patterns('myapp.api',
    url(r'^api/myapp/?$', MyappHandler.dispatch,
            name='myapp_api'),
    url(r'^api/myapp/(?P<id_>\d+)/?$', MyappIdHandler.dispatch,
            name='myapp_id_api'),
)
