# -*- coding: utf-8 -*-
import sys
import simplejson as json
import codecs
import logging

logging.basicConfig(format='>> %(message)s', level=logging.DEBUG)


# sequence for CommonObject ids
common_obj_seq = 1

# ContentTypesIndex
contenttypes = {
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
#                fields['content_type'] == contenttypes[type_]:
#
#                 entry['fields']['content_type'] = contenttypes['commonobject']
#                 entry['fields']['object_id'] = new_ref
#     return data


def _set_field_if_exists(obj, fields, name):
    if name in fields.keys():
        obj['fields'][name] = fields[name]


def _del_field_if_exists(fields, name):
    if name in fields.keys():
        del fields[name]


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
                    'geometry': fields['geometry'],
                    'points': fields['points'],
                    'lines': fields['lines'],
                    'polys': fields['polys'],
                    'type': obj_type,
                }
            }

            del fields['geometry']
            del fields['points']
            del fields['lines']
            del fields['polys']
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


def _get_community_ref(data, pk):
    for entry in data:
        if entry['model'] == 'community.community' and \
           entry['pk'] == pk:

            return entry['fields']['commonobject_ptr']
    return None


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
                ref = _get_community_ref(data, comm)
                if ref:
                    comm_refs.append(ref)
            entry['fields']['community'] = comm_refs

    return data


def parse_json_file(file_):
    new_data = {}
    with codecs.open(file_, 'r', 'utf-8') as f:
        data = json.loads(f.read())

        data = migrate_resources(data)
        data = migrate_community(data)

        new_data = json.dumps(data)

    with codecs.open('temp.json', 'w', 'utf-8') as f_:
        f_.write(new_data)


def main():
    parse_json_file(sys.argv[1])


if __name__ == '__main__':
    main()
