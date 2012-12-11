# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.conf.urls.defaults import url, patterns
from .api import LoginHandler, LogoutHandler, UserHandler, UsersHandler


#
# views urls
urlpatterns = patterns('authentication.views',
    url(r'^user/?$', 'user_root', name='user_root'),
    url(r'^user/verification/(?P<key>\S+)/?$', 'user_verification',
            name='user_verification'),
)


#
# API urls
urlpatterns += patterns('authentication.api',
        url(r'^api/user/?$', UserHandler.dispatch, name='user_api'),
        url(r'^api/user/login/?$', LoginHandler.dispatch, name='login_api'),
        url(r'^api/user/logout/?$', LogoutHandler.dispatch, name='logout_api'),

        url(r'^api/users/(?P<id_>\S+)/(?P<action>\S+)?$', UsersHandler.dispatch,
                name='user_info_api'),
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
