export const freelancerQuestions = [
    {
        id: 'profession',
        type: 'select',
        label: 'Какую профессию вы представляете на фрилансе?',
        placeholder: 'Выберите профессию',
        options: [
            { value: 'web-development', label: 'Веб-разработка' },
            { value: 'design', label: 'Дизайн' },
            { value: 'copywriting', label: 'Копирайтинг' },
            { value: 'smm', label: 'SMM' },
            { value: 'translation', label: 'Перевод' },
            { value: 'video-editing', label: 'Видеомонтаж' },
            { value: 'other', label: 'Другое' },
        ],
    },
    {
        id: 'experience',
        type: 'select',
        label: 'Какой у вас опыт работы на фрилансе?',
        placeholder: 'Выберите опыт работы',
        options: [
            { value: 'less-than-1-year', label: 'Менее 1 года' },
            { value: '1-3-years', label: '1–3 года' },
            { value: 'more-than-3-years', label: 'Более 3 лет' },
        ],
    },
    {
        id: 'platforms',
        type: 'checkbox',
        label: 'Какие платформы вы используете для поиска заказов?',
        options: [
            { id: 'upwork', label: 'Upwork' },
            { id: 'fiverr', label: 'Fiverr' },
            { id: 'giglancer', label: 'Giglancer.uz' },
            { id: 'telegram', label: 'Telegram-каналы' },
            { id: 'instagram', label: 'Instagram' },
            { id: 'other', label: 'Другое' },
        ]
    },
    {
        id: 'paymentIssues',
        type: 'select',
        label: 'Как часто вы сталкиваетесь с проблемами неоплаты или ненадежных заказчиков?',
        placeholder: 'Выберите частоту',
        options: [
            { value: 'never', label: 'Никогда' },
            { value: 'rarely', label: 'Редко' },
            { value: 'sometimes', label: 'Иногда' },
            { value: 'often', label: 'Часто' },
        ],
    },
    {
        id: 'localPaymentSystems',
        type: 'select',
        label: 'Насколько важна для вас интеграция с локальными платежными системами (HUMO, Payme)?',
        placeholder: 'Оцените важность',
        options: [
            { value: 'not-important', label: 'Не важна' },
            { value: 'important', label: 'Важна' },
            { value: 'very-important', label: 'Очень важна' },
        ],
    },
    {
        id: 'commissionAgreement',
        type: 'select',
        label: 'Готовы ли вы платить комиссию 5% за гарантированную оплату через эскроу-систему?',
        placeholder: 'Выберите ответ',
        options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
            { value: 'depends', label: 'Зависит от условий' },
        ],
    },
    {
        id: 'useTelegram',
        type: 'select',
        label: 'Используете ли вы Telegram для поиска заказчиков или общения с ними?',
        placeholder: 'Выберите ответ',
        options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
        ],
    },
    {
        id: 'desiredFeatures',
        type: 'textarea',
        label: 'Какие функции вы хотели бы видеть на новой фриланс-платформе?',
        placeholder: 'Ваши идеи и предложения...',
    },
    {
        id: 'betaTest',
        type: 'select',
        label: 'Готовы ли вы протестировать бета-версию IshTop.Uz с комиссией 5%?',
        placeholder: 'Выберите ответ',
        options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
            { value: 'depends', label: 'Зависит от функций' },
        ],
    },
];

export const clientQuestions = [
    {
        id: 'services',
        type: 'checkbox',
        label: 'Какие услуги вы обычно заказываете у фрилансеров?',
        options: [
            { id: 'web-development', label: 'Веб-разработка' },
            { id: 'design', label: 'Дизайн' },
            { id: 'copywriting', label: 'Копирайтинг' },
            { id: 'smm', label: 'SMM' },
            { id: 'translation', label: 'Перевод' },
            { id: 'video-editing', label: 'Видеомонтаж' },
            { id: 'other', label: 'Другое' },
        ],
    },
    {
        id: 'businessType',
        type: 'select',
        label: 'Какой у вас тип бизнеса?',
        placeholder: 'Выберите тип бизнеса',
        options: [
            { value: 'individual', label: 'Частное лицо' },
            { value: 'small-business', label: 'Малый бизнес' },
            { value: 'startup', label: 'Стартап' },
            { value: 'medium-large-business', label: 'Средний/Крупный бизнес' },
        ],
    },
    {
        id: 'platforms',
        type: 'checkbox',
        label: 'Какие платформы вы используете для поиска фрилансеров?',
        options: [
            { id: 'upwork', label: 'Upwork' },
            { id: 'fiverr', label: 'Fiverr' },
            { id: 'giglancer', label: 'Giglancer.uz' },
            { id: 'telegram', label: 'Telegram-каналы' },
            { id: 'instagram', label: 'Instagram' },
            { id: 'other', label: 'Другое' },
        ]
    },
    {
        id: 'qualityIssues',
        type: 'select',
        label: 'Как часто вы сталкиваетесь с некачественной работой фрилансеров?',
        placeholder: 'Выберите частоту',
        options: [
            { value: 'never', label: 'Никогда' },
            { value: 'rarely', label: 'Редко' },
            { value: 'sometimes', label: 'Иногда' },
            { value: 'often', label: 'Часто' },
        ],
    },
    {
        id: 'localPaymentSystems',
        type: 'select',
        label: 'Насколько важна возможность оплаты через локальные системы (HUMO, Payme)?',
        placeholder: 'Оцените важность',
        options: [
            { value: 'not-important', label: 'Не важна' },
            { value: 'important', label: 'Важна' },
            { value: 'very-important', label: 'Очень важна' },
        ],
    },
    {
        id: 'commissionAttractiveness',
        type: 'select',
        label: 'Привлекательна ли для вас платформа с комиссией 5% и эскроу-системой для безопасных платежей?',
        placeholder: 'Выберите ответ',
        options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
            { value: 'depends', label: 'Зависит от условий' },
        ],
    },
    {
        id: 'useSocials',
        type: 'select',
        label: 'Используете ли вы Telegram или Instagram для поиска или общения с фрилансерами?',
        placeholder: 'Выберите ответ',
        options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
        ],
    },
    {
        id: 'verificationValue',
        type: 'select',
        label: 'Насколько ценна платформа с верификацией навыков фрилансеров и системой рейтингов?',
        placeholder: 'Оцените ценность',
        options: [
            { value: 'not-valuable', label: 'Не ценна' },
            { value: 'valuable', label: 'Ценна' },
            { value: 'very-valuable', label: 'Очень ценна' },
        ],
    },
    {
        id: 'hiringDifficulties',
        type: 'textarea',
        label: 'Какие сложности вы испытываете при найме фрилансеров в Узбекистане?',
        placeholder: 'Опишите ваши сложности...',
    },
    {
        id: 'betaTest',
        type: 'select',
        label: 'Готовы ли вы протестировать бета-версию IshTop.Uz для найма фрилансеров?',
        placeholder: 'Выберите ответ',
        options: [
            { value: 'yes', label: 'Да' },
            { value: 'no', label: 'Нет' },
            { value: 'depends', label: 'Зависит от функций' },
        ],
    },
];
