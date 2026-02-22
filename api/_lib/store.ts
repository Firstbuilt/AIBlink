import { KnowledgeItem, UpdateItem, RiskReport } from './types';

// In-memory store for demo purposes (would be a DB in production)
// Seeding with some initial data relevant to Feb 2026
export let knowledgeBase: KnowledgeItem[] = [
  {
    id: "kb-1",
    title: { en: "EU AI Act", cn: "欧盟人工智能法案" },
    type: "Legislation",
    jurisdiction: { en: "EU", cn: "欧盟" },
    date: "2024-06-12", // Official publication date approx
    summary: {
      en: "The comprehensive AI law is now fully applicable for prohibited practices and GPAI governance. High-risk system obligations are phasing in.",
      cn: "这部全面的人工智能法律现已完全适用于禁止行为和通用人工智能（GPAI）治理。高风险系统的义务正在逐步实施。"
    },
    url: "https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:32024R1689"
  },
  {
    id: "kb-2",
    title: { en: "GDPR", cn: "通用数据保护条例" },
    type: "Legislation",
    jurisdiction: { en: "EU", cn: "欧盟" },
    date: "2018-05-25",
    summary: {
      en: "The foundational privacy law. Recent enforcement focuses on automated decision-making and data scraping for AI training.",
      cn: "基础隐私法律。近期的执法重点在于自动化决策和用于AI训练的数据抓取。"
    },
    url: "https://eur-lex.europa.eu/eli/reg/2016/679/oj"
  },
  {
    id: "kb-5",
    title: { en: "AI Office: GPAI Code of Practice", cn: "AI办公室：通用人工智能行为准则" },
    type: "Guidance",
    jurisdiction: { en: "EU", cn: "欧盟" },
    date: "2025-04-10",
    summary: {
      en: "Finalized code of practice for providers of general-purpose AI models, detailing transparency and copyright compliance.",
      cn: "针对通用人工智能模型提供者的最终行为准则，详细说明了透明度和版权合规性。"
    },
    url: "https://digital-strategy.ec.europa.eu/en/policies/ai-office"
  },
  {
    id: "kb-6",
    title: { en: "CNIL Guidelines on AI Development", cn: "CNIL关于AI开发的指南" },
    type: "Guidance",
    jurisdiction: { en: "France", cn: "法国" },
    date: "2025-10-05",
    summary: {
      en: "Updated recommendations on 'legitimate interest' as a legal basis for training AI models on personal data.",
      cn: "关于将'合法利益'作为在个人数据上训练AI模型的法律依据的更新建议。"
    },
    url: "https://www.cnil.fr/en/topic/artificial-intelligence"
  },
  {
    id: "kb-7",
    title: { en: "CEN-CENELEC Harmonised Standards Draft", cn: "CEN-CENELEC协调标准草案" },
    type: "Standard",
    jurisdiction: { en: "EU", cn: "欧盟" },
    date: "2025-12-20",
    summary: {
      en: "Draft standards for risk management and data governance in high-risk AI systems, expected to be harmonized by mid-2026.",
      cn: "高风险AI系统风险管理和数据治理的标准草案，预计将于2026年中期协调统一。"
    },
    url: "https://www.cencenelec.eu/"
  },
  {
    id: "kb-8",
    title: { en: "BfDI Position Paper on LLMs", cn: "BfDI关于大型语言模型的立场文件" },
    type: "Guidance",
    jurisdiction: { en: "Germany", cn: "德国" },
    date: "2026-01-10",
    summary: {
      en: "German Federal Commissioner's stance on the 'right to be forgotten' in the context of unlearning for LLMs.",
      cn: "德国联邦专员关于大型语言模型（LLM）背景下'被遗忘权'（遗忘学习）的立场。"
    },
    url: "https://www.bfdi.bund.de/"
  }
];

export let updates: UpdateItem[] = [
  {
    id: "up-8",
    date: "2026-01-25",
    title: { en: "Google Gemini 2 Privacy Audit", cn: "Google Gemini 2隐私审计" },
    source: "Irish DPC",
    content: {
      en: "The Irish DPC has concluded its preliminary audit of Google's Gemini 2 model, requiring enhanced opt-in mechanisms for processing user interactions history.",
      cn: "爱尔兰DPC已结束对Google Gemini 2模型的初步审计，要求针对处理用户交互历史记录增强选择加入机制。"
    },
    analysis: {
      en: "Even established players are facing granular requirements on data retention and user control.",
      cn: "即使是老牌厂商也面临着关于数据保留和用户控制的细粒度要求。"
    },
    parties: [
      { name: "Irish DPC", type: "Regulator" },
      { name: "Google", type: "Company" },
      { name: "Gemini 2", type: "Product" }
    ],
    url: "https://www.dataprotection.ie/"
  },
  {
    id: "up-3",
    date: "2026-01-15",
    title: { en: "First AI Act Fine Issued", cn: "首张AI法案罚单开出" },
    source: "Spanish AEPD",
    content: {
      en: "The Spanish AEPD, acting as the market surveillance authority, fined a retailer for using prohibited emotion recognition AI in stores.",
      cn: "作为市场监管机构的西班牙AEPD对一家零售商处以罚款，因其在店内使用被禁止的情绪识别AI。"
    },
    analysis: {
      en: "Signals the start of strict enforcement on 'unacceptable risk' AI systems. Retail and HR sectors are under high scrutiny.",
      cn: "标志着对'不可接受风险'AI系统开始严格执法。零售和人力资源部门受到高度审查。"
    },
    parties: [
      { name: "AEPD", type: "Regulator" },
      { name: "RetailCo", type: "Company" }
    ],
    url: "https://www.aepd.es/"
  },
  {
    id: "up-4",
    date: "2025-12-10",
    title: { en: "Meta Pauses AI Training in EU", cn: "Meta暂停在欧盟的AI训练" },
    source: "Reuters",
    content: {
      en: "Following objections from the Irish DPC, Meta has agreed to pause using public content from Facebook/Instagram users in the EU to train its Llama 4 models.",
      cn: "在爱尔兰DPC提出异议后，Meta同意暂停使用欧盟Facebook/Instagram用户的公开内容来训练其Llama 4模型。"
    },
    analysis: {
      en: "Reaffirms that 'opt-out' models for data training are being challenged. Consent or strictly defined legitimate interest is becoming the only viable path.",
      cn: "重申数据训练的'退出'模式正受到挑战。同意或严格定义的合法利益正成为唯一可行的途径。"
    },
    parties: [
      { name: "Irish DPC", type: "Regulator" },
      { name: "Meta", type: "Company" },
      { name: "Llama 4", type: "Product" }
    ],
    url: "https://www.reuters.com/"
  },
  {
    id: "up-5",
    date: "2026-01-28",
    title: { en: "DeepSeek Faces GDPR Inquiry", cn: "DeepSeek面临GDPR质询" },
    source: "Politico EU",
    content: {
      en: "German and French DPAs have launched a joint inquiry into DeepSeek's data processing practices for EU users, specifically regarding cross-border data transfers to China.",
      cn: "德国和法国的数据保护机构已对DeepSeek针对欧盟用户的数据处理做法展开联合质询，特别是关于向中国跨境传输数据的问题。"
    },
    analysis: {
      en: "Non-EU foundation models are facing increasing scrutiny on data sovereignty and transfer mechanisms (SCCs).",
      cn: "非欧盟基础模型在数据主权和传输机制（SCCs）方面正面临越来越多的审查。"
    },
    parties: [
      { name: "BfDI", type: "Regulator" },
      { name: "CNIL", type: "Regulator" },
      { name: "DeepSeek", type: "Company" }
    ],
    url: "https://www.politico.eu/"
  },
  {
    id: "up-6",
    date: "2026-01-20",
    title: { en: "OpenAI Implements New Age Checks", cn: "OpenAI实施新的年龄验证" },
    source: "TechCrunch",
    content: {
      en: "To comply with the Italian Garante's orders and the DSA, OpenAI has rolled out stricter age verification for ChatGPT users across the EU.",
      cn: "为了遵守意大利Garante的命令和数字服务法案（DSA），OpenAI已在欧盟范围内为ChatGPT用户推出了更严格的年龄验证措施。"
    },
    analysis: {
      en: "Child safety remains a top priority for regulators. AI platforms must demonstrate robust age-gating, not just self-declaration.",
      cn: "儿童安全仍然是监管机构的首要任务。AI平台必须证明其拥有强大的年龄门槛，而不仅仅是自我声明。"
    },
    parties: [
      { name: "Garante Privacy", type: "Regulator" },
      { name: "OpenAI", type: "Company" },
      { name: "ChatGPT", type: "Product" }
    ],
    url: "https://techcrunch.com/"
  },
  {
    id: "up-7",
    date: "2026-02-01",
    title: { en: "Mistral AI Certification Audit", cn: "Mistral AI认证审计" },
    source: "Les Echos",
    content: {
      en: "French champion Mistral AI has voluntarily submitted its latest 'Large' model for early conformity assessment under the AI Act to demonstrate sovereign compliance.",
      cn: "法国领军企业Mistral AI已自愿提交其最新的'Large'模型，根据AI法案进行早期合规性评估，以展示主权合规性。"
    },
    analysis: {
      en: "European companies are using compliance as a competitive differentiator against US/Chinese rivals.",
      cn: "欧洲公司正在将合规性作为对抗美国/中国竞争对手的差异化竞争优势。"
    },
    parties: [
      { name: "Mistral AI", type: "Company" }
    ],
    url: "https://www.lesechos.fr/"
  },
  {
    id: "up-1",
    date: "2024-05-21",
    title: { en: "Council of EU approves AI Act", cn: "欧盟理事会批准AI法案" },
    source: "Council of the EU",
    content: {
      en: "The Council of the EU has formally adopted the Artificial Intelligence Act. This is the final step in the legislative process.",
      cn: "欧盟理事会已正式通过《人工智能法案》。这是立法程序的最后一步。"
    },
    analysis: {
      en: "Historical milestone. While old news in 2026, it set the stage for the current compliance landscape.",
      cn: "历史性里程碑。虽然在2026年已是旧闻，但它为当前的合规环境奠定了基础。"
    },
    parties: [
      { name: "Council of the EU", type: "Regulator" }
    ],
    url: "https://www.consilium.europa.eu/en/press/press-releases/2024/05/21/artificial-intelligence-ai-act-council-gives-final-green-light-to-the-first-worldwide-rules-on-ai/"
  }
];

export let riskReport: RiskReport = {
  lastUpdated: "2026-02-21",
  score: "Medium",
  summary: {
    en: [
      "Enforcement has broadened beyond GDPR to specific AI Act violations. The 'DeepSeek' inquiry highlights the EU's focus on data sovereignty and cross-border transfers for non-EU models.",
      "Major players like OpenAI, Google, and Meta are adapting by implementing stricter age-gating and pausing training on EU data, setting a precedent for 'compliance by design' in the region.",
      "The regulatory landscape is fragmenting slightly as national authorities (Germany, France, Spain) take the lead on specific issues like 'right to be forgotten' in LLMs and biometric surveillance."
    ],
    cn: [
      "执法范围已从GDPR扩展到具体的AI法案违规行为。'DeepSeek'质询突显了欧盟对非欧盟模型的数据主权和跨境传输的关注。",
      "OpenAI、Google和Meta等主要参与者正在通过实施更严格的年龄门槛和暂停在欧盟数据上的训练来适应，为该地区的'设计合规'树立了先例。",
      "随着国家当局（德国、法国、西班牙）在LLM中的'被遗忘权'和生物识别监控等具体问题上占据主导地位，监管环境略显分散。"
    ]
  },
  // Stats will be calculated dynamically in the API
  stats: {
    legislation: { 
      label: { en: "Active Bills/Acts", cn: "现行法案/草案" },
      count: 0, 
      trend: "stable"
    },
    enforcement: {
      label: { en: "Enforcement Actions", cn: "执法行动 (2025-26)" },
      count: 0, 
      trend: "up"
    }
  },
  focusAreas: [
    { 
      name: { en: "Cross-Border Data", cn: "跨境数据" }, 
      summary: { 
        en: "Transferring EU user data to non-adequate jurisdictions (e.g., China, US without DPF) for model inference or training is under intense scrutiny.", 
        cn: "将欧盟用户数据传输到非充分管辖区（如中国、未加入DPF的美国）进行模型推理或训练正受到严密审查。" 
      },
      citation: "GDPR Ch. V",
      relatedEvents: [
         { title: { en: "DeepSeek GDPR Inquiry", cn: "DeepSeek GDPR质询" }, url: "https://www.politico.eu/" }
      ]
    },
    { 
      name: { en: "Prohibited AI", cn: "被禁AI" }, 
      summary: { 
        en: "Biometric categorization and emotion recognition in workplaces/schools are banned. First enforcement actions have targeted retail.", 
        cn: "工作场所/学校中的生物识别分类和情绪识别被禁止。首批执法行动已针对零售业。" 
      },
      citation: "AI Act Art. 5",
      relatedEvents: [
         { title: { en: "First AI Act Fine Issued", cn: "首张AI法案罚单开出" }, url: "https://www.aepd.es/" }
      ]
    },
    { 
      name: { en: "GPAI Transparency", cn: "GPAI透明度" }, 
      summary: { 
        en: "Providers must maintain detailed technical documentation and comply with EU copyright law. The 'opt-out' mechanism for TDM is under legal review.", 
        cn: "提供者必须维护详细的技术文档并遵守欧盟版权法。文本数据挖掘（TDM）的'退出'机制正在接受法律审查。" 
      },
      citation: "AI Act Art. 53",
      relatedEvents: [
        { title: { en: "Mistral AI Certification", cn: "Mistral AI认证" }, url: "https://www.lesechos.fr/" }
      ]
    },
    { 
      name: { en: "Child Safety", cn: "儿童安全" }, 
      summary: { 
        en: "Strict age verification is required for AI services accessible to minors. Self-declaration is no longer considered sufficient compliance.", 
        cn: "面向未成年人的AI服务需要严格的年龄验证。自我声明不再被视为充分合规。" 
      },
      citation: "DSA Art. 28",
      relatedEvents: [
        { title: { en: "OpenAI Age Checks", cn: "OpenAI年龄验证" }, url: "https://techcrunch.com/" }
      ]
    },
    { 
      name: { en: "Data Scraping", cn: "数据抓取" }, 
      summary: { 
        en: "Legitimate interest is increasingly rejected as a basis for scraping public web data for training. Explicit consent or contracts are preferred.", 
        cn: "合法利益作为抓取公共网络数据进行训练的依据正日益被驳回。明确同意或合同更为可取。" 
      },
      citation: "GDPR Art. 6",
      relatedEvents: [
        { title: { en: "Meta Pauses AI Training", cn: "Meta暂停AI训练" }, url: "https://www.reuters.com/" }
      ]
    }
  ]
};

// Helper to recalculate stats
export function recalculateStats() {
  riskReport.stats.legislation.count = knowledgeBase.length;
  riskReport.stats.enforcement.count = updates.length;
}

// Initial calculation
recalculateStats();

export function setKnowledgeBase(newData: KnowledgeItem[]) {
  knowledgeBase = newData;
}

export function setUpdates(newData: UpdateItem[]) {
  updates = newData;
}

export function setRiskReport(newData: RiskReport) {
  riskReport = newData;
}
