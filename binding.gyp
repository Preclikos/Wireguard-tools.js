{
  "target_defaults": {
    "cflags!": [ "-fno-exceptions" ],
    "cflags_cc!": [ "-fno-exceptions" ],
    "defines": [
      "NAPI_DISABLE_CPP_EXCEPTIONS"
    ],
    "conditions": [
      ["OS=='win'", {
        "defines": [
          "_HAS_EXCEPTIONS=1"
        ],
        "msvs_settings": {
          "VCCLCompilerTool": {
            "ExceptionHandling": 1
          },
        },
      }],
      ["OS=='mac'", {
        "xcode_settings": {
          "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
        },
      }],
    ],
    "include_dirs": [
      "<!(node -p \"require('node-addon-api').include_dir\")"
    ],
    "cflags": [
      "-fpermissive",
      "-fexceptions",
      "-w",
      "-fpermissive",
      "-fPIC",
      "-static"
    ],
    "cflags_cc": [
      "-fpermissive",
      "-fexceptions",
      "-w",
      "-fpermissive",
      "-fPIC",
      "-static"
    ]
  },
  "targets": [
    {
      "target_name": "wginterface",
      "include_dirs": [
        "addons/genKey",
        "addons/tools"
      ],
      "sources": [
        "addons/genKey/wgkeys.cpp",
        "addons/tools/wginterface.cpp"
      ],
      "conditions": [
        ["OS=='linux'", {
          "defines": [
            "LISTDEV",
            "GETCONFIG",
            "SETCONFIG",
            "DELIFACE"
          ],
          "sources": [
            "addons/tools/linux/wireguard.c",
            "addons/tools/wginterface-linux.cpp"
          ]
        }],
        ["OS=='mac'", {
          "cflags!": [ "-fno-exceptions" ],
          "cflags_cc!": [ "-fno-exceptions" ],
          "cflags_cc": [ "-fexceptions" ],
          "cflags": [ "-fexceptions" ],
          "xcode_settings": {
            "GCC_ENABLE_CPP_EXCEPTIONS": "YES"
          }
        }],
        ["OS=='win'", {
          "include_dirs": [
            "addons/tools/win"
          ],
          "defines": [
            "ONSTARTADDON",
            "LISTDEV",
            "GETCONFIG",
            "SETCONFIG",
            "DELIFACE"
          ],
          "libraries": [
            "bcrypt.lib",
            "crypt32.lib",
            "iphlpapi.lib",
            "kernel32.lib",
            "ntdll.lib",
            "ws2_32.lib",
            "setupapi.lib"
          ],
          "sources": [
            "addons/tools/wginterface-win.cpp"
          ]
        }],
        ["OS not in 'linux win'", {
          "sources": [
            "addons/tools/wginterface-dummy.cpp"
          ]
        }]
      ]
    }
  ]
}