# ⚾ SIXPACK - 야구 커뮤니티(DUGOUT)

https://programmers-dugout.netlify.app/

## 🧑🏻‍💻👩🏻‍💻Developers

|                                                        Frontend                                                        |                                                        Frontend                                                        |                                                        Frontend                                                        |                                                        Frontend                                                        |                                                        Frontend                                                        |
| :--------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: | :--------------------------------------------------------------------------------------------------------------------: |
| <img src="https://github.com/user-attachments/assets/b84191df-d009-4730-b32f-ba4996b5b522"  width="100" height="140"/> | <img src="https://github.com/user-attachments/assets/72e19e75-5d88-453e-9dbf-66d8cfff57b4"  width="100" height='140'/> | <img src='https://github.com/user-attachments/assets/9f2b5c6a-a9c9-44ab-ad90-66ff282c4a59'  width="100" height='140'/> | <img src="https://github.com/user-attachments/assets/5ad72da8-7c26-4e25-be1b-bfc49eb9eacb"  width="100" height='140'/> | <img src="https://github.com/user-attachments/assets/b4d7bb7e-d122-4528-87bd-d947a6ddcdb4"  width="100" height='140'/> |
|                                                         강수영                                                         |                                                         박선형                                                         |                                                         이수빈                                                         |                                                         김예빈                                                         |                                                         왕정훈                                                         |
|                                     [@kangsuyeong](https://github.com/kangsuyeong)                                     |                                     [@sunhyeongpp](https://github.com/sunhyeongpp)                                     |                                  [@ddongguri-bing](https://github.com/ddongguri-bing)                                  |                                      [@engsal-bin](https://github.com/engsal-bin)                                      |                                         [@wjh1010](https://github.com/wjh1010)                                         |

<br/>

## 💻 Tech Stack

### Project setting

<img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white"> <img src="https://img.shields.io/badge/vue-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white">
<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=white"> <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white"> <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">

### DB

<img src="https://img.shields.io/badge/supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white">

### Design

  <img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">

### Etc

<img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"> <img src="https://img.shields.io/badge/slack-4A154B?style=for-the-badge&logo=slack&logoColor=white"> <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">

<br/>

## ✅ Implementation

- 카카오, 구글 소셜 로그인과 일반 로그인을 제공하며 입력 요소 미작성시 경고 메시지가 활성화되며 비밀번호 유효성에 대한 검사가 이뤄짐

- 좌측 하단 헤드셋 버튼을 호버하면 응원가 플레이바를 통해 응원가를 플레이할 수 있음

- 사용자가 원하는 구단 테마를 고르면 화면 전체에 각 구단 엠블럼 뜨며
  각 구단 테마색으로 디자인 변경되며 하단 응원가 시작 곡이 해당 구단 응원가로 변경됨

- 로그인 후 팬으로 선택한 구단의 게시판 버튼을 통해 각 게시판으로 이동하거나 하단 네비게시션바를 통해 각 구단 로고를 통해 각 구단 페이지로 이동할 수 있음

- 마이페이지이에서 자신의 응원팀과 닉네임, 프로필 설명, 프로필 사진을 설정 및 변경할 수 있으며 자신이 작성한 게시물과 댓글, 좋아요를 누른 게시물을 탭으로 전환하며 확인할 수 있음

- 각 구단 페이지에는 KBO 10개 구단의 자유게시판, 직관크루모집 게시판, 직관인증포토 게시판, 직관맛집찾기 게시판이 있으며 구단별로 메인 색상이 변경됨.

- 게시판별 필수 입력 요소가 있으며 입력 요소가 채워지지 않은 채 등록을 시도할 경우 안내 문구를 통해 혼란을 방지함

- 게시판별 특징:
  (1) 자유게시판 : 제목과 내용(텍스트 혹은 사진)을 작성해 게시글을 등록할 수 있음. 다양한 편집 스타일(글꼴 크기 정렬)을 제공함. 블로그 처럼 툴바를 통해 사진을 업로드할 수 있는 것이 특징
  (2) 직관 크루 모집 게시판 : 크루 조건(모집 상태, 경기일, 모집인원, 응원팀, 경기장소, 작성자 성별, 작성자 연령)과 게시글 내용을 작성해 게시글을 등록할 수 있음. 작성자 성별을 비공개 설정 시, 크루 성별은 자동 비공개 설정됨
  (3) 직관 인증 포토 게시판 : 제목, 내용, 경기일, 사진을 모두 작성해야 게시글을 등록할 수 있음. 사진은 1개, 게시글은 최대 500자로 사진 위주의 게시물을 지향함
  (4) 직관 맛집 찾기 게시판 : 카카오맵과 사진(3개 이하로 제한)을 통해 야구 팬들이 필요한 맛집 정보를 공유하는 것이 주 목적인 게시판임. 다양한 편집 스타일 제공.‘야구장 내부 맛집', ‘야구장 주변 맛집', ‘야구 볼 수 있는 식당'태그를 선택해 게시글을 작성하며 목록에서는 태그로 필터링해 게시물을 열람할 수 있음. 게시글에 지도 등록하지 않으면 사진을, 사진 등록하지 않으면 지도를, 모두 등록하면 사진을 목록 썸네일로 보여줌

- 인증된 사용자는 게시물을 작성할 수 있으며 수정과 삭제가 가능하며 게시물에 좋아요와 댓글을 달고 수정 삭제할 수 있음

- 각 게시판 목록에서는 검색 버튼이 나타나며 해당 버튼을 클릭하여 게시판에 대한 검사를 개별적으로 할 수 있음

- 메인 상단에서는 환영 문구와 실시간 뉴스 5개를 확인할 수 있으며 클릭하면 해당 뉴스 링크로 이동할 수 있으며, ‘더 많은 뉴스 보기' 버튼을 통해 뉴스 페이지로 이동할 수 있음. 뉴스 페이지에서 태그를 통해 각 팀이 언급된 뉴스를 필터링해 확인할 수 있음 (중복 선택 가능)

- 메인 하단은 실시간 게임 랭킹 1, 2, 3순위 사용자와 점수를 확인할 수 있음
  INSERT COIN 버튼을 통해 로그인 전 사용자는 로그인 페이지로,
  로그인한 사용자는 게임 페이지로 이동할 수 있음

- TVING SPORTS 유튜브 계정에 올라온
  KBO 하이라이트 영상을 모아 볼 수 있으며 태그를 통해 각 팀의 하이라이트 영상을 필터링과 모달을 통한 영상 플레이를 할 수 있음

- 커뮤니티의 오락성을 위해 별도의 게임 탭을 추가했으며 야구 게임, 야구 퀴즈, 야구 토너먼트를 즐길 수 있음. 야구 게임은 총 10번의 기회로 상대방의 볼 번호 4자리를 맞추는 게임이며 점수에 따라 랭킹에 기록됨. 퀴즈는 주관식 토너먼트는 객관식으로 이상형 월드컵과 비슷한 포멧임. 모든 게임은 리트라이로 재시작이 가능함

## 🗂️ Folder

```
  📦public
  📦src
 ┣ 📂api
 ┣ 📂assets
 ┣ 📂components
 ┃ ┣ 📂common
 ┃ ┣ 📂ui
 ┃ ┣ 📂crewboard
 ┃ ┣ 📂foodboard
 ┃ ┣ 📂freeboard
 ┃ ┣ 📂photoboard
 ┃ ┣ 📂highlight
 ┃ ┗ 📂mypage
 ┣ 📂constants
 ┣ 📂layouts
 ┃ ┣ BoardLayout
 ┃ ┣ GameLayout
 ┃ ┗ RootLayout
 ┣ 📂pages
 ┣ 📂router
 ┣ 📂styles
 ┣ 📂utils
 ┣ 📂stores
 ┣ App.vue
 ┣ main.js
 ┗ supabase.js


```

## 🌟 화면 구성

<table>
  <tbody>
  <!-- 메인 / 뉴스 페이지 -->
     <tr>
      <td align="center">메인 페이지</td>
      <td align="center">뉴스 페이지</td>
    </tr>
    <tr>
      <td>
         <img src="https://github.com/user-attachments/assets/a451b2f0-aa09-4f8a-a100-df1d87ab470e" alt="ligt mode" />
      </td>
      <td>
         <img src="https://github.com/user-attachments/assets/7f01fadf-0388-4895-a39a-94caa2ccec5d" alt="dark mode" />
      </td>
    </tr>
      <!-- 하이라이트 페이지 / 게임 페이지 -->
    <tr>
      <td align="center">하이라이트 페이지</td>
      <td align="center">게임 페이지</td>
    </tr>
    <tr>
      <td>
         <img src="https://github.com/user-attachments/assets/64ddccde-8ec9-4e79-8fce-ee0c9e447295" alt="ligt mode" />
      </td>
      <td>
         <img src="https://github.com/user-attachments/assets/005dffd9-6b13-45f8-a83e-8e4b9f313563" alt="dark mode" />
      </td>
    </tr>
      <!-- 로그인 / 회원가입 페이지 -->
    <tr>
      <td align="center">로그인 페이지</td>
      <td align="center">회원가입 페이지</td>
    </tr>
    <tr>
      <td>
         <img src="https://github.com/user-attachments/assets/d74a4a00-62dc-44da-ac1d-2608662c961a" alt="ligt mode" />
      </td>
      <td>
         <img src="https://github.com/user-attachments/assets/7757b732-abc9-4fb3-a296-f1b46fc2da38" alt="dark mode" />
      </td>
    </tr>
    </tr>
       <tr>
      <td align="center">게시판 페이지</td>
      <td align="center">게시판 페이지</td>
    </tr>
    <tr>
      <td>
         <img src="https://github.com/user-attachments/assets/db8eb638-3ff8-4845-9d34-af3a25ddbf51" alt="ligt mode" />
      </td>
      <td>
         <img src="https://github.com/user-attachments/assets/4c27854e-9f16-46dc-910d-6b96bdd35d70" alt="dark mode" />
      </td>
    </tr>
    <!-- 마이페이지 / 자유게시판 -->
    <tr>
      <td align="center">게시판 생성</td>
      <td align="center">마이페이지</td>
    </tr>
    <tr>
      <td>
         <img src="https://github.com/user-attachments/assets/211bb35c-cbe0-4fbc-9f2d-94349f436fc2" alt="ligt mode" />
      </td>
      <td>
         <img src="https://github.com/user-attachments/assets/707f8d52-00c4-479c-a278-bd353a8f54bb" alt="dark mode" />
      </td>

  </tbody>
</table>
