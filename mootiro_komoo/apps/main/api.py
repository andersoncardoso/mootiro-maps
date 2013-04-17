# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from main.utils import JsonResponse
from main.utils import get_json_data
# from main.datalog import log_data


logger = logging.getLogger(__name__)


def api_add_new(model, request):
    """ Responsible for creating a new `model` object """
    json_data = get_json_data(request)
    obj = model()
    obj.from_dict(json_data)

    if not request.user.can_edit(obj):
        return JsonResponse(
                request.user.no_permission_message, response_type='error')

    obj.creator = request.user
    if not obj.is_valid():
        return JsonResponse(obj.errors, response_type='error')

    obj.save()
    return JsonResponse({'redirect': obj.url})


def api_get_by_id(model, request, id_):
    obj = model.get_by_id(id_)

    if not obj:
        return JsonResponse(response_type='not_found')

    # obj_data = obj.to_cleaned_dict(user=request.user)
    obj_data = obj.to_dict()
    return JsonResponse(obj_data)


def api_update_by_id(model, request, id_):
    """ Updates user data """
    json_data = get_json_data(request)
    obj = model.get_by_id(id_)
    if not obj:
        JsonResponse(response_type='not_found')

    if not request.user.can_edit(obj):
        return JsonResponse(
                request.user.no_permission_message, response_type='error')

    json_data['last_editor'] = request.user
    obj.from_dict(json_data)
    if not obj.is_valid():
        return JsonResponse(obj.errors, response_type='error')

    obj.save()
    # log_data.send(
    #         sender=res, object_=obj, user=request.user, action='E')
    return JsonResponse({'redirect': obj.url})

