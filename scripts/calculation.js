function analyzeRatios(price, peRatio, pbRatio, roe, mosPercent, minRoe, maxPe, currencyUnit) {
    const eps = price / peRatio;
    const bvps = price / pbRatio;
    const roeDecimal = roe / 100;
    const mosDecimal = mosPercent / 100;
    const ivEstimate = bvps * (1 + roeDecimal * 10);
    const IS_HIGH_QUALITY = roe >= minRoe;
    const BENCHMARK_PE = maxPe;

    let valuationScore = 0;
    let qualityScore = 0;

    if (peRatio <= BENCHMARK_PE) {
        valuationScore += 1;
    }

    if (pbRatio <= 3 && IS_HIGH_QUALITY) {
        valuationScore += 1;
    } else if (pbRatio > 3 && !IS_HIGH_QUALITY) {
        valuationScore -= 1;
    }

    if (IS_HIGH_QUALITY) {
        qualityScore += 2;
    }

    const buyPrice = ivEstimate * (1 - mosDecimal);
    const CURR = ` ${currencyUnit}`;

    let finalDecision = "TRZYMAJ / ANALIZUJ DALEJ";
    let status = "status-neutral";

    if (qualityScore > 0 && price <= buyPrice) {
        finalDecision = `MOCNE KUPUJ: Wysoka Jakość (ROE > ${minRoe}%) i Cena (${price.toFixed(2)}${CURR}) poniżej ceny z MoS (${buyPrice.toFixed(2)}${CURR}).`;
        status = "status-buy";
    } else if (qualityScore > 0 && price <= ivEstimate) {
        finalDecision = `KUPUJ: Wysoka Jakość, Uczciwa Wycena. Cena ${price.toFixed(2)}${CURR} jest bliska IV (${ivEstimate.toFixed(2)}${CURR}).`;
        status = "status-buy";
    } else if (price > ivEstimate) {
        finalDecision = `UNIKAJ/SPRZEDAJ: Przewartościowane. Cena ${price.toFixed(2)}${CURR} jest wyższa niż IV (${ivEstimate.toFixed(2)}${CURR}).`;
        status = "status-sell";
    } else {
        finalDecision = `TRZYMAJ: Niska Jakość (ROE < ${minRoe}%) lub cena nie daje wystarczającego MoS.`;
        status = "status-neutral";
    }

    return {
        eps: eps,
        bvps: bvps,
        ivEstimate: ivEstimate,
        buyPrice: buyPrice,
        finalDecision: finalDecision,
        status: status,
        qualityScore: qualityScore,
        minRoe: minRoe
    };
}