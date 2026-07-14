document.addEventListener('DOMContentLoaded', () => {
    // Estimator Logic
    const calcForm = document.getElementById('calcForm');
    const serviceType = document.getElementById('serviceType');
    const carYear = document.getElementById('carYear');
    const resultArea = document.getElementById('resultArea');
    const priceResult = document.getElementById('priceResult');
    const formAlert = document.getElementById('formAlert');

    // Base prices dictionary (CLP)
    const priceData = {
        mantencion: { antiguo: 75000, medio: 95000, nuevo: 135000 },
        frenos: { antiguo: 45000, medio: 65000, nuevo: 95000 },
        suspension: { antiguo: 120000, medio: 160000, nuevo: 220000 },
        bateria: { antiguo: 55000, medio: 75000, nuevo: 110000 }
    };

    // Formatter for CLP
    const clpFormatter = new Intl.NumberFormat('es-CL', {
        style: 'currency',
        currency: 'CLP',
        maximumFractionDigits: 0
    });

    calcForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Reset validation state
        calcForm.classList.remove('was-validated');
        formAlert.classList.add('d-none');
        resultArea.classList.add('d-none');
        
        const service = serviceType.value;
        const year = carYear.value;

        // Custom validation check
        if (!service || !year) {
            formAlert.classList.remove('d-none');
            // Allow Bootstrap's native validation UI to show up
            calcForm.classList.add('was-validated');
            return;
        }

        // Calculate price range (+/- 15% for the referential range)
        const basePrice = priceData[service][year];
        const minPrice = Math.floor(basePrice * 0.85);
        const maxPrice = Math.floor(basePrice * 1.15);

        // Format to CLP
        const formattedMin = clpFormatter.format(minPrice);
        const formattedMax = clpFormatter.format(maxPrice);

        // Render result text
        priceResult.textContent = `${formattedMin} - ${formattedMax}`;
        
        // Handle reveal animation
        priceResult.classList.remove('reveal-anim');
        
        // Show result area
        resultArea.classList.remove('d-none');
        
        // Trigger reflow to restart animation
        void priceResult.offsetWidth;
        
        // Add animation class
        priceResult.classList.add('reveal-anim');
        
        // Optional: Scroll to result smoothly if on mobile
        if(window.innerWidth < 768) {
            resultArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
    });

    // Clear alert when user changes a select
    [serviceType, carYear].forEach(el => {
        el.addEventListener('change', () => {
            if (serviceType.value && carYear.value) {
                formAlert.classList.add('d-none');
                calcForm.classList.remove('was-validated');
            }
        });
    });
});
