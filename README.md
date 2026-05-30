# LinkValue - 폐쇄형 공동구매+투자 플랫폼

> 사람을 잇다, 가치를 만든다

## 🚀 배포 가이드 (코드 몰라도 됩니다!)

### Step 1. Supabase 설정 (데이터베이스)

1. [supabase.com](https://supabase.com) 접속 → 무료 계정 가입
2. **New Project** 클릭 → 프로젝트 이름: `linkvalue`, 비밀번호 설정
3. 프로젝트 생성 완료 후 → 좌측 메뉴 **SQL Editor** 클릭
4. `supabase-schema.sql` 파일 내용을 복사해서 붙여넣기 → **Run** 클릭
5. 좌측 메뉴 **Settings > API** 에서:
   - `Project URL` 복사해두기
   - `anon public` key 복사해두기

### Step 2. GitHub에 코드 올리기

1. [github.com](https://github.com) 계정 생성 (없으면)
2. **New repository** 클릭 → 이름: `linkvalue` → Create
3. 화면에 나온 코드 중 `git init` ~ `git push` 명령어 복사
4. 컴퓨터 터미널(맥: Spotlight에서 "터미널" 검색)에서 이 폴더로 이동 후 실행

```bash
# 이 프로젝트 폴더로 이동
cd linkvalue
git init
git add .
git commit -m "첫 배포"
git remote add origin https://github.com/본인아이디/linkvalue.git
git push -u origin main
```

### Step 3. Vercel 배포

1. [vercel.com](https://vercel.com) 접속 → GitHub 계정으로 로그인
2. **New Project** → GitHub의 `linkvalue` 저장소 선택
3. **Environment Variables** 섹션에서 아래 두 개 입력:
   - `NEXT_PUBLIC_SUPABASE_URL` = Step 1에서 복사한 Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Step 1에서 복사한 anon key
4. **Deploy** 클릭 → 2~3분 후 완료!
5. 완료되면 `xxx.vercel.app` 주소가 생성됨 ✅

### Step 4. 관리자 계정 설정

1. 앱 접속 → 회원가입 (관리자로 쓸 이메일로)
2. Supabase Dashboard → **Table Editor** → `profiles` 테이블
3. 본인 이메일 행 찾아서 `role` 컬럼을 `admin`으로 변경
4. 저장 → 앱 로그아웃 후 다시 로그인 → MY 탭에서 **관리자 페이지** 메뉴 확인!

---

## 📱 기능 목록

| 기능 | 설명 |
|------|------|
| 로그인/회원가입 | 이메일+비밀번호, 자동 프로필 생성 |
| 홈 화면 | 배너, 퀵메뉴, 투자/공동구매 상품 미리보기 |
| 공동구매 목록 | 카테고리 필터, 검색, 할인율 표시 |
| 투자 목록 | 탭 필터 (모집중/상환중/완료), 진행률 표시 |
| 상품 상세 | 상세 정보, 진행률, 계좌 복사, 주문 신청 |
| 주문 신청 | 수량/금액 선택, 메모, 계좌 안내 |
| MY 페이지 | 프로필 카드, 총 투자금, 신청 내역 |
| 관리자 - 상품 등록 | 공동구매/투자 상품 등록·수정·삭제 |
| 관리자 - 주문 관리 | 신청 목록 조회, 상태 변경 (검토중→확정) |
| 혜택 페이지 | 멤버십 혜택 안내 |

## 🎨 디자인 특징

- **네이비 + 골드** 럭셔리 컬러 시스템
- **모바일 우선** (최대 430px, 앱처럼 동작)
- 골드 shimmer 애니메이션
- 진행률 바 애니메이션
- PWA 지원 (홈 화면에 추가 가능)

## 🛠 기술 스택

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Backend/DB**: Supabase (PostgreSQL + Auth + Storage)
- **Hosting**: Vercel

