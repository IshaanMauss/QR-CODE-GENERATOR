document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById('generate-form');
    const urlInput = document.getElementById('url');
    const sizeSelect = document.getElementById('size');
    const qrCodeContainer = document.getElementById('qrcode');
    const generatedContainer = document.getElementById('generated');
    const spinner = document.getElementById('spinner');
    const placeholderText = document.getElementById('placeholder-text');
    const generateBtn = document.getElementById('generate-btn');

    // --- Utility Functions ---

    const showSpinner = () => {
        spinner.style.display = 'block';
        placeholderText.style.display = 'none';
    };
    
    const hideSpinner = () => {
        spinner.style.display = 'none';
    };

    const clearUI = () => {
        qrCodeContainer.innerHTML = '';
        const saveLink = document.getElementById('save-link');
        if (saveLink) {
            saveLink.remove();
        }
    };
    
    const isValidUrl = (string) => {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    };

    // --- Core Functions ---

    const generateQRCode = (url, size) => {
        clearUI();
        showSpinner();

        setTimeout(() => {
            hideSpinner();
            new QRCode(qrCodeContainer, {
                text: url,
                width: parseInt(size),
                height: parseInt(size),
                colorDark: "#ffffff",
                colorLight: "#1e293b", // bg-slate-800
            });

            setTimeout(() => {
                const saveUrl = qrCodeContainer.querySelector('img').src;
                createSaveBtn(saveUrl);
            }, 50);

        }, 500); // Shorter delay for better UX
    };

    const createSaveBtn = (saveUrl) => {
        const link = document.createElement('a');
        link.id = 'save-link';
        link.href = saveUrl;
        link.download = 'qrcode';
        link.innerHTML = 'Save Image';
        link.className = 'block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-6 rounded w-fit mt-5 mx-auto transition-colors';
        generatedContainer.appendChild(link);
    };

    // --- Event Listeners ---

    // Real-time URL validation and button state
    urlInput.addEventListener('input', () => {
        if (isValidUrl(urlInput.value)) {
            urlInput.classList.remove('border-red-500');
            urlInput.classList.add('border-green-500');
            generateBtn.disabled = false;
            // Instant generation on valid URL
            generateQRCode(urlInput.value, sizeSelect.value);
        } else {
            urlInput.classList.add('border-red-500');
            urlInput.classList.remove('border-green-500');
            generateBtn.disabled = true;
            clearUI();
            placeholderText.style.display = 'block';
        }
    });

    // Form submission for manual generation
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const url = urlInput.value;
        const size = sizeSelect.value;
        if (isValidUrl(url)) {
            generateQRCode(url, size);
        }
    });
    
    // Re-generate when size changes
    sizeSelect.addEventListener('change', () => {
        const url = urlInput.value;
        if (isValidUrl(url)) {
            generateQRCode(url, sizeSelect.value);
        }
    });

    // --- Initial State ---
    
    generateBtn.disabled = true;
    hideSpinner();
});