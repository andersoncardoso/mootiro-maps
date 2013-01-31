# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from main.utils import (ResourceHandler, JsonResponse, get_json_data)


logger = logging.getLogger(__name__)


class MyappHandler (ResourceHandler):
    ''' /api/myapp '''

    def post(self, request):
        '''Create new instance of Model.'''

        # obj = Model(request.POST)
        # obj.save()
        # return JsonResponse(obj.to_dict())

        print 'Create:', dict(request.POST)
        return JsonResponse(request.POST)


class MyappIdHandler(ResourceHandler):
    ''' /api/myapp/[id_] '''

    def get(self, request, id_):
        '''Show model.'''

        # obj = Model.get_by_id(id_)
        # return JsonResponse(obj.to_dict())

        data = {
            'id': id_,
            'name': 'Abebubaba',
            'info': 'This id={} comes from python! :)'.format(id_)
        }
        return JsonResponse(data)

    def put(self, request, id_):
        '''Update model.'''

        # json_data = get_json_data(request)
        # obj = Model.get_by_id(id_)
        # obj.from_dict(json_data)
        # obj.save()
        # return JsonResponse({})

        json_data = get_json_data(request)
        print 'Update:', json_data
        return JsonResponse({})
