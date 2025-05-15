/**
 * 拼音测评游戏数据
 * 包含三个难度级别：简单(easy)、中等(medium)和困难(hard)
 * 每个条目包含汉字(character)和对应的拼音(pinyin)
 *
 * 声调标记说明：
 * - 阴平(第1声)：平调，用 ā ē ī ō ū ǖ 表示
 * - 阳平(第2声)：升调，用 á é í ó ú ǘ 表示
 * - 上声(第3声)：降升调，用 ǎ ě ǐ ǒ ǔ ǚ 表示
 * - 去声(第4声)：降调，用 à è ì ò ù ǜ 表示
 */
const pinyinData = {
  // 简单级别：单声母+单韵母拼音和常见汉字
  easy: [
    { character: "妈", pinyin: "mā" },
    { character: "爸", pinyin: "bà" },
    { character: "水", pinyin: "shuǐ" },
    { character: "火", pinyin: "huǒ" },
    { character: "山", pinyin: "shān" },
    { character: "天", pinyin: "tiān" },
    { character: "人", pinyin: "rén" },
    { character: "手", pinyin: "shǒu" },
    { character: "口", pinyin: "kǒu" },
    { character: "大", pinyin: "dà" },
    { character: "小", pinyin: "xiǎo" },
    { character: "上", pinyin: "shàng" },
    { character: "下", pinyin: "xià" },
    { character: "木", pinyin: "mù" },
    { character: "土", pinyin: "tǔ" },
    { character: "日", pinyin: "rì" },
    { character: "月", pinyin: "yuè" },
    { character: "鱼", pinyin: "yú" },
    { character: "鸟", pinyin: "niǎo" },
    { character: "羊", pinyin: "yáng" },
    { character: "猫", pinyin: "māo" },
    { character: "狗", pinyin: "gǒu" },
    { character: "马", pinyin: "mǎ" },
    { character: "牛", pinyin: "niú" },
    { character: "猪", pinyin: "zhū" }
  ],

  // 中等级别：多音节拼音和常用词汇
  medium: [
    { character: "老师", pinyin: "lǎo shī" },
    { character: "朋友", pinyin: "péng yǒu" },
    { character: "学校", pinyin: "xué xiào" },
    { character: "家庭", pinyin: "jiā tíng" },
    { character: "公园", pinyin: "gōng yuán" },
    { character: "超市", pinyin: "chāo shì" },
    { character: "医院", pinyin: "yī yuàn" },
    { character: "书包", pinyin: "shū bāo" },
    { character: "电脑", pinyin: "diàn nǎo" },
    { character: "电话", pinyin: "diàn huà" },
    { character: "汽车", pinyin: "qì chē" },
    { character: "飞机", pinyin: "fēi jī" },
    { character: "火车", pinyin: "huǒ chē" },
    { character: "自行车", pinyin: "zì xíng chē" },
    { character: "苹果", pinyin: "píng guǒ" },
    { character: "香蕉", pinyin: "xiāng jiāo" },
    { character: "西瓜", pinyin: "xī guā" },
    { character: "上学", pinyin: "shàng xué" },
    { character: "放学", pinyin: "fàng xué" },
    { character: "早上", pinyin: "zǎo shang" },
    { character: "中午", pinyin: "zhōng wǔ" },
    { character: "晚上", pinyin: "wǎn shang" }
  ],

  // 困难级别：复杂拼音和词语
  hard: [
    { character: "美丽", pinyin: "měi lì" },
    { character: "高兴", pinyin: "gāo xìng" },
    { character: "难过", pinyin: "nán guò" },
    { character: "聪明", pinyin: "cōng míng" },
    { character: "勇敢", pinyin: "yǒng gǎn" },
    { character: "认真", pinyin: "rèn zhēn" },
    { character: "努力", pinyin: "nǔ lì" },
    { character: "团结", pinyin: "tuán jié" },
    { character: "友好", pinyin: "yǒu hǎo" },
    { character: "骄傲", pinyin: "jiāo ào" },
    { character: "诚实", pinyin: "chéng shí" },
    { character: "独立", pinyin: "dú lì" },
    { character: "安静", pinyin: "ān jìng" },
    { character: "活泼", pinyin: "huó pō" },
    { character: "健康", pinyin: "jiàn kāng" },
    { character: "快乐", pinyin: "kuài lè" },
    { character: "幸福", pinyin: "xìng fú" },
    { character: "温暖", pinyin: "wēn nuǎn" },
    { character: "感谢", pinyin: "gǎn xiè" },
    { character: "关心", pinyin: "guān xīn" },
    { character: "保护", pinyin: "bǎo hù" },
    { character: "环保", pinyin: "huán bǎo" },
    { character: "科学", pinyin: "kē xué" },
    { character: "文化", pinyin: "wén huà" },
    { character: "艺术", pinyin: "yì shù" },
    // 四字成语
    { character: "一丝不苟", pinyin: "yī sī bù gǒu" },
    { character: "鞠躬尽瘁", pinyin: "jū gōng jìn cuì" },
    { character: "锲而不舍", pinyin: "qiè ér bù shě" },
    { character: "画蛇添足", pinyin: "huà shé tiān zú" },
    { character: "守株待兔", pinyin: "shǒu zhū dài tù" },
    // 包含多音字的词组
    { character: "朝三暮四", pinyin: "zhāo sān mù sì" },
    { character: "银行行长", pinyin: "yín háng háng zhǎng" },
    { character: "数量难数", pinyin: "shù liàng nán shǔ" },
    { character: "乐器演奏曲", pinyin: "yuè qì yǎn zòu qǔ" },
    { character: "不假思索", pinyin: "bù jiǎ sī suǒ" },
    // 专业领域词汇
    { character: "人工智能", pinyin: "rén gōng zhì néng" },
    { character: "量子物理", pinyin: "liàng zǐ wù lǐ" },
    { character: "经济学理论", pinyin: "jīng jì xué lǐ lùn" },
    { character: "分子生物学", pinyin: "fēn zǐ shēng wù xué" },
    { character: "认知心理学", pinyin: "rèn zhī xīn lǐ xué" },
    // 包含生僻字的词语
    { character: "蹉跎岁月", pinyin: "cuō tuó suì yuè" },
    { character: "犄角旮旯", pinyin: "jī jiǎo gā lá" },
    { character: "饕餮盛宴", pinyin: "tāo tiè shèng yàn" },
    { character: "囹圄之苦", pinyin: "líng yǔ zhī kǔ" },
    { character: "踽踽独行", pinyin: "jǔ jǔ dú xíng" },
    // 多音节复杂词汇
    { character: "不可思议", pinyin: "bù kě sī yì" },
    { character: "百花齐放", pinyin: "bǎi huā qí fàng" },
    { character: "五光十色", pinyin: "wǔ guāng shí sè" },
    { character: "无可厚非", pinyin: "wú kě hòu fēi" },
    { character: "自强不息", pinyin: "zì qiáng bù xī" },
    // 新增高难度词汇 (Action 2-1)
    // 四字成语
    { character: "胸有成竹", pinyin: "xiōng yǒu chéng zhú" },
    { character: "再接再厉", pinyin: "zài jiē zài lì" },
    { character: "莫名其妙", pinyin: "mò míng qí miào" },
    { character: "画龙点睛", pinyin: "huà lóng diǎn jīng" },
    // 包含多音字的词组
    { character: "便宜行事", pinyin: "biàn yí xíng shì" },
    { character: "大发横财", pinyin: "dà fā hèng cái" },
    { character: "音乐曲调", pinyin: "yīn yuè qǔ diào" },
    { character: "应付差事", pinyin: "yìng fu chāi shi" },
    // 专业领域词汇
    { character: "基因编辑", pinyin: "jī yīn biān jí" },
    { character: "神经元网络", pinyin: "shén jīng yuán wǎng luò" },
    { character: "宏观经济", pinyin: "hóng guān jīng jì" },
    { character: "存在主义", pinyin: "cún zài zhǔ yì" },
    // 包含生僻字的词语
    { character: "魑魅魍魉", pinyin: "chī mèi wǎng liǎng" },
    { character: "沆瀣一气", pinyin: "hàng xiè yī qì" },
    { character: "龃龉不合", pinyin: "jǔ yǔ bù hé" },
    { character: "佶屈聱牙", pinyin: "jí qū áo yá" },
    // 多音节复杂词汇
    { character: "相辅相成", pinyin: "xiāng fǔ xiāng chéng" },
    { character: "错综复杂", pinyin: "cuò zōng fù zá" },
    { character: "潜移默化", pinyin: "qián yí mò huà" },
    { character: "源远流长", pinyin: "yuán yuǎn liú cháng" }
  ]
};

// 如果在Node.js环境中，导出模块
if (typeof module !== 'undefined' && module.exports) {
  module.exports = pinyinData;
}
