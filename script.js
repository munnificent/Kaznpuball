document.addEventListener('DOMContentLoaded', () => {
  // --- КОНФИГУРАЦИЯ И КОНСТАНТЫ ---
  const config = {
    weights: {
      controls: 0.3,
      session: 0.4,
    },
    grades: [
      { score: 95, name: 'A', description: '' },
      { score: 90, name: 'A-', description: '' },
      { score: 85, name: 'B+', description: '' },
      { score: 80, name: 'B', description: '' },
      { score: 75, name: 'B-', description: '' },
      { score: 70, name: 'C+', description: '' },
      { score: 65, name: 'C', description: '' },
      { score: 60, name: 'C-', description: '' },
      { score: 55, name: 'D+', description: '' },
      { score: 50, name: 'D', description: '' },
      { score: 25, name: 'FX', description: ' - Пересдача дисциплины' },
      { score: 0, name: 'F', description: ' - Не сдача, летний семестр (платная пересдача)' },
    ],
    modes: {
      // Режим 1: Расчет итогового балла
      1: {
        buttonText: 'Рассчитать',
        sessionLabel: 'Сессия:',
        sessionHelper: 'Балл за сессию',
      },
      // Режим 2: Расчет необходимого балла
      2: {
        buttonText: 'Рассчитать',
        sessionLabel: 'Желаемый итоговый балл:',
        sessionHelper: 'Введите желаемый балл',
      },
    },
    historyLimit: 3
  };

  // --- ЭЛЕМЕНТЫ DOM ---
  const control1Input = document.getElementById('control1');
  const control2Input = document.getElementById('control2');
  const sessionInput = document.getElementById('session');
  const calculateButton = document.getElementById('calculate');
  const resultElement = document.getElementById('result');
  const modeSwitch = document.getElementById('mode-switch');
  const sessionLabel = document.querySelector('label[for="session"]');
  const sessionHelper = sessionInput.nextElementSibling;
  const historyList = document.getElementById('history-list');

  let currentMode = 1;

  // --- ФУНКЦИИ ---

  /**
   * Обновляет интерфейс в соответствии с выбранным режимом.
   */
  function updateUIMode() {
    const modeConfig = config.modes[currentMode];
    calculateButton.textContent = modeConfig.buttonText;
    sessionLabel.textContent = modeConfig.sessionLabel;
    sessionHelper.textContent = modeConfig.sessionHelper;
    resultElement.textContent = ''; // Очищаем результат при смене режима
  }

  /**
   * Определяет буквенный грейд и его описание по баллу.
   * @param {number} score - Итоговый балл.
   * @returns {object} - Объект с названием грейда и описанием.
   */
  function getGradeInfo(score) {
    return config.grades.find(grade => score >= grade.score);
  }

  /**
   * Валидация входных данных.
   * @param {number} value - Значение для проверки.
   * @returns {boolean} - True, если значение валидно (0-100).
   */
  function isValidScore(value) {
    return value >= 0 && value <= 100;
  }

  /**
   * Сохраняет результат в историю (localStorage).
   * @param {string} resultText - Текст результата.
   */
  function saveHistory(resultText) {
    let history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    history.unshift(resultText); // Добавляем в начало
    if (history.length > config.historyLimit) {
      history.pop(); // Удаляем старый
    }
    localStorage.setItem('calcHistory', JSON.stringify(history));
    loadHistory();
  }

  /**
   * Загружает и отображает историю из localStorage.
   */
  function loadHistory() {
    const history = JSON.parse(localStorage.getItem('calcHistory')) || [];
    historyList.innerHTML = '';
    history.forEach(item => {
      const li = document.createElement('li');
      li.textContent = item;
      historyList.appendChild(li);
    });
  }

  /**
   * Обрабатывает клик по кнопке "Рассчитать".
   */
  function handleCalculate(event) {
    event.preventDefault();

    const control1 = parseFloat(control1Input.value);
    const control2 = parseFloat(control2Input.value);
    const sessionValue = parseFloat(sessionInput.value);

    if (isNaN(control1) || isNaN(control2) || isNaN(sessionValue)) {
      M.toast({ html: 'Пожалуйста, введите все значения' });
      return;
    }

    if (!isValidScore(control1) || !isValidScore(control2) || !isValidScore(sessionValue)) {
      M.toast({ html: 'Значения должны быть от 0 до 100' });
      return;
    }

    let resultScore, resultText;
    const controlsSum = (control1 + control2) * config.weights.controls;

    if (currentMode === 1) {
      // Расчет итогового балла
      resultScore = controlsSum + sessionValue * config.weights.session;
      const gradeInfo = getGradeInfo(resultScore);
      resultText = `Итоговый: ${resultScore.toFixed(2)} (${gradeInfo.name})`;
      resultElement.textContent = `${resultText}${gradeInfo.description}`;
    } else {
      // Расчет необходимого балла для сессии
      resultScore = (sessionValue - controlsSum) / config.weights.session;
      const gradeInfo = getGradeInfo(sessionValue);
      let requiredScoreText = `Нужно на сессии: ${resultScore.toFixed(2)}`;

      if (resultScore > 100) {
        requiredScoreText += ` (Недостижимо)`;
      } else if (resultScore < 0) {
        requiredScoreText = `Достаточно любого балла`;
      }

      resultText = requiredScoreText;
      resultElement.textContent = resultText;
    }

    saveHistory(resultText);
  }

  // --- СЛУШАТЕЛИ СОБЫТИЙ ---
  modeSwitch.addEventListener('change', () => {
    currentMode = modeSwitch.checked ? 2 : 1;
    updateUIMode();
  });

  calculateButton.addEventListener('click', handleCalculate);

  // --- ИНИЦИАЛИЗАЦИЯ ---
  updateUIMode();
  loadHistory();

  // Инициализация Collapsible
  var elems = document.querySelectorAll('.collapsible');
  var instances = M.Collapsible.init(elems);
});
