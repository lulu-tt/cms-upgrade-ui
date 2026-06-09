// ========== Ollama 통합 모듈 ==========
// 모든 페이지에서 사용 가능한 Ollama 연동 라이브러리

class OllamaClient {
	constructor() {
		this.url = localStorage.getItem('ollamaUrl') || 'http://localhost:11434';
		this.connected = false;
		this.init();
	}

	async init() {
		await this.checkConnection();
	}

	async checkConnection(retries = 3) {
		for (let i = 0; i < retries; i++) {
			try {
				const controller = new AbortController();
				const timeoutId = setTimeout(() => controller.abort(), 5000);

				const response = await fetch(`${this.url}/api/tags`, {
					method: 'GET',
					mode: 'cors',
					credentials: 'omit',
					signal: controller.signal
				});

				clearTimeout(timeoutId);

				if (response.ok) {
					this.connected = true;
					console.log('✅ Ollama 연결 성공:', this.url);
					return true;
				}
			} catch (error) {
				console.warn(`⚠️ Ollama 연결 시도 ${i + 1}/${retries} 실패:`, error.message);
				if (i < retries - 1) {
					await new Promise(resolve => setTimeout(resolve, 1000));
				}
			}
		}

		this.connected = false;
		console.error('❌ Ollama 연결 실패:', this.url);
		return false;
	}

	setUrl(newUrl) {
		this.url = newUrl.trim();
		localStorage.setItem('ollamaUrl', this.url);
		return this.checkConnection();
	}

	async generate(prompt, model = 'gemma4:e4b') {
		if (!this.connected) {
			const reconnected = await this.checkConnection();
			if (!reconnected) {
				throw new Error('Ollama에 연결할 수 없습니다. 설정을 확인해주세요.');
			}
		}

		try {
			const controller = new AbortController();
			const timeoutId = setTimeout(() => controller.abort(), 60000);

			const response = await fetch(`${this.url}/api/generate`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				mode: 'cors',
				credentials: 'omit',
				signal: controller.signal,
				body: JSON.stringify({
					model: model,
					prompt: prompt,
					stream: false,
					temperature: 0.7,
					top_p: 0.9,
				})
			});

			clearTimeout(timeoutId);

			if (!response.ok) {
				throw new Error(`HTTP ${response.status}: ${response.statusText}`);
			}

			const data = await response.json();
			return data.response;
		} catch (error) {
			console.error('Ollama 호출 오류:', error);

			let errorMsg = error.message;
			if (error.name === 'AbortError') {
				errorMsg = '요청 시간 초과 (60초). 모델이 응답하지 않습니다.\n\n확인 사항:\n• Ollama가 실행 중인가?\n• ollama list로 모델이 설치되어 있는가?\n• 모델이 처음 로드되면 시간이 더 걸릴 수 있습니다.';
			}

			throw new Error(`${errorMsg}`);
		}
	}

	getStatus() {
		return this.connected
			? '<i class="fa-solid fa-circle text-green-500 text-[6px]"></i> Ollama 연결됨'
			: '<i class="fa-solid fa-circle text-red-500 text-[6px]"></i> Ollama 연결 실패';
	}
}

// 전역 Ollama 클라이언트 인스턴스
const ollamaClient = new OllamaClient();

// 유틸리티 함수들
function updateOllamaStatus(elementId) {
	const el = document.getElementById(elementId);
	if (el) {
		const statusHtml = ollamaClient.getStatus();
		el.innerHTML = ollamaClient.connected
			? statusHtml
			: `<div class="flex items-center gap-1.5">
					${statusHtml}
					<button class="text-[9px] underline text-red-600 hover:text-red-700 ml-1" onclick="showOllamaSettings()">설정</button>
				</div>`;
	}
}

function showOllamaSettings() {
	const newUrl = prompt('Ollama URL을 입력하세요:\n(기본값: http://localhost:11434)', ollamaClient.url);
	if (newUrl && newUrl.trim()) {
		ollamaClient.setUrl(newUrl).then(() => {
			// UI 업데이트 (페이지별로 다를 수 있음)
			const statusEl = document.getElementById('ollama-status');
			if (statusEl) {
				updateOllamaStatus('ollama-status');
			}
			alert('✅ Ollama 설정이 저장되었습니다.');
		});
	}
}

// 페이지 로드 완료 후 상태 업데이트
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		updateOllamaStatus('ollama-status');
	});
} else {
	updateOllamaStatus('ollama-status');
}
