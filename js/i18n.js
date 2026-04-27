// 轻量 i18n 运行时：扫描 [data-i18n] 替换文本，支持 ?lang= 与 localStorage
// 字典位置：js/i18n/{zh,en}.json，缺 key 自动 fallback 到默认语言（zh）
(function () {
    'use strict';

    const SUPPORTED = ['zh', 'en'];
    const DEFAULT_LANG = 'zh';
    const STORAGE_KEY = 'lioncc-lang';
    const dicts = {};
    let currentLang = DEFAULT_LANG;

    function detectLang() {
        // 优先级：URL ?lang= > localStorage > 默认（zh）
        // navigator.language 检测暂不启用——en.json 当前为空，自动切到 EN 反而误导用户。
        // 待 en.json 完成翻译后再开启 navigator 探测。
        const urlLang = new URLSearchParams(location.search).get('lang');
        if (urlLang && SUPPORTED.includes(urlLang)) return urlLang;

        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored && SUPPORTED.includes(stored)) return stored;

        return DEFAULT_LANG;
    }

    async function loadDict(lang) {
        if (dicts[lang]) return dicts[lang];
        try {
            const res = await fetch(`js/i18n/${lang}.json`, { cache: 'no-cache' });
            dicts[lang] = await res.json();
        } catch (e) {
            dicts[lang] = {};
        }
        return dicts[lang];
    }

    function t(key) {
        const cur = dicts[currentLang] && dicts[currentLang][key];
        if (cur) return cur;
        const fallback = dicts[DEFAULT_LANG] && dicts[DEFAULT_LANG][key];
        return fallback || key;
    }

    function applyTranslations(root) {
        (root || document).querySelectorAll('[data-i18n]').forEach(function (el) {
            const key = el.getAttribute('data-i18n');
            const val = t(key);
            if (val && val !== key) el.textContent = val;
        });
        // 同步 html lang 与切换器文案
        document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
        document.querySelectorAll('[data-lang-switcher]').forEach(function (el) {
            el.textContent = currentLang === 'zh' ? 'EN' : '中';
            el.setAttribute('aria-label', currentLang === 'zh' ? 'Switch to English' : '切换到中文');
        });
    }

    async function setLang(lang) {
        if (!SUPPORTED.includes(lang) || lang === currentLang) return;
        currentLang = lang;
        localStorage.setItem(STORAGE_KEY, lang);
        // URL 同步（不触发刷新）
        const url = new URL(location);
        url.searchParams.set('lang', lang);
        history.replaceState(null, '', url);
        if (lang !== DEFAULT_LANG) await loadDict(DEFAULT_LANG);
        await loadDict(lang);
        applyTranslations();
    }

    function bindSwitchers() {
        document.addEventListener('click', function (e) {
            const target = e.target.closest('[data-lang-switcher],[data-switch-lang]');
            if (!target) return;
            e.preventDefault();
            const explicit = target.getAttribute('data-switch-lang');
            const next = explicit || (currentLang === 'zh' ? 'en' : 'zh');
            setLang(next);
        });
    }

    async function init() {
        currentLang = detectLang();
        await loadDict(DEFAULT_LANG);
        if (currentLang !== DEFAULT_LANG) await loadDict(currentLang);
        applyTranslations();
        bindSwitchers();
    }

    window.i18n = { t: t, setLang: setLang, getLang: function () { return currentLang; } };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
