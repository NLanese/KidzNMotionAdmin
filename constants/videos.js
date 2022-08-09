
// Cloudinary Video Files
const VIDEOS = {
    jumping_jacks: {
        level: 1,
        title: "Jumping Jacks",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644358/KidsInMotion/Jumping_Jacks_iyyksv.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644358/KidsInMotion/Jumping_Jacks_iyyksv.jpg"
    },
    jump_rope: {
        level: 1,
        title: "Jump Rope",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644347/KidsInMotion/Jump_Rope_q8yzht.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644347/KidsInMotion/Jump_Rope_q8yzht.jpg",
    },
    jump_forward_and_backward: {
        level: 1,
        title: "Jump Forward & Backward",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644338/KidsInMotion/Jump_forward_and_back_bykc0a.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644338/KidsInMotion/Jump_forward_and_back_bykc0a.jpg",
    },
    hop_scotch: {
        level: 1,
        title: "Hop Scotch",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644329/KidsInMotion/hop_scotch_rzcrpf.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644329/KidsInMotion/hop_scotch_rzcrpf.jpg",
    },
    hand_to_knees: {
        level: 1,
        title: "Hands To Knees",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644321/KidsInMotion/Hand_to_knees_onxqus.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644321/KidsInMotion/Hand_to_knees_onxqus.jpg",
    },
    great_job: {
        level: 1,
        title: "Great Job",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644315/KidsInMotion/Great_Job_r6rnz6.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644315/KidsInMotion/Great_Job_r6rnz6.jpg",
    },

    chair_elevation: {
        level: 1,
        title: "Chair Elevation",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644300/KidsInMotion/Chair_elevation_eexwmh.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644300/KidsInMotion/Chair_elevation_eexwmh.jpg",
    },
    floor_to_stand: {
        level: 1,
        title: "Floor To Stand",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644310/KidsInMotion/floor_to_stand_1_acj0jg.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644310/KidsInMotion/floor_to_stand_1_acj0jg.jpg",
    },
    bear_crawl_right: {
        level: 1,
        title: "Bear Crawl (Right)",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644280/KidsInMotion/bear_crawl_alfyyy.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644272/KidsInMotion/Bear_Crawl_1_hzeetg.jpg",
    },
    bear_crawl_left: {
        level: 1,
        title: "Bear Crawl (Left)",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644272/KidsInMotion/Bear_Crawl_1_hzeetg.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644280/KidsInMotion/bear_crawl_alfyyy.jpg",
    },
    bean_balancing: {
        level: 1,
        title: "Bean Balancing",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644263/KidsInMotion/bean_balancing_ylbyd9.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659644263/KidsInMotion/bean_balancing_ylbyd9.jpg",
    },
    keep_it_up: {
        level: 1,
        title: "Keep It Up",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
        videoURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659471969/KidsInMotion/Ex_Keep_it_Up_yrktik.mp4",
        previewPictureURL: "https://res.cloudinary.com/king-willy-studios/video/upload/v1659471969/KidsInMotion/Ex_Keep_it_Up_yrktik.jpg",
    },

}

export default VIDEOS