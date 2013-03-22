# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from main.utils import APIHandler
from main.utils import JsonResponse
from main.utils import get_json_data
# from main.datalog import log_data
from .models import Resource_GRO as Resource


logger = logging.getLogger(__name__)


class ResourcesHandler(APIHandler):
    """ /resources """

    def post(self, request):
        """
        Responsible for creating a new Resource
        """
        json_data = get_json_data(request)
        resource = Resource()
        resource.from_dict(json_data)

        if not request.user.can_edit(resource):
            return JsonResponse(
                    request.user.no_permission_message, response_type='error')

        if not resource.is_valid():
            return JsonResponse(resource.errors, response_type='error')

        resource.save()
        return JsonResponse()


class ResourcesIDHandler(APIHandler):
    """ /resources/[id_] """

    def get(self, request, id_):
        resource = Resource.get_by_id(id_)

        if not resource:
            return JsonResponse(response_type='not_found')

        # resource_data = resource.to_cleaned_dict(user=request.user)
        resource_data = resource.to_dict()
        return JsonResponse(resource_data)

    def put(self, request, id_):
        """ Updates user data """
        json_data = get_json_data(request)
        res = Resource.get_by_id(id_)
        if not res:
            JsonResponse(response_type='not_found')

        if not request.user.can_edit(res):
            return JsonResponse(
                    request.user.no_permission_message, response_type='error')

        res.from_dict(json_data)
        if not res.is_valid():
            return JsonResponse(res.errors, response_type='error')

        res.save()
        # log_data.send(
        #         sender=res, object_=res, user=request.user, action='E')
        return JsonResponse({})

