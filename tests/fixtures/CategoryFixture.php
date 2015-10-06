<?php
namespace tests\fixtures;

use yii\test\ActiveFixture;

class CategoryFixture extends ActiveFixture
{
    /**
     * @var string
     */
    public $modelClass = 'common\models\Category';

    /**
     * @var string
     */
    public $depends = ['tests\fixtures\SectionFixture'];
}