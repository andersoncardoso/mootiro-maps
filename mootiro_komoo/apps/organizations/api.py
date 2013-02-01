# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from main.utils import (ResourceHandler, JsonResponse, JsonResponseError,
        get_json_data)
from authentication.utils import api_login_required

from .models import Organization


logger = logging.getLogger(__name__)


class OrganizationsHandler (ResourceHandler):
    ''' /organizations '''

    @api_login_required
    def post(self, request):
        '''Create new organization.'''
        json_data = get_json_data(request)
        json_data.update(creator=request.user, last_editor=request.user)
        org = Organization()
        org.from_dict(json_data)

        if not org.is_valid():
            return JsonResponseError(org.errors)

        org.save()
        return JsonResponse(org.to_dict())


class OrganizationHandler(ResourceHandler):
    ''' /organizations/[id_] '''

    def get(self, request, id_):
        '''Show organizaton.'''
        org = Organization.get_by_id(id_)
        return JsonResponse(org.to_dict())

    @api_login_required
    def put(self, request, id_):
        '''Update organizaton.'''
        json_data = get_json_data(request)
        json_data.update(last_editor=request.user)
        org = Organization.get_by_id(id_)
        org.from_dict(json_data)
        org.save()
        return JsonResponse(org.to_dict())
