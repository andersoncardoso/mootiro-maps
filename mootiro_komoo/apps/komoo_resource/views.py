# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import logging
from django.views.generic import View
from django.db.models.query_utils import Q
from django.shortcuts import (render_to_response, RequestContext, HttpResponse,
        HttpResponseRedirect, get_object_or_404)
from django.utils import simplejson
from django.utils.decorators import method_decorator
from django.contrib.auth.decorators import login_required
from django.core.urlresolvers import reverse
from annoying.decorators import render_to
from taggit.models import TaggedItem
from komoo_resource.models import Resource, ResourceKind
from komoo_resource.forms import FormResource


logger = logging.getLogger(__name__)


@render_to('resource/list.html')
def resource_list(request):
    logger.debug('acessing komoo_resource > list')
    resources = Resource.objects.all()
    return dict(resources=resources)


@render_to('resource/show.html')
def show(request, id=None):
    logger.debug('acessing komoo_resource > show')
    resource = get_object_or_404(Resource, pk=id)
    similar = Resource.objects.filter(Q(kind=resource.kind) |
        Q(tags__in=resource.tags.all())).exclude(pk=resource.id)[:5]
    return dict(resource=resource, similar=similar)


class Edit(View):
    """ Class based view for editing a Resource """

    @method_decorator(login_required)
    def get(self, request, *args, **kwargs):
        logger.debug('acessing komoo_resource > Edit with GET')
        if request.GET.get('id', None):
            resource = get_object_or_404(Resource, pk=request.GET['id'])
            form_resource = FormResource(instance=resource)
        else:
            form_resource = FormResource()
        return render_to_response('resource/edit.html',
            dict(form_resource=form_resource),
            context_instance=RequestContext(request))

    def post(self, request, *args, **kwargs):
        logger.debug('acessing komoo_resource > Edit with POST\n'
                     'request : {}'.format(request.POST))
        if request.POST.get('id', None):
            resource = get_object_or_404(Resource, pk=request.POST['id'])
            form_resource = FormResource(request.POST, instance=resource)
        else:
            form_resource = FormResource(request.POST)
        if form_resource.is_valid():
            resource = form_resource.save(user=request.user)
            return render_to_response('resource/edit.html'.format(resource.id),
                dict(redirect=reverse('resource_view', args=(resource.id,))),
                context_instance=RequestContext(request))
        else:
            logger.debug('Form erros: {}'.format(dict(form_resource.__errors)))
            return render_to_response('resource/edit.html',
                dict(form_resource=form_resource),
                context_instance=RequestContext(request))


def search_by_kind(request):
    logger.debug('acessing komoo_resource > search_by_kind')
    term = request.GET.get('term', '')
    kinds = ResourceKind.objects.filter(Q(name__icontains=term) |
        Q(slug__icontains=term))
    d = [{'value': k.id, 'label': k.name} for k in kinds]
    return HttpResponse(simplejson.dumps(d),
        mimetype="application/x-javascript")


def search_by_tag(request):
    logger.debug('acessing resource > search_by_tag')
    term = request.GET['term']
    qset = TaggedItem.tags_for(Resource).filter(name__istartswith=term)
    tags = [t.name for t in qset]
    return HttpResponse(simplejson.dumps(tags),
                mimetype="application/x-javascript")
