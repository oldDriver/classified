<?php

namespace frontend\modules\api\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use common\models\Category;
use yii\helpers\Url;

class CategoryController extends Controller
{
    public function actionIndex()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;
        $collection = Category::find()->all();
        $response = [];
        foreach ($collection as $element) {
            $item = [];
            $item['id'] = $element->id;
            $item['name'] = $element->name;
            $item['href'] = Url::to(['/site/category', 'id' => $element->id], true);
            $response[] = $item;
        }
        return $response;
    }
}
