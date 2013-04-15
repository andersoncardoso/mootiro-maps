# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from django.utils.translation import ugettext as _
from main.utils import get_json_data
from common_objects import models
from main.utils import JsonResponse, to_json


def get_accessor(request, allow_generic=False, method='raw_json_data'):
    if method == 'raw_json_data':
        type_ = get_json_data(request).get('type', None)
    else:
        type_ = getattr(request, method, {}).get('type', None)

    if not type_:
        if allow_generic:
            return models.GeoRefObject, None
        else:
            err = {'__all__': _('No type provided')}
            return None, JsonResponse(err, response_type='error')

    accessor = getattr(models, type_.capitalize(), None)
    if not accessor:
        err = {'__all__': _('Invalid type')}
        return None, JsonResponse(err, response_type='error')
    return accessor, None


def fix_type_on_request(request, type_):
    if not request.raw_post_data:
        request.raw_post_data = to_json({"type": type_})
    else:
        d = get_json_data(request)
        d['type'] = type_
        request.raw_post_data = to_json(d)
    return request
