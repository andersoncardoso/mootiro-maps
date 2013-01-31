# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from main.utils import (ResourceHandler, JsonResponse, get_json_data)


logger = logging.getLogger(__name__)


class OrganizationsHandler (ResourceHandler):
    ''' /organizations '''

    def post(self, request):
        '''Create new organization.'''

        # obj = Model(request.POST)
        # obj.save()
        # return JsonResponse(obj.to_dict())

        data = dict(request.POST, id=7)
        print 'Create:', data
        return JsonResponse(data)


class OrganizationHandler(ResourceHandler):
    ''' /organizations/[id_] '''

    def get(self, request, id_):
        '''Show organizaton.'''

        # obj = Model.get_by_id(id_)
        # return JsonResponse(obj.to_dict())

        data = {
            'id': id_,
            'name': 'Abebubaba',
            'info': 'This id={} comes from python! :)'.format(id_)
        }
        return JsonResponse(data)

    def put(self, request, id_):
        '''Update organizaton.'''

        # json_data = get_json_data(request)
        # obj = Model.get_by_id(id_)
        # obj.from_dict(json_data)
        # obj.save()
        # return JsonResponse({})

        json_data = get_json_data(request)
        print 'Update:', json_data
        return JsonResponse({})