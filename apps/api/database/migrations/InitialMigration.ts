import { Migration } from '@mikro-orm/migrations';

// Credit: @pclin https://hackmd.io/@pclin/rJm_qCiN9

export class InitialMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(`CREATE SEQUENCE IF NOT EXISTS "public"."global_id_sequence";

CREATE OR REPLACE FUNCTION "public"."snowflake"(OUT result bigint) AS $$
DECLARE
	our_epoch bigint := 0;
	seq_id bigint;
	now_millis bigint;
	shard_id int := 1; -- // TODO: replace with shard ID
BEGIN
	SELECT nextval('public.global_id_sequence') % 32768 INTO seq_id;

	SELECT FLOOR(EXTRACT(EPOCH FROM clock_timestamp()) * 1000) INTO now_millis;
	result := (now_millis - our_epoch) << 21; -- max 140 years since epoch (42 bits)
	result := result | (shard_id << 15); -- max 64 shards (6 bits)
	result := result | (seq_id); -- max sequence 32768 (15 bits)
END;
$$ LANGUAGE PLPGSQL;`);

  this.addSql(`CREATE OR REPLACE FUNCTION "public"."id_generator"(IN number_of_chars int, OUT result text) AS $$
BEGIN
  SELECT string_agg(substr(characters, (random() * length(characters) + 1)::integer, 1), '')
  FROM (values('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789')) as symbols(characters)
  JOIN generate_series(1, number_of_chars) on 1 = 1
  LIMIT 1
  INTO result;
END;
$$ LANGUAGE PLPGSQL;`);
  }
}
