/**
 * Monta o protótipo a partir de window.SITE_DATA.
 * Scripts clássicos (sem módulo) para funcionar em file://. Não há fetch nem chamada de IA.
 */
(function () {
  const SVG_NS = 'http://www.w3.org/2000/svg';
  const SECTIONS = [
    'hero',
    'about',
    'skills',
    'projects',
    'journey',
    'contact',
  ];
  const LOOP_MS = 36000;
  const ARC_LIMIT = 4;

  const GLYPHS = {
    ring: [
      'M12 5.2a6.8 6.8 0 1 0 0 13.6 6.8 6.8 0 0 0 0-13.6z',
      'M12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z',
    ],
    diamond: ['M12 3.4l7.2 8.6L12 20.6 4.8 12z'],
    triangle: ['M12 4.2l8 14.2H4z'],
    hex: ['M8 4.2h8l4 7.8-4 7.8H8l-4-7.8z'],
    waves: [
      'M3.5 9c2 0 2.2 2.2 4.2 2.2S10 9 12 9s2.2 2.2 4.2 2.2S18.5 9 20.5 9',
      'M3.5 15c2 0 2.2 2.2 4.2 2.2S10 15 12 15s2.2 2.2 4.2 2.2S18.5 15 20.5 15',
    ],
    spark: [
      'M12 3.2l1.3 6.1L19.4 12l-6.1 1.7L12 20.8l-1.3-6.1L4.6 12l6.1-1.7z',
    ],
    plus: ['M12 5v14', 'M5 12h14'],
    square: ['M6 6h12v12H6z', 'M9.2 9.2h5.6v5.6H9.2z'],
  };

  const ICONS = {
    sprout: [
      'M12 21V11',
      'M12 14c-2.6-.5-4.6-2.8-4.8-5.6 2.5.2 4.4 1.6 4.8 5.6z',
      'M12 12.5c2.2-.7 4.6-2.4 5.6-5.2-2.4.3-4.6 1.8-5.6 5.2z',
    ],
    pencil: [
      'M13.2 6.2l4.6 4.6',
      'M4.2 19.8l1.1-4.4L15.4 5.3a1.7 1.7 0 012.4 0l1 1a1.7 1.7 0 010 2.4L8.6 18.8l-4.4 1z',
    ],
    cube: [
      'M12 3.2l7.5 4.2v9.1L12 20.8l-7.5-4.3V7.4L12 3.2z',
      'M12 12.2l7.5-4.2',
      'M12 12.2v8.6',
      'M12 12.2L4.5 8',
    ],
    star: [
      'M12 3.4l2.15 4.55 5 .7-3.65 3.45.9 4.95L12 14.9l-4.4 2.15.9-4.95L4.85 8.65l5-.7L12 3.4z',
    ],
    dot: [],
  };

  const data = window.SITE_DATA;
  const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let locale = 'pt-BR';
  let skillFrame = 0;
  let skillStage = null;
  let skillPath = null;
  let skillLength = 0;
  let skillDepth = [];
  let skillStartedAt = 0;
  let galaxy = null;
  let modalOpen = false;
  let locked = [];
  let previousHtmlOverflow = '';
  let previousBodyOverflow = '';

  const transcript = [{ role: 'assistant', demo: true }];

  function prefersReduced() {
    return motionQuery.matches;
  }

  function t(path) {
    const parts = path.split('.');
    const read = (pack) => {
      let node = pack;
      for (const part of parts) {
        if (!node || typeof node !== 'object') return undefined;
        node = node[part];
      }
      return typeof node === 'string' ? node : undefined;
    };
    const packs = data && data.copy ? data.copy : {};
    return read(packs[locale]) || read(packs['pt-BR']) || path;
  }

  function localized(value) {
    if (typeof value === 'string') return value;
    if (!value || typeof value !== 'object') return '';
    const primary = value[locale];
    if (typeof primary === 'string' && primary.trim()) return primary;
    const fallback = value['pt-BR'];
    return typeof fallback === 'string' ? fallback : '';
  }

  function localeTag() {
    return locale === 'en' ? 'en' : 'pt-BR';
  }

  function svgIcon(paths, className) {
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.setAttribute('aria-hidden', 'true');
    svg.setAttribute('class', className || 'glyph');
    if (paths.length === 0) {
      const circle = document.createElementNS(SVG_NS, 'circle');
      circle.setAttribute('cx', '12');
      circle.setAttribute('cy', '12');
      circle.setAttribute('r', '3.2');
      circle.setAttribute('fill', 'currentColor');
      svg.append(circle);
      return svg;
    }
    svg.setAttribute('fill', 'none');
    svg.setAttribute('stroke', 'currentColor');
    svg.setAttribute('stroke-width', '1.6');
    svg.setAttribute('stroke-linecap', 'round');
    svg.setAttribute('stroke-linejoin', 'round');
    paths.forEach((d) => {
      const path = document.createElementNS(SVG_NS, 'path');
      path.setAttribute('d', d);
      svg.append(path);
    });
    return svg;
  }

  function clear(node) {
    if (node) node.replaceChildren();
  }

  function show(node, visible) {
    if (!node) return;
    node.hidden = !visible;
  }

  function safeAsset(src) {
    const value = String(src || '').trim();
    if (!value || /:|\\/.test(value) || value.startsWith('//')) return '';
    if (
      value.startsWith('assets/') ||
      value.startsWith('./') ||
      value.startsWith('../') ||
      value.startsWith('/')
    ) {
      return value;
    }
    return '';
  }

  function safeHref(href) {
    const value = String(href || '').trim();
    if (/^https?:\/\//i.test(value)) return { href: value, external: true };
    if (
      value.startsWith('/') ||
      value.startsWith('./') ||
      value.startsWith('assets/')
    ) {
      return { href: value, external: false };
    }
    return null;
  }

  function safeEmail(value) {
    const email = String(value || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '';
    return email;
  }

  function fillCopy() {
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const key = node.getAttribute('data-i18n');
      let value = t(key);
      if (value.includes('{locale}'))
        value = value.replaceAll('{locale}', localeTag());
      node.textContent = value;
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
      node.setAttribute('aria-label', t(node.getAttribute('data-i18n-aria')));
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      node.setAttribute(
        'placeholder',
        t(node.getAttribute('data-i18n-placeholder')),
      );
    });
    const input = document.getElementById('chat-input');
    if (input) input.placeholder = t('chat.placeholder');
    document.title = t('meta.title');
    document.documentElement.lang = localeTag();
    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', t('meta.description'));
    const hint = document.getElementById('galaxy-hint');
    if (hint)
      hint.textContent = t(
        prefersReduced() ? 'about.reducedHint' : 'about.hint',
      );
  }

  function renderIdentity() {
    const person = data.person || {};
    const name = String(person.displayName || '').trim();
    const brand = document.getElementById('brand-label');
    const heroName = document.getElementById('hero-name');
    const footerName = document.getElementById('footer-name');
    if (brand) brand.textContent = name || t('shell.brand');
    if (heroName) {
      clear(heroName);
      if (name) {
        heroName.textContent = name;
        heroName.classList.remove('is-placeholder');
      } else {
        const hidden = document.createElement('span');
        hidden.className = 'sr-only';
        hidden.textContent = `${t('hero.nameMissing')} `;
        heroName.append(
          hidden,
          document.createTextNode(t('hero.namePlaceholder')),
        );
        heroName.classList.add('is-placeholder');
      }
    }
    if (footerName) {
      footerName.textContent = name || t('footer.namePlaceholder');
      footerName.classList.toggle('is-placeholder', !name);
    }

    const slot = document.getElementById('avatar-slot');
    if (slot) {
      clear(slot);
      const src = safeAsset(person.avatarSrc);
      const alt =
        String(person.avatarAlt || '').trim() || name || t('hero.avatarEmpty');
      if (src) {
        const image = document.createElement('img');
        image.src = src;
        image.alt = alt;
        slot.append(image);
        slot.classList.remove('is-empty');
        slot.removeAttribute('role');
        slot.removeAttribute('aria-label');
      } else {
        slot.classList.add('is-empty');
        slot.setAttribute('role', 'img');
        slot.setAttribute('aria-label', t('hero.avatarEmpty'));
      }
    }

    const role = document.getElementById('about-role');
    const place = document.getElementById('about-place');
    const shortTitle = String(person.shortTitle || '').trim();
    const location = String(person.locationLabel || '').trim();
    if (role) {
      role.textContent = shortTitle;
      show(role, Boolean(shortTitle));
    }
    if (place) {
      place.textContent = location;
      show(place, Boolean(location));
    }

    const bio = document.getElementById('about-bio');
    const bioText = localized(person.bio).trim();
    if (bio) {
      bio.textContent = bioText || t('about.bioPlaceholder');
      bio.classList.toggle('placeholder-callout', !bioText);
      bio.classList.toggle('bio', Boolean(bioText));
    }
  }

  function renderInterests() {
    const list = document.getElementById('interest-list');
    const label = document.getElementById('interests-label');
    const interests = Array.isArray(data.person && data.person.interests)
      ? data.person.interests
      : [];
    const chips = interests
      .map((interest) => ({
        id: interest.id,
        label: localized(interest.label).trim(),
        placeholder: interest.placeholder === true,
      }))
      .filter((interest) => interest.label);
    const usingPlaceholders =
      chips.length === 0 || chips.every((chip) => chip.placeholder);
    if (label) {
      label.textContent = t(
        usingPlaceholders
          ? 'about.interestsPlaceholderLabel'
          : 'about.interestsLabel',
      );
    }
    if (!list) return;
    clear(list);
    const source =
      chips.length > 0
        ? chips
        : [1, 2, 3].map((n) => ({
            id: `interest-${n}`,
            label: `[${locale === 'en' ? 'Interest' : 'Interesse'} ${n}]`,
            placeholder: true,
          }));
    source.forEach((chip) => {
      const item = document.createElement('li');
      const pill = document.createElement('span');
      pill.className = 'interest-chip';
      if (chip.placeholder) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = t('about.placeholderBadge');
        pill.append(badge);
      }
      pill.append(document.createTextNode(chip.label));
      item.append(pill);
      list.append(item);
    });
  }

  function skillPads(width) {
    if (width < 640) {
      return {
        x: 86,
        y: 34,
        height: Math.round(Math.min(250, Math.max(200, width * 0.62))),
      };
    }
    return {
      x: 118,
      y: 42,
      height: Math.round(Math.min(380, Math.max(270, width * 0.4))),
    };
  }

  function unitPoint(progress) {
    return [
      Math.cos(progress),
      Math.sin(progress) + 0.34 * Math.sin(2 * progress),
    ];
  }

  function fitPoints(points, width, height, padX, padY) {
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    points.forEach(([x, y]) => {
      minX = Math.min(minX, x);
      maxX = Math.max(maxX, x);
      minY = Math.min(minY, y);
      maxY = Math.max(maxY, y);
    });
    const spanX = Math.max(0.001, maxX - minX);
    const spanY = Math.max(0.001, maxY - minY);
    const innerW = Math.max(1, width - padX * 2);
    const innerH = Math.max(1, height - padY * 2);
    return points.map(([x, y]) => [
      padX + ((x - minX) / spanX) * innerW,
      padY + ((y - minY) / spanY) * innerH,
    ]);
  }

  function closedSmoothPath(points) {
    const count = points.length;
    const n = (value) => value.toFixed(2);
    let path = `M ${n(points[0][0])} ${n(points[0][1])}`;
    for (let index = 0; index < count; index += 1) {
      const p0 = points[(index - 1 + count) % count];
      const p1 = points[index];
      const p2 = points[(index + 1) % count];
      const p3 = points[(index + 2) % count];
      const c1x = p1[0] + (p2[0] - p0[0]) / 6;
      const c1y = p1[1] + (p2[1] - p0[1]) / 6;
      const c2x = p2[0] - (p3[0] - p1[0]) / 6;
      const c2y = p2[1] - (p3[1] - p1[1]) / 6;
      path += ` C ${n(c1x)} ${n(c1y)} ${n(c2x)} ${n(c2y)} ${n(p2[0])} ${n(p2[1])}`;
    }
    return path;
  }

  function skillsArcPath(width, height, padX, padY) {
    const raw = [];
    for (let index = 0; index < 72; index += 1) {
      raw.push(unitPoint((index / 72) * Math.PI * 2));
    }
    return closedSmoothPath(fitPoints(raw, width, height, padX, padY));
  }

  function stopSkillLoop() {
    if (skillFrame) window.cancelAnimationFrame(skillFrame);
    skillFrame = 0;
  }

  function depthAt(progress) {
    if (skillDepth.length === 0) return 0.5;
    const steps = skillDepth.length - 1;
    const cursor = progress * steps;
    const left = Math.floor(cursor) % steps;
    const right = (left + 1) % steps;
    const mix = cursor - Math.floor(cursor);
    return skillDepth[left] * (1 - mix) + skillDepth[right] * mix;
  }

  function skillFrameTick(now) {
    if (!skillPath || prefersReduced()) return;
    if (!skillStartedAt) skillStartedAt = now;
    const base = ((now - skillStartedAt) % LOOP_MS) / LOOP_MS;
    const riders = skillStage
      ? skillStage.querySelectorAll('.skill-rider')
      : [];
    const count = riders.length || 1;
    riders.forEach((rider, index) => {
      const progress = (base + index / count) % 1;
      const point = skillPath.getPointAtLength(progress * skillLength);
      const near = depthAt(progress);
      const scale = 0.72 + 0.28 * near;
      rider.style.transform = `translate3d(${point.x}px, ${point.y}px, 0) translate(-50%, -50%) scale(${scale})`;
      rider.style.opacity = String(0.48 + 0.52 * near);
      rider.style.zIndex = String(Math.round(1 + near * 12));
    });
    skillFrame = window.requestAnimationFrame(skillFrameTick);
  }

  function measureSkill() {
    stopSkillLoop();
    if (!skillStage || prefersReduced()) return;
    const width = skillStage.clientWidth;
    if (width < 16) return;
    const pads = skillPads(width);
    skillStage.style.height = `${pads.height}px`;
    const d = skillsArcPath(width, pads.height, pads.x, pads.y);
    const paths = skillStage.querySelectorAll('path');
    paths.forEach((path) => path.setAttribute('d', d));
    skillPath = paths[0] || null;
    if (!skillPath) return;
    skillLength = skillPath.getTotalLength();
    const samples = 24;
    const ys = [];
    for (let index = 0; index <= samples; index += 1) {
      ys.push(skillPath.getPointAtLength((index / samples) * skillLength).y);
    }
    const min = Math.min(...ys);
    const max = Math.max(...ys);
    const span = Math.max(1, max - min);
    skillDepth = ys.map((y) => (y - min) / span);
    skillStartedAt = 0;
    skillFrame = window.requestAnimationFrame(skillFrameTick);
  }

  function skillPill(skill) {
    const pill = document.createElement('div');
    pill.className = 'skill-pill';
    pill.append(svgIcon(GLYPHS[skill.glyph] || GLYPHS.ring, 'glyph'));
    const label = document.createElement('span');
    label.textContent = skill.name;
    pill.append(label);
    return pill;
  }

  function renderSkills() {
    const mount = document.getElementById('skills-mount');
    const skills = (Array.isArray(data.skills) ? data.skills : []).filter(
      (skill) => String(skill.name || '').trim(),
    );
    show(document.getElementById('skills-empty'), skills.length === 0);
    show(
      document.getElementById('skills-note'),
      skills.some((skill) => skill.placeholder === true),
    );
    if (!mount) return;
    clear(mount);
    stopSkillLoop();
    skillStage = null;
    skillPath = null;
    if (skills.length === 0) return;

    const stage = document.createElement('div');
    stage.className = 'skill-stage';
    const glow = document.createElement('div');
    glow.className = 'skill-glow';
    glow.setAttribute('aria-hidden', 'true');
    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'skill-svg');
    svg.setAttribute('aria-hidden', 'true');
    const wide = document.createElementNS(SVG_NS, 'path');
    wide.setAttribute('fill', 'none');
    wide.setAttribute('stroke', 'rgb(62 224 197 / 0.22)');
    wide.setAttribute('stroke-width', '14');
    wide.setAttribute('stroke-linecap', 'round');
    const thin = document.createElementNS(SVG_NS, 'path');
    thin.setAttribute('fill', 'none');
    thin.setAttribute('stroke', 'rgb(245 243 251 / 0.42)');
    thin.setAttribute('stroke-width', '1.25');
    thin.setAttribute('stroke-linecap', 'round');
    svg.append(wide, thin);
    const riders = document.createElement('ul');
    riders.className = 'skill-riders';
    riders.setAttribute('aria-label', t('skills.trackLabel'));
    const fallback = document.createElement('ul');
    fallback.className = 'skill-fallback';
    fallback.setAttribute('aria-label', t('skills.trackLabel'));
    skills.forEach((skill) => {
      const name = String(skill.name).trim();
      const rider = document.createElement('li');
      rider.className = 'skill-rider';
      rider.append(skillPill({ name, glyph: skill.glyph }));
      riders.append(rider);
      const item = document.createElement('li');
      item.append(skillPill({ name, glyph: skill.glyph }));
      fallback.append(item);
    });
    stage.append(glow, svg, riders);
    mount.append(stage, fallback);
    skillStage = stage;
    window.requestAnimationFrame(measureSkill);
  }

  function renderProjects() {
    const list = document.getElementById('project-list');
    const projects = Array.isArray(data.projects) ? data.projects : [];
    show(document.getElementById('projects-empty'), projects.length === 0);
    show(
      document.getElementById('projects-note'),
      projects.some((project) => project.placeholder === true),
    );
    if (!list) return;
    clear(list);
    show(list, projects.length > 0);
    if (projects.length === 0) return;
    projects.forEach((project, index) => {
      const item = document.createElement('li');
      const card = document.createElement('article');
      card.className = 'project-card';
      const titleId = `project-${project.id || index}-title`;
      card.setAttribute('aria-labelledby', titleId);
      const shot = document.createElement('div');
      shot.className = 'shot';
      const src = safeAsset(project.screenshot);
      if (src) {
        const image = document.createElement('img');
        image.src = src;
        image.alt =
          localized(project.screenshotAlt) || t('projects.screenshotMissing');
        image.width = 1200;
        image.height = 750;
        shot.append(image);
      } else {
        const empty = document.createElement('div');
        empty.className = 'shot-empty';
        empty.textContent = t('projects.screenshotMissing');
        shot.append(empty);
      }
      const copy = document.createElement('div');
      copy.className = 'project-copy';
      const meta = document.createElement('p');
      meta.className = 'project-meta';
      meta.textContent = String(index + 1).padStart(2, '0');
      if (project.placeholder === true) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = t('projects.placeholderBadge');
        meta.append(badge);
      }
      const title = document.createElement('h3');
      title.id = titleId;
      title.textContent = localized(project.title);
      const summary = document.createElement('p');
      summary.textContent = localized(project.summary);
      copy.append(meta, title, summary);
      const tags = Array.isArray(project.tags)
        ? project.tags.filter(Boolean)
        : [];
      if (tags.length > 0) {
        const tagList = document.createElement('ul');
        tagList.className = 'tag-list';
        tagList.setAttribute('aria-label', t('projects.tagsLabel'));
        tags.forEach((tag) => {
          const tagItem = document.createElement('li');
          tagItem.textContent = String(tag);
          tagList.append(tagItem);
        });
        copy.append(tagList);
      }
      const links = (Array.isArray(project.links) ? project.links : [])
        .map((link) => {
          const safe = safeHref(link && link.href);
          const label = localized(link && link.label).trim();
          if (!safe || !label) return null;
          return { ...safe, label };
        })
        .filter(Boolean);
      if (links.length > 0) {
        const linkList = document.createElement('ul');
        linkList.className = 'link-list';
        linkList.setAttribute('aria-label', t('projects.linksLabel'));
        links.forEach((link) => {
          const linkItem = document.createElement('li');
          const anchor = document.createElement('a');
          anchor.className = 'text-link';
          anchor.href = link.href;
          anchor.textContent = link.label;
          if (link.external) {
            anchor.target = '_blank';
            anchor.rel = 'noopener noreferrer';
            const note = document.createElement('span');
            note.className = 'sr-only';
            note.textContent = ` (${t('projects.newTab')})`;
            anchor.append(note);
          }
          linkItem.append(anchor);
          linkList.append(linkItem);
        });
        copy.append(linkList);
      }
      card.append(shot, copy);
      item.append(card);
      list.append(item);
    });
  }

  function journeyPoints(count) {
    const x0 = 15;
    const x1 = 85;
    const yEnd = 88;
    const yPeak = 44;
    const controlY = 2 * yPeak - yEnd;
    return Array.from({ length: count }, (_, index) => {
      const progress = count === 1 ? 0.5 : index / (count - 1);
      const x = x0 + (x1 - x0) * progress;
      const y =
        yEnd * (1 - progress) ** 2 +
        2 * (1 - progress) * progress * controlY +
        progress ** 2 * yEnd;
      return { x, y };
    });
  }

  function renderJourney() {
    const list = document.getElementById('journey-list');
    const stage = document.getElementById('journey-stage');
    const items = Array.isArray(data.journey) ? data.journey : [];
    show(document.getElementById('journey-empty'), items.length === 0);
    show(
      document.getElementById('journey-note'),
      items.some((item) => item.placeholder === true),
    );
    show(stage, items.length > 0);
    if (stage)
      stage.classList.toggle(
        'has-arc',
        items.length > 0 && items.length <= ARC_LIMIT,
      );
    if (!list) return;
    clear(list);
    const points = journeyPoints(items.length);
    items.forEach((item, index) => {
      const entry = document.createElement('li');
      entry.className = 'journey-item';
      const point = points[index];
      if (point) {
        entry.style.setProperty('--jx', `${point.x}%`);
        entry.style.setProperty('--jy', `${point.y}%`);
      }
      const node = document.createElement('span');
      node.className = 'journey-node';
      node.setAttribute('aria-hidden', 'true');
      const nodeFace = document.createElement('span');
      nodeFace.append(svgIcon(ICONS[item.icon] || ICONS.dot, 'glyph'));
      node.append(nodeFace);
      const stem = document.createElement('span');
      stem.className = 'journey-stem';
      stem.setAttribute('aria-hidden', 'true');
      const card = document.createElement('article');
      card.className = 'milestone';
      const titleId = `journey-${item.id || index}-title`;
      card.setAttribute('aria-labelledby', titleId);
      if (item.placeholder === true) {
        const badge = document.createElement('p');
        badge.className = 'badge';
        badge.textContent = t('journey.placeholderBadge');
        card.append(badge);
      }
      const head = document.createElement('div');
      head.className = 'milestone-head';
      const date = document.createElement('p');
      date.className = 'milestone-date';
      date.textContent = String(item.dateLabel || '');
      const slash = document.createElement('span');
      slash.className = 'milestone-slash';
      slash.setAttribute('aria-hidden', 'true');
      const dot = document.createElement('span');
      dot.className = 'milestone-dot';
      dot.setAttribute('aria-hidden', 'true');
      const title = document.createElement('h3');
      title.id = titleId;
      title.textContent = localized(item.title);
      head.append(date, slash, dot, title);
      const rule = document.createElement('span');
      rule.className = 'milestone-rule';
      rule.setAttribute('aria-hidden', 'true');
      card.append(head, rule);
      const description = localized(item.description).trim();
      if (description) {
        const body = document.createElement('p');
        body.textContent = description;
        card.append(body);
      }
      const pin = document.createElement('span');
      pin.className = 'milestone-pin';
      pin.setAttribute('aria-hidden', 'true');
      pin.append(svgIcon(ICONS[item.icon] || ICONS.dot, 'glyph'));
      card.append(pin);
      entry.append(node, stem, card);
      list.append(entry);
    });
  }

  function renderContact() {
    const emailSlot = document.getElementById('contact-email-slot');
    const linksSlot = document.getElementById('contact-links-slot');
    const person = data.person || {};
    const email = safeEmail(person.contactEmail);
    if (emailSlot) {
      clear(emailSlot);
      if (email) {
        const block = document.createElement('div');
        block.className = 'contact-links';
        const address = document.createElement('a');
        address.className = 'mail-link';
        address.href = `mailto:${email}`;
        address.textContent = email;
        const cta = document.createElement('a');
        cta.className = 'button-accent';
        cta.href = `mailto:${email}`;
        cta.textContent = t('contact.emailCta');
        block.append(address, cta);
        emailSlot.append(block);
      } else {
        const box = document.createElement('p');
        box.className = 'placeholder-box';
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = t('contact.placeholderBadge');
        box.append(
          badge,
          document.createTextNode(` ${t('contact.emailPlaceholder')}`),
        );
        emailSlot.append(box);
      }
    }
    if (!linksSlot) return;
    clear(linksSlot);
    const links = (Array.isArray(person.socials) ? person.socials : [])
      .map((social, index) => {
        const safe = safeHref(social && social.href);
        const label = String((social && social.label) || '').trim();
        if (!safe || !label) return null;
        return { ...safe, label, id: (social && social.id) || `${index}` };
      })
      .filter(Boolean);
    if (links.length === 0) {
      const box = document.createElement('p');
      box.className = 'placeholder-box';
      const badge = document.createElement('span');
      badge.className = 'badge';
      badge.textContent = t('contact.placeholderBadge');
      box.append(
        badge,
        document.createTextNode(` ${t('contact.socialsPlaceholder')}`),
      );
      linksSlot.append(box);
      return;
    }
    const list = document.createElement('ul');
    list.className = 'contact-links';
    links.forEach((link) => {
      const item = document.createElement('li');
      const anchor = document.createElement('a');
      anchor.className = 'social-link';
      anchor.href = link.href;
      anchor.textContent = link.label;
      if (link.external) {
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        const note = document.createElement('span');
        note.className = 'sr-only';
        note.textContent = ` (${t('contact.newTab')})`;
        anchor.append(note);
      }
      item.append(anchor);
      list.append(item);
    });
    linksSlot.append(list);
  }

  function renderTranscript() {
    const log = document.getElementById('chat-log');
    if (!log) return;
    clear(log);
    transcript.forEach((message) => {
      const mine = message.role === 'user';
      const bubble = document.createElement('div');
      bubble.className = mine ? 'bubble is-user' : 'bubble is-assistant';
      const who = document.createElement('span');
      who.className = 'sr-only';
      who.textContent = `${mine ? t('chat.you') : t('chat.assistant')} `;
      bubble.append(who);
      if (!mine && message.demo) {
        const badge = document.createElement('span');
        badge.className = 'badge';
        badge.textContent = t('chat.demoBadge');
        bubble.append(badge);
      }
      const text = document.createElement('p');
      if (mine) {
        const chip = (data.chatChips || []).find(
          (item) => item.id === message.chipId,
        );
        text.textContent = chip ? localized(chip.prompt) : '';
      } else {
        text.textContent = localized(data.chatDemo);
      }
      bubble.append(text);
      log.append(bubble);
    });
    log.scrollTop = log.scrollHeight;
  }

  function renderChips() {
    const root = document.getElementById('chat-chips');
    if (!root) return;
    clear(root);
    (data.chatChips || []).forEach((chip) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'chip';
      button.dataset.chip = chip.id;
      button.textContent = localized(chip.label);
      root.append(button);
    });
  }

  function syncMenuLabel() {
    const button = document.getElementById('menu-button');
    const label = document.getElementById('menu-label');
    const openIcon = document.getElementById('menu-icon-open');
    const closeIcon = document.getElementById('menu-icon-close');
    if (!button || !label) return;
    const open = button.getAttribute('aria-expanded') === 'true';
    label.textContent = t(open ? 'shell.menuClose' : 'shell.menuOpen');
    if (openIcon) openIcon.hidden = open;
    if (closeIcon) closeIcon.hidden = !open;
  }

  function syncLocaleButtons() {
    document.querySelectorAll('[data-locale]').forEach((button) => {
      button.setAttribute(
        'aria-pressed',
        button.getAttribute('data-locale') === locale ? 'true' : 'false',
      );
    });
  }

  function setActive(id) {
    document.querySelectorAll('[data-section]').forEach((link) => {
      if (link.getAttribute('data-section') === id)
        link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  function applyLocale(next) {
    locale = next === 'en' ? 'en' : 'pt-BR';
    fillCopy();
    renderIdentity();
    renderInterests();
    renderSkills();
    renderProjects();
    renderJourney();
    renderContact();
    renderTranscript();
    renderChips();
    syncMenuLabel();
    syncLocaleButtons();
  }

  function closeMenu() {
    const button = document.getElementById('menu-button');
    const menu = document.getElementById('mobile-nav');
    if (!button || !menu) return;
    button.setAttribute('aria-expanded', 'false');
    menu.hidden = true;
    syncMenuLabel();
  }

  function openMenu() {
    const button = document.getElementById('menu-button');
    const menu = document.getElementById('mobile-nav');
    if (!button || !menu) return;
    button.setAttribute('aria-expanded', 'true');
    menu.hidden = false;
    syncMenuLabel();
  }

  function focusable(root) {
    return Array.from(
      root.querySelectorAll(
        'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ),
    ).filter(
      (node) =>
        !node.hasAttribute('disabled') &&
        node.getAttribute('aria-hidden') !== 'true',
    );
  }

  function ensureGalaxy() {
    if (galaxy) return galaxy;
    const canvas = document.getElementById('galaxy-canvas');
    if (!canvas || typeof window.mountGalaxy !== 'function') return null;
    galaxy = window.mountGalaxy(canvas);
    return galaxy;
  }

  function syncGalaxyMode() {
    const root = document.getElementById('galaxy-root');
    const hint = document.getElementById('galaxy-hint');
    const reduced = prefersReduced();
    if (root) root.classList.toggle('is-reduced', reduced);
    if (hint && modalOpen)
      hint.textContent = t(reduced ? 'about.reducedHint' : 'about.hint');
    if (!modalOpen) return;
    if (reduced) {
      if (galaxy) galaxy.stop();
      return;
    }
    const scene = ensureGalaxy();
    if (!scene) {
      if (root) root.classList.add('is-reduced');
      return;
    }
    scene.resize();
    scene.start();
  }

  function closeModal() {
    if (!modalOpen) return;
    modalOpen = false;
    const root = document.getElementById('galaxy-root');
    const trigger = document.getElementById('galaxy-open');
    if (root) root.hidden = true;
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
    if (galaxy) galaxy.stop();
    document.documentElement.style.overflow = previousHtmlOverflow;
    document.body.style.overflow = previousBodyOverflow;
    locked.forEach((node) => node.removeAttribute('inert'));
    locked = [];
    if (trigger) trigger.focus();
  }

  function openModal() {
    const root = document.getElementById('galaxy-root');
    const panel = document.getElementById('galaxy-panel');
    const trigger = document.getElementById('galaxy-open');
    if (!root || !panel || modalOpen) return;
    closeMenu();
    modalOpen = true;
    previousHtmlOverflow = document.documentElement.style.overflow;
    previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    locked = [];
    Array.from(document.body.children).forEach((child) => {
      if (child === root || child.contains(root) || child.hasAttribute('inert'))
        return;
      child.setAttribute('inert', '');
      locked.push(child);
    });
    root.hidden = false;
    if (trigger) trigger.setAttribute('aria-expanded', 'true');
    syncGalaxyMode();
    const closeButton = panel.querySelector('[data-close-modal]');
    if (closeButton) closeButton.focus();
    else panel.focus();
  }

  function onKeyDown(event) {
    if (
      modalOpen &&
      (event.key === 'ArrowLeft' ||
        event.key === 'ArrowRight' ||
        event.key === 'ArrowUp' ||
        event.key === 'ArrowDown')
    ) {
      if (!prefersReduced() && galaxy) {
        event.preventDefault();
        const step = 0.08;
        if (event.key === 'ArrowLeft') galaxy.nudge(-step, 0);
        if (event.key === 'ArrowRight') galaxy.nudge(step, 0);
        if (event.key === 'ArrowUp') galaxy.nudge(0, -step);
        if (event.key === 'ArrowDown') galaxy.nudge(0, step);
      }
      return;
    }
    if (event.key !== 'Escape' && event.key !== 'Tab') return;
    if (event.key === 'Escape') {
      if (modalOpen) {
        event.preventDefault();
        closeModal();
        return;
      }
      const button = document.getElementById('menu-button');
      if (button && button.getAttribute('aria-expanded') === 'true')
        closeMenu();
      return;
    }
    if (!modalOpen || event.key !== 'Tab') return;
    const panel = document.getElementById('galaxy-panel');
    if (!panel) return;
    const items = focusable(panel);
    if (items.length === 0) {
      event.preventDefault();
      panel.focus();
      return;
    }
    const first = items[0];
    const last = items[items.length - 1];
    const active = document.activeElement;
    const inside = active instanceof Node && panel.contains(active);
    if (event.shiftKey && (!inside || active === first)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (!inside || active === last)) {
      event.preventDefault();
      first.focus();
    }
  }

  function inView(node) {
    const rect = node.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.92 && rect.bottom > 40;
  }

  function setupReveal() {
    const nodes = Array.from(document.querySelectorAll('.reveal'));
    if (prefersReduced()) return;
    nodes.forEach((node) => node.classList.add('reveal-wait'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.remove('reveal-wait');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        nodes.forEach((node) => {
          if (inView(node)) node.classList.remove('reveal-wait');
          else observer.observe(node);
        });
      });
    });
  }

  function setupNav() {
    const ratios = new Map();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            ratios.set(entry.target.id, entry.intersectionRatio);
          else ratios.delete(entry.target.id);
        });
        let best = null;
        let bestRatio = -1;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        });
        if (best) setActive(best);
      },
      { rootMargin: '-30% 0px -45% 0px', threshold: [0.15, 0.4, 0.7] },
    );
    SECTIONS.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    setActive('hero');
  }

  function init() {
    if (!data || !data.copy) {
      document.body.classList.add('is-ready');
      return;
    }
    const initial = data.localeDefault === 'en' ? 'en' : 'pt-BR';
    applyLocale(initial);
    const year = document.getElementById('footer-year');
    if (year) year.textContent = String(new Date().getFullYear());

    document.querySelectorAll('[data-locale]').forEach((button) => {
      button.addEventListener('click', () => {
        applyLocale(button.getAttribute('data-locale'));
      });
    });

    const menuButton = document.getElementById('menu-button');
    const mobileNav = document.getElementById('mobile-nav');
    if (menuButton) {
      menuButton.addEventListener('click', () => {
        const open = menuButton.getAttribute('aria-expanded') === 'true';
        if (open) closeMenu();
        else openMenu();
      });
    }
    if (mobileNav) {
      mobileNav.addEventListener('click', (event) => {
        if (event.target.closest('a[href^="#"]')) closeMenu();
      });
    }
    const desktopQuery = window.matchMedia('(min-width: 64rem)');
    desktopQuery.addEventListener('change', () => {
      if (desktopQuery.matches) closeMenu();
    });

    const chips = document.getElementById('chat-chips');
    if (chips) {
      chips.addEventListener('click', (event) => {
        const button = event.target.closest('[data-chip]');
        if (!button) return;
        transcript.push({ role: 'user', chipId: button.dataset.chip });
        transcript.push({ role: 'assistant', demo: true });
        if (transcript.length > 24)
          transcript.splice(0, transcript.length - 24);
        renderTranscript();
      });
    }
    const form = document.getElementById('chat-form');
    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
      });
    }

    const openButton = document.getElementById('galaxy-open');
    const modal = document.getElementById('galaxy-root');
    if (openButton) openButton.addEventListener('click', openModal);
    if (modal) {
      modal.addEventListener('click', (event) => {
        if (event.target.closest('[data-close-modal]')) closeModal();
      });
    }
    document.addEventListener('keydown', onKeyDown);

    let resizeTick = 0;
    window.addEventListener('resize', () => {
      window.cancelAnimationFrame(resizeTick);
      resizeTick = window.requestAnimationFrame(measureSkill);
    });
    motionQuery.addEventListener('change', () => {
      if (prefersReduced()) {
        document
          .querySelectorAll('.reveal-wait')
          .forEach((node) => node.classList.remove('reveal-wait'));
        stopSkillLoop();
      } else {
        measureSkill();
      }
      const hint = document.getElementById('galaxy-hint');
      if (hint)
        hint.textContent = t(
          prefersReduced() ? 'about.reducedHint' : 'about.hint',
        );
      if (modalOpen) syncGalaxyMode();
    });

    setupNav();
    setupReveal();
    document.body.classList.add('is-ready');
  }

  init();
})();
