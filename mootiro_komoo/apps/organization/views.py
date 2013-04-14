# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging
import json

from django.shortcuts import HttpResponse
from django.shortcuts import get_object_or_404
from django.db.models.query_utils import Q
from django.utils import simplejson
from django.core.urlresolvers import reverse

from annoying.decorators import render_to
from annoying.functions import get_object_or_None
from ajaxforms import ajax_form
from authentication.utils import login_required

from organization.models import Organization_CO as Organization
from organization.forms import FormOrganizationGeoRef
from main.utils import (paginated_query, create_geojson, sorted_query,
                        filtered_query)

logger = logging.getLogger(__name__)


@render_to('organization/list.html')
def organization_list(request):
    org_sort_order = ['creation_date', 'name']

    query_set = filtered_query(Organization.objects, request)
    organizations_list = sorted_query(query_set, org_sort_order,
                                         request)
    organizations_count = organizations_list.count()
    organizations = paginated_query(organizations_list, request)
    return dict(organizations=organizations,
                organizations_count=organizations_count)


@render_to('organization/show.html')
def show(request, id=''):
    organization = get_object_or_404(Organization, pk=id)
    geojson = organization.geojson
    return dict(organization=organization, geojson=geojson)


@render_to('organization/related_items.html')
def related_items(request, id=''):
    organization = get_object_or_None(Organization, pk=id) or Organization()
    geojson = create_geojson(organization.related_items)
    return {'organization': organization, 'geojson': geojson}


# DEPRECATED
@login_required
@ajax_form('organization/new_frommap.html', FormOrganizationGeoRef,
           'form_organization')
def new_organization_from_map(request, *arg, **kwargs):

    def on_get(request, form):
        form.helper.form_action = reverse('new_organization_from_map')
        return form

    def on_after_save(request, obj):
        return {'redirect': obj.view_url}

    return {'on_get': on_get, 'on_after_save': on_after_save}


@login_required
@render_to('organization/edit.html')
def edit(request, id=None, *arg, **kwargs):
    organization = Organization.get_by_id(id)
    geojson = organization.geojson if organization else json.dumps({})
    data = {'organization': organization.to_dict()} if organization else {}
    return {'KomooNS_data': data, 'geojson': geojson}


# USED ANYWHERE
def search_by_name(request):
    term = request.GET.get('term', '')
    orgs = Organization.objects.filter(Q(name__icontains=term))
    d = [{'value': o.id, 'label': o.name} for o in orgs]
    return HttpResponse(simplejson.dumps(d),
        mimetype="application/x-javascript")


