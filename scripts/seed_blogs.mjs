
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Data from mockData.ts (simplified for import)
const BLOG_POSTS = [
  {
    id: 'b1',
    title: '播客：Flight Kinetics公司的莱斯特·厄尔斯谈如何提升eVTOL飞机的航程和有效载荷',
    summary: '探讨如何通过电池管理和气动优化在复杂的城市环境中提升飞行效率。',
    date: '2026-01-15', // Normalized date format
    author: '杰森·普里查德',
    source: '特邀专家',
    tags: ['精选', '播客'],
    image_url: '' 
  },
  {
    id: 'b2',
    title: '女性在先进空中交通领域中的播客：特蕾西·兰姆博士谈先进空中交通领域的安全、监管和公众信任',
    summary: '兰姆博士分享了她在航空安全管理方面的数十年经验。',
    date: '2026-01-08',
    author: '杰森·普里查德',
    source: '特邀专家',
    tags: ['精选', '播客'],
    image_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b3',
    title: '播客：地平线飞机公司的布兰登·罗宾逊谈混合动力电动垂直起降飞行器为何在航程和可靠性竞赛中胜出',
    summary: '混合动力系统是解决当前电池技术瓶颈的最优路径。',
    date: '2025-12-11',
    author: '杰森·普里查德',
    source: '特邀专家',
    tags: ['精选', '播客'],
    image_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'b4',
    title: '女性航空制造商播客：垂直航空国际公司的安珀·哈里森解读美国联邦航空管理局第108部分分规划',
    summary: '深入分析最新的监管框架对制造商的市场准入影响。',
    date: '2025-12-04',
    author: '杰森·普里查德',
    source: '特邀专家',
    tags: ['精选', '消息', '播客', 'AAM中的女性'],
    image_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=800'
  }
];

const seedBlogs = async () => {
  console.log('Starting blog posts seed...');

  for (const post of BLOG_POSTS) {
    const { data, error } = await supabase
      .from('blog_posts')
      .upsert({
        id: post.id,
        title: post.title,
        summary: post.summary,
        date: post.date,
        author: post.author,
        source: post.source,
        tags: post.tags,
        image_url: post.image_url
      })
      .select();

    if (error) {
      console.error(`Error upserting post ${post.id}:`, error);
    } else {
      console.log(`Upserted post ${post.id}: ${post.title}`);
    }
  }

  console.log('Seed completed.');
};

seedBlogs();
