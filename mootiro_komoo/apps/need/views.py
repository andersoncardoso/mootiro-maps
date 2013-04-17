#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

import json
import logging

from django.core.urlresolvers import reverse
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib.gis.geos import Polygon

from ajaxforms import ajax_form

from authentication.utils import login_required
from common_objects.models import Need
from need.forms import NeedFormGeoRef
from main.utils import create_geojson

logger = logging.getLogger(__name__)


def list(request):
    return redirect('/objects?type=need', permanent=True)


def view(request, id=None):
    return redirect('/objects/%s/' % id, permanent=True)


# DEPRECATED
@login_required
@ajax_form('need/edit_ajax.html', NeedFormGeoRef)
def new_need_from_map(request, id=""):
    geojson, need = {}, None

    def on_get(request, form):
        form.helper.form_action = reverse('new_need_from_map')
        return form

    def on_after_save(request, need):
        redirect_url = reverse('view_need', kwargs={'id': need.id})
        return {'redirect': redirect_url}

    return {'on_get': on_get, 'on_after_save': on_after_save,
            'geojson': geojson, 'need': need}


@login_required
def edit(request, id=None):
    if id:
        return redirect('/objects/%s/edit' % id, permanent=True)
    else:
        return redirect('/objects/new' % id, permanent=True)


def needs_geojson(request):
    bounds = request.GET.get('bounds', None)
    x1, y2, x2, y1 = [float(i) for i in bounds.split(',')]
    polygon = Polygon(((x1, y1), (x1, y2), (x2, y2), (x2, y1), (x1, y1)))
    needs = Need.objects.filter(
            Q(points__intersects=polygon) |
            Q(lines__intersects=polygon) |
            Q(polys__intersects=polygon)
    )
    geojson = create_geojson(needs)
    return HttpResponse(json.dumps(geojson),
        mimetype="application/x-javascript")

