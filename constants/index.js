export const sidebarLinks = [
  {
    imgURL: "/assets/svg/list.svg",
    route: "/evaluation",
    label: "Evaluation",
    isDropDown: true,
    items: [
      {
        imgURL: "/assets/svg/users.svg",
        route: "/pis/staffs",
        label: "Staff List",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/marks.svg",
        route: "/evaluation/marks",
        label: "Marks Analysis",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/average.svg",
        route: "/evaluation/average",
        label: "Marks Average",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/service.svg",
        route: "/evaluation/service",
        label: "Service Period",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/appraisal.svg",
        route: "/evaluation/appraisal",
        label: "Promotion Record",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/education.svg",
        route: "/evaluation/education",
        label: "Education Record",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/report.svg",
        route: "/evaluation/final",
        label: "Final Evaluation",
        showDivider: true,
      },
      {
        imgURL: "/assets/svg/attendance.svg",
        route: "/evaluation/leave",
        label: "Attendance Record",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/appreciate.svg",
        route: "/evaluation/appreciation",
        label: "Appreciation Record",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/warning.svg",
        route: "/evaluation/warning",
        label: "Warning Record",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/scale.svg",
        route: "/evaluation/adminavg",
        label: "Admin Average",
        showDivider: true,
      }
    ]
  },
  {
    imgURL: "/assets/svg/user.svg",
    route: "/pis",
    label: "PIS",
    isDropDown: true,
    items: [
      {
        imgURL: "/assets/svg/device-log.svg",
        route: "/pis/attendance",
        label: "Device Log",
        showDivider: true,
      },
      {
        imgURL: "/assets/svg/users.svg",
        route: "/pis/staffs",
        label: "Staff List",
        showDivider: false,
      }
    ],
  },
  {
    imgURL: "/assets/svg/tracking.svg",
    route: "/transfer",
    label: "Tracking",
    isDropDown: false,
    items: [],
  },
  {
    imgURL: "/assets/svg/gear.svg",
    route: "/config",
    label: "Setup",
    isDropDown: true,
    items: [
      {
        imgURL: "/assets/svg/user.svg",
        route: "/config/user",
        label: "Users",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/department.svg",
        route: "/config/department",
        label: "Departments",
        showDivider: true,
      },
      {
        imgURL: "/assets/svg/product.svg",
        route: "/config/product",
        label: "Products",
        showDivider: true,
      },
      {
        imgURL: "/assets/svg/scale.svg",
        route: "/evaluation/setup/weight",
        label: "Weight Update",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/criterias.svg",
        route: "/evaluation/setup/criterias",
        label: "Criteria Update",
        showDivider: false,
      },
      {
        imgURL: "/assets/svg/eligible.svg",
        route: "/evaluation/setup/eligibility",
        label: "Eligibility Update",
        showDivider: false,
      }
    ],
  },
  // {
  //   imgURL: "/assets/search.svg",
  //   route: "/search",
  //   label: "Search",
  // },
  // {
  //   imgURL: "/assets/heart.svg",
  //   route: "/activity",
  //   label: "Activity",
  // },
  // {
  //   imgURL: "/assets/create.svg",
  //   route: "/create-thread",
  //   label: "Create Thread",
  // },
  // {
  //   imgURL: "/assets/community.svg",
  //   route: "/communities",
  //   label: "Communities",
  // },
  // {
  //   imgURL: "/assets/user.svg",
  //   route: "/profile",
  //   label: "Profile",
  // },
];

export const topbarLinks = [
  {
    imgURL: "/assets/home.svg",
    route: "/",
    label: "Home",
  },
  {
    imgURL: "/assets/members.svg",
    route: "/pis",
    label: "PIS",
  },
];

export const profileTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "replies", label: "Replies", icon: "/assets/members.svg" },
  { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
];

export const communityTabs = [
  { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
  { value: "members", label: "Members", icon: "/assets/members.svg" },
  { value: "requests", label: "Requests", icon: "/assets/request.svg" },
];