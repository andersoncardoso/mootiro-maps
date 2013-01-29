# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from main.utils import (ResourceHandler, JsonResponse, JsonResponseNotFound,
        JsonResponseError, get_json_data, get_fields_to_show)


logger = logging.getLogger(__name__)


class OrganizationHandler(ResourceHandler):
    ''' /myapp/[id_] '''

    def get(self, request, id_):
        data = {
            'id': id_,
            'info': 'This string comes from python! :)'
        }
        return JsonResponse(data)

    def post(self, request, id_):
        pass
