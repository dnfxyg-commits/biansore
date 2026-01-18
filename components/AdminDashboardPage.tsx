import React, { useEffect, useMemo, useState } from 'react';
import type { Exhibition } from '../types';
import {
  fetchAdminBoothApplications,
  fetchAdminPartnershipApplications,
  fetchAdminTicketBookings,
  fetchExhibitions,
  deleteAdminBoothApplication,
  deleteAdminPartnershipApplication,
  deleteAdminTicketBooking,
  createAdminExhibition,
  updateAdminExhibition,
  fetchAdminUsers,
  createAdminUser,
  updateAdminUser,
  changeAdminPassword,
  fetchAdminBlogPosts,
  createAdminBlogPost,
  updateAdminBlogPost,
  deleteAdminBlogPost,
  type AdminBoothApplication,
  type AdminPartnershipApplication,
  type AdminTicketBooking,
  type AdminExhibitionPayload,
  type AdminListUser,
  type AdminBlogPost,
  type AdminUser as ApiAdminUser
} from '../services/api';

interface Props {
  currentUser: ApiAdminUser;
  onLogout: () => void;
}

type Tab =
  | 'tickets'
  | 'booth'
  | 'partnership'
  | 'exhibitions'
  | 'podcasts'
  | 'users';

type ExhibitionFormState = {
  id?: string;
  title: string;
  location: string;
  date: string;
  description: string;
  imageUrl: string;
  category: string;
  featured: boolean;
  region: string;
  websiteUrl: string;
  lat: string;
  lng: string;
};

const emptyExhibitionForm: ExhibitionFormState = {
  id: undefined,
  title: '',
  location: '',
  date: '',
  description: '',
  imageUrl: '',
  category: '',
  featured: false,
  region: '',
  websiteUrl: '',
  lat: '',
  lng: ''
};

const AdminDashboardPage: React.FC<Props> = ({ currentUser, onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('tickets');
  const [tickets, setTickets] = useState<AdminTicketBooking[]>([]);
  const [boothApps, setBoothApps] = useState<AdminBoothApplication[]>([]);
  const [partnerApps, setPartnerApps] = useState<AdminPartnershipApplication[]>([]);
  const [exhibitions, setExhibitions] = useState<Exhibition[]>([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exhibitionForm, setExhibitionForm] =
    useState<ExhibitionFormState>(emptyExhibitionForm);
  const [savingExhibition, setSavingExhibition] = useState(false);
  const [adminUsers, setAdminUsers] = useState<AdminListUser[]>([]);
  const [passwordCurrent, setPasswordCurrent] = useState('');
  const [passwordNew, setPasswordNew] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [newRole, setNewRole] = useState<'admin' | 'ops' | 'content'>('ops');
  const [creatingUser, setCreatingUser] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const [blogPosts, setBlogPosts] = useState<AdminBlogPost[]>([]);
  const [postId, setPostId] = useState<string | undefined>(undefined);
  const [postTitle, setPostTitle] = useState('');
  const [postSummary, setPostSummary] = useState('');
  const [postDate, setPostDate] = useState('');
  const [postSource, setPostSource] = useState('');
  const [postAuthor, setPostAuthor] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [postTagsInput, setPostTagsInput] = useState('播客, 精选');
  const [postContent, setPostContent] = useState('');
  const [savingPost, setSavingPost] = useState(false);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);

  const availableTabs: Tab[] = useMemo(() => {
    if (currentUser.role === 'admin') {
      return ['tickets', 'booth', 'partnership', 'exhibitions', 'podcasts', 'users'];
    }
    if (currentUser.role === 'ops') {
      return ['tickets', 'booth', 'partnership'];
    }
    if (currentUser.role === 'content') {
      return ['exhibitions', 'podcasts'];
    }
    return ['tickets'];
  }, [currentUser.role]);

  useEffect(() => {
    if (currentUser.role === 'admin' || currentUser.role === 'content') {
      const loadPosts = async () => {
        const posts = await fetchAdminBlogPosts();
        setBlogPosts(posts);
      };
      void loadPosts();
    }
  }, [currentUser.role]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const promises: Promise<unknown>[] = [
          fetchAdminTicketBookings(),
          fetchAdminBoothApplications(),
          fetchAdminPartnershipApplications(),
          fetchExhibitions()
        ];

        if (currentUser.role === 'admin') {
          promises.push(fetchAdminUsers());
        }

        const [t, b, p, e, users] = (await Promise.all(promises)) as [
          AdminTicketBooking[],
          AdminBoothApplication[],
          AdminPartnershipApplication[],
          Exhibition[],
          AdminListUser[] | undefined
        ];

        setTickets(t);
        setBoothApps(b);
        setPartnerApps(p);
        setExhibitions(e);
        if (users) {
          setAdminUsers(users);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [currentUser.role]);

  const handleDeleteTicket = async (id: string) => {
    if (!window.confirm('确认删除这条门票预订记录？')) {
      return;
    }
    setDeletingId(id);
    const ok = await deleteAdminTicketBooking(id);
    setDeletingId(null);
    if (ok) {
      setTickets((prev) => prev.filter((t) => t.id !== id));
    } else {
      alert('删除失败，请稍后重试');
    }
  };

  const handleDeleteBooth = async (id: string) => {
    if (!window.confirm('确认删除这条展位申请记录？')) {
      return;
    }
    setDeletingId(id);
    const ok = await deleteAdminBoothApplication(id);
    setDeletingId(null);
    if (ok) {
      setBoothApps((prev) => prev.filter((b) => b.id !== id));
    } else {
      alert('删除失败，请稍后重试');
    }
  };

  const handleDeletePartner = async (id: string) => {
    if (!window.confirm('确认删除这条战略合作记录？')) {
      return;
    }
    setDeletingId(id);
    const ok = await deleteAdminPartnershipApplication(id);
    setDeletingId(null);
    if (ok) {
      setPartnerApps((prev) => prev.filter((p) => p.id !== id));
    } else {
      alert('删除失败，请稍后重试');
    }
  };

  const handleEditExhibition = (exhibition: Exhibition) => {
    setExhibitionForm({
      id: exhibition.id,
      title: exhibition.title || '',
      location: exhibition.location || '',
      date: exhibition.date || '',
      description: exhibition.description || '',
      imageUrl: exhibition.imageUrl || '',
      category: exhibition.category || '',
      featured: !!exhibition.featured,
      region: exhibition.region || '',
      websiteUrl: exhibition.websiteUrl || '',
      lat:
        exhibition.coordinates && typeof exhibition.coordinates.lat === 'number'
          ? String(exhibition.coordinates.lat)
          : '',
      lng:
        exhibition.coordinates && typeof exhibition.coordinates.lng === 'number'
          ? String(exhibition.coordinates.lng)
          : ''
    });
    setActiveTab('exhibitions');
  };

  const handleNewExhibition = () => {
    setExhibitionForm(emptyExhibitionForm);
  };

  const handleExhibitionFormChange = (
    field: keyof ExhibitionFormState,
    value: string | boolean
  ) => {
    setExhibitionForm((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmitExhibition = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!exhibitionForm.title || !exhibitionForm.location || !exhibitionForm.date) {
      alert('请填写标题、地点和日期');
      return;
    }

    const lat =
      exhibitionForm.lat.trim() === '' ? null : Number(exhibitionForm.lat.trim());
    const lng =
      exhibitionForm.lng.trim() === '' ? null : Number(exhibitionForm.lng.trim());

    if (
      (lat !== null && Number.isNaN(lat)) ||
      (lng !== null && Number.isNaN(lng))
    ) {
      alert('经纬度格式不正确');
      return;
    }

    const payload: AdminExhibitionPayload = {
      id: exhibitionForm.id,
      title: exhibitionForm.title,
      location: exhibitionForm.location,
      date: exhibitionForm.date,
      description:
        exhibitionForm.description.trim() === ''
          ? undefined
          : exhibitionForm.description.trim(),
      imageUrl:
        exhibitionForm.imageUrl.trim() === ''
          ? undefined
          : exhibitionForm.imageUrl.trim(),
      category:
        exhibitionForm.category.trim() === ''
          ? undefined
          : exhibitionForm.category.trim(),
      featured: exhibitionForm.featured,
      region:
        exhibitionForm.region.trim() === ''
          ? undefined
          : exhibitionForm.region.trim(),
      websiteUrl:
        exhibitionForm.websiteUrl.trim() === ''
          ? undefined
          : exhibitionForm.websiteUrl.trim(),
      lat,
      lng
    };

    setSavingExhibition(true);
    try {
      const ok = exhibitionForm.id
        ? await updateAdminExhibition(payload)
        : await createAdminExhibition(payload);

      if (!ok) {
        alert('保存失败，请稍后重试');
        return;
      }

      const next = await fetchExhibitions();
      setExhibitions(next);
      setExhibitionForm(emptyExhibitionForm);
      alert('保存成功');
    } finally {
      setSavingExhibition(false);
    }
  };

  const handleCreateAdminUser: React.FormEventHandler = async (event) => {
    event.preventDefault();

    if (!newUsername.trim() || !newPassword) {
      alert('请填写用户名和密码');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      alert('两次输入的密码不一致');
      return;
    }

    if (newPassword.length < 6) {
      alert('密码长度至少 6 位');
      return;
    }

    setCreatingUser(true);
    const created = await createAdminUser(
      newUsername.trim(),
      newPassword,
      newRole
    );
    setCreatingUser(false);

    if (!created) {
      alert('创建管理员账号失败，请稍后重试');
      return;
    }

    setAdminUsers((prev) => [created, ...prev]);
    setNewUsername('');
    setNewPassword('');
    setNewPasswordConfirm('');
    setNewRole('ops');
    alert('管理员账号创建成功');
  };

  const handleUpdateAdminUser = async (
    id: string,
    updates: { role?: string; isActive?: boolean }
  ) => {
    if (!updates.role && typeof updates.isActive !== 'boolean') {
      return;
    }

    setUpdatingUserId(id);
    const ok = await updateAdminUser(id, updates);
    setUpdatingUserId(null);

    if (!ok) {
      alert('更新用户信息失败，请稍后重试');
      return;
    }

    setAdminUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updates } : u))
    );
  };

  const handleEditBlogPost = (post: AdminBlogPost) => {
    setPostId(post.id);
    setPostTitle(post.title);
    setPostSummary(post.summary);
    setPostDate(post.date);
    setPostSource(post.source);
    setPostAuthor(post.author || '');
    setPostImageUrl(post.imageUrl || '');
    setPostTagsInput((post.tags || []).join(', '));
    setPostContent(post.content || '');
  };

  const handleNewBlogPost = () => {
    setPostId(undefined);
    setPostTitle('');
    setPostSummary('');
    setPostDate('');
    setPostSource('');
    setPostAuthor('');
    setPostImageUrl('');
    setPostTagsInput('播客, 精选');
    setPostContent('');
  };

  const handleDeleteBlogPost = async (id: string) => {
    if (!window.confirm('确认删除这条播客文章吗？')) {
      return;
    }
    setDeletingPostId(id);
    const ok = await deleteAdminBlogPost(id);
    setDeletingPostId(null);
    if (!ok) {
      alert('删除失败，请稍后重试');
      return;
    }
    setBlogPosts((prev) => prev.filter((p) => p.id !== id));
    if (postId === id) {
      handleNewBlogPost();
    }
  };

  const handleSubmitBlogPost: React.FormEventHandler = async (event) => {
    event.preventDefault();

    if (
      !postTitle.trim() ||
      !postSummary.trim() ||
      !postDate.trim() ||
      !postSource.trim()
    ) {
      alert('请填写标题、摘要、日期和来源');
      return;
    }

    const tags = postTagsInput
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag !== '');

    if (tags.length === 0) {
      alert('请至少填写一个标签');
      return;
    }

    const payload = {
      id: postId,
      title: postTitle.trim(),
      summary: postSummary.trim(),
      date: postDate.trim(),
      source: postSource.trim(),
      author: postAuthor.trim() || undefined,
      imageUrl: postImageUrl.trim() || undefined,
      tags,
      content: postContent.trim() || undefined
    };

    setSavingPost(true);
    try {
      if (postId) {
        const ok = await updateAdminBlogPost(payload);
        if (!ok) {
          alert('保存失败，请稍后重试');
          return;
        }
        setBlogPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  title: payload.title,
                  summary: payload.summary,
                  date: payload.date,
                  source: payload.source,
                  author: payload.author,
                  imageUrl: payload.imageUrl,
                  tags: payload.tags,
                  content: payload.content
                }
              : p
          )
        );
      } else {
        const created = await createAdminBlogPost(payload);
        if (!created) {
          alert('保存失败，请稍后重试');
          return;
        }
        setBlogPosts((prev) => [created, ...prev]);
        setPostId(created.id);
      }

      alert('保存成功');
    } finally {
      setSavingPost(false);
    }
  };

  const podcastPosts = useMemo(
    () =>
      blogPosts.filter((post) =>
        (post.tags || []).some((tag) => tag === '播客')
      ),
    [blogPosts]
  );

  const renderTickets = () => {
    if (tickets.length === 0) {
      return <div className="text-sm text-slate-500">暂无门票预订数据</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-2 px-3">展会 ID</th>
              <th className="text-left py-2 px-3">姓名</th>
              <th className="text-left py-2 px-3">手机号</th>
              <th className="text-left py-2 px-3">票种</th>
              <th className="text-left py-2 px-3">时间</th>
              <th className="text-right py-2 px-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-3 font-mono text-xs">{t.exhibitionId}</td>
                <td className="py-2 px-3">{t.name}</td>
                <td className="py-2 px-3">{t.phone}</td>
                <td className="py-2 px-3">{t.ticketType || 'Standard'}</td>
                <td className="py-2 px-3 text-xs text-slate-500">
                  {new Date(t.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right">
                  <button
                    onClick={() => handleDeleteTicket(t.id)}
                    disabled={deletingId === t.id}
                    className="text-xs px-2 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderBoothApps = () => {
    if (boothApps.length === 0) {
      return <div className="text-sm text-slate-500">暂无展位申请数据</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-2 px-3">展会 ID</th>
              <th className="text-left py-2 px-3">公司名称</th>
              <th className="text-left py-2 px-3">联系人</th>
              <th className="text-left py-2 px-3">邮箱</th>
              <th className="text-left py-2 px-3">展位需求</th>
              <th className="text-left py-2 px-3">目的</th>
              <th className="text-left py-2 px-3">时间</th>
              <th className="text-right py-2 px-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {boothApps.map((b) => (
              <tr key={b.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-3 font-mono text-xs">{b.exhibitionId}</td>
                <td className="py-2 px-3">{b.companyName}</td>
                <td className="py-2 px-3">{b.contactName}</td>
                <td className="py-2 px-3">{b.workEmail}</td>
                <td className="py-2 px-3">{b.boothArea || '-'}</td>
                <td className="py-2 px-3 max-w-xs truncate" title={b.purpose}>
                  {b.purpose}
                </td>
                <td className="py-2 px-3 text-xs text-slate-500">
                  {new Date(b.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right">
                  <button
                    onClick={() => handleDeleteBooth(b.id)}
                    disabled={deletingId === b.id}
                    className="text-xs px-2 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPartnerApps = () => {
    if (partnerApps.length === 0) {
      return <div className="text-sm text-slate-500">暂无战略合作申请数据</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              <th className="text-left py-2 px-3">姓名</th>
              <th className="text-left py-2 px-3">公司</th>
              <th className="text-left py-2 px-3">手机</th>
              <th className="text-left py-2 px-3">城市</th>
              <th className="text-left py-2 px-3">邮箱</th>
              <th className="text-left py-2 px-3">诉求</th>
              <th className="text-left py-2 px-3">时间</th>
              <th className="text-right py-2 px-3">操作</th>
            </tr>
          </thead>
          <tbody>
            {partnerApps.map((p) => (
              <tr key={p.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 px-3">{p.name}</td>
                <td className="py-2 px-3">{p.company}</td>
                <td className="py-2 px-3">{p.phone}</td>
                <td className="py-2 px-3">{p.city}</td>
                <td className="py-2 px-3">{p.email}</td>
                <td className="py-2 px-3 max-w-xs truncate" title={p.message}>
                  {p.message}
                </td>
                <td className="py-2 px-3 text-xs text-slate-500">
                  {new Date(p.createdAt).toLocaleString()}
                </td>
                <td className="py-2 px-3 text-right">
                  <button
                    onClick={() => handleDeletePartner(p.id)}
                    disabled={deletingId === p.id}
                    className="text-xs px-2 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderExhibitions = () => {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">展会列表</h2>
          <button
            type="button"
            onClick={handleNewExhibition}
            className="text-xs px-3 py-1.5 rounded-full border border-blue-500 text-blue-600 hover:bg-blue-50"
          >
            新增展会
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="text-left py-2 px-3">标题</th>
                <th className="text-left py-2 px-3">地点</th>
                <th className="text-left py-2 px-3">日期</th>
                <th className="text-left py-2 px-3">区域</th>
                <th className="text-left py-2 px-3">分类</th>
                <th className="text-left py-2 px-3">是否推荐</th>
                <th className="text-right py-2 px-3">操作</th>
              </tr>
            </thead>
            <tbody>
              {exhibitions.length === 0 ? (
                <tr>
                  <td
                    className="py-4 px-3 text-sm text-slate-500"
                    colSpan={7}
                  >
                    暂无展会数据
                  </td>
                </tr>
              ) : (
                exhibitions.map((ex) => (
                  <tr
                    key={ex.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="py-2 px-3">{ex.title}</td>
                    <td className="py-2 px-3">{ex.location}</td>
                    <td className="py-2 px-3">{ex.date}</td>
                    <td className="py-2 px-3">{ex.region}</td>
                    <td className="py-2 px-3">{ex.category}</td>
                    <td className="py-2 px-3">
                      {ex.featured ? (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-green-50 text-green-700 border border-green-200">
                          是
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                          否
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-right">
                      <button
                        type="button"
                        onClick={() => handleEditExhibition(ex)}
                        className="text-xs px-2 py-1 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                      >
                        编辑
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            {exhibitionForm.id ? '编辑展会' : '新增展会'}
          </h2>
          <form onSubmit={handleSubmitExhibition} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                标题
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exhibitionForm.title}
                onChange={(e) =>
                  handleExhibitionFormChange('title', e.target.value)
                }
                placeholder="例如：全球低空经济博览会"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                地点
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exhibitionForm.location}
                onChange={(e) =>
                  handleExhibitionFormChange('location', e.target.value)
                }
                placeholder="城市 / 国家"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                日期
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exhibitionForm.date}
                onChange={(e) =>
                  handleExhibitionFormChange('date', e.target.value)
                }
                placeholder="例如：2026-05-20"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                区域
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exhibitionForm.region}
                onChange={(e) =>
                  handleExhibitionFormChange('region', e.target.value)
                }
                placeholder="例如：China / Asia"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                分类
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exhibitionForm.category}
                onChange={(e) =>
                  handleExhibitionFormChange('category', e.target.value)
                }
                placeholder="例如：Drone / eVTOL"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                官网链接
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exhibitionForm.websiteUrl}
                onChange={(e) =>
                  handleExhibitionFormChange('websiteUrl', e.target.value)
                }
                placeholder="https://"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                封面图链接
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exhibitionForm.imageUrl}
                onChange={(e) =>
                  handleExhibitionFormChange('imageUrl', e.target.value)
                }
                placeholder="图片 URL"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                纬度 (lat)
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exhibitionForm.lat}
                onChange={(e) => handleExhibitionFormChange('lat', e.target.value)}
                placeholder="可选"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                经度 (lng)
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={exhibitionForm.lng}
                onChange={(e) => handleExhibitionFormChange('lng', e.target.value)}
                placeholder="可选"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-600">
                描述
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                value={exhibitionForm.description}
                onChange={(e) =>
                  handleExhibitionFormChange('description', e.target.value)
                }
                placeholder="简单说明展会亮点"
              />
            </div>

            <div className="flex items-center space-x-2 md:col-span-2">
              <input
                id="exhibition-featured"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                checked={exhibitionForm.featured}
                onChange={(e) =>
                  handleExhibitionFormChange('featured', e.target.checked)
                }
              />
              <label
                htmlFor="exhibition-featured"
                className="text-xs text-slate-600"
              >
                首页推荐展会
              </label>
            </div>

            <div className="md:col-span-2 flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleNewExhibition}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                disabled={savingExhibition}
              >
                重置
              </button>
              <button
                type="submit"
                disabled={savingExhibition}
                className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {savingExhibition ? '保存中...' : '保存展会'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const renderUsers = () => {
    if (currentUser.role !== 'admin') {
      return (
        <div className="text-sm text-slate-500">
          仅管理员账号可以查看用户列表。
        </div>
      );
    }
    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-4">管理员用户列表</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-2 px-3">用户名</th>
                  <th className="text-left py-2 px-3">角色</th>
                  <th className="text-left py-2 px-3">状态</th>
                  <th className="text-left py-2 px-3">创建时间</th>
                  <th className="text-right py-2 px-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {adminUsers.length === 0 ? (
                  <tr>
                    <td
                      className="py-4 px-3 text-sm text-slate-500"
                      colSpan={3}
                    >
                      暂无管理员用户
                    </td>
                  </tr>
                ) : (
                  adminUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-2 px-3">
                        <div className="flex items-center space-x-2">
                          <span>{u.username}</span>
                          {u.isSuperAdmin && (
                            <span className="inline-flex items-center px-2 py-0.5 text-[10px] rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                              超管
                            </span>
                          )}
                          {u.id === currentUser.id && !u.isSuperAdmin && currentUser.isSuperAdmin && (
                            <span className="inline-flex items-center px-2 py-0.5 text-[10px] rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                              当前
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        {u.id === currentUser.id || (!currentUser.isSuperAdmin && u.role === 'admin') ? (
                          <span className="inline-flex items-center px-2 py-0.5 text-xs rounded-full bg-slate-50 text-slate-500 border border-slate-200">
                            {u.role}
                          </span>
                        ) : (
                          <select
                            className="rounded-full border border-slate-200 px-2 py-1 text-xs bg-white"
                            value={u.role}
                            disabled={updatingUserId === u.id}
                            onChange={(e) => {
                              const nextRole = e.target.value as
                                | 'admin'
                                | 'ops'
                                | 'content';
                              if (nextRole === u.role) {
                                return;
                              }
                              if (
                                !window.confirm(
                                  `确定将 ${u.username} 的角色调整为 ${nextRole} 吗？`
                                )
                              ) {
                                return;
                              }
                              void handleUpdateAdminUser(u.id, {
                                role: nextRole
                              });
                            }}
                          >
                            <option value="admin">admin</option>
                            <option value="ops">ops</option>
                            <option value="content">content</option>
                          </select>
                        )}
                      </td>
                      <td className="py-2 px-3">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 text-xs rounded-full border ${
                            u.isActive
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : 'bg-slate-50 text-slate-500 border-slate-200'
                          }`}
                        >
                          {u.isActive ? '启用' : '已禁用'}
                        </span>
                      </td>
                      <td className="py-2 px-3 text-xs text-slate-500">
                        {new Date(u.createdAt).toLocaleString()}
                      </td>
                      <td className="py-2 px-3 text-right">
                        {currentUser.isSuperAdmin || u.role !== 'admin' ? (
                          <button
                            type="button"
                            disabled={updatingUserId === u.id}
                            onClick={() => {
                              const nextActive = !u.isActive;
                              if (
                                !window.confirm(
                                  `确定要${nextActive ? '启用' : '禁用'}账号 ${
                                    u.username
                                  } 吗？`
                                )
                              ) {
                                return;
                              }
                              void handleUpdateAdminUser(u.id, {
                                isActive: nextActive
                              });
                            }}
                            className={`text-xs px-3 py-1 rounded-full border ${
                              u.isActive
                                ? 'border-red-200 text-red-600 hover:bg-red-50'
                                : 'border-green-200 text-green-700 hover:bg-green-50'
                            } disabled:opacity-50`}
                          >
                            {u.isActive ? '禁用' : '启用'}
                          </button>
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            仅超管可操作
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">
            创建新的管理员账号
          </h2>
          <form
            className="max-w-xl grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleCreateAdminUser}
          >
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                用户名
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newUsername}
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="请输入登录用户名"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                初始密码
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="至少 6 位"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                确认初始密码
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newPasswordConfirm}
                onChange={(e) => setNewPasswordConfirm(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                角色
              </label>
              <select
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={newRole}
                onChange={(e) =>
                  setNewRole(
                    e.target.value as 'admin' | 'ops' | 'content'
                  )
                }
              >
                {currentUser.isSuperAdmin && (
                  <option value="admin">admin（全局管理）</option>
                )}
                <option value="ops">ops（运营）</option>
                <option value="content">content（内容）</option>
              </select>
            </div>

            <div className="md:col-span-2 flex items-center justify-end pt-2">
              <button
                type="submit"
                disabled={creatingUser}
                className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {creatingUser ? '创建中...' : '创建管理员账号'}
              </button>
            </div>
          </form>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <h2 className="text-base font-bold text-slate-900 mb-4">修改我的密码</h2>
          <form
            className="max-w-md space-y-4"
            onSubmit={async (e) => {
              e.preventDefault();
              if (!passwordCurrent || !passwordNew) {
                alert('请填写当前密码和新密码');
                return;
              }
              if (passwordNew !== passwordConfirm) {
                alert('两次输入的新密码不一致');
                return;
              }
              if (passwordNew.length < 6) {
                alert('新密码长度至少 6 位');
                return;
              }
              setChangingPassword(true);
              const ok = await changeAdminPassword(
                passwordCurrent,
                passwordNew
              );
              setChangingPassword(false);
              if (!ok) {
                alert('修改密码失败，请检查当前密码或稍后重试');
                return;
              }
              setPasswordCurrent('');
              setPasswordNew('');
              setPasswordConfirm('');
              alert('密码修改成功，下次登录请使用新密码');
            }}
          >
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                当前密码
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={passwordCurrent}
                onChange={(e) => setPasswordCurrent(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                新密码
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={passwordNew}
                onChange={(e) => setPasswordNew(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                确认新密码
              </label>
              <input
                type="password"
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={changingPassword}
              className="mt-2 px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              {changingPassword ? '修改中...' : '保存新密码'}
            </button>
          </form>
        </div>
      </div>
    );
  };

  const renderPodcasts = () => {
    if (currentUser.role !== 'admin' && currentUser.role !== 'content') {
      return (
        <div className="text-sm text-slate-500">
          仅内容或管理角色可以管理播客文章。
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-base font-bold text-slate-900 mb-4">播客文章列表</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left py-2 px-3">标题</th>
                  <th className="text-left py-2 px-3">作者</th>
                  <th className="text-left py-2 px-3">日期</th>
                  <th className="text-left py-2 px-3">标签</th>
                  <th className="text-right py-2 px-3">操作</th>
                </tr>
              </thead>
              <tbody>
                {podcastPosts.length === 0 ? (
                  <tr>
                    <td
                      className="py-4 px-3 text-sm text-slate-500"
                      colSpan={5}
                    >
                      暂无带有“播客”标签的文章
                    </td>
                  </tr>
                ) : (
                  podcastPosts.map((post) => (
                    <tr
                      key={post.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="py-2 px-3 max-w-xs truncate" title={post.title}>
                        {post.title}
                      </td>
                      <td className="py-2 px-3">{post.author || '-'}</td>
                      <td className="py-2 px-3 text-xs text-slate-500">
                        {post.date}
                      </td>
                      <td className="py-2 px-3">
                        <div className="flex flex-wrap gap-1">
                          {(post.tags || []).map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 text-[10px] rounded-full bg-amber-50 text-amber-700 border border-amber-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-right space-x-2">
                        <button
                          type="button"
                          onClick={() => handleEditBlogPost(post)}
                          className="text-xs px-3 py-1 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50"
                        >
                          编辑
                        </button>
                        <button
                          type="button"
                          disabled={deletingPostId === post.id}
                          onClick={() => handleDeleteBlogPost(post.id)}
                          className="text-xs px-3 py-1 rounded-full border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50"
                        >
                          删除
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-900">
              {postId ? '编辑播客文章' : '新增播客文章'}
            </h2>
            <button
              type="button"
              onClick={handleNewBlogPost}
              className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
            >
              新建
            </button>
          </div>
          <form
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            onSubmit={handleSubmitBlogPost}
          >
            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                标题
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="播客文章标题"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                日期
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={postDate}
                onChange={(e) => setPostDate(e.target.value)}
                placeholder="例如：2026年1月15日"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                来源
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={postSource}
                onChange={(e) => setPostSource(e.target.value)}
                placeholder="例如：特邀专家"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-medium text-slate-600">
                作者
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={postAuthor}
                onChange={(e) => setPostAuthor(e.target.value)}
                placeholder="可选"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-600">
                摘要
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[80px]"
                value={postSummary}
                onChange={(e) => setPostSummary(e.target.value)}
                placeholder="简要说明播客内容"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-600">
                标签（逗号分隔）
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={postTagsInput}
                onChange={(e) => setPostTagsInput(e.target.value)}
                placeholder="例如：播客, 精选"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-600">
                封面图链接
              </label>
              <input
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={postImageUrl}
                onChange={(e) => setPostImageUrl(e.target.value)}
                placeholder="https://"
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <label className="block text-xs font-medium text-slate-600">
                正文内容（可选）
              </label>
              <textarea
                className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[120px]"
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="可选，用于在详情页展示完整内容"
              />
            </div>

            <div className="md:col-span-2 flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={handleNewBlogPost}
                className="px-4 py-2 rounded-full border border-slate-200 text-xs font-medium text-slate-700 hover:bg-slate-50"
                disabled={savingPost}
              >
                重置
              </button>
              <button
                type="submit"
                disabled={savingPost}
                className="px-5 py-2 rounded-full bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 disabled:opacity-50"
              >
                {savingPost ? '保存中...' : '保存播客文章'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-900 mb-2">管理后台</h1>
            <p className="text-sm text-slate-500">
              欢迎，{currentUser.username}（角色：{currentUser.role}）
            </p>
          </div>
          <div className="flex items-center space-x-4">
            {loading && (
              <div className="text-xs text-slate-500 animate-pulse">
                正在加载数据...
              </div>
            )}
            <button
              type="button"
              onClick={onLogout}
              className="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50"
            >
              退出登录
            </button>
          </div>
        </div>

        <div className="mb-6 flex space-x-2">
          {availableTabs.includes('tickets') && (
            <button
              onClick={() => setActiveTab('tickets')}
              className={`px-4 py-2 rounded-full text-sm font-bold border ${
                activeTab === 'tickets'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
              }`}
            >
              门票预订
            </button>
          )}
          {availableTabs.includes('booth') && (
            <button
              onClick={() => setActiveTab('booth')}
              className={`px-4 py-2 rounded-full text-sm font-bold border ${
                activeTab === 'booth'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
              }`}
            >
              展位申请
            </button>
          )}
          {availableTabs.includes('partnership') && (
            <button
              onClick={() => setActiveTab('partnership')}
              className={`px-4 py-2 rounded-full text-sm font-bold border ${
                activeTab === 'partnership'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
              }`}
            >
              战略合作
            </button>
          )}
          {availableTabs.includes('exhibitions') && (
            <button
              onClick={() => setActiveTab('exhibitions')}
              className={`px-4 py-2 rounded-full text-sm font-bold border ${
                activeTab === 'exhibitions'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
              }`}
            >
              展会管理
            </button>
          )}
          {availableTabs.includes('users') && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 rounded-full text-sm font-bold border ${
                activeTab === 'users'
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-blue-400'
              }`}
            >
              用户管理
            </button>
          )}
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6">
          {activeTab === 'tickets' && renderTickets()}
          {activeTab === 'booth' && renderBoothApps()}
          {activeTab === 'partnership' && renderPartnerApps()}
          {activeTab === 'exhibitions' && renderExhibitions()}
          {activeTab === 'users' && renderUsers()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
