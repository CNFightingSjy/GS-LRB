import { TextgenManner, } from "@/types/textgen.ts";

const textgenTypes = [
    { name: '科普测评', value: '科普测评' },
    { name: '单品测评', value: '单品测评' },
    { name: '多品测评', value: '多品测评' },
    { name: '素人真实测评', value: '素人真实测评' },
    { name: '科普内容', value: '科普内容' },
    { name: '多品测评', value: '多品测评' },
    { name: '真实分享', value: '真实分享' },
    { name: '素人真实分享', value: '素人真实分享' },
];
const textgenTypesMap = Object.freeze(Object.fromEntries(
    textgenTypes.map(item => [ item.name, item ])
));

const textgenManners = [
    { label: '好评', value: TextgenManner.Positive, color: '#10b981' },
    { label: '中立', value: TextgenManner.Neutral, color: '#3b82f6' },
    { label: '差评', value: TextgenManner.Negative, color: '#ef4444' },
];

const textgenMannersMap = Object.freeze(Object.fromEntries(
    textgenManners.map(item => [ item.value, item ])
));

const textgenTemplates = [
    {
        title: '免交智商税‼️B100瘦子菌你选对了吗',
        textType: textgenTypesMap['科普内容'],
        textManner: textgenMannersMap[TextgenManner.Neutral],
        brief: `GS B100 益生菌
产品名称与别名
正式名称: GS B100 塑形益生菌
昵称: B100 瘦子菌
核心效果
动物双歧杆菌乳亚种：有助于控制热量摄入，减少脂肪积累。
加氏乳杆菌：有助于减少肝脏脂肪积累，支持肠道屏障健康。
产品特点
高活性：每粒含有100亿XXX益生菌
耐胆汁、耐胃酸
安全包装：玻璃瓶，优良的密封性
TGA认证：澳洲专业益生菌品牌
用法简便：每天两粒，可随少于40度的温水、果汁或牛奶服用
无需冷藏：独特冷冻干燥技术，无添加防腐剂或麸质。
适用人群
适用于有需求的成年人，包括希望调整体重的人群，工作久坐的人群，以及有特定节日前体重管理需求的人群。注：孕妇不建议使用。

产品使用原理
动物双歧杆菌乳亚种有助于在肠道中控制热量摄入，减少脂肪积累。
增加“有益菌群”，减少“不良菌群”，从而达到调节体重的目的。
与其他产品的对比
相比其他产品，本产品是一种更健康的方式，不会牺牲身体健康。

备注
产品作为辅助手段，结合合适的饮食和运动，效果会更佳。`
    },
    {
        title: '我的早C晚A护肤搭配～',
        textType: textgenTypesMap['素人真实分享'],
        textManner: textgenMannersMap[TextgenManner.Neutral],
        brief: `GS肌底液
KOL撰文指引
产品主要卖点
一句话卖点：修复肌肤，增强吸收，呈现透明度
核心特点：
肌肤修复研究超过10年
独家科技——离子技术
包含6大植物成分（矢车菊、欧洲椴花、母菊花、金盏花、贯叶连翘、白花春黄菊提取物）
含有保湿和修复成分
提升肌肤自愈能力
产品简介
GS肌底液专注于肌肤修复研究超过10年，始终致力于为客户提供真正有效的护肤品。

关于肌肤pH值的科学解释
干性和老化肌肤：pH值偏碱，容易导致皮肤干燥和其他问题。
油性和问题肌肤：pH值偏酸，容易导致皮肤问题如痘痘。
健康的肌肤：pH值在4.5-6.5之间。
独家科技——离子技术
产品的独家离子技术可以适应不同皮肤的需要，从而提供“私人定制”的护肤方案。

主要成分介绍
保湿和修复成分：高效保湿，增强肌肤自愈能力。
小分子技术：使成分更易被肌肤吸收。
使用指南
正常肌肤使用方法：

干手干脸，取适量产品于手心。
揉搓6-8次。
均匀涂抹至面部。
问题肌肤使用方法：

干手干脸，取适量产品直接涂抹于问题部位。
其他部位按正常肌肤使用方法涂抹。
敏感肌肤使用方法：

干手干脸，取适量产品于手心。
揉搓6-8次。
轻轻按压至全脸，注意力度要轻柔。`,
    },
    {
        title: '8款热门肠道益生菌大测评👉🏻教你选对',
        textType: textgenTypesMap['多品测评'],
        textManner: textgenMannersMap[TextgenManner.Neutral],
        brief: `GS B100 益生菌
产品名称与别名
正式名称: GS B100 塑形益生菌
昵称: B100 瘦子菌
核心效果
动物双歧杆菌乳亚种：有助于控制热量摄入，减少脂肪积累。
加氏乳杆菌：有助于减少肝脏脂肪积累，支持肠道屏障健康。
产品特点
高活性：每粒含有100亿XXX益生菌
耐胆汁、耐胃酸
安全包装：玻璃瓶，优良的密封性
TGA认证：澳洲专业益生菌品牌
用法简便：每天两粒，可随少于40度的温水、果汁或牛奶服用
无需冷藏：独特冷冻干燥技术，无添加防腐剂或麸质。
适用人群
适用于有需求的成年人，包括希望调整体重的人群，工作久坐的人群，以及有特定节日前体重管理需求的人群。注：孕妇不建议使用。

产品使用原理
动物双歧杆菌乳亚种有助于在肠道中控制热量摄入，减少脂肪积累。
增加“有益菌群”，减少“不良菌群”，从而达到调节体重的目的。
与其他产品的对比
相比其他产品，本产品是一种更健康的方式，不会牺牲身体健康。

备注
产品作为辅助手段，结合合适的饮食和运动，效果会更佳。`
    }
]

export {
    textgenTypes,
    textgenManners,
    textgenMannersMap,
    textgenTemplates,

}