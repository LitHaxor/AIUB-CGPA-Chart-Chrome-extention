function createGpaChart() {
    const gpas = [];
    const cgpas = [];
    const semesters = [];
    const table = document.querySelector('.grade-report');

    if (!table) {
        console.error('Grade report table not found.');
        return;
    }

    // Create and style the chart container
    const chartContainer = document.createElement('div');
    const h2 = document.createElement('h2');
    h2.textContent = 'GPA/CGPA Chart';
    h2.style.textAlign = 'center';
    h2.style.marginBottom = '20px';
    chartContainer.appendChild(h2);

    chartContainer.style.marginTop = '20px';
    chartContainer.style.marginBottom = '20px';
    chartContainer.style.border = '1px solid #ccc';
    chartContainer.style.padding = '20px';
    // chartContainer.style.borderRadius = '10px';
    // chartContainer.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
    chartContainer.style.backgroundColor = '#f9f9f9';

    const firstTable = table.querySelector('table');

    if (!firstTable) {
        console.error('First table not found.');
        return;
    }

    const secondTable = table.querySelectorAll('table')[1];

    if (!secondTable) {
        console.error('Second table not found.');
        return;
    }

    const tableBody = secondTable.querySelector('tbody');

    if (!tableBody) {
        console.error('Table body not found.');
        return;
    }

    const rows = tableBody.querySelectorAll('tr');

    rows.forEach((row) => {
        const td = row.querySelectorAll('td');

        if (td.length === 1) {
            const semester = td[0].textContent.trim()?.replace('*** ', '');
            semesters.push(semester);
        }

        if (td.length === 6) {
            const gpa = td[3].textContent.trim();
            const cgpa = td[4].textContent.trim();

            if (gpa === '0.00') {
                semesters.pop();
                return;
            }

            gpas.push(parseFloat(gpa));
            cgpas.push(parseFloat(cgpa));
        }
    });

    if (gpas.length === 0 || cgpas.length === 0) {
        console.error('No valid GPA/CGPA data found.');
        return;
    }

    chartContainer.innerHTML += '<canvas id="gpaChart"></canvas>';
    firstTable.parentNode.insertBefore(chartContainer, firstTable.nextSibling);

    const lowestGpa = Math.round(Math.min(...gpas) * 100) / 100 - 0.125;

    const ctx = document.getElementById('gpaChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: semesters,
            datasets: [
                {
                    label: 'GPA',
                    data: gpas,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    fill: false,
                    tension: 0.4
                },
                {
                    label: 'CGPA',
                    data: cgpas,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: false,
                    tension: 0.4
                }
            ]
        },
        options: {
            scales: {
                y: {
                    max: 4.0,
                    min: lowestGpa,
                }
            }
        }
    });
}

function injectChartJsCdn() {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = chrome.runtime.getURL('libs/chart.min.js');
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

async function init() {
    try {
        await injectChartJsCdn();
        createGpaChart();
    } catch (error) {
        console.error('Error loading Chart.js:', error);
    }
}

window.addEventListener('load', init);
