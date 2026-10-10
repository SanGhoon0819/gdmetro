# GD메트로타워 마스터 템플릿

별도 프로젝트입니다. 기존 운영 사이트를 수정하거나 해당 현장의 접수 주소·GA4 ID를 사용하지 않습니다.

Node.js만 필요합니다. 이 폴더에서 `npm run build`, `npm run preview`를 실행하면 http://127.0.0.1:4173 에서 확인할 수 있습니다. `npm test`는 독립 페이지·자료 제외·배포 차단·접수 검증을 검사합니다.

현장 변경은 `site.config.json`에서 브랜드, 전화, 문구, 사업개요, 프리미엄, 이미지 파일명과 승인 자료를 바꿉니다. 공통 구조와 동작은 `build.mjs`, `src/style.css`, `src/app.js`에 있습니다. `dist`는 재생성되는 고객용 파일입니다. 제작 보고나 README, 설정 원본, backend, tests를 웹 서버에 올리지 않습니다.

공개용 파일 생성은 `npm run release`입니다. 도메인·이미지 승인 근거·GD 접수 주소·승인된 개인정보 안내·GA4 ID가 빠지면 실패합니다. 공개 배포 기능은 포함하지 않았으며 사용자의 별도 배포 승인 후 진행합니다.

원문 링크 카드는 `{kind:"external-link",title,publisher,date,url,linkApproved:true}`로 추가합니다. 최신순 정렬하며 처음 9건, 더보기마다 9건씩 표시합니다. 전재가 승인된 애드버토리얼 기사는 `articles` 배열에 `{kind:"advertorial",title,publisher,date,url,rightsApproved:true,approvalReference}`로 추가합니다. 기사 전문이나 이미지는 복제하지 않고 제목과 원문 링크를 표시합니다. 영상 모듈은 포함하지 않습니다.

GD 전용 Google Sheets를 새로 만들고 전용 Apps Script에 `backend/Code.gs`를 넣습니다. Script Properties의 `GD_SPREADSHEET_ID`에 GD 시트 ID를 설정합니다. 보유기간을 확정한 후 `GD_RETENTION_DAYS`와 `deleteExpiredLeads`의 일일 트리거를 설정합니다. Web App 배포 주소를 `contact.endpoint`에 입력하고 승인된 수집 주체·연락처·보유기간을 설정한 뒤 `privacyApproved:true`로 변경합니다. 기존 현장 주소를 재사용하지 않습니다. 실제 Google Web App의 CORS 응답과 저장 결과는 연결 후 별도 실검증이 필요합니다.

GA4의 `generate_lead`를 주요 이벤트로 설정합니다. `click_to_call`은 전화 링크 클릭만 의미하며 실제 통화 완료를 증명하지 않습니다. `form_start`, `form_error`도 기록합니다. 입력한 이름·전화·문의내용은 분석 이벤트로 보내지 않습니다. UTM은 세션 저장 후 페이지 이동과 접수 시 유지됩니다. 파워링크 예: `/?utm_source=naver&utm_medium=cpc&utm_campaign=gdmetro&utm_content=powerlink&utm_term=키워드`. 네이버 자체 전환 태그는 계정 코드가 없어 포함하지 않았습니다.

도메인을 `baseUrl`에 입력하고 release 빌드 시 canonical·OG URL·sitemap·robots가 생성됩니다. 구글/네이버 소유확인 코드를 설정한 후 각 검색 관리 도구에 사이트맵을 제출합니다. HTML에 제목·본문·사업정보가 직접 포함되어 JS 실행 없이 읽을 수 있습니다. 이미지 안의 세부 문구는 모두 텍스트화하지 않았으므로 후속 전사가 필요합니다. 검색 순위는 보장하지 않습니다.

