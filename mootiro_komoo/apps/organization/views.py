# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from django.shortcuts import HttpResponse, redirect
from django.db.models.query_utils import Q
from django.utils import simplejson
from django.core.urlresolvers import reverse

from annoying.decorators import render_to
from annoying.functions import get_object_or_None
from ajaxforms import ajax_form
from authentication.utils import login_required

from common_objects.models import Organization
from organization.forms import FormOrganizationGeoRef
from main.utils import create_geojson

logger = logging.getLogger(__name__)


def organization_list(request):
    return redirect('/objects?type=organization', permanent=True)


def show(request, id=''):
    return redirect('/objects/%s' % id, permanent=True)


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
def edit(request, id=None, *arg, **kwargs):
    if id:
        return redirect('/objects/%s/edit' % id, permanent=True)
    else:
        return redirect('/objects/new', permanent=True)


# USED ANYWHERE
def search_by_name(request):
    term = request.GET.get('term', '')
    orgs = Organization.objects.filter(Q(name__icontains=term))
    d = [{'value': o.id, 'label': o.name} for o in orgs]
    return HttpResponse(simplejson.dumps(d),
        mimetype="application/x-javascript")


