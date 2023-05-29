import { Migration } from '@mikro-orm/migrations';

// Credit: @pclin https://hackmd.io/@pclin/rJm_qCiN9

export class InitialMigration extends Migration {
  async up(): Promise<void> {
    this.addSql(`CREATE SEQUENCE IF NOT EXISTS "public"."global_id_sequence";

CREATE OR REPLACE FUNCTION "public"."id_generator"(OUT result bigint) AS $$
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
  }
}
