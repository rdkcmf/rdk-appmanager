
export const SCREEN = {
  w: 1920,
  h: 1080,
  precision: 1.0
};

export const isDEBUG = true;
export const GLOBAL =
{
  isAGING: false
}

export const ALL_PLUGINS_KEYPATH  = "RPC.AllPlugins"

export const COLOR_BG         = 0xFF0000ff // #0000ff
export const COLOR_BG2        = 0xFF000080 // #0000c0
export const COLOR_HILITE     = 0xFFffda5b // #ffda5b

// export const COLOR_BG         = 0xff2a4d69 // #2a4d69
// export const COLOR_BG2        = 0xff4b86b4 // #4b86b4
// export const COLOR_HILITE     = 0xffadcbe3 // #adcbe3

// export const COLOR_BG         = 0xFF8a307f // #8a307f,
// export const COLOR_BG2        = 0xFF6883bc // #6883bc
// export const COLOR_HILITE     = 0xFF79a7d3 // #79a7d3,

// export const COLOR_BG2        = 0xFF3b4d61 // #3b4d61
// export const COLOR_BG         = 0xFF6b7b8c // #6b7b8c
// export const COLOR_HILITE     = 0xFFef9d10 // #ef9d10

export const TAB_W            = 200
export const TAB_H            = 46

export const ITEM_W           = SCREEN.w/2
export const ITEM_H           = 46

export const ITEM_W2          = ITEM_W/2
export const ITEM_H2          = ITEM_H/2

export var   TAB_FONT_PTS     = 33; // 33
export var   TAB_FONT_PTS_lo  = 24;

export const TAB_FONT_COLOR   = 0xFFffffff;  // #ffffffFF

export var   MENU_FONT_PTS    = 31; // 33
export var   MENU_FONT_PTS_lo = 24;

export const MENU_FONT_COLOR  = 0xFFffffff;  // #ffffffFF

export const shdw             = {
                                shadow: true,   // <<< TRUE / FALSE
                                shadowColor: 0xFF000000,
                                shadowOffsetX: 1,
                                shadowOffsetY: 1,
                                shadowBlur: 0,
                              }

export const PSTORE_NAMESPACE = 'FactoryTest' // same as appears in Data.json
export const DWELL_MS         = 500; // milliseconds

export const KEYS =  // hfr = "Hisense Factory Remote"
{
  'hfr_DMP':    0x30, // 48,   "modifiers": ["alt"] }}, // DMP
  'hfr_STOP':   0x31, // 49,   "modifiers": ["alt"] }}, // STOP
  'hfr_TV':     0x32, // 50,   "modifiers": ["alt"] }}, // TV
  'hfr_SOURCE': 0x33, // 51,   "modifiers": ["alt"] }}, // SOURCE
  'hfr_IMAGE':  0x34, // 52,   "modifiers": ["alt"] }}, // IMAGE
  'hfr_ZOOM':   0x35, // 53,   "modifiers": ["alt"] }}, // ZOOM
  'hfr_OK':     0x36, // 54,   "modifiers": ["alt"] }}, // OK
  'hfr_MAC':    0x37, // 55,   "modifiers": ["alt"] }}, // MAC
  'hfr_IP':     0x38, // 56,   "modifiers": ["alt"] }}, // IP
  'hfr_AV':     0x39, // 57,   "modifiers": ["alt"] }}, // AV
  'hfr_AGING':  0x41, // 65,   "modifiers": ["alt"] }}, // AGING
  'hfr_SCREEN': 0x42, // 66,   "modifiers": ["alt"] }}, // SCREEN
  'hfr_BAL':    0x43, // 67,   "modifiers": ["alt"] }}, // BAL
  'hfr_LOGO':   0x44, // 68,   "modifiers": ["alt"] }}, // LOGO
  'hfr_F1':     0x45, // 69,   "modifiers": ["alt"] }}, // F1
  'hfr_F2':     0x46, // 70,   "modifiers": ["alt"] }}, // F2
  'hfr_F3':     0x47, // 71,   "modifiers": ["alt"] }}, // F3
  'hfr_F4':     0x48, // 72,   "modifiers": ["alt"] }}, // F4
  'hfr_F5':     0x49, // 73,   "modifiers": ["alt"] }}, // F5
  'hfr_F6':     0x4A, // 74,   "modifiers": ["alt"] }}, // F6
  'hfr_F7':     0x4B, // 75,   "modifiers": ["alt"] }}, // F7
  'hfr_M':      0x4C, // 76,   "modifiers": ["alt"] }}, // M key
  'hfr_HDMI':   0x4D, // 77,   "modifiers": ["alt"] }}, // HDMI
  'hfr_ENERGY': 0x4E, // 78,   "modifiers": ["alt"] }}, // ENERGY
  'hfr_ADC':    0x4F, // 79,   "modifiers": ["alt"] }}, // ADC
  'hfr_3D':     0x50, // 80,   "modifiers": ["alt"] }}, // 3D
  'hfr_PC':     0x51, // 81,   "modifiers": ["alt"] }}, // PC
  'hfr_COM':    0x52, // 82,   "modifiers": ["alt"] }}  // COM
}


export const isCtrlOnly = function(k)
{
  return (k.ctrlKey && !k.altKey && !k.shiftKey)
}


export const isCtrlKeyCode = function(k, key)
{
  if( isCtrlOnly(k) )
  {
    if(k.keyCode == key)
    {
      return true
    }
  }

  return false
}


export const isAltOnly = function(k)
{
  return (!k.ctrlKey && k.altKey && !k.shiftKey)
}

export const isAltKeyCode = function(k, key)
{
  if( isAltOnly(k) )
  {
    if(k.keyCode == key)
    {
      return true
    }
  }

  return false
}
