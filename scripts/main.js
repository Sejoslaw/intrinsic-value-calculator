document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('valuation-form');
    const resultsSection = document.getElementById('results');
    const ivValueSpan = document.getElementById('iv-value');
    const mosValueSpan = document.getElementById('mos-value');
    const decisionText = document.getElementById('decision-text');
    const decisionPanel = document.getElementById('decision-panel');
    const breakdownDiv = document.getElementById('valuation-breakdown');

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const currencyUnit = document.getElementById('currency-unit').value.toUpperCase().trim();
        const price = parseFloat(document.getElementById('price').value);
        const peRatio = parseFloat(document.getElementById('pe-ratio').value);
        const pbRatio = parseFloat(document.getElementById('pb-ratio').value);
        const roe = parseFloat(document.getElementById('roe').value);
        const mosPercent = parseFloat(document.getElementById('mos-input').value);
        const minRoe = parseFloat(document.getElementById('min-roe').value);
        const maxPe = parseFloat(document.getElementById('max-pe').value);

        if (price <= 0 || peRatio <= 0 || pbRatio <= 0 || roe < 0 || minRoe < 0 || maxPe <= 0 || currencyUnit === "") {
            displayError("Wszystkie wskaźniki i jednostka walutowa muszą być wartościami dodatnimi/określonymi.");
            return;
        }

        const analysisResult = analyzeRatios(price, peRatio, pbRatio, roe, mosPercent, minRoe, maxPe, currencyUnit);

        displayAnalysisResults(price, analysisResult, currencyUnit);
    });

    function displayError(message) {
        resultsSection.classList.remove('hidden');
        decisionPanel.className = '';
        decisionPanel.classList.add('status-sell');
        decisionText.textContent = `Błąd: ${message}`;
        breakdownDiv.innerHTML = '<p>Błąd w danych wejściowych.</p>';
        ivValueSpan.textContent = 'N/A';
        mosValueSpan.textContent = 'N/A';
    }

    function displayAnalysisResults(currentPrice, result, currencyUnit) {
        resultsSection.classList.remove('hidden');

        const CURRENCY_DISPLAY = ` ${currencyUnit}`;

        ivValueSpan.textContent = `${result.ivEstimate.toFixed(2)}${CURRENCY_DISPLAY}`;
        mosValueSpan.textContent = `${result.buyPrice.toFixed(2)}${CURRENCY_DISPLAY} (z MoS ${document.getElementById('mos-input').value}%)`;

        let qualityText = result.qualityScore > 0 ? `TAK (Wymagane > ${result.minRoe}%)` : `NIE (Wymagane > ${result.minRoe}%)`;

        breakdownDiv.innerHTML = `
            <p><strong>Wyliczony EPS:</strong> ${result.eps.toFixed(2)}${CURRENCY_DISPLAY}</p>
            <p><strong>Wyliczona Wartość Księgowa (BVPS):</strong> ${result.bvps.toFixed(2)}${CURRENCY_DISPLAY}</p>
            <p><strong>Wysoka Jakość:</strong> <span class="quality-${result.qualityScore > 0 ? 'good' : 'bad'}">${qualityText}</span></p>
            <p><strong>Aktualna Cena:</strong> ${currentPrice.toFixed(2)}${CURRENCY_DISPLAY}</p>
        `;

        decisionPanel.className = '';
        decisionPanel.classList.add(result.status);
        decisionText.textContent = result.finalDecision;
    }
});