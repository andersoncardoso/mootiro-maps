# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from django.shortcuts import HttpResponse, redirect
from django.db.models.query_utils import Q
from django.utils import simplejson

from annoying.decorators import render_to
from annoying.functions import get_object_or_None
from authentication.utils import login_required

from common_objects.models import Organization
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


@login_required
def new_organization_from_map(request, *arg, **kwargs):
    return redirect("/objects/new_from_map?type=organization", permanent=True)


@login_required
def edit(request, id=None, *arg, **kwargs):
    url = "/objects/%s/edit" % id if id else "/objects/new"
    return redirect(url, permanent=True)


# USED ANYWHERE??
def search_by_name(request):
    term = request.GET.get('term', '')
    orgs = Organization.objects.filter(Q(name__icontains=term))
    d = [{'value': o.id, 'label': o.name} for o in orgs]
    return HttpResponse(simplejson.dumps(d),
        mimetype="application/x-javascript")


