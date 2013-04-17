#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

import json
import logging

from django.shortcuts import get_object_or_404, redirect
from django.http import HttpResponse
from django.utils import simplejson
from django.contrib.gis.geos import Polygon
from django.db.models.query_utils import Q

from authentication.utils import login_required

from annoying.decorators import render_to, ajax_request

from common_objects.models import Community
from main.utils import create_geojson

logger = logging.getLogger(__name__)


def list(request):
    return redirect("/objects?type=community", permanent=True)


def view(request, id):
    return redirect("/objects/%s" % id, permanent=True)


@login_required
def edit(request, id=''):
    if id:
        return redirect("/objects/%s/edit" % id, permanent=True)
    else:
        return redirect("/objects/new?type=community", permanent=True)


@render_to('community/on_map.html')
def on_map(request, id):
    community = get_object_or_404(Community, pk=id)
    geojson = create_geojson([community])
    return dict(community=community, geojson=geojson)


def communities_geojson(request):
    bounds = request.GET.get('bounds', None)
    x1, y2, x2, y1 = [float(i) for i in bounds.split(',')]
    polygon = Polygon(((x1, y1), (x1, y2), (x2, y2), (x2, y1), (x1, y1)))
    # communities = Community.objects.filter(geometry__intersects=polygon)
    intersects_polygon = (Q(points__intersects=polygon) |
                          Q(lines__intersects=polygon) |
                          Q(polys__intersects=polygon))
    communities = Community.objects.filter(intersects_polygon)
    geojson = create_geojson(communities)
    return HttpResponse(json.dumps(geojson),
        mimetype="application/x-javascript")


def search_by_name(request):
    term = request.GET['term']
    communities = Community.objects.filter(Q(name__icontains=term) |
                                           Q(slug__icontains=term))
    d = [{'value': c.id, 'label': c.name} for c in communities]
    return HttpResponse(simplejson.dumps(d),
                        mimetype="application/x-javascript")


@ajax_request
def get_name_for(request, id):
    community_name = Community.objects.get(pk=id).name
    return {'name': community_name}

