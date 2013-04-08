#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

import json
import logging

from django.shortcuts import get_object_or_404
from django.http import HttpResponse
from django.utils import simplejson
from django.contrib.gis.geos import Polygon
from django.db.models.query_utils import Q

from authentication.utils import login_required

from annoying.decorators import render_to, ajax_request

from community.models import Community_CO as Community
from main.utils import (create_geojson, paginated_query, sorted_query,
                        filtered_query)

logger = logging.getLogger(__name__)


@render_to('community/list.html')
def list(request):
    sort_order = ['creation_date', 'name']
    query_set = filtered_query(Community.objects, request)
    communities = sorted_query(query_set, sort_order, request)
    communities_count = communities.count()
    communities = paginated_query(communities, request)
    return dict(communities=communities, communities_count=communities_count)


@render_to('community/view.html')
def view(request, id):
    community = get_object_or_404(Community, pk=id)
    geojson = community.geojson
    return dict(community=community, geojson=geojson)


@login_required
@render_to('community/edit.html')
def edit(request, id=''):
    comm = Community.get_by_id(id)
    geojson = comm.geojson if comm else json.dumps({})
    data = {'community': comm.to_dict()} if comm else {}
    return {'KomooNS_data': data, 'geojson': geojson}


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

