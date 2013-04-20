# -*- coding: utf-8 -*-
from komoo_resource.models import Resource
from need.models import Need
from community.models import Community
from organization.models import Organization
from proposal.models import Proposal

from tags.models import COMMON_NAMESPACE

from common_objects.models import Community as Community_CO
from common_objects.models import Need as Need_CO
from common_objects.models import Resource as Resource_CO
from common_objects.models import Organization as Organization_CO
from common_objects.models import Proposal as Proposal_CO


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
        short_desc = getattr(orig, 'short_description', '')
        if short_desc:
            new.short_description = short_desc
        new.contact = {}
        new.creator = orig.creator
        new.creation_date = orig.creation_date
        new.last_editor = orig.last_editor
        new.last_update = orig.last_update
        new.geometry = orig.geometry

        new.save()

        # m2m relations
        if hasattr(orig, "tags"):
            new.tags = {
                COMMON_NAMESPACE: [tag.name for tag in orig.tags.all()],

            }

        if _extras:
            _extras(new, orig)


def migrate_resources():
    print("migrating Resources")

    def _resource_extras(o, res):
        if res.kind:
            o.tags.add(res.kind.name, namespace='Tipo de Recurso')

        for com in res.community.all():
            o.relations.add(com)  # , 'relation type????')

        for inv in res.investments.all():
            o.relations.add(inv)  # , 'relation type????')

        _migrate_common_data(Resource, Resource_CO, _resource_extras)


def migrate_needs():
    print("migrating Needs")

    def _need_extras(o, need):
        for cat in need.categories.all():
            o.tags.add(cat.name, namespace='Tipo de Necessidade')

        for ta in need.target_audiences.all():
            o.tags.add(ta.name, namespace=u'Público Alvo')

        for com in need.community.all():
            o.relations.add(com)  # , 'relation type????')

    _migrate_common_data(Need, Need_CO, _need_extras)


def migrate_communities():
    print("migrating Communities")

    _migrate_common_data(Community, Community_CO)


def migrate_organizations():
    print("migrating Organizations")

    def _organization_extras(new, orig):
        for ta in orig.target_audiences.all():
            new.tags.add(ta.name, namespace=u'Público Alvo')

        for com in orig.community.all():
            new.relations.add(com)  # , 'relation type????')

        new.contact['website'] = orig.link

        for cat in orig.categories.all():
            new.tags.add(
                    cat.get_translated_name(lang='pt-br'),
                    namespace=u'Tipo de Organização')

        for inv in orig.investments.all():
            new.relations.add(inv)  # , 'relation type????')

        # logo ????

    _migrate_common_data(Organization, Organization_CO, _organization_extras)


def migrate_proposals():
    print("migrating Proposals")

    def _proposal_extras(new, orig):
        if orig.need:
            orig.need.table_ref = "need.Need"
            new.relations.add(orig.need)  # relation type???
        new.extra_data = {'cost': orig.cost}
        for inv in orig.investments.all():
            new.relations.add(inv)  # , 'relation type????')

    _migrate_common_data(Proposal, Proposal_CO, _proposal_extras)


def migrate_all():
    migrate_resources()
    migrate_needs()
    migrate_communities()
    migrate_organizations()
    migrate_proposals()
