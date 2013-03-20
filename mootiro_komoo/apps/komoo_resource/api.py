# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from django.utils.translation import ugettext as _

from main.utils import (APIHandler, JsonResponse, JsonResponseNotFound,
        JsonResponseError, get_json_data)
# from main.datalog import log_data

from .models import Resource_GRO as Resource


logger = logging.getLogger(__name__)


def _resource_form_specific_validations(resource, json_data, form_validates):
    """
    This method makes Resource's Form specific validation.
    Used on: /user <POST>
    """
    return form_validates


class ResourcesHandler(APIHandler):
    """ /resources """

    def post(self, request):
        """
        Responsible for creating a new Resource
        """
        json_data = get_json_data(request)
        resource = Resource()
        resource.from_dict(json_data)

        # user model validations
        form_validates = resource.is_valid()
        form_validates = _resource_form_specific_validations(
                resource, json_data, form_validates)

        if not form_validates:
            return JsonResponseError(resource.errors)
        else:
            resource.save()
            return JsonResponse()


class ResourcesIDHandler(APIHandler):
    """ /resources/[id_] """

    def get(self, request, id_):
        resource = Resource.get_by_id(id_)

        if not resource:
            return JsonResponseNotFound()

        # resource_data = resource.to_cleaned_dict(user=request.user)
        resource_data = resource.to_dict()
        return JsonResponse(resource_data)

    def put(self, request, id_):
        """ Updates user data """
        json_data = get_json_data(request)
        res = Resource.get_by_id(id_)
        if not res:
            JsonResponseNotFound()

        if res.can_edit(request.user):
            res.from_dict(json_data)
            if not res.is_valid():
                return JsonResponseError(res.errors)

            res.save()
            # log_data.send(
            #         sender=res, object_=res, user=request.user, action='E')
            return JsonResponse({})
        else:
            return JsonResponseError({
                'all': _('You don\'t have permission for this operation')
            })

