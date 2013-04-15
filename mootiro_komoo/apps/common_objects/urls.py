# -*- coding: utf-8 -*-
from django.conf.urls.defaults import url, patterns

from mootiro_komoo.urls import prepare_regex as pr
from .api import CommonObjectsHandler, CommonObjectsIDHandler


urlpatterns = patterns('common_objects.views',
    url(r'^objects/new$', 'edit', name='new_object'),
    url(r'^objects/$', 'list', name='list_objects'),
    url(pr(r'^objects/ID/edit/?$'), 'edit', name='edit_object'),
    url(pr(r'^objects/ID/?$'), 'show', name='show_object'),
    # url(pr(r'^objects/ID/map/?$'), 'on_map', name='object_on_map'),
)

# =============================================================================
# API urls
urlpatterns += patterns('common_objects.api',
        url(r'^api/objects/?$', CommonObjectsHandler.dispatch,
                name='api_objects'),

        url(r'^api/objects/(?P<id_>\w+)/?$', CommonObjectsIDHandler.dispatch,
                name='api_objects_id'),
)
