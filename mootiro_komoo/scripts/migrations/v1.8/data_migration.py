# -*- coding: utf-8 -*-
from __future__ import unicode_literals
from komoo_resource.models import Resource
from tags.model import COMMON_NAMESPACE
from main.models import GeoRefObject


def migrate_resources():
    for res in Resource.objects.all():
        o = GeoRefObject()
        o.otype = 'resource'
        o.name = res.name
        o.description = res.description
        o.description += res.contact
        o.contact = {}
        o.creator = res.creator
        o.creation_date = res.creation_date
        o.last_editor = res.last_editor
        o.last_update = res.last_update
        o.geometry = res.geometry

        o.save()

        # m2m relations
        o.tags = {
            COMMON_NAMESPACE: [tag.name for tag in res.tags.all()]
        }
        if res.kind:
            o.tags.add(res.kind.name, namespace='resource type')

        for com in res.community.all():
            o.relations.add(com)  # , 'relation type????')

        # investments??
