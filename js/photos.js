(function (global) {
  'use strict';

  /* Локальные файлы: assets/plants/{id}.jpg и assets/gardens/{key}.jpg */
  const ASSETS = 'assets';

  const PLANT_REMOTE = {
    lavender: 'https://upload.wikimedia.org/wikipedia/commons/6/60/Single_lavendar_flower02.jpg',
    hosta: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Hosta_tardiflora_kz02.jpg',
    daylily: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Hemerocallis_fulva.jpg',
    astilbe: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Astilbe_arenostachya.jpg',
    sedum: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Sedum_acre_002.jpg',
    phlox: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/Phlox_paniculata_001.jpg',
    iris: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Iris_germanica_%27Flag%27.jpg',
    fern: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Dryopteris_filix-mas.jpg',
    coneflower: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Echinacea_purpurea_%27Maxima%27.jpg',
    geranium: 'https://upload.wikimedia.org/wikipedia/commons/8/8d/Geranium_sanguineum_20060624.jpg',
    yarrow: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Achillea_millefolium_%28flowers%29.jpg',
    brunnera: 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Brunnera_macrophylla_2006-04-11.jpg',
    spirea: 'https://upload.wikimedia.org/wikipedia/commons/a/a4/Spiraea_japonica_001.jpg',
    hydrangea: 'https://upload.wikimedia.org/wikipedia/commons/8/8a/Hydrangea_paniculata_%27Grandiflora%27.jpg',
    barberry: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Berberis_thunbergii_Chouja01.jpg',
    lilac: 'https://upload.wikimedia.org/wikipedia/commons/4/48/Syringa_vulgaris_flowers.jpg',
    jasmine: 'https://upload.wikimedia.org/wikipedia/commons/6/6c/Philadelphus_coronarius0.jpg',
    dogwood: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Cornus_alba_%27Sibirica%27.jpg',
    thuja: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Thuja_occidentalis.jpg',
    spruce: 'https://upload.wikimedia.org/wikipedia/commons/5/56/Picea_abies_%28Norway_Spruce%29.jpg',
    apple: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Malus_domestica_a1.jpg',
    willow: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Salix_caprea_2.jpg',
    rose: 'https://upload.wikimedia.org/wikipedia/commons/e/e8/Rosa_Primula_20070601.jpg',
    clematis: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Clematis_viticella_R%C3%A9flexion.jpg',
    salvia: 'https://upload.wikimedia.org/wikipedia/commons/5/5a/Salvia_nemorosa_001.jpg',
    heuchera: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Heuchera_sanguinea_1.jpg'
  };

  const GARDEN_REMOTE = {
    open: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Cottage_garden_border_at_Barnsdale.jpg',
    border: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Garden_path%2C_Ashridge_Estate%2C_Berkhamsted%2C_Hertfordshire%2C_UK.jpg',
    house: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Cottage_garden_at_Boreham%2C_Essex%2C_England_1.jpg',
    pond: 'https://upload.wikimedia.org/wikipedia/commons/9/9d/Water_garden_at_Bodnant_Garden%2C_Wales.jpg',
    meadow: 'https://upload.wikimedia.org/wikipedia/commons/b/bd/Wildflower_meadow%2C_Colby_Woodland_Garden_-_geograph.org.uk_-_7193230.jpg',
    grass: 'https://upload.wikimedia.org/wikipedia/commons/5/5c/Grass_closeup.jpg',
    fence: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Cottage_garden_border_at_Barnsdale.jpg',
    slope: 'https://upload.wikimedia.org/wikipedia/commons/1/1e/Wildflower_meadow_in_Gloucestershire.jpg',
    path: 'https://upload.wikimedia.org/wikipedia/commons/d/d6/Garden_path%2C_Ashridge_Estate%2C_Berkhamsted%2C_Hertfordshire%2C_UK.jpg'
  };

  const LOCATION_GARDEN = {
    open: 'open', fence: 'fence', path: 'path', house: 'house',
    pond: 'pond', slope: 'slope'
  };

  const INSPIRATION_SETS = {
    pastel: [
      { garden: 'house', label: 'Нежный сад у дома' },
      { garden: 'open', label: 'Пастельный цветник' }
    ],
    vivid: [
      { garden: 'meadow', label: 'Яркая цветочная лужайка' },
      { garden: 'open', label: 'Контрастная клумба' }
    ],
    warm: [
      { garden: 'open', label: 'Тёплые летние тона' },
      { garden: 'house', label: 'Золотистый сад' }
    ],
    cool: [
      { garden: 'pond', label: 'Прохладные оттенки у воды' },
      { garden: 'open', label: 'Сине-фиолетовая гамма' }
    ],
    mono: [
      { garden: 'house', label: 'Белый сад' },
      { garden: 'open', label: 'Монохромная клумба' }
    ],
    natural: [
      { garden: 'meadow', label: 'Природный луг' },
      { garden: 'pond', label: 'Естественный сад' }
    ]
  };

  const GARDEN_LABELS = {
    open: 'Открытая лужайка', fence: 'Посадка у забора', path: 'Бордюр у дорожки',
    house: 'Клумба у дома', pond: 'Сад у водоёма', slope: 'Цветник на склоне',
    meadow: 'Луговой цветник'
  };

  function localPhoto(id, folder) {
    return `${ASSETS}/${folder}/${id}.jpg`;
  }

  function getPlantPhotoUrl(plant) {
    return localPhoto(plant.id, 'plants');
  }

  function getPlantPhotoRemote(plant) {
    return PLANT_REMOTE[plant.id] || PLANT_REMOTE.lavender;
  }

  function getGardenPhotoLocal(location) {
    const key = LOCATION_GARDEN[location] || 'open';
    return localPhoto(key, 'gardens');
  }

  function getGardenPhotoRemote(location) {
    const key = LOCATION_GARDEN[location] || 'open';
    return GARDEN_REMOTE[key] || GARDEN_REMOTE.open;
  }

  function imgTag(local, remote, alt, className, style) {
    const cls = className ? ` class="${className}"` : '';
    const st = style ? ` style="${style}"` : '';
    const l = local.replace(/"/g, '&quot;');
    const r = remote.replace(/"/g, '&quot;');
    return `<img${cls}${st} src="${l}" data-remote="${r}" alt="${alt}" loading="lazy"
      onerror="if(this.dataset.remote&&this.src!==this.dataset.remote){this.src=this.dataset.remote}">`;
  }

  function plantImg(plant, className, extraStyle) {
    return imgTag(
      getPlantPhotoUrl(plant),
      getPlantPhotoRemote(plant),
      plant.name,
      className,
      extraStyle
    );
  }

  function gardenImg(location, className) {
    return imgTag(
      getGardenPhotoLocal(location),
      getGardenPhotoRemote(location),
      'Цветник',
      className || 'garden-bg-photo'
    );
  }

  function buildPhotoRender(plants, choices) {
    const positions = [
      { top: '8%', left: '8%', size: 'tall' }, { top: '6%', left: '38%', size: 'tall' }, { top: '10%', left: '68%', size: 'medium' },
      { top: '38%', left: '12%', size: 'medium' }, { top: '36%', left: '42%', size: 'medium' }, { top: '40%', left: '72%', size: 'medium' },
      { top: '62%', left: '18%', size: 'low' }, { top: '64%', left: '48%', size: 'low' }, { top: '60%', left: '74%', size: 'low' }
    ];

    const overlays = plants.map((p, i) => {
      const pos = positions[i % positions.length];
      return `<div class="photo-overlay photo-overlay--${pos.size}" style="top:${pos.top};left:${pos.left}" title="${p.name}">
        ${plantImg(p, 'photo-overlay-img')}
        <span class="photo-overlay-label">${p.name}</span>
      </div>`;
    }).join('');

    return `<div class="photo-render">
      ${gardenImg(choices.location, 'photo-render-bg')}
      <div class="photo-render-overlay">${overlays}</div>
    </div>`;
  }

  function buildPhotoLayers(plants) {
    const tiers = { tall: [], medium: [], low: [] };
    plants.forEach((p) => tiers[p.height || 'medium'].push(p));

    function row(label, list, size) {
      if (!list.length) return '';
      const cells = list.map((p) =>
        `<div class="photo-layer-cell photo-layer-cell--${size}">
          ${plantImg(p, 'photo-layer-img')}
          <span>${p.name}</span>
        </div>`
      ).join('');
      return `<div class="photo-layer-row"><div class="photo-layer-label">${label}</div><div class="photo-layer-items">${cells}</div></div>`;
    }

    return `<div class="photo-layers">
      ${row('Задний план', tiers.tall, 'tall')}
      ${row('Средний ярус', tiers.medium, 'medium')}
      ${row('Передний план', tiers.low, 'low')}
    </div>`;
  }

  function buildPhotoPlan(plants) {
    const positions = [
      { top: 18, left: 25 }, { top: 18, left: 50 }, { top: 18, left: 75 },
      { top: 45, left: 18 }, { top: 45, left: 40 }, { top: 45, left: 62 }, { top: 45, left: 84 },
      { top: 72, left: 30 }, { top: 72, left: 55 }, { top: 72, left: 78 }
    ];

    const markers = plants.map((p, i) => {
      const pos = positions[i % positions.length];
      const h = p.height || 'medium';
      return `<div class="photo-plan-marker photo-plan-marker--${h}" style="top:${pos.top}%;left:${pos.left}%">
        ${plantImg(p, 'photo-plan-img')}
        <span class="photo-plan-num">${i + 1}</span>
      </div>`;
    }).join('');

    return `<div class="photo-plan">
      <div class="photo-plan-bed">
        ${imgTag(localPhoto('grass', 'gardens'), GARDEN_REMOTE.grass, 'Газон', 'photo-plan-grass')}
        ${markers}
      </div>
      <p class="plan-scale">План клумбы 3×2 м · фото растений сверху</p>
    </div>`;
  }

  function buildPhotoBorder(plants) {
    const sorted = [...plants].sort((a, b) => {
      const order = { low: 0, medium: 1, tall: 2 };
      return (order[a.height] || 1) - (order[b.height] || 1);
    });

    const cells = sorted.map((p) => {
      const h = p.height || 'medium';
      return `<div class="photo-border-cell photo-border-cell--${h}">
        ${plantImg(p, 'photo-border-img')}
        <span>${p.name}</span>
      </div>`;
    }).join('');

    return `<div class="photo-border">
      <div class="photo-border-strip">${cells}</div>
      ${imgTag(localPhoto('border', 'gardens'), GARDEN_REMOTE.border, 'Дорожка', 'photo-border-path')}
    </div>`;
  }

  function buildPhotoPerspective(plants, choices) {
    const side = plants.slice(0, 6).map((p, i) =>
      `<div class="photo-persp-thumb" style="--i:${i}">
        ${plantImg(p, 'photo-persp-img')}
        <span>${p.name}</span>
      </div>`
    ).join('');

    return `<div class="photo-perspective">
      ${gardenImg(choices.location, 'photo-persp-bg')}
      <div class="photo-persp-strip">${side}</div>
    </div>`;
  }

  function getInspirationPhotos(palette, location) {
    const set = INSPIRATION_SETS[palette] || INSPIRATION_SETS.natural;
    const locKey = LOCATION_GARDEN[location] || 'open';
    const locPhoto = { garden: locKey, label: GARDEN_LABELS[locKey] || 'Ваш участок' };
    return [set[0], locPhoto].map((item) => ({
      label: item.label,
      local: localPhoto(item.garden, 'gardens'),
      remote: GARDEN_REMOTE[item.garden] || GARDEN_REMOTE.open
    }));
  }

  global.GardenPhotos = {
    plantImg,
    gardenImg,
    imgTag,
    buildPhotoRender,
    buildPhotoLayers,
    buildPhotoPlan,
    buildPhotoBorder,
    buildPhotoPerspective,
    getInspirationPhotos,
    getPlantPhotoUrl,
    getPlantPhotoRemote
  };
})(window);
