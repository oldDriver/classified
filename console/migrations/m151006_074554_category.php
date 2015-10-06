<?php

use yii\db\Schema;
use yii\db\Migration;

class m151006_074554_category extends Migration
{
    public function up()
    {
        $tableOptions = null;
        if ($this->db->driverName === 'mysql') {
            // http://stackoverflow.com/questions/766809/whats-the-difference-between-utf8-general-ci-and-utf8-unicode-ci
            $tableOptions = 'CHARACTER SET utf8 COLLATE utf8_unicode_ci ENGINE=InnoDB';
        }
        
        $this->createTable('{{%category}}', [
            'id' => $this->primaryKey(11),
            'name' => $this->string()->notNull()->unique(),
            'section_id' => $this->integer(11)->notNull(),
            'created_at' => $this->timestamp()->notNull(),
            'updated_at' => $this->timestamp()->notNull(),
        ], $tableOptions);
        $this->addForeignKey("section_category_fk", "{{%category}}", "section_id", "{{%section}}", "id", 'CASCADE');
    }

    public function down()
    {
        $this->dropForeignKey('section_category_fk', '{{%category}}');
        $this->dropTable('{{%category}}');
    }
}
