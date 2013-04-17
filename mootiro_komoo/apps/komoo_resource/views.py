# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from django.shortcuts import get_object_or_404, redirect
from django.core.urlresolvers import reverse

from annoying.decorators import render_to
from ajaxforms import ajax_form

from authentication.utils import login_required
from common_objects.models import Resource
from komoo_resource.forms import FormResourceGeoRef
from main.utils import create_geojson


logger = logging.getLogger(__name__)


def resource_list(request):
    return redirect("/objects?type=resource", permanent=True)


def show(request, id=None):
    return redirect("/objects/%s" % id, permanent=True)


# DEPRECATED
@login_required
@ajax_form('resource/new_frommap.html', FormResourceGeoRef, 'form_resource')
def new_resource_from_map(request, *args, **kwargs):

    def on_get(request, form_resource):
        form_resource.helper.form_action = reverse('new_resource_from_map')
        return form_resource

    def on_after_save(request, obj):
        return {'redirect': obj.view_url}

    return {'on_get': on_get, 'on_after_save': on_after_save}


@login_required
def edit(request, id=None, *arg, **kwargs):
    if id:
        return redirect("/objects/%s/edit", permanent=True)
    else:
        return redirect("/objects/new", permanent=True)


@render_to('komoo_map/show.html')
def show_on_map(request, geojson=''):
    resource = get_object_or_404(Resource, pk=request.GET.get('id', ''))
    geojson = create_geojson([resource])
    return dict(geojson=geojson)

