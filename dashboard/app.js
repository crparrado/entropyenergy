// Constants and Config
const HOURS = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
const BASE_TEMP = 22; // Reference temperature for neutral impact

// State
const state = {
    temperature: 22,
    occupancy: 80,
    efficiency: 1.0
};

// Mock Data Generation
// Generates a base load curve that looks somewhat realistic (low at night, high during day)
function generateBaseLoad() {
    return HOURS.map((_, i) => {
        // Night base: 5-10
        // Day peak (10am - 6pm): 40-60
        // Transitions in between
        let val;
        if (i < 6) val = 5 + Math.random() * 5;
        else if (i < 9) val = 10 + (i - 6) * 10 + Math.random() * 5;
        else if (i < 18) val = 40 + Math.random() * 20; // Peak hours
        else if (i < 22) val = 40 - (i - 18) * 8 + Math.random() * 5;
        else val = 8 + Math.random() * 5;

        return Math.max(0, val);
    });
}

const baseData = generateBaseLoad();

// Simulation Logic
function calculateSimulatedLoad(baseLoad, temp, occupancy, efficiency) {
    return baseLoad.map((val, i) => {
        // 1. Temperature Impact (HVAC)
        // Assume HVAC is 40% of load during day
        // Deviation from 22C increases load. +10% per 5 degrees diff?
        const tempDiff = Math.abs(temp - BASE_TEMP);
        const tempFactor = 1 + (tempDiff * 0.02); // 2% increase per degree deviation

        // 2. Occupancy Impact
        // Linear scaling of variable load (assume 50% is fixed, 50% variable)
        const occupancyFactor = 0.5 + (0.5 * (occupancy / 100));

        // 3. Efficiency Factor (Inverse: higher efficiency = lower load)
        // Input is "Efficiency Factor" where 0.5 is High (good), 1.5 is Low (bad)
        // So we just multiply by the factor directly if 1.0 is baseline.
        // Wait, UI says 0.5 is High. Usually High Efficiency means Low Consumption.
        // So if factor is 0.5, consumption should be * 0.5. Correct.

        let simulated = val * tempFactor * occupancyFactor * efficiency;
        return simulated;
    });
}

// Chart Initialization
let chart;

function initChart() {
    const ctx = document.getElementById('energyChart').getContext('2d');

    // Gradient for the simulated line
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(56, 189, 248, 0.5)');
    gradient.addColorStop(1, 'rgba(56, 189, 248, 0.0)');

    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: HOURS,
            datasets: [
                {
                    label: 'Consumo Histórico (Base)',
                    data: baseData,
                    borderColor: '#94a3b8', // slate-400
                    borderWidth: 2,
                    borderDash: [5, 5],
                    tension: 0.4,
                    pointRadius: 0,
                    fill: false
                },
                {
                    label: 'Consumo Simulado',
                    data: baseData, // Initial state
                    borderColor: '#38bdf8', // sky-400
                    backgroundColor: gradient,
                    borderWidth: 3,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: false // Using custom legend
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    titleColor: '#f8fafc',
                    bodyColor: '#cbd5e1',
                    borderColor: '#334155',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: true,
                    callbacks: {
                        label: function (context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + ' kWh';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                y: {
                    grid: {
                        color: '#334155',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#94a3b8'
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

// UI Updates
function updateDashboard() {
    // 1. Calculate new data
    const simulatedData = calculateSimulatedLoad(
        baseData,
        state.temperature,
        state.occupancy,
        state.efficiency
    );

    // 2. Update Chart
    chart.data.datasets[1].data = simulatedData;
    chart.update('none'); // 'none' mode for performance

    // 3. Update KPIs
    const totalBase = baseData.reduce((a, b) => a + b, 0);
    const totalSim = simulatedData.reduce((a, b) => a + b, 0);

    document.getElementById('baseKpi').textContent = totalBase.toFixed(0) + ' kWh';
    document.getElementById('simKpi').textContent = totalSim.toFixed(0) + ' kWh';
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    initChart();

    // Initial calculation
    updateDashboard();

    // Inputs
    const tempInput = document.getElementById('tempRange');
    const occInput = document.getElementById('occupancyRange');
    const effInput = document.getElementById('efficiencyRange');

    const tempVal = document.getElementById('tempValue');
    const occVal = document.getElementById('occupancyValue');
    const effVal = document.getElementById('efficiencyValue');

    tempInput.addEventListener('input', (e) => {
        state.temperature = parseFloat(e.target.value);
        tempVal.textContent = state.temperature + '°C';
        updateDashboard();
    });

    occInput.addEventListener('input', (e) => {
        state.occupancy = parseFloat(e.target.value);
        occVal.textContent = state.occupancy + '%';
        updateDashboard();
    });

    effInput.addEventListener('input', (e) => {
        state.efficiency = parseFloat(e.target.value);
        effVal.textContent = state.efficiency + 'x';
        updateDashboard();
    });
});
