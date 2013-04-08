# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from main.utils import APIHandler
from main.api import api_add_new, api_get_by_id, api_update_by_id
from .models import Community_CO as Community


logger = logging.getLogger(__name__)


class CommunitiesHandler(APIHandler):
    """ /communities """

    def post(self, request):
        return api_add_new(Community, request)


class CommunitiesIDHandler(APIHandler):
    """ /communities/[id_] """

    def get(self, request, id_):
        return api_get_by_id(Community, request, id_)

    def put(self, request, id_):
        return api_update_by_id(Community, request, id_)

