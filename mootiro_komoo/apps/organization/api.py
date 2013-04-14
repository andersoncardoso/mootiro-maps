# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from main.utils import APIHandler
from main.api import api_add_new, api_get_by_id, api_update_by_id
from .models import Organization_CO as Organization


logger = logging.getLogger(__name__)


class OrganizationsHandler(APIHandler):
    """ /organizations """

    def post(self, request):
        return api_add_new(Organization, request)


class OrganizationsIDHandler(APIHandler):
    """ /organizations/[id_] """

    def get(self, request, id_):
        return api_get_by_id(Organization, request, id_)

    def put(self, request, id_):
        return api_update_by_id(Organization, request, id_)

