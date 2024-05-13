const calculateButton = document.getElementById('calculate');
const resultElement = document.getElementById('result');
const modeSwitch = document.getElementById('mode-switch');

let mode = 1; // 1 - calculate total score, 2 - calculate required session score

modeSwitch.addEventListener('change', () => {
  mode = mode === 1 ? 2 : 1;
  const sessionLabel = document.querySelector('label[for="session"]');
  const helperTexts = document.querySelectorAll('.helper-text');
  const calculateButtonText = mode === 1 ? 'Рассчитать итоговый балл' : 'Рассчитать необходимый балл сессии';

  sessionLabel.textContent = mode === 1 ? 'Сессия:' : 'Желаемый итоговый балл:';
  helperTexts[2].textContent = mode === 1 ? 'Введите баллы за сессию' : 'Введите желаемый итоговый балл';
  calculateButton.textContent = calculateButtonText;
});

calculateButton.addEventListener('click', (e) => {
    e.preventDefault();
    const control1 = parseInt(document.getElementById('control1').value);
    const control2 = parseInt(document.getElementById('control2').value);
    const session = parseInt(document.getElementById('session').value);

    if (isNaN(control1) || isNaN(control2) || isNaN(session)) {
        alert('Введите корректные значения!');
        return;
    }

    let totalScore;
    if (mode === 1) {
        totalScore = (control1 + control2) * 0.3 + session * 0.4;
    } else {
        totalScore = (session - (control1 + control2) * 0.3) / 0.4;
    }

    const grade = getGrade(totalScore);

    if (mode === 2) {
        resultText = `Необходимый мин. балл сессии: ${totalScore.toFixed(2)}`;
    } else {
        resultText = `Итоговый балл: ${totalScore.toFixed(2)}`;
    }

    if (grade) {
        resultText += ` (${grade})`;
        if (grade === 'FX') {
            resultText += ' - Пересдача дисциплины';
        } else if (grade === 'F') {
            resultText += ' - Не сдача, летний семестр (платная пересдача)';
        }
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