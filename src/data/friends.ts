// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
  id: number;
  title: string;
  imgurl: string;
  desc: string;
  siteurl: string;
  tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
  {
    id: 1,
    title: "Astro",
    imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
    desc: "The web framework for content-driven websites",
    siteurl: "https://github.com/withastro/astro",
    tags: ["Framework"],
  },
  {
    id: 2,
    title: "Mizuki Docs",
    imgurl:
      "http://q.qlogo.cn/headimg_dl?dst_uin=3231515355&spec=640&img_type=jpg",
    desc: "Mizuki User Manual",
    siteurl: "https://docs.mizuki.mysqil.com",
    tags: ["Docs"],
  },
  {
    id: 3,
    title: "XiaoYi",
    desc: "立志成为一名顶端后端开发者",
    siteurl: "https://xiaooyi.github.io/",
    imgurl:
      "https://sky-take-out-single.oss-cn-beijing.aliyuncs.com/hexo%E5%8D%9A%E5%AE%A2%E5%B0%81%E9%9D%A2/259a1a3cd42562cc1b899dfcab203497.jpg",
    tags: ["Friends"],
  },
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
  return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
  const shuffled = [...friendsData];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
