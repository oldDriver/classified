<?php

namespace frontend\modules\api\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use common\models\Country;

class CountryController extends Controller
{
    public function actionIndex()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;
        $list = Country::find()->all();
        return $list;
    }
}
