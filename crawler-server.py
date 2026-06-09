#!/usr/bin/env python3
"""
웹사이트 크롤링 서버
포트: 5000
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
import time

app = Flask(__name__)
CORS(app)

class WebCrawler:
    def __init__(self, timeout=10):
        self.timeout = timeout
        self.visited = set()
        self.content = []

    def is_valid_url(self, url):
        """URL 유효성 검사"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False

    def should_crawl(self, url, base_domain, exclude_patterns):
        """크롤링 대상 확인"""
        # 이미 방문한 URL 제외
        if url in self.visited:
            return False

        # 도메인 확인
        parsed = urlparse(url)
        if parsed.netloc != base_domain:
            return False

        # 제외 패턴 확인
        for pattern in exclude_patterns:
            if pattern.strip() in url:
                return False

        return True

    def extract_text(self, html):
        """HTML에서 텍스트 추출"""
        soup = BeautifulSoup(html, 'html.parser')

        # 스크립트, 스타일 제거
        for script in soup(['script', 'style']):
            script.decompose()

        # 텍스트 추출
        text = soup.get_text()

        # 여러 줄 공백 제거
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)

        return text.strip()

    def crawl(self, url, scope='root', exclude_patterns=None):
        """웹사이트 크롤링"""
        if not self.is_valid_url(url):
            return {'error': '유효하지 않은 URL입니다', 'content': ''}

        if exclude_patterns is None:
            exclude_patterns = []

        base_domain = urlparse(url).netloc
        base_path = '/' if scope == 'root' else ''

        try:
            # 홈페이지 크롤링
            response = requests.get(url, timeout=self.timeout)
            response.encoding = 'utf-8'

            if response.status_code != 200:
                return {'error': f'HTTP {response.status_code}', 'content': ''}

            # 텍스트 추출
            text = self.extract_text(response.text)
            if text:
                self.content.append(text)

            self.visited.add(url)

            # scope가 'all'이면 링크 따라가기
            if scope == 'all':
                soup = BeautifulSoup(response.text, 'html.parser')

                for link in soup.find_all('a', href=True):
                    link_url = urljoin(url, link['href'])
                    # 쿼리 문자열 제거
                    link_url = link_url.split('#')[0]

                    if self.should_crawl(link_url, base_domain, exclude_patterns):
                        try:
                            sub_response = requests.get(link_url, timeout=self.timeout)
                            sub_response.encoding = 'utf-8'

                            if sub_response.status_code == 200:
                                sub_text = self.extract_text(sub_response.text)
                                if sub_text:
                                    self.content.append(f"\n【 {link_url} 】\n{sub_text}")
                                self.visited.add(link_url)
                        except:
                            continue

                        # 너무 많은 페이지 크롤링 방지
                        if len(self.visited) > 10:
                            break

            combined_content = '\n\n'.join(self.content)
            return {
                'success': True,
                'content': combined_content,
                'pages_crawled': len(self.visited),
                'error': None
            }

        except requests.exceptions.Timeout:
            return {'error': '요청 시간 초과', 'content': ''}
        except requests.exceptions.ConnectionError:
            return {'error': '연결 오류 - 웹사이트에 접근할 수 없습니다', 'content': ''}
        except Exception as e:
            return {'error': f'크롤링 실패: {str(e)}', 'content': ''}

@app.route('/api/crawl', methods=['POST'])
def crawl():
    """웹사이트 크롤링 API"""
    data = request.json

    url = data.get('url', '').strip()
    scope = data.get('scope', 'root')
    exclude = data.get('exclude', '')

    if not url:
        return jsonify({'error': 'URL을 입력하세요', 'content': ''}), 400

    # URL에 프로토콜 추가
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    exclude_patterns = [p.strip() for p in exclude.split(',') if p.strip()]

    crawler = WebCrawler()
    result = crawler.crawl(url, scope, exclude_patterns)

    return jsonify(result)

@app.route('/health', methods=['GET'])
def health():
    """헬스 체크"""
    return jsonify({'status': 'healthy', 'service': 'crawler-server'})

if __name__ == '__main__':
    print("🕷️  웹 크롤러 서버 시작...")
    print("📍 포트: 5000")
    print("🔗 API: http://localhost:5000/api/crawl")
    app.run(host='localhost', port=5000, debug=False)
