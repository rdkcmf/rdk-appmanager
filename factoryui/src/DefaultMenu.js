export const DefaultMenu =
[
  {
    "Type": "tab",
    "Text": "Factory",
    "Items":
    [
      {
        "Type": "menu",
        "Text": "Menu Item 1",
        "Align": "center",
        "Callback": "com.callme.function1",
        "Params": [
          {"cfg1" : "value1"}
        ]
      },
      {
        "Type": "menu",
        "Text": "Menu Item 2",
        "Align": "center",
        "Callback": "DoMenu2"
      },
      {
        "Type": "menu",
        "Text": "Menu Item 3",
        "Align": "center",
        "Callback": "DoMenu3"
      },
      {
        "Type": "menu",
        "Text": "Menu Item 4",
        "Align": "center",
        "Callback": "DoMenu4"
      },
      {
        "Type": "menu",
        "Text": "Menu Item 5",
        "Align": "center",
        "Callback": "DoMenu5"
      },
      {
        "Type": "menu",
        "Text": "Menu Item 6",
        "Align": "center",
        "Callback": "DoMenu6"
      },
      {
        "Type": "menu",
        "Text": "Menu Item 7",
        "Align": "center",
        "Callback": "DoMenu7"
      },
      {
        "Type": "menu",
        "Text": "Menu Item 8",
        "Align": "center",
        "Callback": "DoMenu8"
      },
      {
        "Type": "menu",
        "Text": "Menu Item 9",
        "Align": "center",
        "Callback": "DoMenu9"
      },
      {
        "Type": "kvpair",
        "Row":
        [
          {
            "Type": "label",
            "Text": "Label 1",
            "Align": "center"
          },
          {
            "Type": "label",
            "Text": "Value 1",
            "Align": "center"
          }
        ]
      },
      {
        "Type": "kvpair",
        "Row":
        [
          {
            "Type": "label",
            "Text": "Label 2",
            "Align": "center"
          },
          {
            "Type": "label",
            "Text": "Value 2",
            "Align": "center"
          }
        ]
      }
    ],
  },
  {
    "Type": "tab",
    "Text": "Design",
    "Items":
    [
      {
        "Type": "menu",
        "Text": "Menu Item A",
        "Align": "center"
      },
      {
        "Type": "submenu",
        "Text": "Submenu Item B",
        "Align": "center",
        "SubItems":
        [
          {
            "Type": "label",
            "Text": "Sub Item A",
            "Align": "center"
          },
          {
            "Type": "label",
            "Text": "Sub Item B",
            "Align": "center"
          },
          {
            "Type": "label",
            "Text": "Sub Item C",
            "Align": "center"
          },
          {
            "Type": "label",
            "Text": "Sub Item D",
            "Align": "center"
          },
        ]
      },
      {
        "Type": "menu",
        "Text": "Menu Item C",
        "Align": "center"
      },
      {
        "Type": "menu",
        "Text": "Menu Item D",
        "Align": "center"
      },
      {
        "Type": "menu",
        "Text": "Menu Item E",
        "Align": "center"
      },
      {
        "Type": "menu",
        "Text": "Menu Item F",
        "Align": "center"
      },
      {
        "Type": "menu",
        "Text": "Menu Item G",
        "Align": "center"
      },
      {
        "Type": "menu",
        "Text": "Menu Item H",
        "Align": "center"
      },
      {
        "Type": "kvpair",
        "Row":
        [
          {
            "Type": "label",
            "Text": "Label I",
            "Align": "center"
          },
          {
            "Type": "value",
            "Text": "Value I",
            "Align": "center"
          }
        ]
      }
    ]
  }
];
