<?php

namespace frontend\modules\api\controllers;

use Yii;
use yii\web\Controller;
use yii\web\Response;
use common\models\Section;
use yii\helpers\Url;

class SectionController extends Controller
{
    public function actionIndex()
    {
        Yii::$app->response->format = Response::FORMAT_JSON;
        $sections = Section::find()->all();
        $response = [];
        foreach ($sections as $section) {
            $item = [];
            $item['id'] = $section->id;
            $item['name'] = $section->name;
            $item['href'] = Url::to(['/site/section', 'id' => $section->id], true);
            $response[] = $item;
        }
        return $response;
    }
}
