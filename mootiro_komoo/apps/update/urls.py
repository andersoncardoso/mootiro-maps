# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.conf.urls.defaults import patterns, url

from .views import FrontpageView

urlpatterns = patterns('update.views',
    url(r'^$', FrontpageView.dispatch, name='root'),
)
