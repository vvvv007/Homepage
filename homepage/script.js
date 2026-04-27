document.addEventListener('DOMContentLoaded', () => {
    
    // 1. 雙語切換邏輯 (Language Toggle)
    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', () => {
            document.body.classList.toggle('lang-zh');
            document.body.classList.toggle('lang-en');
        });
    }

    // 2. 滾動浮現特效 (Scroll Reveal)
    const reveals = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });

    // 3. 職涯地圖動態提示框 (Journey Map Tooltip)
    const tooltip = document.getElementById('journey-tooltip');
    const nodes = document.querySelectorAll('.node');

    if (tooltip && nodes.length > 0) {
        nodes.forEach(node => {
            node.addEventListener('mouseenter', (e) => {
                // 判斷當前語言狀態以顯示對應文字
                const isZh = document.body.classList.contains('lang-zh');
                const text = isZh ? node.getAttribute('data-info-zh') : node.getAttribute('data-info-en');
                
                tooltip.innerText = text;
                
                // 設定提示框位置：置中對齊，並放置在圓點的「下方」
                const rect = node.getBoundingClientRect();
                
                // 計算 X 軸置中對齊
                tooltip.style.left = (rect.left + window.scrollX - tooltip.offsetWidth / 2 + node.offsetWidth / 2) + 'px';
                // 計算 Y 軸置於下方 (rect.bottom + 15px 預留間距)
                tooltip.style.top = (rect.bottom + window.scrollY + 15) + 'px';
                
                // 觸發漸入動畫
                tooltip.classList.add('show');
            });

            node.addEventListener('mouseleave', () => {
                // 移除 class 以觸發漸出動畫
                tooltip.classList.remove('show');
            });
        });
    }

    // 4. 滑鼠點擊雷達水波紋特效 (Click Ripple)
    document.addEventListener('click', function(e) {
        let ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = e.pageX + 'px';
        ripple.style.top = e.pageY + 'px';
        document.body.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

});

// 5. Off-Screen 曲面畫廊 (CoverFlow) - 無限循環版
    const sliders = document.querySelectorAll('.gallery-slider');
    
    sliders.forEach(slider => {
        // --- 1. 無縫循環：複製節點 (Clone Nodes) ---
        const originalItems = Array.from(slider.querySelectorAll('.gallery-item'));
        if(originalItems.length === 0) return;

        // 在後面複製一組
        originalItems.forEach(item => {
            let cloneNode = item.cloneNode(true);
            slider.appendChild(cloneNode);
        });
        
        // 在前面複製一組 (需反向插入才能維持順序)
        for (let i = originalItems.length - 1; i >= 0; i--) {
            let cloneNode = originalItems[i].cloneNode(true);
            slider.insertBefore(cloneNode, slider.firstChild);
        }

        const allItems = slider.querySelectorAll('.gallery-item');
        
        // --- 2. 初始定位：讓畫面停在「第一張原始圖片」 ---
        setTimeout(() => {
            const itemWidth = allItems[0].offsetWidth + 30; // 30 是 CSS gap
            // 由於前面插入了一組複製圖片，我們將捲軸向右移到原始圖片的開頭
            slider.scrollLeft = originalItems.length * itemWidth;
        }, 50);

        // --- 3. 中心放大邏輯 ---
        const updateCenterItem = () => {
            const sliderRect = slider.getBoundingClientRect();
            const sliderCenter = sliderRect.left + slider.offsetWidth / 2;
            
            allItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + item.offsetWidth / 2;
                const distance = Math.abs(sliderCenter - itemCenter);
                
                if (distance < item.offsetWidth / 2) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        };

        // --- 4. 監聽滾動：無限跳轉 ---
        slider.addEventListener('scroll', () => {
            updateCenterItem();
            
            const itemWidth = allItems[0].offsetWidth + 30;
            const singleSetWidth = originalItems.length * itemWidth;
            
            // 當向左滑動到底 (進入前面的複製區) 時，瞬間跳回原始區
            if (slider.scrollLeft <= 0) {
                slider.scrollLeft = singleSetWidth;
            } 
            // 當向右滑動到底 (進入後面的複製區) 時，瞬間跳回原始區
            else if (slider.scrollLeft >= singleSetWidth * 2) {
                slider.scrollLeft = singleSetWidth;
            }
        });

        window.addEventListener('resize', updateCenterItem);

        // --- 5. 自動播放邏輯 ---
        let autoPlayInterval;
        const startAutoPlay = () => {
            autoPlayInterval = setInterval(() => {
                const itemWidth = allItems[0].offsetWidth + 30;
                // 利用 JS 平滑滑動下一張
                slider.scrollTo({ 
                    left: slider.scrollLeft + itemWidth, 
                    behavior: 'smooth' 
                });
            }, 3500); 
        };

        const stopAutoPlay = () => clearInterval(autoPlayInterval);

        // 滑鼠移入或觸碰時暫停自動播放
        slider.addEventListener('mouseenter', stopAutoPlay);
        slider.addEventListener('mouseleave', startAutoPlay);
        slider.addEventListener('touchstart', stopAutoPlay); 
        
        // 延遲一點開始，確保初始定位完成
        setTimeout(startAutoPlay, 500);

        // --- 新增：工作經歷點擊下拉邏輯 (Accordion) ---
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const item = header.parentElement;
            // 點擊時，切換 active 狀態
            item.classList.toggle('open');
        });
    });
    });