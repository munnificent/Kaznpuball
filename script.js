const calculateButton = document.getElementById('calculate');
const resultElement = document.getElementById('result');

calculateButton.addEventListener('click', (e) => {
    e.preventDefault();
    const control1 = parseInt(document.getElementById('control1').value);
    const control2 = parseInt(document.getElementById('control2').value);
    const session = parseInt(document.getElementById('session').value);

    if (isNaN(control1) || isNaN(control2) || isNaN(session)) {
        alert('Введите корректные значения!');
        return;
    }

    const totalScore = (control1 + control2) * 0.3 + session * 0.4;
    const grade = getGrade(totalScore);

    let resultText = `Итоговый балл: ${totalScore.toFixed(2)} (${grade})`;

    if (grade === 'FX') {
        resultText += ' - Пересдача дисциплины';
    } else if (grade === 'F') {
        resultText += ' - Не сдача, летний семестр (платная пересдача)';
    }

    resultElement.textContent = resultText;
});

function getGrade(score) {
    if (score >= 95) return 'A';
    if (score >= 90) return 'A-';
    if (score >= 85) return 'B+';
    if (score >= 80) return 'B';
    if (score >= 75) return 'B-';
    if (score >= 70) return 'C+';
    if (score >= 65) return 'C';
    if (score >= 60) return 'C-';
    if (score >= 55) return 'D+';
    if (score >= 50) return 'D';
    if (score >= 25) return 'FX';
    return 'F';
}