# Babel Academy (巴别塔皇家翻译学院)

![Babel Banner](https://img.shields.io/badge/Status-Beta-gold) ![License](https://img.shields.io/badge/License-MIT-blue) ![Tech](https://img.shields.io/badge/Tech-React%20%7C%20Vite%20%7C%20Gemini%20API-crimson)

[中文](#中文-chinese) | [English](#english)

<a id="中文-chinese"></a>

> "言语即力量。在工业革命的蒸汽与齿轮之间，翻译是唯一能驱动魔法的炼金术。"

**Babel Academy** 是一个由 Google Gemini 大语言模型驱动的沉浸式文字冒险游戏（RPG）。游戏背景设定在一个架空的维多利亚时代，你将扮演一名皇家翻译学院的学生，在学习外语与刻银术魔法的同时，卷入帝国与革命派系的政治漩涡。

🔗 **[在线游玩 (Github Pages)](https://JLYANG1900.github.io/BabelAcademy/)**

---

## 🔒 隐私与安全声明 (重要)

本项目是一个**纯前端应用 (Client-side Only)**，我们高度重视您的隐私与数据安全：

1.  **API Key 安全**：
    *   您输入的 Google Gemini API Key **仅存储在您浏览器的 `localStorage` 本地缓存中**。
    *   **绝无**任何后端服务器收集或中转您的 Key。
    *   所有 API 请求均由您的浏览器直接向 Google 服务器发起。

2.  **存档数据**：
    *   游戏进度（包括对话历史、属性、背包）均以 JSON 文件形式**存储在您的本地设备**。
    *   通过"存档/读档"功能，数据流仅发生在浏览器内存与您的硬盘之间，不经过任何云端数据库。

3.  **对话记录**：
    *   为了防止 Token 超限，系统会自动管理上下文长度（保留最近20条），且这些历史记录仅用于当前会话的上下文维持。

---

## ✨ 核心功能

### 1. LLM 驱动的动态叙事
*   **无限自由度**：不再是传统的选项分支，你可以输入任何行动指令，AI 主持人将实时生成剧情反馈。
*   **智能行动建议**：如果你不知道该做什么，AI 会根据当前情境动态生成 3 个推荐行动。
*   **深度沉浸**：系统要求 AI 进行不少于 1000 字的深层描写，提供维多利亚哥特风格的阅读体验。

### 2. 实时状态系统
侧边栏的各项数据会随着剧情发展实时更新：
*   **环境感知**：时间、地点、天气、服装会根据你的行动而变化。
*   **经济系统**：通过实习赚取银币（¤），用于购买物品或打通关系。
*   **三维属性**：你的选择会影响**帝国贡献**、**社团声望**和**怀疑度**。
    *   ⚠️ **警告**：当怀疑度超过 90% 时，你将面临帝国审判庭的通缉。

### 3. 巴别塔校园生活
*   **部门实习**：前往法务部处理纠纷，或在文学系搜集情报（部分部门如口译部需高年级解锁）。
*   **NPC 互动**：查阅详尽的 NPC 档案，每个人物都有独特的立绘与背景故事。
*   **事件日志**：报纸风格的事件记录，追踪发生的大事小情。

### 4. 存档与读档
*   支持随时导出当前游戏进度的 JSON 存档文件。
*   支持跨设备导入存档，继续你的冒险。

---

## 🎮 玩法指南

1.  **配置设置**：
    *   点击右上角的 **设置 (Settings)** 图标。
    *   输入您的 Google Gemini API Key（可免费获得）。
    *   选择模型（默认为 `gemini-2.5-flash`）。
    *   点击保存并测试连接。

2.  **开始冒险**：
    *   在底部输入框描述你的行动，例如："去图书馆查找关于刻银术的书籍" 或 "仔细观察教授的表情"。
    *   或者直接点击输入框上方的行动建议按钮。

3.  **生存法则**：
    *   **帝国 vs 革命**：你的每一个决定都在通过微小的扰动影响两大势力的平衡。
    *   **管理怀疑度**：不要过于频繁地进行激进活动，否则会被校方注意。
    *   **收集资源**：利用实习机会积累银币，这在关键时刻能救你一命。

---

## 🛠️ 技术栈

*   **前端框架**: React 18 + TypeScript + Vite
*   **样式库**: Tailwind CSS (定制复古羊皮纸风格)
*   **AI SDK**: Google Generative AI SDK
*   **图标库**: Lucide React

---

## 📜 开源协议

MIT License. 欢迎 Fork 与贡献代码！

<br>
<br>

---

<a id="english"></a>

# Babel Academy (The Royal Institute of Translation)

> "Language is power. Amidst the steam and gears of the Industrial Revolution, translation is the only alchemy that drives magic."

**Babel Academy** is an immersive text-based RPG powered by the **Google Gemini** Large Language Model. Set in an alternate Victorian era, you play as a student at the Royal Institute of Translation, caught in the political vortex between the Empire and revolutionary factions while mastering foreign languages and silver-working magic.

🔗 **[Play Online (Github Pages)](https://JLYANG1900.github.io/BabelAcademy/)**

---

## 🔒 Privacy & Security Statement (Important)

This project is a **purely frontend application (Client-side Only)**. We highly value your privacy and data security:

1.  **API Key Security**:
    *   Your Google Gemini API Key is **stored ONLY in your browser's `localStorage`**.
    *   There is **NO** backend server collecting or relaying your Key.
    *   All API requests are made directly from your browser to Google's servers.

2.  **Save Data**:
    *   Game progress (including chat history, attributes, inventory) is **stored locally on your device** as JSON files.
    *   Through the "Save/Load" function, data flows only between your browser memory and local hard drive, never passing through any cloud database.

3.  **Chat History**:
    *   To prevent Token limits, the system automatically manages context length (retaining the last 20 messages), and these history records are used solely for maintaining context in the current session.

---

## ✨ Core Features

### 1. LLM-Driven Dynamic Narrative
*   **Infinite Freedom**: No more traditional branching options; you can input any action command, and the AI Game Master will generate real-time plot feedback.
*   **Smart Action Suggestions**: If you are unsure what to do, the AI dynamically generates 3 recommended actions based on the current situation.
*   **Deep Immersion**: The system prompts the AI to provide detailed descriptions of no less than 1000 words, delivering a Victorian Gothic reading experience.

### 2. Real-Time Status System
Sidebar data updates in real-time as the story progresses:
*   **Environmental Awareness**: Time, location, weather, and attire change based on your actions.
*   **Economic System**: Earn silver coins (¤) through internships to buy items or build connections.
*   **Three-Dimensional Attributes**: Your choices affect **Imperial Contribution**, **Society Reputation**, and **Suspicion**.
    *   ⚠️ **Warning**: When Suspicion exceeds 90%, you will be wanted by the Imperial Inquisition.

### 3. Babel Campus Life
*   **Department Internships**: Handle disputes in the Legal Department or gather intelligence in the Literature Department (some departments like Interpretation require higher grades to unlock).
*   **NPC Interaction**: Access detailed NPC archives, each with unique portraits and backstories.
*   **Event Log**: Newspaper-style event records tracking detailed occurrences.

### 4. Save & Load
*   Support for exporting current game progress as a JSON save file at any time.
*   Support for importing saves across devices to continue your adventure.

---

## 🎮 Gameplay Guide

1.  **Configuration**:
    *   Click the **Settings** icon in the top right corner.
    *   Enter your Google Gemini API Key (available for free).
    *   Select a model (default is `gemini-2.5-flash`).
    *   Click Save and test the connection.

2.  **Start Adventure**:
    *   Describe your action in the bottom input box, e.g., "Go to the library to find books on silver-working" or "Observe the professor's expression carefully."
    *   Or simply click the action suggestion buttons above the input box.

3.  **Rules of Survival**:
    *   **Empire vs. Revolution**: Every decision you make influences the balance between these two powers through subtle perturbations.
    *   **Manage Suspicion**: Avoid frequent radical activities to escape the school's attention.
    *   **Gather Resources**: Use internship opportunities to accumulate silver coins, which can save your life in critical moments.

---

## 🛠️ Tech Stack

*   **Frontend Framework**: React 18 + TypeScript + Vite
*   **Styling**: Tailwind CSS (Custom Retro Parchment Style)
*   **AI SDK**: Google Generative AI SDK
*   **Icons**: Lucide React

---

## 📜 License

MIT License. Forking and contributions are welcome!
