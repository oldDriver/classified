<?php
namespace tests\fixtures;

use yii\test\ActiveFixture;

class StateFixture extends ActiveFixture
{
    /**
     * @var string
     */
    public $modelClass = 'common\models\State';

    /**
     * @var string
     */
    public $depends = ['tests\fixtures\CountryFixture'];
}