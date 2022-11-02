// Cloudinary Video Files
const VIDEOS = {
  // TO BE ADDED

  step_up: {  // MISSING
    id: "step_up",
    level: 2,
    title: "Step Up",
    description: "Get some sort of small stool or step-up bench for this exercise! Here, we will try to step up, first with our left foot and then our right, so we have both feet on the platform! Then, step down, left the right and do it again!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948242/Kids-N-Motion%20Videos/Step_up_1_wwkfvc.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948316/Kidz-N-Motion%20Thumbnails/step_up_egwcrb.png"
  },
  toe_walking: { // MISSING
    id: "toe_walking",
    level: 2,
    title: "Heel/Toe Walking",
    description: "Test your balance and your foot strength by completing the Toe Walking Video. Walk forward on your toes, then turn and walk on your heels. Walk forward a few paces, and then back, while staying on your toes the whole time!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948250/Kids-N-Motion%20Videos/Toe_Walking_lydpco.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948316/Kidz-N-Motion%20Thumbnails/toe_walking_uyqgpl.png",
  },
  toe_touches: { // MISSING?
    id: "toe_touches",
    level: 1,
    title: "Toe Touches",
    description: "Bend over and touch your toes. For this exercise, try to keep your knees straight without bending them, and reach down as far as you can!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948244/Kids-N-Motion%20Videos/Toe_Touches_1_huvgxx.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948316/Kidz-N-Motion%20Thumbnails/toe_touches_riskgj.png"
  },
  squat: { // MISSING?
    id: "squat",
    level: 1,
    title: "Squat",
    description: "For this exercise, plant your feet about shoulder width apart, and squat down while trying to keep your back straight. This should test your leg strength as well as your balance!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948248/Kids-N-Motion%20Videos/Squat_1_tahlhe.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948315/Kidz-N-Motion%20Thumbnails/squat_ujqj9j.png"
  },
  side_to_side: {
    id: "side_to_side",
    level: 2,
    title: "Side To Side",
    description: "For this exercise, we will be jumping side to side, doing our best to keep our feet together. Imagine a line on the floor next to you, and try to jump over it and back!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948249/Kids-N-Motion%20Videos/side_to_side_1_plmjw6.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948315/Kidz-N-Motion%20Thumbnails/side_to_side_ecnudh.png",
  },
  rolling: {
    id: "rolling",
    level: 1,
    title: "Rolling",
    description: "In this exercise, we are going to lie on the ground and try rolling onto our side, and then back again. This should test your trunk control and strength.",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948248/Kids-N-Motion%20Videos/Rolling_zw37tv.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948315/Kidz-N-Motion%20Thumbnails/rolling_zfzebk.png",
  },
  leg_lifts: {
    id: "leg_lifts",
    level: 1,
    title: "Leg Lifts",
    description: "In this video, we are going to stand on one leg and lift the other leg. This should test your balance and hip strength.",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948239/Kids-N-Motion%20Videos/Leg_lifts_1_zaealj.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948314/Kidz-N-Motion%20Thumbnails/leg_lifts_em2etl.png",
  },
  // LEVEL 0
  great_job: {
    level: 0,
    title: "Great Job",
    description: "Great Job!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948228/Kids-N-Motion%20Videos/Great_job_1_uffxfx.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948312/Kidz-N-Motion%20Thumbnails/Great_job_mjoctd.png",
    id: "great_job",
  },
  // keep_it_up: {
  //   level: 0,
  //   title: "Keep It Up",
  //   description: "Keep It Up!",
  //   videoURL:
  //     "https://res.cloudinary.com/king-willy-studios/video/upload/v1659471969/KidsInMotion/Ex_Keep_it_Up_yrktik.mp4",
  //   previewPictureURL:
  //     "https://res.cloudinary.com/king-willy-studios/video/upload/v1659471969/KidsInMotion/Ex_Keep_it_Up_yrktik.jpg",
  //   id: "keep_it_up",
  // },

  // LEVEL 1
  hand_to_knees: {
    level: 1,
    title: "Hands And Knees",
    description:
      "In this video, we will start by laying straight on our stomachs with your knees and hand keeping you supported. Then, bring your hands to about your chest, and bring your legs in so that you are on all fours, your knees and palms keeping you supported! This will test your body and hip strength.",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948246/Kids-N-Motion%20Videos/Hand_to_knees_1_sngl4x.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948312/Kidz-N-Motion%20Thumbnails/hand_to_knees_ygdegd.png",
    id: "hand_to_knees",
  },
  chair_elevation: {
    level: 1,
    title: "Chair Pushup",
    description:
      "In this video, you will need to be seated on a chair that has armrests. Once you’re seated, try pushing off of the handles with your hands, and push your body up, so that your rear is no longer on the seat! This will test your upper body and hip strength.",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948253/Kids-N-Motion%20Videos/Chair_elevation_1_rmxp0k.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948312/Kidz-N-Motion%20Thumbnails/chair_elevation_ealjwh.png",
    id: "chair_elevation",
  },
  floor_to_stand: {
    level: 1,
    title: "Floor To Stand",
    description:
      "Here, we will start on our knees, and attempt to stand up without needing to grab onto something else. Try bringing your legs in, one at a time, and getting up on your feet!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644310/KidsInMotion/floor_to_stand_1_acj0jg.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948313/Kidz-N-Motion%20Thumbnails/floor_to_stand_cfjgyg.png",
    id: "floor_to_stand",
  },
  beam_balancing: {
    level: 2,
    title: "Beam Balancing",
    description:
      "In this exercise, you should try to use a balance beam, but if none are available that’s okay! Just try to find some marking or line on the floor, and walk as straight on this line as you can, without losing your balance or stepping off!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948248/Kids-N-Motion%20Videos/bean_balancing_1_j3tema.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948312/Kidz-N-Motion%20Thumbnails/Bean_balancing_ks8kz9.png",
    id: "beam_balancing",
  },

  // LEVEL 2
  jump_rope: {
    level: 2,
    title: "Jump Rope",
    description:
      "Here we will try to jump rope for 60 seconds! Keep a rhythm as you try to see how many times you can successfully jump over the rope in time!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948254/Kids-N-Motion%20Videos/Jump_rope_1_vkuk3n.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948314/Kidz-N-Motion%20Thumbnails/jump_rope_mdtgcm.png",
    id: "jump_rope",
  },
  jumping_jacks: {
    level: 2,
    title: "Jumping Jacks",
    description:
      "See if you can do jumping jacks for 60 seconds! This will test how well you can jump, as well as your coordination, endurance, and agility.",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948254/Kids-N-Motion%20Videos/Jumping_Jacks_1_dkxvno.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948314/Kidz-N-Motion%20Thumbnails/jumping_jacks_m3uf1m.png",
    id: "jumping_jacks",
  },
  jump_forward_and_backward: {
    level: 2,
    title: "Forward Jump",
    description:
      "In this video, we will see how well you can jump with both feet together, going forwards and then backward. This will put your jumping ability to the test, as well as your balance!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948245/Kids-N-Motion%20Videos/Jump_forward_and_back_1_jxtae9.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948314/Kidz-N-Motion%20Thumbnails/jump_forward_and_back_u7h14j.png",
    id: "jump_forward_and_backward",
  },
  hop_scotch: {
    level: 2,
    title: "Hop Scotch",
    description:
      "In this video, we will jump in a straight line. The first time we land, we will land on one foot, the next time, we will use both feet, and then one again! Try to match the video as best you can!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948244/Kids-N-Motion%20Videos/hop_scotch_1_ya6ee0.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948314/Kidz-N-Motion%20Thumbnails/hop_scotch_a770di.png",
    id: "hop_scotch",
  },
  bear_crawl: {
    level: 2,
    title: "Bear Crawl",
    description:
      "In this exercise, we will want to get on all fours, with both our feet and our palms on the ground. Like this, continue to walk forwards without losing balance or standing up!",
    videoURL:
      "https://res.cloudinary.com/king-willy-studios/video/upload/v1663948252/Kids-N-Motion%20Videos/bear_crawl_2_pnzwh7.mp4",
    previewPictureURL:
      "https://res.cloudinary.com/king-willy-studios/image/upload/v1663948312/Kidz-N-Motion%20Thumbnails/Bear_crawl_1_wymsmn.png",
    id: "bear_crawl"
  },
  // bear_crawl_right: {
  //   level: 2,
  //   title: "Bear Crawl (Right)",
  //   description:
  //     "In this exercise, we will want to get on all fours, with both our feet and our palms on the ground. Like this, continue to walk forwards without losing balance or standing up!",
  //   videoURL:
  //     "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644280/KidsInMotion/bear_crawl_alfyyy.mp4",
  //   previewPictureURL:
  //     "https://res.cloudinary.com/king-willy-studios/image/upload/v1660335545/KidsInMotionThumbnails/Bear_Crawl_1_nbno9g.png",
  //   id: "bear_crawl_right",
  // },
};

export default VIDEOS;
