# -*- coding: utf-8 -*-
import sys
import simplejson as json
import codecs


base_obj_seq = 1

contenttypes = {
    'resource': 25,
    'baseobject': 54,
}


def get_base_object_seq(data):
    global base_obj_seq
    for entry in data:
        if entry['model'] == 'main.baseobject':
            base_obj_seq += 1

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
#                 entry['fields']['content_type'] = contenttypes['baseobject']
#                 entry['fields']['object_id'] = new_ref
#     return data


def _set_field_if_exists(obj, fields, name):
    if name in fields.keys():
        obj['fields'][name] = fields[name]


def _del_field_if_exists(fields, name):
    if name in fields.keys():
        del fields[name]


def migrate_resource(data):
    global base_obj_seq
    for entry in data:
        if entry['model'] == 'komoo_resource.resource':
            fields = entry['fields']

            base_obj = {
                'pk': base_obj_seq,
                'model': 'main.baseobject',
                'fields': {
                    'geometry': fields['geometry'],
                    'points': fields['points'],
                    'lines': fields['lines'],
                    'polys': fields['polys'],
                    'type': 'resource',
                }
            }
            [_set_field_if_exists(base_obj, fields, fname) for fname in [
                'creator', 'creation_date', 'last_update', 'last_editor']]

            del fields['geometry']
            del fields['points']
            del fields['lines']
            del fields['polys']
            [_del_field_if_exists(fields, fname) for fname in [
                'creator', 'creation_date', 'last_update', 'last_editor']]
            fields['baseobject_ptr'] = base_obj_seq

            # fix references for resource!
            # data = migrate_contenttype_references(data, 'resource',
                        # entry['pk'], base_obj_seq)

            base_obj_seq += 1

            data.append(base_obj)
    return data


def migrate_community(data):
    # baseobject
    #remove slug
    # references
    pass


def parse_json_file(file_):
    new_data = {}
    with codecs.open(file_, 'r', 'utf-8') as f:
        data = json.loads(f.read())

        get_base_object_seq(data)
        data = migrate_resource(data)

        new_data = json.dumps(data)

    with codecs.open('temp.json', 'w', 'utf-8') as f_:
        f_.write(new_data)


def main():
    parse_json_file(sys.argv[1])


if __name__ == '__main__':
    main()
