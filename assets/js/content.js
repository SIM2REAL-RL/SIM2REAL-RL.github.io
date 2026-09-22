/**
 * 网站文字、任务与真实结果。可直接编辑，不需要编译。
 * 结果缺失必须使用 null，不能用 0 代替。
 * 结果格式：{ successes: 成功次数, trials: 测试次数 }。
 * 所有视频默认由 tools/prepare.py 写入 media-index.js。
 * 也可在某一任务的 media 中手动写相对路径，例如：
 * media: { ours: { real: "assets/videos/pick-cube/ours-real.mp4" } }
 * 请勿填入个人主页、非匿名仓库或未验证的实验结论。
 */
window.SITE_CONTENT = {
  "title": "Sim2Real-RL",
  "subtitle": "Efficient Visual Reinforcement Learning for Zero-Shot Embodied Manipulation",
  "venue": "ICLR 2027 · Anonymous submission",
  "authors": "Anonymous Authors",
  "codeUrl": "",
  "featuredTask": "push-t",
  "evaluationNote": "",
  "methods": [
    {
      "id": "ours",
      "name": "Sim2Real-RL",
      "short": "Ours",
      "description": "Our method"
    },
    {
      "id": "squint",
      "name": "Squint",
      "short": "Squint",
      "description": "Off-policy visual RL"
    },
    {
      "id": "ppo",
      "name": "LeRobot/PPO",
      "short": "LeRobot/PPO",
      "description": "Direct on-policy visual RL"
    },
    {
      "id": "bc",
      "name": "BC",
      "short": "BC",
      "description": "Behavioral cloning student"
    },
    {
      "id": "dagger",
      "name": "DAgger",
      "short": "DAgger",
      "description": "Interactive imitation student"
    }
  ],
  "tasks": [
    {
      "id": "pick-cube",
      "number": "01",
      "name": "Pick Cube",
      "category": "Grasping",
      "description": "Lift a cube from the table.",
      "icon": "cube",
      "media": {},
      "results": {
        "ours": null,
        "squint": null,
        "ppo": null,
        "bc": null,
        "dagger": null
      }
    },
    {
      "id": "push-t",
      "number": "02",
      "name": "PushT",
      "category": "Non-prehensile",
      "description": "Push a T-shaped object toward a fixed target pose.",
      "icon": "push",
      "media": {},
      "results": {
        "ours": null,
        "squint": null,
        "ppo": null,
        "bc": null,
        "dagger": null
      }
    },
    {
      "id": "stack-cube",
      "number": "03",
      "name": "Stack Cube",
      "category": "Precision placement",
      "description": "Place one cube on top of another.",
      "icon": "stack",
      "media": {},
      "results": {
        "ours": null,
        "squint": null,
        "ppo": null,
        "bc": null,
        "dagger": null
      }
    },
    {
      "id": "drawer-opening",
      "number": "04",
      "name": "Drawer Opening",
      "category": "Articulated interaction",
      "description": "Open a drawer through robot–object interaction.",
      "icon": "drawer",
      "media": {},
      "results": {
        "ours": null,
        "squint": null,
        "ppo": null,
        "bc": null,
        "dagger": null
      }
    },
    {
      "id": "hanger-placement",
      "number": "05",
      "name": "Hanger Placement",
      "category": "Object placement",
      "description": "Place a hanger on its support.",
      "icon": "hanger",
      "media": {},
      "results": {
        "ours": null,
        "squint": null,
        "ppo": null,
        "bc": null,
        "dagger": null
      }
    },
    {
      "id": "door-opening",
      "number": "06",
      "name": "Door Opening",
      "category": "Articulated interaction",
      "description": "Open a door through articulated interaction.",
      "icon": "door-open",
      "media": {},
      "results": {
        "ours": null,
        "squint": null,
        "ppo": null,
        "bc": null,
        "dagger": null
      }
    },
    {
      "id": "door-closing",
      "number": "07",
      "name": "Door Closing",
      "category": "Articulated interaction",
      "description": "Move an open door into its closed configuration.",
      "icon": "door-close",
      "media": {},
      "results": {
        "ours": null,
        "squint": null,
        "ppo": null,
        "bc": null,
        "dagger": null
      }
    }
  ]
};
