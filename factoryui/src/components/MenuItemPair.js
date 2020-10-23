import JSONKeyPath   from 'json-keypath';

import MenuItemSet   from "./MenuItemSet";
import MenuItemValue from "./MenuItemValue";
import MenuItemRange from "./MenuItemRange";

import { gDataModel } from '../DataModel';

import {  COLOR_BG, COLOR_HILITE,
          ITEM_W,  ITEM_H, ITEM_W2
       } from './Globals';

export default class MenuItemPair extends lng.Component
{
    static _template( )
    {
      return {
          w: ITEM_W, h: ITEM_H,

          Label:
          {
            type: MenuItemValue,
            item: {
              w: ITEM_W2,
              x: 0
            }
          },

          Value:
          {
            w: ITEM_W2,
            x: ITEM_W2,
                  flex: { direction: 'row' },
              flexItem: { maxWidth: ITEM_W2, minHeight: ITEM_H },
              children: [],
          },
        }
    }

    set background(clr)
    {
      this.color = clr;
    }

    _focus()
    {
      this.background = COLOR_HILITE;
    }

    _unfocus()
    {
      this.background = COLOR_BG;
    }

    _getFocused()
    {
      return this.tag("Value").children[0];
    }

    _init()
    {

      var  key = this.pair["Key"]
      var  obj = this.tag("Label")
      let data = this.pair["data"]
      let  rpc = key["Rpc"];

      let rpcNode = rpc;

      // console.log(">>>>>>>>>>>>   MenuItemPair:: this._id >> " +  this._id);

      if(data != undefined)
      {
        // Find RPC object for this GUI reference
        //
        rpc = JSONKeyPath.getValue(data, rpc);
      }

      var widget = null;

      if(obj)
      {
        obj.label = key["Text"];      // KEY
      }

      var val    = this.pair["Value"]
      var tagged = this.tag("Value")

      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // VALUES
      //
      if(val.Values != undefined || (rpc && rpc.Values != undefined))
      {
        let valueSet = val.Values || rpc.Values ;
              widget = this.application.stage.c( {
                                                  type: MenuItemSet,
                                               signals: {
                                          valueChanged: '_valueChanged'
                                        },
                                        valueSet });

        tagged.childList.add( widget );
      }
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // RANGE
      //
      else
      if(  key.Range != undefined || (rpc && rpc.Range != undefined))
      {
        let rangeSet      =  key.Range || rpc.Range;
        rangeSet["Value"] = val["Value"] || 0;

       // console.log("RANGE >>  rangeSet: " + JSON.stringify(rangeSet) )

        widget = this.application.stage.c( {
                                                  type: MenuItemRange,
                                               signals: {
                                          valueChanged: '_valueChanged'
                                        },
                                        rangeSet });

        tagged.childList.add( widget );
      }
      else
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
      // VALUE
      //
      {
        // Single Item
        let valueSet = [ val ] // VALUE
              widget = this.application.stage.c( {
                                        type: MenuItemSet,
                                        signals: {
                                          valueChanged: '_valueChanged'
                                        },
                                        valueSet   });

        tagged.childList.add( widget );
      }
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

      if(rpcNode != undefined)
      {
        widget.rpcNode = rpcNode;
        //console.log(">>>>>>>>>>>>   widget.rpcNode = " + widget.rpcNode);
      }

      // Initial Update via RPC
      if(rpc)
      {
        gDataModel.addDataItem(rpc,    rpcNode); // initial update
        gDataModel.addListener(rpcNode, widget);

        rpc.rpcNode = rpcNode; // CREATE NODE REFERENCE
      }
      // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

    }//init()

    _valueChanged(obj)
    {
      // console.log( " #####  >> valueChanged() - ENTER   obj: " + obj)
      // console.log( " #####  >> valueChanged()  obj: " + JSON.stringify(obj))

      var key = this.pair["Key"]

      if(key["Rpc"])
      {
        let rpc  = key["Rpc"];
        let text = key["Text"];
        let data = this.pair["data"]

        if(data != undefined)
        {
          // Find RPC object (GET, SET, Range, rpcNode, etc ...) for this GUI reference
          //
          rpc = JSONKeyPath.getValue(data, rpc);
        }

       // console.log("FIRE key >> " + JSON.stringify(key) )

        this.fireAncestors('$fireValueSET',
                            {   "rpc": rpc,
                                "key": text,
                              "value": obj.value } );
      }
      else
      {
        console.log("PAIR >> no RPC")
      }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////////
  }//CLASS
