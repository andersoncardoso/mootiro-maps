#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

import json
import logging

from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import redirect
from django.contrib.gis.geos import Polygon


from authentication.utils import login_required
from common_objects.models import Need
from main.utils import create_geojson

logger = logging.getLogger(__name__)


def list(request):
    return redirect('/objects?type=need', permanent=True)


def view(request, id=None):
    return redirect('/objects/%s/' % id, permanent=True)


@login_required
def new_need_from_map(request, id=""):
    return redirect('/objects/new_from_map?type=need', permanent=True)


@login_required
def edit(request, id=None):
    url = '/objects/%s/edit' % id if id else '/objects/new'
    return redirect(url, permanent=True)


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

