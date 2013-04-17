# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from django.shortcuts import get_object_or_404, redirect

from annoying.decorators import render_to

from authentication.utils import login_required
from common_objects.models import Resource
from main.utils import create_geojson


logger = logging.getLogger(__name__)


def resource_list(request):
    return redirect("/objects?type=resource", permanent=True)


def show(request, id=None):
    return redirect("/objects/%s" % id, permanent=True)


@login_required
def new_resource_from_map(request, *args, **kwargs):
    return redirect("/objects/new_from_map?type=resource", permanent=True)


@login_required
def edit(request, id=None, *arg, **kwargs):
    url = "/objects/%s/edit" % id if id else "/objects/new"
    return redirect(url, permanent=True)


@render_to('komoo_map/show.html')
def show_on_map(request, geojson=''):
    resource = get_object_or_404(Resource, pk=request.GET.get('id', ''))
    geojson = create_geojson([resource])
    return dict(geojson=geojson)

