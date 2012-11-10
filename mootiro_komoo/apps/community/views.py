# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging

from django.contrib.contenttypes.models import ContentType
from django.core.urlresolvers import reverse
from django.shortcuts import get_object_or_404
from django.utils import simplejson
from django.utils.decorators import method_decorator

from ajaxforms import ajax_form
from annoying.decorators import render_to, ajax_request

from authentication.utils import login_required
from community.models import Community
from community.forms import CommunityForm
from main.utils import create_geojson
from main.utils import (BaseView, ViewDetailsMixin, ViewGeojsonMixin,
        AllMethodsMixin, ViewPaginatedListMixin, ViewObjectMixin,
        SearchTagsBaseView, SearchByBaseView)
from projects.models import ProjectRelatedObject

logger = logging.getLogger(__name__)


@ajax_request
def get_name_for(request, id):
    community_name = Community.objects.get(pk=id).name
    return {'name': community_name}


class CommunityView(BaseView):
    model = Community
    object_name = 'community'
    collection_name = 'communities'


class ListView(CommunityView, ViewPaginatedListMixin):
    @method_decorator(render_to('community/list.html'))
    def get(self, request):
        context = super(ListView, self).get(request)
        return context


class AboutView(CommunityView, ViewDetailsMixin):
    @method_decorator(render_to('community/view.html'))
    def get(self, request, id):
        context = super(AboutView, self).get(request, id)
        context['js_module'] = 'community/pages/about'
        return context


class MapView(CommunityView, ViewDetailsMixin, ViewGeojsonMixin):
    @method_decorator(render_to('community/on_map.html'))
    def get(self, request, id):
        context = super(MapView, self).get(request, id)
        context['js_module'] = 'map/pages/map'
        return context


class EditView(CommunityView, AllMethodsMixin):
    @method_decorator(login_required)
    @method_decorator(ajax_form('community/edit.html', CommunityForm))
    def all(self, request, id=None, *args, **kwargs):
        community = get_object_or_404(Community, pk=id) if id else Community()

        geojson = create_geojson([community], convert=False)
        if geojson and geojson.get('features'):
            geojson['features'][0]['properties']['userCanEdit'] = True
        geojson = simplejson.dumps(geojson)

        def on_get(request, form_community):
            return CommunityForm(instance=community)

        def on_after_save(request, obj):
            return {'redirect': obj.view_url}

        return {'on_get': on_get, 'on_after_save': on_after_save,
                'community': community, 'geojson': geojson}


class NewView(CommunityView, AllMethodsMixin):
    @method_decorator(login_required)
    @method_decorator(ajax_form('community/edit_ajax.html', CommunityForm))
    def all(self, request, *args, **kwargs):
        def on_get(request, form_community):
            form_community.helper.form_action = reverse('new_community')
            return form_community

        def on_after_save(request, obj):
            return {'redirect': obj.view_url}

        return {'on_get': on_get, 'on_after_save': on_after_save}


class ProjectsView(CommunityView, ViewObjectMixin):
    @method_decorator(ajax_request)
    def get_json(self, request, id):
        obj = self.get_object(id)
        ct = ContentType.objects.get_for_model(obj)
        return {'results': [p.project.as_dict for p in
            ProjectRelatedObject.objects.filter(content_type=ct,
                                                object_id=obj.id)]}


class SearchTagsView(CommunityView, SearchTagsBaseView):
    pass


class SearchByNameView(CommunityView, SearchByBaseView):
    pass
