(function () {
  'use strict';

  const LABELS = {
    insolation: { sun: 'Полное солнце', partial: 'Полутень', shade: 'Тень' },
    soil: {
      fertile: 'Плодородный', sandy: 'Песчаный', clay: 'Глинистый',
      acidic: 'Кислый', alkaline: 'Щелочной', moist: 'Влажный'
    },
    location: {
      open: 'Открытая лужайка', fence: 'У забора', path: 'Вдоль дорожки',
      house: 'У дома', pond: 'У водоёма', slope: 'На склоне'
    },
    palette: {
      pastel: 'Пастельная', vivid: 'Яркая', warm: 'Тёплая',
      cool: 'Холодная', mono: 'Монохром', natural: 'Природная'
    },
    woody: {
      no: 'Только цветник', shrubs: 'С кустарниками',
      trees: 'С деревьями', both: 'Кустарники и деревья'
    }
  };

  const PALETTE_COLORS = {
    pastel: ['#f5d5e0', '#d4e8d1', '#e8dff5', '#f0e6d8'],
    vivid: ['#e63946', '#ffd60a', '#2a9d8f', '#f4a261'],
    warm: ['#e76f51', '#f4a261', '#e9c46a', '#d4a574'],
    cool: ['#4a6fa5', '#6b9ac4', '#a8dadc', '#7b68a6'],
    mono: ['#ffffff', '#e8e4df', '#b5a99a', '#7a9e6a'],
    natural: ['#7a9e6a', '#c4a77d', '#8b6f47', '#d4c4a0']
  };


  const VIZ_MODES = [
    { id: 'illustration', label: 'Фото-рендер' },
    { id: 'layers', label: 'Ярусы' },
    { id: 'plan', label: 'План сверху' },
    { id: 'border', label: 'Бордюр' },
    { id: 'perspective', label: 'Вид сбоку' }
  ];

  let currentVizMode = 'illustration';
  let lastResultPlants = [];
  let lastResultPalette = 'natural';

  const PLANTS = [
    { id: 'lavender', name: 'Лаванда', latin: 'Lavandula angustifolia', type: 'perennial', height: 'low',
      light: ['sun'], soil: ['sandy', 'alkaline', 'fertile'], location: ['open', 'path', 'house', 'fence'],
      palette: ['pastel', 'cool', 'mono', 'natural'], color: '#9b8ec4', bloom: 'июль–август',
      care: 'Хороший дренаж, укрытие на зиму в суровых зонах' },
    { id: 'hosta', name: 'Хоста', latin: 'Hosta spp.', type: 'perennial', height: 'medium',
      light: ['shade', 'partial'], soil: ['fertile', 'moist', 'clay'], location: ['fence', 'house', 'pond', 'path'],
      palette: ['pastel', 'cool', 'mono', 'natural'], color: '#6b9e78', bloom: 'июль',
      care: 'Мульчирование, защита от улиток' },
    { id: 'daylily', name: 'Лилейник', latin: 'Hemerocallis spp.', type: 'perennial', height: 'medium',
      light: ['sun', 'partial'], soil: ['fertile', 'clay', 'sandy'], location: ['open', 'fence', 'house', 'path'],
      palette: ['vivid', 'warm', 'pastel', 'natural'], color: '#e76f51', bloom: 'июнь–август',
      care: 'Деление каждые 4–5 лет, подкормка весной' },
    { id: 'astilbe', name: 'Астильба', latin: 'Astilbe spp.', type: 'perennial', height: 'medium',
      light: ['partial', 'shade'], soil: ['moist', 'fertile', 'clay'], location: ['pond', 'fence', 'house', 'slope'],
      palette: ['pastel', 'cool', 'vivid', 'mono'], color: '#e8a0bf', bloom: 'июнь–июль',
      care: 'Регулярный полив, не допускать пересыхания' },
    { id: 'sedum', name: 'Седум (очиток)', latin: 'Sedum spp.', type: 'perennial', height: 'low',
      light: ['sun'], soil: ['sandy', 'alkaline', 'fertile'], location: ['open', 'path', 'slope', 'house'],
      palette: ['warm', 'vivid', 'natural', 'mono'], color: '#e9c46a', bloom: 'август–сентябрь',
      care: 'Засухоустойчив, не требует частого полива' },
    { id: 'phlox', name: 'Флокс метельчатый', latin: 'Phlox paniculata', type: 'perennial', height: 'medium',
      light: ['sun', 'partial'], soil: ['fertile', 'clay'], location: ['open', 'fence', 'house'],
      palette: ['pastel', 'vivid', 'cool', 'warm'], color: '#d4a0d4', bloom: 'июль–сентябрь',
      care: 'Подвязка высоких сортов, профилактика мучнистой росы' },
    { id: 'iris', name: 'Ирис бородатый', latin: 'Iris germanica', type: 'perennial', height: 'medium',
      light: ['sun'], soil: ['fertile', 'sandy', 'alkaline'], location: ['open', 'path', 'house', 'fence'],
      palette: ['cool', 'vivid', 'pastel', 'mono'], color: '#6b7ec4', bloom: 'май–июнь',
      care: 'Деление через 3–4 года, не заглублять корневище' },
    { id: 'fern', name: 'Папоротник', latin: 'Dryopteris filix-mas', type: 'perennial', height: 'medium',
      light: ['shade', 'partial'], soil: ['moist', 'fertile', 'acidic'], location: ['pond', 'fence', 'house', 'slope'],
      palette: ['natural', 'mono', 'cool', 'pastel'], color: '#4a7a5a', bloom: 'лиственный',
      care: 'Регулярный полив, мульчирование листьями' },
    { id: 'coneflower', name: 'Эхинацея', latin: 'Echinacea purpurea', type: 'perennial', height: 'medium',
      light: ['sun'], soil: ['fertile', 'sandy', 'clay'], location: ['open', 'path', 'fence'],
      palette: ['vivid', 'warm', 'natural', 'pastel'], color: '#e07a5f', bloom: 'июль–сентябрь',
      care: 'Зимостойка, привлекает опылителей' },
    { id: 'geranium', name: 'Герань садовая', latin: 'Geranium spp.', type: 'perennial', height: 'low',
      light: ['partial', 'sun'], soil: ['fertile', 'clay', 'sandy'], location: ['path', 'open', 'house', 'slope'],
      palette: ['cool', 'pastel', 'vivid', 'natural'], color: '#7b68a6', bloom: 'май–июнь',
      care: 'Стрижка после цветения для повторного цветения' },
    { id: 'yarrow', name: 'Тысячелистник', latin: 'Achillea millefolium', type: 'perennial', height: 'medium',
      light: ['sun'], soil: ['sandy', 'fertile', 'alkaline'], location: ['open', 'path', 'slope', 'fence'],
      palette: ['warm', 'natural', 'vivid', 'pastel'], color: '#f4d58d', bloom: 'июнь–август',
      care: 'Засухоустойчив, не любит переувлажнения' },
    { id: 'brunnera', name: 'Бруннера', latin: 'Brunnera macrophylla', type: 'perennial', height: 'low',
      light: ['shade', 'partial'], soil: ['fertile', 'moist'], location: ['fence', 'house', 'pond', 'path'],
      palette: ['cool', 'pastel', 'mono'], color: '#8eb8d4', bloom: 'апрель–май',
      care: 'Теневынослива, декоративная листва' },
    { id: 'spirea', name: 'Спирея японская', latin: "Spiraea japonica", type: 'shrub', height: 'tall',
      light: ['sun', 'partial'], soil: ['fertile', 'clay', 'sandy'], location: ['fence', 'open', 'house'],
      palette: ['warm', 'vivid', 'natural', 'pastel'], color: '#e8a0a0', bloom: 'июнь–июль',
      care: 'Обрезка после цветения, зимостойкая' },
    { id: 'hydrangea', name: 'Гортензия метельчатая', latin: "Hydrangea paniculata", type: 'shrub', height: 'tall',
      light: ['partial', 'sun'], soil: ['fertile', 'moist', 'clay'], location: ['fence', 'house', 'open'],
      palette: ['pastel', 'mono', 'cool', 'natural'], color: '#d4e8c8', bloom: 'июль–сентябрь',
      care: 'Обрезка ранней весной, полив в засуху' },
    { id: 'barberry', name: 'Барбарис Тунберга', latin: "Berberis thunbergii", type: 'shrub', height: 'medium',
      light: ['sun'], soil: ['sandy', 'fertile', 'clay', 'alkaline'], location: ['fence', 'path', 'slope', 'house'],
      palette: ['warm', 'vivid', 'natural'], color: '#8b2942', bloom: 'май',
      care: 'Засухоустойчив, колючий — хорош как живая изгородь' },
    { id: 'lilac', name: 'Сирень', latin: 'Syringa vulgaris', type: 'shrub', height: 'tall',
      light: ['sun'], soil: ['fertile', 'alkaline', 'clay'], location: ['fence', 'open', 'house'],
      palette: ['cool', 'pastel', 'mono'], color: '#b8a0d4', bloom: 'май',
      care: 'Омолаживающая обрезка, полив в засуху' },
    { id: 'jasmine', name: 'Чубушник', latin: 'Philadelphus coronarius', type: 'shrub', height: 'tall',
      light: ['sun', 'partial'], soil: ['fertile', 'clay', 'sandy'], location: ['fence', 'house', 'open'],
      palette: ['mono', 'pastel', 'natural'], color: '#f0ece4', bloom: 'июнь',
      care: 'Обрезка после цветения' },
    { id: 'dogwood', name: 'Дерен белый', latin: "Cornus alba 'Elegantissima'", type: 'shrub', height: 'tall',
      light: ['sun', 'partial'], soil: ['moist', 'fertile', 'clay'], location: ['pond', 'fence', 'open'],
      palette: ['cool', 'mono', 'natural', 'pastel'], color: '#c44a4a', bloom: 'май–лиственный',
      care: 'Омолаживающая обрезка весной, декоративные побеги' },
    { id: 'thuja', name: 'Туя западная', latin: "Thuja occidentalis", type: 'tree', height: 'tall',
      light: ['sun', 'partial'], soil: ['sandy', 'fertile', 'acidic'], location: ['fence', 'house', 'open'],
      palette: ['natural', 'mono', 'cool'], color: '#3d6b4f', bloom: 'хвойная',
      care: 'Полив первые годы, защита от весеннего солнца' },
    { id: 'spruce', name: 'Ель обыкновенная', latin: 'Picea abies', type: 'tree', height: 'tall',
      light: ['sun', 'partial'], soil: ['acidic', 'sandy', 'fertile'], location: ['open', 'fence', 'house'],
      palette: ['natural', 'cool', 'mono'], color: '#2a5a3a', bloom: 'хвойная',
      care: 'Кислая почва, полив первые 2–3 года' },
    { id: 'apple', name: 'Яблоня колоновидная', latin: "Malus 'Arbat'", type: 'tree', height: 'tall',
      light: ['sun'], soil: ['fertile', 'clay'], location: ['open', 'house', 'fence'],
      palette: ['warm', 'natural', 'pastel', 'vivid'], color: '#e8a0a8', bloom: 'май',
      care: 'Обрезка, подкормка, полив в засуху' },
    { id: 'willow', name: 'Ива козья', latin: "Salix caprea 'Nana'", type: 'shrub', height: 'medium',
      light: ['sun', 'partial'], soil: ['moist', 'clay', 'fertile'], location: ['pond', 'slope', 'open'],
      palette: ['natural', 'warm', 'pastel'], color: '#c8d8a0', bloom: 'апрель',
      care: 'Влаголюбива, подходит для влажных мест' },
    { id: 'rose', name: 'Роза парковая', latin: "Rosa 'Pink Grootendorst'", type: 'shrub', height: 'medium',
      light: ['sun'], soil: ['fertile', 'clay', 'sandy'], location: ['house', 'fence', 'path', 'open'],
      palette: ['pastel', 'warm', 'vivid', 'mono'], color: '#f0a0b0', bloom: 'июнь–сентябрь',
      care: 'Укрытие на зиму, подкормка, профилактическая обработка' },
    { id: 'clematis', name: 'Клематис', latin: "Clematis 'Nelly Moser'", type: 'shrub', height: 'tall',
      light: ['partial', 'sun'], soil: ['fertile', 'moist', 'clay'], location: ['fence', 'house'],
      palette: ['cool', 'pastel', 'vivid'], color: '#d4a0d8', bloom: 'май–сентябрь',
      care: 'Укрытие корней, опора обязательна' },
    { id: 'salvia', name: 'Шалфей дубравный', latin: 'Salvia nemorosa', type: 'perennial', height: 'medium',
      light: ['sun'], soil: ['sandy', 'fertile', 'alkaline'], location: ['open', 'path', 'house'],
      palette: ['cool', 'vivid', 'natural'], color: '#5a4a8a', bloom: 'июнь–август',
      care: 'Стрижка после первого цветения' },
    { id: 'heuchera', name: 'Гейхера', latin: 'Heuchera spp.', type: 'perennial', height: 'low',
      light: ['partial', 'shade'], soil: ['fertile', 'sandy'], location: ['path', 'house', 'fence', 'slope'],
      palette: ['warm', 'vivid', 'natural', 'cool'], color: '#c46a3a', bloom: 'июнь–июль',
      care: 'Декоративная листва, не заглублять корневую шейку' }
  ];

  const state = {
    step: 0,
    totalSteps: 6,
    choices: {
      insolation: null,
      soil: null,
      location: null,
      palette: null,
      woody: null
    }
  };

  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  function showToast(msg) {
    const toast = $('#toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }

  function updateProgress() {
    const pct = state.step === 0 ? 0 : (state.step / state.totalSteps) * 100;
    $('#progressFill').style.width = pct + '%';
    const label = state.step === 0
      ? 'Начало'
      : state.step >= state.totalSteps
        ? 'Готово'
        : `Шаг ${state.step} из ${state.totalSteps}`;
    $('#progressText').textContent = label;
  }

  function showStep(n) {
    state.step = n;
    $$('.step').forEach((el) => el.classList.remove('active'));
    const target = $(`#step${n}`);
    if (target) target.classList.add('active');

    const footer = $('#appFooter');
    const btnBack = $('#btnBack');
    const btnNext = $('#btnNext');

    if (n === 0) {
      footer.classList.add('hidden');
    } else if (n === state.totalSteps) {
      footer.classList.add('hidden');
      renderResult();
    } else {
      footer.classList.remove('hidden');
      btnBack.disabled = n <= 1;
      btnNext.textContent = n === state.totalSteps - 1 ? 'Показать результат' : 'Далее';
      btnNext.disabled = !isStepValid(n);
    }

    updateProgress();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function isStepValid(step) {
    const fields = {
      1: 'insolation', 2: 'soil', 3: 'location',
      4: 'palette', 5: 'woody'
    };
    const field = fields[step];
    return field ? !!state.choices[field] : true;
  }

  function scorePlant(plant, choices) {
    let score = 0;
    if (plant.light.includes(choices.insolation)) score += 3;
    else if (
      (choices.insolation === 'partial' && (plant.light.includes('sun') || plant.light.includes('shade'))) ||
      (choices.insolation === 'sun' && plant.light.includes('partial')) ||
      (choices.insolation === 'shade' && plant.light.includes('partial'))
    ) score += 1;

    if (plant.soil.includes(choices.soil)) score += 3;
    else if (choices.soil === 'fertile') score += 1;

    if (plant.location.includes(choices.location)) score += 2;

    if (plant.palette.includes(choices.palette)) score += 3;

    return score;
  }

  function selectPlants(choices) {
    const scored = PLANTS.map((p) => ({ plant: p, score: scorePlant(p, choices) }))
      .filter((s) => s.score >= 3)
      .sort((a, b) => b.score - a.score);

    const perennials = scored.filter((s) => s.plant.type === 'perennial').map((s) => s.plant);
    const shrubs = scored.filter((s) => s.plant.type === 'shrub').map((s) => s.plant);
    const trees = scored.filter((s) => s.plant.type === 'tree').map((s) => s.plant);

    const result = [];
    const pick = (arr, n) => arr.slice(0, n);

    result.push(...pick(perennials, 5));

    if (choices.woody === 'shrubs' || choices.woody === 'both') {
      result.push(...pick(shrubs, 2));
    }
    if (choices.woody === 'trees' || choices.woody === 'both') {
      result.push(...pick(trees, 1));
    }

    if (result.length < 4) {
      const used = new Set(result.map((p) => p.id));
      const fallback = PLANTS.filter((p) => !used.has(p.id))
        .map((p) => ({ plant: p, score: scorePlant(p, choices) }))
        .sort((a, b) => b.score - a.score);
      for (const { plant } of fallback) {
        if (result.length >= 6) break;
        result.push(plant);
      }
    }

    return result;
  }

  function plantVisual(plant, className) {
    if (window.GardenPhotos) {
      return `<div class="plant-photo-wrap ${className || ''}">${window.GardenPhotos.plantImg(plant, 'plant-photo')}</div>`;
    }
    return `<div class="photo-fallback" style="background:${plant.color}">${plant.name.charAt(0)}</div>`;
  }

  function buildIllustrationView(plants, palette, choices) {
    const content = window.GardenPhotos
      ? window.GardenPhotos.buildPhotoRender(plants, choices)
      : buildScheme(plants, palette);

    const legend = plants.map((p) =>
      `<span class="legend-item"><span class="legend-dot" style="background:${p.color}"></span>${p.name}</span>`
    ).join('');

    return `${content}
      <p class="plan-scale">Фото-визуализация цветника · масштаб 3×2 м</p>
      <div class="bed-legend">${legend}</div>`;
  }

  function buildPhotoLayersView(plants) {
    if (!window.GardenPhotos) return buildScheme(plants, 'natural');
    const legend = plants.map((p) =>
      `<span class="legend-item"><span class="legend-dot" style="background:${p.color}"></span>${p.name}</span>`
    ).join('');
    return `${window.GardenPhotos.buildPhotoLayers(plants)}<div class="bed-legend">${legend}</div>`;
  }

  function buildPhotoPlanView(plants, palette, choices) {
    if (!window.GardenPhotos) return buildPlanView(plants, palette);
    const legend = plants.map((p, i) =>
      `<span class="legend-item"><span class="legend-dot" style="background:${p.color}"></span>${i + 1}. ${p.name}</span>`
    ).join('');
    return `${window.GardenPhotos.buildPhotoPlan(plants, choices)}<div class="bed-legend">${legend}</div>`;
  }

  function buildPhotoBorderView(plants, palette) {
    if (!window.GardenPhotos) return buildBorderView(plants, palette);
    const legend = plants.map((p) =>
      `<span class="legend-item"><span class="legend-dot" style="background:${p.color}"></span>${p.name}</span>`
    ).join('');
    return `${window.GardenPhotos.buildPhotoBorder(plants)}<div class="bed-legend">${legend}</div>`;
  }

  function buildPhotoPerspectiveView(plants, palette, choices) {
    if (!window.GardenPhotos) return buildPerspectiveView(plants, palette);
    const legend = plants.map((p) =>
      `<span class="legend-item"><span class="legend-dot" style="background:${p.color}"></span>${p.name}</span>`
    ).join('');
    return `${window.GardenPhotos.buildPhotoPerspective(plants, choices)}<div class="bed-legend">${legend}</div>`;
  }

  function buildScheme(plants, palette) {
    const colors = PALETTE_COLORS[palette] || PALETTE_COLORS.natural;
    const tiers = { tall: [], medium: [], low: [] };

    plants.forEach((p) => {
      const tier = p.height || 'medium';
      tiers[tier].push(p);
    });

    const rows = [];
    if (tiers.tall.length) rows.push({ label: 'Задний план', plants: tiers.tall });
    if (tiers.medium.length) rows.push({ label: 'Средний ярус', plants: tiers.medium });
    if (tiers.low.length) rows.push({ label: 'Передний план', plants: tiers.low });

    if (!rows.length) {
      rows.push({ label: 'Цветник', plants: plants.slice(0, 6) });
    }

    let colorIdx = 0;
    const html = rows.map((row) => {
      const cells = row.plants.map((p) => {
        const c = p.color || colors[colorIdx++ % colors.length];
        return `<div class="bed-plant" style="background:${c}" title="${p.name} — ${p.latin}">${p.name}</div>`;
      }).join('');
      return `<div class="bed-row" aria-label="${row.label}">${cells}</div>`;
    }).join('');

    const legend = plants.map((p) =>
      `<span class="legend-item"><span class="legend-dot" style="background:${p.color}"></span>${p.name}</span>`
    ).join('');

    return `<div class="bed-scheme">${html}</div><div class="bed-legend">${legend}</div>`;
  }

  function buildPlanView(plants, palette) {
    const colors = PALETTE_COLORS[palette] || PALETTE_COLORS.natural;
    const positions = [
      { top: 18, left: 25 }, { top: 18, left: 50 }, { top: 18, left: 75 },
      { top: 45, left: 18 }, { top: 45, left: 40 }, { top: 45, left: 62 }, { top: 45, left: 84 },
      { top: 72, left: 30 }, { top: 72, left: 55 }, { top: 72, left: 78 }
    ];

    const dots = plants.map((p, i) => {
      const pos = positions[i % positions.length];
      const h = p.height || 'medium';
      const c = p.color || colors[i % colors.length];
      const num = i + 1;
      return `<div class="plan-plant plan-plant--${h}" style="top:${pos.top}%;left:${pos.left}%;background:${c}" title="${p.name}">${num}</div>`;
    }).join('');

    const legend = plants.map((p, i) =>
      `<span class="legend-item"><span class="legend-dot" style="background:${p.color}"></span>${i + 1}. ${p.name}</span>`
    ).join('');

    return `<div class="bed-plan">
      <div class="plan-bed">${dots}</div>
      <p class="plan-scale">План клумбы 3×2 м · вид сверху</p>
      <div class="bed-legend">${legend}</div>
    </div>`;
  }

  function buildBorderView(plants, palette) {
    const colors = PALETTE_COLORS[palette] || PALETTE_COLORS.natural;
    const sorted = [...plants].sort((a, b) => {
      const order = { low: 0, medium: 1, tall: 2 };
      return (order[a.height] || 1) - (order[b.height] || 1);
    });

    const cells = sorted.map((p, i) => {
      const h = p.height || 'medium';
      const c = p.color || colors[i % colors.length];
      return `<div class="border-plant border-plant--${h}" style="background:${c}" title="${p.name}">${p.name}</div>`;
    }).join('');

    const legend = plants.map((p) =>
      `<span class="legend-item"><span class="legend-dot" style="background:${p.color}"></span>${p.name}</span>`
    ).join('');

    return `<div class="bed-border">
      <div class="border-path">Дорожка</div>
      <div class="border-plants">${cells}</div>
      <div class="bed-legend">${legend}</div>
    </div>`;
  }

  function buildPerspectiveView(plants, palette) {
    const colors = PALETTE_COLORS[palette] || PALETTE_COLORS.natural;
    const tiers = { tall: [], medium: [], low: [] };
    plants.forEach((p) => tiers[p.height || 'medium'].push(p));

    function layerHtml(tier, className) {
      return tiers[tier].map((p, i) => {
        const c = p.color || colors[i % colors.length];
        return `<div class="persp-plant persp-plant--${tier}" style="background:${c}" title="${p.name}">${p.name.split(' ')[0]}</div>`;
      }).join('');
    }

    return `<div class="bed-perspective">
      <div class="persp-sky"></div>
      <div class="persp-ground"></div>
      <div class="persp-layer persp-layer--back">${layerHtml('tall', 'back')}</div>
      <div class="persp-layer persp-layer--mid">${layerHtml('medium', 'mid')}</div>
      <div class="persp-layer persp-layer--front">${layerHtml('low', 'front')}</div>
      <div class="persp-label">Вид сбоку · задний план → передний план</div>
    </div>
    <div class="bed-legend">${plants.map((p) =>
      `<span class="legend-item"><span class="legend-dot" style="background:${p.color}"></span>${p.name}</span>`
    ).join('')}</div>`;
  }

  function renderVisualization(plants, palette, mode, choices) {
    switch (mode) {
      case 'illustration': return buildIllustrationView(plants, palette, choices);
      case 'layers': return buildPhotoLayersView(plants);
      case 'plan': return buildPhotoPlanView(plants, palette, choices);
      case 'border': return buildPhotoBorderView(plants, palette);
      case 'perspective': return buildPhotoPerspectiveView(plants, palette, choices);
      default: return buildScheme(plants, palette);
    }
  }

  function renderVizTabs(plants, palette, choices) {
    const tabs = $('#vizTabs');
    tabs.innerHTML = VIZ_MODES.map((m) =>
      `<button class="viz-tab${m.id === currentVizMode ? ' active' : ''}" data-viz="${m.id}" role="tab"
        aria-selected="${m.id === currentVizMode}">${m.label}</button>`
    ).join('');

    tabs.querySelectorAll('.viz-tab').forEach((tab) => {
      tab.addEventListener('click', () => {
        currentVizMode = tab.dataset.viz;
        tabs.querySelectorAll('.viz-tab').forEach((t) => {
          t.classList.toggle('active', t.dataset.viz === currentVizMode);
          t.setAttribute('aria-selected', t.dataset.viz === currentVizMode);
        });
        $('#resultVisual').innerHTML = renderVisualization(plants, palette, currentVizMode, choices);
      });
    });
  }

  function renderInspiration(choices) {
    const photos = window.GardenPhotos
      ? window.GardenPhotos.getInspirationPhotos(choices.palette, choices.location)
      : [];

    const html = `<h4>Примеры похожих цветников</h4>
      <div class="inspiration-grid">${photos.map((p) =>
        `<div class="inspiration-card">
          ${window.GardenPhotos.imgTag(p.local, p.remote, p.label, 'inspiration-photo')}
          <span>${p.label}</span>
        </div>`
      ).join('')}</div>`;

    $('#resultInspiration').innerHTML = html;
  }

  function renderGallery(plants) {
    const cards = plants.map((p) =>
      `<article class="plant-card">
        <div class="plant-card-photo">
          ${plantVisual(p, 'plant-card-svg')}
        </div>
        <div class="plant-card-body">
          <strong>${p.name}</strong>
          <span>${p.latin}</span>
        </div>
      </article>`
    ).join('');

    $('#resultGallery').innerHTML =
      `<h3>Фотографии растений вашего цветника</h3><div class="plant-gallery">${cards}</div>`;
  }

  function getCareTips(choices, plants) {
    const tips = [];

    if (choices.insolation === 'shade') tips.push('В тени важен регулярный, но умеренный полив — почва сохнет медленнее.');
    if (choices.insolation === 'sun') tips.push('На солнце мульчируйте почву, чтобы сохранить влагу.');
    if (choices.soil === 'clay') tips.push('На глинистой почве добавьте песок и компост для улучшения дренажа.');
    if (choices.soil === 'sandy') tips.push('Песчаная почва требует частых подкормок и полива.');
    if (choices.soil === 'moist') tips.push('Во влажных местах обеспечьте дренаж — дренажная траншея или насыпной холм.');
    if (choices.location === 'slope') tips.push('На склоне посадите низкие растения внизу, высокие — вверху для укрепления.');
    if (choices.location === 'path') tips.push('У дорожки выбирайте компактные сорта, не загораживающие проход.');

    tips.push('Весной — комплексная подкормка, осенью — мульчирование корней.');
    tips.push('Схема рассчитана на клумбу 3×2 м. Масштабируйте пропорционально вашему участку.');

    return tips.slice(0, 6);
  }

  function renderResult() {
    const c = state.choices;
    const plants = selectPlants(c);
    const paletteName = LABELS.palette[c.palette];

    lastResultPlants = plants;
    lastResultPalette = c.palette;
    currentVizMode = 'illustration';

    $('#resultTitle').textContent = `Цветник в стиле «${paletteName.toLowerCase()}»`;
    $('#resultSubtitle').textContent =
      `Подобрано ${plants.length} растений для ${LABELS.location[c.location].toLowerCase()} при ${LABELS.insolation[c.insolation].toLowerCase()}.`;

    renderVizTabs(plants, c.palette, c);
    $('#resultVisual').innerHTML = renderVisualization(plants, c.palette, currentVizMode, c);
    renderInspiration(c);
    renderGallery(plants);

    const tags = [
      LABELS.insolation[c.insolation],
      LABELS.soil[c.soil],
      LABELS.location[c.location],
      LABELS.palette[c.palette],
      LABELS.woody[c.woody]
    ];
    $('#resultSummary').innerHTML =
      `<h3>Параметры</h3><div class="summary-tags">${tags.map((t) => `<span class="summary-tag">${t}</span>`).join('')}</div>`;

    const perennials = plants.filter((p) => p.type === 'perennial');
    const woody = plants.filter((p) => p.type !== 'perennial');

    let plantsHtml = '<h3>Растения цветника</h3><ul class="plant-list">';
    perennials.forEach((p) => {
      plantsHtml += `<li class="plant-item">
        <div class="plant-item-thumb">
          ${plantVisual(p, 'plant-thumb-svg')}
        </div>
        <div class="plant-info">
          <strong>${p.name}</strong>
          <span>${p.latin} · ${p.bloom}</span>
          <em>${p.care}</em>
        </div>
      </li>`;
    });
    plantsHtml += '</ul>';

    if (woody.length) {
      plantsHtml += '<h3 style="margin-top:16px">Деревья и кустарники</h3><ul class="plant-list">';
      woody.forEach((p) => {
        const typeLabel = p.type === 'tree' ? 'Дерево' : 'Кустарник';
        plantsHtml += `<li class="plant-item">
          <div class="plant-item-thumb">
            ${plantVisual(p, 'plant-thumb-svg')}
          </div>
          <div class="plant-info">
            <strong>${p.name}</strong>
            <span>${p.latin} · ${typeLabel} · ${p.bloom}</span>
            <em>${p.care}</em>
          </div>
        </li>`;
      });
      plantsHtml += '</ul>';
    }

    $('#resultPlants').innerHTML = plantsHtml;

    const careTips = getCareTips(c, plants);
    $('#resultCare').innerHTML =
      `<h3>Рекомендации по уходу</h3><ul class="care-list">${careTips.map((t) => `<li>${t}</li>`).join('')}</ul>`;
  }

  function bindCards() {
    $$('.cards-grid').forEach((grid) => {
      const field = grid.dataset.field;
      grid.querySelectorAll('.choice-card').forEach((card) => {
        card.addEventListener('click', () => {
          grid.querySelectorAll('.choice-card').forEach((c) => c.classList.remove('selected'));
          card.classList.add('selected');
          state.choices[field] = card.dataset.value;
          if (state.step < state.totalSteps) {
            $('#btnNext').disabled = !isStepValid(state.step);
          }
        });
      });
    });
  }

  function bindActions() {
    document.addEventListener('click', (e) => {
      const action = e.target.closest('[data-action]');
      if (!action) return;

      const act = action.dataset.action;
      if (act === 'next') {
        if (state.step === 0) {
          showStep(1);
        } else if (state.step < state.totalSteps) {
          if (!isStepValid(state.step)) {
            showToast('Выберите один из вариантов');
            return;
          }
          showStep(state.step + 1);
        }
      } else if (act === 'back') {
        if (state.step > 1) showStep(state.step - 1);
      } else if (act === 'restart') {
        Object.keys(state.choices).forEach((k) => { state.choices[k] = null; });
        $$('.choice-card.selected').forEach((c) => c.classList.remove('selected'));
        showStep(0);
      }
    });

    $('#btnShare').addEventListener('click', async () => {
      const text = buildShareText();
      if (navigator.share) {
        try {
          await navigator.share({ title: 'Мой идеальный цветник', text });
          return;
        } catch (_) { /* fallback below */ }
      }
      try {
        await navigator.clipboard.writeText(text);
        showToast('Схема скопирована в буфер обмена');
      } catch (_) {
        showToast('Не удалось скопировать — используйте печать');
      }
    });

    $('#btnPrint').addEventListener('click', () => window.print());
  }

  function buildShareText() {
    const c = state.choices;
    const plants = selectPlants(c);
    const names = plants.map((p) => p.name).join(', ');
    return [
      'Мой идеальный цветник',
      `${LABELS.palette[c.palette]} · ${LABELS.location[c.location]}`,
      `${LABELS.insolation[c.insolation]} · ${LABELS.soil[c.soil]}`,
      `Растения: ${names}`,
      'Собрано в конструкторе «Собери идеальный цветник»'
    ].join('\n');
  }

  function init() {
    bindCards();
    bindActions();
    showStep(0);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
