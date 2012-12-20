# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf.urls.defaults import url, patterns
from .api import (LoginHandler, LogoutHandler, UserHandler, UsersHandler,
        UserUpdateHandler)


#
# views urls
urlpatterns = patterns('authentication.views',
    url(r'^users/?$', 'user_root', name='user_root'),
    url(r'^users/verification/(?P<key>\S+)/?$', 'user_verification',
            name='user_verification'),
    url(r'^users/(?P<id_>\d+)/?$', 'user_view', name='user_view'),
    url(r'^users/(me)/?$', 'user_view', name='user_view_me'),
)


#
# API urls
urlpatterns += patterns('authentication.api',
        url(r'^api/users/?$', UserHandler.dispatch,
                name='user_api'),
        url(r'^api/users/login/?$', LoginHandler.dispatch,
                name='login_api'),
        url(r'^api/users/logout/?$', LogoutHandler.dispatch,
                name='logout_api'),

        url(r'^api/users/(?P<id_>\d+)/?$', UsersHandler.dispatch,
                name='user_info_api'),
        url(r'^api/users/(?P<id_>\d+)/update/?$', UserUpdateHandler.dispatch,
                name='user_update_api'),
)

#
# Provider urls
urlpatterns += patterns('authentication',
    # Facebook
    url(r'^user/login/facebook?$', 'facebook.login_facebook',
                name="login_facebook"),
    url(r'^user/login/facebook/authorized/?$', 'facebook.facebook_authorized',
                name="facebook_authorized"),

    # Google
    url(r'^user/login/google?$', 'google.login_google',
                name="login_google"),
    url(r'^user/login/google/authorized/?$', 'google.google_authorized',
                name="google_authorized"),
)
