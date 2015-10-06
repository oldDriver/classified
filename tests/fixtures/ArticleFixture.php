<?php
namespace tests\fixtures;

use yii\test\ActiveFixture;

class ArticleFixture extends ActiveFixture
{
    /**
     * @var string
     */
    public $modelClass = 'common\models\Article';

    /**
     * @var string
     */
    public $depends = [
        'tests\fixtures\CityFixture',
        'tests\fixtures\SectionFixture',
        'tests\fixtures\CategoryFixture',
    ];
}