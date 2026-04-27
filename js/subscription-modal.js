// 订阅弹窗：内容用 data-i18n 标记，由全局 i18n.js 接管翻译；
// 切换语言时由 i18n.js 的 applyTranslations() 自动覆盖弹窗内文字，无需重渲染。
const subscriptionOptions = [
	{
		accent: 'gray',
		eyebrowKey: 'subscription.gptplus.eyebrow',
		titleKey: 'subscription.gptplus.title',
		domain: 'gptplus.free',
		descriptionKey: 'subscription.entryDescription',
		tagKeys: ['tags.independentBackend', 'tags.tutorial'],
		facts: [
			{ labelKey: 'subscription.factScenario', valueKey: 'subscription.scenarioPlus' },
			{ labelKey: 'subscription.factCardSample', valueRaw: '17ED****-****-****-****-********3CC8' },
			{ labelKey: 'subscription.factThreeSteps', valueKey: 'chatgpt.steps' },
		],
		primaryHref: 'https://gptplus.free',
		secondaryHref: 'pages/gptplus-free-guide.html',
	},
	{
		accent: 'emerald',
		eyebrowKey: 'subscription.chatgptplus.eyebrow',
		titleKey: 'subscription.chatgptplus.title',
		domain: 'chatgptplus.club',
		descriptionKey: 'subscription.entryDescription',
		tagKeys: ['tags.independentBackend', 'tags.tutorial'],
		facts: [
			{ labelKey: 'subscription.factScenario', valueKey: 'subscription.scenarioPlus' },
			{ labelKey: 'subscription.factCardSample', valueRaw: 'Y2DD****O7Y8****' },
			{ labelKey: 'subscription.factThreeSteps', valueKey: 'chatgpt.steps' },
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

	const tags = option.tagKeys
		.map((key) => `<span class="rounded-full border ${theme.tag} bg-white px-3 py-1 text-xs" data-i18n="${key}"></span>`)
		.join('');

	const facts = option.facts
		.map((fact, index) => {
			const valueAttr = fact.valueKey ? ` data-i18n="${fact.valueKey}"` : '';
			const valueText = fact.valueRaw || '';
			return `
				<div class="grid grid-cols-[84px,1fr] gap-3 px-4 py-3 ${index ? 'border-t border-black/5' : ''}">
					<div class="text-[11px] font-semibold uppercase tracking-[0.18em] ${theme.factLabel}" data-i18n="${fact.labelKey}"></div>
					<div class="text-sm leading-6 text-gray-700"${valueAttr}>${valueText}</div>
				</div>`;
		})
		.join('');

	return `
		<article class="rounded-2xl border ${theme.card} p-5 sm:p-6">
			<p class="text-xs font-semibold uppercase tracking-[0.24em] ${theme.eyebrow}" data-i18n="${option.eyebrowKey}"></p>
			<h4 class="mt-3 text-2xl font-bold text-gray-900" data-i18n="${option.titleKey}"></h4>
			<p class="mt-3 break-all text-sm font-mono text-gray-500">${option.domain}</p>
			<p class="mt-4 text-sm leading-6 text-gray-600" data-i18n="${option.descriptionKey}"></p>
			<div class="mt-4 flex flex-wrap gap-2">${tags}</div>
			<div class="mt-5 overflow-hidden rounded-2xl border ${theme.facts}">${facts}
			</div>
			<div class="mt-6 flex flex-col gap-3">
				<a href="${option.primaryHref}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-[44px] items-center justify-center rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${theme.primary}" data-i18n="actions.enterSystem"></a>
				<a href="${option.secondaryHref}" target="_blank" rel="noopener noreferrer" class="inline-flex min-h-[44px] items-center justify-center rounded-lg border px-5 py-2.5 text-sm font-bold transition-all ${theme.secondary}" data-i18n="subscription.inSiteTutorial"></a>
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
								<p class="text-xs font-semibold uppercase tracking-[0.28em] text-emerald-600" data-i18n="subscription.modal.eyebrow"></p>
								<h3 class="mt-2 text-2xl font-bold text-gray-900 sm:text-3xl" data-i18n="subscription.modal.title"></h3>
								<p class="mt-2 max-w-2xl text-sm leading-6 text-gray-600" data-i18n="subscription.modal.description"></p>
							</div>
							<button type="button" data-close-subscription-modal class="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-colors hover:border-gray-300 hover:text-gray-900" data-i18n-aria-label="subscription.modal.closeAria">
								<span class="text-2xl leading-none">&times;</span>
							</button>
						</div>
						<div class="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:gap-6 sm:p-8">
							${subscriptionOptions.map(renderSubscriptionCard).join('')}
						</div>
					</div>
				</div>
			</div>`;

		// 立刻翻译刚插入 DOM 的弹窗内容（原本只在页面加载时翻译过一次，此时弹窗还不存在）
		if (window.i18n && window.i18n.apply) {
			window.i18n.apply(root);
			// aria-label 需要用 setAttribute，不在 textContent 替换的范围内
			root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
				const key = el.getAttribute('data-i18n-aria-label');
				const val = window.i18n.t(key);
				if (val && val !== key) el.setAttribute('aria-label', val);
			});
		}

		const modal = document.getElementById('subscription-modal');
		const triggers = document.querySelectorAll('[data-open-subscription-modal]');
		const closers = root.querySelectorAll('[data-close-subscription-modal]');
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

		// 切换语言后同步 close 按钮的 aria-label（applyTranslations 只改 textContent）
		document.addEventListener('i18n:changed', () => {
			root.querySelectorAll('[data-i18n-aria-label]').forEach((el) => {
				const key = el.getAttribute('data-i18n-aria-label');
				const val = window.i18n.t(key);
				if (val && val !== key) el.setAttribute('aria-label', val);
			});
		});
	} catch (error) {
		console.error('Error initializing subscription modal:', error);
	}
};

// 等 i18n 字典就绪后再 mount，避免英文用户首屏看到中文 modal 的闪烁
function mountSubscriptionModalWhenReady() {
	if (window.i18n && window.i18n.ready) {
		initSubscriptionModal();
	} else {
		document.addEventListener('i18n:ready', initSubscriptionModal, { once: true });
	}
}

document.addEventListener('DOMContentLoaded', mountSubscriptionModalWhenReady);
