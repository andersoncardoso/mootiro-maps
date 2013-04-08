# -*- coding: utf-8 -*-
from komoo_resource.models import Resource, Resource_CO
from need.models import Need, Need_CO
from community.models import Community, Community_CO
from tags.models import COMMON_NAMESPACE


contact_info = u"""
###Contato:

{}

"""


def _migrate_common_data(model, model_co, _extras=None):
    for orig in model.objects.all():
        new = model_co()
        new.name = orig.name
        new.description = getattr(orig, 'description', '')
        contact = getattr(orig, 'contact', '')
        if contact:
            new.description += contact_info.format(contact)
        # short description ??
        new.contact = {}
        new.creator = orig.creator
        new.creation_date = orig.creation_date
        new.last_editor = orig.last_editor
        new.last_update = orig.last_update
        new.geometry = orig.geometry

        new.save()

        # m2m relations
        new.tags = {
            COMMON_NAMESPACE: [tag.name for tag in orig.tags.all()],

        }

        if _extras:
            _extras(new, orig)


def migrate_resources():
    print 'migrating Resources'

    def _resource_extras(o, res):
        if res.kind:
            o.tags.add(res.kind.name, namespace='Tipo de Recurso')

        for com in res.community.all():
            o.relations.add(com)  # , 'relation type????')

        for inv in res.investments.all():
            o.relations.add(inv)  # , 'relation type????')

        _migrate_common_data(Resource, Resource_CO, _resource_extras)


def migrate_needs():
    print 'migrating Needs'

    def _need_extras(o, need):
        for cat in need.categories.all():
            o.tags.add(cat.name, namespace='Tipo de Necessidade')

        for ta in need.target_audiences.all():
            o.tags.add(ta.name, namespace=u'Público Alvo')

        for com in need.community.all():
            o.relations.add(com)  # , 'relation type????')

    _migrate_common_data(Need, Need_CO, _need_extras)


def migrate_communities():
    print 'migrating Communities'

    _migrate_common_data(Community, Community_CO)


def migrate_all():
    migrate_resources()
    migrate_needs()
    migrate_communities()
