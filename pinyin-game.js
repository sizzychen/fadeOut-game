document.addEventListener('DOMContentLoaded', () => {
  // 游戏状态变量
  let gameMode = 'char-to-pinyin'; // 默认模式：看字认拼音
  let difficulty = 'easy'; // 默认难度：简单
  let currentQuestionIndex = 0;
  let score = 0;
  let questions = [];
  let wrongAnswers = [];
  let totalQuestions = 10; // 每轮默认10个题目

  // DOM元素
  const gameSettings = document.getElementById('gameSettings');
  const gameContent = document.getElementById('gameContent');
  const questionElement = document.getElementById('question');
  const optionsContainer = document.getElementById('options');
  const scoreElement = document.getElementById('score');
  const progressFill = document.getElementById('progressFill');
  const startBtn = document.getElementById('startBtn');
  const modeBtns = document.querySelectorAll('.mode-btn');
  const difficultyBtns = document.querySelectorAll('.difficulty-btn');
  const resultsModal = document.getElementById('resultsModal');
  const finalScoreElement = document.getElementById('finalScore');
  const totalQuestionsElement = document.getElementById('totalQuestions');
  const percentageElement = document.getElementById('percentage');
  const wrongItemsList = document.getElementById('wrongItemsList');
  const restartBtn = document.getElementById('restartBtn');
  const homeBtn = document.getElementById('homeBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modeSelectBtn = document.getElementById('modeSelectBtn');

  // 初始化游戏
  const initGame = () => {
    // 重置游戏状态
    currentQuestionIndex = 0;
    score = 0;
    wrongAnswers = [];

    // 更新UI
    scoreElement.textContent = score;
    updateProgress();

    // 根据选择的模式和难度加载题目
    loadQuestions();

    // 显示第一个问题
    displayQuestion();

    // 切换界面：从设置页到游戏页
    gameSettings.style.display = 'none';
    gameContent.style.display = 'block';
  };

  // 加载题目数据
  const loadQuestions = () => {
    // 从pinyinData获取对应难度的数据
    let data = [];

    if (difficulty === 'easy') {
      data = pinyinData.easy;
    } else if (difficulty === 'medium') {
      data = pinyinData.medium;
    } else if (difficulty === 'hard') {
      data = pinyinData.hard;
    }

    // 随机选择totalQuestions个题目
    questions = shuffleArray([...data]).slice(0, totalQuestions);
  };

  // 显示当前问题
  const displayQuestion = () => {
    if (currentQuestionIndex >= questions.length) {
      // 所有问题都已回答，显示结果
      showResults();
      return;
    }

    const currentQ = questions[currentQuestionIndex];

    // 根据游戏模式显示不同的问题样式
    if (gameMode === 'char-to-pinyin') {
      // 看字认拼音：显示汉字，选择正确的拼音
      questionElement.textContent = currentQ.character;

      // 生成选项（包括一个正确答案和三个干扰项）
      generateOptions(currentQ.pinyin, getPinyinDistractors(currentQ.pinyin));
    } else {
      // 看拼音认字：显示拼音，选择正确的汉字
      questionElement.textContent = currentQ.pinyin;

      // 生成选项（包括一个正确答案和三个干扰项）
      generateOptions(currentQ.character, getCharacterDistractors(currentQ.character));
    }
  };

  // 生成选项按钮
  const generateOptions = (correctAnswer, distractors) => {
    // 清空选项容器
    optionsContainer.innerHTML = '';

    // 合并正确答案和干扰项，并打乱顺序
    const allOptions = shuffleArray([correctAnswer, ...distractors]);

    // 创建选项按钮
    allOptions.forEach(option => {
      const optionBtn = document.createElement('button');
      optionBtn.className = 'option-btn';
      optionBtn.textContent = option;

      // 添加点击事件
      optionBtn.addEventListener('click', () => {
        checkAnswer(option, correctAnswer, optionBtn);
      });

      optionsContainer.appendChild(optionBtn);
    });
  };

  // 辅助函数：去除拼音声调
  const normalizePinyin = (pinyin) => {
    return pinyin
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/ü/g, 'u')
      .toLowerCase();
  };

  // 检查答案
  const checkAnswer = (selectedOption, correctAnswer, optionBtn) => {
    // 禁用所有选项，防止重复点击
    const allOptions = document.querySelectorAll('.option-btn');
    allOptions.forEach(btn => btn.disabled = true);

    const isCorrect = selectedOption === correctAnswer;

    // 显示反馈（对/错）
    if (isCorrect) {
      optionBtn.classList.add('correct');
      score++;
      scoreElement.textContent = score;
    } else {
      optionBtn.classList.add('wrong');

      // 找到并标记正确答案
      allOptions.forEach(btn => {
        if (btn.textContent === correctAnswer) {
          btn.classList.add('correct');
        }
      });

      // 记录错题
      wrongAnswers.push({
        question: questions[currentQuestionIndex],
        userAnswer: selectedOption
      });
    }

    // 延迟后进入下一题
    setTimeout(() => {
      currentQuestionIndex++;
      updateProgress();
      displayQuestion();
    }, 1500);
  };

  // 更新进度条
  const updateProgress = () => {
    const progress = (currentQuestionIndex / questions.length) * 100;
    progressFill.style.width = `${progress}%`;
  };

  // 显示测评结果
  const showResults = () => {
    // 计算得分和正确率
    finalScoreElement.textContent = score;
    totalQuestionsElement.textContent = questions.length;
    const percentage = Math.round((score / questions.length) * 100);
    percentageElement.textContent = `${percentage}%`;

    // 显示错题
    wrongItemsList.innerHTML = '';
    if (wrongAnswers.length === 0) {
      wrongItemsList.innerHTML = '<p>太棒了！你全部答对了！</p>';
    } else {
      wrongAnswers.forEach(item => {
        const wrongItem = document.createElement('div');
        wrongItem.className = 'wrong-item';

        if (gameMode === 'char-to-pinyin') {
          wrongItem.innerHTML = `
            <div class="question-text">${item.question.character}</div>
            <div class="answers">
              <div class="wrong-answer">你的答案: ${item.userAnswer}</div>
              <div class="correct-answer">正确答案: ${item.question.pinyin}</div>
            </div>
          `;
        } else {
          wrongItem.innerHTML = `
            <div class="question-text">${item.question.pinyin}</div>
            <div class="answers">
              <div class="wrong-answer">你的答案: ${item.userAnswer}</div>
              <div class="correct-answer">正确答案: ${item.question.character}</div>
            </div>
          `;
        }

        wrongItemsList.appendChild(wrongItem);
      });
    }

    // 显示模态框
    resultsModal.style.display = 'flex';
  };

  // 重新开始游戏
  const restartGame = () => {
    resultsModal.style.display = 'none';
    initGame();
  };

  // 返回设置页面
  const returnToSettings = () => {
    resultsModal.style.display = 'none';
    gameContent.style.display = 'none';
    gameSettings.style.display = 'block';
  };

  // 返回模式选择
  const returnToModeSelect = () => {
    resultsModal.style.display = 'none';
    gameContent.style.display = 'none';
    gameSettings.style.display = 'block';
  };

  // 辅助函数：数组随机排序
  const shuffleArray = (array) => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  // 辅助函数：计算字符串的实际字符长度 (汉字或拼音音节数)
  const getCharacterLength = (str) => {
    // 检查字符串是否包含拉丁字符，以判断是否为拼音
    if (/[a-zA-Z]/.test(str)) {
      // 如果是拼音，则按空格分割计算音节数
      return str.split(' ').filter(s => s.trim().length > 0).length;
    } else {
      // 如果是汉字，则直接返回字符串长度
      return str.length;
    }
  };

  // 辅助函数：获取拼音干扰项
  const getPinyinDistractors = (correctPinyin) => {
    const correctPinyinLength = getCharacterLength(correctPinyin);
    const basePinyin = normalizePinyin(correctPinyin); // 声调归一化后的正确拼音

    let distractorsByCat = {
      sameBaseSameLength: [],
      sameBaseOtherLength: [],
      otherBaseSameLength: [],
      otherBaseOtherLength: []
    };

    ['easy', 'medium', 'hard'].forEach(level => {
      if (pinyinData[level]) {
        pinyinData[level].forEach(item => {
          if (item.pinyin === correctPinyin) return; // 跳过正确答案本身

          const itemPinyin = item.pinyin;
          const itemPinyinLength = getCharacterLength(itemPinyin);
          const currentItemBase = normalizePinyin(itemPinyin); // 当前项的声调归一化拼音

          const isSameBase = (currentItemBase === basePinyin);
          const isSameLength = (itemPinyinLength === correctPinyinLength);

          if (isSameBase) {
            if (isSameLength) {
              distractorsByCat.sameBaseSameLength.push(itemPinyin);
            } else {
              distractorsByCat.sameBaseOtherLength.push(itemPinyin);
            }
          } else {
            if (isSameLength) {
              distractorsByCat.otherBaseSameLength.push(itemPinyin);
            } else {
              distractorsByCat.otherBaseOtherLength.push(itemPinyin);
            }
          }
        });
      }
    });

    // 确保每个分类内部的干扰项是唯一的
    for (const cat in distractorsByCat) {
      distractorsByCat[cat] = [...new Set(distractorsByCat[cat])];
    }

    // 按优先级组合干扰项 (优先长度相同，其次声调相似):
    // 1. 相同基础拼音、相同字符长度 (sameBaseSameLength)
    // 2. 不同基础拼音、相同字符长度 (otherBaseSameLength)
    // 3. 相同基础拼音、不同字符长度 (sameBaseOtherLength)
    // 4. 不同基础拼音、不同字符长度 (otherBaseOtherLength)
    const potentialDistractors = [
      ...shuffleArray(distractorsByCat.sameBaseSameLength),
      ...shuffleArray(distractorsByCat.otherBaseSameLength),
      ...shuffleArray(distractorsByCat.sameBaseOtherLength),
      ...shuffleArray(distractorsByCat.otherBaseOtherLength)
    ];

    // 从组合后的列表中选取最多3个唯一的干扰项
    const uniqueDistractors = [...new Set(potentialDistractors)];
    return shuffleArray(uniqueDistractors).slice(0, 3);
  };


  // 辅助函数：获取汉字干扰项
  const getCharacterDistractors = (correctChar) => {
    const correctCharLength = getCharacterLength(correctChar);
    let sameLengthChars = [];
    let otherLengthChars = [];

    ['easy', 'medium', 'hard'].forEach(level => {
      if (pinyinData[level]) {
        pinyinData[level].forEach(item => {
          if (item.character === correctChar) return; // 跳过正确答案本身

          const currentItemChar = item.character;
          const itemCharLength = getCharacterLength(currentItemChar);

          if (itemCharLength === correctCharLength) {
            // 使用Set或includes确保添加前检查唯一性
            if (!sameLengthChars.includes(currentItemChar)) {
                sameLengthChars.push(currentItemChar);
            }
          } else {
            if (!otherLengthChars.includes(currentItemChar)) {
                otherLengthChars.push(currentItemChar);
            }
          }
        });
      }
    });

    // 按优先级组合干扰项：
    // 1. 长度相同的汉字
    // 2. 长度不同的汉字
    const potentialDistractors = [
      ...shuffleArray(sameLengthChars),
      ...shuffleArray(otherLengthChars)
    ];

    // 从组合后的列表中选取最多3个唯一的干扰项
    const uniqueDistractors = [...new Set(potentialDistractors)];
    return shuffleArray(uniqueDistractors).slice(0, 3);
  };

  // 事件监听器
  // 模式选择
  modeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 移除所有按钮的active类
      modeBtns.forEach(b => b.classList.remove('active'));

      // 添加active类到当前按钮
      btn.classList.add('active');

      // 更新游戏模式
      gameMode = btn.getAttribute('data-mode');
    });
  });

  // 难度选择
  difficultyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // 移除所有按钮的active类
      difficultyBtns.forEach(b => b.classList.remove('active'));

      // 添加active类到当前按钮
      btn.classList.add('active');

      // 更新游戏难度
      difficulty = btn.getAttribute('data-difficulty');
    });
  });

  // 开始按钮
  startBtn.addEventListener('click', initGame);

  // 重新开始按钮
  restartBtn.addEventListener('click', restartGame);

  // 返回设置按钮
  homeBtn.addEventListener('click', returnToSettings);

  // 换模式测评按钮
  modeSelectBtn.addEventListener('click', returnToModeSelect);

  // 关闭模态框按钮
  closeModalBtn.addEventListener('click', () => {
    resultsModal.style.display = 'none';
  });
});
