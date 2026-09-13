/* ============================================================
   DevNav · 工具数据
   字段：id / name / description / url / icon / category /
        tags / hot / featured / date
   分类 key：design 设计工具、dev 开发工具、frontend 前端资源、
             backend 后端服务、efficiency 效率工具、learning 学习资源
   ============================================================ */

const CATEGORIES = [
  { key: "all",      label: "全部",     icon: "🧩" },
  { key: "design",   label: "设计工具", icon: "🎨" },
  { key: "dev",      label: "开发工具", icon: "🛠️" },
  { key: "frontend", label: "前端资源", icon: "⚛️" },
  { key: "backend",  label: "后端服务", icon: "☁️" },
  { key: "efficiency", label: "效率工具", icon: "⚡" },
  { key: "learning", label: "学习资源", icon: "📚" }
];

const TOOLS = [
  /* ---------- 设计工具 ---------- */
  { id: "figma", name: "Figma", description: "团队协作的界面设计工具，支持实时协同与原型交互。", url: "https://www.figma.com", icon: "🎨", category: "design", tags: ["设计", "协作", "原型"], hot: 98, featured: true, date: "2025-02-20" },
  { id: "canva", name: "Canva", description: "在线平面设计平台，海量模板快速出图。", url: "https://www.canva.com", icon: "🖼️", category: "design", tags: ["设计", "平面", "模板"], hot: 95, featured: true, date: "2025-02-18" },
  { id: "removebg", name: "Remove.bg", description: "AI 一键抠图，自动移除图片背景。", url: "https://www.remove.bg", icon: "✂️", category: "design", tags: ["抠图", "AI", "图片"], hot: 88, featured: false, date: "2025-01-28" },
  { id: "coolors", name: "Coolors", description: "配色方案生成器，一键生成协调色板。", url: "https://coolors.co", icon: "🎯", category: "design", tags: ["配色", "调色板"], hot: 76, featured: false, date: "2025-01-12" },
  { id: "iconpark", name: "IconPark", description: "字节跳动开源图标库，海量可定制图标。", url: "https://iconpark.oceanengine.com", icon: "🧩", category: "design", tags: ["图标", "资源", "开源"], hot: 70, featured: false, date: "2024-12-20" },
  { id: "undraw", name: "unDraw", description: "免费可商用的 SVG 插画素材库，支持一键换色。", url: "https://undraw.co", icon: "🖌️", category: "design", tags: ["插画", "SVG", "资源"], hot: 82, featured: false, date: "2025-02-05" },
  { id: "excalidraw", name: "Excalidraw", description: "手绘风格白板绘图工具，支持团队实时协作。", url: "https://excalidraw.com", icon: "✏️", category: "design", tags: ["绘图", "白板", "协作"], hot: 84, featured: false, date: "2025-02-10" },

  /* ---------- 开发工具 ---------- */
  { id: "github", name: "GitHub", description: "全球最大的代码托管与协作平台。", url: "https://github.com", icon: "🐙", category: "dev", tags: ["代码托管", "Git", "协作"], hot: 99, featured: true, date: "2025-03-01" },
  { id: "vscode", name: "VS Code", description: "微软出品的免费轻量级代码编辑器，插件生态丰富。", url: "https://code.visualstudio.com", icon: "💻", category: "dev", tags: ["编辑器", "IDE"], hot: 99, featured: true, date: "2025-03-01" },
  { id: "stackoverflow", name: "Stack Overflow", description: "程序员技术问答社区，解决开发难题。", url: "https://stackoverflow.com", icon: "📚", category: "dev", tags: ["问答", "社区"], hot: 97, featured: false, date: "2025-02-25" },
  { id: "postman", name: "Postman", description: "API 调试与测试工具，接口开发必备。", url: "https://www.postman.com", icon: "📮", category: "dev", tags: ["API", "调试", "测试"], hot: 93, featured: false, date: "2025-02-15" },
  { id: "codepen", name: "CodePen", description: "前端代码在线沙盒，快速分享演示片段。", url: "https://codepen.io", icon: "🖊️", category: "dev", tags: ["前端", "沙盒", "演示"], hot: 86, featured: false, date: "2025-02-02" },
  { id: "replit", name: "Replit", description: "浏览器里的完整开发环境，支持多语言协作。", url: "https://replit.com", icon: "🚀", category: "dev", tags: ["在线IDE", "协作"], hot: 79, featured: false, date: "2025-01-18" },
  { id: "gitlab", name: "GitLab", description: "一体化 DevOps 平台，内置 CI/CD 流水线。", url: "https://gitlab.com", icon: "🦊", category: "dev", tags: ["代码托管", "CI/CD"], hot: 80, featured: false, date: "2025-01-08" },
  { id: "jsonformatter", name: "JSON Formatter", description: "在线 JSON 格式化、校验与转换工具。", url: "https://jsonformatter.org", icon: "🧾", category: "dev", tags: ["JSON", "格式化"], hot: 74, featured: false, date: "2024-12-28" },
  { id: "regex101", name: "RegEx101", description: "正则表达式在线测试与调试，实时解释。", url: "https://regex101.com", icon: "🔍", category: "dev", tags: ["正则", "测试", "调试"], hot: 77, featured: false, date: "2024-12-15" },

  /* ---------- 前端资源 ---------- */
  { id: "mdn", name: "MDN Web Docs", description: "权威的 Web 开发文档与参考资料。", url: "https://developer.mozilla.org", icon: "📖", category: "frontend", tags: ["文档", "Web", "参考"], hot: 98, featured: true, date: "2025-03-01" },
  { id: "caniuse", name: "Can I Use", description: "查询 HTML/CSS/JS 特性的浏览器兼容性。", url: "https://caniuse.com", icon: "🌐", category: "frontend", tags: ["兼容性", "浏览器"], hot: 90, featured: false, date: "2025-02-22" },
  { id: "googlefonts", name: "Google Fonts", description: "开源字体库，提供丰富网页字体资源。", url: "https://fonts.google.com", icon: "🔤", category: "frontend", tags: ["字体", "资源"], hot: 87, featured: false, date: "2025-02-08" },
  { id: "tailwind", name: "Tailwind CSS", description: "实用优先的 CSS 框架，快速构建现代界面。", url: "https://tailwindcss.com", icon: "💨", category: "frontend", tags: ["CSS框架", "工具类"], hot: 94, featured: true, date: "2025-02-26" },
  { id: "bootstrap", name: "Bootstrap", description: "经典响应式 CSS 框架，组件齐全。", url: "https://getbootstrap.com", icon: "🅱️", category: "frontend", tags: ["CSS框架", "组件"], hot: 85, featured: false, date: "2025-01-30" },
  { id: "fontawesome", name: "Font Awesome", description: "最流行的网页图标字体库。", url: "https://fontawesome.com", icon: "⭐", category: "frontend", tags: ["图标", "字体"], hot: 83, featured: false, date: "2025-01-22" },
  { id: "animatecss", name: "Animate.css", description: "即插即用的 CSS 动画效果库。", url: "https://animate.style", icon: "🎬", category: "frontend", tags: ["动画", "CSS"], hot: 71, featured: false, date: "2024-12-10" },
  { id: "gsap", name: "GreenSock GSAP", description: "高性能 JavaScript 动画引擎。", url: "https://gsap.com", icon: "🧲", category: "frontend", tags: ["动画", "JS库"], hot: 78, featured: false, date: "2025-01-05" },

  /* ---------- 后端服务 ---------- */
  { id: "firebase", name: "Firebase", description: "Google 出品的后端即服务，含数据库与推送。", url: "https://firebase.google.com", icon: "🔥", category: "backend", tags: ["BaaS", "数据库", "推送"], hot: 92, featured: true, date: "2025-02-24" },
  { id: "supabase", name: "Supabase", description: "开源的 Firebase 替代品，基于 PostgreSQL。", url: "https://supabase.com", icon: "⚡", category: "backend", tags: ["BaaS", "数据库", "开源"], hot: 89, featured: true, date: "2025-02-19" },
  { id: "vercel", name: "Vercel", description: "前端项目一键部署平台，支持 Serverless。", url: "https://vercel.com", icon: "▲", category: "backend", tags: ["部署", "前端", "Serverless"], hot: 91, featured: false, date: "2025-02-16" },
  { id: "netlify", name: "Netlify", description: "静态站点托管平台，部署简单快捷。", url: "https://www.netlify.com", icon: "🌍", category: "backend", tags: ["部署", "静态", "Serverless"], hot: 85, featured: false, date: "2025-02-01" },
  { id: "cloudflare", name: "Cloudflare", description: "CDN、DNS 与安全防护一体化服务。", url: "https://www.cloudflare.com", icon: "☁️", category: "backend", tags: ["CDN", "安全", "DNS"], hot: 88, featured: false, date: "2025-01-25" },
  { id: "heroku", name: "Heroku", description: "老牌云应用平台，支持多语言一键部署。", url: "https://www.heroku.com", icon: "🏗️", category: "backend", tags: ["云平台", "部署"], hot: 72, featured: false, date: "2024-12-05" },
  { id: "mongodb", name: "MongoDB Atlas", description: "云端 MongoDB 数据库托管服务。", url: "https://www.mongodb.com/atlas", icon: "🍃", category: "backend", tags: ["数据库", "云"], hot: 81, featured: false, date: "2025-01-15" },
  { id: "railway", name: "Railway", description: "现代化的应用部署平台，体验流畅。", url: "https://railway.app", icon: "🚂", category: "backend", tags: ["部署", "云平台"], hot: 68, featured: false, date: "2024-11-28" },

  /* ---------- 效率工具 ---------- */
  { id: "notion", name: "Notion", description: "集笔记、知识库与项目管理于一体的协作工具。", url: "https://www.notion.so", icon: "📝", category: "efficiency", tags: ["笔记", "协作", "知识库"], hot: 96, featured: true, date: "2025-02-28" },
  { id: "trello", name: "Trello", description: "看板式项目管理工具，任务流转一目了然。", url: "https://trello.com", icon: "📋", category: "efficiency", tags: ["项目管理", "看板"], hot: 80, featured: false, date: "2025-01-20" },
  { id: "slack", name: "Slack", description: "团队沟通协作平台，集成丰富应用。", url: "https://slack.com", icon: "💬", category: "efficiency", tags: ["沟通", "团队"], hot: 78, featured: false, date: "2025-01-10" },
  { id: "drawio", name: "draw.io", description: "免费在线流程图与图表绘制工具。", url: "https://app.diagrams.net", icon: "📐", category: "efficiency", tags: ["流程图", "图表"], hot: 75, featured: false, date: "2024-12-18" },
  { id: "obsidian", name: "Obsidian", description: "本地优先的双链笔记与知识管理工具。", url: "https://obsidian.md", icon: "🗃️", category: "efficiency", tags: ["笔记", "知识库", "本地"], hot: 82, featured: false, date: "2025-01-26" },

  /* ---------- 学习资源 ---------- */
  { id: "freecodecamp", name: "freeCodeCamp", description: "完全免费的编程学习平台，含认证课程。", url: "https://www.freecodecamp.org", icon: "🎓", category: "learning", tags: ["编程", "免费", "课程"], hot: 93, featured: false, date: "2025-02-14" },
  { id: "leetcode", name: "LeetCode", description: "算法刷题平台，面试备战首选。", url: "https://leetcode.com", icon: "🧠", category: "learning", tags: ["算法", "刷题", "面试"], hot: 95, featured: true, date: "2025-02-23" },
  { id: "w3schools", name: "W3Schools", description: "通俗易懂的 Web 开发入门教程站。", url: "https://www.w3schools.com", icon: "📘", category: "learning", tags: ["教程", "Web", "入门"], hot: 84, featured: false, date: "2025-01-14" },
  { id: "roadmap", name: "Roadmap.sh", description: "可视化开发者学习路线图，规划成长路径。", url: "https://roadmap.sh", icon: "🗺️", category: "learning", tags: ["学习路线", "规划"], hot: 83, featured: false, date: "2025-02-03" },
  { id: "runoob", name: "菜鸟教程", description: "中文编程入门教程站，内容全面易上手。", url: "https://www.runoob.com", icon: "🐤", category: "learning", tags: ["教程", "中文"], hot: 86, featured: false, date: "2025-01-06" },
  { id: "cs50", name: "CS50", description: "哈佛大学经典计算机科学入门课程。", url: "https://cs50.harvard.edu", icon: "🏛️", category: "learning", tags: ["课程", "计算机", "入门"], hot: 74, featured: false, date: "2024-12-08" },
  { id: "juejin", name: "掘金", description: "中文技术社区，海量开发者干货文章。", url: "https://juejin.cn", icon: "💎", category: "learning", tags: ["社区", "中文", "文章"], hot: 81, featured: false, date: "2025-01-16" }
];
