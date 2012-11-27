#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf.urls.defaults import url, patterns
from .api import LoginHandler, UserHandler


#
# views urls
urlpatterns = patterns('authentication.views',
    # general urls
    url(r'^user/?$', 'user_root', name='user_root'),
    url(r'^user/logout/?$', 'logout', name='user_logout'),

    # user creation urls
    url(r'^user/verification/(?P<key>\S+)/?$', 'user_verification',
            name='user_verification'),

    # per user urls
    url(r'^user/(?P<id>\d+)/?$', 'profile', name='user_profile'),

    url(r'^user/edit/?$', 'profile_update', name='profile_update'),

    url(r'^user/edit/public_settings/?$',
            'profile_update_public_settings',
            name='profile_update_public_settings'),

    url(r'^user/edit/personal_settings/?$',
            'profile_update_personal_settings',
            name='profile_update_personal_settings'),

    url(r'^user/edit/digest_settings/?$', 'digest_update',
            name='digest_update'),

    url(r'^user/edit/signature_delete/?$', 'signature_delete',
            name='signature_delete'),

)


#
# API urls
urlpatterns += patterns('authentication.api',
        url(r'^api/user/?$', UserHandler.dispatch, name='user_api'),
        url(r'^api/user/login/?$', LoginHandler.dispatch, name='login_api'),
)

#
# Provider urls
urlpatterns += patterns('authentication',
    # Facebook
    url(r'^login/facebook?$', 'facebook.login_facebook',
                name="login_facebook"),
    url(r'^login/facebook/authorized/?$', 'facebook.facebook_authorized',
                name="facebook_authorized"),

    # Google
    url(r'^login/google?$', 'google.login_google',
                name="login_google"),
    url(r'^login/google/authorized/?$', 'google.google_authorized',
                name="google_authorized"),
)
