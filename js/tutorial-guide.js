(() => {
	const progressBar = document.getElementById('scrollProgress');
	if (progressBar) {
		const updateScrollProgress = () => {
			const scrollable = document.body.scrollHeight - window.innerHeight;
			progressBar.style.height = scrollable > 0 ? `${(window.scrollY / scrollable) * 100}%` : '0%';
		};
		window.addEventListener('scroll', updateScrollProgress, { passive: true });
		updateScrollProgress();
	}

	const cursorGlow = document.getElementById('cursorGlow');
	if (cursorGlow) {
		window.addEventListener('mousemove', (event) => {
			cursorGlow.style.left = `${event.clientX}px`;
			cursorGlow.style.top = `${event.clientY}px`;
		});
	}

	const revealElements = document.querySelectorAll('.reveal');
	if ('IntersectionObserver' in window) {
		const observer = new IntersectionObserver((entries) => {
			entries.forEach((entry) => {
				if (!entry.isIntersecting) return;
				setTimeout(() => entry.target.classList.add('visible'), parseInt(entry.target.dataset.delay || '0', 10));
				observer.unobserve(entry.target);
			});
		}, { threshold: 0.1 });
		revealElements.forEach((element) => observer.observe(element));
	} else {
		revealElements.forEach((element) => element.classList.add('visible'));
	}

	document.querySelectorAll('[data-copy-text]').forEach((button) => {
		button.addEventListener('click', async () => {
			const originalText = button.textContent;
			const value = button.dataset.copyText || '';
			try {
				if (navigator.clipboard?.writeText) {
					await navigator.clipboard.writeText(value);
				} else {
					throw new Error('clipboard unavailable');
				}
			} catch (_error) {
				const input = document.createElement('textarea');
				input.value = value;
				document.body.appendChild(input);
				input.select();
				document.execCommand('copy');
				input.remove();
			}
			button.textContent = '已复制';
			clearTimeout(button._copyTimer);
			button._copyTimer = setTimeout(() => {
				button.textContent = originalText;
			}, 1600);
		});
	});

	const lightbox = document.getElementById('lightbox');
	const lightboxImage = document.getElementById('lightboxImg');

	window.openLightbox = (src) => {
		if (!lightbox || !lightboxImage) return;
		lightboxImage.src = src;
		lightbox.classList.add('active');
		document.body.style.overflow = 'hidden';
	};

	window.closeLightbox = () => {
		if (!lightbox) return;
		lightbox.classList.remove('active');
		document.body.style.overflow = '';
	};

	document.addEventListener('keydown', (event) => {
		if (event.key === 'Escape') window.closeLightbox();
	});
})();
