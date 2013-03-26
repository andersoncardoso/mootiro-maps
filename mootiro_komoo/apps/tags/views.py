# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import HttpResponse
from django.utils import simplejson

from .models import TagNamespace
from .models import Tag


def search_namespace(request):
    term = request.GET['term']
    qset = TagNamespace.objects.filter(name__icontains=term)
    tags = [t.name for t in qset]
    return HttpResponse(simplejson.dumps(tags),
                mimetype="application/x-javascript")


def search_tags(request):
    term = request.GET['term']
    namespace = request.GET.get('namespace', '')

    if namespace:
        qset = Tag.objects.filter(namespace__name=namespace)
    else:
        qset = Tag.objects
    qset = qset.filter(name__icontains=term)
    tags = [t.name for t in qset]
    return HttpResponse(simplejson.dumps(tags),
                mimetype="application/x-javascript")
