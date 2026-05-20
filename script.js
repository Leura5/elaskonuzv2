const apiURL = "https://v6.exchangerate-api.com/v6/090ac4144cd93c5c85314a26/latest/USD";

const units = {
    currency: ["USD", "TRY", "EUR", "GBP", "JPY", "CAD"],
    weight: ["Kilogram", "Gram", "Pound", "Ons"]
};

const categorySelect = document.getElementById('category');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convertBtn');
const resultText = document.getElementById('resultText');
const swapBtn = document.getElementById('swapBtn');


const tickerGold = document.getElementById('tickerGold');
const tickerUsd = document.getElementById('tickerUsd');
const tickerEur = document.getElementById('tickerEur');


async function loadLiveTicker() {


    try {
        const res = await fetch(apiURL);
        const data = await res.json();
        const rates = data.conversion_rates;

    
        const usdToTl = rates.TRY || 45.59;
        tickerUsd.innerText = `${usdToTl.toFixed(2)} TL`;

    
        const eurToTl = rates.EUR ? ((1 / rates.EUR) * usdToTl) : 52.90;
        tickerEur.innerText = `${eurToTl.toFixed(2)} TL`;

       
        if (rates && rates.XAU && rates.XAU > 0) {
            const goldGramToTl = ((1 / rates.XAU) * usdToTl) / 31.1035;
            tickerGold.innerText = `${goldGramToTl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} TL`;
        } else {
        
            tickerGold.innerText = "6.563,77 TL"; 
        }
        

    } catch (err)
    
    {
       
        tickerGold.innerText = "6.563,77 TL";
        tickerUsd.innerText = "45.59 TL";
        tickerEur.innerText = "52.90 TL";
    }
}

function populateUnits() {
    const cat = categorySelect.value;
    const options = units[cat].map(u => `<option value="${u}">${u}</option>`).join('');
    fromUnit.innerHTML = options;
    toUnit.innerHTML = options;
    if(cat === "currency") toUnit.value = "TRY"; 
    if(cat === "weight") toUnit.value = "Gram";
}


async function calculate() {
    const amount = parseFloat(amountInput.value);
    if (isNaN(amount)) return;

    convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    try {
        if (categorySelect.value === "currency") {
            const res = await fetch(apiURL);
            const data = await res.json();
            const rates = data.conversion_rates;
            const result = (amount / rates[fromUnit.value]) * rates[toUnit.value];
            displayResult(result, toUnit.value);
        } else {
            const result = convertWeight(amount, fromUnit.value, toUnit.value);
            displayResult(result, toUnit.value);
        }
    } catch (err) {
        resultText.innerText = "Hata!";
    } finally {
        convertBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Hesapla';
    }
}

function convertWeight(val, from, to) {
    const ratesInGram = { "Kilogram": 1000, "Gram": 1, "Pound": 453.59, "Ons": 28.35 };
    const grams = val * ratesInGram[from];
    return grams / ratesInGram[to];
}

function displayResult(val, unit) {
    let unitSymbol = unit;
    if (unit === "Kilogram") unitSymbol = "kg";
    if (unit === "Gram") unitSymbol = "g";
    if (unit === "Pound") unitSymbol = "lb";
    if (unit === "Ons") unitSymbol = "oz";

    resultText.innerText = `${val.toLocaleString(undefined, {maximumFractionDigits: 2})} ${unitSymbol}`;
}


swapBtn.addEventListener('click', () => {
    const temp = fromUnit.value;
    fromUnit.value = toUnit.value;
    toUnit.value = temp;
    calculate();
});

categorySelect.addEventListener('change', () => {
    populateUnits();
    calculate();
});


document.getElementById('lastUpdated').innerText = "Son güncelleme: " + new Date().toLocaleTimeString('tr-TR');

convertBtn.addEventListener('click', calculate);

populateUnits();
loadLiveTicker();
calculate();