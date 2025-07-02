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
          sessionHelper: 'Введите балл за сессию',
        },
        // Режим 2: Расчет необходимого балла
        2: {
          buttonText: 'Рассчитать',
          sessionLabel: 'Желаемый итоговый балл:',
          sessionHelper: 'Введите желаемый балл',
        },
      }
    };
  
    // --- ЭЛЕМЕНТЫ DOM ---
    const control1Input = document.getElementById('control1');
    const control2Input = document.getElementById('control2');
    const sessionInput = document.getElementById('session');
    const calculateButton = document.getElementById('calculate');
    const resultElement = document.getElementById('result');
    const modeSwitch = document.getElementById('mode-switch');
    const sessionLabel = document.querySelector('label[for="session"]');
    const sessionHelper = sessionInput.nextElementSibling; // Более надежный способ получить helper-text
  
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
  
      let resultScore, resultText;
      const controlsSum = (control1 + control2) * config.weights.controls;
  
      if (currentMode === 1) {
        // Расчет итогового балла
        resultScore = controlsSum + sessionValue * config.weights.session;
        const gradeInfo = getGradeInfo(resultScore);
        resultText = `Итоговый балл: ${resultScore.toFixed(2)} (${gradeInfo.name})${gradeInfo.description}`;
      } else {
        // Расчет необходимого балла для сессии
        resultScore = (sessionValue - controlsSum) / config.weights.session;
        const gradeInfo = getGradeInfo(sessionValue);
        let requiredScoreText = `Необходимый балл сессии: ${resultScore.toFixed(2)}`;
        
        if (resultScore > 100) {
          requiredScoreText += ` (Недостижимо)`;
        } else if (resultScore < 0) {
          requiredScoreText = `Достаточно любого балла, вы уже набрали ${sessionValue.toFixed(2)} (${gradeInfo.name})`;
        }
  
        resultText = requiredScoreText;
      }
  
      resultElement.textContent = resultText;
    }
  
    // --- СЛУШАТЕЛИ СОБЫТИЙ ---
    modeSwitch.addEventListener('change', () => {
      currentMode = modeSwitch.checked ? 2 : 1;
      updateUIMode();
    });
  
    calculateButton.addEventListener('click', handleCalculate);
  
    // --- ИНИЦИАЛИЗАЦИЯ ---
    updateUIMode();
  });