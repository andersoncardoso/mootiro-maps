# -*_ coding: utf-8 -*-
import requests
from django.conf import settings
from main.utils import to_json


def _datalog_request(data, method='get'):
    return getattr(requests, method)(
        settings.DATALOG_SERVER,
        headers={'Content-Type': 'application/json'},
        data=to_json(data)
    )


def get_user_updates(user, page=1, num=None):
    params = {
        'user': user.to_dict(),
    }
    if num:
        params['skip'] = (page - 1) * num
        params['limit'] = num

    return _datalog_request(params)
