const TEAM_AUTO_LOGO_SOURCES = [
  {
    names: ["arsenal", "arsenal fc"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t3.png",
  },
  {
    names: ["aston villa", "aston villa fc"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t7.png",
  },
  {
    names: ["afc bournemouth", "bournemouth"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t91.png",
  },
  {
    names: ["brentford", "brentford fc"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t94.png",
  },
  {
    names: ["brighton and hove albion", "brighton", "brighton hove albion"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t36.png",
  },
  {
    names: ["burnley", "burnley fc"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t90.png",
  },
  {
    names: ["chelsea", "chelsea fc"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t8.png",
  },
  {
    names: ["crystal palace", "crystal palace fc"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t31.png",
  },
  {
    names: ["everton", "everton fc"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t11.png",
  },
  {
    names: ["fulham", "fulham fc"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t54.png",
  },
  {
    names: ["liverpool", "liverpool fc"],
    source:
      "https://resources.premierleague.com/premierleague/badges/70/t14.png",
  },
  {
    names: ["luton town", "luton"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9d/Luton_Town_logo.svg/1200px-Luton_Town_logo.svg.png",
  },
  {
    names: ["manchester city", "man city", "manchester city fc"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t43.png",
  },
  {
    names: ["manchester united", "man united", "man utd"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t1.png",
  },
  {
    names: ["newcastle united", "newcastle"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t4.png",
  },
  {
    names: ["nottingham forest", "forest"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t17.png",
  },
  {
    names: ["sheffield united", "sheffield utd"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/Sheffield_United_FC_logo.svg/1200px-Sheffield_United_FC_logo.svg.png",
  },
  {
    names: ["tottenham hotspur", "tottenham", "spurs"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t6.png",
  },
  {
    names: ["west ham united", "west ham"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t21.png",
  },
  {
    names: ["wolverhampton wanderers", "wolves", "wolverhampton"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t39.png",
  },
  {
    names: ["bayern munich", "fc bayern", "bayern"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg/2048px-FC_Bayern_M%C3%BCnchen_logo_%282017%29.svg.png",
  },
  {
    names: ["borussia dortmund", "dortmund", "bvb"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Borussia_Dortmund_logo.svg/1200px-Borussia_Dortmund_logo.svg.png",
  },
  {
    names: ["rb leipzig", "leipzig"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/RB_Leipzig_2014_logo.svg/1200px-RB_Leipzig_2014_logo.svg.png",
  },
  {
    names: ["bayer leverkusen", "leverkusen"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Bayer_04_Leverkusen_logo.svg/1200px-Bayer_04_Leverkusen_logo.svg.png",
  },
  {
    names: ["union berlin"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/1._FC_Union_Berlin_Logo.svg/1200px-1._FC_Union_Berlin_Logo.svg.png",
  },
  {
    names: ["freiburg", "sc freiburg"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/SC_Freiburg_logo.svg/841px-SC_Freiburg_logo.svg.png",
  },
  {
    names: ["eintracht frankfurt", "frankfurt"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/125.png",
  },
  {
    names: ["vfl wolfsburg", "wolfsburg"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/ce/VfL_Wolfsburg_Logo.svg/1200px-VfL_Wolfsburg_Logo.svg.png",
  },
  {
    names: ["mainz 05", "mainz"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/8/83/Mainz_05_crest.svg/1200px-Mainz_05_crest.svg.png",
  },
  {
    names: ["borussia monchengladbach", "monchengladbach", "gladbach"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Borussia_M%C3%B6nchengladbach_logo.svg/250px-Borussia_M%C3%B6nchengladbach_logo.svg.png",
  },
  {
    names: ["fc koln", "1 fc koln", "koln", "cologne"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/1._FC_Koeln_Logo_2014%E2%80%93.svg/1054px-1._FC_Koeln_Logo_2014%E2%80%93.svg.png",
  },
  {
    names: ["hoffenheim", "tsg hoffenheim"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Logo_TSG_Hoffenheim.svg/1005px-Logo_TSG_Hoffenheim.svg.png",
  },
  {
    names: ["augsburg", "fc augsburg"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c5/FC_Augsburg_logo.svg/920px-FC_Augsburg_logo.svg.png",
  },
  {
    names: ["stuttgart", "vfb stuttgart"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/VfB_Stuttgart_1893_Logo.svg/1103px-VfB_Stuttgart_1893_Logo.svg.png",
  },
  {
    names: ["bochum", "vfl bochum"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/72/VfL_Bochum_logo.svg/1140px-VfL_Bochum_logo.svg.png",
  },
  {
    names: ["darmstadt", "sv darmstadt 98"],
    source: "https://upload.wikimedia.org/wikipedia/commons/3/3a/Darmstadt_98_football_club_new_logo_2015.png",
  },
  {
    names: ["heidenheim", "1 fc heidenheim"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/1._FC_Heidenheim_1846.svg/973px-1._FC_Heidenheim_1846.svg.png",
  },
  {
    names: ["werder bremen", "bremen"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/SV-Werder-Bremen-Logo.svg/798px-SV-Werder-Bremen-Logo.svg.png",
  },
  {
    names: ["barcelona", "fc barcelona", "barca"],
    source: "https://assets.laliga.com/assets/2019/06/07/small/barcelona.png",
  },
  {
    names: ["real madrid"],
    source: "https://assets.laliga.com/assets/2019/06/07/xsmall/real-madrid.png",
  },
  {
    names: ["atletico madrid", "atletico de madrid"],
    source: "https://assets.laliga.com/assets/2024/06/17/xsmall/cbc5c8cc8c3e8abd0e175c00ee53b723.png",
  },
  {
    names: ["real sociedad", "sociedad"],
    source: "https://assets.laliga.com/assets/2019/06/07/xsmall/real-sociedad.png",
  },
  {
    names: ["villarreal", "villarreal cf"],
    source: "https://assets.laliga.com/assets/2019/06/07/small/villarreal.png",
  },
  {
    names: ["real betis", "betis"],
    source: "https://assets.laliga.com/assets/2022/09/15/xsmall/e4a09419d3bd115b8f3dab73d480e146.png",
  },
  {
    names: ["elche", "elche cf"],
    source: "https://assets.laliga.com/assets/2019/06/07/small/elche.png",
  },
  {
    names: ["rcd espanyol", "espanyol"],
    source: "https://assets.laliga.com/assets/2025/07/02/xsmall/e9177f6edd72c6360602adbca85e442f.png",
  },
  {
    names: ["athletic club", "athletic bilbao", "bilbao"],
    source: "https://assets.laliga.com/assets/2019/06/07/xsmall/athletic.png",
  },
  {
    names: ["girona", "girona cf"],
    source: "https://assets.laliga.com/assets/2022/06/22/small/8f43addbb29e4a72f5e90b6edfe4728f.png",
  },
  {
    names: ["sevilla", "sevilla fc"],
    source: "https://assets.laliga.com/assets/2019/06/07/small/sevilla.png",
  },
  {
    names: ["valencia", "valencia cf"],
    source: "https://assets.laliga.com/assets/2019/06/07/small/valencia.png",
  },
  {
    names: ["osasuna"],
    source: "https://assets.laliga.com/assets/2019/06/07/small/osasuna.png",
  },
  {
    names: ["celta vigo", "celta"],
    source: "https://assets.laliga.com/assets/2025/07/11/xsmall/0a796827f9e758d7d750db805adde7c5.png",
  },
  {
    names: ["getafe", "getafe cf"],
    source: "https://assets.laliga.com/assets/2023/05/12/small/dc59645c96bc2c9010341c16dd6d4bfa.png",
  },
  {
    names: ["almeria"],
    source: "https://assets.laliga.com/assets/2019/06/07/small/almeria.png",
  },
  {
    names: ["cadiz", "cadiz cf"],
    source: "https://assets.laliga.com/assets/2019/06/07/xsmall/cadiz.png",
  },
  {
    names: ["granada", "granada cf"],
    source: "https://assets.laliga.com/assets/2023/01/17/small/f5db12f3a29fdfd14a0d50337016dc95.png",
  },
  {
    names: ["rayo vallecano", "rayo"],
    source: "https://assets.laliga.com/assets/2023/04/27/xsmall/57d9950a8745ead226c04d37235c0786.png",
  },
  {
    names: ["mallorca", "rcd mallorca"],
    source: "https://assets.laliga.com/assets/2023/03/22/xsmall/013ae97735bc8e519dcf30f6826168ca.png",
  },
  {
    names: ["las palmas"],
    source: "https://assets.laliga.com/assets/2019/06/07/small/las-palmas.png",
  },
  {
    names: ["alaves", "deportivo alaves", "d alaves"],
    source: "https://assets.laliga.com/assets/2020/09/01/small/27002754a98bf535807fe49a24cc63ea.png",
  },
  {
    names: ["levante", "levante ud"],
    source: "https://assets.laliga.com/assets/2019/06/07/small/levante.png",
  },
  {
    names: ["real oviedo", "oviedo"],
    source: "https://assets.laliga.com/assets/2019/06/07/xsmall/oviedo.png",
  },
  {
    names: ["ac milan", "milan"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d0/Logo_of_AC_Milan.svg/250px-Logo_of_AC_Milan.svg.png",
  },
  {
    names: ["inter milan", "inter", "internazionale"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/FC_Internazionale_Milano_2021.svg/1200px-FC_Internazionale_Milano_2021.svg.png",
  },
  {
    names: ["juventus"],
    source: "https://1000logos.net/wp-content/uploads/2021/05/Juventus-logo.png",
  },
  {
    names: ["napoli", "ssc napoli"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/114.png",
  },
  {
    names: ["roma", "as roma"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/104.png",
  },
  {
    names: ["lazio"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/S.S._Lazio_badge.svg/1200px-S.S._Lazio_badge.svg.png",
  },
  {
    names: ["atalanta"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/105.png",
  },
  {
    names: ["fiorentina"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg/1200px-ACF_Fiorentina_-_logo_%28Italy%2C_2022%29.svg.png",
  },
  {
    names: ["bologna"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/107.png",
  },
  {
    names: ["torino"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500/239.png",
  },
  {
    names: ["udinese"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/ce/Udinese_Calcio_logo.svg/1200px-Udinese_Calcio_logo.svg.png",
  },
  {
    names: ["sassuolo"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/US_Sassuolo_Calcio_logo.svg/1095px-US_Sassuolo_Calcio_logo.svg.png",
  },
  {
    names: ["genoa"],
    source: "https://upload.wikimedia.org/wikipedia/min/4/4e/Genoa_cfc.png",
  },
  {
    names: ["lecce"],
    source: "https://upload.wikimedia.org/wikipedia/it/thumb/3/36/US_Lecce_Stemma.svg/820px-US_Lecce_Stemma.svg.png",
  },
  {
    names: ["monza"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Logo_of_AC_Monza.png/500px-Logo_of_AC_Monza.png?20220615144419",
  },
  {
    names: ["empoli"],
    source: "https://upload.wikimedia.org/wikipedia/commons/9/94/Empoli_FC.png",
  },
  {
    names: ["cagliari"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/6/61/Cagliari_Calcio_1920.svg/992px-Cagliari_Calcio_1920.svg.png",
  },
  {
    names: ["hellas verona", "verona"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Hellas_Verona_FC_logo_%282020%29.svg/1176px-Hellas_Verona_FC_logo_%282020%29.svg.png",
  },
  {
    names: ["salernitana"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/US_Salernitana_1919_logo.svg/1200px-US_Salernitana_1919_logo.svg.png",
  },
  {
    names: ["frosinone"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Frosinone_Calcio_logo.svg/1056px-Frosinone_Calcio_logo.svg.png",
  },
  {
    names: ["paris saint germain", "psg"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a7/Paris_Saint-Germain_F.C..svg/1200px-Paris_Saint-Germain_F.C..svg.png",
  },
  {
    names: ["marseille", "olympique marseille", "om"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d8/Olympique_Marseille_logo.svg/927px-Olympique_Marseille_logo.svg.png",
  },
  {
    names: ["lyon", "olympique lyon", "olympique lyonnais", "ol"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/167.png",
  },
  {
    names: ["monaco", "as monaco"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/LogoASMonacoFC2021.svg/692px-LogoASMonacoFC2021.svg.png",
  },
  {
    names: ["lille", "losc lille"],
    source: "https://1000logos.net/wp-content/uploads/2020/09/Lille-Olympique-logo.png",
  },
  {
    names: ["nice", "ogc nice"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/2502.png",
  },
  {
    names: ["rennes", "stade rennais"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/Stade_Rennais_FC.svg/983px-Stade_Rennais_FC.svg.png",
  },
  {
    names: ["montpellier"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Montpellier_HSC_logo.svg/1200px-Montpellier_HSC_logo.svg.png",
  },
  {
    names: ["strasbourg"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Racing_Club_de_Strasbourg_logo.svg/1200px-Racing_Club_de_Strasbourg_logo.svg.png",
  },
  {
    names: ["reims"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3243.png",
  },
  {
    names: ["brest"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Stade_Brestois_29_logo.svg/990px-Stade_Brestois_29_logo.svg.png",
  },
  {
    names: ["toulouse"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Toulouse_FC_2018_logo.svg/1200px-Toulouse_FC_2018_logo.svg.png",
  },
  {
    names: ["nantes"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500-dark/165.png",
  },
  {
    names: ["lorient"],
    source: "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/273.png",
  },
  {
    names: ["metz"],
    source: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/FC_Metz_2021_Logo.svg/839px-FC_Metz_2021_Logo.svg.png",
  },
  {
    names: ["clermont", "clermont foot"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/Clermont_Foot_logo.svg/1015px-Clermont_Foot_logo.svg.png",
  },
  {
    names: ["lens"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/cc/RC_Lens_logo.svg/893px-RC_Lens_logo.svg.png",
  },
  {
    names: ["angers"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Angers_SCO_logo.svg/1006px-Angers_SCO_logo.svg.png",
  },
  {
    names: ["auxerre"],
    source: "https://a.espncdn.com/i/teamlogos/soccer/500/172.png",
  },
  // Belgian Pro League
  {
    names: ["club brugge", "club brugge kv"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Club_Brugge_KV_logo.svg/1200px-Club_Brugge_KV_logo.svg.png",
  },
  {
    names: ["anderlecht", "rsc anderlecht"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/RSC_Anderlecht_logo.svg/1200px-RSC_Anderlecht_logo.svg.png",
  },
  {
    names: ["union saint gilloise", "union sg"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/Royale_Union_Saint-Gilloise_logo.svg/1200px-Royale_Union_Saint-Gilloise_logo.svg.png",
  },
  {
    names: ["royal antwerp", "antwerp"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/82/Royal_Antwerp_FC_logo.svg/1200px-Royal_Antwerp_FC_logo.svg.png",
  },
  {
    names: ["krc genk", "genk"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/64/KRC_Genk_logo.svg/1200px-KRC_Genk_logo.svg.png",
  },
  {
    names: ["kaa gent", "gent"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/02/KAA_Gent_logo.svg/1200px-KAA_Gent_logo.svg.png",
  },
  {
    names: ["standard liege"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Standard_Li%C3%A8ge_logo.svg/1200px-Standard_Li%C3%A8ge_logo.svg.png",
  },
  {
    names: ["cercle brugge"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Cercle_Brugge_K.S.V._logo.svg/1200px-Cercle_Brugge_K.S.V._logo.svg.png",
  },
  {
    names: ["kv mechelen"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/49/KV_Mechelen_logo.svg/1200px-KV_Mechelen_logo.svg.png",
  },
  {
    names: ["oh leuven", "oud heverlee leuven"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Oud-Heverlee_Leuven_logo.svg/1200px-Oud-Heverlee_Leuven_logo.svg.png",
  },
  {
    names: ["westerlo", "kvc westerlo"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/K.V._Westerlo_logo.svg/1200px-K.V._Westerlo_logo.svg.png",
  },
  {
    names: ["charleroi", "sporting charleroi"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/38/Royal_Charleroi_Sporting_Club_logo.svg/1200px-Royal_Charleroi_Sporting_Club_logo.svg.png",
  },
  {
    names: ["eupen", "kas eupen"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/K.A.S._Eupen_logo.svg/1200px-K.A.S._Eupen_logo.svg.png",
  },
  {
    names: ["kv kortrijk", "kortrijk"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/74/KV_Kortrijk_logo.svg/1200px-KV_Kortrijk_logo.svg.png",
  },
  {
    names: ["rwdm", "rwd molenbeek"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/RWDM_logo.svg/1200px-RWDM_logo.svg.png",
  },
  {
    names: ["sint truiden", "sint truidense", "stvv"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/Sint-Truidense_V.V._logo.svg/1200px-Sint-Truidense_V.V._logo.svg.png",
  },
  // EFL Championship (England)
  {
    names: ["leicester city", "leicester"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Leicester_City_FC_logo.svg/1200px-Leicester_City_FC_logo.svg.png",
  },
  {
    names: ["leeds united", "leeds"],
    source:
      "https://resources.premierleague.com/premierleague/badges/70/t2.png",
  },
  {
    names: ["southampton"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Southampton_FC.svg/1200px-Southampton_FC.svg.png",
  },
  {
    names: ["ipswich town", "ipswich"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Ipswich_Town.svg/1200px-Ipswich_Town.svg.png",
  },
  {
    names: ["norwich city", "norwich"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Norwich_City_FC_logo.svg/1200px-Norwich_City_FC_logo.svg.png",
  },
  {
    names: ["west bromwich albion", "west brom"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/West_Bromwich_Albion.svg/1200px-West_Bromwich_Albion.svg.png",
  },
  {
    names: ["sunderland"],
    source:
      "https://resources.premierleague.com/premierleague/badges/70/t56.png",
  },
  {
    names: ["middlesbrough"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Middlesbrough_FC_crest.svg/1200px-Middlesbrough_FC_crest.svg.png",
  },
  {
    names: ["hull city"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Hull_City_A.F.C._logo.svg/1200px-Hull_City_A.F.C._logo.svg.png",
  },
  {
    names: ["coventry city", "coventry"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/Coventry_City_F.C._logo.svg/1200px-Coventry_City_F.C._logo.svg.png",
  },
  {
    names: ["preston north end", "preston"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/21/Preston_North_End_F.C._logo.svg/1200px-Preston_North_End_F.C._logo.svg.png",
  },
  {
    names: ["cardiff city", "cardiff"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Cardiff_City_crest.svg/1200px-Cardiff_City_crest.svg.png",
  },
  {
    names: ["watford"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Watford_FC_logo.svg/1200px-Watford_FC_logo.svg.png",
  },
  {
    names: ["stoke city"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Stoke_City_FC.svg/1200px-Stoke_City_FC.svg.png",
  },
  {
    names: ["swansea city", "swansea"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Swansea_City_A.F.C._logo.svg/1200px-Swansea_City_A.F.C._logo.svg.png",
  },
  {
    names: ["huddersfield town", "huddersfield"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Huddersfield_Town_A.F.C._logo.svg/1200px-Huddersfield_Town_A.F.C._logo.svg.png",
  },
  {
    names: ["queens park rangers", "qpr"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3e/Queens_Park_Rangers_crest.svg/1200px-Queens_Park_Rangers_crest.svg.png",
  },
  {
    names: ["birmingham city"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/68/Birmingham_City_FC_logo.svg/1200px-Birmingham_City_FC_logo.svg.png",
  },
  {
    names: ["bristol city"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/09/Bristol_City_CoA.svg/1200px-Bristol_City_CoA.svg.png",
  },
  {
    names: ["blackburn rovers"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Blackburn_Rovers.svg/1200px-Blackburn_Rovers.svg.png",
  },
  {
    names: ["millwall"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/7c/Millwall_FC_logo.svg/1200px-Millwall_FC_logo.svg.png",
  },
  {
    names: ["plymouth argyle", "plymouth"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Plymouth_Argyle_F.C._logo.svg/1200px-Plymouth_Argyle_F.C._logo.svg.png",
  },
  {
    names: ["sheffield wednesday"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Sheffield_Wednesday_badge.svg/1200px-Sheffield_Wednesday_badge.svg.png",
  },
  {
    names: ["rotherham united"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Rotherham_United_FC.svg/1200px-Rotherham_United_FC.svg.png",
  },
  // Liga Portugal
  {
    names: ["benfica", "sl benfica"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a2/SL_Benfica_logo.svg/1200px-SL_Benfica_logo.svg.png",
  },
  {
    names: ["porto", "fc porto"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/FC_Porto.svg/1200px-FC_Porto.svg.png",
  },
  {
    names: ["sporting cp", "sporting lisbon"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/31/Sporting_Clube_de_Portugal.png/1200px-Sporting_Clube_de_Portugal.png",
  },
  {
    names: ["braga", "sc braga"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/7a/SC_Braga_logo.svg/1200px-SC_Braga_logo.svg.png",
  },
  {
    names: ["vitoria guimaraes", "vitoria sc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/92/Vit%C3%B3ria_SC_logo.svg/1200px-Vit%C3%B3ria_SC_logo.svg.png",
  },
  {
    names: ["boavista"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/02/Boavista_F.C._logo.svg/1200px-Boavista_F.C._logo.svg.png",
  },
  {
    names: ["famalicao"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/9f/F.C._Famalic%C3%A3o_logo.svg/1200px-F.C._Famalic%C3%A3o_logo.svg.png",
  },
  {
    names: ["estoril", "estoril praia"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/G.D._Estoril_Praia_logo.svg/1200px-G.D._Estoril_Praia_logo.svg.png",
  },
  {
    names: ["casa pia"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/84/Casa_Pia_A.C._logo.svg/1200px-Casa_Pia_A.C._logo.svg.png",
  },
  {
    names: ["rio ave"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Rio_Ave_FC_logo.svg/1200px-Rio_Ave_FC_logo.svg.png",
  },
  {
    names: ["vizela"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/52/F.C._Vizela_logo.svg/1200px-F.C._Vizela_logo.svg.png",
  },
  {
    names: ["chaves", "gd chaves"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/G.D._Chaves_logo.svg/1200px-G.D._Chaves_logo.svg.png",
  },
  {
    names: ["portimonense"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Portimonense_S.C._logo.svg/1200px-Portimonense_S.C._logo.svg.png",
  },
  {
    names: ["moreirense"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/Moreirense_F.C._logo.svg/1200px-Moreirense_F.C._logo.svg.png",
  },
  {
    names: ["gil vicente"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Gil_Vicente_F.C._logo.svg/1200px-Gil_Vicente_F.C._logo.svg.png",
  },
  {
    names: ["estrela amadora"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/Club_Desportivo_Estrela.png/1200px-Club_Desportivo_Estrela.png",
  },
  {
    names: ["farense", "sc farense"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/ac/S.C._Farense_logo.svg/1200px-S.C._Farense_logo.svg.png",
  },
  {
    names: ["arouca"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/79/F.C._Arouca_logo.svg/1200px-F.C._Arouca_logo.svg.png",
  },
  // Campeonato Brasileiro Serie A
  {
    names: ["palmeiras"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/10/SE_Palmeiras.svg/1200px-SE_Palmeiras.svg.png",
  },
  {
    names: ["flamengo"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Clube_de_Regatas_do_Flamengo_logo.svg/1200px-Clube_de_Regatas_do_Flamengo_logo.svg.png",
  },
  {
    names: ["botafogo"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/1f/Botafogo_de_Futebol_e_Regatas_logo.svg/1200px-Botafogo_de_Futebol_e_Regatas_logo.svg.png",
  },
  {
    names: ["gremio"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Gremio.svg/1200px-Gremio.svg.png",
  },
  {
    names: ["atletico mineiro"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/04/Clube_Atl%C3%A9tico_Mineiro_logo.svg/1200px-Clube_Atl%C3%A9tico_Mineiro_logo.svg.png",
  },
  {
    names: ["athletico paranaense"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Club_Athletico_Paranaense_2020.svg/1200px-Club_Athletico_Paranaense_2020.svg.png",
  },
  {
    names: ["fluminense"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/88/Fluminense_FC_crest.svg/1200px-Fluminense_FC_crest.svg.png",
  },
  {
    names: ["corinthians"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/SC_Corinthians_Paulista_logo.svg/1200px-SC_Corinthians_Paulista_logo.svg.png",
  },
  {
    names: ["sao paulo"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/S%C3%A3o_Paulo_Futebol_Clube.svg/1200px-S%C3%A3o_Paulo_Futebol_Clube.svg.png",
  },
  {
    names: ["santos"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Santos_logo.svg/1200px-Santos_logo.svg.png",
  },
  {
    names: ["international", "internacional", "sport club internacional"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/SC_Internacional_logo.svg/1200px-SC_Internacional_logo.svg.png",
  },
  {
    names: ["cruzeiro"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Cruzeiro_Esporte_Clube_%28logo%29.svg/1200px-Cruzeiro_Esporte_Clube_%28logo%29.svg.png",
  },
  {
    names: ["vasco da gama", "vasco"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/26/CR_Vasco_da_Gama_logo.svg/1200px-CR_Vasco_da_Gama_logo.svg.png",
  },
  {
    names: ["bahia"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/EC_Bahia_logo.svg/1200px-EC_Bahia_logo.svg.png",
  },
  {
    names: ["fortaleza"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/10/Fortaleza_Esporte_Clube.svg/1200px-Fortaleza_Esporte_Clube.svg.png",
  },
  {
    names: ["goias"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Goi%C3%A1s_Esporte_Clube_logo.svg/1200px-Goi%C3%A1s_Esporte_Clube_logo.svg.png",
  },
  {
    names: ["coritiba"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Coritiba_FBC.svg/1200px-Coritiba_FBC.svg.png",
  },
  {
    names: ["america mineiro"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0b/Am%C3%A9rica_Futebol_Clube_%28MG%29_logo.svg/1200px-Am%C3%A9rica_Futebol_Clube_%28MG%29_logo.svg.png",
  },
  {
    names: ["cuiaba"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/55/Cuiab%C3%A1_Esporte_Clube_logo.svg/1200px-Cuiab%C3%A1_Esporte_Clube_logo.svg.png",
  },
  {
    names: ["bragantino", "red bull bragantino"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/31/RedBullBragantino.svg/1200px-RedBullBragantino.svg.png",
  },
  
  // Eredivisie (Netherlands)
  {
    names: ["ajax", "afc ajax"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/79/Ajax_Amsterdam.svg/1200px-Ajax_Amsterdam.svg.png",
  },
  {
    names: ["psv", "psv eindhoven"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/PSV_Eindhoven.svg/1200px-PSV_Eindhoven.svg.png",
  },
  {
    names: ["feyenoord"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Feyenoord_logo.svg/1200px-Feyenoord_logo.svg.png",
  },
  {
    names: ["az alkmaar", "az"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/AZ_Alkmaar_logo.svg/1200px-AZ_Alkmaar_logo.svg.png",
  },
  {
    names: ["fc twente", "twente"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/FC_Twente_logo.svg/1200px-FC_Twente_logo.svg.png",
  },
  {
    names: ["fc utrecht", "utrecht"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/FC_Utrecht_logo.svg/1200px-FC_Utrecht_logo.svg.png",
  },
  {
    names: ["sc heerenveen", "heerenveen"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/SC_Heerenveen_logo.svg/1200px-SC_Heerenveen_logo.svg.png",
  },
  {
    names: ["vitesse"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/88/SBV_Vitesse_logo.svg/1200px-SBV_Vitesse_logo.svg.png",
  },
  {
    names: ["sparta rotterdam", "sparta"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Sparta_Rotterdam_logo.svg/1200px-Sparta_Rotterdam_logo.svg.png",
  },
  {
    names: ["nec nijmegen", "nec"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/21/NEC_Nijmegen_logo.svg/1200px-NEC_Nijmegen_logo.svg.png",
  },
  {
    names: ["go ahead eagles"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Go_Ahead_Eagles_logo.svg/1200px-Go_Ahead_Eagles_logo.svg.png",
  },
  {
    names: ["rkc waalwijk"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/RKC_Waalwijk_logo.svg/1200px-RKC_Waalwijk_logo.svg.png",
  },
  {
    names: ["fortuna sittard"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Fortuna_Sittard_logo.svg/1200px-Fortuna_Sittard_logo.svg.png",
  },
  {
    names: ["pec zwolle"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/PEC_Zwolle_logo.svg/1200px-PEC_Zwolle_logo.svg.png",
  },
  {
    names: ["heracles almelo", "heracles"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/Heracles_Almelo_logo.svg/1200px-Heracles_Almelo_logo.svg.png",
  },
  {
    names: ["almere city"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b8/Almere_City_FC_logo.svg/1200px-Almere_City_FC_logo.svg.png",
  },
  {
    names: ["excelsior"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Excelsior_Rotterdam_logo.svg/1200px-Excelsior_Rotterdam_logo.svg.png",
  },
  {
    names: ["fc volendam", "volendam"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/FC_Volendam_logo.svg/1200px-FC_Volendam_logo.svg.png",
  },
  // Major League Soccer (USA/Canada)
  {
    names: ["la galaxy"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Los_Angeles_Galaxy_logo.svg/1200px-Los_Angeles_Galaxy_logo.svg.png",
  },
  {
    names: ["los angeles fc", "lafc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8f/Los_Angeles_Football_Club.svg/1200px-Los_Angeles_Football_Club.svg.png",
  },
  {
    names: ["seattle sounders"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Seattle_Sounders_FC_logo.svg/1200px-Seattle_Sounders_FC_logo.svg.png",
  },
  {
    names: ["portland timbers"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/Portland_Timbers_logo.svg/1200px-Portland_Timbers_logo.svg.png",
  },
  {
    names: ["sporting kansas city", "skc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Sporting_Kansas_City_logo.svg/1200px-Sporting_Kansas_City_logo.svg.png",
  },
  {
    names: ["st louis city", "stl city"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/St._Louis_City_SC_logo.svg/1200px-St._Louis_City_SC_logo.svg.png",
  },
  {
    names: ["austin fc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Austin_FC_logo.svg/1200px-Austin_FC_logo.svg.png",
  },
  {
    names: ["inter miami", "inter miami cf"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/fb/Club_Internacional_de_F%C3%BAtbol_Miami_logo.svg/1200px-Club_Internacional_de_F%C3%BAtbol_Miami_logo.svg.png",
  },
  {
    names: ["orlando city"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2c/Orlando_City_2014.svg/1200px-Orlando_City_2014.svg.png",
  },
  {
    names: ["atlanta united"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Atlanta_United_FC_logo.svg/1200px-Atlanta_United_FC_logo.svg.png",
  },
  {
    names: ["new york city fc", "nycfc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/New_York_City_FC.svg/1200px-New_York_City_FC.svg.png",
  },
  {
    names: ["new york red bulls", "ny red bulls"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/New_York_Red_Bulls_logo.svg/1200px-New_York_Red_Bulls_logo.svg.png",
  },
  {
    names: ["philadelphia union"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Philadelphia_Union_logo.svg/1200px-Philadelphia_Union_logo.svg.png",
  },
  {
    names: ["fc cincinnati"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/86/FC_Cincinnati_primary_logo_2018.svg/1200px-FC_Cincinnati_primary_logo_2018.svg.png",
  },
  {
    names: ["columbus crew"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/9a/Columbus_Crew_SC_logo_2021.svg/1200px-Columbus_Crew_SC_logo_2021.svg.png",
  },
  {
    names: ["dc united", "d.c. united"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/71/D.C._United_logo.svg/1200px-D.C._United_logo.svg.png",
  },
  {
    names: ["chicago fire"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/73/Chicago_Fire_FC_logo.svg/1200px-Chicago_Fire_FC_logo.svg.png",
  },
  {
    names: ["houston dynamo"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/Houston_Dynamo_FC_logo.svg/1200px-Houston_Dynamo_FC_logo.svg.png",
  },
  {
    names: ["fc dallas"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6e/FC_Dallas_logo.svg/1200px-FC_Dallas_logo.svg.png",
  },
  {
    names: ["minnesota united"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/18/Minnesota_United_FC_logo.svg/1200px-Minnesota_United_FC_logo.svg.png",
  },
  {
    names: ["nashville sc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f3/Nashville_SC_badge.svg/1200px-Nashville_SC_badge.svg.png",
  },
  {
    names: ["vancouver whitecaps"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Vancouver_Whitecaps_FC_logo.svg/1200px-Vancouver_Whitecaps_FC_logo.svg.png",
  },
  {
    names: ["cf montreal", "montreal impact"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5d/Club_de_Foot_Montr%C3%A9al_logo.svg/1200px-Club_de_Foot_Montr%C3%A9al_logo.svg.png",
  },
  {
    names: ["toronto fc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/c0/Toronto_FC_2010.svg/1200px-Toronto_FC_2010.svg.png",
  },
  {
    names: ["new england revolution"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f5/New_England_Revolution_logo_%282021%29.svg/1200px-New_England_Revolution_logo_%282021%29.svg.png",
  },
  {
    names: ["colorado rapids"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Colorado_Rapids_logo.svg/1200px-Colorado_Rapids_logo.svg.png",
  },
  {
    names: ["san jose earthquakes", "san jose"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/San_Jose_Earthquakes_2014.svg/1200px-San_Jose_Earthquakes_2014.svg.png",
  },
  {
    names: ["real salt lake"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/Real_Salt_Lake_2010.svg/1200px-Real_Salt_Lake_2010.svg.png",
  },
  {
    names: ["charlotte fc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Charlotte_FC_logo.svg/1200px-Charlotte_FC_logo.svg.png",
  },
  {
    names: ["miami fusion"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Miami_Fusion_logo.svg/1200px-Miami_Fusion_logo.svg.png",
  },
  // Liga MX (Mexico)
  {
    names: ["club america", "america"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/fd/Club_Am%C3%A9rica_logo_%282016%29.svg/1200px-Club_Am%C3%A9rica_logo_%282016%29.svg.png",
  },
  {
    names: ["chivas", "guadalajara"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/C_de_Guadalajara_logo.svg/1200px-C_de_Guadalajara_logo.svg.png",
  },
  {
    names: ["tigres", "tigres uanl"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Club_Tigres_UANL_2013_logo.svg/1200px-Club_Tigres_UANL_2013_logo.svg.png",
  },
  {
    names: ["monterrey", "rayados"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/16/C.F._Monterrey_logo.svg/1200px-C.F._Monterrey_logo.svg.png",
  },
  {
    names: ["cruz azul"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Deportivo_Cruz_Azul_%28crest%29.svg/1200px-Deportivo_Cruz_Azul_%28crest%29.svg.png",
  },
  {
    names: ["pumas", "pumas unam"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Club_Universidad_Nacional_logo.svg/1200px-Club_Universidad_Nacional_logo.svg.png",
  },
  {
    names: ["toluca"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/Deportivo_Toluca_F.C._logo.svg/1200px-Deportivo_Toluca_F.C._logo.svg.png",
  },
  {
    names: ["santos laguna"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/60/Santos_Laguna_logo.svg/1200px-Santos_Laguna_logo.svg.png",
  },
  {
    names: ["pachuca"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8d/Club_de_F%C3%BAtbol_Pachuca_logo.svg/1200px-Club_de_F%C3%BAtbol_Pachuca_logo.svg.png",
  },
  {
    names: ["leon"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6c/Club_Le%C3%B3n_logo.svg/1200px-Club_Le%C3%B3n_logo.svg.png",
  },
  {
    names: ["atlas"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Atlas_F.C._logo.svg/1200px-Atlas_F.C._logo.svg.png",
  },
  {
    names: ["tijuana", "club tijuana", "xolos"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Club_Tijuana_logo.svg/1200px-Club_Tijuana_logo.svg.png",
  },
  {
    names: ["puebla"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/89/Puebla_FC_logo.svg/1200px-Puebla_FC_logo.svg.png",
  },
  {
    names: ["necaxa"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Club_Necaxa_logo.svg/1200px-Club_Necaxa_logo.svg.png",
  },
  {
    names: ["fc juarez", "juarez"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f1/FC_Juarez_logo.svg/1200px-FC_Juarez_logo.svg.png",
  },
  {
    names: ["queretaro"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4f/Quer%C3%A9taro_F.C._logo.svg/1200px-Quer%C3%A9taro_F.C._logo.svg.png",
  },
  {
    names: ["mazatlan"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/1e/Mazatl%C3%A1n_F.C._logo.svg/1200px-Mazatl%C3%A1n_F.C._logo.svg.png",
  },
  {
    names: ["atletico san luis"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/15/Atl%C3%A9tico_San_Luis_logo.svg/1200px-Atl%C3%A9tico_San_Luis_logo.svg.png",
  },
  // Argentina Liga Profesional
  {
    names: ["boca juniors"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Boca_Juniors_logo18.svg/1200px-Boca_Juniors_logo18.svg.png",
  },
  {
    names: ["river plate"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/34/CA_River_Plate_logo.svg/1200px-CA_River_Plate_logo.svg.png",
  },
  {
    names: ["racing club"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Racing_Club_De_Avellaneda_logo.svg/1200px-Racing_Club_De_Avellaneda_logo.svg.png",
  },
  {
    names: ["independiente", "ca independiente"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/C._A._Independiente_logo.svg/1200px-C._A._Independiente_logo.svg.png",
  },
  {
    names: ["san lorenzo"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/eb/San_Lorenzo_de_Almagro_logo.svg/1200px-San_Lorenzo_de_Almagro_logo.svg.png",
  },
  {
    names: ["velez sarsfield", "velez"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/Logo_of_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg/1200px-Logo_of_Club_Atl%C3%A9tico_V%C3%A9lez_Sarsfield.svg.png",
  },
  {
    names: ["huracan"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/ef/CA_Hurac%C3%A1n_logo.svg/1200px-CA_Hurac%C3%A1n_logo.svg.png",
  },
  {
    names: ["estudiantes"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/Club_Estudiantes_de_La_Plata_logo.svg/1200px-Club_Estudiantes_de_La_Plata_logo.svg.png",
  },
  {
    names: ["gimnasia lp", "gimnasia la plata"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Gimnasia_y_Esgrima_La_Plata_logo.svg/1200px-Gimnasia_y_Esgrima_La_Plata_logo.svg.png",
  },
  {
    names: ["rosario central"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8e/Club_Atl%C3%A9tico_Rosario_Central_logo.svg/1200px-Club_Atl%C3%A9tico_Rosario_Central_logo.svg.png",
  },
  {
    names: ["newells old boys", "newell's", "newells"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/90/Newell%27s_Old_Boys_logo.svg/1200px-Newell%27s_Old_Boys_logo.svg.png",
  },
  {
    names: ["argentinos juniors"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/63/Argentinos_Juniors_logo.svg/1200px-Argentinos_Juniors_logo.svg.png",
  },
  {
    names: ["banfield"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a0/CA_Banfield_logo.svg/1200px-CA_Banfield_logo.svg.png",
  },
  {
    names: ["lanus"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/23/Club_Atl%C3%A9tico_Lan%C3%BAs_logo.svg/1200px-Club_Atl%C3%A9tico_Lan%C3%BAs_logo.svg.png",
  },
  {
    names: ["talleres"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/c3/Club_Atl%C3%A9tico_Talleres_logo.svg/1200px-Club_Atl%C3%A9tico_Talleres_logo.svg.png",
  },
  {
    names: ["defensa y justicia"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Defensa_y_Justicia_logo.svg/1200px-Defensa_y_Justicia_logo.svg.png",
  },
  {
    names: ["godoy cruz"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a3/Godoy_Cruz_logo.svg/1200px-Godoy_Cruz_logo.svg.png",
  },
  {
    names: ["colon"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Club_Atl%C3%A9tico_Col%C3%B3n_logo.svg/1200px-Club_Atl%C3%A9tico_Col%C3%B3n_logo.svg.png",
  },
  {
    names: ["union santa fe"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/CA_Union_Santa_Fe_logo.svg/1200px-CA_Union_Santa_Fe_logo.svg.png",
  },
  {
    names: ["central cordoba"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/10/Central_C%C3%B3rdoba_logo.svg/1200px-Central_C%C3%B3rdoba_logo.svg.png",
  },
  // J1 League (Japan)
  {
    names: ["kawasaki frontale"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/29/Kawasaki_Frontale_logo.svg/1200px-Kawasaki_Frontale_logo.svg.png",
  },
  {
    names: ["yokohama f marinos", "yokohama marinos"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Yokohama_F._Marinos_logo.svg/1200px-Yokohama_F._Marinos_logo.svg.png",
  },
  {
    names: ["urawa reds", "urawa red diamonds"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Urawa_Red_Diamonds_logo.svg/1200px-Urawa_Red_Diamonds_logo.svg.png",
  },
  {
    names: ["kashima antlers"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Kashima_Antlers.svg/1200px-Kashima_Antlers.svg.png",
  },
  {
    names: ["gamba osaka"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/Gamba_Osaka_logo.svg/1200px-Gamba_Osaka_logo.svg.png",
  },
  {
    names: ["cerezo osaka"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/Cerezo_Osaka_logo.svg/1200px-Cerezo_Osaka_logo.svg.png",
  },
  {
    names: ["nagoya grampus"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/49/Nagoya_Grampus_logo.svg/1200px-Nagoya_Grampus_logo.svg.png",
  },
  {
    names: ["vissel kobe"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/fc/Vissel_Kobe_logo.svg/1200px-Vissel_Kobe_logo.svg.png",
  },
  {
    names: ["sanfrecce hiroshima"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5c/Sanfrecce_Hiroshima_logo.svg/1200px-Sanfrecce_Hiroshima_logo.svg.png",
  },
  {
    names: ["sagan tosu"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/bf/Sagan_Tosu_logo.svg/1200px-Sagan_Tosu_logo.svg.png",
  },
  {
    names: ["kashiwa reysol"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Kashiwa_Reysol_logo.svg/1200px-Kashiwa_Reysol_logo.svg.png",
  },
  {
    names: ["consadole sapporo"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0a/Hokkaido_Consadole_Sapporo_logo.svg/1200px-Hokkaido_Consadole_Sapporo_logo.svg.png",
  },
  {
    names: ["kyoto sanga"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Kyoto_Sanga_F.C._logo.svg/1200px-Kyoto_Sanga_F.C._logo.svg.png",
  },
  {
    names: ["avispa fukuoka"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Avispa_Fukuoka_logo.svg/1200px-Avispa_Fukuoka_logo.svg.png",
  },
  {
    names: ["albirex niigata"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4b/Albirex_Niigata_logo.svg/1200px-Albirex_Niigata_logo.svg.png",
  },
  {
    names: ["shonan bellmare"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/85/Shonan_Bellmare_logo.svg/1200px-Shonan_Bellmare_logo.svg.png",
  },
  {
    names: ["tokyo fc", "fc tokyo"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/54/FC_Tokyo_logo.svg/1200px-FC_Tokyo_logo.svg.png",
  },
  {
    names: ["yokohama fc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Yokohama_FC_logo.svg/1200px-Yokohama_FC_logo.svg.png",
  },
  // Turkish Super Lig
  {
    names: ["galatasaray"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Galatasaray_Sports_Club_Logo.svg/1200px-Galatasaray_Sports_Club_Logo.svg.png",
  },
  {
    names: ["fenerbahce"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/39/Fenerbah%C3%A7e_SK.png/1200px-Fenerbah%C3%A7e_SK.png",
  },
  {
    names: ["besiktas"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/9e/BesiktasJK-Logo.svg/1200px-BesiktasJK-Logo.svg.png",
  },
  {
    names: ["trabzonspor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2d/Trabzonspor_logo.svg/1200px-Trabzonspor_logo.svg.png",
  },
  {
    names: ["istanbul basaksehir", "basaksehir"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3b/%C4%B0stanbul_Ba%C5%9Fak%C5%9Fehir_FK_logo.svg/1200px-%C4%B0stanbul_Ba%C5%9Fak%C5%9Fehir_FK_logo.svg.png",
  },
  {
    names: ["adana demirspor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Adana_Demirspor_logo.svg/1200px-Adana_Demirspor_logo.svg.png",
  },
  {
    names: ["kasimpasa"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0f/Kas?mpa?a_SK_logo.svg/1200px-Kas?mpa?a_SK_logo.svg.png",
  },
  {
    names: ["alanyaspor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/95/Alanyaspor_logo.svg/1200px-Alanyaspor_logo.svg.png",
  },
  {
    names: ["antalyaspor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/Antalyaspor_logo.svg/1200px-Antalyaspor_logo.svg.png",
  },
  {
    names: ["sivasspor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Sivasspor_logo.svg/1200px-Sivasspor_logo.svg.png",
  },
  {
    names: ["konyaspor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/Konyaspor_logo.svg/1200px-Konyaspor_logo.svg.png",
  },
  {
    names: ["kayserispor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Kayserispor_logo.svg/1200px-Kayserispor_logo.svg.png",
  },
  {
    names: ["rizespor", "caykur rizespor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/%C3%87aykur_Rizespor_logo.svg/1200px-%C3%87aykur_Rizespor_logo.svg.png",
  },
  {
    names: ["gaziantep"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b1/Gaziantep_FK_logo.svg/1200px-Gaziantep_FK_logo.svg.png",
  },
  {
    names: ["hatayspor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/Hatayspor_logo.svg/1200px-Hatayspor_logo.svg.png",
  },
  {
    names: ["ankaragucu"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/9c/MKE_Ankarag%C3%BCc%C3%BC_logo.svg/1200px-MKE_Ankarag%C3%BCc%C3%BC_logo.svg.png",
  },
  {
    names: ["istanbulspor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/9/91/Istanbulspor_logo.svg/1200px-Istanbulspor_logo.svg.png",
  },
  {
    names: ["samsunspor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/80/Samsunspor_logo.svg/1200px-Samsunspor_logo.svg.png",
  },
  {
    names: ["pendikspor"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e4/Pendikspor_logo.svg/1200px-Pendikspor_logo.svg.png",
  },
  {
    names: ["fatih karagumruk", "karagumruk"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f9/Fatih_Karag%C3%BCmr%C3%BCk_S.K._logo.svg/1200px-Fatih_Karag%C3%BCmr%C3%BCk_S.K._logo.svg.png",
  },
  // Danish Superliga
  {
    names: ["fc copenhagen", "fc kopenhagen"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/88/FC_Copenhagen_logo.svg/1200px-FC_Copenhagen_logo.svg.png",
  },
  {
    names: ["brondby", "brondby if"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3f/Br%C3%B8ndby_IF_logo.svg/1200px-Br%C3%B8ndby_IF_logo.svg.png",
  },
  {
    names: ["fc midtjylland"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5b/FC_Midtjylland_logo.svg/1200px-FC_Midtjylland_logo.svg.png",
  },
  {
    names: ["agf", "agf aarhus"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/AGF_Aarhus_logo.svg/800px-AGF_Aarhus_logo.svg.png",
  },
  {
    names: ["fc nordsjaelland"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/49/FC_Nordsj%C3%A6lland_logo.svg/1200px-FC_Nordsj%C3%A6lland_logo.svg.png",
  },
  {
    names: ["viborg"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Viborg_FF_logo.svg/1200px-Viborg_FF_logo.svg.png",
  },
  {
    names: ["randers"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/Randers_FC_logo.svg/1200px-Randers_FC_logo.svg.png",
  },
  {
    names: ["silkeborg"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e7/Silkeborg_IF_logo.svg/1200px-Silkeborg_IF_logo.svg.png",
  },
  {
    names: ["odense", "ob odense"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f2/Odense_BK_logo.svg/1200px-Odense_BK_logo.svg.png",
  },
  {
    names: ["lyngby"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/56/Lyngby_Boldklub_logo.svg/1200px-Lyngby_Boldklub_logo.svg.png",
  },
  {
    names: ["vejle"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Vejle_Boldklub_logo.svg/1200px-Vejle_Boldklub_logo.svg.png",
  },
  {
    names: ["hvidovre"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/81/Hvidovre_IF_logo.svg/1200px-Hvidovre_IF_logo.svg.png",
  },
  // UEFA Champions League additions
  {
    names: ["celtic", "celtic fc"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Celtic_FC.svg/1200px-Celtic_FC.svg.png",
  },
  {
    names: ["red star belgrade", "crvena zvezda"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/a8/Crvena_zvezda_logo.svg/1200px-Crvena_zvezda_logo.svg.png",
  },
  {
    names: ["young boys", "bsc young boys"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/BSC_Young_Boys_logo.svg/1200px-BSC_Young_Boys_logo.svg.png",
  },
  {
    names: ["shakhtar donetsk"],
    source:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/FC_Shakhtar_Donetsk.svg/1200px-FC_Shakhtar_Donetsk.svg.png",
  },
  {
    names: ["red bull salzburg", "fc salzburg"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/FC_Red_Bull_Salzburg_logo.svg/1200px-FC_Red_Bull_Salzburg_logo.svg.png",
  },
  // UEFA Europa League additions
  {
    names: ["rangers", "glasgow rangers"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/43/Rangers_FC.svg/1200px-Rangers_FC.svg.png",
  },
  {
    names: ["olympiacos", "olympiacos piraeus"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Olympiacos_FC_logo.svg/1200px-Olympiacos_FC_logo.svg.png",
  },
  {
    names: ["tsc backa topola", "backa topola"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/3c/TSC_Ba%C4%8Dka_Topola_logo.svg/1200px-TSC_Ba%C4%8Dka_Topola_logo.svg.png",
  },
  {
    names: ["aek athens", "aek"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2a/AEK_Athens_F.C._logo.svg/1200px-AEK_Athens_F.C._logo.svg.png",
  },
  {
    names: ["sparta prague", "sparta praha"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/89/AC_Sparta_Prague_logo.svg/1200px-AC_Sparta_Prague_logo.svg.png",
  },
  {
    names: ["aris limassol"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/f/f7/Aris_Limassol_FC_logo.svg/1200px-Aris_Limassol_FC_logo.svg.png",
  },
  {
    names: ["sturm graz"],
    source:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/SK_Sturm_Graz.svg/1200px-SK_Sturm_Graz.svg.png",
  },
  {
    names: ["rakow", "rakow czestochowa"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/d7/Rak%C3%B3w_Cz%C4%99stochowa.svg/1200px-Rak%C3%B3w_Cz%C4%99stochowa.svg.png",
  },
  {
    names: ["lask"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/e/e9/Linzer_Athletik_Sport_Klub_logo.svg/1200px-Linzer_Athletik_Sport_Klub_logo.svg.png",
  },
  {
    names: ["maccabi haifa"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/Maccabi_Haifa_FC_logo.svg/1200px-Maccabi_Haifa_FC_logo.svg.png",
  },
  {
    names: ["panathinaikos"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/Panathinaikos_FC_new_logo.svg/1200px-Panathinaikos_FC_new_logo.svg.png",
  },
  {
    names: ["slavia prague", "slavia praha"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6d/Slavia_Prag.svg/1200px-Slavia_Prag.svg.png",
  },
  {
    names: ["servette"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b9/Servette_FC_logo.svg/1200px-Servette_FC_logo.svg.png",
  },
  {
    names: ["sheriff tiraspol", "fc sheriff"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4d/FC_Sheriff_logo.svg/1200px-FC_Sheriff_logo.svg.png",
  },
  {
    names: ["qarabag"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Qaraba%C4%9F_FK_logo.svg/1200px-Qaraba%C4%9F_FK_logo.svg.png",
  },
  {
    names: ["molde"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/42/Molde_FK_logo.svg/1200px-Molde_FK_logo.svg.png",
  },
  {
    names: ["bk hacken", "hacken"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/87/BK_H%C3%A4cken_logo.svg/1200px-BK_H%C3%A4cken_logo.svg.png",
  },
  // UEFA Europa Conference League additions
  {
    names: ["slovan bratislava"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6b/SK_Slovan_Bratislava_logo.svg/1200px-SK_Slovan_Bratislava_logo.svg.png",
  },
  {
    names: ["olimpija ljubljana"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/d/de/NK_Olimpija_Ljubljana_logo.svg/1200px-NK_Olimpija_Ljubljana_logo.svg.png",
  },
  {
    names: ["ki klaksvik", "klaksvik"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/48/Klaksvi%CC%81kar_%C3%8Dtrottarfelag_logo.svg/1200px-Klaksvi%CC%81kar_%C3%8Dtrottarfelag_logo.svg.png",
  },
  {
    names: ["maccabi tel aviv"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5a/Maccabi_Tel_Aviv_FC_logo.svg/1200px-Maccabi_Tel_Aviv_FC_logo.svg.png",
  },
  {
    names: ["zorya luhansk"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/b/b0/FC_Zorya_Luhansk_logo.svg/1200px-FC_Zorya_Luhansk_logo.svg.png",
  },
  {
    names: ["breidablik"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/28/Breidablik_UBK.svg/1200px-Breidablik_UBK.svg.png",
  },
  {
    names: ["dinamo zagreb"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/65/GNK_Dinamo_Zagreb_logo.svg/1200px-GNK_Dinamo_Zagreb_logo.svg.png",
  },
  {
    names: ["viktoria plzen"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5e/FC_Viktoria_Plze%C5%88_logo.svg/1200px-FC_Viktoria_Plze%C5%88_logo.svg.png",
  },
  {
    names: ["fc astana", "astana"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/FC_Astana_logo.svg/1200px-FC_Astana_logo.svg.png",
  },
  {
    names: ["ballkani", "kf ballkani"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/03/FC_Ballkani_logo.svg/1200px-FC_Ballkani_logo.svg.png",
  },
  {
    names: ["bodo glimt", "bodoe glimt"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/67/FK_Bod%C3%B8/Glimt_logo.svg/1200px-FK_Bod%C3%B8/Glimt_logo.svg.png",
  },
  {
    names: ["fc lugano", "lugano"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/FC_Lugano_(2015)_logo.svg/1200px-FC_Lugano_(2015)_logo.svg.png",
  },
  {
    names: ["legia warsaw", "legia warszawa"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/33/Legia_Warsaw.svg/1200px-Legia_Warsaw.svg.png",
  },
  {
    names: ["zrinjski mostar"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/6/6f/H%C5%A0K_Zrinjski_Mostar_logo.svg/1200px-H%C5%A0K_Zrinjski_Mostar_logo.svg.png",
  },
  {
    names: ["ferencvaros"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/55/Ferencv%C3%A1rosi_TC_logo.svg/1200px-Ferencv%C3%A1rosi_TC_logo.svg.png",
  },
  {
    names: ["cukaricki"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/05/%C4%8Cukari%C4%8Dki_logo.svg/1200px-%C4%8Cukari%C4%8Dki_logo.svg.png",
  },
  {
    names: ["paok"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/2f/PAOK_FC_logo.svg/1200px-PAOK_FC_logo.svg.png",
  },
  {
    names: ["aberdeen"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/11/Aberdeen_FC_logo.svg/1200px-Aberdeen_FC_logo.svg.png",
  },
  {
    names: ["hjk helsinki", "hjk"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4e/Helsingin_Jalkapalloklubi_logo.svg/1200px-Helsingin_Jalkapalloklubi_logo.svg.png",
  },
  {
    names: ["ludogorets", "ludogorets razgrad"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/7/75/PFK_Ludogorets_Razgrad_logo.svg/1200px-PFK_Ludogorets_Razgrad_logo.svg.png",
  },
  {
    names: ["spartak trnava"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/2/27/FC_Spartak_Trnava_logo.svg/1200px-FC_Spartak_Trnava_logo.svg.png",
  },
  // Liga 1 Indonesia
  {
    names: ["arema", "arema fc", "arema malang"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c2/Arema_FC_2017_logo.svg/1072px-Arema_FC_2017_logo.svg.png",
  },
  {
    names: ["bali united", "bali united fc"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/5/5e/Bali_United_logo.svg/881px-Bali_United_logo.svg.png",
  },
  {
    names: ["borneo fc", "borneo fc samarinda", "borneo samarinda"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/4/4d/Logo_Borneo_FC.svg/932px-Logo_Borneo_FC.svg.png",
  },
  {
    names: ["dewa united", "dewa united fc"],
    source: "https://upload.wikimedia.org/wikipedia/id/5/53/Dewa_United_FC.png",
  },
  {
    names: ["madura united", "madura united fc"],
    source: "https://upload.wikimedia.org/wikipedia/id/8/8a/Madura_United_FC.png",
  },
  {
    names: ["persib", "persib bandung"],
    source: "https://upload.wikimedia.org/wikipedia/en/8/85/Persib_Bandung_Football_Logo.png",
  },
  {
    names: ["persija", "persija jakarta"],
    source: "https://upload.wikimedia.org/wikipedia/id/9/94/Persija_Jakarta_logo.png",
  },
  {
    names: ["persebaya", "persebaya surabaya"],
    source: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi23-kQDXzE8u2w6bCdzqSXmLo3YzMgNIPb908jPISefuDc-8Jay3_9XF_uFKO9Fwov3ec_WfYZRKU8GTAR7JFK2GPk9o11svcnAEvw1Aeqg89-FS3fZWQTBUHUN79iy2j_tLeCnsPfH06lm3XcEKK9uR0Mml12ru4Ri4suP1Th0WL2_zu6lwe-uA/w265-h320/Persebaya%20Surabaya%20Logo.png",
  },
  {
    names: ["psm", "psm makassar"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/c/c9/PSS_Sleman_logo.svg/1001px-PSS_Sleman_logo.svg.png",
  },
  {
    names: ["psis", "psis semarang"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/f/f5/PSIS_logo.svg/762px-PSIS_logo.svg.png",
  },
  {
    names: ["pss", "pss sleman"],
    source: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiwtCg3nlC9tn8nczCAaUDZCVYv0335hyphenhyphenEuHqwkqf4Hm9uRS2xmvGOdR_7dKA5RvBCpOILyiJUm3L4B3ggr-GuAbRh2TzTQtOPps0X-5iTI3UjZ9m7jMxXWm2xgNe9FxobwEGDf0rYt_DE/s2048/Logo+PSS+%2528Persatuan+Sepak+bola+Sleman%2529.png",
  },
  {
    names: ["persik", "persik kediri"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/4/4c/Persik_Kediri_logo.svg/1200px-Persik_Kediri_logo.svg.png",
  },
  {
    names: ["persis", "persis solo"],
    source: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhwTeStOozJyWuO7Z9hFpB-NqGlMH4XsYs9cWmkcPv0DnPbSJljVBA9fhj2Wr_whHunYUH5mf3_-ZLQYfPLCHEq1UN8N0lCsqLycLHcfIXI9Dm3jMI6nbI4YWK8lTcra4H0FLEVNFfaN5sHvwmRRoMns7LXREvRWJ7zT7YqmrPipPm_L-7cWrPw2w/w320-h320/Persis%20Solo.png",
  },
  {
    names: ["persita", "persita tangerang"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/9/95/Persita_logo_%282020%29.svg/1000px-Persita_logo_%282020%29.svg.png",
  },
  {
    names: ["barito putera", "ps barito putera"],
    source: "https://upload.wikimedia.org/wikipedia/id/b/b8/Barito_Putera_logo.png",
  },
  {
    names: ["rans nusantara", "rans fc"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/6/6f/RANS_Nusantara_FC_logo_baru.svg/1200px-RANS_Nusantara_FC_logo_baru.svg.png",
  },
  {
    names: ["bhayangkara", "bhayangkara fc", "bhayangkara presisi"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/6/6a/Bhayangkara_FC_logo.svg/822px-Bhayangkara_FC_logo.svg.png",
  },
  {
    names: ["psbs", "psbs biak"],
    source: "https://upload.wikimedia.org/wikipedia/id/thumb/9/9b/Logo_PSBS_Biak_baru.png/250px-Logo_PSBS_Biak_baru.png",
  },
  {
    names: ["semen padang"],
    source: "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Semen_Padang_FC_logo.svg/1200px-Semen_Padang_FC_logo.svg.png",
  },
  // FIFA U-17 World Cup 2023 flag fallbacks
  {
    names: ["indonesia", "indonesia u17", "indonesia u-17", "timnas indonesia", "timnas indonesia u17"],
    source: "https://flagcdn.com/w320/id.png",
  },
  {
    names: ["brasil", "brazil", "timnas brasil", "brasil u17", "brazil u17"],
    source: "https://flagcdn.com/w320/br.png",
  },
  {
    names: ["inggris", "england", "timnas inggris", "inggris u17", "england u17"],
    source: "https://flagcdn.com/w320/gb.png",
  },
  {
    names: ["prancis", "perancis", "france", "timnas prancis", "prancis u17"],
    source: "https://flagcdn.com/w320/fr.png",
  },
  {
    names: ["jepang", "japan", "timnas jepang", "jepang u17"],
    source: "https://flagcdn.com/w320/jp.png",
  },
  {
    names: ["meksiko", "mexico", "timnas meksiko", "meksiko u17"],
    source: "https://flagcdn.com/w320/mx.png",
  },
  {
    names: ["selandia baru", "new zealand", "timnas selandia baru", "selandia baru u17", "new zealand u17"],
    source: "https://flagcdn.com/w320/nz.png",
  },
  {
    names: ["korea selatan", "korsel", "korea republic", "south korea", "korea selatan u17"],
    source: "https://flagcdn.com/w320/kr.png",
  },
  {
    names: ["spanyol", "spain", "timnas spanyol", "spanyol u17"],
    source: "https://flagcdn.com/w320/es.png",
  },
  {
    names: ["amerika serikat", "usa", "timnas amerika serikat", "amerika serikat u17", "united states u17"],
    source: "https://flagcdn.com/w320/us.png",
  },
  {
    names: ["kanada", "canada", "timnas kanada", "kanada u17"],
    source: "https://flagcdn.com/w320/ca.png",
  },
  {
    names: ["jerman", "germany", "timnas jerman", "jerman u17"],
    source: "https://flagcdn.com/w320/de.png",
  },
  {
    names: ["argentina", "timnas argentina", "argentina u17"],
    source: "https://flagcdn.com/w320/ar.png",
  },
  {
    names: ["senegal", "timnas senegal", "senegal u17"],
    source: "https://flagcdn.com/w320/sn.png",
  },
  {
    names: ["mali", "timnas mali", "mali u17"],
    source: "https://flagcdn.com/w320/ml.png",
  },
  {
    names: ["burkina faso", "timnas burkina faso", "burkina faso u17"],
    source: "https://flagcdn.com/w320/bf.png",
  },
  {
    names: ["maroko", "morocco", "timnas maroko", "maroko u17"],
    source: "https://flagcdn.com/w320/ma.png",
  },
  {
    names: ["ekuador", "ecuador", "timnas ekuador", "ekuador u17"],
    source: "https://flagcdn.com/w320/ec.png",
  },
  {
    names: ["panama", "timnas panama", "panama u17"],
    source: "https://flagcdn.com/w320/pa.png",
  },
  {
    names: ["uzbekistan", "timnas uzbekistan", "uzbekistan u17"],
    source: "https://flagcdn.com/w320/uz.png",
  },
  {
    names: ["polandia", "poland", "timnas polandia", "polandia u17"],
    source: "https://flagcdn.com/w320/pl.png",
  },
  {
    names: ["venezuela", "timnas venezuela", "venezuela u17"],
    source: "https://flagcdn.com/w320/ve.png",
  },
  {
    names: ["iran", "timnas iran", "iran u17"],
    source: "https://flagcdn.com/w320/ir.png",
  },
  {
    names: ["kaledonia baru", "new caledonia", "timnas kaledonia baru", "kaledonia baru u17"],
    source: "https://flagcdn.com/w320/nc.png",
  },
];

export default TEAM_AUTO_LOGO_SOURCES;
