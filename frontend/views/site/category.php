<?php

/* @var $this yii\web\View */

$this->title = 'My Yii Application';
?>
<section class="content-grid">
        <div class="grid">
            <div class="grid__col-12">
                <h2 id="three-column">Classic three column layout with nested grids</h2>
            </div>
        </div>
</section>
<section class="content-full">
  <section class="grid">
    <nav class="grid__col-sm-2 grid__col-md-1 grid__col--bleed example-col-flat-2">
      <ol class="example-nav">
        <li><a href="javascript:void(0);">home</a></li>
        <li><a href="javascript:void(0);">account</a></li>
        <li><a href="javascript:void(0);">search</a></li>
        <li><a href="javascript:void(0);">about</a></li>
        <li><a href="javascript:void(0);">faq</a></li>
      </ol>
    </nav>
    <section class="grid__col-sm-7 grid__col-md-8 grid__col--bleed">
      <div id="categories"></div>
      <script type="text/jsx" src="src/link.js"></script>
      <script type="text/jsx" src="src/categories.js"></script>
      <script type="text/jsx">
        React.render(
            <Categories apiCategoryUrl="<?php echo $apiCategoryUrl; ?>"/>,
            document.getElementById('categories')
        );
      </script>
    </section>
  </section>
</section>