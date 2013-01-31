# -*_ coding: utf-8 -*-
import requests
from django.dispatch import receiver, Signal
from django.conf import settings
from celery.task import task

from main.utils import to_json


log_data = Signal(providing_args=["object", "user", "action"])


def _datalog_request(data, method='get'):
    return getattr(requests, method)(
        settings.DATALOG_SERVER,
        headers={'Content-Type': 'application/json'},
        data=to_json(data)
    )


@task
def datalog_request_task(data, method='get'):
    return _datalog_request(data, method=method)


def get_user_updates(user, page=1, num=None):
    params = {
        'user': user.to_dict(),
    }
    if num:
        params['skip'] = (page - 1) * num
        params['limit'] = num

    return _datalog_request(params)

# Commented because it was causing fab run to fail. Ass: André.
# TODO: fix it.
# @receiver(log_data)
# def log_data_receiver(sender, object, user, action):
#     data = {
#         'table': object.table_ref,
#         'object_id': object.id,
#         'user': user,
#         'action': action,
#         'data': object.to_dict()
#     }
#     datalog_request_task.delay(data, method='post')
