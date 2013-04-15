# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging
from main.utils import APIHandler
from main.api import api_add_new, api_get_by_id, api_update_by_id
from .utils import get_accessor

logger = logging.getLogger(__name__)


class CommonObjectsHandler(APIHandler):
    def post(self, request):
        accessor, err = get_accessor(request)
        return api_add_new(accessor, request) if not err else err


class CommonObjectsIDHandler(APIHandler):
    def get(self, request, id_):
        accessor, err = get_accessor(request)
        return api_get_by_id(accessor, request, id_) if not err else err

    def put(self, request, id_):
        accessor, err = get_accessor(request)
        return api_update_by_id(accessor, request, id_) if not err else err

