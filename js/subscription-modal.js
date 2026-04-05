const subscriptionOptions = [
	{
		accent: 'gray',
		eyebrow: '帐号充值',
		title: 'ChatGPT 帐号充值系统',
		domain: 'gptplus.free',
		description: '适合用于 ChatGPT Plus 会员充值。当前入口对应独立域名、独立卡密格式和独立教程。',
		tags: ['#独立后台', '#教程'],
		facts: [
			['适用场景', 'ChatGPT Plus 会员充值'],
			['卡密示例', '17ED****-****-****-****-********3CC8'],
			['三步流程', '输入卡密 → 获取 GPT 登录 Token → 充值成功'],
		],
		primaryHref: 'https://gptplus.free',
		secondaryHref: 'pages/gptplus-free-guide.html',
	},
	{
		accent: 'emerald',
		eyebrow: 'Plus 订阅',
		title: 'ChatGPT Plus 帐号充值系统',
		domain: 'chatgptplus.club',
		description: '适合用于 ChatGPT Plus 会员充值。当前入口对应独立域名、独立卡密格式和独立教程。',
		tags: ['#独立后台', '#教程'],
		facts: [
			['适用场景', 'ChatGPT Plus 会员充值'],
			['卡密示例', 'Y2DD****O7Y8****'],
			['三步流程', '输入卡密 → 获取 GPT 登录 Token → 充值成功'],
		],
		primaryHref: 'https://chatgptplus.club',
		secondaryHref: 'pages/chatgpt-plus-guide.html',
	},
];

const renderSubscriptionCard = (option) => {
	const theme = option.accent === 'emerald'
		? {
			card: 'border-emerald-200 bg-emerald-50/70',
			eyebrow: 'text-emerald-700',
			tag: 'border-emerald-200 text-emerald-700',
			facts: 'border-emerald-100 bg-white/90',
			factLabel: 'text-emerald-700',
			primary: 'bg-emerald-600 text-white hover:bg-emerald-700',
			secondary: 'border-emerald-200 bg-white text-emerald-700 hover:border-emerald-300',
		}
		: {
			card: 'border-gray-200 bg-gray-50',
			eyebrow: 'text-gray-500',
			tag: 'border-gray-200 text-gray-600',
			facts: 'border-gray-200 bg-white/90',
			factLabel: 'text-gray-500',
			primary: 'bg-gray-900 text-white hover:bg-gray-800',
			secondary: 'border-gray-300 bg-white text-gray-800 hover:border-gray-400',
		};

	const tags = option.tags
		.map((tag) => `<span class="rounded-full border ${theme.tag} bg-white px-3 py-1 text-xs">${tag}</span>`)
		.join('');

	const facts = option.facts
		.map(([label, value], index) => `
			<div class="grid grid-cols-[84px,1fr] gap-3 px-4 py-3 ${index ? 'border-t border-black/5' : ''}">
				<div class="text-[11px] font-semibold uppercase tracking-[0.18em] ${theme.factLabel}">${label}</div>
				<div class="text-sm leading-6 text-gray-700">${value}</div>
			</div>`)
		.join('');

	return `
		<article class="rounded-2xl border ${theme.card} p-5 sm:p-6">
			<p class="text-xs font-semibold uppercase tracking-[0.24em] ${theme.eyebrow}">${option.eyebrow}</p>
			<h4 class="mt-3 text-2xl font-bold text-gray-900">${option.title}</h4>
			<p class="mt-3 break-all text-sm font-mono text-gray-500">${option.domain}</p>
			<p class="mt-4 text-sm leading-6 text-gray-600">${option.description}</p>
			<div class="mt-4 flex flex-wrap gap-2">${tags}</div>
			<div class="mt-5 overflow-hidden rounded-2xl border ${theme.facts}">${facts}
			</div>
			<div class="mt-6 flex flex-col gap-3">
				<a href="${option.primaryHref}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${theme.primary}">进入系统</a>
				<a href="${option.secondaryHref}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-[44px] items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-bold transition-all ${theme.secondary}">站内教程</a>
			</div>
		</article>`;
};

const initSubscriptionModal = () => {
	try {
		const root = document.getElementById('subscription-modal-root');
		if (!root) return;

		root.innerHTML = `
			<div id="subscription-modal" class="fixed inset-0 z-50 hidden" aria-hidden="true">
				<div data-close-subscription-modal class="absolute inset-0 bg-gray-900/60 backdrop-blur-sm"></div>
				<div data-subscription-modal-frame class="relative flex min-h-full items-center justify-center p-4 sm:p-6">
					<div data-subscription-modal-panel class="relative w-full max-w-5xl overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-2xl">
						<div class="flex items-start justify-between gap-4 border-b border-gray-200 px-5 py-5 sm:px-8">
							<div>
								<p class="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600">自助订阅</p>
								<h3 class="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl">选择产品入口</h3>
								<p class="mt-2 max-w-2xl text-sm leading-6 text-gray-600">两个产品分别对应独立域名、兑换系统和教程。先看适用场景与兑换方式，再进入对应系统。</p>
							</div>
							<button type="button" data-close-subscription-modal class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900" aria-label="关闭弹窗">
								<span class="text-2xl leading-none">&times;</span>
							</button>
						</div>
						<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:gap-6 sm:p-8">
							${subscriptionOptions.map(renderSubscriptionCard).join('')}
						</div>
					</div>
				</div>
			</div>`;

		const modal = document.getElementById('subscription-modal');
		const triggers = document.querySelectorAll('[data-open-subscription-modal]');
		const closers = root.querySelectorAll('[data-close-subscription-modal]');
		const frame = root.querySelector('[data-subscription-modal-frame]');
		const panel = root.querySelector('[data-subscription-modal-panel]');
		const menuOverlay = document.getElementById('mobile-menu-overlay');
		if (!modal) return;

		const syncBodyOverflow = () => {
			const menuOpen = menuOverlay && menuOverlay.classList.contains('active');
			const modalOpen = !modal.classList.contains('hidden');
			document.body.style.overflow = menuOpen || modalOpen ? 'hidden' : '';
		};

		const openModal = () => {
			modal.classList.remove('hidden');
			modal.setAttribute('aria-hidden', 'false');
			syncBodyOverflow();
		};

		const closeModal = () => {
			modal.classList.add('hidden');
			modal.setAttribute('aria-hidden', 'true');
			syncBodyOverflow();
		};

		triggers.forEach((trigger) => {
			trigger.addEventListener('click', (event) => {
				if (event.target instanceof Element && event.target.closest('[data-direct-subscription-link]')) return;
				event.preventDefault();
				openModal();
			});
			trigger.addEventListener('keydown', (event) => {
				if (event.target instanceof Element && event.target.closest('[data-direct-subscription-link]')) return;
				if (event.key === 'Enter' || event.key === ' ') {
					event.preventDefault();
					openModal();
				}
			});
		});

		closers.forEach((closer) => closer.addEventListener('click', closeModal));
		if (panel) {
			modal.addEventListener('click', (event) => {
				if (!(event.target instanceof Node)) return;
				if (!panel.contains(event.target)) closeModal();
			});
		}
		document.addEventListener('keydown', (event) => {
			if (event.key === 'Escape' && !modal.classList.contains('hidden')) closeModal();
		});
	} catch (error) {
		console.error('Error initializing subscription modal:', error);
	}
};

document.addEventListener('DOMContentLoaded', initSubscriptionModal);
