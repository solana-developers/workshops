export type TokenLender = {
  "version": "0.1.0",
  "name": "token_lender",
  "instructions": [
    {
      "name": "createLoan",
      "accounts": [
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "loanEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lenderUsdcAta",
          "isMut": true,
          "isSigner": false
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
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "loanId",
          "type": "u8"
        },
        {
          "name": "depositUsdc",
          "type": "u64"
        },
        {
          "name": "expiryTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "acceptLoan",
      "accounts": [
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "loanNoteMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanNoteMintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "borrowerUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lender",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lenderLoanNoteMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pythAccount",
          "isMut": false,
          "isSigner": false
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
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "loanId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "returnFunds",
      "accounts": [
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "loanEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "borrowerUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "loanId",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeExpired",
      "accounts": [
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "loanNoteMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowLoanNoteMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lenderLoanNoteMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lenderUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
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
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "loanId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "closeReturned",
      "accounts": [
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "loanNoteMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowLoanNoteMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lenderLoanNoteMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lenderUsdcAta",
          "isMut": true,
          "isSigner": false
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
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "loanId",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "loanEscrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lender",
            "type": "publicKey"
          },
          {
            "name": "borrower",
            "type": "publicKey"
          },
          {
            "name": "deposit",
            "type": "u64"
          },
          {
            "name": "expiryTimestamp",
            "type": "u64"
          },
          {
            "name": "loanId",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "ReInitialize",
      "msg": "The config has already been initialized."
    },
    {
      "code": 6002,
      "name": "UnInitialize",
      "msg": "The config has not been initialized."
    },
    {
      "code": 6003,
      "name": "InvalidArgument",
      "msg": "Argument is invalid."
    },
    {
      "code": 6004,
      "name": "Overflow",
      "msg": "An overflow occurs."
    },
    {
      "code": 6005,
      "name": "PythError",
      "msg": "Pyth has an internal error."
    },
    {
      "code": 6006,
      "name": "PythOffline",
      "msg": "Pyth price oracle is offline."
    },
    {
      "code": 6007,
      "name": "LoanValueTooHigh",
      "msg": "The loan value is higher than the collateral value."
    },
    {
      "code": 6008,
      "name": "TryToSerializePriceAccount",
      "msg": "Program should not try to serialize a price account."
    }
  ]
};

export const IDL: TokenLender = {
  "version": "0.1.0",
  "name": "token_lender",
  "instructions": [
    {
      "name": "createLoan",
      "accounts": [
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "loanEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lenderUsdcAta",
          "isMut": true,
          "isSigner": false
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
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "loanId",
          "type": "u8"
        },
        {
          "name": "depositUsdc",
          "type": "u64"
        },
        {
          "name": "expiryTimestamp",
          "type": "u64"
        }
      ]
    },
    {
      "name": "acceptLoan",
      "accounts": [
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "loanNoteMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanNoteMintMetadata",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "borrowerUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lender",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lenderLoanNoteMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "pythAccount",
          "isMut": false,
          "isSigner": false
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
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "tokenMetadataProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "loanId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "returnFunds",
      "accounts": [
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "loanEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "borrower",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "borrowerUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "loanId",
          "type": "u8"
        },
        {
          "name": "amount",
          "type": "u64"
        }
      ]
    },
    {
      "name": "closeExpired",
      "accounts": [
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "loanNoteMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowLoanNoteMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lenderLoanNoteMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lenderUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "clock",
          "isMut": false,
          "isSigner": false
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
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "loanId",
          "type": "u8"
        }
      ]
    },
    {
      "name": "closeReturned",
      "accounts": [
        {
          "name": "usdcMint",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "loanNoteMint",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrow",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowLoanNoteMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "loanEscrowUsdcAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lender",
          "isMut": true,
          "isSigner": true
        },
        {
          "name": "lenderLoanNoteMintAta",
          "isMut": true,
          "isSigner": false
        },
        {
          "name": "lenderUsdcAta",
          "isMut": true,
          "isSigner": false
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
        },
        {
          "name": "tokenProgram",
          "isMut": false,
          "isSigner": false
        },
        {
          "name": "associatedTokenProgram",
          "isMut": false,
          "isSigner": false
        }
      ],
      "args": [
        {
          "name": "loanId",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "loanEscrow",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "lender",
            "type": "publicKey"
          },
          {
            "name": "borrower",
            "type": "publicKey"
          },
          {
            "name": "deposit",
            "type": "u64"
          },
          {
            "name": "expiryTimestamp",
            "type": "u64"
          },
          {
            "name": "loanId",
            "type": "u8"
          },
          {
            "name": "bump",
            "type": "u8"
          }
        ]
      }
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "Unauthorized",
      "msg": "You are not authorized to perform this action."
    },
    {
      "code": 6001,
      "name": "ReInitialize",
      "msg": "The config has already been initialized."
    },
    {
      "code": 6002,
      "name": "UnInitialize",
      "msg": "The config has not been initialized."
    },
    {
      "code": 6003,
      "name": "InvalidArgument",
      "msg": "Argument is invalid."
    },
    {
      "code": 6004,
      "name": "Overflow",
      "msg": "An overflow occurs."
    },
    {
      "code": 6005,
      "name": "PythError",
      "msg": "Pyth has an internal error."
    },
    {
      "code": 6006,
      "name": "PythOffline",
      "msg": "Pyth price oracle is offline."
    },
    {
      "code": 6007,
      "name": "LoanValueTooHigh",
      "msg": "The loan value is higher than the collateral value."
    },
    {
      "code": 6008,
      "name": "TryToSerializePriceAccount",
      "msg": "Program should not try to serialize a price account."
    }
  ]
};
