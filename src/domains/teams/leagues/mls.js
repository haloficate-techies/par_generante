const mlsTeams = [
  {
    names: ["la galaxy"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747755165/assets/logos/mls-clubs/Club_Logo-LA_Galaxy_fg0wjp.png",
  },
  {
    names: ["los angeles fc", "lafc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747755309/assets/logos/mls-clubs/Club_Logo-LAFC_djrhru.png",
  },
  {
    names: ["seattle sounders", "seattle sounders fc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1748265125/assets/logos/mls-clubs/Club_Logo-Seattle_e6jk2x.png",
  },
  {
    names: ["portland timbers"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747769540/assets/logos/mls-clubs/Club_Logo-Portland_qihpaz.png",
  },
  {
    names: ["sporting kansas city", "skc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747754918/assets/logos/mls-clubs/Club_Logo-Kansas_City_cnhd75.png",
  },
  {
    names: ["st louis city", "stl city", "st. louis city sc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747771858/assets/logos/mls-clubs/Club_Logo-Saint_Louis_guz12c.png",
  },
  {
    names: ["austin fc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747499975/assets/logos/mls-clubs/Club_Logo-Austin_pa9xtu.png",
  },
  {
    names: ["inter miami", "inter miami cf"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747755405/assets/logos/mls-clubs/Club_Logo-Miami_tyqe64.png",
  },
  {
    names: ["orlando city"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747769281/assets/logos/mls-clubs/Club_Logo-Orlando_ryyn7a.png",
  },
  {
    names: ["atlanta united"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747499879/assets/logos/mls-clubs/Club_Logo-Atlanta_jtk7ku.png",
  },
  {
    names: ["new york city fc", "nycfc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747756306/assets/logos/mls-clubs/Club_Logo-New_York_City_xu6vax.png",
  },
  {
    names: ["new york red bulls", "ny red bulls", "red bull new york"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747771783/assets/logos/mls-clubs/Club_Logo-RBNY_dwawvt.png",
  },
  {
    names: ["philadelphia union"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747769446/assets/logos/mls-clubs/Club_Logo-Philadelphia_im7pqg.png",
  },
  {
    names: ["fc cincinnati"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747500249/assets/logos/mls-clubs/Club_Logo-Cincinnati_jwgkps.png",
  },
  {
    names: ["columbus crew"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747500414/assets/logos/mls-clubs/Club_Logo-Columbus_light_z3eq8l.png",
  },
  {
    names: ["dc united", "d.c. united"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747500504/assets/logos/mls-clubs/Club_Logo-D.C_t03ekm.png",
  },
  {
    names: ["chicago fire"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747500178/assets/logos/mls-clubs/Club_Logo-Chicago_jm2yev.png",
  },
  {
    names: ["houston dynamo", "houston dynamo fc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747500939/assets/logos/mls-clubs/Club_Logo-Houston_oifm77.png",
  },
  {
    names: ["fc dallas"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747500567/assets/logos/mls-clubs/Club_Logo-Dallas_sysmtj.png",
  },
  {
    names: ["minnesota united", "minnesota united fc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747754826/assets/logos/mls-clubs/Club_Logo-Minnesota_ftweor.png",
  },
  {
    names: ["nashville sc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747755999/assets/logos/mls-clubs/Club_Logo-Nashville_rb9vwu.png",
  },
  {
    names: ["vancouver whitecaps", "vancouver whitecaps fc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1748265547/assets/logos/mls-clubs/Club_Logo-Vancouver_ao9phl.png",
  },
  {
    names: ["cf montreal", "montreal impact"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747755806/assets/logos/mls-clubs/Club_Logo-Montreal_beeqnh.png",
  },
  {
    names: ["toronto fc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1748265251/assets/logos/mls-clubs/Club_Logo-Toronto_vz6hao.png",
  },
  {
    names: ["new england revolution"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1766020750/assets/NE_Logo_PRI_FC_RGB_480x480_fdx2us.png",
  },
  {
    names: ["colorado rapids"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747500322/assets/logos/mls-clubs/Club_Logo-Colorado_n5kpss.png",
  },
  {
    names: ["san jose earthquakes", "san jose"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1748262048/assets/logos/mls-clubs/Club_Logo-San_Jose_opzlmo.png",
  },
  {
    names: ["real salt lake"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747776403/assets/logos/mls-clubs/Club_Logo-Salt_Lake_City_hpvde5.png",
  },
  {
    names: ["charlotte fc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1747500045/assets/logos/mls-clubs/Club_Logo-Charlotte_p7sznf.png",
  },
  {
    names: ["san diego fc"],
    source:
      "https://images.mlssoccer.com/image/upload/t_club_logo_medium/v1748261519/assets/logos/mls-clubs/Club_Logo-San_Diego_nwpyul.png",
  },
  {
    names: ["miami fusion"],
    source:
      "https://upload.wikimedia.org/wikipedia/en/thumb/4/4a/Miami_Fusion_logo.svg/1200px-Miami_Fusion_logo.svg.png",
  },
];

export { mlsTeams };


