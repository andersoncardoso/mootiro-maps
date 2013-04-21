# -*- coding: utf-8 -*-
import logging
from django.shortcuts import redirect
from authentication.utils import login_required


logger = logging.getLogger(__name__)


def list(request):
    return redirect("/objects?type=investment", permanent=True)


@login_required
def edit(request, id=None):
    url = "/objects/%s/edit" % id if id else "/objects/new"
    return redirect(url, permanent=True)


def show(request, id=None):
    return redirect("/objects/%s" % id, permanent=True)


