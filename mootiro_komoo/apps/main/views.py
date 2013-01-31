#!/usr/bin/env python
# -*- coding: utf-8 -*-
from __future__ import unicode_literals  # unicode by default

import json
import logging
from smtplib import SMTPException

from django.contrib.gis.geos import Polygon, Point
from django.contrib.gis.measure import Distance
from django.template import loader, Context
from django.db.models import Q
from django.http import HttpResponse, HttpResponseNotFound
# from django.core.urlresolvers import reverse
from django.core.mail import mail_admins
from django.utils.translation import ugettext as _
from django.conf import settings

from annoying.decorators import render_to, ajax_request
# import requests

# from authentication.models import User
from regions.models import Region
# from need.models import Need
# from proposal.models import Proposal
# from organization.models import OrganizationBranch, Organization
from resources.models import Resource
# from investment.models import Investment
# from projects.models import Project
from main.utils import create_geojson, ResourceHandler


logger = logging.getLogger(__name__)


# ENTITY_MODEL = {
#     'c': Community,
#     'n': Need,
#     'p': Proposal,
#     'o': Organization,
#     'b': OrganizationBranch,
#     'r': Resource,
#     'i': Investment,
#     'j': Project,
#     'u': User,
# }
# ENTITY_MODEL_REV = {v: k for k, v in ENTITY_MODEL.items()}


@render_to('main/root.html')
def map(request, *args, **kwargs):
    return {}


@render_to('main/root.html')
def root(request):
    return {}


def _fetch_geo_objects(Q, zoom):
    ret = {}
    # for model in [Community, Need, Resource, OrganizationBranch]:
    for model in [Region, Resource]:
        ret[model.__name__] = model.objects.filter(Q)
    return ret


#@cache_page(54000)
def get_geojson(request):
    bounds = request.GET.get('bounds', None)
    zoom = int(request.GET.get('zoom', 13))
    x1, y2, x2, y1 = [float(i) for i in bounds.split(',')]
    polygon = Polygon(((x1, y1), (x1, y2), (x2, y2), (x2, y1), (x1, y1)))

    intersects_polygon = (Q(points__intersects=polygon) |
                          Q(lines__intersects=polygon) |
                          Q(polys__intersects=polygon))

    d = _fetch_geo_objects(intersects_polygon, zoom)
    l = []
    for objs in d.values():
        l.extend(objs)
    geojson = create_geojson(l)
    return HttpResponse(json.dumps(geojson),
        mimetype="application/x-javascript")


@render_to("main/filter_results.html")
def radial_search(request):
    center = Point(*[float(i) for i in request.GET['center'].split(',')])
    radius = Distance(m=float(request.GET['radius']))

    distance_query = (Q(points__distance_lte=(center, radius)) |
                      Q(lines__distance_lte=(center, radius)) |
                      Q(polys__distance_lte=(center, radius)))

    objs = _fetch_geo_objects(distance_query, 100)
    d = {}
    if 'regions' in request.GET:
        d['Region'] = objs['Region']
    if 'needs' in request.GET:
        need_categories = request.GET['need_categories'].split(',')
        d['Need'] = []
        for n in objs['Need']:
            if [c for c in n.categories.all() if str(c.id) in need_categories]:
                d['Need'].append(n)
    if 'organizations' in request.GET:
        d['OrganizationBranch'] = objs['OrganizationBranch']
    if 'resources' in request.GET:
        d['Resource'] = objs['Resource']

    return d


# @ajax_request
# def komoo_search(request):
#     """
#     search view for the index page.
#     It uses the parameters from the 'queries' dict to perform specific
#     queries on the database
#     """
#     logger.debug('Komoo_search: {}'.format(request.POST))
#     term = request.POST.get('term', '')
#
#     result = {}
#     # Google search
#     google_results = requests.get(
#         'https://maps.googleapis.com/maps/api/place/autocomplete/json',
#         params={
#             'input': term,
#             'sensor': 'false',
#             'types': 'geocode',
#             'key': 'AIzaSyDgx2Gr0QeIASfirdAUoA0jjOs80fGtBYM',
#             # TODO: move to settings
#         })
#     result['google'] = google_results.content
#     return {'result': result}


@ajax_request
def send_error_report(request):
    user = request.user
    user_message = request.POST.get('message', '')
    info = request.POST.get('info', '')
    url = request.POST.get('url', '')

    message = _("""
Url: {0}
Reporter: {1} (id: {2}, email: {3})
Info: {4}
Message: {5}
    """).format(url, user, user.id, user.email, info, user_message)

    try:
        mail_admins(_('Error report'), message, fail_silently=False)
        status = 'sent'
        success = 'true'
    except SMTPException:
        status = 'failed'
        success = 'false'
    finally:
        return {'status': status, 'success': success}


@render_to('404.html')
def test_404(request):
    return {}


@render_to('500.html')
def test_500(request):
    return {}


def custom_404(request):
    t = loader.get_template('404.html')
    c = Context({'request_path': request.path, 'STATIC_URL': '/static/'})
    return HttpResponseNotFound(t.render(c))


@render_to('500.html')
def custom_500(request):
    return {}


if settings.TESTING:

    class TestResourceHandler(ResourceHandler):
        """This is only a dummy handler used for testing"""

        def get(self, request):
            return HttpResponse('Resource::GET')

        def post(self, request):
            return HttpResponse('Resource::POST')

        def put(self, request):
            return HttpResponse('Resource::PUT')

        def delete(self, request):
            return HttpResponse('Resource::DELETE')
