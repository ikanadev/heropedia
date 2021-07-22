const urls = {
  heroList: './heroList.json',
  heroDetails: (id) => `./heroes/${id}.json`
};

const data = {
  heroVideo: '',
  heroData: {
    name: '',
    name_loc: '',
    bio_loc: '',
    npe_desc_loc: '',
    str_base: 0,
    agi_base: 0,
    int_base: 0,
    damage_min: 0,
    damage_max: 0,
    attack_range: 0,
    armor: 0,
    movement_speed: 0,
    max_health: 0,
    max_mana: 0,
    abilities: [],
  },
  heroList: [],
};

// UTILITY FUNCTIONS
const getName = (name) => name.substr(14);
const writeInElement = (selector, content) => {
  const el = document.querySelector(selector)
  if (el) {
    el.innerHTML = content;
  }
}
const getAbilityUrl = (name) =>
  `https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${name}.png`;
const getVideoUrl = (name) =>
  `https://cdn.cloudflare.steamstatic.com/apps/dota2/videos/dota_react/heroes/renders/${name}.webm`;

const fetchHeroData = async (id) => {
  const resp = await fetch(urls.heroDetails(id));
  if (!resp.ok) {
    return;
  }
  const respData = await resp.json();
  data.heroData = respData.result.data.heroes[0];
  data.heroVideo = getVideoUrl(getName(data.heroData.name));
};

const renderHeroData = () => {
  const {heroData} = data;
  writeInElement('.hero-title', heroData.name_loc);
  writeInElement('.hero-bio', heroData.bio_loc);
  writeInElement('.hero-skill', heroData.npe_desc_loc);
  writeInElement('#hero-str', heroData.str_base);
  writeInElement('#hero-agi', heroData.agi_base);
  writeInElement('#hero-int', heroData.int_base);
  writeInElement(
    '#hero-attack',
    `${heroData.damage_min} - ${heroData.damage_max}`
  );
  writeInElement('#hero-range', heroData.attack_range);
  writeInElement('#hero-armor', heroData.armor);
  writeInElement('#hero-speed', heroData.movement_speed);
  writeInElement('#hero-health', heroData.max_health);
  writeInElement('#hero-mana', heroData.max_mana);
};

const renderHeroAbilities = () => {
  const {abilities} = data.heroData;
  const arrayAbilities = abilities.map((ability) => `
    <div class="skill-cont">
      <div class="skill-image-cont">
        <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/abilities/${ability.name}.png" />
      </div>
      <div class="skill-info-cont">
        <h3>${ability.name_loc}</h3>
        <p>${ability.desc_loc}</p>
      </div>
    </div>
  `);
  const content = arrayAbilities.join('');
  writeInElement('.skills', content);
};

const changeVideoUrl = () => {
  const video = document.querySelector('.hero-video video');
  video.setAttribute('src', data.heroVideo);
};

const fetchHeroList = async () => {
  const resp = await fetch(urls.heroList);
  if (!resp.ok) {
    return;
  }
  const respData = await resp.json();
  data.heroList = respData.result.data.heroes;
};

const handleHeroClick = async (el) => {
  console.log(el.dataset.heroId);
  if (!el.dataset.heroId) return;
  await fetchHeroData(el.dataset.heroId);
  renderHeroData();
  renderHeroAbilities();
  changeVideoUrl();
  document.documentElement.scrollTop = 0;
};

const renderHeroList = () => {
  const {heroList} = data;
  const htmlContent = heroList.map((hero) => `
    <div class="hero-item" onclick="handleHeroClick(this)" data-hero-id="${hero.id}">
      <h5>${hero.name_loc}</h5>
      <img src="https://cdn.cloudflare.steamstatic.com/apps/dota2/images/dota_react/heroes/${getName(hero.name)}.png" />
    </div>
  `).join('');
  writeInElement('.hero-list', htmlContent);
};

const main = async () => {
  await fetchHeroList();
  renderHeroList();
};

main();