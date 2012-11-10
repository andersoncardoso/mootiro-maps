# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from django.core.urlresolvers import reverse
from django.db.models.query_utils import Q
from django.shortcuts import redirect
from django.utils import simplejson
from django.utils.decorators import method_decorator

from ajaxforms import ajax_form
from annoying.decorators import render_to
from annoying.functions import get_object_or_None

from authentication.utils import login_required
from main.utils import create_geojson
from main.utils import (BaseView, ViewDetailsMixin, ViewGeojsonMixin,
        AllMethodsMixin, ViewPaginatedListMixin, SearchTagsBaseView,
        SearchByBaseView)
from resources.forms import FormResource, FormResourceGeoRef
from resources.models import Resource, ResourceKind

logger = logging.getLogger(__name__)


def resources_to_resource(self):
    return redirect(reverse('resource_list'), permanent=True)


class ResourceView(BaseView):
    model = Resource
    object_name = 'resource'
    collection_name = 'resources'


class ListView(ResourceView, ViewPaginatedListMixin):
    @method_decorator(render_to('resource/list.html'))
    def get(self, request):
        context = super(ListView, self).get(request)
        return context


class AboutView(ResourceView, ViewDetailsMixin, ViewGeojsonMixin):
    @method_decorator(render_to('resource/view.html'))
    def get(self, request, id):
        context = super(AboutView, self).get(request, id)
        #context['js_module'] = 'resource/pages/about'
        return context


class EditView(ResourceView, AllMethodsMixin):
    @method_decorator(login_required)
    @method_decorator(ajax_form('resource/edit.html', FormResourceGeoRef,
        'form_resource'))
    def all(self, request, id='', *arg, **kwargs):
        resource = get_object_or_None(Resource, pk=id)
        geojson = create_geojson([resource], convert=False)

        if geojson and geojson.get('features'):
            geojson['features'][0]['properties']['userCanEdit'] = True
        geojson = simplejson.dumps(geojson)

        def on_get(request, form):
            form = FormResourceGeoRef(instance=resource)
            form.helper.form_action = reverse('edit_resource',
                                              kwargs={'id': id})

            return form

        def on_after_save(request, obj):
            return {'redirect': obj.view_url}

        return {'on_get': on_get, 'on_after_save': on_after_save,
                'geojson': geojson, 'resource': resource}


class NewView(ResourceView, AllMethodsMixin):
    @method_decorator(login_required)
    @method_decorator(ajax_form('resource/new.html', FormResource,
        'form_resource'))
    def all(self, request, *arg, **kwargs):
        def on_get(request, form_resource):
            form_resource.helper.form_action = reverse('new_resource')
            return form_resource

        def on_after_save(request, obj):
            return {'redirect': obj.view_url}

        return {'on_get': on_get, 'on_after_save': on_after_save}


class NewFromMapView(ResourceView, AllMethodsMixin):
    @method_decorator(login_required)
    @method_decorator(ajax_form('resource/new_frommap.html',
        FormResourceGeoRef, 'form_resource'))
    def all(self, request, *arg, **kwargs):
        def on_get(request, form_resource):
            form_resource.helper.form_action = reverse('new_resource_from_map')
            return form_resource

        def on_after_save(request, obj):
            return {'redirect': obj.view_url}

        return {'on_get': on_get, 'on_after_save': on_after_save}


class SearchTagsView(ResourceView, SearchTagsBaseView):
    pass


class SearchByKindView(SearchByBaseView):
    model = ResourceKind
