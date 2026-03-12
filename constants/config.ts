export const APP_CONFIG = {
  name: "PawPal",
  displayName: "宠友圈",
  version: "1.0.0",
  maxVideoSize: 100 * 1024 * 1024, // 100MB
  maxImageSize: 10 * 1024 * 1024, // 10MB
  videoDurationLimit: 60, // seconds
  feedPageSize: 10,
  matchingPageSize: 20,
  messagesPageSize: 30,
  maxPetsPerUser: 5,
  maxPhotosPerPet: 9,
  defaultMatchingDistance: 50, // km
} as const;

export const PERSONALITY_TRAITS = [
  "活泼好动",
  "温顺乖巧",
  "聪明伶俐",
  "调皮捣蛋",
  "粘人",
  "独立",
  "胆小",
  "勇敢",
  "贪吃",
  "爱撒娇",
  "社交达人",
  "高冷",
] as const;

export const PET_SPECIES = [
  { value: "dog", label: "狗狗" },
  { value: "cat", label: "猫咪" },
  { value: "bird", label: "鸟儿" },
  { value: "rabbit", label: "兔子" },
  { value: "hamster", label: "仓鼠" },
  { value: "other", label: "其他" },
] as const;

export const PET_SIZES = [
  { value: "tiny", label: "迷你" },
  { value: "small", label: "小型" },
  { value: "medium", label: "中型" },
  { value: "large", label: "大型" },
  { value: "giant", label: "巨型" },
] as const;
