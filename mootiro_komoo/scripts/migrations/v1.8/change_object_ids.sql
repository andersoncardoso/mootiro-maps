CREATE CAST (integer AS text) WITH INOUT AS IMPLICIT;
ALTER TABLE signatures_signature ALTER COLUMN object_id TYPE character varying(24);
ALTER TABLE moderation_moderation ALTER COLUMN object_id TYPE character varying(24);
ALTER TABLE komoo_comments_comment ALTER COLUMN object_id TYPE character varying(24);
ALTER TABLE komoo_project_projectrelatedobject ALTER COLUMN object_id TYPE character varying(24);
