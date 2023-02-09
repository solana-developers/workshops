export type PizzaProgram = {
  "version": "0.1.0",
  "name": "pizza_program",
  "instructions": [
    {
      "name": "createPizzaOrder",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pizzaOrder",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "solami_pizza"
              },
              {
                "kind": "arg",
                "type": "u8",
                "path": "order"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "order",
          "type": "u8"
        },
        {
          "name": "pepperoni",
          "type": "u8"
        },
        {
          "name": "mushrooms",
          "type": "u8"
        },
        {
          "name": "olives",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pizzaOrder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "order",
            "type": "u8"
          },
          {
            "name": "pepperoni",
            "type": "u8"
          },
          {
            "name": "mushrooms",
            "type": "u8"
          },
          {
            "name": "olives",
            "type": "u8"
          }
        ]
      }
    }
  ]
};

export const IDL: PizzaProgram = {
  "version": "0.1.0",
  "name": "pizza_program",
  "instructions": [
    {
      "name": "createPizzaOrder",
      "accounts": [
        {
          "name": "payer",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "pizzaOrder",
          "isMut": true,
          "isSigner": false,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "type": "string",
                "value": "solami_pizza"
              },
              {
                "kind": "arg",
                "type": "u8",
                "path": "order"
              },
              {
                "kind": "account",
                "type": "publicKey",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "rent",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "systemProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "order",
          "type": "u8"
        },
        {
          "name": "pepperoni",
          "type": "u8"
        },
        {
          "name": "mushrooms",
          "type": "u8"
        },
        {
          "name": "olives",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "pizzaOrder",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "order",
            "type": "u8"
          },
          {
            "name": "pepperoni",
            "type": "u8"
          },
          {
            "name": "mushrooms",
            "type": "u8"
          },
          {
            "name": "olives",
            "type": "u8"
          }
        ]
      }
    }
  ]
};
