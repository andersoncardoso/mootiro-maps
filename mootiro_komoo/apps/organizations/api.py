# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from main.utils import (ResourceHandler, JsonResponse, JsonResponseError,
        get_json_data)

from .models import Organization


logger = logging.getLogger(__name__)


class OrganizationsHandler (ResourceHandler):
    ''' /organizations '''

    def post(self, request):
        '''Create new organization.'''
        json_data = get_json_data(request)
        org = Organization()
        org.from_dict(json_data)
        org.creator = request.user
        org.last_editor = request.user

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


    def put(self, request, id_):
        '''Update organizaton.'''
        json_data = get_json_data(request)
        json_data.update(last_editor=request.user)
        org = Organization.get_by_id(id_)
        org.from_dict(json_data)
        org.save()
        return JsonResponse(org.to_dict())
