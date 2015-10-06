<?php

use yii\db\Schema;
use yii\db\Migration;

class m151006_094548_article extends Migration
{
    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            // http://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }
        $this->createTable('{{%country}}', [
            'id' => $this->primaryKey(11),
            'name' => $this->string()->notNull(),
            'code' => $this->string(5)->notNull(),
            'created_at' => $this->timestamp()->notNull(),
            'updated_at' => $this->timestamp()->notNull(),
        ], $tableOptions);

        $this->createTable('{{%state}}', [
            'id' => $this->primaryKey(11),
            'country_id' => $this->integer(11)->notNull(),
            'name' => $this->string()->notNull(),
            'code' => $this->string(5),
            'created_at' => $this->timestamp()->notNull(),
            'updated_at' => $this->timestamp()->notNull(),
        ], $tableOptions);
        $this->addForeignKey("country_state_fk", "{{%state}}", "country_id", "{{%country}}", "id", 'CASCADE');

        $this->createTable('{{%city}}', [
            'id' => $this->primaryKey(11),
            'country_id' => $this->integer(11)->notNull(),
            'state_id' => $this->integer(11)->notNull(),
            'name' => $this->string()->notNull(),
            'country_id' => $this->integer(11)->notNull(),
            'created_at' => $this->timestamp()->notNull(),
            'updated_at' => $this->timestamp()->notNull(),
        ], $tableOptions);
        $this->addForeignKey("country_city_fk", "{{%city}}", "country_id", "{{%country}}", "id", 'CASCADE');
        $this->addForeignKey("state_city_fk", "{{%city}}", "state_id", "{{%city}}", "id", 'CASCADE');

        $this->createTable('{{%article}}', [
            'id' => $this->primaryKey(11),
            'section_id' => $this->integer(11)->notNull(),
            'category_id' => $this->integer(11)->notNull(),
            'city_id' => $this->integer(11)->notNull(),
            'title' => $this->string()->notNull(),
            'description' => $this->text(),
            'price' => $this->money()->notNull(),
            'created_at' => $this->timestamp()->notNull(),
            'updated_at' => $this->timestamp()->notNull(),
        ], $tableOptions);
        $this->addForeignKey("category_article_fk", "{{%article}}", "category_id", "{{%category}}", "id", 'CASCADE');
        $this->addForeignKey("section_article_fk", "{{%article}}", "section_id", "{{%section}}", "id", 'CASCADE');
        
    }

    public function down()
    {
        $this->dropForeignKey('section_article_fk', '{{%article}}');
        $this->dropForeignKey('category_article_fk', '{{%article}}');
        $this->dropForeignKey('country_state_fk', '{{%state}}');
        $this->dropForeignKey('country_city_fk', '{{%city}}');
        $this->dropForeignKey('state_city_fk', '{{%city}}');
        $this->dropTable('{{%article}}');
        $this->dropTable('{{%country}}');
        $this->dropTable('{{%state}}');
        $this->dropTable('{{%city}}');
    }
}
