# -*- coding: utf-8 -*-
from django.db import models
from django.db.models import Q
from django.utils.translation import ugettext as _
from django.core.paginator import Paginator
from jsonfield import JSONField

from bson.objectid import ObjectId
from authentication.models import User
from komoo_map.models import GeoRefModel
from tags.models import TagField, EMPTY_TAG
from search.signals import index_object_for_search

from .utils import build_obj_from_dict, get_model_from_table_ref
from .relations import RELATIONS
from .mixins import BaseModel


# =============================================================================
#  Generic Relations
#

class GenericRef(BaseModel):
    """ Generic Ref used for the GenericRelation Table """
    obj_table = models.CharField(max_length=1024)
    obj_id = models.CharField(max_length=24)

    def get_object(self):
        """ get the 'true' object from the reference """
        model = get_model_from_table_ref(self.obj_table)
        return model.objects.get(id=self.obj_id)

    @classmethod
    def get_reference_for_object(cls, obj):
        """ given a object, get the reference for it"""
        ref, created = cls.get_or_create(
                obj_table=obj.table_ref, obj_id=obj.id)
        return ref


class GenericRelation(BaseModel):
    """ Generic Relations Betwen any two objects"""
    obj1 = models.ForeignKey(GenericRef, related_name='relations_for_obj1')
    obj2 = models.ForeignKey(GenericRef, related_name='relations_for_obj2')

    relation_type = models.CharField(max_length=1024, null=True, blank=True)

    creation_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['creation_date', ]

    @classmethod
    def has_relation(cls, obj1, obj2):
        """ check if any two object has a relation """
        # TODO: CHANGE-ME to **not** build the references
        ref_obj1 = GenericRef.get_reference_for_object(obj1)
        ref_obj2 = GenericRef.get_reference_for_object(obj2)

        relations = GenericRelation.objects.filter(
            Q(obj1=ref_obj1, obj2=ref_obj2) |
            Q(obj1=ref_obj2, obj2=ref_obj1)
        )
        return relations.exists()

    @classmethod
    def add_relation(cls, obj1, obj2, relation_type=None):
        """ add (if dont exist) a relation betwen two objects """
        if not cls.has_relation(obj1, obj2):
            ref_obj1 = GenericRef.get_reference_for_object(obj1)
            ref_obj2 = GenericRef.get_reference_for_object(obj2)

            relation, created = GenericRelation.get_or_create(
                    obj1=ref_obj1, obj2=ref_obj2, relation_type=relation_type)

            return relation
        else:
            return None

    @classmethod
    def remove_relation(cls, obj1, obj2):
        """ add (if dont exist) a relation betwen two objects """
        rel = GenericRelation.objects.filter(
            Q(
                obj1__obj_id=obj1.id, obj1__obj_table=obj1.table_ref,
                obj2__obj_id=obj2.id, obj2__obj_table=obj2.table_ref,
            ) |
            Q(
                obj1__obj_id=obj2.id, obj1__obj_table=obj2.table_ref,
                obj2__obj_id=obj1.id, obj2__obj_table=obj1.table_ref,
            )
        )
        if rel.exists():
            rel.delete()
            return True
        return False


class _RelationsList(list):
    """ utility extended list for relations in RelationsField descriptor"""
    def __init__(self, descriptor, instance, queryset=None):
        self.descriptor = descriptor
        self.instance = instance
        self.qs = queryset

    def add(self, obj, relation_type=None):
        """ add relation with an object """
        return self.descriptor.add_relation(
                self.instance, obj, relation_type=relation_type)

    def remove(self, obj):
        """ remove relations with an object """
        self.descriptor.remove_relation(self.instance, obj)

    def paginated(self, page=1, per_page=10):
        """
        return a paginated relations.
        usage:
          obj.relations.paginated(per_page=20) # page 1, 20 items
          obj.relations.paginated(page=3, per_page=20) # from item 41 to 60
        """
        if self.qs:
            paginator = Paginator(self.qs, per_page)
            return self._build_list_from_queryset(
                    paginator.page(page).object_list)

        else:
            return self

    def filter_by_model(self, model):
        """
        filter relations by table_ref
        example:
          obj.relations
          # returns [(org1, ''), (resource,''), (org2, '')]
          obj.relations.filter_by_model(Organization)
          # returns [(org1, ''), (org2, '')]

        it is chainable. Ex:
            obj.relations.filter_by_model(Organization
                            ).paginated(page=2, per_page=5)
        """
        table_ref = model._table_ref()
        rel_obj = GenericRef.get_reference_for_object(self.instance)
        qs = GenericRelation.objects.filter(
            Q(obj1=rel_obj, obj2__obj_table=table_ref) |
            Q(obj2=rel_obj, obj1__obj_table=table_ref)
        )
        return self._build_list_from_queryset(qs)

    def _build_list_from_queryset(self, qs):
        """
        Given a GenericRelation queryset, build a list like:
          [
            (object_1, 'relation_type_with_1'),
            (object_2, 'relation_type_with_2')
          ]
        """
        relation_list = _RelationsList(self.descriptor, self.instance,
                queryset=qs)
        for rel in qs:
            if rel.obj1.obj_table == self.instance.table_ref and \
               rel.obj1.obj_id == self.instance.id:

                relation_list.append(
                    (rel.obj2.get_object(),
                     RELATIONS[rel.relation_type][0]
                            if rel.relation_type else '')
                )

            elif rel.obj2.obj_table == self.instance.table_ref and \
               rel.obj2.obj_id == self.instance.id:

                relation_list.append(
                    (rel.obj1.get_object(),
                     RELATIONS[rel.relation_type][1]
                            if rel.relation_type else '')
                )

            else:
                raise Exception('instance is not referenced in the relation')
                pass

        return relation_list


class RelationsField(object):
    """
    Relations descriptor.
    usage:
        ```
            class MyClass(models.Model):
                relations = RelationsField()

            obj = MyClass()
            obj.relations
            # returns []

            obj.relations = [
                (objA, 'relation_type1'),
                (objB, 'relation_type2')
            ]
            # creates and saves relations to object

            obj.relations
            # returns [(objA, 'relation_type1'), (objB, 'relation_type2')]

            obj.relations.add(objC, relation_type3)
            obj.relations.remove(objA)
            obj.relations
            # returns [(objB, 'relation_type2'), (objC, 'relation_type3')]

            obj.relations.paginate(page=1, num=10)
            obj.relations.filter_by_type('relation_type1')
        ```
    """
    def __get__(self, instance, owner):
        ref_obj = GenericRef.get_reference_for_object(instance)
        qs = GenericRelation.objects.filter(
                Q(obj1=ref_obj) | Q(obj2=ref_obj))

        relation_list = _RelationsList(self, instance, queryset=qs)
        return relation_list._build_list_from_queryset(qs)

    def __set__(self, instance, new_relations):
        # del old relations
        self.__delete__(instance)

        # create new tags
        for rel in new_relations:
            obj = rel[0] or None
            relation_type = rel[1] or None
            self.add_relation(instance, obj, relation_type)

    def __delete__(self, instance):
        ref_obj = GenericRef.get_reference_for_object(instance)
        GenericRelation.objects.filter(
            Q(obj1=ref_obj) | Q(obj2=ref_obj)
        ).delete()

    def add_relation(self, instance, obj, relation_type=None):
        GenericRelation.add_relation(
            instance, obj, relation_type=relation_type)

    def remove_relation(self, instance, obj):
        if obj:
            return GenericRelation.remove_relation(instance, obj)


