ALTER TABLE main_georefobject ALTER COLUMN id TYPE character varying(24);
ALTER TABLE main_georefobject ALTER COLUMN id SET NOT NULL;

ALTER TABLE tags_taggedobject ALTER COLUMN object_id TYPE character varying(24);
ALTER TABLE tags_taggedobject ALTER COLUMN object_id SET NOT NULL;

ALTER TABLE main_genericref ALTER COLUMN obj_id TYPE character varying(24);
ALTER TABLE main_genericref ALTER COLUMN obj_id SET NOT NULL;
