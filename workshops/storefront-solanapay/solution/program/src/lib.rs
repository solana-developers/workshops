use {
    borsh::{ 
        BorshDeserialize, 
        BorshSerialize 
    },
    solana_program::{
        account_info::{AccountInfo, next_account_info}, 
        entrypoint,
        entrypoint::ProgramResult, 
        msg,
        program::invoke_signed,
        program_error::ProgramError,
        pubkey::Pubkey,
        system_instruction,
        sysvar::rent::Rent,
        sysvar::Sysvar,
    },
};

#[derive(BorshDeserialize, BorshSerialize)]
pub struct PizzaOrder {
    pub order: u8,
    pub pepperoni: u8,
    pub mushrooms: u8,
    pub olives: u8,
}

pub fn create_pizza_order(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    pizza_order: PizzaOrder,
) -> ProgramResult {

    let accounts_iter = &mut accounts.iter();
    let pizza_order_account = next_account_info(accounts_iter)?;
    let payer = next_account_info(accounts_iter)?;
    let system_program = next_account_info(accounts_iter)?;

    let (pizza_order_pda, pizza_order_bump) = Pubkey::find_program_address(
        &[
            "solami_pizza".as_bytes().as_ref(),
            pizza_order.order.to_le_bytes().as_ref(),
            payer.key.as_ref(),
        ],
        program_id,
    );
    assert!(pizza_order_account.key == &pizza_order_pda);

    let account_span = (pizza_order.try_to_vec()?).len();
    let lamports_required = (Rent::get()?).minimum_balance(account_span);

    msg!("Order Pubkey: {}", pizza_order_account.key);
    msg!("Order: {}", pizza_order.order);

    invoke_signed(
        &system_instruction::create_account(
            &payer.key,
            &pizza_order_account.key,
            lamports_required,
            account_span as u64,
            program_id,
        ),
        &[
            payer.clone(), pizza_order_account.clone(), system_program.clone()
        ],
        &[&[
            "solami_pizza".as_bytes().as_ref(),
            pizza_order.order.to_le_bytes().as_ref(),
            payer.key.as_ref(),
            &[pizza_order_bump],
        ]]
    )?;
    
    pizza_order.serialize(&mut &mut pizza_order_account.data.borrow_mut()[..])?;
    Ok(())
}

pub fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {

    match PizzaOrder::try_from_slice(&instruction_data) {
        Ok(pizza_order) => return create_pizza_order(program_id, accounts, pizza_order),
        Err(_) => {},
    };

    Err(ProgramError::InvalidInstructionData)
}

entrypoint!(process_instruction);