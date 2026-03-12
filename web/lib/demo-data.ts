export interface PetProfile {
  id: string;
  name: string;
  breed: string;
  age: string;
  gender: "male" | "female";
  personality: string[];
  bio: string;
  photo: string;
  owner: string;
  ownerAvatar: string;
  distance: string;
  likes: number;
  comments: number;
  shares: number;
  bookmarks: number;
  views: number;
  musicName: string;
}

export const demoPets: PetProfile[] = [
  {
    id: "1",
    name: "Lucky",
    breed: "金毛寻回犬",
    age: "3岁",
    gender: "male",
    personality: ["活泼", "友善", "聪明"],
    bio: "阳光开朗的大暖男，最爱在公园追球球！每天都充满活力，见到谁都摇尾巴~ #宠物日常 #金毛",
    photo: "/pets/golden.png",
    owner: "小明爱宠物",
    ownerAvatar: "🧑",
    distance: "1.2km",
    likes: 23412,
    comments: 1568,
    shares: 892,
    bookmarks: 3421,
    views: 184200,
    musicName: "原声 - 小明爱宠物",
  },
  {
    id: "2",
    name: "橘子",
    breed: "橘猫",
    age: "2岁",
    gender: "female",
    personality: ["慵懒", "粘人", "贪吃"],
    bio: "一只有态度的橘猫公主~平时喜欢窝在毯子上晒太阳，但偶尔也会疯跑一下 #橘猫 #猫咪日常",
    photo: "/pets/cat.png",
    owner: "Lily的猫窝",
    ownerAvatar: "👩",
    distance: "0.8km",
    likes: 37821,
    comments: 2315,
    shares: 1543,
    bookmarks: 5672,
    views: 267800,
    musicName: "A Beautiful Day - 轻音乐合集",
  },
  {
    id: "3",
    name: "雪球",
    breed: "萨摩耶",
    age: "1岁",
    gender: "male",
    personality: ["活泼", "粘人", "爱笑"],
    bio: "微笑天使本使！最爱在雪地里撒欢，永远都是开心的表情，看到就治愈 #萨摩耶 #微笑天使",
    photo: "/pets/samoyed.png",
    owner: "阿花养宠记",
    ownerAvatar: "👧",
    distance: "3.5km",
    likes: 51203,
    comments: 3891,
    shares: 2156,
    bookmarks: 8934,
    views: 432100,
    musicName: "Happy Puppy - 宠物BGM",
  },
  {
    id: "4",
    name: "豆豆",
    breed: "法国斗牛犬",
    age: "4岁",
    gender: "male",
    personality: ["呆萌", "安静", "忠诚"],
    bio: "街头最靓的仔！戴上领结就是派对动物，摘下就是安静美男子 #法斗 #呆萌",
    photo: "/pets/frenchie.png",
    owner: "大刘的狗子",
    ownerAvatar: "🧔",
    distance: "2.1km",
    likes: 18934,
    comments: 971,
    shares: 567,
    bookmarks: 2134,
    views: 156700,
    musicName: "Cool Dog Walking - 街头节拍",
  },
  {
    id: "5",
    name: "Storm",
    breed: "哈士奇",
    age: "2岁",
    gender: "male",
    personality: ["独立", "冒险", "戏精"],
    bio: "拆家小能手，越狱专业户。但那双蓝眼睛一看，什么都原谅了 #哈士奇 #拆家现场",
    photo: "/pets/husky.png",
    owner: "老王家的二哈",
    ownerAvatar: "👨",
    distance: "5.0km",
    likes: 45678,
    comments: 3124,
    shares: 4521,
    bookmarks: 7856,
    views: 523400,
    musicName: "Dramatic Husky - 搞笑配乐",
  },
];
