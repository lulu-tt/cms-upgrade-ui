// ========== 파일 분석 및 텍스트 추출 모듈 ==========

class FileAnalyzer {
	constructor() {
		this.pdfjsWorkerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
		this.initPdfJs();
	}

	initPdfJs() {
		// PDF.js 로드
		const script = document.createElement('script');
		script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
		script.onload = () => {
			if (window.pdfjsLib) {
				window.pdfjsLib.GlobalWorkerOptions.workerSrc = this.pdfjsWorkerSrc;
			}
		};
		document.head.appendChild(script);
	}

	// 텍스트 파일 읽기
	async readTextFile(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => resolve(e.target.result);
			reader.onerror = reject;
			reader.readAsText(file, 'UTF-8');
		});
	}

	// PDF 파일 읽기
	async readPdfFile(file) {
		if (!window.pdfjsLib) {
			throw new Error('PDF.js 라이브러리가 로드되지 않았습니다.');
		}

		const arrayBuffer = await this.fileToArrayBuffer(file);
		const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
		let fullText = '';

		for (let i = 1; i <= Math.min(pdf.numPages, 20); i++) { // 처음 20페이지만 추출 (용량 제한)
			const page = await pdf.getPage(i);
			const textContent = await page.getTextContent();
			const pageText = textContent.items.map(item => item.str).join(' ');
			fullText += pageText + '\n';
		}

		return fullText;
	}

	// File을 ArrayBuffer로 변환
	fileToArrayBuffer(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onload = (e) => resolve(e.target.result);
			reader.onerror = reject;
			reader.readAsArrayBuffer(file);
		});
	}

	// 이미지 OCR (Tesseract.js 사용)
	async readImageWithOCR(file) {
		// Tesseract.js 라이브러리 로드
		if (!window.Tesseract) {
			await this.loadTesseractLibrary();
		}

		const reader = new FileReader();
		return new Promise((resolve, reject) => {
			reader.onload = async (e) => {
				try {
					const { data: { text } } = await window.Tesseract.recognize(e.target.result, 'kor');
					resolve(text || '이미지에서 텍스트를 찾을 수 없습니다.');
				} catch (err) {
					reject(new Error('OCR 처리 실패: ' + err.message));
				}
			};
			reader.onerror = reject;
			reader.readAsDataURL(file);
		});
	}

	// Tesseract 라이브러리 로드
	loadTesseractLibrary() {
		return new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@v4/dist/tesseract.min.js';
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}

	// 파일 분석 (자동 포맷 감지)
	async analyzeFile(file) {
		const fileName = file.name.toLowerCase();
		const fileSize = file.size;

		// 파일 크기 제한 (50MB)
		if (fileSize > 50 * 1024 * 1024) {
			throw new Error('파일 크기가 너무 큽니다. (최대 50MB)');
		}

		let text = '';

		if (fileName.endsWith('.txt')) {
			text = await this.readTextFile(file);
		} else if (fileName.endsWith('.pdf')) {
			text = await this.readPdfFile(file);
		} else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileName.split('.').pop())) {
			// 이미지 파일 OCR 처리
			text = await this.readImageWithOCR(file);
		} else {
			// 기본적으로 텍스트로 읽기 시도
			try {
				text = await this.readTextFile(file);
			} catch (err) {
				throw new Error('지원하지 않는 파일 형식입니다. (텍스트, PDF, 이미지 지원)');
			}
		}

		return text.trim();
	}

	// 텍스트 정제 (너무 긴 경우 자르기)
	cleanText(text, maxLength = 3000) {
		// 공백 정규화
		text = text.replace(/\s+/g, ' ').trim();

		// 최대 길이 제한
		if (text.length > maxLength) {
			text = text.substring(0, maxLength) + '...';
		}

		return text;
	}
}

// 전역 인스턴스
const fileAnalyzer = new FileAnalyzer();

// ========== 첨부파일 분석 기능 (AI 에이전트 패널에서만 사용) ==========

function initFileAnalysisFeature() {
	// 첨부파일 영역의 AI 분석 버튼은 제거됨
	// AI 에이전트 패널 내 "첨부파일 분석"에서만 사용 가능
	return;
}

// AI 패널 내 분석 버튼 이벤트
function initPanelAnalysisButton() {
	const panelBtn = document.getElementById('panel-analyze-attachment-btn');
	if (!panelBtn) return;

	panelBtn.addEventListener('click', async function() {
		const fileInput = document.querySelector('input[type="file"][multiple]');
		if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
			alert('먼저 분석할 파일을 첨부해주세요.');
			return;
		}

		const file = fileInput.files[0];
		const btn = this;
		const originalHTML = btn.innerHTML;
		btn.innerHTML = '<i class="fa-solid fa-spinner text-white animate-spin"></i><span>분석 중...</span>';
		btn.disabled = true;

		try {
			console.log('패널 버튼: 파일 분석 시작:', file.name);
			let extractedText = await fileAnalyzer.analyzeFile(file);
			extractedText = fileAnalyzer.cleanText(extractedText, 3000);

			if (!extractedText) {
				throw new Error('파일에서 텍스트를 추출할 수 없습니다.');
			}

			const prompt = `다음은 교육 자료 문서의 내용입니다. 이 내용을 기반으로 전문적이고 명확한 자료설명을 작성해주세요.

자료설명은 다음 요구사항을 만족해야 합니다:
- 3-5개 문장으로 구성
- 자료의 핵심 내용을 포함
- 대상 학습자에게 도움이 될 주요 정보 포함
- 존댓말 사용
- 한국 정부 자료에 어울리는 격식 있는 문체

문서 내용:
${extractedText}

자료설명:`;

			const description = await ollamaClient.generate(prompt, document.getElementById('ai-model-select')?.value || 'gemma4:e4b');

			// 결과 텍스트영역에 표시
			const resultArea = document.getElementById('analysis-result-area');
			if (resultArea) {
				resultArea.value = description.trim();
			}

			alert('✅ 자료설명이 생성되었습니다. "분석 결과 적용" 버튼을 클릭하여 적용하세요.');

		} catch (error) {
			console.error('분석 오류:', error);
			alert(`❌ 파일 분석 실패\n\n${error.message}`);
		} finally {
			btn.innerHTML = originalHTML;
			btn.disabled = false;
		}
	});

	// 적용 버튼
	const applyBtn = document.getElementById('apply-analysis-btn');
	if (applyBtn) {
		applyBtn.addEventListener('click', function() {
			const resultArea = document.getElementById('analysis-result-area');
			if (!resultArea || !resultArea.value) {
				alert('❌ 분석된 결과가 없습니다.');
				return;
			}

			const editorContent = document.querySelector('[contenteditable="true"]');
			const codeEditor = document.getElementById('codeText');
			const codeContainer = document.getElementById('editor-code-container');

			if (codeContainer && !codeContainer.classList.contains('hidden') && codeEditor) {
				codeEditor.value = resultArea.value.trim();
			} else if (editorContent) {
				editorContent.innerHTML = resultArea.value.trim();
			} else {
				alert('❌ 자료설명 필드를 찾을 수 없습니다.');
				return;
			}

			const targetElement = editorContent || codeEditor;
			if (targetElement) {
				targetElement.classList.add('ring-2', 'ring-purple-500');
				setTimeout(() => {
					targetElement.classList.remove('ring-2', 'ring-purple-500');
				}, 2000);
			}

			alert('✅ 분석 결과가 자료설명에 적용되었습니다.');
		});
	}
}

// DOMContentLoaded 이벤트에서 초기화
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', () => {
		setTimeout(() => {
			initFileAnalysisFeature();
			initPanelAnalysisButton();
		}, 100);
	});
} else {
	setTimeout(() => {
		initFileAnalysisFeature();
		initPanelAnalysisButton();
	}, 100);
}
