const championsLeagueTeams = [
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
];

const europaLeagueTeams = [
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
];

const europaConferenceLeagueTeams = [
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
];

const uefaCompetitionTeams = [
  ...championsLeagueTeams,
  ...europaLeagueTeams,
  ...europaConferenceLeagueTeams,
];

export { uefaCompetitionTeams };


