import { 
  Cpu, 
  Glasses, 
  Hand, 
  Shield, 
  Zap, 
  Database, 
  FlaskConical, 
  FileCode, 
  Sticker,
  Sword,
  Footprints
} from "lucide-react"

export const userStats = {
  name: "Adventure-001",
  level: 12,
  title: "初级探索者",
  exp: 2450,
  maxExp: 3000,
  abilities: [
    { subject: 'AI 绘画', A: 120, fullMark: 150 },
    { subject: '提示词', A: 98, fullMark: 150 },
    { subject: '编程', A: 86, fullMark: 150 },
    { subject: '逻辑', A: 99, fullMark: 150 },
    { subject: '创造力', A: 85, fullMark: 150 },
    { subject: '沟通', A: 65, fullMark: 150 },
  ],
  equipmentSlots: [
    { id: 1, type: "Head", icon: Glasses, name: "量子护目镜", rarity: "epic" },
    { id: 2, type: "Body", icon: Shield, name: "数据防护服", rarity: "rare" },
    { id: 3, type: "Hand-L", icon: Hand, name: "神经手套", rarity: "rare" },
    { id: 4, type: "Hand-R", icon: Sword, name: "代码光剑", rarity: "legendary" },
    { id: 5, type: "Legs", icon: Footprints, name: "光速靴", rarity: "common" },
    { id: 6, type: "Acc", icon: Cpu, name: "算力核心", rarity: "epic" },
  ],
  backpack: [
    { id: 101, name: "经验药水", count: 5, icon: FlaskConical, desc: "增加 500 点经验值" },
    { id: 102, name: "算力碎片", count: 12, icon: Zap, desc: "用于升级装备", slotType: "Acc" },
    { id: 103, name: "模型权重", count: 1, icon: Database, desc: "稀有的模型微调材料", slotType: "Body" },
    { id: 104, name: "未鉴定的代码", count: 3, icon: FileCode, desc: "可能包含强大的算法", slotType: "Hand-R" },
    { id: 105, name: "全息贴纸", count: 8, icon: Sticker, desc: "装饰你的个人主页" },
    { id: 106, name: "随机种子", count: 42, icon: Zap, desc: "改变生成的随机性" },
  ]
}
