# 🛡️ JB Compliance Frontend

금융 문서 검토와 컴플라이언스 업무를 지원하는 AI 기반 웹 애플리케이션입니다.

사용자는 문서를 업로드하여 AI 검토를 요청하고, 규정 기반 질의응답, 교육자료 생성, 캘린더 및 알림 기능을 하나의 플랫폼에서 사용할 수 있습니다.

---

## ✨ 주요 기능

### 📄 AI 문서 검토

* PDF, DOCX, TXT 문서 업로드
* AI 기반 준법 검토 요청
* 위험 문장 및 수정 제안 확인
* 검토 결과 보고서 다운로드

### 💬 AI 컴플라이언스 채팅

* 규정 기반 질의응답
* 추천 질문 제공
* 관련 근거 문서 확인

### 🎓 교육 콘텐츠

* 교육자료 생성
* 포스터 문구 생성
* 교육 안내 문구 생성

### 📅 일정 및 알림

* 컴플라이언스 일정 관리
* 알림 생성 및 관리

### 📊 대시보드

* 드래그 앤 드롭 위젯 관리
* 사용자 맞춤형 업무 화면 제공

---

## 🛠 Tech Stack

| Category         | Technology             |
| ---------------- | ---------------------- |
| Framework        | React 18, Vite         |
| Language         | TypeScript             |
| Routing          | React Router DOM       |
| Styling          | Tailwind CSS           |
| State Management | Zustand, React Context |
| Drag & Drop      | React DnD              |
| Icons            | Lucide React           |

---

## 🚀 Getting Started

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

기본 실행 주소

```text
http://127.0.0.1:5174
```

### Build

```bash
npm run build
```

---

## 📂 Project Structure

```text
src
├── components
├── pages
├── routes
├── services
├── store
├── context
├── hooks
├── types
├── utils
└── styles
```

---

## 📌 Main Pages

| Route              | Description  |
| ------------------ | ------------ |
| /login             | 로그인          |
| /home              | 대시보드         |
| /review            | AI 문서 검토     |
| /question          | AI 컴플라이언스 채팅 |
| /library           | 작업 이력        |
| /education-content | 교육 콘텐츠       |
| /calendar          | 캘린더          |
| /notifications     | 알림           |
| /settings          | 설정           |

---

## 📢 Notes

* 인증 정보는 localStorage에 저장됩니다.
* 일부 화면은 Mock Data를 사용합니다.
* 백엔드 API가 실행 중이어야 주요 기능을 사용할 수 있습니다.
