# GD메트로타워 검색 노출 검토

2026-10-10 검토. 현재는 로컬 검수본이며 공개 웹 배포 및 검색등록은 수행하지 않았습니다.

| 항목 | 확인 결과 |
|---|---|
| 독립 URL | 홈 및 6개 상세 페이지 생성 |
| HTML 본문 | 사업개요 9항목, 프리미엄 5개 내용과 기사 링크가 HTML에 포함 |
| 제목·설명 | 페이지별 고유 제목·구체적인 설명 메타 적용 |
| 모바일 | 반응형 레이아웃 및 모바일 이미지 사용 |
| canonical·사이트맵 | 최종 도메인 설정 시 페이지별 URL 생성; 도메인 미정으로 현재 비워 둠 |
| robots | 로컬은 noindex/nofollow와 Disallow; 공개용 빌드에서 허용 |
| 이미지·폰트 | 첫 히어로 우선 로드, 나머지 지연 로드, 폰트 사전 로드 |
| 이미지 크기 | JPEG/PNG 원본 35개 합계 약 16.9MB. 큰 PC 히어로 약 2.1MB. 이미지 추가 압축은 미수행; 실제 모바일 성능 측정 필요 |
| GA4·UTM | 코드 및 모의검증 통과. GD GA4 ID/접수 주소 미연결, 실제 수신은 미검증 |
| 네이버 전환 | 네이버 자체 전환 코드 미제공; 파워링크 UTM 및 전화 클릭 추적만 구현 |
| 검색관리 도구 | 네이버·구글 소유 확인, 사이트맵 제출은 도메인 확정 후 진행 |
| 자동검증 | 8개 통과. 가상 도메인 공개 빌드에서 canonical·사이트맵 7개 URL 확인 |

기본 기술 구조는 준비되었으나 검색 수집·색인, 상위 노출 또는 파워링크 검수 통과를 확인한 상태는 아닙니다. 입지 이미지 안의 세부 문구 전체를 HTML로 전사하지는 않았습니다. 세대타입은 준비중 상태입니다. 공식 이미지 재사용 근거와 개인정보 안내 확정, 도메인 및 실제 연동 검증은 공개 배포 전에 완료해야 합니다.

기준: [네이버 SEO 기본 가이드](https://searchadvisor.naver.com/guide/seo-help), [네이버 사이트 제작 가이드](https://searchadvisor.naver.com/guide/seo-basic-create), [Google JavaScript SEO](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

