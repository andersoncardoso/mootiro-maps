# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf.urls.defaults import url, patterns


# Views urls
urlpatterns = patterns('myapp.views',
    url(r'^myapp/?$', 'myapp_root', name='myapp_root'),
)


# API urls
urlpatterns += patterns('myapp.api',
    url(r'^api/myapp/(?P<id_>\d+)/?$', MyappHandler.dispatch,
            name='myapp_api'),
)
