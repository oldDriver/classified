<?php
namespace tests\fixtures;

use yii\test\ActiveFixture;

class CityFixture extends ActiveFixture
{
    /**
     * @var string
     */
    public $modelClass = 'common\models\City';

    /**
     * @var string
     */
    public $depends = [
        'tests\fixtures\CountryFixture',
        'tests\fixtures\StateFixture'
    ];
}