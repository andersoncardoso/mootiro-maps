#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

import json
import logging

from django.core.urlresolvers import reverse
from django.db.models import Q
from django.http import HttpResponse
from django.shortcuts import get_object_or_404
from django.contrib.gis.geos import Polygon

from annoying.decorators import render_to
from ajaxforms import ajax_form

from authentication.utils import login_required
from need.models import Need_CO as Need
from need.forms import NeedFormGeoRef
from main.utils import (create_geojson, paginated_query, sorted_query,
                        filtered_query)

logger = logging.getLogger(__name__)


@render_to('need/list.html')
def list(request):
    sort_fields = ['creation_date', 'name']

    query_set = filtered_query(Need.objects, request)
    needs = sorted_query(query_set, sort_fields, request)
    needs_count = needs.count()
    needs = paginated_query(needs, request=request)
    return dict(needs=needs, needs_count=needs_count)


@render_to('need/view.html')
def view(request, id=None):
    need = get_object_or_404(Need, pk=id)
    geojson = need.geojson
    return dict(need=need, geojson=geojson)


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
@render_to('need/edit.html')
def edit(request, id=None):
    need = Need.get_by_id(id)
    geojson = need.geojson if need else json.dumps({})

    data = {'need': need.to_dict()} if need else {}
    return {'KomooNS_data': data, 'geojson': geojson}


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

