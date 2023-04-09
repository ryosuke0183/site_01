window.addEventListener('DOMContentLoaded', function () {
    // $('.slider__lists').slick({

    // })

    {
        // ドラッグはPCとスマホを考えないから手軽だけど、やっぱ違う気がする
        // touchとclickで実装しなきゃいけなさそう

        // // 初期設定
        let sliderLists = document.querySelector('#slider .slider__lists');

        // スライダーの横幅取得
        let slider = document.querySelector('#slider')
        let sliderWidth = slider.clientWidth;

        // スライダーの要素数
        let sliderItems = document.querySelectorAll('#slider .slider__list');
        let sliderItemsLen = sliderItems.length;

        let lastSlideIndex = sliderItems.length - 1;

        
        // スライダーのクローン
        sliderItems.forEach(function (item, index) {
            let cloneItem = item.cloneNode(true);
            cloneItem.classList.add('cloned');
            if (index === sliderItemsLen - 1) {
                sliderLists.insertBefore(cloneItem, sliderLists.firstChild);
            } else {
                sliderLists.appendChild(cloneItem);
            }
        });

        // スライダーの再取得
        sliderItems = document.querySelectorAll('#slider .slider__list');
        sliderItemsLen = sliderItems.length;
        
        // data属性、クラスの付与
        sliderItems.forEach(function (item, index) {
            item.dataset.index = index - 1;
            item.style.width = `${sliderWidth}px`;
            item.setAttribute('draggable', 'true');
            
            if (index === 1) {
                item.classList.add('current');
            }
        });
        
        let firstSlide = document.querySelector('#slider .slider__list[data-index="0"]');
        let lastSlide = document.querySelector(`#slider .slider__list[data-index="${lastSlideIndex}"]`);
        
        // スライダー全体の横幅
        sliderLists.style.width = sliderWidth * sliderItemsLen;

        // 初期値で1枚目を表示するようにtransformXを設定する。
        sliderLists.style.transform = `translate(-${sliderWidth}px, 0)`;

        let dragStartPositionX;  // ドラッグ開始位置
        let dragEndPositionX;    // ドラッグ終了位置
        let dragingPositionX;    // ドラッグ中の位置
        let sliderTranslateX;    // ドラッグ開始時のtransformの値

        sliderItems.forEach(function (item, index) {

            item.addEventListener('dragstart', function (event) {
                sliderLists.style.transition = '1s';

                // ドラッグ開始位置を取得
                dragStartPositionX = event.pageX;

                // chrome対策
                // スライダーのtranslateを取得
                let matrix = new WebKitCSSMatrix(getComputedStyle(sliderLists).transform);
                sliderTranslateX = matrix.e;
            });

            item.addEventListener('drag', function (event) {

                // ドラッグ中の位置を取得
                dragingPositionX = event.pageX;

                let translate;  // スライドをX方向にtranslateさせる値

                // スライドしている時
                if (dragStartPositionX > dragingPositionX) {

                    // ドラッグ中、スライドも左に動くようにする
                    translate = sliderTranslateX - Math.abs(dragStartPositionX - dragingPositionX);

                } else if (dragStartPositionX < dragingPositionX) {

                    // ドラッグ中、スライドも右に動くようにする
                    translate = sliderTranslateX + Math.abs(dragStartPositionX - dragingPositionX);
                }

                sliderLists.style.transform = `translate(${translate}px, 0)`;
            })

            item.addEventListener('dragend', function (event) {

                sliderLists.style.pointerEvents = 'none';

                // ドラッグ終了の位置を取得
                dragEndPositionX = event.pageX;

                let translate;  // スライダーをX方向にtranslateさせる値

                if (dragStartPositionX > dragEndPositionX) {
                    translate = sliderTranslateX - (sliderWidth * 1);

                } else if (dragStartPositionX < dragEndPositionX) {
                    translate = sliderTranslateX + (sliderWidth * 1);
                }

                sliderLists.style.transform = `translate(${translate}px, 0)`;

            })
        });

        // スライダーがスライドし終わったとき
        sliderLists.addEventListener('transitionend', function () {
            sliderLists.style.transition = null;
            // sliderTranslateX = '';

            // スライドの最中にスライドしたらずれる
            sliderLists.style.pointerEvents = 'auto';

            let currentSlide = document.querySelector('#slider .current');

            if (dragStartPositionX > dragEndPositionX && currentSlide.nextElementSibling.classList.contains('cloned')) {
                sliderLists.style.transform = `translate(-${sliderWidth}px, 0)`;
            } else if (dragStartPositionX < dragEndPositionX && currentSlide.previousElementSibling.classList.contains('cloned')) {
                sliderLists.style.transform = `translate(-${sliderWidth * (lastSlideIndex + 1)}px, 0)`;
            }

            if (dragStartPositionX > dragEndPositionX && currentSlide.nextElementSibling.classList.contains('cloned')) {
                firstSlide.classList.add('current');
            } else if (dragStartPositionX < dragEndPositionX && currentSlide.previousElementSibling.classList.contains('cloned')) {
                lastSlide.classList.add('current');
            } else if (dragStartPositionX > dragEndPositionX) {
                currentSlide.nextElementSibling.classList.add('current');
            } else if (dragStartPositionX < dragEndPositionX) {
                currentSlide.previousElementSibling.classList.add('current');
            }

            currentSlide.classList.remove('current');
        })

    }
});