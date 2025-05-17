document.addEventListener('DOMContentLoaded', function() {
    const elements = {
        loanAmount: {
            slider: document.getElementById('loan-amount'),
            value: document.getElementById('amount-value')
        },
        loanTerm: {
            slider: document.getElementById('loan-term'),
            value: document.getElementById('term-value')
        },
        creditScore: {
            slider: document.getElementById('credit-score'),
            value: document.getElementById('score-value')
        },
        dti: {
            slider: document.getElementById('dti'),
            value: document.getElementById('dti-value')
        },
        revolUtil: {
            slider: document.getElementById('revol-util'),
            value: document.getElementById('revol-util-value')
        }
    };

    const results = {
        monthlyPayment: document.getElementById('monthly-payment'),
        interestRate: document.getElementById('interest-rate'),
        totalCost: document.getElementById('total-cost')
    };

    function formatCurrency(value) {
        return new Intl.NumberFormat('en-US').format(value);
    }

    function updateSliderValue(element, isCurrency = false) {
        const value = element.slider.value;
        element.value.textContent = isCurrency ? formatCurrency(value) : value;
        
        element.value.classList.add('value-change');
        setTimeout(() => {
            element.value.classList.remove('value-change');
        }, 300);

        updateSliderBackground(element.slider);
    }

    function updateSliderBackground(slider) {
        const value = ((slider.value - slider.min) / (slider.max - slider.min)) * 100;
        slider.style.background = `linear-gradient(to right, var(--accent) 0%, var(--accent) ${value}%, var(--border) ${value}%, var(--border) 100%)`;
    }

    Object.entries(elements).forEach(([key, element]) => {
        updateSliderValue(element, key === 'loanAmount');
        updateSliderBackground(element.slider);
    });

    function animateValue(element, newValue) {
        element.classList.add('value-change');
        element.textContent = newValue;
        setTimeout(() => {
            element.classList.remove('value-change');
        }, 300);
    }

    async function calculateLoan() {
        const calculateBtn = document.getElementById('calculate');
        calculateBtn.disabled = true;
        calculateBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Calculating...';

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gatherInputData())
            });

            const data = await response.json();
            
            animateValue(results.monthlyPayment, formatCurrency(data.monthly_payment));
            animateValue(results.interestRate, data.interest_rate.toFixed(2));
            animateValue(results.totalCost, formatCurrency(data.total_cost));

        } catch (error) {
            console.error('Error calculating loan:', error);
        } finally {
            calculateBtn.disabled = false;
            calculateBtn.innerHTML = '<i class="fas fa-calculator"></i> Update Results';
        }
    }

    // Function to calculate term_encoded based on the loan term
    function calculateTermEncoded(termMonths) {
        if (termMonths >= 36 && termMonths < 60) {
            return 0; // 36 months
        } else {
            return 1; // 60 months or more
        }
    }

    function gatherInputData() {
        // Get the loan term and calculate term_encoded
        const termMonths = parseInt(elements.loanTerm.slider.value);
        const termEncoded = calculateTermEncoded(termMonths);

        // Always set verification to "Verified" (verified_Verified = 1, verified_Not_Verified = 0)
        // Always set title_Credit_card_refinancing to "Yes" (1)
        // Always set months since recent inquiry to 6
        // Always set revolving balance to 10000
        return {
            fico: parseInt(elements.creditScore.slider.value),
            loan_amnt: parseFloat(elements.loanAmount.slider.value),
            dti: parseFloat(elements.dti.slider.value),
            revol_util: parseFloat(elements.revolUtil.slider.value),
            total_bc_limit: parseFloat(document.getElementById('total-bc-limit').value),
            revol_bal: 10000,  // Always use 10000
            total_acc: parseFloat(document.getElementById('total-acc').value),
            annual_inc: parseFloat(document.getElementById('annual-income').value),
            mths_since_recent_inq: 6,  // Always use 6
            open_acc: parseFloat(document.getElementById('open-acc').value),
            term_encoded: termEncoded,
            verified_Not_Verified: 0,  // Not verified = No
            verified_Verified: 1,      // Verified = Yes
            title_Credit_card_refinancing: 1,  // Yes
            term: termMonths
        };
    }

    Object.entries(elements).forEach(([key, element]) => {
        element.slider.addEventListener('input', function() {
            updateSliderValue(element, key === 'loanAmount');
        });
    });

    document.getElementById('calculate').addEventListener('click', calculateLoan);

    calculateLoan();
});