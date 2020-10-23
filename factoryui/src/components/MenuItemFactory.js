import MenuListTab   from './MenuListTab';
import MenuItemSub   from "./MenuItemSub";
import MenuItemPair  from "./MenuItemPair";
import MenuItemValue from "./MenuItemValue";

import { ITEM_W, ITEM_H } from './Globals';

export default class MenuItemFactory
{
  static createItem(item)
  {
    var rc = null

    switch(item.Type)
    {
      // - - - - - - - - - - - - - - - - - -
      case "tab":
        let tabItem = item;

        rc = {
          type: MenuListTab,
          tabItem
        };
      break;
      // - - - - - - - - - - - - - - - - - -
      case "menu":
        rc = {
          type: MenuItemValue,
          item
        };
      break;
      // - - - - - - - - - - - - - - - - - -
      case "submenu":
        rc = {
          type: MenuItemSub,
          item
        };
      break;
      // - - - - - - - - - - - - - - - - - -
      case "kvpair":
      {
        let data = item.data
        let pair = item.Row

        if(pair != undefined)
        {
          pair.data = data;
        }

        rc = {
          type: MenuItemPair,
          pair
        };
      }
      break;
      // - - - - - - - - - - - - - - - - - -
      case "label":
        rc = {
          type: MenuItemValue,
          item
        };
      break;
      // - - - - - - - - - - - - - - - - - -
      default:
        console.log("MENU TAB >>> DEFAULT:  item.Type: " + item.Type)
        rc = {
          w: ITEM_W, h: ITEM_H,
          rect: true,
          color: 0x88ff0000,  // RED
        };
    }//SWITCH

    return rc;
  }
}//CLASS
