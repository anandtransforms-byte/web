// Handle form submission
document.getElementById('notify-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = this.querySelector('input[type="email"]').value;
    if (email) {
        const btn = this.querySelector('.btn-submit');
        const originalText = btn.innerHTML;
        btn.innerHTML = 'Saved! ✨';
        btn.style.background = '#059669';
        this.querySelector('input[type="email"]').value = '';
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = '';
        }, 3000);
    }
});

