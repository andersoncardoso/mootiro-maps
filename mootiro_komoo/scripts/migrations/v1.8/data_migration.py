# -*- coding: utf-8 -*-
from komoo_resource.models import Resource, Resource_CO
from need.models import Need, Need_CO
from tags.models import COMMON_NAMESPACE
# from main.models import GeoRefObject


contact_info = u"""
###Contato:

{}

"""


def migrate_resources():
    for res in Resource.objects.all():
        o = Resource_CO()
        # o = GeoRefObject()
        # o.otype = 'resource'
        o.name = res.name
        o.description = getattr(res, 'description', '')
        contact = getattr(res, 'contact', '')
        if contact:
            o.description += contact_info.format(contact)
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
            o.tags.add(res.kind.name, namespace='Tipo de Recurso')

        for com in res.community.all():
            o.relations.add(com)  # , 'relation type????')

        for inv in res.investments.all():
            o.relations.add(inv)  # , 'relation type????')


def migrate_needs():
    for need in Need.objects.all():
        o = Need_CO()
        o.name = need.name
        o.description = getattr(need, 'description', '')
        # contact = getattr(need, 'contact', '')
        # if contact:
        #     o.description += contact_info.format(contact)
        # short description ??
        o.contact = {}
        o.creator = need.creator
        o.creation_date = need.creation_date
        o.last_editor = need.last_editor
        o.last_update = need.last_update
        o.geometry = need.geometry

        o.save()

        # m2m relations
        o.tags = {
            COMMON_NAMESPACE: [tag.name for tag in need.tags.all()],

        }
        for cat in need.categories.all():
            o.tags.add(cat.name, namespace='Tipo de Necessidade')

        for ta in need.target_audiences.all():
            o.tags.add(ta.name, namespace=u'Público Alvo')

        for com in need.community.all():
            o.relations.add(com)  # , 'relation type????')


# migrate_resources()
migrate_needs()
