# 症狀導航

一個使用 Next.js App Router 建立的症狀與就醫科別導航 MVP。第一版使用本地 JSON 資料，之後可以把 `lib/data.ts` 換成資料庫來源，頁面與元件不需要大改。

## 功能

- 首頁人體部位入口
- 部位頁：列出該部位常見症狀
- 症狀頁：顯示建議科別、就醫時機與急診警訊
- 搜尋頁與 `/api/symptoms` API
- 預留 Supabase 設定入口

## 開始使用

```bash
npm install
npm run dev
```

開啟 `http://localhost:3000`。

## 部署到 Netlify

本專案已附 `netlify.toml`，Netlify 會使用：

```bash
npm run build:full
```

部署步驟：

1. 將專案推到 GitHub。
2. 到 Netlify 選擇 Add new site → Import an existing project。
3. 選你的 GitHub repo。
4. Build command 使用 `npm run build:full`。
5. 環境變數至少設定 `NEXT_PUBLIC_SITE_URL=https://你的站名.netlify.app`。
6. 若已接 Supabase，再設定 `NEXT_PUBLIC_SUPABASE_URL` 與 `NEXT_PUBLIC_SUPABASE_ANON_KEY`。

## 主要資料

- `data/bodyParts.json`：身體部位
- `data/symptoms.json`：症狀清單
- `data/symptomResults.json`：科別建議與警訊

## Supabase

- `supabase/schema.sql`：production schema，包含部位、症狀、科別、多對多科別、就醫指引、紅旗規則與同義詞。
- `supabase/seed.sql`：由目前 JSON 產生的可匯入 seed。
- `npm run seed:supabase`：重新依 `data/*.json` 產生 `supabase/seed.sql`。
- `npm run generate:seo`：依 `data/*.json` 產生 `data/seo-pages.json`。
- `npm run generate:sitemap`：依 `data/seo-pages.json` 產生 `public/sitemap.xml`。
- `npm run build:full`：產生 SEO JSON、sitemap，然後執行 Next.js build。
- `npm run expand:symptoms`：從現有 seed 症狀產生長尾變體到 `data/expanded-symptoms.json`。
- `npm run build:ai`：產生長尾症狀、SEO JSON、sitemap，然後執行 Next.js build。
- `npm run ai:daily`：產生每日 SEO 維護候選內容，輸出到 `data/ai-generated-content.json`，預設不直接上線。
- `npm run ai:seed`：將每日候選內容轉成 `supabase/ai-generated-content-seed.sql`。

預設 `npm run generate:seo` 只產核心症狀頁，避免大量近似頁每日上線。若需要測試長尾變體，可使用：

```bash
SEO_USE_EXPANDED=true npm run generate:seo
```

## AI SEO 維護策略

這個專案採用「核心頁穩定 + AI 候選內容待審」：

- AI 可以產生搜尋意圖、FAQ、同義詞與內部連結建議。
- AI 不直接產生診斷、處方、治療承諾或覆寫急診判斷。
- `ai_generated_content.review_status` 預設為 `pending`，需審核後才公開。
- `.github/workflows/daily-ai.yml` 提供每日 cron 範例，會跑候選內容產生、seed 輸出與 build 驗證。

建議在 Supabase SQL Editor 先執行 `schema.sql`，再執行 `seed.sql`。

網站資料讀取順序是 Supabase 優先、JSON fallback。Production 環境設定：

```bash
NEXT_PUBLIC_SITE_URL=https://your-domain.com
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

若在 server 環境想使用 service role，可以額外設定：

```bash
SUPABASE_SERVICE_ROLE_KEY=...
```

## 未來擴充

- 將 `lib/data.ts` 改為讀取 Supabase 或其他資料庫
- 新增 `/app/admin` 管理後台
- 擴充搜尋排序、同義詞與熱門症狀
- 加入醫療免責聲明頁與內容審核流程
