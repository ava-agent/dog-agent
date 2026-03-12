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
}

export const demoPets: PetProfile[] = [
  {
    id: "1",
    name: "Lucky",
    breed: "金毛寻回犬",
    age: "3岁",
    gender: "male",
    personality: ["活泼", "友善", "聪明"],
    bio: "阳光开朗的大暖男，最爱在公园追球球！每天都充满活力，见到谁都摇尾巴~",
    photo: "/pets/golden.png",
    owner: "小明",
    ownerAvatar: "🧑",
    distance: "1.2km",
    likes: 2341,
    comments: 156,
  },
  {
    id: "2",
    name: "橘子",
    breed: "橘猫",
    age: "2岁",
    gender: "female",
    personality: ["慵懒", "粘人", "贪吃"],
    bio: "一只有态度的橘猫公主~平时喜欢窝在毯子上晒太阳，但偶尔也会疯跑一下",
    photo: "/pets/cat.png",
    owner: "Lily",
    ownerAvatar: "👩",
    distance: "0.8km",
    likes: 3782,
    comments: 231,
  },
  {
    id: "3",
    name: "雪球",
    breed: "萨摩耶",
    age: "1岁",
    gender: "male",
    personality: ["活泼", "粘人", "爱笑"],
    bio: "微笑天使本使！最爱在雪地里撒欢，永远都是开心的表情，看到就治愈",
    photo: "/pets/samoyed.png",
    owner: "阿花",
    ownerAvatar: "👧",
    distance: "3.5km",
    likes: 5120,
    comments: 389,
  },
  {
    id: "4",
    name: "豆豆",
    breed: "法国斗牛犬",
    age: "4岁",
    gender: "male",
    personality: ["呆萌", "安静", "忠诚"],
    bio: "街头最靓的仔！戴上领结就是派对动物，摘下就是安静美男子",
    photo: "/pets/frenchie.png",
    owner: "大刘",
    ownerAvatar: "🧔",
    distance: "2.1km",
    likes: 1893,
    comments: 97,
  },
  {
    id: "5",
    name: "Storm",
    breed: "哈士奇",
    age: "2岁",
    gender: "male",
    personality: ["独立", "冒险", "戏精"],
    bio: "拆家小能手，越狱专业户。但那双蓝眼睛一看，什么都原谅了",
    photo: "/pets/husky.png",
    owner: "老王",
    ownerAvatar: "👨",
    distance: "5.0km",
    likes: 4567,
    comments: 312,
  },
];
