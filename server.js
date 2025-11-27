// server.js 檔案
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios'); // 模擬使用，用於實際 API 呼叫
const app = express(); 
const PORT = process.env.PORT || 3000; 

// 載入環境變數
dotenv.config();

// 設置靜態檔案目錄 (用於提供 app.js, CSS, 圖片等靜態資源)
app.use(express.static(path.join(__dirname)));
app.use(express.json()); // 解析 JSON 格式的請求主體

// ⭐️ 最終修正：強制在根路徑回傳 index.html 檔案，避免 Zeabur 路由衝突 ⭐️
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 模擬後端資料庫或外部 YouTube/Google API 搜尋結果
function mockVideoData(topic) {
    const today = new Date().toISOString().split('T')[0];
    
    // 根據主題回傳【多組】模擬資料
    if (topic === '人工智慧') {
        return [
            { // 影片 1
                title: `【AI 大趨勢】GPT-5 架構洩漏：多模態與 Agent 能力分析`,
                link: 'https://www.youtube.com/watch?v=ai_latest_v1',
                uploadDate: today,
                summary: [
                    '採用混合專家模型 (MoE) 實現高效能運算。',
                    '原生支援多模態輸入，包含視覺與聽覺。',
                    '重點發展具備長期記憶的 AI Agent 能力。',
                    '預計將徹底改變軟體開發流程。'
                ],
                quote: '「AI Agent 的普及將使人類工作內容從執行轉向監督。」',
                timeline: '01:30 - 模型架構介紹; 03:55 - Agent 應用案例'
            },
            { // 影片 2
                title: `深度解讀：Google I/O 最新 GenAI 工具總整理`,
                link: 'https://www.youtube.com/watch?v=google_ai_tools',
                uploadDate: '2025-11-25',
                summary: [
                    '推出 Project Astra (多模態助理) 的即時互動能力。',
                    'Gemini 獲得了新的程式碼編輯和除錯功能。',
                    '強調模型運行效率與邊緣設備的整合。'
                ],
                quote: '「未來的人工智慧將不再是工具，而是真正的協作者。」',
                timeline: '00:45 - Astra 演示; 05:00 - 開發者工具更新'
            }
        ];
    } else if (topic === '行銷趨勢') {
         return [
            { // 影片 1
                title: `2025 年行銷新戰場：沉浸式體驗與私域流量經營`,
                link: 'https://www.youtube.com/watch?v=marketing_trends_1',
                uploadDate: today,
                summary: [
                    '強調 AR/VR 在產品展示中的應用。',
                    '品牌開始將重心轉向自有 App 和社群群組。',
                    '數據隱私法規促使企業尋求第一方數據。',
                ],
                quote: '「私域流量的價值，在於其高轉換率和穩定性。」',
                timeline: '00:50 - AR 體驗範例; 04:10 - 數據策略調整'
            },
            { // 影片 2
                title: `MarTech 工具總覽：如何利用 AI 提升廣告投放 ROI？`,
                link: 'https://www.youtube.com/watch?v=martech_ai_roi',
                uploadDate: '2025-11-20',
                summary: [
                    '利用生成式 AI 自動化廣告文案和創意素材。',
                    '機器學習優化預算分配，提升競價效率。',
                    '歸因模型從最後點擊轉向多觸點路徑分析。',
                ],
                quote: '「預計 AI 將使廣告創意產出效率提升 60%。」',
                timeline: '03:00 - 自動化工具介紹; 06:15 - 案例分析'
            }
        ];
    } else if (topic === '科技新聞') {
         return [
            { // 影片 1
                title: `全球晶片大戰新進展：Nvidia 與 AMD 最新佈局分析`,
                link: 'https://www.youtube.com/watch?v=chip_war',
                uploadDate: today,
                summary: [
                    '先進製程技術的競爭持續升溫。',
                    '異構整合 (Heterogeneous Integration) 成為主流。',
                    'AI 晶片需求帶動供應鏈重組。'
                ],
                quote: '「算力即國力。」',
                timeline: '02:00 - 各家財報分析; 05:30 - 供應鏈安全議題'
            },
             { // 影片 2
                title: `太空競賽 2.0：低軌道衛星與量子通訊技術的突破`,
                link: 'https://www.youtube.com/watch?v=space_tech',
                uploadDate: '2025-11-26',
                summary: [
                    '低軌衛星進入商業化量產階段。',
                    '量子加密技術提升通訊安全性。',
                    '衛星物聯網 (IoT) 服務成為新商機。'
                ],
                quote: '「通訊權限正從地面轉移到太空。」',
                timeline: '01:00 - LEO 衛星覆蓋率; 04:00 - 安全性挑戰'
            }
        ];
    } else {
        return [];
    }
}

// API 路由：獲取最新影片摘要
app.get('/api/latest-videos', async (req, res) => {
    const { topic } = req.query; 
    
    if (!topic) {
        return res.status(400).json({ error: '請提供查詢主題 (topic)！' });
    }

    console.log(`收到主題請求：${topic}`);

    try {
        const results = mockVideoData(topic);
        
        if (results.length > 0) {
            res.json({
                topic: topic,
                date: new Date().toLocaleDateString('zh-TW'),
                data: results
            });
        } else {
            res.status(404).json({ message: '查無相關最新影片。' });
        }

    } catch (error) {
        console.error('API 處理錯誤:', error);
        res.status(500).json({ error: '後端處理資料時發生錯誤。' });
    }
});


// 伺服器監聽端口 
app.listen(PORT, () => {
    console.log(`伺服器啟動中，請開啟 http://localhost:${PORT}`);
});