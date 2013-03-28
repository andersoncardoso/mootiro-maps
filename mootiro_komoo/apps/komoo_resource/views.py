# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging
import json

from django.shortcuts import HttpResponse, get_object_or_404, redirect
from django.utils import simplejson
from django.core.urlresolvers import reverse

from annoying.decorators import render_to
from annoying.functions import get_object_or_None
from ajaxforms import ajax_form

from authentication.utils import login_required
from komoo_resource.models import Resource_CO as Resource
from komoo_resource.forms import FormResourceGeoRef
from main.utils import (create_geojson, paginated_query, sorted_query,
                        filtered_query)


logger = logging.getLogger(__name__)


def resources_to_resource(self):
    return redirect(reverse('resource_list'), permanent=True)


@render_to('resource/list.html')
def resource_list(request):
    sort_order = ['creation_date', 'name']

    query_set = filtered_query(Resource.objects, request)

    resources_list = sorted_query(query_set, sort_order, request)
    resources_count = resources_list.count()
    resources = paginated_query(resources_list, request)

    return dict(resources=resources, resources_count=resources_count)


@render_to('resource/show.html')
def show(request, id=None):
    resource = get_object_or_404(Resource, pk=id)
    geojson = resource.geojson
    similar = []

    return dict(resource=resource, similar=similar, geojson=geojson)


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
@render_to('resource/edit.html')
def edit(request, id=None, *arg, **kwargs):
    resource = get_object_or_None(Resource, pk=id)
    # geojson = create_geojson([resource], convert=False)

    # if geojson and geojson.get('features'):
    #     geojson['features'][0]['properties']['userCanEdit'] = True
    # geojson = json.dumps(geojson)
    if resource:
        geojson = resource.geojson
    else:
        geojson = json.dumps({})

    data = {}
    if resource:
        data['resource'] = resource.to_dict()

    return {'KomooNS_data': data, 'geojson': geojson}


# DEPRECATED
def search_by_kind(request):
    # term = request.GET.get('term', '')
    # kinds = ResourceKind.objects.filter(Q(name__icontains=term) |
        # Q(slug__icontains=term))
    kinds = []
    d = [{'value': k.id, 'label': k.name} for k in kinds]
    return HttpResponse(simplejson.dumps(d),
        mimetype="application/x-javascript")


@render_to('komoo_map/show.html')
def show_on_map(request, geojson=''):
    resource = get_object_or_404(Resource, pk=request.GET.get('id', ''))
    geojson = create_geojson([resource])
    return dict(geojson=geojson)

