# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

from django.conf import settings
from django.conf.urls.defaults import patterns, include, url
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.views.i18n import javascript_catalog

# Some URL fragments to be reused throughout the application
SLUG = r'(?P<slug>[a-zA-Z0-9-]+)'
ID = r'(?P<id>\d+)'
PK = r'(?P<pk>\d+)'

handler500 = 'main.views.custom_500'
handler404 = 'main.views.custom_404'

js_info_dict = {'packages': ('komoo_map',)}


def prepare_regex(regex):
    return regex.replace('SLUG', SLUG).replace('ID', ID).replace('PK', PK)

urlpatterns = patterns('',
    # user
    url(r'', include('authentication.urls')),

    # 3rd party apps
    url(r'^upload/', include('fileupload.urls')),
    url(r'^jsi18n/$', javascript_catalog, js_info_dict,
        name='javascript_catalog'),

    # mootiro maps apps
    url(r'', include('hotsite.urls')),
    url(r'', include('main.urls')),
    url(r'', include('regions.urls')),
    url(r'', include('organizations.urls')),
    url(r'', include('resources.urls')),

    # prefixed apps urls
    url(r'^need/', include('need.urls')),
    url(r'^proposal/', include('proposal.urls')),
    url(r'^comments/', include('komoo_comments.urls')),
    url(r'^investment/', include('investment.urls')),
    url(r'^moderation/', include('moderation.urls')),
    url(r'^project/', include('projects.urls')),
    url(r'^projects/', include('projects.api_urls')),
    url(r'^discussion/', include('discussion.urls')),
    url(r'^map_info/', include('komoo_map.urls')),
    url(r'^about/', include('hotsite.urls')),
    url(r'^about', 'hotsite.views.root'),
    url(r'^signatures/', include('signatures.urls')),
)

if settings.DEBUG:
    urlpatterns += staticfiles_urlpatterns()
    urlpatterns += patterns('',
        url(r'^' + settings.MEDIA_URL.lstrip('/') + r'(?P<path>.*)$',
            'django.views.static.serve',
            {'document_root': settings.MEDIA_ROOT, }),
    )
