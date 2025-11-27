document.addEventListener('DOMContentLoaded', () => {
    const topicSelect = document.getElementById('topic-select');
    const fetchButton = document.getElementById('fetch-button');
    const resultsContainer = document.getElementById('results-container');
    const loadingIndicator = document.getElementById('loading');
    const summaryHeader = document.getElementById('summary-header');

    // 處理點擊按鈕事件
    fetchButton.addEventListener('click', async () => {
        const selectedTopic = topicSelect.value;
        if (!selectedTopic) {
            alert('請選擇一個主題！');
            return;
        }

        // 顯示載入動畫
        loadingIndicator.style.display = 'block';
        resultsContainer.innerHTML = '';
        summaryHeader.innerHTML = '';

        try {
            // 呼叫後端 API
            const response = await fetch(`/api/latest-videos?topic=${encodeURIComponent(selectedTopic)}`);
            
            if (!response.ok) {
                const errorData = await response.json();
                resultsContainer.innerHTML = `<p class="error">錯誤：${errorData.message || response.statusText}</p>`;
                return;
            }

            const data = await response.json();
            
            // 設置標題
            summaryHeader.innerHTML = `📚 今日新知摘要清單：<strong>${data.topic}</strong> (${data.date})`;

            // 渲染結果表格
            renderResultsTable(data.data);

        } catch (error) {
            console.error('獲取資料時發生錯誤:', error);
            resultsContainer.innerHTML = '<p class="error">連線錯誤，請檢查後端伺服器是否運行。</p>';
        } finally {
            // 隱藏載入動畫
            loadingIndicator.style.display = 'none';
        }
    });

    /**
     * 將 API 回傳的影片資料渲染成表格
     * @param {Array<Object>} videos - 影片資料陣列
     */
    function renderResultsTable(videos) {
        if (videos.length === 0) {
            resultsContainer.innerHTML = '<p class="info">查無相關最新影片，請選擇其他主題。</p>';
            return;
        }

        let html = '<div class="video-list">';

        videos.forEach((video, index) => {
            // 注意：這裡使用 strong 代替了 雙星號 **，因為這是 JavaScript 模板字串
            html += `
                <div class="video-card macaron-shadow">
                    <h3>${index + 1}. ${video.title}</h3>
                    <p>🔗 <a href="${video.link}" target="_blank" class="macaron-link">觀看影片</a></p>
                    <p>📅 <strong>上傳日期:</strong> ${video.uploadDate}</p>

                    <h4>💡 摘要（重點整理）:</h4>
                    <ul>
                        ${video.summary.map(point => `<li>${point}</li>`).join('')}
                    </ul>
                    
                    ${video.quote ? `
                        <div class="quote-box">
                            <p>💬 <strong>重要引用/數據:</strong> ${video.quote}</p>
                        </div>
                    ` : ''}

                    ${video.timeline ? `
                        <p class="timeline">⏱️ <strong>時間軸關鍵段落:</strong> ${video.timeline}</p>
                    ` : ''}
                </div>
            `;
        });

        html += '</div>';
        resultsContainer.innerHTML = html;
    }
});