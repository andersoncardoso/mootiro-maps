# -*- coding: utf-8 -*-
import sys
import simplejson as json
import codecs
import logging

logging.basicConfig(format='>> %(message)s', level=logging.DEBUG)


# sequence for CommonObject ids
common_obj_seq = 1

# ContentTypesIndex
cttypes = {
    'resource': 25,
    'commonobject': 54,
}


# def migrate_contenttype_references(data, type_, old_id, new_ref):
#     apps_with_cttype = [
#         'discussion.discussion',
#         'investment.investor',
#         'komoo_comments.comment',
#         'komoo_project.projectrelatedobject',
#         'moderation.moderation',
#         'signatures.signature',
#         'signatures.digest',
#         'fileupload.uploadedfile',
#     ]
#     for entry in data:
#         if entry['model'] in apps_with_cttype:
#             fields = entry['fields']
#             if fields['object_id'] == old_id and \
#                fields['content_type'] == cttypes[type_]:
#
#                 entry['fields']['content_type'] = cttypes['commonobject']
#                 entry['fields']['object_id'] = new_ref
#     return data

def _set_field_if_exists(obj, fields, name):
    if name in fields.keys():
        obj['fields'][name] = fields[name]


def _del_field_if_exists(fields, name):
    if name in fields.keys():
        del fields[name]


def _get_ref_for(type_, data, pk):
    for entry in data:
        if entry['model'] == type_ and \
           entry['pk'] == pk:

            return entry['fields']['commonobject_ptr']
    return None


def _migrate_app_to_common_object(data, obj_type, model):
    logging.info('Migrating {} to CommonObject'.format(obj_type))
    global common_obj_seq
    for entry in data:
        if entry['model'] == model:
            fields = entry['fields']

            common_obj = {
                'pk': common_obj_seq,
                'model': 'main.commonobject',
                'fields': {
                    'geometry': fields.get('geometry', None),
                    'points': fields.get('points', None),
                    'lines': fields.get('lines', None),
                    'polys': fields.get('polys', None),
                    'type': obj_type,
                }
            }

            _del_field_if_exists(fields, 'geometry')
            _del_field_if_exists(fields, 'points')
            _del_field_if_exists(fields, 'lines')
            _del_field_if_exists(fields, 'polys')
            _del_field_if_exists(fields, 'slug')
            fields['commonobject_ptr'] = common_obj_seq

            # references????

            common_obj_seq += 1
            data.append(common_obj)
    return data


def migrate_resources(data):
    logging.info('Migrating Resources')

    data = _migrate_app_to_common_object(data,
                'resource', 'komoo_resource.resource')
    for entry in data:
        if entry['model'] == 'komoo_resource.resource':
            entry['model'] = 'resources.resource'

        elif entry['model'] == 'komoo_resource.resourcekind':
            entry['model'] = 'resources.resourcekind'
            del entry['fields']['slug']
    return data


def migrate_community(data):
    logging.info('Migrating Community')
    data = _migrate_app_to_common_object(data,
                'community', 'community.community')

    apps_with_reference_for_community = [
            'need.need', 'resources.resource', 'komoo_project.project',
            'organization.organizationbranch', 'organization.organization']
    for entry in data:
        if entry['model'] in apps_with_reference_for_community:
            comm_refs = []
            for comm in entry['fields']['community']:
                ref = _get_ref_for('community.community', data, comm)
                if ref:
                    comm_refs.append(ref)
            entry['fields']['community'] = comm_refs

    return data


def migrate_need(data):
    logging.info('Migrating Need')
    data = _migrate_app_to_common_object(data, 'need', 'need.need')

    for entry in data:
        if entry['model'] == 'need.need':
            f = entry['fields']

            f['name'] = f['title'][:]

            comm_refs = []
            for comm in f['community']:
                ref = _get_ref_for('community.community', data, comm)
                if ref:
                    comm_refs.append(ref)
            f['community'] = comm_refs

            del f['title']
            _del_field_if_exists(f, 'slug')
        # refs ? relations ?
    return data


def migrate_proposal(data):
    logging.info('Migrating Proposal')

    for entry in data:
        if entry['model'] == 'proposal.proposal':
            f = entry['fields']

            f['name'] = f['title'][:]
            n = _get_ref_for('need.need', data, f['need'])
            if n:
                f['need'] = n

            _del_field_if_exists(f, 'number')
            _del_field_if_exists(f, 'title')
            _del_field_if_exists(f, 'realizers')

            #refs? relations?
    return data


def parse_json_file(file_):
    new_data = {}
    with codecs.open(file_, 'r', 'utf-8') as f:
        data = json.loads(f.read())

        data = migrate_resources(data)
        data = migrate_community(data)
        data = migrate_need(data)
        data = migrate_proposal(data)

        new_data = json.dumps(data)

    with codecs.open('temp.json', 'w', 'utf-8') as f_:
        f_.write(new_data)


def main():
    parse_json_file(sys.argv[1])


if __name__ == '__main__':
    main()
