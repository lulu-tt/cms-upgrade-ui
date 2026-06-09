# Ollama 연동 가이드

모든 페이지에서 Ollama AI 기능을 사용할 수 있도록 설정했습니다.

## 🚀 빠른 시작

### 1단계: 웹 서버 실행
```bash
cd /Users/aaa/inseq/cms_upgrade
python3 -m http.server 8000
```

### 2단계: Ollama 실행 (새 터미널)
```bash
OLLAMA_ORIGINS=* ollama serve
```

### 3단계: 브라우저 접속
```
http://localhost:8000/api-monitor-register.html
```

---

## 📝 페이지에 Ollama 추가하기

### 기본 설정 (1단계)
HTML 파일의 `</body>` 태그 전에 다음을 추가하세요:

```html
<script src="js/ollama-integration.js"></script>
```

### AI 에이전트 UI 추가 (선택사항)

AI 에이전트 기능을 원하는 페이지에는 다음 코드를 추가하세요:

#### 1. 헤더에 AI 버튼 추가
```html
<button type="button" id="ai-agent-toggle" class="px-4 py-2 text-xs font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition flex items-center gap-1.5">
	<i class="fa-solid fa-wand-magic-sparkles"></i>
	<span>AI 에이전트</span>
</button>
```

#### 2. Ollama 상태 표시 (선택사항)
```html
<div class="text-[9px] text-slate-500 mt-1.5 flex items-center gap-1">
	<span id="ollama-status">Ollama 연결 확인 중...</span>
</div>
```

#### 3. JavaScript에서 사용
```javascript
// Ollama 텍스트 생성
async function generateText(prompt) {
	try {
		const result = await ollamaClient.generate(prompt, 'gemma4:e4b');
		console.log('생성 결과:', result);
	} catch (error) {
		console.error('오류:', error.message);
	}
}

// Ollama 연결 확인
if (ollamaClient.connected) {
	console.log('✅ Ollama 연결됨');
} else {
	console.log('❌ Ollama 연결 실패');
}
```

---

## 🔧 주요 객체 및 메서드

### `ollamaClient` 객체

#### 프로퍼티
- `ollamaClient.url` — Ollama 서버 URL
- `ollamaClient.connected` — 연결 상태 (boolean)

#### 메서드

**연결 확인**
```javascript
await ollamaClient.checkConnection();  // 재연결 시도
```

**URL 변경**
```javascript
await ollamaClient.setUrl('http://192.168.1.100:11434');
```

**텍스트 생성**
```javascript
const result = await ollamaClient.generate(
	'한국 정부 공지사항의 제목을 생성하세요.',
	'gemma4:e4b'  // 모델명
);
```

**상태 조회**
```javascript
const statusHtml = ollamaClient.getStatus();  // HTML 문자열 반환
```

---

## 📂 디렉토리 구조

```
/Users/aaa/inseq/cms_upgrade/
├── js/
│   └── ollama-integration.js  ← Ollama 통합 라이브러리
├── api-monitor-register.html  ← (✅ 이미 적용됨)
├── untydata-register.html     ← (필요시 추가)
├── chatbot-settings.html      ← (필요시 추가)
└── ...
```

---

## ❌ 문제 해결

### "Ollama 연결 실패" 메시지가 나타나는 경우

1. **웹 서버 확인**
   ```bash
   # 정말 http://localhost:8000에서 실행 중인가?
   curl http://localhost:8000/api-monitor-register.html
   ```

2. **Ollama 실행 확인**
   ```bash
   # Ollama가 실행 중인가?
   curl http://localhost:11434/api/tags
   ```

3. **CORS 설정 확인**
   ```bash
   # OLLAMA_ORIGINS 환경변수 설정했는가?
   OLLAMA_ORIGINS=* ollama serve
   ```

4. **모델 다운로드 확인**
   ```bash
   ollama list  # 설치된 모델 확인
   ```

---

## 🎯 추천 모델

| 모델 | 크기 | 속도 | 품질 |
|-----|------|------|------|
| `gemma4:e4b` | 8.0B | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| `qwen2.5:7b` | 7.6B | ⭐⭐⭐ | ⭐⭐⭐ |
| `llama3.2:3b` | 3.2B | ⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 💡 사용 사례

### 요약 생성
```javascript
const prompt = `다음 내용을 요약하세요:\n${content}`;
const summary = await ollamaClient.generate(prompt, 'gemma4:e4b');
```

### 번역
```javascript
const prompt = `다음을 영어로 번역하세요:\n${content}`;
const translated = await ollamaClient.generate(prompt, 'gemma4:e4b');
```

### 문체 교정
```javascript
const prompt = `다음 문장을 격식 있는 한국어로 교정하세요:\n${content}`;
const corrected = await ollamaClient.generate(prompt, 'gemma4:e4b');
```
