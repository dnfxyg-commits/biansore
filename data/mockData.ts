
import { Exhibition, NewsItem } from '../types';

export interface ExhibitionCenter {
  id: string;
  name: string;
  nameEn?: string;
  location: string;
  address: string;
  area: string;
  description: string;
  imageUrl: string;
  facilities: string[];
  region: string;
  country: string;
  city: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: 'eVTOL' | 'Cargo Drone' | 'Consumer Drone' | 'Infrastructure' | 'Components';
  imageUrl: string;
  description: string;
  specs: { label: string; value: string }[];
  status: 'In Production' | 'Concept' | 'Certified';
}

export const BLOG_POSTS: NewsItem[] = [
  {
    id: 'b1',
    title: '播客：Flight Kinetics公司的莱斯特·厄尔斯谈如何提升eVTOL飞机的航程和有效载荷',
    summary: '探讨如何通过电池管理和气动优化在复杂的城市环境中提升飞行效率。',
    date: '2026年1月15日',
    author: '杰森·普里查德',
    source: '特邀专家',
    tags: ['精选', '播客'],
    imageUrl: '' // Top post doesn't always need a large image if it's text focused
  },
  {
    id: 'b2',
    title: '女性在先进空中交通领域中的播客：特蕾西·兰姆博士谈先进空中交通领域的安全、监管和公众信任',
    summary: '兰姆博士分享了她在航空安全管理方面的数十年经验。',
    date: '2026年1月8日',
    author: '杰森·普里查德',
    source: '特邀专家',
    tags: ['精选', '播客'],
    imageUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b3',
    title: '播客：地平线飞机公司的布兰登·罗宾逊谈混合动力电动垂直起降飞行器为何在航程和可靠性竞赛中胜出',
    summary: '混合动力系统是解决当前电池技术瓶颈的最优路径。',
    date: '2025年12月11日',
    author: '杰森·普里查德',
    source: '特邀专家',
    tags: ['精选', '播客'],
    imageUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b4',
    title: '女性航空制造商播客：垂直航空国际公司的安珀·哈里森解读美国联邦航空管理局第108部分分规划',
    summary: '深入分析最新的监管框架对制造商的市场准入影响。',
    date: '2025年12月4日',
    author: '杰森·普里查德',
    source: '特邀专家',
    tags: ['精选', '消息', '播客', 'AAM中的女性'],
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800'
  }
];

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'AeroSky V2',
    brand: 'Vista Dynamics',
    category: 'eVTOL',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    description: 'Next-generation electric vertical takeoff and landing aircraft designed for urban air mobility with 4-passenger capacity.',
    status: 'Certified',
    specs: [
      { label: 'Range', value: '250 km' },
      { label: 'Max Speed', value: '320 km/h' },
      { label: 'Payload', value: '450 kg' }
    ]
  },
  {
    id: 'p2',
    name: 'SwiftDeliver 50',
    brand: 'LogiFly',
    category: 'Cargo Drone',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&q=80&w=800',
    description: 'Autonomous cargo drone specialized for medical supply delivery in remote areas with extreme weather resistance.',
    status: 'In Production',
    specs: [
      { label: 'Flight Time', value: '45 mins' },
      { label: 'Max Cargo', value: '50 kg' },
      { label: 'Connectivity', value: '5G / Satellite' }
    ]
  },
  {
    id: 'p3',
    name: 'VertiHub One',
    brand: 'SkyPort Systems',
    category: 'Infrastructure',
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800',
    description: 'Modular vertiport solution with integrated fast-charging systems and automated passenger check-in terminals.',
    status: 'Concept',
    specs: [
      { label: 'Charging Power', value: '1.2 MW' },
      { label: 'Capacity', value: '12 eVTOLs/hr' },
      { label: 'Footprint', value: '1500 m²' }
    ]
  },
  {
    id: 'p4',
    name: 'Falcon Eye X',
    brand: 'VisionAir',
    category: 'Consumer Drone',
    imageUrl: 'https://images.unsplash.com/photo-1524143909107-a412f3830740?auto=format&fit=crop&q=80&w=800',
    description: 'Ultra-lightweight photography drone with 8K resolution and 360-degree obstacle avoidance.',
    status: 'In Production',
    specs: [
      { label: 'Weight', value: '249g' },
      { label: 'Camera', value: '8K HDR' },
      { label: 'Range', value: '12 km' }
    ]
  },
  {
    id: 'p5',
    name: 'PulseMotor G3',
    brand: 'AeroTech Components',
    category: 'Components',
    imageUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800',
    description: 'High-efficiency brushless motor designed specifically for high-torque eVTOL applications.',
    status: 'Certified',
    specs: [
      { label: 'Efficiency', value: '98.5%' },
      { label: 'Weight', value: '4.2 kg' },
      { label: 'Peak Power', value: '85 kW' }
    ]
  }
];

export const EXHIBITION_CENTERS: ExhibitionCenter[] = [
  {
    id: 'sh1',
    name: '上海国际展览中心',
    location: '中国-上海',
    address: '上海市长宁区娄山关路88号',
    area: '12000平方米',
    region: 'China',
    country: '中国',
    city: '上海',
    description: '上海市中心标志性的专业展览馆，交通便利，配套齐全。',
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800',
    facilities: ['多功能厅', '媒体中心']
  },
  {
    id: 'sh2',
    name: '上海新国际博览中心',
    nameEn: 'Shanghai New International Expo Centre',
    location: '中国-上海',
    address: '上海市浦东新区龙阳路2345号',
    area: '300000平方米',
    region: 'China',
    country: '中国',
    city: '上海',
    description: '中国最领先的展览中心之一，拥有17个单层无柱展厅。',
    imageUrl: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&q=80&w=800',
    facilities: ['5G全覆盖', '大型停车场', '装卸区']
  },
  {
    id: 'sh3',
    name: '上海证大丽笙酒店',
    nameEn: 'Radisson Blu Hotel Pudong Century Park',
    location: '中国-上海',
    address: '上海市浦东新区迎春路1199号',
    area: '5000平方米',
    region: 'China',
    country: '中国',
    city: '上海',
    description: '高端商务会议酒店，适合中小型低空经济峰会。',
    imageUrl: 'https://images.unsplash.com/photo-1517404215738-15263e9f9178?auto=format&fit=crop&q=80&w=800',
    facilities: ['精品展厅', '商务服务']
  },
  {
    id: 'sh4',
    name: '上海展览中心 SEC',
    nameEn: 'Shanghai Exhibition Center SEC',
    location: '中国-上海',
    address: '上海市静安区延安中路1000号',
    area: '22000平方米',
    region: 'China',
    country: '中国',
    city: '上海',
    description: '具有浓厚俄罗斯风格的宏伟建筑，上海地标性展馆。',
    imageUrl: 'https://images.unsplash.com/photo-1548919973-5dea58593ad3?auto=format&fit=crop&q=80&w=800',
    facilities: ['中央大厅', '友谊会堂']
  },
  {
    id: 'sz1',
    name: '深圳国际会展中心 (宝安)',
    location: '中国-深圳',
    address: '深圳市宝安区展城路1号',
    area: '500000平方米',
    region: 'China',
    country: '中国',
    city: '深圳',
    description: '全球最大的会展中心之一，低空经济核心展示基地。',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    facilities: ['无人机试飞场', '多功能厅']
  }
];

export const EXHIBITIONS: Exhibition[] = [
  {
    id: '1',
    title: '2024 International Drone Expo (IDE)',
    location: 'Los Angeles, USA',
    date: 'Dec 12 - 14, 2024',
    description: 'The world’s leading trade show for commercial drone technology and urban air mobility.',
    imageUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800',
    category: 'Drone',
    featured: true,
    coordinates: { lat: 34.0522, lng: -118.2437 },
    region: 'Americas',
    websiteUrl: 'https://www.intdroneexpo.com/'
  },
  {
    id: '2',
    title: '深圳世界低空经济博览会',
    location: '深圳, 中国',
    date: 'May 20 - 22, 2025',
    description: '全球低空经济核心展示平台，聚焦无人机制造与低空基础设施。',
    imageUrl: 'https://images.unsplash.com/photo-1521747116042-5a810fda9664?auto=format&fit=crop&q=80&w=800',
    category: 'Regulatory',
    featured: true,
    coordinates: { lat: 22.5431, lng: 114.0579 },
    region: 'China',
    websiteUrl: 'http://www.lowaltitudeexpo.com/'
  },
  {
    id: '3',
    title: 'Vertical Flight Society Annual Forum',
    location: 'Virginia Beach, USA',
    date: 'May 13 - 15, 2025',
    description: 'Focused on the future of vertical takeoff and landing (VTOL) technology and safety.',
    imageUrl: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=800',
    category: 'eVTOL',
    coordinates: { lat: 36.8529, lng: -75.9780 },
    region: 'Americas',
    websiteUrl: 'https://vtol.org/forum'
  },
  {
    id: '8',
    title: '成都国际低空装备博览会',
    location: '成都, 中国',
    date: 'June 18 - 20, 2025',
    description: '展示中国西部地区最新的低空防御系统与通用航空装备。',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    category: 'Drone',
    coordinates: { lat: 30.5728, lng: 104.0668 },
    region: 'China',
    websiteUrl: '#'
  },
  {
    id: '9',
    title: '珠海航展 - 低空经济展区',
    location: '珠海, 中国',
    date: 'Nov 12 - 17, 2024',
    description: '中国规模最大的航空盛事，专门开辟低空经济独立展馆。',
    imageUrl: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800',
    category: 'eVTOL',
    coordinates: { lat: 22.2707, lng: 113.5767 },
    region: 'China',
    websiteUrl: '#'
  },
  {
    id: '10',
    title: '杭州智慧低空交通论坛',
    location: '杭州, 中国',
    date: 'April 15 - 16, 2025',
    description: '探讨无人机在未来城市物流与公共服务中的应用。',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&q=80&w=800',
    category: 'Infrastructure',
    coordinates: { lat: 30.2741, lng: 120.1551 },
    region: 'China',
    websiteUrl: '#'
  }
];
