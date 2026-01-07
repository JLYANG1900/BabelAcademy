/**
 * 牛津地图位置坐标常量表
 * Oxford Map Location Coordinates Constants
 * 
 * 基于 巴别塔正文.html 中的 WORLD_LOCATIONS 数据
 * Based on WORLD_LOCATIONS data from 巴别塔正文.html
 */

import { MapLocation } from '../types';

/**
 * 牛津地图上的关键位置坐标
 * Key location coordinates on Oxford map
 * 坐标使用百分比系统 (0-100)
 */
export const WORLD_LOCATIONS: MapLocation[] = [
    // 巴别塔及校园区域
    {
        key: "巴别塔",
        aliases: ["巴别塔", "教室", "参考资料室", "教授办公室", "文学系", "文学部", "口译部", "法务部", "刻银部", "大堂", "Babel Tower", "教室楼层"],
        x: 70, y: 50
    },
    {
        key: "巴别塔学舍",
        aliases: ["的宿舍", "的房间", "的卧室", "的寝室", "宿舍", "学生宿舍", "dormitory"],
        x: 50, y: 50
    },

    // 重要住宅
    {
        key: "诺曼庄园",
        aliases: ["诺曼庄园", "诺曼家", "Norman Manor", "庄园"],
        x: 15, y: 15
    },

    // 学术与文化场所
    {
        key: "牛津辩论社",
        aliases: ["辩论社", "辩论厅", "Oxford Union"],
        x: 75, y: 75
    },
    {
        key: "博德利图书馆",
        aliases: ["博德利图书馆", "图书馆", "Bodleian Library"],
        x: 85, y: 65
    },
    {
        key: "拉德克利夫医学院",
        aliases: ["医学院", "医院", "Radcliffe Infirmary"],
        x: 70, y: 80
    },
    {
        key: "阿什莫林博物馆",
        aliases: ["博物馆", "展厅", "Ashmolean Museum"],
        x: 55, y: 40
    },

    // 户外休闲区域
    {
        key: "大学公园长椅",
        aliases: ["长椅", "公园", "University Parks"],
        x: 75, y: 20
    },
    {
        key: "植物园",
        aliases: ["植物园", "花园", "温室", "Botanic Garden"],
        x: 90, y: 25
    },
    {
        key: "艾西斯河船屋",
        aliases: ["船屋", "艾西斯河", "Isis River", "Thames"],
        x: 65, y: 30
    },
    {
        key: "波特草甸",
        aliases: ["波特草甸", "草甸", "Port Meadow"],
        x: 75, y: 15
    },

    // 社交与餐饮场所
    {
        key: "科莱特的私人沙龙",
        aliases: ["私人沙龙", "科莱特的", "salon"],
        x: 40, y: 35
    },
    {
        key: "金狮茶室",
        aliases: ["茶室", "老地方", "Golden Lion Tea Room"],
        x: 45, y: 25
    },
    {
        key: "公牛与熊酒馆",
        aliases: ["酒馆", "酒吧", "Bull and Bear", "pub"],
        x: 45, y: 90
    },
    {
        key: "学生膳堂",
        aliases: ["膳堂", "食堂", "餐厅", "Dining Hall"],
        x: 50, y: 60
    },

    // 文化娱乐
    {
        key: "谢尔登大剧院",
        aliases: ["剧院", "歌剧院", "Sheldonian Theatre"],
        x: 45, y: 45
    },

    // 商业区域
    {
        key: "布莱克威尔旧书店",
        aliases: ["书店", "布莱克威尔", "Blackwell's"],
        x: 60, y: 75
    },
    {
        key: "德罗切尔夫人高级定制店",
        aliases: ["服装店", "裁缝店", "试衣间", "Madame Drochel"],
        x: 50, y: 45
    },
    {
        key: "牛津室内市场",
        aliases: ["市场", "集市", "商店", "Covered Market"],
        x: 37, y: 80
    },

    // 基础设施
    {
        key: "牛津邮局与电报局",
        aliases: ["邮局", "电报局", "Post Office"],
        x: 10, y: 90
    },
    {
        key: "牛津火车站",
        aliases: ["车站", "站台", "Train Station"],
        x: 25, y: 80
    },

    // 特殊区域
    {
        key: "工业区工厂",
        aliases: ["工厂", "厂房", "工业区", "贫民区", "Factory District"],
        x: 15, y: 55
    },
    {
        key: "黑市巷",
        aliases: ["黑市", "走私点", "Black Market"],
        x: 25, y: 60
    },
    {
        key: "牛津城堡监狱",
        aliases: ["监狱", "地牢", "审讯室", "Oxford Castle", "Prison"],
        x: 90, y: 50
    },
    {
        key: "圣墓公墓",
        aliases: ["公墓", "墓地", "墓碑", "Cemetery"],
        x: 37, y: 25
    },
];

/**
 * 8位主角的头像配置
 * Avatar configuration for 8 main characters
 */
export const CHARACTER_AVATARS: Record<string, { url: string; aliases: string[]; statKey: string }> = {
    '埃莉诺': {
        url: 'https://i.ibb.co/XxmhT3hd/image.png',
        aliases: ['埃莉诺', '诺曼小姐', 'Eleanor', '莉诺'],
        statKey: '埃莉诺诺曼'
    },
    '关祁': {
        url: 'https://i.ibb.co/N6dhQqK9/image.png',
        aliases: ['关祁', 'Guan Qi', '关同学'],
        statKey: '关祁'
    },
    '海因里希': {
        url: 'https://i.ibb.co/8nd5P5jL/image.png',
        aliases: ['海因里希', 'Heinrich', '冯·克莱斯特', '克莱斯特'],
        statKey: '海因里希冯克莱斯特'
    },
    '科莱特': {
        url: 'https://i.ibb.co/yFqz4n1v/image.png',
        aliases: ['科莱特', 'Colette', '瓦卢瓦', '科莱特教授'],
        statKey: '科莱特瓦卢瓦'
    },
    '佩德罗': {
        url: 'https://i.ibb.co/BHTSV0bT/image.png',
        aliases: ['佩德罗', 'Pedro', '德·索萨'],
        statKey: '佩德罗德索萨'
    },
    '索菲亚': {
        url: 'https://i.ibb.co/BV8qYXQm/image.png',
        aliases: ['索菲亚', 'Sophia', '奥博连斯基'],
        statKey: '索菲亚奥博连斯基'
    },
    '源结月': {
        url: 'https://i.ibb.co/0R2bkTck/image.png',
        aliases: ['源结月', '结月', 'Yuzuki'],
        statKey: '源结月'
    },
    '威廉': {
        url: 'https://i.ibb.co/j9GvLhc6/image.png',
        aliases: ['威廉', 'William', '诺曼教授', '威廉教授'],
        statKey: '威廉诺曼'
    }
};

/**
 * 位置匹配函数 - 根据文本描述匹配地图坐标
 * Location matching function - Match map coordinates based on text description
 * 
 * @param locationText - 位置文本描述
 * @returns 匹配到的位置对象，或null
 */
export function matchLocation(locationText: string): MapLocation | null {
    if (!locationText) return null;

    const normalizedText = locationText.toLowerCase();

    for (const loc of WORLD_LOCATIONS) {
        // 首先检查主键
        if (locationText.includes(loc.key)) {
            return loc;
        }

        // 然后检查别名
        for (const alias of loc.aliases) {
            if (locationText.includes(alias) || normalizedText.includes(alias.toLowerCase())) {
                return loc;
            }
        }
    }

    return null;
}

/**
 * 根据角色名查找头像配置
 * Find avatar config by character name
 * 
 * @param characterName - 角色名称或别名
 * @returns 头像配置对象的key，或null
 */
export function findCharacterAvatarKey(characterName: string): string | null {
    if (!characterName) return null;

    for (const [key, config] of Object.entries(CHARACTER_AVATARS)) {
        if (characterName === key || characterName.includes(key)) {
            return key;
        }
        for (const alias of config.aliases) {
            if (characterName.includes(alias)) {
                return key;
            }
        }
    }

    return null;
}
