DROP TABLE main_georefobject;

CREATE TABLE common_objects_georefobject
(
  id character varying(24) NOT NULL,
  name character varying(512) NOT NULL,
  description text NOT NULL,
  short_description character varying(250),
  otype character varying(512) NOT NULL,
  creator_id integer,
  creation_date timestamp with time zone NOT NULL,
  last_editor_id integer,
  last_update timestamp with time zone NOT NULL,
  extra_data text,
  contact text,
  points geometry,
  lines geometry,
  polys geometry,
  geometry geometry,
  CONSTRAINT common_objects_georefobject_pkey PRIMARY KEY (id ),
  CONSTRAINT creator_id_refs_id_26a1efbc FOREIGN KEY (creator_id)
      REFERENCES authentication_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT last_editor_id_refs_id_26a1efbc FOREIGN KEY (last_editor_id)
      REFERENCES authentication_user (id) MATCH SIMPLE
      ON UPDATE NO ACTION ON DELETE NO ACTION DEFERRABLE INITIALLY DEFERRED,
  CONSTRAINT enforce_dims_geometry CHECK (st_ndims(geometry) = 2),
  CONSTRAINT enforce_dims_lines CHECK (st_ndims(lines) = 2),
  CONSTRAINT enforce_dims_points CHECK (st_ndims(points) = 2),
  CONSTRAINT enforce_dims_polys CHECK (st_ndims(polys) = 2),
  CONSTRAINT enforce_geotype_geometry CHECK (geometrytype(geometry) = 'GEOMETRYCOLLECTION'::text OR geometry IS NULL),
  CONSTRAINT enforce_geotype_lines CHECK (geometrytype(lines) = 'MULTILINESTRING'::text OR lines IS NULL),
  CONSTRAINT enforce_geotype_points CHECK (geometrytype(points) = 'MULTIPOINT'::text OR points IS NULL),
  CONSTRAINT enforce_geotype_polys CHECK (geometrytype(polys) = 'MULTIPOLYGON'::text OR polys IS NULL),
  CONSTRAINT enforce_srid_geometry CHECK (st_srid(geometry) = 4326),
  CONSTRAINT enforce_srid_lines CHECK (st_srid(lines) = 4326),
  CONSTRAINT enforce_srid_points CHECK (st_srid(points) = 4326),
  CONSTRAINT enforce_srid_polys CHECK (st_srid(polys) = 4326)
)
WITH (
  OIDS=FALSE
);

CREATE INDEX common_objects_georefobject_creator_id
  ON common_objects_georefobject
  USING btree
  (creator_id );

CREATE INDEX common_objects_georefobject_geometry_id
  ON common_objects_georefobject
  USING gist
  (geometry );

CREATE INDEX common_objects_georefobject_last_editor_id
  ON common_objects_georefobject
  USING btree
  (last_editor_id );

CREATE INDEX common_objects_georefobject_lines_id
  ON common_objects_georefobject
  USING gist
  (lines );

CREATE INDEX common_objects_georefobject_points_id
  ON common_objects_georefobject
  USING gist
  (points );

CREATE INDEX common_objects_georefobject_polys_id
  ON common_objects_georefobject
  USING gist
  (polys );

ALTER TABLE tags_taggedobject ALTER COLUMN object_id TYPE character varying(24);
ALTER TABLE tags_taggedobject ALTER COLUMN object_id SET NOT NULL;

ALTER TABLE main_genericref ALTER COLUMN obj_id TYPE character varying(24);
ALTER TABLE main_genericref ALTER COLUMN obj_id SET NOT NULL;
