const championshipTeams = [
  {
    names: ["leicester city", "leicester"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/375.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["leeds united", "leeds"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t2.png",
  },
  {
    names: ["southampton"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/376.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["ipswich town", "ipswich"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/373.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["norwich city", "norwich"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/381.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["west bromwich albion", "west brom"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/383.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["sunderland"],
    source: "https://resources.premierleague.com/premierleague/badges/70/t56.png",
  },
  {
    names: ["middlesbrough"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/369.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["hull city"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/306.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["coventry city", "coventry"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/388.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["preston north end", "preston"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/394.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["cardiff city", "cardiff"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/0/0c/Cardiff_City_crest.svg/1200px-Cardiff_City_crest.svg.png",
  },
  {
    names: ["watford"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/395.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["stoke city"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/336.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["swansea city", "swansea"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/318.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["huddersfield town", "huddersfield"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/59/Huddersfield_Town_A.F.C._logo.svg/1200px-Huddersfield_Town_A.F.C._logo.svg.png",
  },
  {
    names: ["queens park rangers", "qpr"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/334.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["birmingham city"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/392.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["bristol city"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/333.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["blackburn rovers"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/365.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["charlton athletic", "charlton"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/372.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["derby county", "derby"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/374.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["millwall"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/391.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["oxford united", "oxford"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/311.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["portsmouth"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/385.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["plymouth argyle", "plymouth"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/8/8b/Plymouth_Argyle_F.C._logo.svg/1200px-Plymouth_Argyle_F.C._logo.svg.png",
  },
  {
    names: ["sheffield wednesday"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/399.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["rotherham united"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/5f/Rotherham_United_FC.svg/1200px-Rotherham_United_FC.svg.png",
  },
  {
    names: ["wrexham"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/352.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
];

export { championshipTeams };


