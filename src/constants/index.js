import doosanLogo from "@/assets/images/logo_doosan.svg";
import gameIcon from "@/assets/images/baseballgame_logo.svg";
import gameIconBlack from "@/assets/images/baseballgame_logo_black.svg";
import hanhwaLogo from "@/assets/images/logo_hanhwa.svg";
import kiaLogo from "@/assets/images/logo_kia.svg";
import kiwoomLogo from "@/assets/images/logo_kiwoom.svg";
import ktLogo from "@/assets/images/logo_kt.svg";
import lgLogo from "@/assets/images/logo_lg.svg";
import lotteLogo from "@/assets/images/logo_lotte.svg";
import ncLogo from "@/assets/images/logo_nc.svg";
import quizIcon from "@/assets/images/quiz_logo.svg";
import quizIconBlack from "@/assets/images/quiz_logo_black.svg";
import samsungLogo from "@/assets/images/logo_samsung.svg";
import ssgLogo from "@/assets/images/logo_ssg.svg";
import tournamentIcon from "@/assets/images/tournament-logo.svg";
import tournamentIconBlack from "@/assets/images/tournament_logo_black.svg";

export const teamList = [
  {
    name: "kia",
    path: "/kia/freeboard",
    logo: kiaLogo,
    nickname: "Tigers",
    koreanName: "타이거즈",
  },
  {
    name: "samsung",
    path: "/samsung/freeboard",
    logo: samsungLogo,
    nickname: "Lions",
    koreanName: "라이온즈",
  },
  {
    name: "lg",
    path: "/lg/freeboard",
    logo: lgLogo,
    nickname: "Twins",
    koreanName: "트윈스",
  },
  {
    name: "doosan",
    path: "/doosan/freeboard",
    logo: doosanLogo,
    nickname: "Bears",
    koreanName: "베어스",
  },
  {
    name: "kt",
    path: "/kt/freeboard",
    logo: ktLogo,
    nickname: "Wiz",
    koreanName: "위즈",
  },
  {
    name: "ssg",
    path: "/ssg/freeboard",
    logo: ssgLogo,
    nickname: "Landers",
    koreanName: "랜더스",
  },
  {
    name: "lotte",
    path: "/lotte/freeboard",
    logo: lotteLogo,
    nickname: "Giants",
    koreanName: "자이언츠",
  },
  {
    name: "hanhwa",
    path: "/hanhwa/freeboard",
    logo: hanhwaLogo,
    nickname: "Eagles",
    koreanName: "이글스",
  },
  {
    name: "nc",
    path: "/nc/freeboard",
    logo: ncLogo,
    nickname: "Dinos",
    koreanName: "다이노스",
  },
  {
    name: "kiwoom",
    path: "/kiwoom/freeboard",
    logo: kiwoomLogo,
    nickname: "Heros",
    koreanName: "히어로즈",
  },
];

export const gameList = [
  {
    name: "야구 게임",
    path: "baseballgame",
    icon: gameIcon,
    iconBlack: gameIconBlack,
  },
  {
    name: "야구 퀴즈",
    path: "quizselect",
    icon: quizIcon,
    iconBlack: quizIconBlack,
  },
  {
    name: "야구 토너먼트",
    path: "tournamentselect",
    icon: tournamentIcon,
    iconBlack: tournamentIconBlack,
  },
];

export const teamsTags = [
  "# LG 트윈스",
  "# KT 위즈",
  "# 삼성 라이온즈",
  "# KIA 타이거즈",
  "# 키움 히어로즈",
  "# 한화 이글스",
  "# NC 다이노스",
  "# 롯데 자이언츠",
  "# SSG 랜더스",
  "# 두산 베어스",
];

export const teamID = {
  lg: 1,
  doosan: 2,
  kiwoom: 3,
  ssg: 4,
  nc: 5,
  kia: 6,
  hanhwa: 7,
  lotte: 8,
  samsung: 9,
  kt: 10,
};

export const foodBoardTag = [
  "# 야구장 내부 맛집",
  "# 야구장 주변 맛집",
  "# 야구 볼 수 있는 식당",
];

export const boardToTableMapping = {
  freeboard: "free_post",
  crewboard: "crew_recruitment_post",
  photoboard: "viewing_certification_post",
  foodboard: "restaurant_post",
};

export const teamByClubID = {
  1: "LG 트윈스",
  2: "두산 베어스",
  3: "키움 히어로즈",
  4: "SSG 랜더스",
  5: "NC 다이노스",
  6: "기아 타이거즈",
  7: "한화 이글스",
  8: "롯데 자이언츠",
  9: "삼성 라이온즈",
  10: "KT 위즈",
};

export const teamColors = {
  "LG 트윈스": "#C30452",
  "두산 베어스": "#1A1748",
  "키움 히어로즈": "#570514",
  "SSG 랜더스": "#CE0E2D",
  "NC 다이노스": "#315288",
  "기아 타이거즈": "#EA0029",
  "한화 이글스": "#F04E00",
  "롯데 자이언츠": "#041E42",
  "삼성 라이온즈": "#074CA1",
  "KT 위즈": "#EB1C24",
};
