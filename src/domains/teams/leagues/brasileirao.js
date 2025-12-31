const brasileiraoTeams = [
  {
    names: ["palmeiras"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2029.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["flamengo"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/819.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["botafogo"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6086.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["gremio"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6273.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["atletico mineiro", "atletico mineiro saf"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/7632.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["athletico paranaense"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3458.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["fluminense"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3445.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["corinthians"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/874.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["sao paulo"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2026.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["santos", "santos fc"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2674.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["international", "internacional", "sport club internacional"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/1936.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["cruzeiro", "cruzeiro saf"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/2022.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["vasco da gama", "vasco", "vasco da gama saf"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3454.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["bahia"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9967.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["chapecoense"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9318.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["ceara"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9969.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["mirassol"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/9169.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["remo"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/4936.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["vitoria"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3457.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["fortaleza"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6272.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["juventude"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6270.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["sport", "sport recife"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/7635.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
  {
    names: ["goias"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/5/58/Goi%C3%A1s_Esporte_Clube_logo.svg/1200px-Goi%C3%A1s_Esporte_Clube_logo.svg.png",
  },
  {
    names: ["coritiba", "coritiba saf"],
    source:
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/3456.png&scale=crop&cquality=40&location=origin&w=80&h=80",
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
      "https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/6079.png&scale=crop&cquality=40&location=origin&w=80&h=80",
  },
];

export { brasileiraoTeams };


