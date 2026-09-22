import type { Lang } from "./lang";

/**
 * Russian rendering of the synthetic clinical content.
 *
 * Keyed by the English source string. The seed is frozen demonstration data,
 * so string keys are stable; anything without an entry falls back to English
 * rather than showing a missing-translation marker.
 *
 * Structured vocabulary (HPO terms, analytes, imaging features) is translated
 * here because those are codes in the data model — the reader sees them in
 * their own language, which is the point of structuring a case at all.
 */
const RU: Record<string, string> = {
  /* ---------------- people, places, institutions ---------------- */
  "Dr. A. Seitkali": "д-р А. Сейткали",
  "Dr. M. Brandt": "д-р М. Брандт",
  "Clinical Geneticist": "Клинический генетик",
  "Consultant in Neurometabolic Disease": "Консультант по нейрометаболическим заболеваниям",
  "Division of Pediatric Neurogenetics": "Отделение детской нейрогенетики",
  "Institute for Rare Neurological Disorders": "Институт редких неврологических заболеваний",
  "National Research Center for Maternal & Child Health": "Национальный научный центр материнства и детства",
  "Universitätsklinikum Heidelberg": "Университетская клиника Гейдельберга",
  "Astana": "Астана",
  "Heidelberg": "Гейдельберг",
  "Kazakhstan": "Казахстан",
  "Germany": "Германия",
  "Verified network clinician · Tier II data access": "Проверенный врач сети · доступ к данным уровня II",

  /* ---------------- case identity ---------------- */
  "Female": "Женский",
  "Male": "Мужской",
  "Not recorded": "Не указан",
  "Neurological": "Неврологический",
  "Metabolic": "Метаболический",
  "Neuromuscular": "Нервно-мышечный",
  "Hepatic": "Печёночный",
  "Cardiac": "Кардиальный",
  "Immune": "Иммунный",
  "Movement disorder": "Двигательные нарушения",
  "Ophthalmic": "Офтальмологический",
  "Dermatologic": "Дерматологический",
  "Multisystem": "Мультисистемный",

  /* ---------------- headlines ---------------- */
  "Progressive infantile encephalopathy of unknown molecular cause": "Прогрессирующая младенческая энцефалопатия неясного молекулярного генеза",
  "Progressive encephalopathy with putaminal involvement, molecularly unsolved": "Прогрессирующая энцефалопатия с поражением скорлупы, молекулярно не разрешена",
  "Episodic ataxia with lactate elevation, normal exome": "Эпизодическая атаксия с повышением лактата, экзом в норме",
  "Neonatal cholestasis, dysmorphism, consanguineous pedigree": "Неонатальный холестаз, дисморфизм, близкородственный брак",
  "Adolescent-onset dystonia, basal ganglia signal change": "Дистония с подростковым дебютом, изменение сигнала базальных ганглиев",
  "Recurrent rhabdomyolysis, exercise intolerance, sibling affected": "Рецидивирующий рабдомиолиз, непереносимость нагрузки, поражён сибс",
  "Immune dysregulation with sterile osteomyelitis": "Иммунная дисрегуляция со стерильным остеомиелитом",
  "Infantile spasms with hypsarrhythmia, unresolved after panel": "Инфантильные спазмы с гипсаритмией, панель без результата",
  "Unexplained metabolic acidosis with feeding intolerance": "Необъяснимый метаболический ацидоз с непереносимостью питания",
  "Progressive spastic paraparesis, normal metabolic screen": "Прогрессирующий спастический парапарез, метаболический скрининг в норме",
  "Bilateral optic atrophy with mild peripheral neuropathy": "Двусторонняя атрофия зрительных нервов с лёгкой полинейропатией",
  "Hypotonia and global delay, exome reanalysis pending": "Гипотония и общая задержка, ожидается реанализ экзома",
  "Infantile cardiomyopathy with lactic acidosis": "Младенческая кардиомиопатия с лактат-ацидозом",
  "Progressive poikiloderma with growth restriction": "Прогрессирующая пойкилодермия с задержкой роста",
  "Developmental regression with normal imaging": "Регресс развития при нормальной нейровизуализации",
  "Encephalopathy with normal lactate and unremarkable MRI": "Энцефалопатия с нормальным лактатом и без изменений на МРТ",
  "Later-onset ataxia with overlapping mitochondrial findings": "Атаксия с поздним дебютом и перекрывающимися митохондриальными находками",
  "Unresolved case": "Неразрешённый случай",

  /* ---------------- narratives ---------------- */
  "Term infant, uneventful perinatal course. Truncal hypotonia noted at 5 months. Acquisition of early milestones followed by plateau at 11 months and regression after a febrile illness at 16 months. Seizure onset at 14 months, progressing to pharmacoresistant epilepsy. Trio exome and subsequent genome sequencing non-diagnostic.":
    "Доношенный ребёнок, перинатальный период без особенностей. Туловищная гипотония отмечена в 5 месяцев. После освоения ранних навыков — плато в 11 месяцев и регресс после лихорадочного заболевания в 16 месяцев. Дебют приступов в 14 месяцев с переходом в фармакорезистентную эпилепсию. Трио-экзом и последующее полногеномное секвенирование без диагноза.",
  "Second child of non-consanguineous parents. Hypotonia from 6 months, plateau at 12 months, marked regression following gastroenteritis at 15 months. Pharmacoresistant epilepsy from 13 months. Exome and genome non-diagnostic; long-read sequencing performed 2026-01 and under re-analysis.":
    "Второй ребёнок неродственных родителей. Гипотония с 6 месяцев, плато в 12 месяцев, выраженный регресс после гастроэнтерита в 15 месяцев. Фармакорезистентная эпилепсия с 13 месяцев. Экзом и геном без диагноза; длинночтеневое секвенирование выполнено в январе 2026 года, идёт реанализ.",

  /* ---------------- HPO terms ---------------- */
  "Global developmental delay": "Общая задержка развития",
  "Hypotonia": "Гипотония",
  "Seizure": "Эпилептический приступ",
  "Intellectual disability": "Интеллектуальная недостаточность",
  "Developmental regression": "Регресс развития",
  "Increased serum lactate": "Повышение лактата сыворотки",
  "Nystagmus": "Нистагм",
  "Feeding difficulties": "Трудности вскармливания",
  "Brachydactyly": "Брахидактилия",
  "Dysphagia": "Дисфагия",
  "Cardiac involvement": "Вовлечение сердца",
  "Splenomegaly": "Спленомегалия",
  "Hyperalaninemia": "Гипераланинемия",
  "Gait ataxia": "Атаксия походки",
  "Cholestasis": "Холестаз",
  "Abnormality of metabolism": "Нарушение обмена веществ",
  "Growth delay": "Задержка роста",
  "Dystonia": "Дистония",
  "Abnormal basal ganglia MRI signal": "Изменённый сигнал базальных ганглиев на МРТ",
  "Rhabdomyolysis": "Рабдомиолиз",
  "Exercise intolerance": "Непереносимость физической нагрузки",
  "Elevated creatine kinase": "Повышение креатинкиназы",
  "Osteomyelitis": "Остеомиелит",
  "Autoimmunity": "Аутоиммунитет",
  "Infantile spasms": "Инфантильные спазмы",
  "Metabolic acidosis": "Метаболический ацидоз",
  "Lower limb spasticity": "Спастичность нижних конечностей",
  "Optic atrophy": "Атрофия зрительного нерва",
  "Peripheral neuropathy": "Периферическая нейропатия",
  "Hypertrophic cardiomyopathy": "Гипертрофическая кардиомиопатия",
  "Poikiloderma": "Пойкилодермия",

  /* ---------------- genetics ---------------- */
  "Trio exome sequencing": "Трио-секвенирование экзома",
  "Genome sequencing (short read)": "Полногеномное секвенирование (короткие чтения)",
  "Reported investigations": "Выполненные исследования",
  "Complex I activity, muscle": "Активность комплекса I, мышца",
  "Non-diagnostic": "Без диагноза",
  "VUS": "ВНЗ (вариант неясного значения)",
  "VUS — candidate": "ВНЗ — кандидат",
  "Below threshold": "Ниже порога",
  "Reduced — 31% of control": "Снижена — 31% от контроля",
  "Heterozygous": "Гетерозигота",
  "Heteroplasmy 4%": "Гетероплазмия 4%",
  "Maternal": "По матери",
  "Paternal": "По отцу",
  "Coverage 98.4% at 20×. No P/LP variant in disease-associated genes.": "Покрытие 98,4% при 20×. Патогенных и вероятно патогенных вариантов в генах заболеваний нет.",
  "Structural variant and mitochondrial analysis included.": "Включён анализ структурных вариантов и митохондриальной ДНК.",
  "Second allele not identified. Re-analysis pending.": "Второй аллель не выявлен. Ожидается реанализ.",
  "Blood only. Muscle not yet tested.": "Только кровь. Мышца не исследована.",
  "Reported 2025-04.": "Отчёт от 04.2025.",
  "Reported 2025-08.": "Отчёт от 08.2025.",
  "Same nucleotide substitution as ODY-001.": "Та же нуклеотидная замена, что и в ODY-001.",
  "Long-read sequencing 2026-01. Predicted cryptic exon inclusion; RNA studies pending.": "Длинночтеневое секвенирование, 01.2026. Прогнозируется включение криптического экзона; исследования РНК ожидаются.",
  "Isolated complex I deficiency.": "Изолированный дефицит комплекса I.",
  "No primary finding reported.": "Первичных находок не сообщено.",
  "Non-diagnostic to date.": "На сегодня без диагноза.",
  "Unresolved. One monoallelic VUS in a complex I assembly factor; second allele not identified. Mitochondrial re-analysis and long-read sequencing proposed.":
    "Не разрешён. Один моноаллельный ВНЗ в факторе сборки комплекса I; второй аллель не выявлен. Предложены реанализ митохондриальной ДНК и длинночтеневое секвенирование.",
  "Biallelic VUS in NDUFAF6 — one coding, one deep intronic candidate identified only after long-read sequencing. RNA studies pending. Not yet reportable as diagnostic.":
    "Биаллельные ВНЗ в NDUFAF6 — один кодирующий, второй глубоко интронный, выявлен только длинночтеневым секвенированием. Исследования РНК ожидаются. Пока не может быть выдан как диагностический.",

  /* ---------------- timeline ---------------- */
  "Birth": "Рождение",
  "Term delivery": "Роды в срок",
  "39+2 weeks, birth weight 3.29 kg, Apgar 9/10": "39+2 недели, масса при рождении 3,29 кг, Апгар 9/10",
  "38+5 weeks, birth weight 3.05 kg, unremarkable": "38+5 недель, масса при рождении 3,05 кг, без особенностей",
  "Unremarkable perinatal course": "Перинатальный период без особенностей",
  "Truncal hypotonia": "Туловищная гипотония",
  "First documented neurological abnormality": "Первое задокументированное неврологическое отклонение",
  "Developmental delay": "Задержка развития",
  "Fails to sit unsupported; referred to paediatric neurology": "Не сидит без опоры; направлен к детскому неврологу",
  "Developmental plateau": "Плато развития",
  "No new milestones acquired": "Новых навыков не появляется",
  "Milestone acquisition ceases": "Освоение навыков прекращается",
  "Seizure onset": "Дебют приступов",
  "Focal to bilateral tonic–clonic; EEG multifocal epileptiform": "Фокальные с переходом в билатеральные тонико-клонические; на ЭЭГ мультифокальная эпилептиформная активность",
  "Focal seizures, multifocal EEG": "Фокальные приступы, мультифокальная ЭЭГ",
  "Regression after febrile illness": "Регресс после лихорадочного заболевания",
  "Loss of head control and babbling; lactate 4.1 mmol/L": "Утрата контроля головы и лепета; лактат 4,1 ммоль/л",
  "Regression after gastroenteritis": "Регресс после гастроэнтерита",
  "Loss of sitting; lactate 3.8 mmol/L": "Утрата навыка сидения; лактат 3,8 ммоль/л",
  "MRI: putaminal signal change": "МРТ: изменение сигнала скорлупы",
  "Symmetric T2 hyperintensity, putamen and dorsal brainstem": "Симметричная гиперинтенсивность на Т2, скорлупа и дорсальный отдел ствола",
  "Bilateral symmetric T2 hyperintensity": "Двусторонняя симметричная гиперинтенсивность на Т2",
  "Metabolic work-up": "Метаболическое обследование",
  "CSF lactate elevated; muscle biopsy deferred": "Лактат ликвора повышен; биопсия мышцы отложена",
  "Trio exome non-diagnostic": "Трио-экзом без диагноза",
  "Reported as no primary finding": "Заключение: первичных находок нет",
  "Exome non-diagnostic": "Экзом без диагноза",
  "Re-analysis at 12 months requested": "Запрошен реанализ через 12 месяцев",
  "Ketogenic diet initiated": "Начата кетогенная диета",
  "Partial seizure reduction (~40%)": "Частичное снижение приступов (~40%)",
  "Genome sequencing non-diagnostic": "Полногеномное секвенирование без диагноза",
  "Re-analysis scheduled at 12 months": "Реанализ запланирован через 12 месяцев",
  "Long-read sequencing": "Длинночтеневое секвенирование",
  "Deep intronic candidate identified": "Выявлен глубоко интронный кандидат",
  "Submitted to ODYSSEY network": "Передан в сеть ODYSSEY",
  "Federated query across member institutions": "Федеративный запрос по учреждениям сети",
  "Listed for federated matching": "Включён в федеративное сопоставление",
  "Consent for cross-border comparison on file": "Согласие на трансграничное сравнение оформлено",

  /* ---------------- laboratory ---------------- */
  "Lactate": "Лактат",
  "Pyruvate": "Пируват",
  "Lactate/pyruvate ratio": "Отношение лактат/пируват",
  "Alanine": "Аланин",
  "Ammonia": "Аммиак",
  "Creatine kinase": "Креатинкиназа",
  "Acylcarnitine profile": "Профиль ацилкарнитинов",
  "Complex I activity": "Активность комплекса I",
  "Plasma": "Плазма",
  "CSF": "Ликвор",
  "Serum": "Сыворотка",
  "Muscle": "Мышца",
  "DBS": "Сухое пятно крови",
  "Reported": "Указано",
  "Non-specific": "Неспецифический",
  "% of control": "% от контроля",
  "ratio": "отношение",

  /* ---------------- imaging ---------------- */
  "MRI brain": "МРТ головного мозга",
  "MRI brain (repeat)": "МРТ головного мозга (повторно)",
  "MR spectroscopy": "МР-спектроскопия",
  "Reported imaging": "Указанная визуализация",
  "Symmetric T2 hyperintensity of the putamen and dorsal brainstem": "Симметричная гиперинтенсивность на Т2 скорлупы и дорсального отдела ствола",
  "Pattern consistent with a mitochondrial leukoencephalopathy": "Паттерн соответствует митохондриальной лейкоэнцефалопатии",
  "Lactate doublet at 1.33 ppm": "Дублет лактата на 1,33 м.д.",
  "Supports impaired oxidative metabolism": "Поддерживает нарушение окислительного метаболизма",
  "Progression of putaminal signal, mild cerebellar atrophy": "Прогрессирование сигнала скорлупы, лёгкая атрофия мозжечка",
  "Progressive course": "Прогрессирующее течение",
  "Bilateral symmetric putaminal T2 hyperintensity, brainstem involvement": "Двусторонняя симметричная гиперинтенсивность скорлупы на Т2, вовлечение ствола",
  "Leigh-like radiological pattern": "Радиологический паттерн, подобный синдрому Ли",
  "Lactate peak present": "Присутствует пик лактата",
  "Impaired oxidative metabolism": "Нарушение окислительного метаболизма",
  "Stable putaminal change, mild vermian atrophy": "Стабильные изменения скорлупы, лёгкая атрофия червя мозжечка",
  "Slowly progressive": "Медленно прогрессирующее",

  /* ---------------- imaging features (codes) ---------------- */
  "bilateral putaminal T2 hyperintensity": "двусторонняя гиперинтенсивность скорлупы на Т2",
  "brainstem involvement": "вовлечение ствола мозга",
  "MR spectroscopy lactate peak": "пик лактата на МР-спектроскопии",
  "cerebellar atrophy": "атрофия мозжечка",

  /* ---------------- family ---------------- */
  "Two affected among four siblings; parents unaffected": "Двое поражённых из четырёх сибсов; родители здоровы",
  "Single affected child of two; sister unaffected at 7y": "Один поражённый ребёнок из двух; сестра здорова в 7 лет",
  "First-cousin parents (F ≈ 0.0625)": "Родители — двоюродные сибсы (F ≈ 0,0625)",
  "None reported": "Не указан",
  "Consanguinity reported": "Указан близкородственный брак",
  "Not documented": "Не задокументировано",
  "Not reported": "Не указано",
  "Younger brother, 2y — early hypotonia under evaluation": "Младший брат, 2 года — ранняя гипотония, обследуется",
  "Sister, 7y — neurologically normal": "Сестра, 7 лет — неврологически здорова",
  "No extended family history of neurological disease reported.": "Данных о неврологических заболеваниях в расширенной семье нет.",
  "No known family history of metabolic disease.": "Семейный анамнез по метаболическим заболеваниям не отягощён.",
  "Regionally isolated maternal lineage": "Регионально изолированная материнская линия",
  "Paternal grandparents from the same regional community": "Дедушка и бабушка по отцу из той же региональной общины",

  /* ---------------- treatment ---------------- */
  "Levetiracetam": "Леветирацетам",
  "Ketogenic diet": "Кетогенная диета",
  "Coenzyme Q10 + riboflavin": "Коэнзим Q10 + рибофлавин",
  "Thiamine + riboflavin": "Тиамин + рибофлавин",
  "Valproate": "Вальпроат",
  "Partial, then loss of effect": "Частичный, затем утрата эффекта",
  "≈40% seizure reduction, sustained": "Снижение приступов ≈40%, устойчиво",
  "≈35% seizure reduction, sustained": "Снижение приступов ≈35%, устойчиво",
  "No measurable change": "Измеримых изменений нет",
  "Discontinued — hepatic transaminase rise": "Отменён — рост печёночных трансаминаз",
  "Discontinued — transaminase rise": "Отменён — рост трансаминаз",

  /* ---------------- negative evidence ---------------- */
  "No cardiac involvement on echocardiography at 3y 6m": "Вовлечения сердца по ЭхоКГ в 3 г 6 мес нет",
  "No cardiac involvement on serial echocardiography": "Вовлечения сердца по серии ЭхоКГ нет",
  "No hepatic involvement (normal synthetic function)": "Вовлечения печени нет (синтетическая функция в норме)",
  "No hepatic involvement": "Вовлечения печени нет",
  "Hearing thresholds normal on ABR": "Пороги слуха по КСВП в норме",
  "Normal ABR": "КСВП в норме",
  "No retinal dystrophy on ERG": "Дистрофии сетчатки по ЭРГ нет",
  "Newborn screening panel negative": "Неонатальный скрининг отрицательный",
  "Expanded newborn screening negative": "Расширенный неонатальный скрининг отрицательный",
  "Congenital disorders of glycosylation panel normal": "Панель врождённых нарушений гликозилирования в норме",

  /* ---------------- signals ---------------- */
  "Regression precipitated by febrile illness": "Регресс, спровоцированный лихорадочным заболеванием",
  "Regression precipitated by intercurrent illness": "Регресс, спровоцированный интеркуррентным заболеванием",
  "Elevated lactate/pyruvate ratio with alanine elevation": "Повышенное отношение лактат/пируват с повышением аланина",
  "Bilateral putaminal T2 signal change": "Двустороннее изменение сигнала скорлупы на Т2",
  "Monoallelic VUS in complex I assembly factor": "Моноаллельный ВНЗ в факторе сборки комплекса I",
  "Biallelic NDUFAF6 VUS including deep intronic candidate": "Биаллельные ВНЗ NDUFAF6, включая глубоко интронный кандидат",
  "Consanguineous pedigree, second sibling affected": "Близкородственный брак, поражён второй сибс",
  "Isolated complex I deficiency in muscle (31% of control)": "Изолированный дефицит комплекса I в мышце (31% от контроля)",
  "Partial but sustained response to ketogenic diet": "Частичный, но устойчивый ответ на кетогенную диету",
  "Absence of cardiac and hepatic involvement": "Отсутствие вовлечения сердца и печени",

  /* ---------------- completeness labels ---------------- */
  "Phenotype": "Фенотип",
  "Genetics": "Генетика",
  "Timeline": "Хронология",
  "Laboratory": "Лаборатория",
  "Imaging": "Визуализация",
  "Family history": "Семейный анамнез",
  "Treatment response": "Ответ на лечение",
  "Negative evidence": "Негативные данные",

  /* ---------------- documents & extraction ---------------- */
  "Neurology discharge summary": "Выписной эпикриз невролога",
  "Metabolic work-up report": "Отчёт метаболического обследования",
  "Paediatric neurology summary covering birth to 4 years, including EEG and MRI reports.": "Заключение детского невролога за период от рождения до 4 лет, включая протоколы ЭЭГ и МРТ.",
  "Plasma and CSF metabolite panel with interpretation.": "Панель метаболитов плазмы и ликвора с интерпретацией.",
  "“…has not acquired independent sitting by 8 months and shows delay across all domains…”": "«…к 8 месяцам не сидит самостоятельно, отмечается задержка по всем доменам…»",
  "…has not acquired independent sitting by 8 months and shows delay across all domains…": "…к 8 месяцам не сидит самостоятельно, отмечается задержка по всем доменам…",
  "…marked truncal hypotonia with preserved deep tendon reflexes…": "…выраженная туловищная гипотония при сохранных глубоких сухожильных рефлексах…",
  "…focal seizures with secondary generalisation, first documented at 14 months…": "…фокальные приступы со вторичной генерализацией, впервые задокументированы в 14 месяцев…",
  "…loss of previously acquired head control following a febrile episode…": "…утрата ранее приобретённого контроля головы после лихорадочного эпизода…",
  "…profound cognitive impairment on structured assessment…": "…глубокое когнитивное снижение по структурированной оценке…",
  "…intermittent ocular instability noted by parents…": "…перемежающаяся глазная нестабильность, отмечена родителями…",
  "…spleen not palpably enlarged…": "…селезёнка пальпаторно не увеличена…",
  "…plasma lactate 4.1 mmol/L (reference 0.5–2.2) on two separate samples…": "…лактат плазмы 4,1 ммоль/л (референс 0,5–2,2) в двух разных пробах…",
  "…alanine 648 µmol/L, consistent with chronic lactate elevation…": "…аланин 648 мкмоль/л, что согласуется с хроническим повышением лактата…",
  "…required nasogastric supplementation between 6 and 11 months…": "…требовалось назогастральное докармливание с 6 до 11 месяцев…",
};

/** "17 months" → "17 мес", "3y 6m" → "3 г 6 мес", etc. */
function translateAge(s: string): string | null {
  let m = s.match(/^(\d+) months?$/);
  if (m) return `${m[1]} мес`;
  m = s.match(/^(\d+) weeks?$/);
  if (m) return `${m[1]} нед`;
  m = s.match(/^(\d+)y (\d+)m$/);
  if (m) return `${m[1]} г ${m[2]} мес`;
  m = s.match(/^(\d+)y$/);
  if (m) return `${m[1]} г`;
  m = s.match(/^Child · (\d+)y(?: (\d+)m)?$/);
  if (m) return `Ребёнок · ${m[1]} г${m[2] ? ` ${m[2]} мес` : ""}`;
  m = s.match(/^Infant · (\d+)m$/);
  if (m) return `Младенец · ${m[1]} мес`;
  m = s.match(/^Infant · <1y$/);
  if (m) return "Младенец · <1 г";
  m = s.match(/^Adolescent · (\d+)y$/);
  if (m) return `Подросток · ${m[1]} г`;
  if (s === "Adult") return "Взрослый";
  return null;
}

/** Translate a piece of seeded clinical content. Falls back to the source. */
export function content(value: string, lang: Lang): string {
  if (lang === "en" || !value) return value;
  const direct = RU[value];
  if (direct) return direct;
  const age = translateAge(value);
  if (age) return age;
  return value;
}
