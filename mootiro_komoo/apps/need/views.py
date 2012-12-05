# # -*- coding: utf-8 -*-
# from __future__ import unicode_literals  # unicode by default
# import logging
# 
# from django.core.urlresolvers import reverse
# from django.http import HttpResponse
# from django.shortcuts import get_object_or_404
# from django.utils import simplejson
# from django.utils.decorators import method_decorator
# 
# from annoying.decorators import render_to
# 
# from authentication.utils import login_required
# from main.utils import create_geojson
# from main.utils import (BaseView, ViewDetailsMixin, ViewGeojsonMixin,
#         AllMethodsMixin, ViewPaginatedListMixin)
# from need.forms import NeedForm, NeedFormGeoRef
# from need.models import Need, TargetAudience
# 
# logger = logging.getLogger(__name__)
# 
# 
# class NeedView(BaseView):
#     model = Need
#     object_name = 'need'
#     collection_name = 'needs'
# 
# 
# class ListView(NeedView, ViewPaginatedListMixin):
#     sort_order = ['creation_date', 'title']
#     default_order = 'title'
# 
#     @method_decorator(render_to('need/list.html'))
#     def get(self, request):
#         context = super(ListView, self).get(request)
#         return context
# 
# 
# class AboutView(NeedView, ViewDetailsMixin, ViewGeojsonMixin):
#     @method_decorator(render_to('need/view.html'))
#     def get(self, request, id):
#         context = super(AboutView, self).get(request, id)
#         #context['js_module'] = 'need/pages/about'
#         return context
# 
# 
# class EditView(NeedView, AllMethodsMixin):
#     @method_decorator(login_required)
#     def all(self, request, id='', *arg, **kwargs):
#         need = get_object_or_404(Need, pk=id)
# 
#         geojson = create_geojson([need], convert=False)
#         if geojson and geojson.get('features'):
#             geojson['features'][0]['properties']['userCanEdit'] = True
#         geojson = simplejson.dumps(geojson)
# 
#         def on_get(request, form):
#             form = NeedFormGeoRef(instance=need)
#             form.helper.form_action = reverse('new_need')
#             return form
# 
#         def on_after_save(request, need):
#             redirect_url = reverse('view_need', kwargs={'id': need.pk})
#             return {'redirect': redirect_url}
# 
#         return {'on_get': on_get, 'on_after_save': on_after_save,
#                 'geojson': geojson, 'need': need}
# 
# 
# class NewView(NeedView, AllMethodsMixin):
#     @method_decorator(login_required)
#     def all(self, request, *arg, **kwargs):
#         geojson = {}
#         need = None
# 
#         def on_get(request, form):
#             form.helper.form_action = reverse('new_need')
#             return form
# 
#         def on_after_save(request, need):
#             redirect_url = reverse('view_need', kwargs={'id': need.id})
#             return {'redirect': redirect_url}
# 
#         return {'on_get': on_get, 'on_after_save': on_after_save,
#                 'geojson': geojson, 'need': need}
# 
# 
# class NewFromMapView(NeedView, AllMethodsMixin):
#     @method_decorator(login_required)
#     def all(self, request, *arg, **kwargs):
#         geojson, need = {}, None
# 
#         def on_get(request, form):
#             form.helper.form_action = reverse('new_need_from_map')
#             return form
# 
#         def on_after_save(request, need):
#             redirect_url = reverse('view_need', kwargs={'id': need.id})
#             return {'redirect': redirect_url}
# 
#         return {'on_get': on_get, 'on_after_save': on_after_save,
#                 'geojson': geojson, 'need': need}
# 
# 
# class SearchTargetAudienceView(NeedView):
#     def get(self, request):
#         term = request.GET['term']
#         qset = TargetAudience.objects.filter(name__istartswith=term)
#         target_audiences = [ta.name for ta in qset]
#         return HttpResponse(simplejson.dumps(target_audiences),
#                     mimetype="application/json")
